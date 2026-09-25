import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const PROJECT = "demo-maryam-academy";
const OWNER_UID = "owner-test-uid";
const API = "http://127.0.0.1:18309";
const AUTH = "http://127.0.0.1:9099";
const FIRESTORE = "http://127.0.0.1:8085";
const USER_PASSWORD = "emulatorTestOnly-8492!";
initializeApp({ projectId: PROJECT });

async function request(path, token, options = {}) {
  const response = await fetch(API + path, {
    ...options, headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {})
    }
  });
  return { status: response.status, body: await response.json().catch(() => ({})) };
}

async function login(email) {
  const response = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=local-test`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: USER_PASSWORD, returnSecureToken: true })
  });
  const data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  return data.idToken;
}

test("Firebase Auth + Firestore emulator: real token verification, account isolation and persistence", async (t) => {
  const auth = getAuth();
  await auth.createUser({ uid: OWNER_UID, email: "owner@test.invalid", password: USER_PASSWORD, displayName: "Owner fixture" });
  await auth.createUser({ uid: "student-one", email: "one@test.invalid", password: USER_PASSWORD, displayName: "Student One" });
  await auth.createUser({ uid: "student-two", email: "two@test.invalid", password: USER_PASSWORD, displayName: "Student Two" });

  const server = spawn(process.execPath, ["dist/server.cjs"], {
    env: {
      ...process.env, PORT: "18309", NODE_ENV: "production",
      FIREBASE_PROJECT_ID: PROJECT, OWNER_UID, GEMINI_API_KEY: "",
      AI_PUBLIC_ENABLED: "false", ALLOW_FIREBASE_EMULATORS_IN_CI: "true",
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
      FIRESTORE_EMULATOR_HOST: "127.0.0.1:8085",
    }, stdio: "pipe"
  });
  let serverOutput = "";
  server.stderr.on("data", c => { serverOutput += c.toString(); });
  server.stdout.on("data", c => { serverOutput += c.toString(); });
  t.after(() => { server.kill("SIGTERM"); });
  let started = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) break;
    try { const r = await fetch(API + "/api/health"); started = r.ok; if (started) break; } catch {}
    await delay(150);
  }
  assert.equal(started, true, "Server did not start: " + serverOutput);
  const [owner, one, two] = await Promise.all([
    login("owner@test.invalid"), login("one@test.invalid"), login("two@test.invalid")
  ]);

  assert.equal((await request("/api/me/progress")).status, 401, "missing authorization");
  assert.equal((await request("/api/me/progress", "not-a-firebase-token")).status, 401, "invalid bearer token");
  assert.equal((await request("/api/admin/summary", one)).status, 403, "student cannot access owner API");
  assert.equal((await request("/api/coach/chat", one, {method:"POST",body:JSON.stringify({message:"hello"})})).status, 403, "public AI is disabled by default");
  assert.equal((await request("/api/coach/chat", owner, {method:"POST",body:JSON.stringify({message:"hello"})})).status, 503, "owner AI fails closed without Gemini key");

  const original = { answers: {u1Problem:"Problem unique to student one",u1Customer:"Iraqi shops",u1Check1:true}, daysCompleted:[true,...Array(11).fill(false)], currentPage:4, revision:0 };
  const save = await request("/api/me/progress", one, {method:"PUT",body:JSON.stringify(original)});
  assert.equal(save.status, 200, JSON.stringify(save));
  assert.equal(save.body.saved, true);
  assert.equal(save.body.revision, 1);
  const stale = await request("/api/me/progress", one, {method:"PUT",body:JSON.stringify(original)});
  assert.equal(stale.status, 409, "stale edit may not overwrite a newer committed draft");
  const loaded = await request("/api/me/progress", one);
  assert.equal(loaded.status, 200, JSON.stringify(loaded));
  assert.equal(loaded.body.progress.answers.u1Problem, original.answers.u1Problem);
  assert.equal(loaded.body.progress.currentPage, 4);

  const isolated = await request("/api/me/progress", two);
  assert.equal(isolated.status, 200, JSON.stringify(isolated));
  assert.equal(isolated.body.progress, null, "student two must not receive student one's draft");

  const malicious = { ...original, uid: OWNER_UID, answers: {u1Problem:"This belongs to student two"} };
  assert.equal((await request("/api/me/progress", two, { method:"PUT",body:JSON.stringify(malicious)})).status, 200);
  const reread = await request("/api/me/progress", one);
  assert.equal(reread.body.progress.answers.u1Problem, original.answers.u1Problem, "user-provided UID cannot select another document");

  const bad = await request("/api/me/progress", two, { method:"PUT",body:JSON.stringify({...original, currentPage:999})});
  assert.equal(bad.status, 400, "invalid page rejected");

  const newToken = await login("one@test.invalid"); // Simulate sign-out/relogin via new ID token.
  const reloaded = await request("/api/me/progress", newToken);
  assert.equal(reloaded.body.progress.answers.u1Problem, original.answers.u1Problem, "progress survives new token/relogin");
  const admin = await request("/api/admin/summary", owner);
  assert.equal(admin.status, 200, JSON.stringify(admin));
  assert.equal(admin.body.profiles.filter(p => ["student-one", "student-two"].includes(p.uid)).length, 2, "the two isolated API students are real database records, regardless of additional browser test fixtures");
  assert.equal(admin.body.profiles.some(p => p.uid === "student-one"), true);
  assert.equal(admin.body.profiles.some(p => p.uid === "student-two"), true);
  assert.equal(admin.body.profiles.some(p => p.uid === OWNER_UID), false, "owner not present until owner progress endpoint called");

  // Public browser token must never bypass deny-all Firestore security rules.
  const direct = await fetch(`${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/progress/student-one`, {
    headers:{Authorization:`Bearer ${two}`}
  });
  assert.equal(direct.status, 403, "client read forbidden even when the student knows the document path");
});
