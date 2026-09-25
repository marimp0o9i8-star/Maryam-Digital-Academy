import React, { useState } from "react";
import { MessageSquare, Video, Copy, Check, Sparkles, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import { TIKTOK_SCRIPTS, SALES_MESSAGES } from "../data/bookContent";

export default function ScriptGenerator() {
  const [activeTab, setActiveTab] = useState<"tiktok" | "messages">("tiktok");
  
  // Custom interactive inputs
  const [niche, setNiche] = useState("شغفك الرقمي والتسويق");
  const [painPoint, setPainPoint] = useState("المماطلة والتشتت وضياع المبيعات");
  const [productName, setProductName] = useState("الدليل الشامل للمنتجات الرقمية");
  const [offerPrice, setOfferPrice] = useState("49$");
  const [offerDiscount, setOfferDiscount] = useState("19$");
  const [storeLink, setStoreLink] = useState("gumroad.com/myaccount");

  // State to track copied items
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to replace ALL templates keywords
  const compileTemplateText = (text: string) => {
    return text
      .replace(/\{niche\}/g, niche || "[تخصصك]")
      .replace(/\{pain_point\}/g, painPoint || "[ألم العميل]")
      .replace(/\[الاسم\]/g, "يا صديقي الغالي")
      .replace(/\[اسم العميل\]/g, "يا صديقي المبدع")
      .replace(/\[اسم منتجك الرقمي\]/g, productName || "[اسم منتجك الرقمي]")
      .replace(/\[حل المشكلة الكبرى\]/g, painPoint || "[حل مشكلتكم الأولى]")
      .replace(/\[الهدف النهائي المرغوب بوضوح\]/g, "تحقيق الحرية المالية والتميز بمشروعك الفريد")
      .replace(/\[سعر الخصم\]/g, offerDiscount || "[السعر بخصم البدايات]")
      .replace(/\[السعر العادي\]/g, offerPrice || "[السعر الأصلي]")
      .replace(/\[رابط متجرك بـ Gumroad\]/g, storeLink || "رابط متجري في حسابي")
      .replace(/\[تصنيف مجالك\]/g, niche || "[تصنيف مجالك]")
      .replace(/\[النتيجة الإيجابية التي يحلم بها المتابع\]/g, "امتلاك براند إلكتروني مستقل وحصد مبيعات مستمرة")
      .replace(/\[فصّل المشكلة بكلمات ملموسة وواقعية\]/g, painPoint || "[فصّل المشكلة الكبرى هنا]")
      .replace(/\[رابط صفحة المبيعات\]/g, storeLink || "رابط دليلي بالبايو")
      .replace(/\[العائق الشائع، مثل السعر أو الوقت أو صعوبة التطبيق\]/g, "السعر والوقت للبدء")
      .replace(/\[رابط تحميل المنتج\]/g, storeLink || "رابط دليلي بحسابي")
      .replace(/\[المشكلة في سبب فشل المشاريع الصغيرة\]/g, "تشتت الجهود وصناعة منتج عشوائي")
      .replace(/\[المشكلة\]/g, painPoint || "[معاناة عميلك]");
  };

  const handleCopyText = (text: string, uniqueId: string) => {
    const compiled = compileTemplateText(text);
    navigator.clipboard.writeText(compiled);
    setCopiedId(uniqueId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // State to toggle specific script card expansion
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#0b1d33] flex items-center gap-2">
          <span>💬 صانع السكريبتات ورسائل المبيعات الذكي</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          حقن وتشكيل سكريبتات تيك توك وتغريدات ورسائل واتساب ببيئات وتفاصيل مشروعك الرقمي بنقرة زر!
        </p>
      </div>

      {/* Grid of Custom Inputs */}
      <div className="bg-[#0b1d33] text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-3">
          <Sliders className="w-5 h-5 text-[#f2a900]" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-100">تحكم بمتغيرات وحقن نصوص مشروعتك</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">📱 اسم مجال تخصصك (Niche)</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="مثال: التسويق العقاري، الطبخ الصحي..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">🔥 المشكلة الكبرى لجمهورك (Pain Point)</label>
            <input
              type="text"
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="مثال: قلة المبيعات وتشتت الجمهور..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">📦 اسم منتجك المعرفي</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="مثال: الدليل الشامل للتسويق العقاري..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">💰 السعر الأصلي للمنتج</label>
            <input
              type="text"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="مثال: 49$..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">🛍️ السعر بعد الخصم (العرض المغري)</label>
            <input
              type="text"
              value={offerDiscount}
              onChange={(e) => setOfferDiscount(e.target.value)}
              placeholder="مثال: 19$..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] sm:text-xs font-bold text-slate-300">🔗 رابط صفحة متجرك المميز</label>
            <input
              type="text"
              value={storeLink}
              onChange={(e) => setStoreLink(e.target.value)}
              placeholder="مثال: gumroad.com/myusername..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Main tab select for resource type */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("tiktok")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs sm:text-sm font-black transition cursor-pointer select-none ${
            activeTab === "tiktok"
              ? "border-[#0b1d33] text-[#0b1d33]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>15 سكريبت تيك توك لترويج دليلك (البونص 3)</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs sm:text-sm font-black transition cursor-pointer select-none ${
            activeTab === "messages"
              ? "border-[#0b1d33] text-[#0b1d33]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>5 رسائل مبيعات إقناعية للواتس (البونص 5)</span>
        </button>
      </div>

      {/* Display Stage */}
      {activeTab === "tiktok" ? (
        /* TikTok interactive listing */
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-slate-700 text-xs leading-relaxed">
              <strong>قاعدة النشر بالفيديو:</strong> ركز بقوة على جاذبية الـ (Hook) وهو أول 3 ثواني من حديثك لجعل المشاهد يعيرك سمعه، ثم اعرض الوجع وقدم دليلك الفوري كطوق نجاة نهائي بالبايو!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIKTOK_SCRIPTS.map((script) => {
              const compiledHook = compileTemplateText(script.hook);
              const compiledBody = compileTemplateText(script.contentTemplate);
              const uniqueId = `tiktok-${script.id}`;
              const isCopied = copiedId === uniqueId;

              return (
                <div
                  key={script.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-amber-100 text-[#d69600] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {script.category}
                      </span>
                      <span className="text-slate-300 font-mono text-xs font-bold">السكريبت {script.id}</span>
                    </div>

                    <h4 className="font-extrabold text-[#0b1d33] text-sm mb-3 border-r-3 border-r-[#f2a900] pr-2.5 leading-relaxed">
                      {compiledHook}
                    </h4>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-4 font-semibold">
                      {compiledBody}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-slate-50 pt-4">
                    <button
                      onClick={() => handleCopyText(script.contentTemplate, uniqueId)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-[#0b1d33] hover:bg-[#163359] text-white"
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "تم نسخ السكريبت!" : "نسخ النص المولد"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Messages Outreach templates listing */
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">✉️</span>
            <p className="text-slate-700 text-xs leading-relaxed">
              <strong>التوجيه الشخصي للمبيعات:</strong> انسخ رسالة الواتس دافئة، وأرسلها لأصدقائك أو متابعيهم الذين أظهروا رغبة الفهم. لا تطرح العرض بصيغة إعلانية جامدة، بل تواصل بود واحترام كصديق يعرض استشارة نادرة.
            </p>
          </div>

          <div className="space-y-5">
            {SALES_MESSAGES.map((msg) => {
              const compiledText = compileTemplateText(msg.templateText);
              const uniqueId = `msg-${msg.id}`;
              const isCopied = copiedId === uniqueId;

              return (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                    <h4 className="font-black text-slate-800 text-sm sm:text-base">{msg.title}</h4>
                    
                    <button
                      onClick={() => handleCopyText(msg.templateText, uniqueId)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? "تم نسخ الرسالة!" : "نسخ الرسالة"}</span>
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap font-sans">
                      {compiledText}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
