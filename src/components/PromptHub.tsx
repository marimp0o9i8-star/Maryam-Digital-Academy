import React, { useState } from "react";
import { Search, Sparkles, Copy, Check, Filter } from "lucide-react";
import { CHATGPT_PROMPTS } from "../data/bookContent";

export default function PromptHub() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userTopic, setUserTopic] = useState("التسويق للمنتجات الرقمية");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "📋 الكل (50 أمراً)" },
    { id: "content", name: "✍️ صياغة محتوى" },
    { id: "marketing", name: "📢 التسويق الذكي" },
    { id: "writing", name: "📝 صياغة النصوص" },
    { id: "ads", name: "🎯 الإعلانات الممولة" },
    { id: "productivity", name: "⏱️ الإنتاجية والمنهج" },
    { id: "miscellaneous", name: "🌟 أوامر متنوعة" },
  ];

  // Apply user's custom topic placeholder replacement
  const compilePromptText = (template: string) => {
    const topic = userTopic || "[أدخل موضوعك هنا]";
    return template
      .replace(/\[الموضوع\]/g, topic)
      .replace(/\[المنتج\]/g, `كتيب عن ${topic}`)
      .replace(/\[تصنيف مجالك\]/g, topic)
      .replace(/\[مجال\]/g, topic);
  };

  const handleCopyPrompt = (promptId: number, template: string) => {
    const compiledText = compilePromptText(template);
    navigator.clipboard.writeText(compiledText);
    setCopiedId(promptId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered listing logic
  const filteredPrompts = CHATGPT_PROMPTS.filter((prompt) => {
    const matchesCategory = activeCategory === "all" || prompt.category === activeCategory;
    
    const compiled = compilePromptText(prompt.textTemplate);
    const matchesSearch =
      compiled.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and description */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#0b1d33] flex items-center gap-2">
          <span>🤖 مركز أوامر ChatGPT كنز كبار صناع المعرفة VIP</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          أعظم الأوامر الذكية المفصلة لتوليد خطط الأعمال وصياغة الفصول والسكريبتات، مخصصة بموضوعك آلياً!
        </p>
      </div>

      {/* Dynamic topic injector box */}
      <div className="bg-[#fffaf0] border border-[#feebc8] p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3 text-[#d69600]">
          <Sparkles className="w-5 h-5 text-[#f2a900]" />
          <h3 className="font-extrabold text-xs sm:text-sm">احقن موضوع مشروعك بجميع الأوامر الـ 50 دفعة واحدة!</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userTopic}
            onChange={(e) => setUserTopic(e.target.value)}
            placeholder="اكتب موضوعك هنا، مثل: الربح من منصات التواصل، الطهي النباتي..."
            className="flex-1 text-xs sm:text-sm p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800 font-bold"
          />
          {userTopic && (
            <button
              onClick={() => setUserTopic("")}
              className="text-slate-400 hover:text-red-500 text-xs font-semibold px-2 cursor-pointer transition select-none"
            >
              تفريغ الموضوع
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          * ستقوم المنصة تلقائياً بتغيير كلمة <strong className="text-slate-500">[الموضوع]</strong> بـ أوراقك المعطاة لتستمتع بأمر مهيئ مائة بالمائة لنسخه ولصقه بمحادثتك.
        </p>
      </div>

      {/* Inputs controls (search & filter list) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        
        {/* Horizontal scroll select tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full md:max-w-[70%] text-slate-500 select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#0b1d33] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بداخل الأوامر الـ 50..."
            className="w-full text-xs sm:text-sm p-2.5 pr-9 pl-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f2a900] text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
        </div>

      </div>

      {/* Prompts Cards Grid Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => {
            const compiledText = compilePromptText(prompt.textTemplate);
            const isCopied = copiedId === prompt.id;
            
            return (
              <div
                key={prompt.id}
                className="bg-white rounded-2xl p-5 border border-slate-105 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {prompt.category === "content" ? "صياغة محتوى" : 
                       prompt.category === "marketing" ? "التسويق بالمحتوى" : 
                       prompt.category === "writing" ? "صوت النص" : 
                       prompt.category === "ads" ? "الإعلانات الممولة" : 
                       prompt.category === "productivity" ? "الروتين والوقت" : "أوامر مذهلة"}
                    </span>
                    <span className="text-slate-350 font-mono text-xs font-bold">الأمر {prompt.id}</span>
                  </div>

                  <p className="text-slate-755 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-semibold mb-6">
                    {compiledText}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyPrompt(prompt.id, prompt.textTemplate)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    isCopied
                      ? "bg-emerald-500 text-white"
                      : "bg-[#0b1d33] hover:bg-[#163359] text-white"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "تم النسخ بنجاح!" : "نسخ الأمر الجاهز"}</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs sm:text-sm">
            ❌ لا توجد أوامر مطابقة لعملية بحثك وتصفيتك الحالية.
          </div>
        )}
      </div>
    </div>
  );
}
