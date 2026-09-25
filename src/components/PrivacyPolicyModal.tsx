import React from "react";
import { X, ShieldCheck } from "lucide-react";

interface PrivacyPolicyModalProps { isOpen: boolean; onClose: () => void; lang?: string; }
export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70" dir="rtl">
    <section role="dialog" aria-modal="true" aria-labelledby="privacy-heading" className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <header className="flex justify-between items-center p-5 bg-[#0b1d33] text-white rounded-t-3xl">
        <h2 id="privacy-heading" className="font-black flex items-center gap-2"><ShieldCheck size={20}/> معلومات الخصوصية — نسخة تمهيدية</h2>
        <button onClick={onClose} aria-label="إغلاق" className="p-2 rounded-lg hover:bg-slate-700"><X size={20}/></button>
      </header>
      <div className="p-6 text-sm text-slate-700 leading-7 space-y-4">
        <p>تستخدم النسخة المهيأة للنشر Firebase Authentication للمصادقة وخادم التطبيق للتحقق من رمز الجلسة. تُخزن بيانات حسابك (الاسم والبريد الإلكتروني) وتقدمك في كراسة العمل وأيام التحدي وصفحة القراءة داخل Firestore، تحت معرّف حسابك.</p>
        <p>لا يُمنح متصفح الطالب اتصالاً مباشراً بقاعدة البيانات؛ يجري الخادم التحقق من جلسة Firebase لكل طلب. لا تتضمن هذه البنية تشفيراً كاملاً من طرف إلى طرف؛ لذلك لا تكتبي كلمات مرور أو أسراراً تجارية أو معلومات شخصية حساسة في الكراسة أو محادثات الذكاء الاصطناعي.</p>
        <p>عند استخدام المستشار أو أدوات التوليد، يرسل التطبيق نص طلبك وسياقه إلى خدمة Gemini من Google لمعالجته. راجعي شروط وخصوصية مزود الخدمة قبل مشاركة معلومات خاصة.</p>
        <p>تستطيعين تعديل كراستك ومسح محتواها من واجهة التطبيق. حذف حساب Firebase وبيانات الخادم نهائياً ليس متاحاً بزر ذاتي في هذه النسخة؛ يحتاج مسار طلب حذف ومراجعة تشغيلية قبل الإطلاق التجاري.</p>
        <p>لا توجد بوابة دفع إنتاجية أو سياسة استرداد مفعّلة في هذا الإصدار. ستُنشر شروط شراء واسترداد فعلية قبل تفعيل المبيعات. لا توجد شهادة امتثال أو ضمان أمني مطلق تدعيه هذه الصفحة.</p>
        <p className="bg-amber-50 p-3 rounded-xl border border-amber-200">هذا الوصف يعكس البنية المقترحة على فرع التطوير عند ضبط Firebase وCloud Run؛ لا يعني أن النشر الحالي قد حصل على هذه التغييرات قبل الدمج والاختبار.</p>
      </div>
      <footer className="p-4 border-t"><button onClick={onClose} className="px-5 py-2 bg-[#0b1d33] rounded-lg text-white">إغلاق</button></footer>
    </section>
  </div>;
}
