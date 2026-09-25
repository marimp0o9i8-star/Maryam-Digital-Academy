import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const ROOT = "http://127.0.0.1:18310";
const PASSWORD = "browserEmulatorTest-6318!";
const PROBLEM = "Browser-stored real draft for account A — Arabic text تجريبي";

test("Browser: register, workbook autosave, logout/relogin, account separation, owner denial", async t => {
  const processServer = spawn(process.execPath, ["dist/server.cjs"], {
    env: {
      ...process.env, PORT: "18310", NODE_ENV: "production",
      FIREBASE_PROJECT_ID: "demo-maryam-academy", OWNER_UID: "owner-test-uid",
      GEMINI_API_KEY: "", AI_PUBLIC_ENABLED: "false",
      ALLOW_FIREBASE_EMULATORS_IN_CI: "true",
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
      FIRESTORE_EMULATOR_HOST: "127.0.0.1:8085",
    }, stdio: "pipe"
  });
  let output = "";
  processServer.stdout.on("data", c => { output += c.toString(); });
  processServer.stderr.on("data", c => { output += c.toString(); });
  t.after(() => processServer.kill("SIGTERM"));
  let alive = false;
  for (let i = 0; i < 80; i++) {
    if (processServer.exitCode !== null) break;
    try { const r = await fetch(ROOT + "/api/health"); if (r.ok) { alive = true; break; } } catch {}
    await delay(150);
  }
  assert.equal(alive, true, "Browser test app did not start: " + output);
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); });
  const one = await browser.newContext({ viewport: { width: 1365, height: 900 }, locale: "ar-IQ" });
  const page = await one.newPage();
  await page.goto(ROOT, { waitUntil: "networkidle" });
  await page.getByRole("button", { name:"إنشاء حساب", exact:true }).click();
  await page.locator('input[autocomplete="name"]').fill("طالب الاختبار الأول");
  await page.locator('input[autocomplete="email"]').fill("ui-one@test.invalid");
  await page.locator('input[autocomplete="new-password"]').fill(PASSWORD);
  await page.getByRole("button", { name:"إنشاء الحساب", exact:true }).click();
  await page.getByRole("button", { name:"كراسة العمل والتخطيط" }).first().click();
  const field = page.getByPlaceholder("اكتب المعاناة أو العقدة التي ستحلها لهم...");
  await field.fill(PROBLEM);
  await page.getByText("تم حفظ التقدم على الخادم.").waitFor({timeout:25000});
  await page.getByRole("button", { name:"تسجيل خروج العضو" }).first().click();
  await page.getByRole("button", { name:"تسجيل الدخول", exact:true }).waitFor({timeout:20000});
  await page.locator('input[autocomplete="email"]').fill("ui-one@test.invalid");
  await page.locator('input[autocomplete="current-password"]').fill(PASSWORD);
  await page.getByRole("button", { name:"دخول", exact:true }).click();
  await page.getByRole("button", { name:"كراسة العمل والتخطيط" }).first().click();
  await page.getByPlaceholder("اكتب المعاناة أو العقدة التي ستحلها لهم...").waitFor({timeout:20000});
  assert.equal(await page.getByPlaceholder("اكتب المعاناة أو العقدة التي ستحلها لهم...").inputValue(), PROBLEM);

  const two = await browser.newContext({ viewport: { width:1365,height:900 }, locale:"ar-IQ" });
  const other = await two.newPage();
  await other.goto(ROOT, { waitUntil:"networkidle" });
  await other.getByRole("button", {name:"إنشاء حساب",exact:true}).click();
  await other.locator('input[autocomplete="name"]').fill("طالب الاختبار الثاني");
  await other.locator('input[autocomplete="email"]').fill("ui-two@test.invalid");
  await other.locator('input[autocomplete="new-password"]').fill(PASSWORD);
  await other.getByRole("button", {name:"إنشاء الحساب",exact:true}).click();
  await other.getByRole("button", {name:"كراسة العمل والتخطيط"}).first().click();
  const secondDraft = other.getByPlaceholder("اكتب المعاناة أو العقدة التي ستحلها لهم...");
  await secondDraft.waitFor({timeout:20000});
  assert.equal(await secondDraft.inputValue(), "", "second account cannot read first account workbook");
  await other.getByRole("button", {name:"لوحة التحكم المشرف والذكاء الفوقي"}).first().click();
  await other.getByText("لوحة المالكة محمية على الخادم", {exact:false}).waitFor({timeout:10000});
  // Positive owner UI path: backend must have issued owner role from the verified UID.
  const adminContext = await browser.newContext({viewport:{width:1365,height:900},locale:"ar-IQ"});
  const adminPage = await adminContext.newPage();
  await adminPage.goto(ROOT, {waitUntil:"networkidle"});
  await adminPage.locator('input[autocomplete="email"]').fill("owner@test.invalid");
  await adminPage.locator('input[autocomplete="current-password"]').fill("emulatorTestOnly-8492!");
  await adminPage.getByRole("button", {name:"دخول",exact:true}).click();
  await adminPage.getByRole("button", {name:"لوحة التحكم المشرف والذكاء الفوقي"}).first().click();
  await adminPage.getByText("سجل الأعضاء الحقيقي — قراءة فقط").waitFor({timeout:12000});
  await adminPage.getByText("student-one", {exact:false}).count(); // UID is never rendered; check names instead.
  await adminPage.getByText("Student One", {exact:false}).first().waitFor({timeout:12000});
  await one.close(); await two.close(); await adminContext.close();
});
