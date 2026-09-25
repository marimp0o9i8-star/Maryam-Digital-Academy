import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "./lib/firebase";
import { apiJson } from "./lib/api";
import AdminOverview from "./components/AdminOverview";
import {
  Home,
  BookOpen,
  Edit3,
  MessageCircle,
  Sparkles,
  FolderOpen,
  CheckCircle,
  Calendar,
  AlertCircle,
  HelpCircle,
  Menu,
  X,
  RefreshCw,
  Settings,
} from "lucide-react";

import { WorksheetAnswers } from "./types";
import Dashboard from "./components/Dashboard";
import BookReader from "./components/BookReader";
import Workbook from "./components/Workbook";
import ScriptGenerator from "./components/ScriptGenerator";
import PromptHub from "./components/PromptHub";
import TemplatesCenter from "./components/TemplatesCenter";
import AdminSuite from "./components/AdminSuite";
import AIPersonalCoach from "./components/AIPersonalCoach";
import FloatingProofToast from "./components/FloatingProofToast";
import { METADATA_TRANSLATIONS } from "./utils/translations";
import { Lock, LogOut, User } from "lucide-react";
import StudentLogin from "./components/StudentLogin";


const INITIAL_ANSWERS: WorksheetAnswers = {
  u1Problem: "",
  u1Customer: "",
  u1Solution: "",
  u1Format: "",
  u1Check1: false,
  u1Check2: false,
  u1Check3: false,
  u2SelectedIdea: "",
  u2Gathered: false,
  u2Structured: false,
  u2Designed: false,
  u2CreatedPdf: false,
  u2AddedCover: false,
  u2ReadyToSell: false,
  u3StorePlatform: "",
  u3ProductName: "",
  u3ProductPrice: "",
  u3ProductDescription: "",
  u4MarketingPosts: false,
  u4WhatsappMessage: false,
  u4SevenDayPlan: false,
  u4ChecklistSharedContent: false,
  u4ChecklistReachedOut: false,
  u4ChecklistSentLink: false,
  u5BrandName: "",
  u5ThankYouMessage: "",
  u5NextIdea: "",
  u5PricingPlan: false,
  u5NewProductIdeaChecked: false,
  u5EmailListChecked: false,
};

export default function App() {
  // Mobile menu control state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Panel state
  const [activePanel, setActivePanel] = useState<string>("dashboard");

  // AI Retention Notification state
  const [showAiNotification, setShowAiNotification] = useState<boolean>(false);
  const [expandedAiNotification, setExpandedAiNotification] = useState<boolean>(false);

  // Page index state
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [answers, setAnswers] = useState<WorksheetAnswers>(INITIAL_ANSWERS);
  const [daysCompleted, setDaysCompleted] = useState<boolean[]>(Array(12).fill(false));

  // Global Language state (ar, en, fr, es, tr)
  const [lang, setLang] = useState<string>(() => {
    return localStorage.getItem("digital_guide_lang_v1") || "ar";
  });

  useEffect(() => {
    localStorage.setItem("digital_guide_lang_v1", lang);
  }, [lang]);

  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(firebaseConfigured);
  const [authError, setAuthError] = useState("");
  const [progressHydrated, setProgressHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!firebaseAuth) { setAuthLoading(false); return; }
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setProgressHydrated(false);
      setCurrentStudent(null);
      setIsAdminAuthenticated(false);
      setAuthError("");
      setAuthLoading(true);
      if (!user) {
        setCurrentStudent(null); setIsAdminAuthenticated(false);
        setAnswers(INITIAL_ANSWERS); setDaysCompleted(Array(12).fill(false)); setCurrentPage(1);
        setAuthLoading(false); return;
      }
      try {
        const { progress, isOwner } = await apiJson<{ progress: any; isOwner: boolean }>("/api/me/progress");
        setAnswers(progress?.answers ? { ...INITIAL_ANSWERS, ...progress.answers } : INITIAL_ANSWERS);
        setDaysCompleted(Array.isArray(progress?.daysCompleted) && progress.daysCompleted.length === 12 ? progress.daysCompleted : Array(12).fill(false));
        setCurrentPage(Number.isInteger(progress?.currentPage) ? progress.currentPage : 1);
        setCurrentStudent({ uid: user.uid, email: user.email || "", name: user.displayName || user.email?.split("@")[0] || "طالب", tier: "عضو", demo: false });
        setIsAdminAuthenticated(isOwner === true);
        setProgressHydrated(true);
      } catch (error: any) {
        setCurrentStudent(null); setIsAdminAuthenticated(false);
        const message = error.message || "تعذر تحميل الحساب. لن نكتب فوق بياناتك.";
        await signOut(firebaseAuth).catch(() => {});
        setAuthError(message);
      } finally { setAuthLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const logStudentActivity = (_actionText: string) => {
    // Last authenticated contact is stored server-side; no fabricated local user ledger.
  };
  const handleStudentLoginSuccess = (studentData: any) => {
    if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO !== "true" || !studentData?.demo) return;
    setAnswers(INITIAL_ANSWERS); setDaysCompleted(Array(12).fill(false)); setCurrentPage(1);
    setIsAdminAuthenticated(false); setCurrentStudent(studentData); setProgressHydrated(false);
  };
  const handleStudentLogout = async () => {
    if (currentStudent?.demo) {
      setCurrentStudent(null); setAnswers(INITIAL_ANSWERS); setDaysCompleted(Array(12).fill(false));
      return;
    }
    if (firebaseAuth) await signOut(firebaseAuth);
  };
  const handleAdminLockSession = () => setActivePanel("dashboard");

  // Get current active translation dictionary object safely
  const t = METADATA_TRANSLATIONS[lang] || METADATA_TRANSLATIONS.ar;

  const handleSetCurrentPage = (page: number) => setCurrentPage(page);
  useEffect(() => {
    if (!currentStudent?.uid || currentStudent.demo || !progressHydrated) return;
    setSaveState("saving");
    const id = window.setTimeout(() => {
      apiJson("/api/me/progress", { method: "PUT", body: JSON.stringify({ answers, daysCompleted, currentPage }) })
        .then(() => setSaveState("saved"))
        .catch(error => { console.error("Progress save failed:", error); setSaveState("error"); });
    }, 1200);
    return () => window.clearTimeout(id);
  }, [answers, daysCompleted, currentPage, currentStudent?.uid, progressHydrated]);

  // Day timeline completion toggle
  const toggleDayCompleted = (dayIndex: number) => {
    setDaysCompleted((prev) => {
      const updated = [...prev];
      updated[dayIndex] = !updated[dayIndex];
      return updated;
    });
  };

  // Reset Workbook Action
  const handleResetWorkbook = () => {
    setAnswers(INITIAL_ANSWERS);
    setDaysCompleted(Array(12).fill(false));
    setCurrentPage(1);
    // Server-side progress persistence handles the reset.
  };

  const daysCompletedCount = daysCompleted.filter(Boolean).length;

  const handlePanelChange = (panelId: string) => {
    setActivePanel(panelId);
    setMobileMenuOpen(false); // Close drawer on navigation
    
    // Log movement/action
    const panelNamesAr: Record<string, string> = {
      dashboard: "الرئيسية",
      reader: "قراءة الدليل الشامل",
      workbook: "كراسة العمل التخطيطية",
      challenge: "تحدي الـ 12 يوماً",
      coach: "كوتش الذكاء الاصطناعي",
      generator: "صانع المنشورات والسكريبتات",
      prompts: "بنك الأوامر الذكية 50 ChatGPT",
      templates: "القوالب ووسائل البيع الجاهزة"
    };
    if (panelNamesAr[panelId]) {
      logStudentActivity(`الانتقال إلى لوحة: ${panelNamesAr[panelId]}`);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] text-slate-800 font-sans min-h-screen relative">
      
      {/* 1. Collapsible Desktop right Sidebar Navigation (RTL layout!) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0b1d33] text-white p-5 border-l border-slate-800 relative z-20 flex-shrink-0">
        
        {/* Sidebar Brand Header */}
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-800 mb-6 font-semibold select-none">
          <span className="text-2xl">📓</span>
          <div>
            <h1 className="text-sm font-black leading-tight text-white tracking-wide">
              {lang === "ar" ? "الدليل الشامل للرقميات" : "Comprehensive Passive Wealth Guide"}
            </h1>
            <p className="text-[10px] text-amber-400 mt-0.5 font-bold uppercase tracking-wider">
              {lang === "ar" ? "كراسة عمل وتحدي تفاعلي" : "Interactive Action Workbook"}
            </p>
          </div>
        </div>

        {/* Multi-language selector container in desktop sidebar */}
        <div className="mb-5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5" style={{ direction: "rtl" }}>
          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 justify-end">
            <span>🌐 {t.changeLanguage}</span>
          </label>
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full text-xs font-bold p-1 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-[#f2a900]"
          >
            <option value="ar">العربية (Default)</option>
            <option value="en">English (US)</option>
            <option value="fr">Français (FR)</option>
            <option value="es">Español (ES)</option>
            <option value="tr">Türkçe (TR)</option>
          </select>
        </div>

        {/* Sidebar menu list items */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => handlePanelChange("dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "dashboard"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Home className="w-4.5 h-4.5" />
            <span>{lang === "ar" ? "الرئيسية (Dashboard)" : "Main Dashboard"}</span>
          </button>

          <button
            onClick={() => handlePanelChange("reader")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "reader"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span>{t.navGuide}</span>
          </button>

          <button
            onClick={() => handlePanelChange("workbook")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "workbook"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Edit3 className="w-4.5 h-4.5" />
            <span>{t.navWorkbook}</span>
          </button>

          <button
            onClick={() => handlePanelChange("challenge")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "challenge"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Calendar className="w-4.5 h-4.5" />
            <span>{t.navChallenge}</span>
          </button>

          <button
            onClick={() => handlePanelChange("coach")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "coach"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 text-[#f2a900] animate-pulse" />
            <span>{t.navCoach}</span>
          </button>

          <button
            onClick={() => handlePanelChange("generator")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "generator"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span>{t.navGenerator}</span>
          </button>

          <button
            onClick={() => handlePanelChange("prompts")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "prompts"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>{t.navPrompts}</span>
          </button>

          <button
            onClick={() => handlePanelChange("templates")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right ${
              activePanel === "templates"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FolderOpen className="w-4.5 h-4.5" />
            <span>{t.navTemplates}</span>
          </button>

          <button
            onClick={() => handlePanelChange("admin")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer text-right border-t border-slate-800 pt-3 ${
              activePanel === "admin"
                ? "bg-[#f2a900] text-[#0b1d33] shadow"
                : "text-[#f2a900] hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Settings className="w-4.5 h-4.5 text-[#f2a900]" />
            <span>{t.navAdmin}</span>
          </button>
        </nav>

        {currentStudent && (
          <div className="mx-1 my-3 p-3.5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2.5 text-right font-sans" style={{ direction: "rtl" }}>
            <div className="flex items-center gap-2">
              <div className="w-8.5 h-8.5 bg-[#f2a900]/10 text-[#f2a900] rounded-xl flex items-center justify-center font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-extrabold text-[11.5px] text-slate-100 truncate">{currentStudent.name}</h5>
                <p className="text-[9.5px] text-amber-450 font-bold">{currentStudent.tier}</p>
              </div>
            </div>
            <div className="text-[9.5px] text-slate-400 font-medium truncate">
              📬 {currentStudent.email}
            </div>
            <button
              onClick={handleStudentLogout}
              className="w-full py-1 px-2.5 bg-slate-800/40 hover:bg-rose-950/40 text-rose-450 hover:text-rose-355 font-extrabold text-[9.5px] rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800"
            >
              <LogOut className="w-3 h-3" />
              <span>تسجيل خروج العضو</span>
            </button>
          </div>
        )}

        {/* Sidebar developer copyright/branding info */}
        <div className="border-t border-slate-800 pt-4 text-center text-[10px] text-slate-400 font-semibold space-y-1 leading-relaxed">
          <p>{t.copyright}</p>
        </div>

      </aside>

      {/* 2. Responsive Mobile navigation Header and Sliding Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Navigation Headboard for Mobiles */}
        <header className="lg:hidden bg-[#0b1d33] text-white py-3.5 px-6 flex justify-between items-center border-b-2 border-b-[#f2a900] relative z-35 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <span className="text-xs font-black tracking-wide">الدليل الشامل للمنتجات الرقمية</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Sliding Drawer Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-[#0b1d33]/95 text-white z-40 p-6 flex flex-col justify-between animate-fade-in pt-16">
            
            <nav className="space-y-2 mt-5 select-none" style={{ direction: "rtl" }}>
              {/* Language switcher for mobile drawer */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 mb-2">
                <label className="text-[10px] font-black text-amber-400 block text-right">{t.changeLanguage}</label>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full text-xs font-bold p-1 bg-slate-800 text-white border border-slate-700 rounded outline-none"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English (US)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="es">Español (ES)</option>
                  <option value="tr">Türkçe (TR)</option>
                </select>
              </div>

              <button
                onClick={() => handlePanelChange("dashboard")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "dashboard" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>{lang === "ar" ? "الرئيسية (Dashboard)" : "Main Dashboard"}</span>
              </button>

              <button
                onClick={() => handlePanelChange("reader")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "reader" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>{t.navGuide}</span>
              </button>

              <button
                onClick={() => handlePanelChange("workbook")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "workbook" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <Edit3 className="w-5 h-5" />
                <span>{t.navWorkbook}</span>
              </button>

              <button
                onClick={() => handlePanelChange("challenge")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "challenge" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>{t.navChallenge}</span>
              </button>

              <button
                onClick={() => handlePanelChange("coach")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "coach" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#f2a900] animate-pulse" />
                <span>{t.navCoach}</span>
              </button>

              <button
                onClick={() => handlePanelChange("generator")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "generator" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.navGenerator}</span>
              </button>

              <button
                onClick={() => handlePanelChange("prompts")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "prompts" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.navPrompts}</span>
              </button>

              <button
                onClick={() => handlePanelChange("templates")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right ${
                  activePanel === "templates" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900"
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span>{t.navTemplates}</span>
              </button>

              <button
                onClick={() => handlePanelChange("admin")}
                className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-right border-t border-slate-800 pt-3 ${
                  activePanel === "admin" ? "bg-[#f2a900] text-[#0b1d33]" : "hover:bg-slate-900 text-[#f2a900]"
                }`}
              >
                <Settings className="w-5 h-5 text-[#f2a900]" />
                <span>{t.navAdmin}</span>
              </button>
            </nav>

            {currentStudent && (
              <div className="mt-4 p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-3 text-right" style={{ direction: "rtl" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#f2a900]/10 text-[#f2a900] rounded-xl flex items-center justify-center font-bold shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-extrabold text-[12px] text-slate-100 truncate">{currentStudent.name}</h5>
                    <p className="text-[10px] text-amber-400 font-bold">{currentStudent.tier}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  📬 {currentStudent.email}
                </div>
                <button
                  onClick={handleStudentLogout}
                  className="w-full py-1.5 px-3 bg-slate-800/50 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 font-extrabold text-[10px] rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل خروج العضو</span>
                </button>
              </div>
            )}

            <div className="border-t border-slate-800 pt-5 text-center text-[10px] text-slate-400 leading-relaxed">
              <p>{t.copyright}</p>
            </div>

          </div>
        )}

        {/* 3. Main Stage space displaying active view component */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* AI Retention Notification Banner */}
          {showAiNotification && (
            <div className="bg-gradient-to-r from-slate-900 to-[#0b1d33] border-2 border-amber-400 p-4 rounded-2xl mb-6 shadow-md text-right relative overflow-hidden" style={{ direction: "rtl" }}>
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400/5 rounded-full blur-xl" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl animate-bounce shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                      <span>🤖 رادار المتابعة والتحفيز بالمنصة (AI Platform Retention Engine)</span>
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                    </h5>
                    <p className="text-white text-xs font-semibold mt-1">
                      {lang === "en" 
                        ? "We noticed you stopped for 3 days on Unit 4 (Writing). Smash creative gridlock now!" 
                        : "مرحباً مريم، رصد رادار الذكاء الاصطناعي توقفكِ المؤقت عند [الوحدة الرابعة - الكتابة والتحرير] منذ يومين متتاليين!"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedAiNotification(!expandedAiNotification)}
                    className="bg-amber-400 hover:bg-amber-500 text-[#0b1d33] font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    {expandedAiNotification 
                      ? (lang === "en" ? "Hide Advice" : "إخفاء ترياق التحفيز ⬆️")
                      : (lang === "en" ? "Unveil Motivation Tip" : "الحصول على نصيحة الكوتش السريعة 💡")}
                  </button>
                  <button
                    onClick={() => setShowAiNotification(false)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                    title={lang === "en" ? "Dismiss notification" : "تجاهل التنبيه"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Advice & Prompt to action */}
              {expandedAiNotification && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-slate-200 animate-fade-in text-xs leading-relaxed">
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850">
                    <p className="font-bold text-slate-100 mb-2">🧘‍♀️ وصفة مريم ناهي التوليدية لكسر العقبات الذهنية:</p>
                    <p>
                      "العقبة في الكتابة غالباً ما تنبع من الرغبة في الكمال. لكن تذكري، كتيب من 10 صفحات يحل مشكلة عميل حقيقية يجلب مبيعات مذهلة! لا تؤجلي خطتك. إليك توصيتنا المباشرة:"
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 mt-2 text-slate-300 pr-2">
                      <li>تغلبّي على الخوف من إطلاق أول صفحة ونحن معك خطوة بخطوة.</li>
                      <li>افتحي <b>صانع السكريبتات ورسائل البيع</b> بالجانب فوراً لإنشاء حملة تسويق سريعة تمنحكِ دافعاً معنوياً ملحوظاً!</li>
                      <li>تصفحي قائمة المنتجات بالأسفل لمشاهدة الزملاء الذين أطلقوا وحققوا أولى أرباحهم للتو لتستلهمي منهم.</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => {
                        handlePanelChange("coach");
                        setExpandedAiNotification(false);
                      }}
                      className="bg-[#0b1d33] hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      🗣️ مراجعة كوتشك الشخصي الذكي
                    </button>
                    <button
                      onClick={() => {
                        handlePanelChange("generator");
                        setExpandedAiNotification(false);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      🚀 تشغيل مولد السكريبتات الذكي
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {authLoading && <p role="status" className="p-4 bg-white rounded-lg">جارٍ التحقق من الجلسة واسترجاع تقدمك...</p>}
          {authError && <p role="alert" className="p-4 bg-red-50 text-red-800 rounded-lg">{authError}</p>}
          {currentStudent && !currentStudent.demo && <p role="status" className="mb-2 text-xs text-slate-500">{saveState === "error" ? "تعذر الحفظ السحابي؛ لا تغلقي الصفحة قبل حل المشكلة." : saveState === "saving" ? "جارٍ حفظ تقدمك..." : saveState === "saved" ? "تم حفظ التقدم على الخادم." : ""}</p>}
          {currentStudent === null && activePanel !== "admin" && !authLoading ? (
            <StudentLogin onLoginSuccess={handleStudentLoginSuccess} lang={lang} />
          ) : (
            <>
              {currentStudent !== null && activePanel === "dashboard" && (
                <Dashboard
                  answers={answers}
                  daysCompletedCount={daysCompletedCount}
                  activePanelSetter={handlePanelChange}
                  currentPageSetter={handleSetCurrentPage}
                  lang={lang}
                />
              )}
            </>
          )}

          {currentStudent !== null && activePanel === "reader" && (
            <BookReader
              answers={answers}
              setAnswers={setAnswers}
              currentPage={currentPage}
              setCurrentPage={handleSetCurrentPage}
              daysCompleted={daysCompleted}
              toggleDayCompleted={toggleDayCompleted}
            />
          )}

          {currentStudent !== null && activePanel === "workbook" && (
            <Workbook
              answers={answers}
              setAnswers={setAnswers}
              resetAnswers={handleResetWorkbook}
            />
          )}

          {currentStudent !== null && activePanel === "challenge" && (
            /* Detailed visual Challenge staging */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#0b1d33]">🗓️ تحدي تحديث الـ 12 يوماً لإنتاج وإطلاق مشروعك</h2>
                <p className="text-slate-500 text-xs mt-1">
                  لا تنتظر المماطلة لتسلبك مستقبلك، اتبع الجدول العملي اليومي لإنقاذ عقبات منتجك وإدراجه للبيع غضون 12 يوماً متتالياً!
                </p>
              </div>

              {/* Motivator block */}
              <div className="bg-gradient-to-r from-[#0b1d33] to-[#0f294a] text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-md">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-100">معدل الانضباط بالتحدي: {daysCompletedCount} من أصل 12 يوماً</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    {daysCompletedCount === 12
                      ? "تهانينا الحارة! لقد أنجزت تحديك بالكامل وأنت جاهز مائة بالمائة للإطلاق اليوم! 🚀"
                      : daysCompletedCount > 6
                      ? "خطواتك رائعة وثابتة، لقد تجاوزت نصف الطريق وأراك قريباً تتلقى المبيعات! 🔥"
                      : "البدايات دائماً تتطلب قوة وتصميم. أكمل مهمة اليوم وحافظ على انضباطك اليومي!"}
                  </p>
                </div>
                <div className="bg-[#f2a900] text-[#0b1d33] px-4 py-2 text-xs font-black rounded-lg">
                  {Math.round((daysCompletedCount / 12) * 100)}% مكتمل
                </div>
              </div>

              {/* Days timeline mapped */}
              <div className="space-y-4">
                {[
                  { day: 1, title: "اختيار الفكرة الرقمية المناسبة [اليوم الأول]", desc: "توجه لقائمة الـ 25 فكرة بونص 2، واختر واحدة فقط تتقاطع فيها مهاراتك مع أزمة حقيقية بالسوق.", guide: "نصيحة: الفكرة الأبسط والأسرع هي دليلك الإرشادي الأول PDF." },
                  { day: 2, title: "تحليل المعاناة والغصة لجمهورك [اليوم الثاني]", desc: "اكتب مسودة المشكلة بدقة. تصفح تيك توك وتعرف على الشكاوى والكلمات المكررة للجمهور.", guide: "نصيحة: كلما زاد الألم والشكوى، زادت لهفة الجمهور وتضاعفت رغبة الشراء." },
                  { day: 3, title: "كتابة الوعد الفعال واسم المنتج [اليوم الثالث]", desc: "صغ عنواناً جذاباً لصفحة البيع يصف النتيجة المضمونة التي سيصل لها زبونك عند التطبيق.", guide: "نصيحة: تجنب الأسماء الباردة، استخدم صيغاً مثل 'كيف تتحدث بطلاقة غضون...'." },
                  { day: 4, title: "تصميم المخطط وتجزيء الفصول [اليوم الرابع]", desc: "قسم موضوع الكتيب لـ 3 إلى 5 فصول فرعية، وصغ مسودة العناوين ليسهل تبيانها بالـ Word.", guide: "نصيحة: هيكل منظم يسهل على المشتري متابعة دليلك وتطبيقه بصدر منشرح." },
                  { day: 5, title: "كتابة المسودة الأولى بلا حدود للأخطاء [اليوم الخامس]", desc: "اجمع كل خبراتك المكتوبة وضعها بداخل الفصول. ركز بزيادة القيمة العملية وتفادي حشو الكلام.", guide: "نصيحة: لا تراجع إملائك أثناء الكتابة، فقط اكتب وعبر عما بداخلك." },
                  { day: 6, title: "مراجعة جودة النصوص والصوت [اليوم السادس]", desc: "هنا يحين دور التعديلات وتغذية الكلمات وتصحيح الإملاء. يمكنك الاستعانة بـ ChatGPT للمراجعة.", guide: "نصيحة: استخدم أوامرك بالذكاء لتنظيف النص تماماً والتعبير بلغة سلسلة للجميع." },
                  { day: 7, title: "تصميم هيبة غلاف ورواية Canva [اليوم السابع]", desc: "أكمل كروت غلاف كتيبك ومنشورات ترويج فكرة علامتك بCanva، اختر ألواناً دافئة تشعرك بالثقة.", guide: "نصيحة: غلاف مريح بمظهر احترافي يزيد من جاذبية صفحة الشراء لضعفين!" },
                  { day: 8, title: "التصدير النهائي لملف الـ PDF [اليوم الثامن]", desc: "أفرغ محتوى نصوصك بقوالب Canva أو Google Docs، وتأكد من جودة الإخراج وصدره مباشرة كـ PDF.", guide: "نصيحة: تأكد من وضوح حجم الخط وسهولة قراءته بالهواتف." },
                  { day: 9, title: "ربط بوابات الدفع والتسليم بـ Gumroad [اليوم التاسع]", desc: "سجل حسابك بـ Gumroad واملأ تفاصيل استلام العوائد المصرفية ليكون متجرك مهيئاً لاستقطاب الأموال.", guide: "نصيحة: لا تطلب معلومات معقدة، فقط البريد والبطاقة لتسهيل حركة البيع." },
                  { day: 10, title: "تسعير منتجك وصراخ العرض المالي [اليوم العاشر]", desc: "أضف أسعاراً معتدلة (مثل 29$ للخصم) وصغ نصوص الوصف المبيعي المليئ بالفوائد والوعود الحاسم.", guide: "نصيحة: تصفح قوالب صفحات المبيعات بونص 4 لأخذ الصياغة النفسية." },
                  { day: 11, title: "صناعة أول 3 سكريبتات تيك توك ترويجية [اليوم الحادي عشر]", desc: "افتح الكاميرا أو استخدم الفيديوهات المجهزة، وسجل حديثاً يعالج الأوجاع بنقاط ويدعوهم للبايو.", guide: "نصيحة: استخدم سكريبتات صانع المنصة لتيسير التوليد السريع." },
                  { day: 12, title: "بث النشر وبدء مشاركة رابط الشراء [اليوم الثاني عشر]", desc: "انشر محتواك لـ 7 أيام متتالية، شاركه بفيسبوك وتليغرام، وتطلع لاستقبال مبيعتك الأولى بكل لهفة!", guide: "نصيحة: الصبر والتكرار هو سر النجاح وبناء الثقة." },
                ].map((d, dIdx) => (
                  <div
                    key={d.day}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition flex flex-col md:flex-row gap-5 hover:shadow-sm ${
                      daysCompleted[dIdx] ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                    }`}
                  >
                    <div className="flex-shrink-0 flex items-center justify-between md:flex-col md:justify-start gap-4">
                      <span
                        className={`text-xs font-black py-1 px-3.5 rounded-full ${
                          daysCompleted[dIdx] ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-[#d69600]"
                        }`}
                      >
                        اليوم {d.day}
                      </span>
                      <button
                        onClick={() => toggleDayCompleted(dIdx)}
                        className={`p-2 rounded-xl text-center text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border select-none ${
                          daysCompleted[dIdx]
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {daysCompleted[dIdx] ? <CheckCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        <span>{daysCompleted[dIdx] ? "أتممت هذا اليوم!" : "علم كمنجز"}</span>
                      </button>
                    </div>

                    <div className="flex-1 space-y-2 text-right">
                      <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">{d.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{d.desc}</p>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-[10px] sm:text-xs text-[#d69600]">
                        👉 {d.guide}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStudent !== null && activePanel === "generator" && <ScriptGenerator />}

          {currentStudent !== null && activePanel === "prompts" && <PromptHub />}

          {currentStudent !== null && activePanel === "templates" && <TemplatesCenter />}

          {currentStudent !== null && activePanel === "coach" && (
            <AIPersonalCoach
              answers={answers}
              daysCompletedCount={daysCompletedCount}
              onNavigateToPanel={handlePanelChange}
              lang={lang}
            />
          )}

          {activePanel === "admin" && (
            !currentStudent || !isAdminAuthenticated ? (
              <div role="alert" className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-sm">
                لوحة المالكة محمية على الخادم باستخدام Firebase UID. سجلي الدخول بحساب المالكة المعرّف على الخادم؛ لا يوجد رمز PIN في المتصفح.
              </div>
            ) : <div className="space-y-4">
              <button onClick={handleAdminLockSession} className="rounded-xl border px-4 py-2 bg-white">العودة للرئيسية</button>
              <AdminOverview />
              <AdminSuite answers={answers} daysCompletedCount={daysCompletedCount} onNavigateToPanel={handlePanelChange} lang={lang} />
            </div>
          )}
        </main>
      </div>

      <FloatingProofToast lang={lang} />
    </div>
  );
}
