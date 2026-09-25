import React, { useState, useEffect } from "react";
import { COPIABLE_TEMPLATES, TOOLS_LIST } from "../data/bookContent";
import { CreditCard, Copy, Check, FileText, CheckCircle, Database, Link2 } from "lucide-react";

export default function TemplatesCenter() {
  const [activeSegment, setActiveSegment] = useState<"templates" | "tools">("templates");
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [affiliateLinks, setAffiliateLinks] = useState<any>(null);

  // Sync with localStorage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("digital_guide_affiliate_links_v1");
      if (saved) {
        setAffiliateLinks(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeSegment]);

  const handleCopyText = (text: string, idString: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idString);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getToolUrl = (name: string) => {
    const defaultUrls: Record<string, string> = {
      "Canva": "https://www.canva.com",
      "Gumroad": "https://gumroad.com",
      "ChatGPT": "https://chatgpt.com",
      "Google Docs": "https://docs.google.com",
      "Notion": "https://notion.so",
      "CapCut": "https://capcut.com",
      "Mailchimp / Brevo": "https://mailchimp.com"
    };
    
    const keyMap: Record<string, string> = {
      "Canva": "canva",
      "Gumroad": "gumroad",
      "ChatGPT": "chatgpt",
      "Google Docs": "gdocs",
      "Notion": "notion",
      "CapCut": "capcut",
      "Mailchimp / Brevo": "mailchimp"
    };

    const key = keyMap[name];
    if (key && affiliateLinks && affiliateLinks[key]) {
      return affiliateLinks[key];
    }
    return defaultUrls[name] || "https://google.com";
  };

  const handleTrackToolClick = (name: string) => {
    const keyMap: Record<string, string> = {
      "Canva": "canva",
      "Gumroad": "gumroad",
      "ChatGPT": "chatgpt",
      "Google Docs": "gdocs",
      "Notion": "notion",
      "CapCut": "capcut",
      "Mailchimp / Brevo": "mailchimp"
    };
    const key = keyMap[name];
    if (key) {
      try {
        const saved = localStorage.getItem("digital_guide_affiliate_clicks_v1");
        const clicks = saved ? JSON.parse(saved) : {};
        clicks[key] = (clicks[key] || 0) + 1;
        localStorage.setItem("digital_guide_affiliate_clicks_v1", JSON.stringify(clicks));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0b1d33] flex items-center gap-2">
            <span>📁 مركز الأدوات والقوالب المجهزة للتنزيل</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            قوالب أعمال عملية، مصفاة ومصممة للنسخ والرفع بمتجرك وتتبع المبيعات والجمهور!
          </p>
        </div>

        {/* Segmented controls toggler */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto select-none">
          <button
            onClick={() => setActiveSegment("templates")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition-colors cursor-pointer select-none ${
              activeSegment === "templates"
                ? "bg-white text-[#0b1d33] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📋 الـ 6 قوالب جاهزة (بونص 4)
          </button>
          <button
            onClick={() => setActiveSegment("tools")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition-colors cursor-pointer select-none ${
              activeSegment === "tools"
                ? "bg-white text-[#0b1d33] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🛠️ دليل أدوات الإنتاج (بونص 6)
          </button>
        </div>
      </div>

      {/* Main Container switch */}
      {activeSegment === "templates" ? (
        /* Copiable Templates System */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Templates checklist sidebar grid */}
          <div className="lg:col-span-1 space-y-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 block">حزمة النماذج</span>
            {COPIABLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setExpandedTemplate(tmpl.id)}
                className={`text-right w-full p-4 rounded-xl border transition duration-200 cursor-pointer flex flex-col justify-between ${
                  expandedTemplate === tmpl.id
                    ? "bg-[#0b1d33] border-[#0b1d33] text-white shadow-md shadow-slate-900/5"
                    : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      expandedTemplate === tmpl.id
                        ? "bg-amber-400 text-[#0b1d33]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    صيغة {tmpl.fileType}
                  </span>
                  <span className={`text-[11px] font-mono font-semibold ${expandedTemplate === tmpl.id ? "text-slate-300" : "text-slate-300"}`}>
                    قالب {tmpl.id}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm line-clamp-1">{tmpl.title}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${expandedTemplate === tmpl.id ? "text-slate-300" : "text-slate-400"}`}>
                    {tmpl.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Template Frame stage */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[400px]">
            {(() => {
              const activeTmpl = COPIABLE_TEMPLATES.find((t) => t.id === expandedTemplate) || COPIABLE_TEMPLATES[0];
              const uniqueId = `tmpl-${activeTmpl.id}`;
              const isCopied = copiedId === uniqueId;

              return (
                <>
                  {/* Spine Header */}
                  <div className="bg-slate-50 border-b border-slate-150 py-3.5 px-6 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 text-[#f2a900] rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-800 text-xs sm:text-sm">{activeTmpl.title}</h4>
                    </div>

                    <button
                      onClick={() => handleCopyText(activeTmpl.previewContent, uniqueId)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-[#0b1d33] hover:bg-[#163359] text-white"
                      }`}
                    >
                      {isCopied ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "تم نسخ القالب!" : "نسخ القالب المجهز"}</span>
                    </button>
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <pre className="text-slate-650 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-4 rounded-xl border border-dotted border-slate-200 font-semibold select-all">
                      {activeTmpl.previewContent}
                    </pre>
                  </div>

                  {/* Spine footer tip */}
                  <div className="bg-amber-50/30 border-t border-amber-100 p-3 px-6 text-[10px] text-slate-400 uppercase tracking-wide italic leading-relaxed text-center sm:text-right">
                    * انسخ الهيكل والصقه في Word أو Excel/Google Sheets لتنسيق أوراق مشروعك بسهولة متناهية.
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      ) : (
        /* Tools database cards listing */
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">🛠️</span>
            <p className="text-slate-700 text-xs leading-relaxed">
              <strong>قواعد واختيارات أدوات المفتعلين:</strong> جميع هذه الأدوات مجانية بالكامل ومثالية لبدايات ميزانية الـ صفر دولار. لا تصرف أي سنت بالبداية على سيرفرات أو تصاميم، فالبساطة هي سر الاستجابة وجذب الزبائن!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS_LIST.map((tool) => (
              <div
                key={tool.name}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#0b1d33] text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      {tool.badge}
                    </span>
                    <span className="text-slate-400 font-bold text-xs">الأدوات الأساسية</span>
                  </div>

                  <h4 className="font-extrabold text-[#0b1d33] text-base mb-2">{tool.name}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{tool.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs">🎯</span>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                      <strong>الاستخدام:</strong> {tool.use}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-50 p-2 rounded-lg">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>سعر التكلفة: {tool.price}</span>
                  </div>

                  <a
                    href={getToolUrl(tool.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleTrackToolClick(tool.name)}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#0b1d33] hover:bg-slate-800 text-[#f2a900] rounded-xl text-xs font-black transition text-center select-none cursor-pointer border border-[#f2a900]/10"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>افتح وجرّب الأداة الآن ↗️</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
