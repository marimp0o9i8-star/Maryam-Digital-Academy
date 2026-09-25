import React, { useEffect, useState } from "react";
import { apiJson } from "../lib/api";

type Summary = { students: number; limited: boolean; profiles: Array<{ uid: string; email: string; name: string; lastSeen: string | null }> };
export default function AdminOverview() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiJson<Summary>("/api/admin/summary").then(setSummary).catch(e => setError(e.message)); }, []);
  return <section dir="rtl" className="p-5 rounded-2xl bg-white border mb-5 space-y-3">
    <h2 className="font-black text-lg">سجل الأعضاء الحقيقي — قراءة فقط</h2>
    <p className="text-sm text-slate-600">هذه قائمة حسابات Firebase المسجلة؛ لا تُضاف بيانات ضيوف المحاكاة.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!summary && !error && <p>جارٍ جلب البيانات...</p>}
    {summary && <><p className="font-bold">الحسابات المسترجعة: {summary.students}{summary.limited ? " (أول 100 حساب فقط)" : ""}</p>
      <div className="overflow-x-auto"><table className="w-full text-sm text-right"><thead><tr><th>الاسم</th><th>البريد</th><th>آخر نشاط</th></tr></thead>
      <tbody>{summary.profiles.map(p => <tr key={p.uid} className="border-t"><td className="p-2">{p.name || "—"}</td><td className="p-2">{p.email}</td><td className="p-2">{p.lastSeen || "—"}</td></tr>)}</tbody></table></div>
    </>}
  </section>;
}
