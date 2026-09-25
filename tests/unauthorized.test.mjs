import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 18080 + Math.floor(Math.random() * 1000);
const base = `http://127.0.0.1:${port}`;
let server;
test("public health; private endpoints fail closed without a verified session", async (t) => {
  server = spawn(process.execPath, ["dist/server.cjs"], {
    env: { ...process.env, PORT: String(port), NODE_ENV: "production", FIREBASE_PROJECT_ID: "", FIRESTORE_DATABASE_ID: "", OWNER_UID: "", GEMINI_API_KEY: "" },
    stdio: "pipe",
  });
  t.after(() => { if (server && !server.killed) server.kill("SIGTERM"); });
  let started = false;
  for (let i = 0; i < 50; i++) {
    if (server.exitCode !== null) break;
    try {
      const response = await fetch(`${base}/api/health`);
      started = response.ok;
      if (started) break;
    } catch {}
    await delay(200);
  }
  assert.equal(started, true, "server must start");
  const health = await (await fetch(`${base}/api/health`)).json();
  assert.equal(health.firebaseConfigured, false);
  assert.equal(health.aiConfigured, false);
  for (const path of ["/api/me/progress", "/api/admin/summary"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 401, path);
  }
  for (const path of ["/api/coach/chat", "/api/translate", "/api/ai-tool"]) {
    const response = await fetch(base + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "hello", text: "hello", targetLanguage: "en", toolId: "headline", inputData: {} }),
    });
    assert.equal(response.status, 401, path);
  }
  const page = await fetch(base + "/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<html/);
});
