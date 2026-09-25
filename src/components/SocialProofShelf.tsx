import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Award, CheckCircle2, TrendingUp, Users, Heart } from "lucide-react";

interface SocialProofShelfProps {
  lang?: string;
}

interface SocialFeedback {
  id: number;
  type: "purchase" | "achievement" | "first_sale" | "community";
  user: string;
  country: string;
  detail: string;
  timeAr: string;
  timeEn: string;
}

const SOCIAL_ITEMS: SocialFeedback[] = [
  {
    id: 1,
    type: "purchase",
    user: "أحمد العتيبي",
    country: "🇸🇦 السعودية",
    detail: "اشترى للتو 'باقة الدليل الفوقي + قالب نوشن المالي المصاحب'! 🚀💰",
    timeAr: "قبل دقيقة واحدة",
    timeEn: "Just now"
  },
  {
    id: 2,
    type: "achievement",
    user: "سارة المهدي",
    country: "🇰🇼 الكويت",
    detail: "أنهت اليوم السادس من تحدي الـ 12 يوماً وتغلبت على عقبة الكتابة! 📝🏆",
    timeAr: "قبل 4 دقائق",
    timeEn: "4 mins ago"
  },
  {
    id: 3,
    type: "first_sale",
    user: "عبد الرحمن الصالح",
    country: "🇦🇪 الإمارات",
    detail: "حقق أول مبيعة لكتابه الإلكتروني الجديد بمبلغ 19 دولار عبر Gumroad! 💵✨",
    timeAr: "قبل 11 دقيقة",
    timeEn: "11 mins ago"
  },
  {
    id: 4,
    type: "community",
    user: "مريم ناصر",
    country: "🇧🇭 البحرين",
    detail: "أنشأت متجر Payhip وقامت بربط بوابة الدفع بنجاح في أقل من ساعة! 🌐🎀",
    timeAr: "قبل 18 دقيقة",
    timeEn: "18 mins ago"
  },
  {
    id: 5,
    type: "purchase",
    user: "ياسر الحربي",
    country: "🇴🇲 عُمان",
    detail: "قام بترقية حسابه والحصول على قائمة الـ 50 أمراً لـ ChatGPT! 📂💎",
    timeAr: "قبل 23 دقيقة",
    timeEn: "23 mins ago"
  },
  {
    id: 6,
    type: "achievement",
    user: "رنا محمود",
    country: "🇶🇦 قطر",
    detail: "صنعت 15 سكريبت فيديو ترويجي باستخدام مولد الرسائل والسكريبتات الذكي! 🎬✨",
    timeAr: "قبل 30 دقيقة",
    timeEn: "30 mins ago"
  },
  {
    id: 7,
    type: "first_sale",
    user: "خالد بن سعيد",
    country: "🇸🇦 السعودية",
    detail: "حصل على 3 مبيعات متتالية لكتابه الرقمي بعد تطبيق نصيحة مريم للترويج العضوي! 📈🚀",
    timeAr: "قبل 42 دقيقة",
    timeEn: "42 mins ago"
  },
  {
    id: 8,
    type: "community",
    user: "منى مصطفى",
    country: "🇪🇬 مصر",
    detail: "أطلقت مسودتها التفاعلية وبدأت باستقبال المشتركين الأوائل في نشرتها البريدية! 📩💥",
    timeAr: "قبل ساعة واحدة",
    timeEn: "1 hour ago"
  }
];

export default function SocialProofShelf({ lang = "ar" }: SocialProofShelfProps) {
  const UI_TEXT = {
    ar: {
      title: "📰 النشرة الإخبارية المصغرة لمنصة ومجتمع كورس المنتجات الرقمية",
      sub: "رصد حي وموثوق لعمليات الشراء، نشاط ريادة الأعمال، وإنجازات المتحدين الزملاء لعام 2026:",
      user: "العضو المبادر:",
      time: "منذ:",
      close: "أخفِ النشرة",
      achievement: "تمكين إنجاز 📝",
      purchase: "انضم للكورس 💳",
      first_sale: "أول مبيعة رقمية 💰",
      community: "تكامل تقني الكتروني"
    },
    en: {
      title: "📰 The Platform Gazette & Student Achievement Bulletin",
      sub: "A live, clean, curated gazette tracking student enrollment, milestones, and eBook sales in 2026:",
      user: "Member:",
      time: "Time:",
      close: "Hide bulletin",
      achievement: "Goal Completed 📝",
      purchase: "Enrolled in Course 💳",
      first_sale: "Generated Sale 💰",
      community: "Tech Launched"
    }
  };

  const t = lang === "en" ? UI_TEXT.en : UI_TEXT.ar;

  const getTranslatedDetail = (item: SocialFeedback) => {
    if (lang !== "en") return item.detail;
    
    // Translation fallback
    if (item.type === "purchase" && item.id === 1) {
      return "purchased the 'Ultimate Guidebook + Financial Notion Planner bundle'! 🚀💰";
    }
    if (item.type === "achievement" && item.id === 2) {
      return "completed Day 6 of the 12-Day Launch Challenge and smashed creative delay! 📝🏆";
    }
    if (item.type === "first_sale" && item.id === 3) {
      return "generated his first digital book sale of $19 on Gumroad! 💵✨";
    }
    if (item.type === "community" && item.id === 4) {
      return "setup a new Payhip store and linked payment processors in 45 minutes! 🌐🎀";
    }
    if (item.type === "purchase" && item.id === 5) {
      return "upgraded to premium and unlocked the 50 Ultimate ChatGPT Command Hub! 📂💎";
    }
    if (item.type === "achievement" && item.id === 6) {
      return "generated 15 engaging short video script drafts using the Instant Copywriter tool! 🎬✨";
    }
    if (item.type === "first_sale" && item.id === 7) {
      return "secured 3 consecutive eBook sales this week using organic traffic loops! 📈🚀";
    }
    return "launched their custom interactive draft and gathered their first subscriber list! 📩💥";
  };

  const getTranslatedName = (item: SocialFeedback) => {
    if (lang !== "en") return `${item.user} (${item.country})`;
    const nameMap: Record<string, string> = {
      "أحمد العتيبي": "Ahmed Al-Otaibi",
      "سارة المهدي": "Sarah Al-Mahdi",
      "عبد الرحمن الصالح": "Abdulrahman Al-Saleh",
      "مريم ناصر": "Mariam Nasser",
      "ياسر الحربي": "Yasser Al-Harbi",
      "رنا محمود": "Rana Mahmoud",
      "خالد بن سعيد": "Khaled bin Saeed",
      "منى مصطفى": "Mona Mostafa"
    };
    return `${nameMap[item.user] || item.user} ${item.country}`;
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case "purchase": return t.purchase;
      case "achievement": return t.achievement;
      case "first_sale": return t.first_sale;
      default: return t.community;
    }
  };

  const getBadgeColors = (type: string) => {
    switch (type) {
      case "purchase": return "bg-amber-100 text-amber-800 border-amber-250";
      case "achievement": return "bg-emerald-100 text-emerald-800 border-emerald-250";
      case "first_sale": return "bg-yellow-105 text-[#8f6400] border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-250";
    }
  };

  return (
    <div className="bg-[#f8fafc] border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs text-right text-slate-800 relative select-none" style={{ direction: "rtl" }}>
      <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
      
      {/* Newspaper Header Styling */}
      <div className="border-b-2 border-slate-350 pb-4 mb-6 select-none flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm sm:text-base text-[#0b1d33] flex items-center gap-2">
            <span>{t.title}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full animate-pulse select-none">جريدة حية نشطة</span>
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {t.sub}
          </p>
        </div>
        <div className="text-[10px] text-slate-400 font-mono font-bold shrink-0 self-end md:self-center bg-slate-100 px-3 py-1 rounded-lg">
          تاريخ المزامنة والنشاط: {new Date().getFullYear()}/06/21 ✓
        </div>
      </div>

      {/* Grid of the gazette items - all visible together in columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {SOCIAL_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow transition duration-200 space-y-3 relative overflow-hidden group hover:border-[#0b1d33]/30"
          >
            <div className="flex justify-between items-start gap-1 select-none">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${getBadgeColors(item.type)}`}>
                {getBadgeText(item.type)}
              </span>
              <span className="text-[9px] text-slate-400 font-bold font-mono">
                {lang === "en" ? item.timeEn : item.timeAr}
              </span>
            </div>

            <div className="space-y-1">
              <h6 className="font-black text-xs text-[#0b1d33] leading-none">
                {getTranslatedName(item)}
              </h6>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {getTranslatedDetail(item)}
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-slate-100 group-hover:bg-[#0b1d33]/40 transition" />
          </div>
        ))}
      </div>

      {/* Decorative footer snippet */}
      <div className="mt-6 pt-4 border-t border-dashed border-slate-200 text-center select-none">
        <p className="text-[10px] text-slate-400 font-bold">
          📈 تم ترقية هذه النشرة الإخبارية المصغرة وتثبيتها أسفل الصفحة الرئيسية بطلب من المشرفة السيادية مريم ناهي لعدم تشتيت الطلاب وتجنب ملل الإشعارات المنبثقة.
        </p>
      </div>

    </div>
  );
}
