import React, { useEffect, useState } from "react";
import { apiJson } from "../lib/api";

type Summary = { students: number; limited: boolean; profiles: Array<{ uid: string; email: string; name: string; lastSeen: string | null }> };
type Connection = { connected: boolean; projectId: string; databaseId: string; authVerified: boolean; databaseReadableByServer: boolean; securityRulesVerified: false; note: string };
export default function AdminOverview() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [connection, setConnection] = useState<Connection | null>(null);
  const [checking, setChecking] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const checkConnection = async () => {
    setConnectionError(""); setChecking(true);
    try { setConnection(await apiJson<Connection>("/api/admin/connection-check")); }
    catch (e: any) { setConnectionError(e.message || "تعذر فحص الاتصال"); }
    finally { setChecking(false); }
  };
  useEffect(() => { apiJson<Summary>("/api/admin/summary").then(setSummary).catch(e => setError(e.message)); }, []);
  return <section dir="rtl" className="p-5 rounded-2xl bg-white border mb-5 space-y-3">
    <h2 className="font-black text-lg">سجل الأعضاء الحقيقي — قراءة فقط</h2>
    <p className="text-sm text-slate-600">هذه قائمة حسابات Firebase المسجلة؛ لا تُضاف بيانات ضيوف المحاكاة.</p>
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
      <button type="button" disabled={checking} onClick={checkConnection}
        className="rounded-lg bg-[#0b1d33] text-white px-4 py-2 text-sm disabled:opacity-50">
        {checking ? "جارٍ فحص Firebase..." : "فحص اتصال Firebase (قراءة فقط)"}
      </button>
      {connectionError && <p role="alert" className="text-red-700 text-sm">{connectionError}</p>}
      {connection && <div role="status" className="text-sm space-y-1 break-words">
        <p>اتصال حساب المالكة والخادم: {connection.connected && connection.authVerified ? "نجح" : "غير متحقق"}</p>
        <p>المشروع: <code>{connection.projectId}</code></p>
        <p>قاعدة البيانات: <code>{connection.databaseId}</code></p>
        <p className="text-amber-800">قواعد وصول المتصفح: لم تُفحص؛ Admin SDK يتجاوز القواعد. لا تعتمدي على هذا الاختبار لإطلاق المنصة تجارياً.</p>
      </div>}
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!summary && !error && <p>جارٍ جلب البيانات...</p>}
    {summary && <><p className="font-bold">الحسابات المسترجعة: {summary.students}{summary.limited ? " (أول 100 حساب فقط)" : ""}</p>
      <div className="overflow-x-auto"><table className="w-full text-sm text-right"><thead><tr><th>الاسم</th><th>البريد</th><th>آخر نشاط</th></tr></thead>
      <tbody>{summary.profiles.map(p => <tr key={p.uid} className="border-t"><td className="p-2">{p.name || "—"}</td><td className="p-2">{p.email}</td><td className="p-2">{p.lastSeen || "—"}</td></tr>)}</tbody></table></div>
    </>}
  </section>;
}
