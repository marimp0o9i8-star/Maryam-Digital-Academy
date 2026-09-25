import assert from "node:assert/strict";

// READ-ONLY smoke test. Never automatically runs against live Cloud Run production.
// Supply ephemeral ID tokens through process environment, not CLI flags or checked-in files.
const url = process.env.STAGING_BASE_URL?.trim();
if (!url) throw new Error("Set STAGING_BASE_URL to an isolated staging service URL.");
const origin = new URL(url);
assert.equal(origin.protocol, "https:", "Staging must use HTTPS.");
assert.equal(origin.username, "", "Do not embed credentials in the URL.");
assert.equal(origin.password, "", "Do not embed credentials in the URL.");
assert.equal(origin.pathname, "/", "Use the staging service root URL.");
assert.equal(origin.search, "", "Do not put secrets in a URL query.");
assert.equal(origin.hash, "", "Do not put secrets in a URL hash.");
if (origin.hostname === "service-176724152662.europe-west2.run.app") {
  throw new Error("Production Cloud Run URL is forbidden for this staging test.");
}
const base = origin.origin;
const expectedProject = "elite-implement-hxnr0";
const expectedDatabase = "ai-studio-bunyan-f5403500-fee9-4eed-bc88-c5a71cbff964";
async function getJson(path, token) {
  const response = await fetch(base + path, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    redirect: "manual",
    signal: AbortSignal.timeout(12000)
  });
  const type = response.headers.get("content-type") || "";
  assert.match(type, /application\/json/i, `${path} returned non-JSON; app may be a legacy/SPA route`);
  return { status: response.status, body: await response.json() };
}
const health = await getJson("/api/health");
assert.equal(health.status, 200);
assert.equal(health.body.ok, true);
assert.equal(health.body.firebaseConfigured, true, "Firebase server configuration is absent.");
for (const path of ["/api/me/progress", "/api/admin/summary", "/api/admin/connection-check"]) {
  const unauthenticated = await getJson(path);
  assert.equal(unauthenticated.status, 401, `Unauthenticated ${path} must fail closed`);
}
console.log("PASS: staging health is JSON; unauthenticated member and admin APIs return 401.");

const studentToken = process.env.STAGING_STUDENT_ID_TOKEN?.trim();
if (studentToken) {
  for (const path of ["/api/admin/summary", "/api/admin/connection-check"]) {
    const student = await getJson(path, studentToken);
    assert.equal(student.status, 403, `Student should not access ${path}`);
  }
  console.log("PASS: student denied both owner-only endpoints.");
} else console.log("SKIP: authenticated student checks (no STAGING_STUDENT_ID_TOKEN).");

const ownerToken = process.env.STAGING_OWNER_ID_TOKEN?.trim();
if (ownerToken) {
  const owner = await getJson("/api/admin/connection-check", ownerToken);
  assert.equal(owner.status, 200, "Owner must be authorized and Firestore server connection operational.");
  assert.equal(owner.body.connected, true);
  assert.equal(owner.body.projectId, expectedProject);
  assert.equal(owner.body.databaseId, expectedDatabase);
  assert.equal(owner.body.authVerified, true);
  assert.equal(owner.body.databaseReadableByServer, true);
  assert.equal(owner.body.securityRulesVerified, false, "Admin SDK checks never prove client rules");
  console.log("PASS: authenticated owner server can read selected Firebase project/database metadata.");
} else console.log("SKIP: authenticated owner connection check (no STAGING_OWNER_ID_TOKEN).");

console.log("NOT VERIFIED by this smoke test: live Firestore client rules, real Google sign-in UX, writes, password reset, payments.");
