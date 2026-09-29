import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "../lib/firebase";

interface StudentLoginProps {
  onLoginSuccess: (student: any) => void;
  lang?: string;
}
export default function StudentLogin({ onLoginSuccess }: StudentLoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebaseAuth) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "register") {
        if (name.trim().length < 2) throw new Error("اكتبي الاسم قبل إنشاء الحساب.");
        const result = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      }
    } catch (e: any) { setError(e.code ? `تعذر الدخول: ${e.code}` : e.message); }
    finally { setBusy(false); }
  };
  const googleSignIn = async () => {
    if (!firebaseAuth) return;
    setBusy(true); setError("");
    try { await signInWithPopup(firebaseAuth, new GoogleAuthProvider()); }
    catch (e: any) { setError(`تعذر الدخول عبر Google: ${e.code || e.message}`); }
    finally { setBusy(false); }
  };
  const resetPassword = async () => {
    if (!firebaseAuth || !email.trim()) { setError("أدخلي البريد الإلكتروني أولاً."); return; }
    setBusy(true); setError("");
    try { await sendPasswordResetEmail(firebaseAuth, email.trim()); setNotice("إذا كان البريد مسجلاً فستصلك رسالة إعادة تعيين كلمة المرور."); }
    catch (e: any) { setError(`تعذر إرسال الرسالة: ${e.code || e.message}`); }
    finally { setBusy(false); }
  };
  return <div className="min-h-[70vh] flex items-center justify-center p-4" dir="rtl">
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-slate-200 p-7 space-y-5">
      <h2 className="text-2xl font-black text-[#0b1d33]">أكاديمية مريم الرقمية</h2>
      <p className="text-sm text-slate-600">حساب حقيقي لحفظ كراستك وتقدمك بشكل مستقل.</p>
      {!firebaseConfigured ? <div role="alert" className="p-4 bg-amber-50 text-amber-950 rounded-xl border border-amber-200 text-sm">
        لم تُضبط إعدادات Firebase بعد. لا يمكن تسجيل حسابات حقيقية حتى توصيل المشروع بخدمة المصادقة.
        لا تدخلي كلمات مرور في وضع العرض التجريبي.
      </div> : <>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 p-2 rounded-xl ${mode === "login" ? "bg-[#0b1d33] text-white" : "bg-slate-100"}`}>تسجيل الدخول</button>
          <button type="button" onClick={() => setMode("register")} className={`flex-1 p-2 rounded-xl ${mode === "register" ? "bg-[#0b1d33] text-white" : "bg-slate-100"}`}>إنشاء حساب</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && <label className="block text-sm">الاسم<input autoComplete="name" required minLength={2} value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl mt-1" /></label>}
          <label className="block text-sm">البريد الإلكتروني<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl mt-1" /></label>
          <label className="block text-sm">كلمة المرور<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl mt-1" /></label>
          <button type="submit" disabled={busy} className="w-full p-3 bg-[#0b1d33] text-white font-bold rounded-xl disabled:opacity-50">{busy ? "جارٍ التحقق..." : mode === "login" ? "دخول" : "إنشاء الحساب"}</button>
        </form>
        <button type="button" disabled={busy} onClick={googleSignIn} className="w-full p-3 border rounded-xl">الدخول بحساب Google الحقيقي</button>
        <button type="button" disabled={busy} onClick={resetPassword} className="text-sm underline text-blue-800">نسيت كلمة المرور؟</button>
      </>}
      {import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO === "true" && (
        <button type="button" onClick={() => onLoginSuccess({ uid: "demo", name: "ضيف تجريبي", email: "", tier: "Demo", demo: true })}
          className="w-full p-3 bg-slate-100 rounded-xl border border-dashed">تجربة محلية فقط — ليست حساباً حقيقياً ولا تحفظ بيانات على الخادم</button>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="text-sm text-green-700">{notice}</p>}
      <p className="text-xs text-slate-500">إنشاء الحساب لا يمنح وصولاً مدفوعاً تلقائياً. الهاتف وFacebook غير مفعلين إلى حين إعداد تحقق حقيقي.</p>
    </div>
  </div>;
}
