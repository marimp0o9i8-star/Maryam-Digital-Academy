import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Award, Star, TrendingUp, X } from "lucide-react";

interface FloatingProofToastProps {
  lang?: string;
}

interface ToastItem {
  id: number;
  type: "purchase" | "achievement" | "first_sale";
  user: string;
  country: string;
  detailAr: string;
  detailEn: string;
  avatar: string;
}

const TOAST_ITEMS: ToastItem[] = [
  {
    id: 1,
    type: "purchase",
    user: "عبد الله المالكي",
    country: "🇸🇦 السعودية",
    avatar: "🧔",
    detailAr: "اشترى باقة 'الذكاء الفوقي والإطلاق الشامل 2026' بقيمة $59! 🎉🛒",
    detailEn: "purchased 'Super-Intelligence & Complete Launch 2026' for $59! 🎉🛒"
  },
  {
    id: 2,
    type: "achievement",
    user: "فاطمة الشمري",
    country: "🇰🇼 الكويت",
    avatar: "👩‍💻",
    detailAr: "أكملت اليوم 9 بنجاح وصممت صفحة هبوط ترويجية مذهلة! 🚀📝",
    detailEn: "successfully finished Day 9 and designed a stunning sales landing page! 🚀📝"
  },
  {
    id: 3,
    type: "first_sale",
    user: "سعيد بن علي",
    country: "🇴🇲 عُمان",
    avatar: "👨‍💻",
    detailAr: "حقق للتو أول مبيع له للكتيب التفاعلي واستلم $24 فوراً! 💰🤩",
    detailEn: "just generated his first eBook sale and received $24 instantly! 💰🤩"
  },
  {
    id: 4,
    type: "purchase",
    user: "ياسمين حمدي",
    country: "🇪🇬 مصر",
    avatar: "👩‍💼",
    detailAr: "اشترت باقة كراسات التخطيط وأوامر الذكاء الاصطناعي الـ 50! 💎📚",
    detailEn: "purchased the Planning Workbook and 50 Ultimate AI Prompts! 💎📚"
  },
  {
    id: 5,
    type: "achievement",
    user: "أحمد بن حامد",
    country: "🇦🇪 الإمارات",
    avatar: "👨‍🎨",
    detailAr: "تخطى عقبة التسويق البارد وحصد أول 120 مسجل بنشرته البريدية! 📈⚡",
    detailEn: "smashed cold marketing and secured his first 120 subscriber signups! 📈⚡"
  }
];

export default function FloatingProofToast({ lang = "ar" }: FloatingProofToastProps) {
  // Disabled as requested by the user: "لا تجعلها تظهر هكذا كإشعار، سوف يمل المستخدم من المنصة..."
  return null;
}
