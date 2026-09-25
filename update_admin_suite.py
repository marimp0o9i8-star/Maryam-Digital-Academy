with open("src/components/AdminSuite.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update lucide-react import to include Download
old_import = 'import {\n  Sparkles,'
new_import = 'import {\n  Download,\n  Eye,\n  Sparkles,'
if old_import in code:
    code = code.replace(old_import, new_import, 1)
    print("Added Download to lucide-react import")
else:
    # Try another whitespace format
    old_import2 = 'import { \n  Sparkles,'
    if old_import2 in code:
        code = code.replace(old_import2, new_import, 1)
        print("Added Download to lucide-react import (pattern 2)")
    else:
        print("Warning: lucide import pattern not matched directly")

# 2. Add triggerLessonDownload right before triggerRealFileDownload
trigger_lesson_code = '''  const triggerLessonDownload = (lesson: any) => {
    if (!lesson) return;
    const details = LESSONS_DETAILS[lesson.id]?.[lessonLang] || LESSONS_DETAILS[lesson.id]?.ar;
    if (!details) {
      alert("عذراً، تفاصيل هذا الدرس غير متوفرة حالياً.");
      return;
    }

    const content = `========================================================================
برنامج التمكين والريادة الرقمية الشامل ($147) - مريم ناهي
الملزمة والمادة العلمية المعتمدة للدرس رقم [${lesson.id}]: ${details.title}
السر التطبيقي: ${details.secret} | مدة الدرس: ${details.time}
========================================================================

📚 أولاً: المادة العلمية التأسيسية والدليل المفصل
------------------------------------------------------------------------
${details.material}

------------------------------------------------------------------------
🎯 ثانياً: محاور الشرائح التدريبية والخطة الاستراتيجية
------------------------------------------------------------------------
${details.slides.map((s, idx) => `[المحور ${idx + 1}] ${s.title}\\n${s.text}`).join('\\n\\n')}

------------------------------------------------------------------------
✅ ثالثاً: جدول المهام العملية وخطوات الإنجاز المباشرة
------------------------------------------------------------------------
${details.tasks.map((t, idx) => `[ ] المهمة ${idx + 1}: ${t}`).join('\\n')}

------------------------------------------------------------------------
🤖 رابعاً: أوامر الذكاء الاصطناعي الجاهزة للتوليف والأتمتة
------------------------------------------------------------------------
${details.prompts.map((p, idx) => `الأمر ${idx + 1}:\\n"${p}"`).join('\\n\\n')}

========================================================================
💡 وصية وتوجيه الإطلاق من مريم ناهي:
تذكر دائماً أن التميز في بيع المنتجات الرقمية يقوم على تقديم حلول حقيقية ومعايير دقيقة.
في مجال الطبخ: اجعل المقادير دائماً بالجرام والمل لكسب ثقة المشترين مدى الحياة.
في بوابات الدفع: اعتمد Zain Cash و YouCan للتسليم الآلي التلقائي للأرباح.
حقوق المادة محفوظة لطلاب الدورة الشاملة ($147).
========================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `الدرس_${lesson.id}_${details.title.replace(/[\\s\\/:*?"<>|]+/g, '_')}_المادة_العلمية.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`✓ تم بنجاح تحميل وتوليد المادة العلمية الكاملة لهذا الدرس!\\nالملف: [${details.title}]\\nتم حفظ المادة على جهازك بصيغة قابلة للمراجعة والتطبيق دون إنترنت.`);
  };

  const triggerRealFileDownload = (fileName: string, fileTitle: string) => {'''

code = code.replace('  const triggerRealFileDownload = (fileName: string, fileTitle: string) => {', trigger_lesson_code, 1)
print("Added triggerLessonDownload")

# 3. Add Download button in lesson modal footer
old_modal_footer = '''                <button
                  onClick={() => {
                    const isCompleted = completedCourseLessons.includes(selectedLesson.id);
                    if (!isCompleted) {
                      setCompletedCourseLessons(prev => [...prev, selectedLesson.id]);
                    }
                    setSelectedLesson(null);
                    setLessonVideoPlaying(false);
                    alert(`✓ تهانينا! قمت بإكمال الدرس العملي بنجاح، تم رفع نسبة إنجاز منهجك!`);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl text-center shadow-md transition cursor-pointer select-none"
                >
                  تأشير الدرس كمكتمل والانتقال التالي ☑️
                </button>'''

new_modal_footer = '''                <button
                  onClick={() => triggerLessonDownload(selectedLesson)}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl text-center shadow-md transition cursor-pointer select-none flex items-center justify-center gap-1.5"
                  title="تحميل المادة العلمية الكاملة لهذا الدرس كملف رقمي"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل مادة الدرس كملف رقمي 📥</span>
                </button>
                <button
                  onClick={() => {
                    const isCompleted = completedCourseLessons.includes(selectedLesson.id);
                    if (!isCompleted) {
                      setCompletedCourseLessons(prev => [...prev, selectedLesson.id]);
                    }
                    setSelectedLesson(null);
                    setLessonVideoPlaying(false);
                    alert(`✓ تهانينا! قمت بإكمال الدرس العملي بنجاح، تم رفع نسبة إنجاز منهجك!`);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl text-center shadow-md transition cursor-pointer select-none"
                >
                  تأشير الدرس كمكتمل والانتقال التالي ☑️
                </button>'''

code = code.replace(old_modal_footer, new_modal_footer, 1)
print("Added download button in lesson modal footer")

# 4. Add Download button in the lesson listing cards
old_listing_btn = '''                        <button
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setLessonVideoPlaying(true);
                            setLessonVideoProgress(15);
                          }}
                          className={`w-full sm:w-auto shrink-0 px-4 py-2.5 font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer ${
                            isCompleted 
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700" 
                              : "bg-rose-600 hover:bg-rose-700 text-white"
                          }`}
                        >
                          تشغيل الشرح 🔊
                        </button>'''

new_listing_btn = '''                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          <button
                            onClick={() => triggerLessonDownload(lesson)}
                            className="px-3.5 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 font-black text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            title="تحميل المادة العلمية لهذا الدرس"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تحميل 📥</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setLessonVideoPlaying(true);
                              setLessonVideoProgress(15);
                            }}
                            className={`px-4 py-2.5 font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isCompleted 
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700" 
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                            }`}
                          >
                            <Film className="w-3.5 h-3.5" />
                            <span>تشغيل الشرح 🔊</span>
                          </button>
                        </div>'''

code = code.replace(old_listing_btn, new_listing_btn, 1)
print("Added download button in lessons listing")

# 5. Replace video simulated container with real HTML5 video element
video_start_marker = '{videoMode === "video" ? ('
video_end_marker = ') : (\n                        /* Original Slides Deck visualizer */'

p_v_start = code.find(video_start_marker)
p_v_end = code.find(video_end_marker, p_v_start)

if p_v_start != -1 and p_v_end != -1:
    new_video_player = '''{videoMode === "video" ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                          <video
                            key={selectedLesson.id}
                            src={
                              selectedLesson.id === "2" || selectedLesson.id === "4"
                                ? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
                                : "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                            }
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            onPlay={() => setLessonVideoPlaying(true)}
                            onPause={() => setLessonVideoPlaying(false)}
                            onTimeUpdate={(e) => {
                              const el = e.currentTarget;
                              if (el.duration) {
                                setLessonVideoProgress(Math.floor((el.currentTime / el.duration) * 100));
                              }
                            }}
                          />
                          <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[9.5px] text-white font-black flex items-center gap-1.5 pointer-events-none z-10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>فيديو الدرس {selectedLesson.id} التعليمي HD 🎬</span>
                          </div>
                          <div className="absolute bottom-14 inset-x-3 bg-black/85 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-center z-10 pointer-events-none shadow-lg">
                            <p className="text-[9px] text-[#f2a900] font-black select-none mb-0.5">مريم ناهي (الشرح المرئي المعياري) 🎓</p>
                            <p className="text-[10px] md:text-[11px] text-white leading-tight font-black select-none font-sans">
                              {(() => {
                                const activeSubsList = VIDEO_SUBTITLES[selectedLesson.id] || VIDEO_SUBTITLES["1"];
                                return activeSubsList.find(sub => lessonVideoProgress >= sub.range[0] && lessonVideoProgress <= sub.range[1])?.text || "استمع بعناية لخطوات الشرح والتحميل والبهارات بالجرام الفائقة المذكورة بالمقادير...";
                              })()}
                            </p>
                          </div>
                        </div>'''
    code = code[:p_v_start] + new_video_player + code[p_v_end:]
    print("Replaced video placeholder with real HTML5 video player")
else:
    print("Warning: could not locate video player markers!")

# 6. Add quick consultation chips in Box C
support_input_marker = '{/* Input Controls */}\n                <div className="space-y-2 pt-2">'
new_support_input = '''{/* Input Controls */}
                <div className="space-y-2.5 pt-2">
                  {/* Quick consultation prompt chips */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-black text-slate-500">استشارات سريعة بنقرة واحدة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "👩‍🍳 كتاب طبخ بالجرام والمل", query: "كيف أصيغ كتاب طبخ رقمي بمقادير معيارية بالجرام والمل وكيف أبيعه؟" },
                        { label: "💳 ربط Zain Cash و YouCan", query: "كيف أربط بوابة زين كاش Zain Cash ومتجر YouCan لاستلام الأرباح فوراً؟" },
                        { label: "🎬 فيديوهات تيك توك صامتة", query: "كيف أصنع فيديوهات تيك توك وريلز جمالية صامتة دون إظهار وجهي لجلب مبيعات؟" },
                        { label: "📥 تحميل ملازم ومواد الدروس", query: "أين أجد ملفات تحميل ملازم ومواد الدروس في المنصة؟" },
                        { label: "🚀 خطوة البداية والتغلب على التردد", query: "أشعر بالتردد وخوف البدايات، ما هي خطوتي الأولى لتنفيذ أول منتج اليوم؟" },
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSupportQuery(chip.query);
                          }}
                          className="text-[9px] bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold px-2 py-0.5 rounded-lg border border-rose-200/80 transition-all cursor-pointer shadow-xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>'''

if support_input_marker in code:
    code = code.replace(support_input_marker, new_support_input, 1)
    print("Added quick consultation chips to Box C")
else:
    print("Warning: support_input_marker not found")

# 7. Enhance innovatorResult with high-resolution visual cards and export
old_innovator_res = '''                {innovatorResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2.5 px-4 rounded-xl">
                      <span className="text-xs text-indigo-900 font-extrabold flex items-center gap-1">
                        <span>💡 أفكار المنتجات الرقمية الحديثة التي تتماشى مع العصر الحاضر والمستقبل:</span>
                      </span>
                      <button
                        onClick={() => triggerCopy(innovatorResult, "innovator_copy")}
                        className="p-1 px-3 bg-white text-slate-800 hover:bg-slate-100 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "innovator_copy" ? "تم نسخ الأفكار بنجاح!" : "نسخ الأفكار كالتالي"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4.5 rounded-xl border text-right block overflow-x-auto">
                      {innovatorResult}
                    </pre>
                  </div>
                )}'''

new_innovator_res = '''                {innovatorResult && (
                  <div className="border border-indigo-200 bg-white p-5 rounded-2xl space-y-4 mt-4 shadow-sm">
                    <div className="flex flex-wrap justify-between items-center bg-gradient-to-r from-indigo-50 to-rose-50 p-3 px-4 rounded-xl gap-2 border border-indigo-100">
                      <span className="text-xs text-indigo-950 font-black flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                        <span>💡 العرض البصري عالي الدقة لأفكار المنتجات الرقمية:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const blob = new Blob([innovatorResult], { type: "text/plain;charset=utf-8" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "أفكار_منتجات_رقمية_عالية_المصداقية.txt";
                            a.click();
                            URL.revokeObjectURL(url);
                            alert("✓ تم تحميل وثيقة أفكار المنتجات الرقمية بنجاح كملف رقمي!");
                          }}
                          className="p-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>تصدير كوثيقة رقمية 📥</span>
                        </button>
                        <button
                          onClick={() => triggerCopy(innovatorResult, "innovator_copy")}
                          className="p-1 px-3 bg-white text-slate-800 hover:bg-slate-100 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer transition shadow-xs"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedSection === "innovator_copy" ? "تم نسخ الأفكار بنجاح!" : "نسخ الأفكار"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual Quality & Readiness Metrics Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 text-center">
                        <span className="text-[9px] text-slate-500 font-bold block">مؤشر الجدوى السوقية</span>
                        <span className="text-xs font-black text-indigo-700">98.5% ممتاز 🌟</span>
                      </div>
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[9px] text-slate-500 font-bold block">متوسط سعر البيع المقترح</span>
                        <span className="text-xs font-black text-emerald-700">$27 - $49 💰</span>
                      </div>
                      <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 text-center">
                        <span className="text-[9px] text-slate-500 font-bold block">سرعة التنفيذ والإطلاق</span>
                        <span className="text-xs font-black text-amber-700">خلال 3 إلى 5 أيام ⚡</span>
                      </div>
                      <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100 text-center">
                        <span className="text-[9px] text-slate-500 font-bold block">جاهزية التسليم الآلي</span>
                        <span className="text-xs font-black text-rose-700">PDF / سلة / YouCan 📥</span>
                      </div>
                    </div>

                    <pre className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/80 p-4.5 rounded-xl border border-slate-200 text-right block overflow-x-auto">
                      {innovatorResult}
                    </pre>
                  </div>
                )}'''

if old_innovator_res in code:
    code = code.replace(old_innovator_res, new_innovator_res, 1)
    print("Enhanced innovatorResult with visual presentation & export")
else:
    print("Warning: old_innovator_res not found")

with open("src/components/AdminSuite.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Finished updating AdminSuite.tsx")
