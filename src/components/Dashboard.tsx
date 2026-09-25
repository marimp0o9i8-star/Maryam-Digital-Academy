import React from "react";
import { BookOpen, CheckSquare, Award, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { WorksheetAnswers } from "../types";
import SocialProofShelf from "./SocialProofShelf";

interface DashboardProps {
  answers: WorksheetAnswers;
  daysCompletedCount: number;
  activePanelSetter: (panel: string) => void;
  currentPageSetter: (page: number) => void;
  lang?: string;
}

export default function Dashboard({
  answers,
  daysCompletedCount,
  activePanelSetter,
  currentPageSetter,
  lang = "ar"
}: DashboardProps) {
  // Calculate workbook progress
  const totalWorkbookQuestions = 15;
  let filledWorkbookQuestions = 0;
  if (answers.u1Problem) filledWorkbookQuestions++;
  if (answers.u1Customer) filledWorkbookQuestions++;
  if (answers.u1Solution) filledWorkbookQuestions++;
  if (answers.u1Format) filledWorkbookQuestions++;
  if (answers.u1Check1) filledWorkbookQuestions++;
  if (answers.u1Check2) filledWorkbookQuestions++;
  if (answers.u1Check3) filledWorkbookQuestions++;
  if (answers.u2SelectedIdea) filledWorkbookQuestions++;
  if (answers.u2ReadyToSell) filledWorkbookQuestions++;
  if (answers.u3StorePlatform) filledWorkbookQuestions++;
  if (answers.u3ProductName) filledWorkbookQuestions++;
  if (answers.u3ProductPrice) filledWorkbookQuestions++;
  if (answers.u4MarketingPosts) filledWorkbookQuestions++;
  if (answers.u5BrandName) filledWorkbookQuestions++;
  if (answers.u5ThankYouMessage) filledWorkbookQuestions++;

  const workbookPercent = Math.round(
    (filledWorkbookQuestions / totalWorkbookQuestions) * 100
  );

  // Challenge progress
  const challengePercent = Math.round((daysCompletedCount / 12) * 100);

  // Overall progress
  const overallPercent = Math.round((workbookPercent + challengePercent) / 2);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0b1d33] via-[#0f294a] to-[#0b1d33] rounded-3xl p-6 sm:p-8 text-white overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#f2a900] opacity-10 blur-2xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#f2a900] opacity-5 blur-3xl rounded-full"></div>
        
        <div className="relative max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 bg-[#f2a900]/10 text-[#f2a900] px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-[#f2a900]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام إطلاق المنتجات الرقمية المتكامل</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-100">
            مرحباً بك في رحلة الـ 14 يوماً للحرية المالية! 🚀
          </h1>
          
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
            هذه المنصة التفاعلية ليست مجرد كتاب تقرأه، بل هي عيادتك التجارية ومعسكرك المهني لتصميم منتجك الرقمي ونشره على منصات الدفع الدولية بجهوزية كاملة وتلقي أول عملية بيع حقيقية.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                activePanelSetter("reader");
                currentPageSetter(1);
              }}
              className="bg-[#f2a900] hover:bg-[#d69600] text-[#0b1d33] font-bold px-6 py-3 rounded-xl transition duration-200 flex items-center gap-2 text-sm shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>ابدأ قراءة الدليل الآن</span>
            </button>
            <button
              onClick={() => activePanelSetter("challenge")}
              className="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-xl transition duration-200 text-sm border border-white/10 cursor-pointer"
            >
              تحدي الـ 12 يوماً العملي
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Completion card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">معدل الإنجاز العام</span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800">{overallPercent}%</h3>
            <p className="text-slate-500 text-xs mt-1">معدل التقدم المدمج بداخل المنهج والعمليات</p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Workbook progression card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">كراسة العمل والمسودة</span>
              <div className="p-2.5 bg-amber-50 text-[#f2a900] rounded-xl font-bold">
                ✍️
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800">{workbookPercent}%</h3>
            <p className="text-slate-500 text-xs mt-1">
              تم ملء {filledWorkbookQuestions} من أصل {totalWorkbookQuestions} حقول في كراسة التخطيط
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#f2a900] h-full rounded-full transition-all duration-500"
                style={{ width: `${workbookPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Challenge completion card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">جاهزية إطلاق الـ 12 يوماً</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800">{challengePercent}%</h3>
            <p className="text-slate-500 text-xs mt-1">
              أتممت بنجاح {daysCompletedCount} من إجمالي {12} يوماً عملياً مجدولاً
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${challengePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>⚡ لوحة التحكم والوصول السريع</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1 */}
            <button
              onClick={() => activePanelSetter("generator")}
              className="group text-right bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#f2a900]/30 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-amber-50 text-[#f2a900] rounded-xl group-hover:bg-[#f2a900]/10 transition">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#f2a900] group-hover:-translate-x-1 transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 group-hover:text-[#0b1d33]">صانع السكريبتات ورسائل البيع</h4>
                <p className="text-slate-400 text-xs line-clamp-2">ولد تلقائياً 15 سكريبت تيك توك و5 رسائل ترويجية بلمسة واحدة</p>
              </div>
            </button>

            {/* Action 2 */}
            <button
              onClick={() => activePanelSetter("prompts")}
              className="group text-right bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-100 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:-translate-x-1 transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 group-hover:text-violet-700">50 أمر ChatGPT كنز ذكي</h4>
                <p className="text-slate-400 text-xs line-clamp-2">بحث وتصفية ونسخ أوامر احترافية مخصصة للذكاء التوليدي بحسب مجال عملك</p>
              </div>
            </button>

            {/* Action 3 */}
            <button
              onClick={() => activePanelSetter("workbook")}
              className="group text-right bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#0b1d33]/20 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-slate-50 text-[#0b1d33] rounded-xl group-hover:bg-[#0b1d33]/5 transition">
                  ✍️
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0b1d33] group-hover:-translate-x-1 transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 group-hover:text-[#0b1d33]">كراسة التخطيط التفاعلية</h4>
                <p className="text-slate-400 text-xs line-clamp-2">مسودة معالجة أجزاء مشروعك وتصدير خطتك متكاملة لمواصلة عملك</p>
              </div>
            </button>

            {/* Action 4 */}
            <button
              onClick={() => activePanelSetter("templates")}
              className="group text-right bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition">
                  📁
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:-translate-x-1 transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700">القوالب والأدوات المجهزة</h4>
                <p className="text-slate-400 text-xs line-clamp-2">انسخ هياكل صفحات المبيعات، حاسبات الجدوى المادية، وجداول تتبع النشر</p>
              </div>
            </button>
          </div>
        </div>

        {/* Maryam's Golden Tips Side Card */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>💡 نصائح مريم للمبتدئين</span>
          </h2>

          <div className="bg-[#fffaf0] border border-[#feebc8] p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👩‍💻</span>
              <div>
                <h4 className="font-bold text-[#0b1d33] text-sm">مريم ناهي حسن</h4>
                <p className="text-slate-400 text-[10px]">موجّهتك لخطوات البناء للرقمي</p>
              </div>
            </div>

            <hr className="border-amber-100" />

            <ul className="space-y-3.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-[#0b1d33]">لا تبحث عن الكمال:</strong> كمال العمل قاتل للبدايات. كتيب من 10 صفحات يحل مشكلة معقدة يجلب مبيعات أكثر من 120 صفحة بدون فائدة مباشرة.
              </li>
              <li>
                <strong className="text-[#0b1d33]">المنافسون ليسوا عائقاً:</strong> رؤية منافس يبيع دليلاً مشابهاً هو دلالة على عطش السوق واهتمامه بالدفع، عليك التميز بالجودة وطعم الشرح.
              </li>
              <li>
                <strong className="text-[#0b1d33]">قاعدة الـ 80% في تيك توك:</strong> قدم للجمهور حلولاً حية ومجانية بالفيديوهات لتثبت لهم موثوقيتك، وسيطلبون نسختك الاحترافية بالسياق.
              </li>
              <li>
                <strong className="text-[#0b1d33]">التنفيذ المنهجي:</strong> استخدم كراسة العمل بمهام الوحدات وسجل أفكارك حتى لو كانت ضعيفة بالبدء، فكل مسودة هي أساس لبراند ناجح.
              </li>
            </ul>

            <div className="bg-[#0b1d33] text-white p-3 rounded-xl text-center text-xs font-semibold cursor-pointer hover:bg-[#163359] transition" onClick={() => activePanelSetter("reader")}>
              استكشف بونص 2: 25 فكرة للحل الرقمي
            </div>
          </div>
        </div>

      </div>

      {/* Social proof shelf at the bottom of the dashboard */}
      <div className="pt-4">
        <SocialProofShelf lang={lang} />
      </div>
    </div>
  );
}
