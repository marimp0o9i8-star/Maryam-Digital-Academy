import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, BookOpen, AlertCircle, Copy, Check, Lightbulb, ExternalLink } from "lucide-react";
import { BOOK_PAGES, ChapterPage } from "../data/bookChapters";
import { WorksheetAnswers } from "../types";

const LAUNCH_LEVERAGE_WISDOMS = [
  {
    title: "قوة الرافعة المالية والزمنية الذكية 🚀",
    text: "البدء بميزانية صفر تجربة عظيمة لتعلم الأساسيات، لكن تذكر: لا يوجد نجاح حقيقي مبهر دون إضافة استثمار مالي يسير يرسّ مفاصل مشروعك. إنفاق مبلغ ملائم على باقة متميزة أو قوالب عملية يزيل عن كاهلك عقبات تقنية شاقة، ويجعل إطلاق منتجك الأول أمراً بغاية السهولة والمتعة والمصداقية كبراند حقيقي!"
  },
  {
    title: "المشروع الاحترافي مقابل شهور التخبط اليدوي 💎",
    text: "الامتياز الفعلي يكمن في تقدير وقتك وعزيمتك الذهنية. الاشتراك في أداة مساعدة أو تفعيل باقة مدفوعة مبسطة ليس منفذاً للاستغلال، بل هو خطوة ذكية تمنحك طاقة رافعة هائلة وتلقائية وسلسة في حصد المبيعات والجمهور دون تعب. الاستثمار البسيط اليوم هو المحرك الذي يأتي بطمأنينة الغد الفورية."
  },
  {
    title: "سرعة الأتمتة وجني الأرباح الأوتوماتيكية ⚡",
    text: "بوابة الكسب السهل لا تطلب ملايين الريالات أو الدنانير، بل خطوة مسبقة شجاعة ومدروسة. تفعيل باقة أو دومين خاص يعطيك مصداقية فورية لدى الزبائن لم تكن لتحصدها بالخيارات الخرساء. تزويد أدواتك بإضافة يسيرة كفيل بنقلك من مقام الهاوي إلى رائد الأعمال الرقمي الاحترافي."
  },
  {
    title: "التكامل بين الخطط المجانية واللمسات السحرية 🌟",
    text: "المرونة هي سر اللعبة: صمّم غلاف كتابك مجاناً عبر Canva، ونظّم محتواك بـ Google Docs، ووفر تركيزك للاستثمار في دومين جذاب أو ترقية باقة دفع تضاعف مبيعاتك 5 أضعاف. أنت لا تستغنى عن النقود، أنت تشتري نظاماً كاملاً يعمل لأجلك على مدار الساعة."
  }
];

interface BookReaderProps {
  answers: WorksheetAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WorksheetAnswers>>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  daysCompleted: boolean[];
  toggleDayCompleted: (dayIndex: number) => void;
}

export default function BookReader({
  answers,
  setAnswers,
  currentPage,
  setCurrentPage,
  daysCompleted,
  toggleDayCompleted,
}: BookReaderProps) {
  const page = BOOK_PAGES.find((p) => p.pageNum === currentPage) || BOOK_PAGES[0];

  const [affiliateLinks, setAffiliateLinks] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("digital_guide_affiliate_links_v1");
      if (saved) {
        setAffiliateLinks(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentPage]);

  const getToolUrl = (key: string) => {
    const defaultUrls: Record<string, string> = {
      canva: "https://www.canva.com",
      gumroad: "https://gumroad.com",
      chatgpt: "https://chatgpt.com",
      gdocs: "https://docs.google.com",
      notion: "https://notion.so",
      capcut: "https://capcut.com",
      mailchimp: "https://mailchimp.com",
      payhip: "https://payhip.com",
      gemini: "https://gemini.google.com",
      stripe: "https://stripe.com"
    };

    if (affiliateLinks && affiliateLinks[key]) {
      return affiliateLinks[key];
    }
    return defaultUrls[key] || "https://google.com";
  };

  const handleTrackToolClick = (key: string) => {
    try {
      const saved = localStorage.getItem("digital_guide_affiliate_clicks_v1");
      const clicks = saved ? JSON.parse(saved) : {};
      clicks[key] = (clicks[key] || 0) + 1;
      localStorage.setItem("digital_guide_affiliate_clicks_v1", JSON.stringify(clicks));
    } catch (e) {
      console.error(e);
    }
  };

  const getToolsForCurrentPage = () => {
    // Collect all page text to search
    let textToSearch = (page.title || "") + " " + (page.unitTitle || "");
    if (page.content) {
      page.content.forEach((item: any) => {
        if (item.text) textToSearch += " " + item.text;
        if (item.quoteText) textToSearch += " " + item.quoteText;
        if (item.badgeText) textToSearch += " " + item.badgeText;
        if (item.items) textToSearch += " " + item.items.join(" ");
        if (item.headers) textToSearch += " " + item.headers.join(" ");
        if (item.rows) textToSearch += " " + item.rows.flat().join(" ");
      });
    }

    textToSearch = textToSearch.toLowerCase();

    const candidates = [
      { name: "Canva Pro", key: "canva", icon: "🎨", label: "افتح منصة Canva لبدء التصميم الفوري", keywords: ["canva", "كانفا", "تصميم", "غلاف"] },
      { name: "Gumroad Store", key: "gumroad", icon: "🛍️", label: "افتح Gumroad للتسليم التلقائي وإتمام البيع", keywords: ["gumroad", "جومرود", "غامرود", "متجر", "بوابة"] },
      { name: "ChatGPT Elite", key: "chatgpt", icon: "🤖", label: "استعن بـ ChatGPT لصياغة ونحت دليلك الرقمي", keywords: ["chatgpt", "gpt", "شات", "مساعد"] },
      { name: "Google Docs", key: "gdocs", icon: "📝", label: "افتح مستندات Google Docs لبدء تدوينك المصفى", keywords: ["docs", "جوجل", "قوقل", "كتابة", "مستند"] },
      { name: "Notion Premium", key: "notion", icon: "📓", label: "استخدم Notion لتنظيم أفكارك وجداول عملك", keywords: ["notion", "نوشن"] },
      { name: "CapCut Pro", key: "capcut", icon: "🎬", label: "صمم فيديوهاتك التسويقية بـ CapCut مجاناً", keywords: ["capcut", "كاب", "فيديو", "مونتاج"] },
      { name: "Mailchimp Pro", key: "mailchimp", icon: "📧", label: "افتح Mailchimp لبث النشرات وبناء القائمة البريدية", keywords: ["mailchimp", "ميل", "بريد", "قائمة"] },
      { name: "Payhip Engine", key: "payhip", icon: "💳", label: "افتح منصة Payhip المستقلة للبيع السريع", keywords: ["payhip", "بايهيب"] },
      { name: "Gemini AI", key: "gemini", icon: "✨", label: "ادخل إلى Google Gemini للبحث والعصف الذهني", keywords: ["gemini", "جميناي"] },
      { name: "Stripe Card", key: "stripe", icon: "💳", label: "تفحص بوابة مدفوعاتك الدولية عبر Stripe", keywords: ["stripe", "سترايب"] }
    ];

    const matchedTools = candidates.filter(tool => {
      return tool.keywords.some(keyword => textToSearch.includes(keyword));
    });

    if (matchedTools.length === 0) {
      return candidates.slice(0, 4);
    }

    return matchedTools;
  };

  const handleNext = () => {
    if (currentPage < BOOK_PAGES.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateField = (field: keyof WorksheetAnswers, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render specific content types based on page requirements
  const renderContentItem = (
    item: ChapterPage["content"][0],
    idx: number
  ) => {
    switch (item.type) {
      case "badge":
        return (
          <div
            key={idx}
            className="inline-block bg-[#f2a900] text-[#0b1d33] font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4 shadow-sm"
          >
            {item.badgeText}
          </div>
        );

      case "paragraph":
        return (
          <p key={idx} className="text-slate-705 leading-relaxed text-sm sm:text-base mb-4 whitespace-pre-line">
            {item.text}
          </p>
        );

      case "quote":
        return (
          <div
            key={idx}
            className="border-r-4 border-[#f2a900] bg-amber-50/60 p-4 rounded-l-xl my-5 text-right font-medium text-slate-700 italic text-sm sm:text-base"
          >
            "{item.quoteText}"
            {item.author && (
              <span className="block text-xs text-slate-400 mt-1 not-italic">
                — {item.author}
              </span>
            )}
          </div>
        );

      case "bullet":
        return (
          <ul key={idx} className="space-y-3 mb-6 pr-4 list-disc list-inside text-slate-700 text-sm sm:text-base">
            {item.items?.map((bullet, bIdx) => {
              const parts = bullet.split(":");
              if (parts.length > 1) {
                return (
                  <li key={bIdx} className="leading-relaxed">
                    <strong className="text-[#0b1d33]">{parts[0]}:</strong>
                    <span>{parts.slice(1).join(":")}</span>
                  </li>
                );
              }
              return (
                <li key={bIdx} className="leading-relaxed">
                  {bullet}
                </li>
              );
            })}
          </ul>
        );

      case "numbered":
        return (
          <ol key={idx} className="space-y-4 mb-6 pr-4 list-decimal list-inside text-slate-700 text-sm sm:text-base">
            {item.items?.map((numItem, nIdx) => {
              const parts = numItem.split(":");
              if (parts.length > 1) {
                return (
                  <li key={nIdx} className="leading-relaxed">
                    <strong className="text-[#0b1d33]">{parts[0]}:</strong>
                    <span>{parts.slice(1).join(":")}</span>
                  </li>
                );
              }
              return (
                <li key={nIdx} className="leading-relaxed">
                  {numItem}
                </li>
              );
            })}
          </ol>
        );

      case "box-gold":
        return (
          <div
            key={idx}
            className="bg-amber-50 border border-amber-200 border-r-4 border-r-[#f2a900] p-4 rounded-l-xl text-slate-700 text-xs sm:text-sm my-5 leading-relaxed whitespace-pre-line"
          >
            {item.text}
          </div>
        );

      case "box-navy":
        return (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 border-r-4 border-r-[#0b1d33] p-4 rounded-l-xl text-slate-700 text-xs sm:text-sm my-5 leading-relaxed whitespace-pre-line"
          >
            {item.text}
          </div>
        );

      case "table":
        return (
          <div key={idx} className="overflow-x-auto my-6 border border-slate-100 rounded-xl">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0b1d33] text-white">
                  {item.headers?.map((header, hIdx) => (
                    <th key={hIdx} className="p-3 font-semibold first:rounded-tr-xl last:rounded-tl-xl">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {item.rows?.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-600 leading-relaxed font-semibold">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "roadmap":
        return (
          <div key={idx} className="space-y-4 my-6">
            {[
              { num: 1, title: "اختيار المنتج الصحيح", dur: "3 - 5 أيام", target: "اختيار فكرة مضمونة وتحقق حلاً حقيقياً للمجهود" },
              { num: 2, title: "إنشاء المنتج الرقمي", dur: "3 - 7 أيام", target: "جمع وتنسيق المادة وتصدير ملف الـ PDF عبر Canva" },
              { num: 3, title: "بناء المتجر الإلكتروني", dur: "يوم واحد", target: "إنشاء حساب على Gumroad ورفع منتجك آلياً" },
              { num: 4, title: "التسويق الذكي والترويج", dur: "7 - 14 يوماً", target: "جلب أول 10 مشترين بمحتوى مجاني بقاعدة 80/20" },
              { num: 5, title: "أول عملية بيع حقيقية", dur: "الهدف المنشود", target: "تلقي تبريكات الشراء واستلام الأموال وتوسيع البراند" },
              { num: 6, title: "بناء العلامة والتوسع", dur: "الاستدامة والشرائح", target: "رفع السعر، تجميع القائمة البريدية، وإطلاق بونصات مكملة" },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0b1d33] text-white flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                    <span className="bg-amber-100 text-[#d69600] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {step.dur}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm">{step.target}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "checklist":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2">
              📝 نظام فرز ومطابقة الفكرة
            </h4>
            {[
              { id: "u1Check1" as keyof WorksheetAnswers, label: "1. هل توجد مشكلة حقيقية واضحة يعاني منها الجمهور؟" },
              { id: "u1Check2" as keyof WorksheetAnswers, label: "2. هل يبحث الناس بنشاط عن حلول ومستعدين للدفع؟" },
              { id: "u1Check3" as keyof WorksheetAnswers, label: "3. هل يمكن تقديم الحل في شكل منتج رقمي سريع (PDF/قالب)؟" },
            ].map((checkItem) => (
              <label
                key={checkItem.id}
                className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <input
                  type="checkbox"
                  checked={!!answers[checkItem.id]}
                  onChange={(e) => updateField(checkItem.id, e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400 accent-[#f2a900]"
                />
                <span className="text-slate-700 text-xs sm:text-sm leading-relaxed select-none">
                  {checkItem.label}
                </span>
              </label>
            ))}
            <div className="bg-amber-50 text-slate-600 text-xs rounded-lg p-3 border border-amber-100 mt-2">
              💡 وجود المنافسين في فكرتك هو أفضل دليل على وجود سوق متعطش للشراء السريع والدوبامين!
            </div>
          </div>
        );

      case "dayGrid":
        return (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {[
              { day: 1, title: "اختيار الفكرة", desc: "اختر فكرة منتج واحدة من قائمة البونص 2 المتوفرة." },
              { day: 2, title: "تحليل المشكلة", desc: "حدد المشكلة الكبرى التي يحلها كتيبك للناس بدقة." },
              { day: 3, title: "تحديد اسم المنتج", desc: "اكتب اسماً رائعاً ووعداً تسويقياً جذاباً تلتزم به." },
              { day: 4, title: "الهيكلة والأبواب", desc: "قسم موضوعك لـ 3 إلى 5 فصول فرعية منظمة." },
              { day: 5, title: "مسودة الكتابة الأولى", desc: "اكتب مسودة نقاطك ومحتواك كاملاً بلا توقف." },
              { day: 6, title: "المراجعة والأمثلة", desc: "صحح الأخطاء اللغوية واضرب أمثلة عملية توضيحية." },
              { day: 7, title: "تصميم الغلاف اللطيف", desc: "صمم غلافاً مبهراً لكتابك وعلامتك عبر Canva." },
              { day: 8, title: "تنسيق الـ PDF", desc: "أكمل تنسيق ملفك وتأكد من جودته وصدره كـ PDF." },
              { day: 9, title: "حساب الـ Gumroad", desc: "سجل حساباً مجانياً على Gumroad لربط بواباتك." },
              { day: 10, title: "رفع المنتج وتسعيره", desc: "تأكد من إدراج سعر منصف ووصف جذاب يبيع." },
              { day: 11, title: "سكريبتات التيك توك", desc: "صمم أول 3 فيديوهات لك لتبدأ المتابعة." },
              { day: 12, title: "مشاركة وبث الرابط", desc: "أرسل رابطك مباشرة لقروبات أو فيسبوك للبداية!" },
            ].map((d, dIdx) => (
              <button
                key={d.day}
                onClick={() => toggleDayCompleted(dIdx)}
                className={`group text-right p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  daysCompleted[dIdx]
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start w-full mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      daysCompleted[dIdx]
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-[#d69600]"
                    }`}
                  >
                    اليوم {d.day}
                  </span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      daysCompleted[dIdx]
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 group-hover:border-amber-400"
                    }`}
                  >
                    {daysCompleted[dIdx] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm mb-1 text-slate-800 group-hover:text-[#0b1d33]">
                    {d.title}
                  </h5>
                  <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2">
                    {d.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );

      case "form-u1":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2 mb-3">
              📝 مسودة الوحدة الأولى: التفاصيل والأفكار
            </h4>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">1. ما هي المشكلة المحددة التي سيعالجها منتجك الرقمي؟</label>
              <textarea
                value={answers.u1Problem}
                onChange={(e) => updateField("u1Problem", e.target.value)}
                placeholder="مثال: صعوبة تنظيم الوقت للموظفين وبناء مشروع جانبي بالتوازي..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">2. من هو جمهورك المستهدف بدقة؟</label>
              <input
                type="text"
                value={answers.u1Customer}
                onChange={(e) => updateField("u1Customer", e.target.value)}
                placeholder="مثال: الموظفون في الخليج المهتمون ببناء دخل رقمي إضافي..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">3. ما هو الحل المعرفي الذي ستقدمه لهم لمنسقك؟</label>
              <textarea
                value={answers.u1Solution}
                onChange={(e) => updateField("u1Solution", e.target.value)}
                placeholder="مثال: دليل PDF بالصور لتنفيذ وبناء أول متجر إلكتروني..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">4. ما هو شكل ونظام صياغة المنتج الرقمي؟</label>
                <select
                  value={answers.u1Format}
                  onChange={(e) => updateField("u1Format", e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                >
                  <option value="">-- اختر شكل منتجك --</option>
                  <option value="pdf">كتيب PDF إرشادي</option>
                  <option value="templates">حزمة قوالب جاهزة (Canva/Excel)</option>
                  <option value="mini-course">دورة مصغرة وتحديات مسجلة</option>
                  <option value="files">ملفات وأدوات معالجة مجهزة</option>
                </select>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 italic">
              * سيتم حفظ بيانات مسودتك تفاعلياً ويمكن تصديرها بالكامل من تبويب كراسة العمل بالأعلى!
            </p>
          </div>
        );

      case "form-u2":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2 mb-3">
              🛠️ مسودة الوحدة الثانية: حركات التصميم والإنتاج
            </h4>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">أدخل الفكرة التي اعتمدتها للعمل اليوم:</label>
              <input
                type="text"
                value={answers.u2SelectedIdea}
                onChange={(e) => updateField("u2SelectedIdea", e.target.value)}
                placeholder="مثال: دليل 30 يوماً للموظفين للتنظيم..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">مراقبة تقدم صناعة وتجهيز الفكرة بداخل أيامك:</label>
              {[
                { id: "u2Gathered" as keyof WorksheetAnswers, label: "أكملت جمع وتنظيم المادة وصياغة تفاصيل النص بالكامل [اليوم 1]" },
                { id: "u2Structured" as keyof WorksheetAnswers, label: "أتممت مراجعة الفصول اللغوية والتأكد من وضوح الأمثلة [اليوم 2]" },
                { id: "u2Designed" as keyof WorksheetAnswers, label: "استعنت بقوالب Canva لتنيسق المخرجات وتصدير كتابي كـ PDF [اليوم 3]" },
                { id: "u2ReadyToSell" as keyof WorksheetAnswers, label: "الملف جاهز ومنقح بالكامل ولو بشكل مبدئي للإرسال" },
              ].map((checkItem) => (
                <label
                  key={checkItem.id}
                  className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={!!answers[checkItem.id]}
                    onChange={(e) => updateField(checkItem.id, e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span className="text-slate-700 text-xs sm:text-sm select-none">
                    {checkItem.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "form-u3":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2 mb-3">
              🏪 مسودة الوحدة الثالثة: إدراج تفاصيل متجرك والوصف
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">شريك المتجر المختار للبدايات:</label>
                <select
                  value={answers.u3StorePlatform}
                  onChange={(e) => updateField("u3StorePlatform", e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                >
                  <option value="">-- اختر المنصة --</option>
                  <option value="gumroad">Gumroad (أسهل ومجاني وموصى به)</option>
                  <option value="payhip">Payhip (عمولة أقل 5% وسريع)</option>
                  <option value="shopify">Shopify (براند احترافي بخيارات متقدمة)</option>
                  <option value="other">منصات أخرى محلية أو مستقلة</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">اسم منتجك الرقمي الترويجي:</label>
                <input
                  type="text"
                  value={answers.u3ProductName}
                  onChange={(e) => updateField("u3ProductName", e.target.value)}
                  placeholder="مثال: الدليل السريع لتنظيم المهام للموظفين..."
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">السعر المقترح للمشترين (بالدولار):</label>
                <input
                  type="number"
                  value={answers.u3ProductPrice}
                  onChange={(e) => updateField("u3ProductPrice", e.target.value)}
                  placeholder="مثال: 29"
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">صياغة مسودة الوصف التسويقي بمتجرك (المنصب على الفائدة والنتيجة بقوة):</label>
              <textarea
                value={answers.u3ProductDescription}
                onChange={(e) => updateField("u3ProductDescription", e.target.value)}
                placeholder="اكتب النتيجة والوعد الذي سيصل له عملائك، والمواد التي سيجدونها بالملف..."
                rows={3}
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>
          </div>
        );

      case "form-u4":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2 mb-3">
              📢 مسودة الوحدة الرابعة: أسلوب ترويج ودعوة جمهورك
            </h4>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">مراقبة وتأكيد إجراءاتك التسويقية لزيادة المشاهدات:</label>
              {[
                { id: "u4MarketingPosts" as keyof WorksheetAnswers, label: "أكملت تجهيز وجدولة أول 10 منشورات معلومات لبروفايلي [تيك توك]" },
                { id: "u4WhatsappMessage" as keyof WorksheetAnswers, label: "صغت وأرسلت رسائل الواتس لدوائر علاقاتي المهتمة" },
                { id: "u4SevenDayPlan" as keyof WorksheetAnswers, label: "أكملت خطة بث ونشر متواصلة لـ 7 أيام بانتظام دون مماطلة" },
                { id: "u4ChecklistSharedContent" as keyof WorksheetAnswers, label: "نشرت فيديو تعليمي أو ترويجي واحد على الأقل" },
                { id: "u4ChecklistReachedOut" as keyof WorksheetAnswers, label: "تواصلت وطرحت الفكرة على مهتمين من الهاشتاغات أو التعليقات" },
                { id: "u4ChecklistSentLink" as keyof WorksheetAnswers, label: "شاركت رابط متجري الخاص بـ Gumroad مع الملهوفين" },
              ].map((checkItem) => (
                <label
                  key={checkItem.id}
                  className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={!!answers[checkItem.id]}
                    onChange={(e) => updateField(checkItem.id, e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span className="text-slate-700 text-xs sm:text-sm select-none">
                    {checkItem.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "form-u5":
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 my-5 shadow-sm">
            <h4 className="font-bold text-[#0b1d33] text-sm sm:text-base border-b-2 border-amber-100 pb-2 mb-3">
              🚀 مسودة الوحدة الخامسة: أفكار البراند وقائمة الإيميل وسلطة الجذب
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">اسم علامتك التجارية المقترحة:</label>
                <input
                  type="text"
                  value={answers.u5BrandName}
                  onChange={(e) => updateField("u5BrandName", e.target.value)}
                  placeholder="مثال: منارة النمو الرقمي..."
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">فكرة منتجك الرقمي المالي القادم:</label>
                <input
                  type="text"
                  value={answers.u5NextIdea}
                  onChange={(e) => updateField("u5NextIdea", e.target.value)}
                  placeholder="مثال: كورس مسجل متقدم للإنتاجية..."
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">رسالة الشكر والتقدير التي سيستلمها عميلك مجرد تحميله للملف:</label>
              <textarea
                value={answers.u5ThankYouMessage}
                onChange={(e) => updateField("u5ThankYouMessage", e.target.value)}
                placeholder="اكتب كلمات ترحيبية دافئة، تفاصيل حول كيفية التواصل معك للدعم، وبونص مكمل صغير تقديراً لثقتهم..."
                rows={3}
                className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700">سجل تكتيكات التوسع وحسابات البراند:</label>
              {[
                { id: "u5PricingPlan" as keyof WorksheetAnswers, label: "لدي خطة واضحة وشهادات للمشترين الأوائل لرفع ثمن الكتيب مستقبلاً" },
                { id: "u5NewProductIdeaChecked" as keyof WorksheetAnswers, label: "خططت وبحثت عوائق قرائي لبناء فكرة حزمة أو ملف قادم ناجح" },
                { id: "u5EmailListChecked" as keyof WorksheetAnswers, label: "ربطت وجمعت بريد قنواتي بـ Mailchimp للاعتماد والملكية للأبد" },
              ].map((checkItem) => (
                <label
                  key={checkItem.id}
                  className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={!!answers[checkItem.id]}
                    onChange={(e) => updateField(checkItem.id, e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span className="text-slate-700 text-xs sm:text-sm select-none">
                    {checkItem.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Book Container with nice textures and 3D shadows */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl flex flex-col min-h-[500px]">
        {/* Book Spine / Header bar */}
        <div className="bg-[#0b1d33] py-4 px-6 text-white flex flex-col sm:flex-row justify-between items-center gap-3 border-b-4 border-b-[#f2a900]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f2a900] text-[#0b1d33] rounded-lg">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest leading-none">قارئ المنهج التفاعلي</p>
              <h2 className="text-sm sm:text-base font-extrabold text-white mt-1">الدليل الشامل للمنتجات الرقمية</h2>
            </div>
          </div>

          {/* Quick Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold select-none">الصفحة:</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-[#0f294a] text-amber-400 border border-slate-800 text-xs font-bold py-1 px-3 rounded-lg focus:outline-none focus:border-[#f2a900]"
            >
              {BOOK_PAGES.map((p) => (
                <option key={p.pageNum} value={p.pageNum}>
                  {p.pageNum} - {p.title.length > 25 ? p.title.substring(0, 25) + "..." : p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Reader Stage */}
        <div className="flex-1 p-6 sm:p-10 relative overflow-y-auto bg-slate-50/30">
          
          {page.isCover ? (
            /* Cover Page Renderer */
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 max-w-lg mx-auto bg-gradient-to-b from-[#0b1d33] to-[#0f294a] rounded-3xl p-8 text-white border-2 border-[#f2a900] shadow-xl my-6">
              <span className="text-6xl animate-bounce">🛒</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white tracking-wide border-b-2 border-amber-400 pb-3">
                الدليل الشامل<br />للمنتجات الرقمية
              </h1>
              <div className="border border-dashed border-[#f2a900] px-6 py-2 rounded-xl text-amber-300 font-bold text-sm sm:text-base uppercase tracking-wider leading-relaxed">
                من الفكرة إلى أول عملية بيع
              </div>
              <div className="bg-[#f2a900] text-[#0b1d33] px-6 py-1 font-black text-sm rounded-full tracking-wide">
                خلال 14 يوماً
              </div>
              
              <div className="pt-16 space-y-1">
                <p className="text-amber-400 text-sm sm:text-base font-extrabold">مريم ناهي حسن</p>
                <p className="text-slate-400 text-xs">الإصدار 1.0 - 2026</p>
              </div>
            </div>
          ) : (
            /* Standard Pages Content Renderer */
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Header Box */}
              {page.unitTitle && (
                <div className="bg-[#0b1d33]/5 text-[#0b1d33] p-3 rounded-xl border border-slate-200 text-center text-xs font-black mb-6 uppercase tracking-wider select-none">
                  {page.unitTitle}
                </div>
              )}

              {/* Title display */}
              <h2 className="text-xl sm:text-2xl font-black text-[#0b1d33] mb-6 pb-2 border-b border-slate-100">
                {page.title}
              </h2>

              {/* Content items mapped */}
              <div className="space-y-4">
                {page.content.map((item, index) => renderContentItem(item, index))}
              </div>

              {/* 💡 حكمة الإطلاق والاستثمار الذكي */}
              {(() => {
                const wisdomIndex = currentPage % LAUNCH_LEVERAGE_WISDOMS.length;
                const wisdom = LAUNCH_LEVERAGE_WISDOMS[wisdomIndex];
                return (
                  <div className="bg-gradient-to-l from-amber-50 to-orange-50/40 border border-amber-200/60 p-5 rounded-2xl flex items-start gap-3.5 my-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/10 rounded-full blur-2xl group-hover:bg-amber-200/20 transition-all duration-300"></div>
                    <div className="p-2 bg-amber-100 text-[#d69600] rounded-xl flex-shrink-0">
                      <Lightbulb className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                        💡 {wisdom.title}
                      </h4>
                      <p className="text-slate-650 text-[11px] sm:text-xs leading-relaxed font-semibold">
                        {wisdom.text}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* 🛠️ روابط الوصول المباشر والسرعة لتطبيقات هذه الصفحة */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3" style={{ direction: "rtl" }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 text-right">
                    <span>🛠️</span>
                    <span>روابط الإطلاق والأدوات المذكورة في هذا القسم:</span>
                  </h4>
                  <span className="bg-emerald-100 text-[#088258] text-[9px] font-black px-2.5 py-1 rounded-full select-none leading-none">
                    🔑 انتقال فوري آمن ومباشر
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getToolsForCurrentPage().map((tool) => (
                    <a
                      key={tool.key}
                      href={getToolUrl(tool.key)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTrackToolClick(tool.key)}
                      className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-[#0b1d33]/5 text-slate-700 hover:text-[#0b1d33] rounded-2xl border border-slate-200 hover:border-[#0b1d33]/20 transition-all select-none group text-right"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg bg-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-sm">{tool.icon}</span>
                        <div className="leading-tight">
                          <span className="block text-xs font-black text-slate-800 group-hover:text-[#0b1d33]">{tool.name}</span>
                          <span className="block text-[10px] text-slate-400 font-medium group-hover:text-slate-500 mt-0.5">{tool.label}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-[#0b1d33] text-xs font-black transition-transform group-hover:-translate-x-1 pl-1">
                        ◀
                      </span>
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed text-center sm:text-right font-sans">
                  * هذه روابط تفاعلية ميسرة ومعدة تتيح لك تشييد منصتك وعملك فوراً وبسهولة متناهية.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-100 py-4 px-6 sm:px-10 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold transition duration-200 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {/* Miniature Badge displaying Page # / 33 */}
          <div className="flex items-center justify-center bg-[#0b1d33] text-white w-9 h-9 rounded-full font-black text-sm border-2 border-white shadow-md select-none">
            {currentPage}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === BOOK_PAGES.length}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b1d33] hover:bg-[#163359] disabled:opacity-40 disabled:hover:bg-[#0b1d33] text-white rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs mt-4">
        * جميع ملاحظاتك وتعديلات مسودتك بخلال كراسات العمل سيتم حفظها تلقائياً على المتصفح المحلي.
      </p>
    </div>
  );
}
