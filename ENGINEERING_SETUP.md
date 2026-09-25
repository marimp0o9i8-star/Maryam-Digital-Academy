# Maryam Digital Academy — safe activation checklist

## What this branch changes
- Removes fake email/phone/Google/Facebook authentication. Email/password and Google are real Firebase Auth calls. Password reset emails are supported.
- Requires verified Firebase ID token before any `/api` AI endpoint. Owner APIs additionally compare the verified UID with the server-only `OWNER_UID`.
- Stores each student's workbook, 12-day checklist and current page in Firestore at `progress/{uid}`; student identity lives at `users/{uid}`.
- Restricts Firestore client reads/writes with deny-all rules; only the trusted server uses Admin SDK after verifying ID tokens.
- Removes fake social-purchase feed and hides unfinished analytics/payment/admin simulator tabs; preserves the current educational content and AI tools.
- Fails closed when Gemini is missing, instead of presenting templates as fresh AI results.

## Required owner action before any real launch
1. Back up existing Google AI Studio and GitHub project. Do not merge to main or change Cloud Run production before E2E testing.
2. Create/select an authorized Firebase project. Enable Authentication > Email/Password and Google. Add your Cloud Run domain to Auth Authorized Domains.
3. Create a Cloud Firestore database in your chosen region. Deploy the included `firestore.rules` (deny client access). Verify Cloud Run service account has Firestore document read/write rights through ADC.
4. From Firebase project settings > General > Your apps > Web app, provide VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID at Vite BUILD TIME. These identify the public Firebase app and must match the backend project.
5. Configure on Cloud Run server: FIREBASE_PROJECT_ID, Gemini API secret (GEMINI_API_KEY), and OWNER_UID (exact Firebase Authentication UID of the owner's real account). Do not use email or a frontend PIN as the owner privilege. Optionally set GEMINI_MODEL=gemini-2.5-flash.
6. Install dependencies, run `npm run lint && npm run build && npm test`, then deploy a separate staging revision. `GET /api/health` should show configured = true. The test suite uses no real credentials and checks fail-closed behavior.
7. Register two **test accounts**, owner and student. Verify each person's progress survives logout/relogin, the second student cannot read the first user's information, student receives 403 for `/api/admin/summary`, and owner sees only actual user records. Test password-reset email and real Google login on Android. Test the AI endpoint with owner-approved consumption limits.
8. Only after staging passes, merge and release. Check Cloud Run/Firebase current quotas and billing settings; free tier does not guarantee $0 for arbitrary usage.

## Legacy limitations still gated
The large legacy AdminSuite remains available to verified owner for authoring, but its payments, analytics, affiliate, and simulated-users tabs are disabled. It still contains demonstration-only state and content; do not turn these tabs back on without server-side payment/webhook and analytics work. Lesson-video assets and some exported .txt files are placeholders; they must be replaced before claiming a paid video/PDF course.

## Persistence and threat model
Client only holds short-lived Firebase ID tokens; no password or owner PIN is saved by this app. Cloud Run verifies tokens for each request; Firestore document paths use verified UID, never one supplied by the browser. Deny-all client rules prevent direct Firestore access even when public Firebase config is known. Owner privilege is based on server env UID. The current in-memory request limiter is per Cloud Run instance, not globally distributed; apply Cloud Armor or server-side distributed quota before public AI launch.

## Legacy workbook preservation
Previous localStorage keys are not deleted or silently merged into the new account. After the owner signs into a verified owner UID, a consent-based button can import the old browser draft. Treat shared-device drafts with caution; confirm the data belongs to the owner before importing. Wait for the server save confirmation. Other old simulated accounts are not automatically promoted into Firebase users.
