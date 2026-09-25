import type { Express, Request, Response, NextFunction } from "express";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

type AuthRequest = Request & { verifiedUser?: DecodedIdToken };
const buckets = new Map<string, { start: number; count: number }>();
const MAX_CALLS_PER_MINUTE = 30;

function configured(): boolean { return !!process.env.FIREBASE_PROJECT_ID?.trim(); }
function bootstrap() {
  if (!configured()) throw new Error("FIREBASE_PROJECT_ID is not configured.");
  if (!getApps().length) initializeApp({ credential: applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID });
}
function clientError(res: Response, code: number, message: string) { return res.status(code).json({ error: message }); }

async function requireUser(req: AuthRequest, res: Response, next: NextFunction) {
  const bearer = /^Bearer (.+)$/i.exec(req.get("Authorization") || "");
  if (!bearer) return clientError(res, 401, "تسجيل دخول Firebase مطلوب.");
  if (!configured()) return clientError(res, 503, "إعداد Firebase على الخادم غير مكتمل.");
  try {
    bootstrap();
    const decoded = await getAuth().verifyIdToken(bearer[1], true);
    const now = Date.now();
    // Best-effort per-instance budget; use central rate limiting before a high-traffic launch.
    if (buckets.size > 10000) buckets.clear();
    const old = buckets.get(decoded.uid);
    const entry = old && now - old.start < 60000 ? old : { start: now, count: 0 };
    entry.count++;
    buckets.set(decoded.uid, entry);
    if (entry.count > MAX_CALLS_PER_MINUTE) return clientError(res, 429, "طلبات كثيرة؛ أعيدي المحاولة بعد دقيقة.");
    req.verifiedUser = decoded;
    return next();
  } catch (err: any) {
    if (err?.code?.startsWith("auth/")) return clientError(res, 401, "انتهت جلسة الدخول؛ سجلي الدخول مجدداً.");
    console.error("Authentication service error:", err?.message);
    return clientError(res, 503, "خدمة التحقق غير متاحة حالياً.");
  }
}
function isOwner(user: DecodedIdToken): boolean {
  return !!process.env.OWNER_UID?.trim() && user.uid === process.env.OWNER_UID!.trim();
}
function toDate(value: any): string | null {
  return value && typeof value.toDate === "function" ? value.toDate().toISOString() : null;
}

export function installSecureApi(app: Express) {
  app.get("/api/health", (_req, res) => res.json({
    ok: true, firebaseConfigured: configured(), aiConfigured: !!process.env.GEMINI_API_KEY
  }));
  app.use("/api", requireUser);

  app.get("/api/me/progress", async (req: AuthRequest, res) => {
    try {
      const user = req.verifiedUser!;
      const db = getFirestore();
      const profile = db.collection("users").doc(user.uid);
      await profile.set({
        name: user.name || user.email?.split("@")[0] || "",
        email: user.email || "",
        lastSeen: FieldValue.serverTimestamp(),
      }, { merge: true });
      const snapshot = await db.collection("progress").doc(user.uid).get();
      return res.json({ progress: snapshot.exists ? snapshot.data() : null, isOwner: isOwner(user) });
    } catch (e: any) {
      console.error("Load progress error:", e?.message);
      return clientError(res, 503, "تعذر تحميل التقدم؛ لن تتم الكتابة فوق بياناتك.");
    }
  });

  app.put("/api/me/progress", async (req: AuthRequest, res) => {
    const { answers, daysCompleted, currentPage } = req.body || {};
    const validAnswers = answers && typeof answers === "object" && !Array.isArray(answers) &&
      Object.keys(answers).length <= 60 &&
      Object.entries(answers).every(([key, value]) =>
        /^u[1-5][A-Za-z0-9_]{1,60}$/.test(key) && (typeof value === "boolean" || (typeof value === "string" && value.length <= 3000)));
    if (!validAnswers || !Array.isArray(daysCompleted) || daysCompleted.length !== 12 ||
      !daysCompleted.every((day: any) => typeof day === "boolean") ||
      !Number.isInteger(currentPage) || currentPage < 1 || currentPage > 33)
      return clientError(res, 400, "بيانات التقدم غير صالحة.");
    try {
      await getFirestore().collection("progress").doc(req.verifiedUser!.uid).set({
        answers, daysCompleted, currentPage, updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      return res.json({ saved: true });
    } catch (e: any) {
      console.error("Save progress error:", e?.message);
      return clientError(res, 503, "فشل حفظ التقدم على الخادم.");
    }
  });

  app.get("/api/admin/summary", async (req: AuthRequest, res) => {
    if (!isOwner(req.verifiedUser!)) return clientError(res, 403, "غير مصرح.");
    try {
      const snapshot = await getFirestore().collection("users").limit(100).get();
      const profiles = snapshot.docs.map(doc => ({
        uid: doc.id, name: doc.get("name") || "", email: doc.get("email") || "",
        lastSeen: toDate(doc.get("lastSeen"))
      }));
      return res.json({ students: profiles.length, profiles, limited: snapshot.size === 100 });
    } catch (e: any) {
      console.error("Admin summary error:", e?.message);
      return clientError(res, 503, "تعذر استرجاع بيانات العضويات.");
    }
  });
}
