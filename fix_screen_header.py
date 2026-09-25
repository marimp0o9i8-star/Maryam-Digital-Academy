with open("src/components/AdminSuite.tsx", "r", encoding="utf-8") as f:
    text = f.read()

target_start = '{/* Screen header */}'
target_end = '{/* Simulated Voice Waveform Indicator */}'

p1 = text.find(target_start)
p2 = text.find(target_end, p1)

if p1 != -1 and p2 != -1:
    correct_block = '''{/* Screen header */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono border-b border-slate-900 pb-2 select-none z-10 bg-slate-950/80 backdrop-blur-md px-1 py-0.5 rounded">
                      <span className="flex items-center gap-1.5 font-bold text-rose-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${lessonVideoPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}></span>
                        {videoMode === "video" ? (
                          lessonVideoPlaying ? "جاري تشغيل الفيديو التعليمي HD 🔴" : "فيديو الدرس موقوف مؤقتاً ⏸"
                        ) : (
                          lessonVideoPlaying ? "المرشد التفاعلي نشط 🎙️" : "موقوف مؤقتاً ⏸"
                        )}
                      </span>
                      <span className="bg-rose-950 text-rose-300 font-black px-2 py-0.5 rounded text-[8.5px]">
                        {videoMode === "video" ? "1080p FULL HD 🎞️" : "SLIDES DECK 📊"}
                      </span>
                    </div>

                    {/* Viewport Content */}
                    <div className="relative flex-1 flex flex-col justify-center text-right overflow-hidden mt-1.5 mb-1.5">
                      {videoMode === "video" ? (
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
                        </div>
                      ) : (
                        /* Original Slides Deck visualizer */
                        <div className="my-2.5 space-y-1.5 text-right flex-1 flex flex-col justify-center select-none">
                          <h5 className="text-[11px] sm:text-xs font-black text-rose-300 leading-snug">
                            {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.slides?.[activeSlide]?.title || "🎯 المادة الأساسية"}
                          </h5>
                          <p className="text-[10px] sm:text-[11px] text-slate-200 leading-relaxed font-bold max-h-[85px] overflow-y-auto scrollbar-thin">
                            {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.slides?.[activeSlide]?.text || "الرجاء المتابعة في قراءة الأشرطة وتنزيل الملحقات المرفقة لبناء القوة."}
                          </p>
                        </div>
                      )}
                    </div>

                    '''
    text = text[:p1] + correct_block + text[p2:]
    with open("src/components/AdminSuite.tsx", "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed Screen Header and Viewport Content!")
else:
    print("Could not find markers:", p1, p2)
