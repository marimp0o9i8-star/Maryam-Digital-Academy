"""Offline tests: do not contact Google, load credentials or create real users."""
import contextlib
import importlib.util
import io
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("audit", Path(__file__).parents[1] / "scripts/cloud-audit.py")
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class FakeClient:
    def __init__(self, responses):
        self.responses = responses
        self.calls = []

    def get(self, host, path, *args, **kwargs):
        self.calls.append((host, path, kwargs))
        result = self.responses.get(path, {})
        if isinstance(result, Exception):
            raise result
        return result


class Tests(unittest.TestCase):
    def test_current_named_release_drives_ruleset_selection(self):
        release = f"/v1/{audit.ROOT}/releases/cloud.firestore/{audit.DATABASE}"
        active = audit.ROOT + "/rulesets/current-not-screenshot-id"
        client = FakeClient({release: {"rulesetName": active},
            "/v1/" + active: {"source": {"files": [{"content": "allow read: if false;"}]}}})
        result = audit.rules(client)
        self.assertEqual(client.calls[0][1], release)
        self.assertEqual(client.calls[1][1], "/v1/" + active)
        self.assertEqual(result["files"][0]["content"], "allow read: if false;")
        self.assertFalse(result["securityRulesVerified"])

    def test_other_project_ruleset_is_rejected(self):
        client = FakeClient({f"/v1/{audit.ROOT}/releases/cloud.firestore/{audit.DATABASE}":
                             {"rulesetName": "projects/other/rulesets/abc"}})
        with self.assertRaises(audit.AuditError):
            audit.rules(client)
        self.assertEqual(len(client.calls), 1)

    def test_secret_values_not_exported_from_service_metadata(self):
        source = [{"metadata": {"name": "academy"}, "spec": {"template": {"spec": {
            "serviceAccountName": "runtime@example.iam.gserviceaccount.com",
            "containers": [{"env": [
                {"name": "GEMINI_API_KEY", "value": "gemini-secret"},
                {"name": "OWNER_UID", "value": "private-owner-uid"},
                {"name": "UNRELATED_SECRET", "value": "another-secret"},
                {"name": "FIREBASE_PROJECT_ID", "value": audit.PROJECT}]}]}}}}]
        result = json.dumps(audit.summarize_services(source))
        for secret in ["gemini-secret", "private-owner-uid", "another-secret"]:
            self.assertNotIn(secret, result)
        self.assertIn(audit.PROJECT, result)
        self.assertIn('"configured": true', result)

    def test_auth_provider_drops_client_secret(self):
        client = FakeClient({f"/admin/v2/{audit.ROOT}/defaultSupportedIdpConfigs/google.com":
            {"enabled": True, "clientId": "public-id", "clientSecret": "oauth-secret"}})
        self.assertEqual(audit.google_config(client), {"enabled": True, "clientIdPresent": True})

    def test_partial_failure_does_not_block_other_sections_or_claim_e2e(self):
        client = FakeClient({f"/v1/{audit.ROOT}/databases/{audit.DATABASE}":
                             audit.AuditError("HTTP_403")})
        client.pages = lambda *args: []
        with contextlib.redirect_stdout(io.StringIO()):
            result = audit.collect(client, run=lambda *args: "[]")
        self.assertEqual(result["sections"]["database"]["error"], "HTTP_403")
        self.assertEqual(result["sections"]["authentication"]["status"], "collected")
        self.assertFalse(result["liveE2EPerformed"])
        self.assertFalse(result["productionChanged"])
        self.assertEqual(result["sections"]["runtimeIAM"]["status"], "blocked")

    def test_pagination_follows_tokens(self):
        client = audit.Client("unused")
        with patch.object(client, "get", side_effect=[
            {"apps": [1], "nextPageToken": "page-two"}, {"apps": [2]}]) as get:
            self.assertEqual(client.pages("firebase.googleapis.com", "/path", "apps"), [1, 2])
            self.assertEqual(get.call_args_list[1].args[2]["pageToken"], "page-two")

    def test_pagination_cycle_is_reported_incomplete(self):
        client = audit.Client("unused")
        with patch.object(client, "get", return_value={"apps": [], "nextPageToken": "repeat"}):
            with self.assertRaisesRegex(audit.AuditError, "PAGINATION_INCOMPLETE"):
                client.pages("firebase.googleapis.com", "/path", "apps")

    def test_post_whitelist_and_cross_origin_redirect_guard(self):
        client = audit.Client("unused")
        with self.assertRaises(audit.AuditError):
            client.get("example.com", "/anything")
        with self.assertRaisesRegex(audit.AuditError, "WRITE_REFUSED"):
            client.get("firebaserules.googleapis.com", "/v1/rulesets", policy=True)
        with self.assertRaisesRegex(audit.AuditError, "API_REDIRECT_REFUSED"):
            audit.NoRedirect().redirect_request(None, None, 302, "", {}, "https://other.invalid")

    def test_iam_reports_only_runtime_identity_and_preserves_conditions(self):
        client = FakeClient({f"/v1/{audit.ROOT}:getIamPolicy": {"bindings": [
            {"role": "roles/datastore.user", "members": ["serviceAccount:runtime@test"],
             "condition": {"expression": "request.time < timestamp('2026-01-01T00:00:00Z')"}},
            {"role": "roles/owner", "members": ["user:private-person@example.com"]}]}})
        result = audit.runtime_roles(client, [{"serviceAccount": "runtime@test"}])
        self.assertFalse(result["effectivePermissionsVerified"])
        self.assertNotIn("private-person", json.dumps(result))
        self.assertIn("condition", result["serviceAccounts"][0]["directProjectBindings"][0])

    def test_report_redacts_token_and_is_private_without_overwriting(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(Path, "home", return_value=Path(folder)):
            first = audit.write_report({"source": "token-secret"}, "token-secret")
            second = audit.write_report({}, "token-secret")
            self.assertNotEqual(first, second)
            self.assertNotIn("token-secret", first.read_text())
            self.assertEqual(os.stat(first).st_mode & 0o777, 0o600)


if __name__ == "__main__":
    unittest.main()
