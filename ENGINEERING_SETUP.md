# Maryam Digital Academy — safe activation checklist

## What this branch changes
- Removes fake email/phone/Google/Facebook authentication. Email/password and Google are real Firebase Auth calls. Password reset emails are supported.
- Requires verified Firebase ID token before any `/api` AI endpoint. Owner APIs additionally compare the verified UID with the server-only `OWNER_UID`.
- Stores each student's workbook, 12-day checklist and current page in the selected named Firestore database under `apps/maryam-academy/progress/{uid}`; student profile under `apps/maryam-academy/users/{uid}`.
- The server verifies ID tokens and uses Admin SDK. Deny-all client rules are exercised **only in isolated emulators**; the shared production database's existing rules have not been inspected or changed. Production client access must be verified before launch.
- Removes fake social-purchase feed and hides unfinished analytics/payment/admin simulator tabs; preserves the current educational content and AI tools.
- Fails closed when Gemini is missing, instead of presenting templates as fresh AI results.

## Required owner action before any real launch
1. Back up existing Google AI Studio and GitHub project. Do not merge to main or change Cloud Run production before E2E testing.
2. Create/select an authorized Firebase project. Enable Authentication > Email/Password and Google. Add your Cloud Run domain to Auth Authorized Domains.
3. Reuse the existing Firestore database visible in the owner's Firebase screenshots. Do not create another database.
   - Exact existing database ID confirmed from owner-provided Firebase console URL: `ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964`. Set `FIRESTORE_DATABASE_ID` to this value in **staging only**. Do not assume `(default)`.
   - Academy records are namespaced as `apps/maryam-academy/users/{uid}` and `apps/maryam-academy/progress/{uid}`, avoiding the unrelated AI Studio app's root collections.
   - NEVER deploy `tests/firestore.emulator.rules` to the live Firebase project. The previous root deny-all rules file and default deployable firebase.json have been removed; the remaining `firebase.emulator.json` is only for isolated tests.
   - Review all current rules before merging any new rules. Replacing existing database rules would disrupt the other application; broad existing allow rules may override a narrow deny. Verify Cloud Run service account permissions using ADC.
4. From Firebase project settings > General > Your apps > Web app, provide VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID at Vite BUILD TIME. These identify the public Firebase app and must match the backend project.
5. Configure on staging Cloud Run server: FIREBASE_PROJECT_ID, FIRESTORE_DATABASE_ID (exact named database ID), Gemini API secret (GEMINI_API_KEY), and OWNER_UID (exact Firebase Authentication UID of the owner's real account). Do not use email or a frontend PIN as the owner privilege. Optionally set GEMINI_MODEL=gemini-2.5-flash.
6. Install dependencies, run `npm run lint && npm run build && npm test && npm run test:emulator`, then deploy a separate staging revision. `GET /api/health` should show configured = true. The test suite uses no real credentials and checks fail-closed behavior.
7. Register two **test accounts**, owner and student. Verify each person's progress survives logout/relogin, the second student cannot read the first user's information, student receives 403 for `/api/admin/summary`, and owner sees only actual user records. Test password-reset email and real Google login on Android. Test the AI endpoint with owner-approved consumption limits.
8. Only after staging passes, merge and release. Check Cloud Run/Firebase current quotas and billing settings; free tier does not guarantee $0 for arbitrary usage.

## Legacy limitations still gated
The large legacy AdminSuite remains available to verified owner for authoring, but its payments, analytics, affiliate, and simulated-users tabs are disabled. It still contains demonstration-only state and content; do not turn these tabs back on without server-side payment/webhook and analytics work. Lesson-video assets and some exported .txt files are placeholders; they must be replaced before claiming a paid video/PDF course.

## Persistence and threat model
Client only holds short-lived Firebase ID tokens; no password or owner PIN is saved by this app. Cloud Run verifies tokens for each request; Firestore document paths use verified UID, never one supplied by the browser. Emulator-only deny-all rules prevent direct client reads in tests. The live shared database's rules are unverified and must be reviewed without replacing other applications' policies. Owner privilege is based on server env UID. The current in-memory request limiter is per Cloud Run instance, not globally distributed; apply Cloud Armor or server-side distributed quota before public AI launch.

## Legacy workbook preservation
Previous localStorage keys are not deleted or silently merged into the new account. After the owner signs into a verified owner UID, a consent-based button can import the old browser draft. Treat shared-device drafts with caution; confirm the data belongs to the owner before importing. Wait for the server save confirmation. Other old simulated accounts are not automatically promoted into Firebase users.

## Existing-project observations and safety gate (2026-09-25)
The owner-provided console URL identifies the existing named database `ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964`, not `(default)`. It is ready for data but the current rules, existing collections and real billing configuration must be inspected without mutation. This branch must not be merged or deployed to live Cloud Run until exact database ID and permissions are confirmed and staging has passed. Named Firestore Admin SDK APIs are currently listed as Public Preview; test the selected existing database on staging. Only one database in a project receives the Firestore free quota. Do not create a duplicate database just for this app.

## Exact connection identifiers (provided by owner)
- Firebase/Google Cloud project ID: `elite-implement-hxnr0`
- Existing named Firestore database ID: `ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964`
- Console URL: `https://console.firebase.google.com/u/0/project/elite-implement-hxnr0/firestore/databases/ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964/data`
- Staging environment should set `FIREBASE_PROJECT_ID=elite-implement-hxnr0` and `FIRESTORE_DATABASE_ID=ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964`; these identifiers are not credentials. Set browser Firebase config using the existing Web App configuration. Do **not** add service-account keys or Gemini secrets to the repository.
- Security rules and Cloud Run service-account permissions on the live shared database are still unknown. No production write, rule deployment or billing change has been performed.
