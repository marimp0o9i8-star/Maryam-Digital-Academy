import React, { useState } from "react";
import { Download, FileText, CheckCircle, Copy, Sparkles, Trash2, HelpCircle } from "lucide-react";
import { WorksheetAnswers } from "../types";

interface WorkbookProps {
  answers: WorksheetAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WorksheetAnswers>>;
  resetAnswers: () => void;
}

export default function Workbook({ answers, setAnswers, resetAnswers }: WorkbookProps) {
  const [activeTab, setActiveTab] = useState<"unit1" | "unit2" | "unit3" | "unit4" | "unit5">("unit1");
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof WorksheetAnswers, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate markdown/text blueprint for easy copying/exporting
  const getCompiledBlueprint = () => {
    return `=====================================================
📊 مسودة مشروعي الرقمي المتكامل - رحلة الـ 14 يوماً
=====================================================
المؤلف والمؤسس: ${answers.u5BrandName || "[لم يحدد الاسم بعد]"}
العلامة التجارية: ${answers.u5BrandName || "[لم يحدد الاسم بعد]"}

-----------------------------------------------------
💡 المرحلة الأولى: تصميم الفكرة واستهداف السوق
-----------------------------------------------------
1. المشكلة التي يحلها دليلي للعملاء:
${answers.u1Problem || "لم يتم التفصيل بعد..."}

2. الجمهور المستهدف المخصص:
${answers.u1Customer || "لم يتم التفصيل بعد..."}

3. الحل المعرفي والقيمة المقترحة:
${answers.u1Solution || "لم يتم التفصيل بعد..."}

4. شكل وتنسيق المنتج الرقمي:
${
  answers.u1Format === "pdf"
    ? "كتيب PDF إرشادي مبسط ومباشر"
    : answers.u1Format === "templates"
    ? "حزمة قوالب جاهزة قابلة للتعديل والنسخ"
    : answers.u1Format === "mini-course"
    ? "دورة مسجلة مصغرة وباقات تحدي"
    : answers.u1Format === "files"
    ? "ملفات وأدوات معالجة خاصة مجهزة"
    : "لم تختر الشكل بعد..."
}

-----------------------------------------------------
🛠️ المرحلة الثانية: إنتاج وتصميم المنتج الرقمي
-----------------------------------------------------
• اسم المنتج النهائي المعتمد: ${answers.u2SelectedIdea || "[لم يكتب الاسم بعد]"}
• حالة إنتاج وتصميم الملف:
- تجميع وكتابة المادة النقاشية: ${answers.u2Gathered ? "✅ مكتمل" : "❌ قيد العمل"}
- الهيكلة ومراجعة الأبواب والأمثلة: ${answers.u2Structured ? "✅ مكتمل" : "❌ قيد العمل"}
- تصميم الغلاف وتعديل Canva: ${answers.u2Designed ? "✅ مكتمل" : "❌ قيد العمل"}
- جاهزية المنتج للبيع المبدئي: ${answers.u2ReadyToSell ? "✅ جاهز تماماً" : "❌ في الانتظار"}

-----------------------------------------------------
🏪 المرحلة الثالثة: إعداد المتجر الإلكتروني بـ Gumroad
-----------------------------------------------------
• المنصة المختارة لاستقبال الأموال والتسليم: ${answers.u3StorePlatform ? answers.u3StorePlatform.toUpperCase() : "لم تحدد بعد"}
• اسم العرض الترويجي للمنتج: ${answers.u3ProductName || "[لم يكتب بعد]"}
• السعر المحدد لصفحة الشراء: $${answers.u3ProductPrice || "29"}
• وصف صفحة البيع المقنع (الفوائد والوعود):
${answers.u3ProductDescription || "لم يكتب الوصف بعد..."}

-----------------------------------------------------
📢 المرحلة الرابعة: خطة التسويق وجذب الجمهور
-----------------------------------------------------
• التزامات وجاهزية محرك النشر الترويجي:
- جدولة أول 10 منشورات تيك توك: ${answers.u4MarketingPosts ? "✅ مكتمل وجاهز" : "❌ قيد العمل"}
- صياغة رسائل الواتس دافئة للعلاقات: ${answers.u4WhatsappMessage ? "✅ مكتمل" : "❌ قيد العمل"}
- الالتزام التام بنشر المحتوى التعليمي بمبدأ 80/20: ${answers.u4SevenDayPlan ? "✅ نعم، متقن" : "❌ قيد الإدراج"}
- حالة النشر الأولي والتعرف على المشترين: ${answers.u4ChecklistSharedContent ? "✅ تم النشر الفوري" : "❌ قيد البث"}

-----------------------------------------------------
🚀 المرحلة الخامسة: التوسع المستدام والشهادات
-----------------------------------------------------
• اسم البراند والعلامة: ${answers.u5BrandName || "[لم يتم التفصيل]"}
• الفكرة القادمة والحزمة للتوسع: ${answers.u5NextIdea || "لم تقرر بعد"}
• رسالة الشكر والتسليم التلقائي للمشتري:
${answers.u5ThankYouMessage || "لم يتم كتابة رسالة الشكر للتلقيم التلقائي..."}

=====================================================
* تم تصميم وصياغة مسودتك بواسطة 'منصة الدليل للمنتجات الرقمية' مريم ناهي حسن 2026.
=====================================================`;
  };

  const handleCopyCompiledBlock = () => {
    navigator.clipboard.writeText(getCompiledBlueprint());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#0b1d33] flex items-center gap-2">
            <span>📓 كراسة مسودة التخطيط المتكاملة</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            صمم خطة أعمالك وعصفك الذهني، وسيتم دمج وحفظ بياناتك لإطلاق منتجك
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyCompiledBlock}
            className="flex items-center gap-1.5 bg-[#0b1d33] hover:bg-[#163359] text-white px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-sm"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "تم النسخ بنجاح!" : "تصدير المسودة وتجميعها"}</span>
          </button>
          
          <button
            onClick={() => {
              if (window.confirm("هل أنت متأكد من رغبتك في تفريغ وحذف جميع بيانات مسودتك الحالية؟ هذا الإجراء لا يمكن تراجعه.")) {
                resetAnswers();
              }
            }}
            className="flex items-center gap-1 text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف الأوراق</span>
          </button>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation panel */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pr-2">وحدات المنهج</span>
          
          {[
            { id: "unit1", label: "💡 الوحدة 1: الفكرة والسوق" },
            { id: "unit2", label: "🛠️ الوحدة 2: صناعة المنتج" },
            { id: "unit3", label: "🏪 الوحدة 3: بناء منصة المتجر" },
            { id: "unit4", label: "📢 الوحدة 4: عصب التسويق" },
            { id: "unit5", label: "🚀 الوحدة 5: البراند والتوسع" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-right w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0b1d33] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form workspace stage */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          
          {activeTab === "unit1" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0b1d33]">الوحدة الأولى: الفكرة الفعالة ودراسة السوق المربح</h3>
                <p className="text-slate-400 text-xs mt-0.5">اختيار مشكلة حقيقية حيوية لمعالجتها بدليل PDF أو حزمة قوالب ناجحة</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">ما هي المشكلة الواقعية الكبرى التي يشتكي منها جمهورك؟</label>
                <textarea
                  value={answers.u1Problem}
                  onChange={(e) => updateField("u1Problem", e.target.value)}
                  placeholder="اكتب المعاناة أو العقدة التي ستحلها لهم..."
                  rows={3}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">من هو المشتري والعميل المستهدف المحدد بدقة؟</label>
                <input
                  type="text"
                  value={answers.u1Customer}
                  onChange={(e) => updateField("u1Customer", e.target.value)}
                  placeholder="مثال: طلاب الجامعات المقبلين على التخرج، صناع المحتوى في تيك توك..."
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">ما هو الحل المعرفي والقيمة المقترحة لتبسيط طريقهم؟</label>
                <textarea
                  value={answers.u1Solution}
                  onChange={(e) => updateField("u1Solution", e.target.value)}
                  placeholder="صغ الوعد والمخرجات التي سيجدها عملائك داخل ملفك المعرفي..."
                  rows={3}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">ما هو شكل ونظام التسليم للمنتج الرقمي؟</label>
                <select
                  value={answers.u1Format}
                  onChange={(e) => updateField("u1Format", e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                >
                  <option value="">-- اختر التنسيق --</option>
                  <option value="pdf">كتيب PDF وغلاف تجميلي</option>
                  <option value="templates">حزم تصميم جاهزة (أوراق أو Canva)</option>
                  <option value="mini-course">دورة مصغرة وقروب إرشادي</option>
                  <option value="files">أدوات وبرمجة وجداول معالجة</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تذكر: المشترون لا يبحثون عن عبقرية الفكرة، بل يبحثون بنهم عن حلول لضياع أوقاتهم وتوجيه خطواتهم بسرعة.
                </p>
              </div>
            </div>
          )}

          {activeTab === "unit2" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0b1d33]">الوحدة الثانية: إنشاء وتصنيف وصناعة المحتوى الرقمي</h3>
                <p className="text-slate-400 text-xs mt-0.5">خطوات جمع وتصميم مادتك وتصدير دليلك عبر Google Docs و Canva مجاناً</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">أدخل اسم المنتج الرقمي النهائي المختار لتحدي الـ 14 يوماً:</label>
                <input
                  type="text"
                  value={answers.u2SelectedIdea}
                  onChange={(e) => updateField("u2SelectedIdea", e.target.value)}
                  placeholder="مثال: خطة 12 خطوة لصناعة محتوى التميز بإنستا..."
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">أتممت الخطوات التصنيعية المجدولة بنظام الـ 3 أيام؟</label>
                {[
                  { id: "u2Gathered" as keyof WorksheetAnswers, label: "أكملت جمع وكتابة المسودة الأولى لتدوينات المخرجات [اليوم الأول]" },
                  { id: "u2Structured" as keyof WorksheetAnswers, label: "أتممت تقسيم وتفريع المادة لـ 3 إلى 5 فصول جذابة خالية من الحشو [اليوم الثاني]" },
                  { id: "u2Designed" as keyof WorksheetAnswers, label: "استعنت بـ Canva لتصميم وتنسيق الغلاف الرائع وتصدير الملف بصيغة PDF [اليوم الثالث]" },
                  { id: "u2ReadyToSell" as keyof WorksheetAnswers, label: "المنتج المعرفي مكثف ووافر القيمة وجاهز للاختبار والبيع" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-slate-50 transition border border-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={!!answers[item.id]}
                      onChange={(e) => updateField(item.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-550"
                    />
                    <span className="text-slate-700 text-xs sm:text-sm select-none leading-relaxed">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "unit3" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0b1d33]">الوحدة الثالثة: إعداد منصة متجرك وبوابات الدفع</h3>
                <p className="text-slate-400 text-xs mt-0.5">ربط Gumroad بنقرات ووضع العروض التسويقية وأسعار الخصم</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">شريك المتجر الإلكتروني المفضل:</label>
                  <select
                    value={answers.u3StorePlatform}
                    onChange={(e) => updateField("u3StorePlatform", e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                  >
                    <option value="">-- اختر شريك الدفع --</option>
                    <option value="gumroad">Gumroad (أسهل ويقوم بالتسليم آلياً)</option>
                    <option value="payhip">Payhip (بديل ممتاز بعمولة 5% فقط)</option>
                    <option value="shopify">Shopify (براند متكامل يتطلب اشتراكاً)</option>
                    <option value="other">منصات محلية أو صيد يدوي</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">اسم الغلاف والعرض بصفحة المبيعات:</label>
                  <input
                    type="text"
                    value={answers.u3ProductName}
                    onChange={(e) => updateField("u3ProductName", e.target.value)}
                    placeholder="مثال: الدليل الشامل لرواد إنستغرام لإنتاج الفكرة..."
                    className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">السعر المحدد للشراء (بالدولار):</label>
                  <input
                    type="number"
                    value={answers.u3ProductPrice}
                    onChange={(e) => updateField("u3ProductPrice", e.target.value)}
                    placeholder="29"
                    className="w-full text-xs sm:text-sm p-4 border border-[#cbd5e1] rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">صياغة وصف المنتج (ركز على معالجة المشكلة والفوائد لا المواصفات):</label>
                <textarea
                  value={answers.u3ProductDescription}
                  onChange={(e) => updateField("u3ProductDescription", e.target.value)}
                  placeholder="مثال: ستتمكن بالداخل من اتباع منهج يومي يخلصك من التشتت تماماً، مع قوالب بونص وحاسبات جاهزة للأعمال..."
                  rows={4}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>
            </div>
          )}

          {activeTab === "unit4" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0b1d33]">الوحدة الرابعة: التسويق الإقناعي الذكي بالمحتوى</h3>
                <p className="text-slate-400 text-xs mt-0.5">تلقي أول مبيعات بجدولة خطط تيك توك وتواصل الدائرة ورعاية العملاء الأوائل</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">حالة النشر والترويج اليومي:</label>
                {[
                  { id: "u4MarketingPosts" as keyof WorksheetAnswers, label: "صممت وجدولث أول 10 منشورات معلومات تعليمية لبروفايلي" },
                  { id: "u4WhatsappMessage" as keyof WorksheetAnswers, label: "أكملت صياغة وإرسال رسائل الواتس دافئة لقروباتي المهتمة بالنمو" },
                  { id: "u4SevenDayPlan" as keyof WorksheetAnswers, label: "لدي خطة عمل مستقرة لـ 7 أيام متواصلة لبث الحلول بالفيديو" },
                  { id: "u4ChecklistSharedContent" as keyof WorksheetAnswers, label: "نشرت فيديو واحد على الأقل يطرح المشكلة والحل ودعوة البايو" },
                  { id: "u4ChecklistReachedOut" as keyof WorksheetAnswers, label: "تواصلت وطرحت نقاشات وحلول بداخل قروبات تليغرام وفيسبوك" },
                  { id: "u4ChecklistSentLink" as keyof WorksheetAnswers, label: "شاركت رابط متجر Gumroad ليكون متاحاً وسهلاً للنقر السريع" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-slate-50 transition border border-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={!!answers[item.id]}
                      onChange={(e) => updateField(item.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-550"
                    />
                    <span className="text-slate-700 text-xs sm:text-sm select-none leading-relaxed">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "unit5" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0b1d33]">الوحدة الخامسة: التوسع وبناء هيبة البراند</h3>
                <p className="text-slate-400 text-xs mt-0.5">رفع الأسعار، صياغة الاسترداد والتسليم، وتوليد الفكرة المعرفية القادمة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">اسم البراند / الهوية المفضلة لعلامتك الرقمية:</label>
                  <input
                    type="text"
                    value={answers.u5BrandName}
                    onChange={(e) => updateField("u5BrandName", e.target.value)}
                    placeholder="مثال: منارة الأكاديمية الرقمية، مريم تيك..."
                    className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">تطلعات فكرة منتجك وحزمتك الرقمية القادمة:</label>
                  <input
                    type="text"
                    value={answers.u5NextIdea}
                    onChange={(e) => updateField("u5NextIdea", e.target.value)}
                    placeholder="مثال: شروحات مسجلة لتصميم قوالب Canva خطوة بخطوة..."
                    className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">رسالة الشكر والتحميل التلقائي (تلقى فور المبيعة):</label>
                <textarea
                  value={answers.u5ThankYouMessage}
                  onChange={(e) => updateField("u5ThankYouMessage", e.target.value)}
                  placeholder="مرحباً بك وشكراً لثقتك ودعمك! يسعدنا إنجازك لخططنا الإرشادية، للتفاصيل والدعم يسعدنا تواصلك على حسابي..."
                  rows={4}
                  className="w-full text-xs sm:text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">مرحلة ترقية وبناء الخطط الكبرى التوسعية:</label>
                {[
                  { id: "u5PricingPlan" as keyof WorksheetAnswers, label: "سأطلب شهادات المشترين الأوائل وسأقوم برفع السعر لـ 39$ أو 49$" },
                  { id: "u5NewProductIdeaChecked" as keyof WorksheetAnswers, label: "سجلت وحللت أوجاع من اشتروا دليلي لتوفير مكملات ممتازة ومثمرة لهم" },
                  { id: "u5EmailListChecked" as keyof WorksheetAnswers, label: "ربطت وجمعت بريد قنواتي بـ Mailchimp للاعتماد والملكية للأبد" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-slate-50 transition border border-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={!!answers[item.id]}
                      onChange={(e) => updateField(item.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-555"
                    />
                    <span className="text-slate-700 text-xs sm:text-sm select-none leading-relaxed">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Blueprint visualizer frame */}
      <div className="bg-[#0b1d33] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#f2a900] text-[#0b1d33] rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-100">مخرجات مخطط أعمالي (Live Business Blueprint)</h3>
            <p className="text-slate-400 text-xs mt-0.5">معاينة نصية ملخصة لخطتكم ومسودتكم كاملة</p>
          </div>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[10px] sm:text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 border border-slate-800 select-all">
          {getCompiledBlueprint()}
        </pre>
      </div>
    </div>
  );
}
