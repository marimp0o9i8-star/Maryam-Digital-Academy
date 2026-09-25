import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Compass, 
  Award, 
  Brain, 
  Activity, 
  Send, 
  RefreshCw, 
  Flame, 
  BookOpen, 
  HelpCircle, 
  Lock,
  Target
} from "lucide-react";

interface AIPersonalCoachProps {
  answers: any;
  daysCompletedCount: number;
  onNavigateToPanel: (panelId: string) => void;
  lang?: string;
}

export default function AIPersonalCoach({ answers, daysCompletedCount, onNavigateToPanel, lang = "ar" }: AIPersonalCoachProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "مرحباً بك يا شريك الإطلاق الرائع! 👋 أنا مستشارك الشخصي المدعوم بالذكاء الاصطناعي الفوقي، المتخصص حصرياً في هندسة المنتجات الرقمية والتغلب على مصاعب البدايات وعقبات المماطلة والكسل.\n\nأخبرني، أين تقف الآن؟ وما هي الفكرة التي تود تحويلها لذهب في عالم المنتجات الرقمية؟ 💡"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeQuickBlock, setActiveQuickBlock] = useState<string | null>(null);
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [generatingCoachResponse, setGeneratingCoachResponse] = useState(false);

  // References
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Count answer progress
  const calculateProgressPoints = () => {
    let filled = 0;
    if (answers) {
      Object.keys(answers).forEach((key) => {
        if (typeof answers[key] === "string" && answers[key].trim() !== "") filled++;
        if (typeof answers[key] === "boolean" && answers[key] === true) filled++;
      });
    }
    return filled;
  };

  const completedAnswers = calculateProgressPoints();
  const overallScoreMax = 20; // weight threshold
  const completionRatio = Math.min(Math.round(((completedAnswers + (daysCompletedCount * 1.5)) / overallScoreMax) * 100), 100);

  // Suggested Prompts
  const ArabicPrompts = [
    { text: "أواجه صعوبة في تسعير منتجي الأول بثقة 💰", textValue: "أواجه صعوبة كبيرة في تسعير منتجي الرقمي الأول وأخشى أن يكون مرتفعاً أو منخفضاً جداً. ساعدني في وضع استراتيجية تسعير نفسية ذكية." },
    { text: "كيف أتغلب على رهبة البداية وفقدان الشغف؟ 🧠", textValue: "أشعر أنني متوقف تماماً عن إكمال كراسة العمل وفقدت الحافز والتركيز. ساعدني بنصائح عملية متعلقة فقط بالمنتجات الرقمية للتغلب على هذه المماطلة والبدء فوراً." },
    { text: "اقترح لي 3 عناوين لكتاب إلكتروني في مجالي 💡", textValue: "أود إنتاج منتج رقمي مخصص للجمهور العربي. اقترح لي 3 عناوين جذابة ومغناطيسية لكتاب إلكتروني وصناعة محتوى ترويجي له." },
    { text: "كيف يمكنني إطلاق منتج رقمي بـ 0 دولار؟ 🚀", textValue: "أنا ميزانيتي صفر حالياً وأبحث عن الطريقة الأكثر فعالية لإنشاء وإطلاق منتجي الإلكتروني الجديد واستلام قيمة مبيعاتي." }
  ];

  const EnglishPrompts = [
    { text: "How to price my first digital package? 💰", textValue: "I have difficulty pricing my digital product. Help me design a psychological and highly profitable pricing strategy." },
    { text: "Overcoming imposter syndrome & starting out 🧠", textValue: "I feel stuck due to procrastination and imposter syndrome. Give me digital product specific advice to regain my launch mojo." },
    { text: "Give me 3 magnet titles for my digital guide 💡", textValue: "Please suggest 3 killer, high-converting launch titles for my digital eBook/template package." },
    { text: "How can I launch my product with $0 budget? 🚀", textValue: "Tell me exactly how to build and launch my first digital asset using free tools and organic marketing." }
  ];

  const promptsList = lang === "ar" ? ArabicPrompts : EnglishPrompts;

  // Handles chat submits
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory
        })
      });

      const data = await response.json();
      if (data.reply) {
        setChatHistory(prev => [...prev, { role: "model", text: data.reply }]);
      } else if (data.error) {
        setChatHistory(prev => [...prev, { role: "model", text: `⚠️ حدث خطأ: ${data.error}` }]);
      } else {
        setChatHistory(prev => [...prev, { role: "model", text: "⚠️ عذراً، لم أتمكن من الحصول على استجابة من الخادم." }]);
      }
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "model", text: "⚠️ حدث خطأ أثناء الاتصال بالمستشار الذكي. تأكد من اتصالك بالإنترنت وتفعيل مفتاح غيمني." }]);
    } finally {
      setLoading(false);
    }
  };

  // Handles fast remedies for writer block/procrastination
  const handleTriggerQuickRemedy = async (blockId: string, label: string) => {
    setActiveQuickBlock(blockId);
    setGeneratingCoachResponse(true);
    setCoachResponse(null);

    let prompt = "";
    if (blockId === "writer_block") {
      prompt = "أنا عالق تماماً في كتابة وصياغة محتوى منتجي الرقمي (Writer's Block). رتب لي خطة فورية من 3 خطوات مبسطة جداً لإنشاء مسودة أولية لكتيبي الإلكتروني اليوم دون كمالية مفرطة.";
    } else if (blockId === "lazy_delay") {
      prompt = "لقد قمت بتأجيل التحدي اليوم وأشعر بالكسل الشديد والمماطلة وسوف يفوتني قطار العمل الحر. أيقظني بجرعة تحفيز تكتيكية وخطة لإنهاء مهمة واحدة فقط في كراستي خلال 15 دقيقة القادمة.";
    } else if (blockId === "fear_people") {
      prompt = "أشعر بالخوف والرعب الشديد من إطلاق منتجي وسماع آراء الناس وتلقي الانتقادات، وأخشى ألا يعجبهم أحد. كيف أتغلب على متلازمة المحتال هذه فكرياً وعملياً؟";
    } else if (blockId === "chaos_organize") {
      prompt = "أواجه فوضى عارمة وتشتت ذهني في تنظيم أفكاري وفهرسة الملف الرقمي، ولا أعلم بأي قسم أبدأ ومن أين أنتهي. أرشدني لكيفية تصفية الذهن وتقسيم المجهود بحكمة.";
    } else if (blockId === "no_traffic") {
      prompt = "أشعر أنني سأقضي أياماً وساعات دون مبيعات ولن يشتري أحد كتيباتي لأنني لا أملك آلاف المتابعين على تيك توك. أعطني خطة التسويق العضوي الهدام المذكور في الدليل للبدء بمتابع واحد.";
    }

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      if (data.reply) {
        setCoachResponse(data.reply);
      } else {
        setCoachResponse("حدث خطأ أثناء الاتصال بالذكاء الفوقي.");
      }
    } catch (err) {
      setCoachResponse("عذراً، لم نستطع الحصول على الدواء المحفز؛ يرجى التأكد من إعدادات المفتاح.");
    } finally {
      setGeneratingCoachResponse(false);
    }
  };

  const UI_TEXT = {
    ar: {
      coachTitle: "الموجّه الشخصي المحفّز وسفير الإطلاق 🤖🌟",
      coachSub: "مساعد مجاني ومستشار ذكاء اصطناعي فوقي لمكافحة المماطلة وحل حواجز التوقف، ليبقى تقدمك مستمراً وصناعتك حية في مجال المنتجات الرقمية حصرياً.",
      momentum: "مؤشر زخم استمرارية الإنجاز ⚡",
      momentumSub: "يتحرك هذا المؤشر تلقائياً بناءً على إكمالك للتحدي اليومي والكراسة التفاعلية. استمر ولا تتوقف!",
      noAnswersFilled: "لم تبدأ بعد في تعبئة الكراسة، لا بأس فالأيام أمامك!",
      daysDone: "تحديات منجزة",
      tasksDone: "مهام كراسة محلولة",
      rate: "نسبة الجاهزية لإطلاق كتابك الإلكتروني:",
      quickTitle: "💡 الإسعافات النفسية والعملية السريعة (ترياق التوقف)",
      quickSub: "هل تواجه عائقاً ذهنياً أو تشعر بالخمول حالياً؟ اختر العائق المناسب لتلقي حقنة من التحفيز والإرشاد التكتيكي لتستمر فوراً:",
      block1: "أنا عالق في كتابة منتجي 📝 (Writer's Block)",
      block2: "أشعر بالكسل الشديد والمماطلة اليوم 📅",
      block3: "متخوف ومرعوب من كلام وتقييمات الناس 🥺",
      block4: "أعاني من تشتت ذهني وفوضى تنظيم المحتوى 🌀",
      block5: "أخشى ألا تأتي المبيعات لقلة المتابعين 💥",
      coachRecipe: "⚡ خطة الدواء والعلاج المستهدف من كوتش الإطلاق:",
      generating: "جاري استشارة الذكاء الفوقي وتجهيز الترياق المحفز...",
      chatTitle: "💬 المستشار الشخصي التفاعلي والمغناطيسي (نظام غيمني 3.5)",
      chatPlaceholder: "اسأل المستشار أي سؤال بخصوص كتابتك للمنتج، التسويق، التسعير، أو كسر العقبات ذهاباً وإياباً...",
      termsWarning: "🚨 ملاحظة الأمن الفوقي: هذا المساعد مبرمج بدقة وحصرياً للإجابة عن صناعة وتجارة المنتجات الرقمية ومواجهة حواجز الإحباط للكاتب. لن يتم التفاعل مع الأسئلة الخارجة عن التخصص لتوفير التركيز التام."
    },
    en: {
      coachTitle: "AI Personal Launcher & Motivation Coach 🤖🌟",
      coachSub: "A free, Gemini-powered AI Mentor designed to combat procrastination, break creative block, and keep you strictly on track towards digital passive wealth.",
      momentum: "Launch Momentum Tracker ⚡",
      momentumSub: "This indicator recalculates dynamically as you check challenge days and complete workbook tasks.",
      noAnswersFilled: "No answers completed yet. Take a simple step today!",
      daysDone: "Days Done",
      tasksDone: "Workbook Tasks Done",
      rate: "Readiness Rate to Launch Your Digital Product:",
      quickTitle: "💡 Quick Psychological & Tactical Remedies (Anti-Procrastination)",
      quickSub: "Encountering a mental roadblock or feeling low on fuel? Tap any symptom below to receive immediate, hyper-targeted launch advice:",
      block1: "I have severe Writer's Block 📝",
      block2: "I'm procrastinating and feeling lazy today 📅",
      block3: "Fear of judgment & imposter syndrome 🥺",
      block4: "My ideas are messy and scattered 🌀",
      block5: "I worry no one will buy (No audience) 💥",
      coachRecipe: "⚡ Target Catalyst Prescription from Coach:",
      generating: "Consulting Gemini AI networks for your customized catalyst...",
      chatTitle: "💬 Interactive Passive Income Niche Mentor (Gemini 3.5)",
      chatPlaceholder: "Ask me anything about product writing, pricing, marketing, or overcoming your doubts...",
      termsWarning: "🚨 Niche Shield: This AI is highly optimized to answer ONLY digital product, passive income, and book writing queries. Off-topic questions will be bypassed to keep your launch trajectory locked."
    }
  };

  const t = lang === "en" ? UI_TEXT.en : UI_TEXT.ar;

  return (
    <div className="space-y-7" id="ai-personal-coach-panel">
      
      {/* 1. Header Hero Panel */}
      <div className="relative bg-gradient-to-r from-[#030914] to-[#0b1d33] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f2a900]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="space-y-3 text-right md:text-right w-full">
            <div className="flex items-center gap-2.5 justify-center md:justify-start">
              <span className="bg-[#f2a900]/15 text-[#f2a900] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#f2a900] animate-pulse" /> FREE AI TOOL
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                ACTIVE COCHING
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-[#f2a900] tracking-tight leading-normal drop-shadow-sm">
              {t.coachTitle}
            </h2>
            
            <p className="text-slate-350 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              {t.coachSub}
            </p>
          </div>
          
          <div className="flex-shrink-0 animate-bounce duration-1000 hidden md:block">
            <div className="w-16 h-16 bg-[#f2a900]/10 rounded-2xl border border-[#f2a900]/30 flex items-center justify-center">
              <Brain className="w-10 h-10 text-[#f2a900] stroke-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Launch Momentum Tracker Widget */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-[#f2a900] rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#0b1d33] text-sm">
                {t.momentum}
              </h4>
              <p className="text-slate-400 text-[10px] mt-0.5">
                {t.momentumSub}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-end">
            <div className="text-center bg-slate-50 border px-3 py-1.5 rounded-xl">
              <div className="text-xs text-slate-400 font-bold">{t.daysDone}</div>
              <div className="text-sm font-black text-[#0b1d33]">{daysCompletedCount}/12</div>
            </div>
            <div className="text-center bg-slate-50 border px-3 py-1.5 rounded-xl">
              <div className="text-xs text-slate-400 font-bold">{t.tasksDone}</div>
              <div className="text-sm font-black text-emerald-600">{completedAnswers}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-650">
            <span>{t.rate}</span>
            <span className="font-black text-[#0b1d33] bg-[#f2a900]/20 px-2 py-0.5 rounded-md">{completionRatio}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-[#f2a900] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${completionRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Quick Antidotes Grid */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="space-y-1 select-none text-right">
          <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-1.5 justify-end">
            <span>{t.quickTitle}</span>
            <Compass className="w-4.5 h-4.5 text-[#f2a900]" />
          </h4>
          <p className="text-slate-500 text-xs">
            {t.quickSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          <button
            onClick={() => handleTriggerQuickRemedy("writer_block", t.block1)}
            className={`p-3.5 text-right rounded-xl border transition text-xs font-bold leading-normal cursor-pointer flex items-start gap-2.5 hover:shadow-sm ${
              activeQuickBlock === "writer_block"
                ? "bg-[#0b1d33] text-white border-[#0b1d33]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
            }`}
          >
            <span className="text-right">{t.block1}</span>
          </button>

          <button
            onClick={() => handleTriggerQuickRemedy("lazy_delay", t.block2)}
            className={`p-3.5 text-right rounded-xl border transition text-xs font-bold leading-normal cursor-pointer flex items-start gap-2.5 hover:shadow-sm ${
              activeQuickBlock === "lazy_delay"
                ? "bg-[#0b1d33] text-white border-[#0b1d33]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
            }`}
          >
            <span className="text-right">{t.block2}</span>
          </button>

          <button
            onClick={() => handleTriggerQuickRemedy("fear_people", t.block3)}
            className={`p-3.5 text-right rounded-xl border transition text-xs font-bold leading-normal cursor-pointer flex items-start gap-2.5 hover:shadow-sm ${
              activeQuickBlock === "fear_people"
                ? "bg-[#0b1d33] text-white border-[#0b1d33]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
            }`}
          >
            <span className="text-right">{t.block3}</span>
          </button>

          <button
            onClick={() => handleTriggerQuickRemedy("chaos_organize", t.block4)}
            className={`p-3.5 text-right rounded-xl border transition text-xs font-bold leading-normal cursor-pointer flex items-start gap-2.5 hover:shadow-sm ${
              activeQuickBlock === "chaos_organize"
                ? "bg-[#0b1d33] text-white border-[#0b1d33]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
            }`}
          >
            <span className="text-right">{t.block4}</span>
          </button>

          <button
            onClick={() => handleTriggerQuickRemedy("no_traffic", t.block5)}
            className={`p-3.5 text-right rounded-xl border transition text-xs font-bold leading-normal cursor-pointer flex items-start gap-2.5 hover:shadow-sm ${
              activeQuickBlock === "no_traffic"
                ? "bg-[#0b1d33] text-white border-[#0b1d33]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
            }`}
          >
            <span className="text-right">{t.block5}</span>
          </button>
        </div>

        {/* Display Quick Remedy Response */}
        {(generatingCoachResponse || coachResponse) && (
          <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl mt-4 animate-fade-in space-y-3">
            <h5 className="text-[#0b1d33] font-black text-xs sm:text-sm flex items-center gap-1.5 justify-end">
              <span>{t.coachRecipe}</span>
              <Sparkles className="w-4.5 h-4.5 text-[#f2a900]" />
            </h5>

            {generatingCoachResponse ? (
              <div className="flex items-center gap-3 text-slate-500 text-xs py-4 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-[#f2a900]" />
                <span>{t.generating}</span>
              </div>
            ) : (
              <div className="text-slate-850 text-xs sm:text-sm leading-relaxed text-right whitespace-pre-line font-medium pr-1.5">
                {coachResponse}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Interactive Specialized Gemini Chat */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="bg-[#0b1d33] text-white p-4 flex justify-between items-center select-none border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold tracking-wide px-2 py-0.5 rounded-md uppercase font-mono">
              GEMINI PRO v3.5
            </span>
          </div>
          <div className="text-right">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#f2a900]">
              {t.chatTitle}
            </h4>
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 " style={{ direction: "rtl" }}>
          {chatHistory.map((chat, idx) => (
            <div 
              key={idx} 
              className={`flex ${chat.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                chat.role === "user" 
                  ? "bg-slate-200 text-slate-850 rounded-tr-none select-text text-left"
                  : "bg-white text-slate-850 border border-slate-100 rounded-tl-none pr-3 shadow-xs select-text text-right whitespace-pre-line"
              }`}>
                {/* Identifier */}
                <div className="text-[9px] font-black text-slate-400 mb-1">
                  {chat.role === "user" ? "شريك الإطلاق (أنت)" : "الموجّه الفوقي الذكي 🤖"}
                </div>
                <span>{chat.text}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-end">
              <div className="bg-white text-slate-400 border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#f2a900] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#f2a900] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#f2a900] rounded-full animate-bounce" />
                </div>
                <span className="text-[11px] font-bold">المستشار يفكر في استراتيجية الإطلاق...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2" style={{ direction: "rtl" }}>
          {promptsList.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setChatInput(prompt.textValue);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-[11px] font-bold rounded-full transition shrink-0 cursor-pointer"
            >
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleChatSubmit} className="p-3 border-t bg-white flex gap-2.5" style={{ direction: "rtl" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33] text-xs sm:text-sm font-medium text-right"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || loading}
            className="p-3 bg-[#0b1d33] hover:bg-slate-800 disabled:bg-slate-300 text-[#f2a900] disabled:text-slate-400 rounded-xl transition cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </form>
      </div>

      {/* Warning Terms Note */}
      <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl select-none text-[10px] leading-relaxed text-slate-550 flex items-start gap-2 text-right">
        <div className="text-right flex-1 font-semibold text-amber-900 leading-normal">
          {t.termsWarning}
        </div>
      </div>

    </div>
  );
}
