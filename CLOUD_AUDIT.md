# One-step read-only Firebase evidence collection

`scripts/cloud-audit.py` replaces manually copying Ruleset UUIDs from mobile
screenshots. It runs in the owner's already signed-in Google Cloud Shell using
Python 3 and gcloud. It installs nothing and does not change the default project.

Run `python3 scripts/cloud-audit.py --download` from a checkout of this branch.
The report is created in a unique private folder under the home directory, and
Cloud Shell offers to download `MARYAM_CLOUD_AUDIT.json`. Attach the report in the
private project conversation, not in this public repository.

## Collected evidence

- Metadata for the exact existing named Firestore database.
- The **currently active** release and its rules source, with no UUID transcription.
- Registered web apps, app IDs, auth domains and whether API keys are present.
- Email/password settings, allowed auth domains and Google provider status.
- Cloud Run service URLs, runtime identities and presence of relevant settings.
- Direct project IAM bindings for those runtime identities, including conditions.

## Boundaries

The script reads configuration; it does not read database documents or list Auth
users. It never enables APIs, creates resources, changes billing, grants roles,
deploys rules or sends email. HTTP calls use GET, except the documented read-only
`projects.getIamPolicy` POST. HTTP redirects are refused so the access token cannot
be forwarded to another origin. OAuth client secrets, access tokens, owner UIDs,
Gemini keys and unrelated environment-variable values are excluded from output.
Rules source may contain application-specific identifiers and must be kept private.

Failed sections remain `blocked`; other sections continue. API-disabled and IAM
errors do not trigger auto-enabling or permission changes. Empty configuration is
not evidence of safe behavior. Runtime environment settings do not prove Vite's
build-time settings. Project IAM bindings do not prove effective permissions:
resource bindings, groups, inherited policies, deny policies, custom roles and
conditions may alter access. Default runtime identities absent from the service
metadata are not guessed. Reports explicitly leave security-rule behavior and
real owner/student E2E tests unverified. Staging and billing/free-quota checks remain
required before deployment.

## Verification

Run `python3 tests/cloud-audit.test.py`. These tests use offline fixtures only.
They verify active named-release selection, cross-project rejection, partial
failure, pagination, credential filtering, read-only IAM scope, redirect refusal
and private report creation. Passing these tests is **not** a live Firebase audit.

Official API references:
- https://firebase.google.com/docs/reference/rules/rest/v1/projects.releases/get
- https://firebase.google.com/docs/reference/rules/rest/v1/projects.rulesets/get
- https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects.webApps/getConfig
- https://cloud.google.com/identity-platform/docs/reference/rest/v2/projects/getConfig
- https://cloud.google.com/identity-platform/docs/reference/rest/v2/projects.defaultSupportedIdpConfigs/get
- https://cloud.google.com/sdk/gcloud/reference/run/services/list
- https://cloud.google.com/resource-manager/reference/rest/v1/projects/getIamPolicy
- https://cloud.google.com/shell/docs/uploading-and-downloading-files
