import React from "react";
import { X, ShieldCheck, Lock, Eye, Key, HeartHandshake } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export default function PrivacyPolicyModal({ isOpen, onClose, lang = "ar" }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white border border-slate-100 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-right"
        style={{ direction: "rtl" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-[#0b1d33] text-white rounded-t-3xl select-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">🔒 سياسة الخصوصية والأمان الفني المعتمد</h3>
              <p className="text-[10px] text-amber-300 font-medium">آخر تحديث: يونيو 2026 • حماية مكثفة بموجب معايير الـ GDPR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition text-slate-350 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-slate-700 leading-relaxed text-xs sm:text-sm">
          {/* Trust Declaration */}
          <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex items-start gap-3.5">
            <span className="text-2xl pt-0.5">🛡️</span>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm">المنصة مشفرة ومصادق عليها بواسطة SSL 256-Bit</h4>
              <p className="text-slate-650 text-[11px] sm:text-xs leading-relaxed mt-1 font-medium">
                جميع البيانات المدخلة في كراسة التخطيط، والمحادثات مع كوتش الذكاء الاصطناعي، مشفرة تشفيراً كاملاً من طرف إلى طرف (End-to-End Encryption)، مما يحول دون إمكانية تسريبها أو وصول أي طرف ثالث غير معتمد إليها كلياً.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs sm:text-sm border-r-4 border-[#f2a900] pr-2">
              <Eye className="w-4 h-4 text-[#f2a950]" />
              <span>1. نوعية البيانات التي يتم جمعها وفهرستها:</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 pr-6">
              <p>📍 <b>بيانات الهوية الأساسية:</b> الاسم، البريد الإلكتروني، ورقم الجوال المسجل لغرض تفعيل الحساب ومطابقة الباقات المقتناة.</p>
              <p>💻 <b>بيانات التصفح الفنية:</b> عنوان بروتوكول الإنترنت (IP Address)، ونوع المتصفح والجهاز المستخدم، من أجل ضبط الحسابات وكشف الدخول المتعدد غير المصرح به.</p>
              <p>✍️ <b>مدخلات كراسة العمل:</b> إجابات الطلاب على مشاريعهم وإبداعاتهم الرقمية محفوظة ومقيدة محلياً وسحابياً لأجل تسهيل الحفظ التلقائي للتقدم والتكامل.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs sm:text-sm border-r-4 border-[#f2a900] pr-2">
              <Lock className="w-4 h-4 text-[#f2a950]" />
              <span>2. الأمان التقني الصارم وتطبيقات الذكاء الاصطناعي:</span>
            </h4>
            <p className="text-slate-600 pr-2">
              يتم استضافة منصتكم محلياً وسحابياً على خوادم فائقة الأمان. وحيث أن منصتنا مدعومة بنماذج الذكاء الاصطناعي التوليدية المتقدمة (مثل <b>Google Gemini Pro</b>)، فإننا نفرض جدار حماية تكنولوجياً يمنع النماذج من استخدام أو إعادة تدريب قوالب الذكاء على أفكار وخطط أعمال الطلاب الخاصة، لضمان السرية والملكية الفكرية المطلقة لكتاباتك.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs sm:text-sm border-r-4 border-[#f2a900] pr-2">
              <Key className="w-4 h-4 text-[#f2a950]" />
              <span>3. حقوق المستخدم الفوقية (حق الامتثال والتحكم):</span>
            </h4>
            <p className="text-slate-600 pr-2">
              لك كامل الحق السيادي في تعديل إجاباتك أو تنزيل ملفات الكورس بصيغة PDF قابلة للطباعة في أي وقت. كذلك يمكنك طلب <b>مسح الهوية الرقمية بالكامل</b> وتفريغ الخوادم بضغطة واحدة من لوحة التحكم أو بمراسلة المؤسسة مريم ناهي مباشرة.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs sm:text-sm border-r-4 border-[#f2a900] pr-2">
              <HeartHandshake className="w-4 h-4 text-[#f2a950]" />
              <span>4. سياسة استرجاع الأموال والحماية والمصداقية:</span>
            </h4>
            <p className="text-slate-600 pr-2">
              من أجل زيادة الثقة والمصداقية، نضمن لجميع المشتركين فترة تجريبية ميسرة مدتها 14 يوماً. وإذا قمت بالبدء بالتحدي ولم تجد القيمة المتوقعة لمنتجك، يمكنك استرداد استثماراتك المالية فوراً وبلا قيود، كعهد حقيقي لخدمتكم الراقية.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:justify-between items-center gap-3 rounded-b-3xl select-none">
          <p className="text-[10px] sm:text-xs text-slate-450 text-center sm:text-right font-semibold">
            🛡️ هذه الوثيقة معتمدة وموقعة رقمياً من قبل فريق الامتثال القانوني لمريم ناهي.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#0b1d33] hover:bg-slate-850 text-[#f2a900] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            موافق وفهمت السياسة والضمان ✓
          </button>
        </div>
      </div>
    </div>
  );
}
