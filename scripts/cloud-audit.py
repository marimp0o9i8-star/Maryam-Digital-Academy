#!/usr/bin/env python3
"""Read-only metadata audit of the owner's existing Firebase project.

Python standard library + an already authorized gcloud session only. No installs,
API enabling, database documents, user lists, deployments or permission changes.
The only POST is Google's read-only projects.getIamPolicy operation.
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

PROJECT = "elite-implement-hxnr0"
DATABASE = "ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964"
ROOT = f"projects/{PROJECT}"
HOSTS = {"firebaserules.googleapis.com", "firebase.googleapis.com",
         "identitytoolkit.googleapis.com", "firestore.googleapis.com",
         "cloudresourcemanager.googleapis.com"}


class AuditError(Exception):
    pass


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise AuditError("API_REDIRECT_REFUSED")


def gcloud(*args):
    env = dict(os.environ, CLOUDSDK_CORE_DISABLE_PROMPTS="1",
               CLOUDSDK_CORE_LOG_HTTP="false")
    try:
        result = subprocess.run(["gcloud", *args, "--quiet"], capture_output=True,
                                text=True, timeout=60, env=env)
    except (OSError, subprocess.TimeoutExpired):
        raise AuditError("GCLOUD_UNAVAILABLE_OR_TIMEOUT") from None
    if result.returncode:
        # stderr may contain credentials or personal identifiers; never export it.
        raise AuditError("GCLOUD_READ_FAILED_CHECK_SIGN_IN_AND_PERMISSIONS")
    return result.stdout.strip()


class Client:
    def __init__(self, token):
        self.token = token
        self.opener = urllib.request.build_opener(NoRedirect())

    def get(self, host, path, query=None, policy=False):
        method = "POST" if policy else "GET"
        if host not in HOSTS or not path.startswith("/"):
            raise AuditError("UNAPPROVED_API")
        if policy and (host != "cloudresourcemanager.googleapis.com" or
                       path != f"/v1/{ROOT}:getIamPolicy"):
            raise AuditError("WRITE_REFUSED")
        url = "https://" + host + path
        if query:
            url += "?" + urllib.parse.urlencode(query)
        body = b'{"options":{"requestedPolicyVersion":3}}' if policy else None
        req = urllib.request.Request(url, data=body, method=method, headers={
            "Authorization": "Bearer " + self.token,
            "Content-Type": "application/json"})
        try:
            with self.opener.open(req, timeout=25) as response:
                raw = response.read(4_000_001)
            if len(raw) > 4_000_000:
                raise AuditError("API_RESPONSE_TOO_LARGE")
            data = json.loads(raw)
            if not isinstance(data, dict):
                raise AuditError("INVALID_API_RESPONSE")
            return data
        except urllib.error.HTTPError as error:
            # Record only status, never response bodies that might contain secrets.
            raise AuditError(f"HTTP_{error.code}") from None
        except (urllib.error.URLError, TimeoutError, OSError, ValueError):
            raise AuditError("API_NETWORK_OR_FORMAT_ERROR") from None

    def pages(self, host, path, key):
        items, page, seen = [], "", set()
        for _ in range(30):
            query = {"pageSize": 100}
            if page:
                query["pageToken"] = page
            data = self.get(host, path, query)
            items.extend(data.get(key, []))
            page = data.get("nextPageToken", "")
            if not page:
                return items
            if page in seen:
                break
            seen.add(page)
        raise AuditError("PAGINATION_INCOMPLETE")


def fields(data, names):
    return {name: data[name] for name in names if name in data}


def capture(fn):
    try:
        return {"status": "collected", "data": fn()}
    except (AuditError, KeyError, TypeError, ValueError) as error:
        return {"status": "blocked", "error": str(error) if isinstance(error, AuditError)
                else "UNEXPECTED_RESPONSE_SHAPE"}


def rules(client):
    # Resolve the release now; do not copy a UUID from a screenshot or list order.
    path = f"/v1/{ROOT}/releases/cloud.firestore/{DATABASE}"
    release = client.get("firebaserules.googleapis.com", path)
    name = release.get("rulesetName", "")
    if not re.fullmatch(re.escape(ROOT) + r"/rulesets/[A-Za-z0-9_-]+", name):
        raise AuditError("RULESET_PROJECT_OR_NAME_MISMATCH")
    data = client.get("firebaserules.googleapis.com", "/v1/" + name)
    source = data.get("source", {}).get("files", [])
    if not source or any(not isinstance(f.get("content"), str) for f in source):
        raise AuditError("RULESET_SOURCE_MISSING")
    return {"release": fields(release, ["name", "rulesetName", "updateTime"]),
            "files": [fields(f, ["name", "content"]) for f in source],
            "securityRulesVerified": False,
            "note": "Source collected for review; no security test performed."}


def web_apps(client):
    apps = client.pages("firebase.googleapis.com", f"/v1beta1/{ROOT}/webApps", "apps")
    output = []
    for app in apps:
        app_id = app.get("appId", "")
        if not re.fullmatch(r"[A-Za-z0-9:_-]+", app_id):
            raise AuditError("INVALID_WEB_APP_ID")
        def config():
            raw = client.get("firebase.googleapis.com",
                             f"/v1beta1/{ROOT}/webApps/{app_id}/config")
            return {**fields(raw, ["projectId", "appId", "authDomain"]),
                    "apiKeyPresent": bool(raw.get("apiKey"))}
        output.append({**fields(app, ["displayName", "appId", "state"]),
                       "config": capture(config)})
    return output


def auth_config(client):
    raw = client.get("identitytoolkit.googleapis.com", f"/admin/v2/{ROOT}/config")
    signin = raw.get("signIn", {})
    return {"email": fields(signin.get("email", {}), ["enabled", "passwordRequired"]),
            "anonymous": fields(signin.get("anonymous", {}), ["enabled"]),
            "authorizedDomains": raw.get("authorizedDomains", []),
            "client": fields(raw.get("client", {}),
                             ["permissions"])}


def google_config(client):
    raw = client.get("identitytoolkit.googleapis.com",
                     f"/admin/v2/{ROOT}/defaultSupportedIdpConfigs/google.com")
    return {"enabled": bool(raw.get("enabled")),
            "clientIdPresent": bool(raw.get("clientId"))}


def summarize_services(services):
    output = []
    for service in services:
        meta = service.get("metadata", {})
        template = service.get("spec", {}).get("template", {}).get("spec", {})
        containers = []
        for container in template.get("containers", []):
            variables = {e["name"]: e for e in container.get("env", [])}
            known = {}
            for name in ["FIREBASE_PROJECT_ID", "FIRESTORE_DATABASE_ID",
                         "OWNER_UID", "GEMINI_API_KEY", "AI_PUBLIC_ENABLED"]:
                entry = variables.get(name, {})
                # Only project/database IDs and a feature flag may appear as values.
                known[name] = {"configured": bool(entry.get("value") or entry.get("valueFrom"))}
                if name in {"FIREBASE_PROJECT_ID", "FIRESTORE_DATABASE_ID", "AI_PUBLIC_ENABLED"}:
                    if "value" in entry:
                        known[name]["value"] = entry["value"]
            containers.append({"name": container.get("name"), "settings": known})
        output.append({"name": meta.get("name"),
                       "region": meta.get("labels", {}).get("cloud.googleapis.com/location"),
                       "url": service.get("status", {}).get("url"),
                       "serviceAccount": template.get("serviceAccountName"),
                       "containers": containers,
                       "buildTimeFirebaseConfigVerified": False})
    return output


def runtime_roles(client, services):
    identities = {s["serviceAccount"] for s in services if s.get("serviceAccount")}
    if not identities:
        raise AuditError("NO_EXPLICIT_RUNTIME_SERVICE_ACCOUNT_OBSERVED")
    policy = client.get("cloudresourcemanager.googleapis.com",
                        f"/v1/{ROOT}:getIamPolicy", policy=True)
    result = []
    for identity in sorted(identities):
        bindings = []
        for binding in policy.get("bindings", []):
            if "serviceAccount:" + identity in binding.get("members", []):
                bindings.append(fields(binding, ["role", "condition"]))
        result.append({"serviceAccount": identity, "directProjectBindings": bindings})
    return {"serviceAccounts": result, "effectivePermissionsVerified": False,
            "note": "Project bindings only; inheritance, groups, resource policies, deny policies, custom role permissions and conditions require separate review."}


def collect(client, run=gcloud):
    report = {"projectId": PROJECT, "databaseId": DATABASE,
              "collectedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
              "mode": "READ_ONLY_METADATA", "liveE2EPerformed": False,
              "productionChanged": False, "sections": {}}
    jobs = {
        "database": lambda: fields(client.get("firestore.googleapis.com",
            f"/v1/{ROOT}/databases/{DATABASE}"),
            ["name", "locationId", "type", "deleteProtectionState"]),
        "firestoreRules": lambda: rules(client),
        "webApps": lambda: web_apps(client),
        "authentication": lambda: auth_config(client),
        "googleSignIn": lambda: google_config(client),
        "cloudRun": lambda: summarize_services(json.loads(run("run", "services", "list",
            "--platform=managed", "--project=" + PROJECT, "--format=json"))),
    }
    for name, job in jobs.items():
        print("Reading " + name + " ...", flush=True)
        report["sections"][name] = capture(job)
    services = report["sections"]["cloudRun"]
    report["sections"]["runtimeIAM"] = (capture(lambda: runtime_roles(client, services["data"]))
        if services["status"] == "collected" else
        {"status": "blocked", "error": "CLOUD_RUN_METADATA_UNAVAILABLE"})
    report["unverified"] = ["Live owner/student journeys, account recovery and Google login",
        "Client Firestore rule behavior and data isolation", "Effective runtime IAM permissions",
        "Billing, quotas and remaining free allowance", "Staging deployment and paid-content access"]
    return report


def write_report(report, token):
    output = json.dumps(report, ensure_ascii=False, indent=2)
    # Defense in depth: even unusual source content cannot echo the access token.
    if token:
        output = output.replace(token, "[REDACTED_ACCESS_TOKEN]")
    folder = Path(tempfile.mkdtemp(prefix="maryam-cloud-audit-", dir=Path.home()))
    path = folder / "MARYAM_CLOUD_AUDIT.json"
    with path.open("x", encoding="utf-8") as handle:
        os.chmod(path, 0o600)
        handle.write(output + "\n")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Download the report through Cloud Shell")
    args = parser.parse_args()
    print("فحص قراءة فقط للمشروع الحالي؛ لا تغيير للإنتاج.", flush=True)
    token = ""
    try:
        token = gcloud("auth", "print-access-token")
        if not token:
            raise AuditError("NO_AUTHORIZED_GCLOUD_SESSION")
        report = collect(Client(token))
    except AuditError as error:
        report = {"projectId": PROJECT, "status": "blocked", "error": str(error),
                  "productionChanged": False, "liveE2EPerformed": False}
    path = write_report(report, token)
    print("\nالتقرير جاهز للمراجعة، وليس تأكيدًا لاكتمال المنصة.")
    print(str(path))
    if args.download and shutil.which("cloudshell"):
        try:
            subprocess.run(["cloudshell", "download", str(path)], timeout=45, check=True)
        except (OSError, subprocess.SubprocessError):
            print("التنزيل التلقائي لم يكتمل. استخدمي Download File للمسار أعلاه.")
    print("أرفقي ملف MARYAM_CLOUD_AUDIT.json في المحادثة.")


if __name__ == "__main__":
    main()
