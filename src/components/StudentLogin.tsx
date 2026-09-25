import React, { useState } from "react";
import { Mail, Phone, Lock, Sparkles, LogIn, ShieldAlert, FileText, Check } from "lucide-react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

interface StudentLoginProps {
  onLoginSuccess: (studentData: {
    name: string;
    email: string;
    phone?: string;
    tier: string;
    progress: string;
    ip: string;
    browser: string;
    loginMethod: string;
    lastActive: string;
  }) => void;
  lang?: string;
}

export default function StudentLogin({ onLoginSuccess, lang = "ar" }: StudentLoginProps) {
  const [method, setMethod] = useState<"email" | "phone" | "google" | "facebook">("email");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Privacy Modal visibility
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const mockIpList = [
    "37.237.142.66 (البصرة، العراق)",
    "37.239.12.18 (بغداد، العراق)",
    "94.201.200.12 (الرياض، السعودية)",
    "188.49.20.101 (الشارقة، الإمارات)",
    "82.178.43.52 (مسقط، عمان)",
    "91.189.105.14 (الكويت)"
  ];

  const getClientInfo = () => {
    const randomIp = mockIpList[Math.floor(Math.random() * mockIpList.length)];
    const ua = navigator.userAgent;
    let browser = "Chrome / Windows";
    if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = "Safari / iPhone";
    } else if (ua.includes("Android")) {
      browser = "Chrome / Android G5";
    } else if (ua.includes("Firefox")) {
      browser = "Firefox / Linux";
    } else if (ua.includes("Macintosh")) {
      browser = "Safari / Macbook Pro";
    }
    return { ip: randomIp, browser };
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form validation
    if (method === "email" && (!emailInput || !passwordInput)) {
      setError("يرجى ملء البريد الإلكتروني وكلمة المرور الحقيقية لتأمين الوصول.");
      setLoading(false);
      return;
    }
    if (method === "phone" && (!phoneInput || !otpInput)) {
      setError("يرجى إدخال رقم الجوال ورمز التحقق OTP المكون من 4 أرقام.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const { ip, browser } = getClientInfo();
      const name = method === "email" 
        ? emailInput.split("@")[0].substring(0, 12) + " (طالب)"
        : "عضو جوال (" + phoneInput.slice(-4) + ")";
      
      const email = method === "email" ? emailInput : `phone_${phoneInput.slice(-6)}@digital-academy.com`;

      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          name: name,
          email: email,
          phone: method === "phone" ? phoneInput : undefined,
          tier: "Silver Tier", // default tier
          progress: "15%",
          ip: ip,
          browser: browser,
          loginMethod: method === "email" ? "البريد الإلكتروني" : "الجوال والرمز الرديف",
          lastActive: "للتو"
        });
      }, 800);
    }, 1200);
  };

  const handleSocialSimulate = (provider: "google" | "facebook") => {
    setLoading(true);
    setMethod(provider);
    setError(null);

    setTimeout(() => {
      const { ip, browser } = getClientInfo();
      const suffix = provider === "google" ? "@gmail.com" : "@facebook.com";
      const userNames = {
        google: ["عبد الرحمن الشمري", "ميرنا أحمد", "دانية العراقي", "زيد الحلي"],
        facebook: ["أبو يوسف الجبوري", "رغدة الملا", "سيف الكناني", "هدى البغدادي"]
      };
      
      const randomName = userNames[provider][Math.floor(Math.random() * userNames[provider].length)];
      const randomEmail = randomName.replace(/\s+/g, '') + Date.now().toString().slice(-4) + suffix;

      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          name: randomName,
          email: randomEmail,
          tier: "Gold VIP", // Social accounts usually elevated to test
          progress: "40%",
          ip: ip,
          browser: browser,
          loginMethod: provider === "google" ? "حساب Google الموثق" : "حساب Facebook الآمن",
          lastActive: "للتو"
        });
      }, 800);
    }, 1000);
  };

  return (
    <div className="min-h-[92vh] w-full flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-tr from-[#020813] via-[#091b30] to-[#041223] rounded-3xl border border-slate-800 shadow-2xl" style={{ direction: "rtl" }}>
      {/* Spectacular Glowing Ambient Lights */}
      <div className="absolute top-[10%] left-[15%] w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none animate-pulse duration-[6000ms]" />
      {/* Precision blueprint-style mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-right relative overflow-hidden z-10">
        {/* Glow Decors inside card */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#0b1d33]/5 rounded-full blur-2xl" />

        {/* Header Block with high-credibility branding */}
        <div className="text-center space-y-3 select-none">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#0b1d33] to-[#1a3a61] text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0b1d33] tracking-tight">بوابة التمكين والريادة الرقمية الشاملة</h3>
            <p className="text-[10.5px] text-slate-500 font-extrabold mt-1">
              ابتكر وصمم منتجاتك الرقمية الحقيقية بناءً على مهارات عملية ومنهجية رصينة ذات مصداقية عالية
            </p>
          </div>

          {/* Genuine Credibility badge in replacement of quick rise promises */}
          <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mx-auto">
            <span>🛡️ المنهجية المهنية المعتمدة (خالية من الوعود الوهمية)</span>
          </div>
        </div>

        {/* Direct Navigation for Quick Access / Guest */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">
            أنت في بيئة عمل مريم ناهي. يمكنك محاكاة التسجيل أو الدخول كضيف فوري!
          </p>
        </div>

        {/* Tab Selector for Login Options */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-extrabold select-none">
          <button
            onClick={() => { setMethod("email"); setError(null); }}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              method === "email" ? "bg-white text-[#0b1d33] shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>البريد الإلكتروني</span>
          </button>
          <button
            onClick={() => { setMethod("phone"); setError(null); }}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              method === "phone" ? "bg-white text-[#0b1d33] shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>رقم الجوال</span>
          </button>
        </div>

        {/* Error Dialog */}
        {error && (
          <div className="bg-rose-50 border border-rose-150 text-rose-700 p-3 rounded-xl text-[11px] font-bold leading-relaxed flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Modal Loader inside container */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-fade-in select-none">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">تم التحقق ومزامنة هويتك الآمنة بنجاح!</h4>
              <p className="text-[10.5px] text-slate-400 font-bold mt-1">جاري توجيه حزمة جلسة العمل المتكاملة...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* EMAIL LOGIN METHOD PATH */}
            {method === "email" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">بريدك الإلكتروني التفاعلي ومجلس إطلاقك:</label>
                  <div className="relative">
                    <input 
                      type="email"
                      placeholder="name@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33] focus:ring-1 focus:ring-[#0b1d33] pl-10 text-left font-mono"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">كلمة المرور المسجلة (Secure Multi-hash):</label>
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33] focus:ring-1 focus:ring-[#0b1d33] pl-10 text-left"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* PHONE LOGIN METHOD PATH */}
            {method === "phone" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">رقم الجوال مع رمز الدولة (WhatsApp Ready):</label>
                  <div className="relative">
                    <input 
                      type="tel"
                      placeholder="+964 780 000 0000"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33] focus:ring-1 focus:ring-[#0b1d33] pl-10 text-left font-mono"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">رمز التحقق الفوري OTP (Simulated PIN):</label>
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="مثال: 4 أرقام مرسلة لجوالك"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      maxLength={6}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33] focus:ring-1 focus:ring-[#0b1d33] text-center font-mono tracking-widest placeholder:text-slate-300"
                      required
                    />
                  </div>
                  <span className="text-[9.5px] text-amber-500 font-extrabold block text-left">* في وضع المراجعة والمحاكاة، أدخل أي رمز لخطوة الدخول!</span>
                </div>
              </div>
            )}

            {/* Remember Me / Privacy Checklist */}
            <div className="flex justify-between items-center text-xs select-none pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 pointer-events-auto accent-[#0b1d33] w-4 h-4"
                />
                <span>حفظ تسجيل الدخول (Remember Me)</span>
              </label>

              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-indigo-600 hover:underline flex items-center gap-1.5 hover:text-indigo-800 font-bold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>الخصوصية والأمان</span>
              </button>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0b1d33] hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              {loading ? (
                <>
                  <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4" />
                  <span>جاري تأمين الاتصال ومزامنة الخادم...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل دخول ومواصلة التحدي العملي</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Division Or */}
        <div className="relative py-1 select-none">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400 font-bold">أو تسجيل دخول آمن بنقرة واحدة</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-1 select-none">
          <button
            onClick={() => handleSocialSimulate("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 rounded-xl cursor-pointer transition"
          >
            <span className="text-sm">🌐</span>
            <span>حساب Google</span>
          </button>
          <button
            onClick={() => handleSocialSimulate("facebook")}
            disabled={loading}
            className="flex items-center justify-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 rounded-xl cursor-pointer transition"
          >
            <span className="text-sm">🔷</span>
            <span>حساب Facebook</span>
          </button>
        </div>

        {/* Safe Badge Footer block */}
        <div className="border-t pt-4 text-center select-none space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span>🛡️</span>
            <span>اتصال محمي بشهادة SSL 256-Bit • معتمد في الشرق الأوسط</span>
          </div>
          <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
            تلتزم منصة كراسة مريم التفاعلية بتشفير مدخلاتك بالكامل وتمنع الذكاء الاصطناعي من استغلال أفكارك الإبداعية لضمان حقك الفكري الحصري.
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        lang={lang} 
      />
    </div>
  );
}
