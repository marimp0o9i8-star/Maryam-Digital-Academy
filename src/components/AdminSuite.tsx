import { authenticatedFetch } from "../lib/api";
import React, { useState, useEffect } from "react";
import {
  Download,
  Eye,
  Sparkles, 
  Languages, 
  Link2, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Activity, 
  Copy, 
  Check, 
  CheckCircle, 
  Save, 
  Coins, 
  Laptop, 
  ArrowRight, 
  Lock, 
  DollarSign, 
  Award,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  Film,
  HelpCircle,
  FileText,
  X
} from "lucide-react";

// Types for affiliate links
export interface AffiliateLinks {
  canva: string;
  gumroad: string;
  chatgpt: string;
  gdocs: string;
  notion: string;
  capcut: string;
  mailchimp: string;
  payhip: string;
  gemini: string;
  stripe: string;
}

export const DEFAULT_AFFILIATE_LINKS: AffiliateLinks = {
  canva: "https://www.canva.com",
  gumroad: "https://gumroad.com",
  chatgpt: "https://chatgpt.com",
  gdocs: "https://docs.google.com",
  notion: "https://notion.so",
  capcut: "https://capcut.com",
  mailchimp: "https://mailchimp.com",
  payhip: "https://payhip.com",
  gemini: "https://gemini.google.com",
  stripe: "https://stripe.com"
};

const LOCAL_STORAGE_KEY_LINKS = "digital_guide_affiliate_links_v1";
const LOCAL_STORAGE_KEY_CLICKS = "digital_guide_affiliate_clicks_v1";
const LOCAL_STORAGE_KEY_VIEWS = "digital_guide_admin_views_v2";

const VIDEO_SUBTITLES: Record<string,Array<{ range: [number, number]; text: string }>> = {
  "1": [
    { range: [0, 15], text: "أهلاً بك يا بطل في الدرس الأول! اليوم سنضع حجر التأسيس لفهم الريادة الرقمية وكيفية تجنب التشتت بمشاريع عشوائية." },
    { range: [15, 35], text: "الدرس الحقيقي هنا هو أن العميل لا يدفع لشراء الكتيب لجماله، بل يشتري حلاً حاسماً يزيل آلام يومه أو عقباته المادية." },
    { range: [35, 60], text: "القاعدة الذهبية: فكرة بسيطة يتم إطلاقها اليوم للعلن، أفضل مئة مرة من فكرة خارقة ومثالية لا ترى النور أبداً." },
    { range: [60, 80], text: "سنقوم خلال الدورة ببناء متجرك وربط بوابتك وتلقين أول عميل آلياً دون تدخل يدوي منك طوال 24 ساعة." },
    { range: [80, 101], text: "أكمل قراءة مادة الدرس وباشر بالمهمة العملية الأولى بالأسفل لتثبت العقلية والتأسيس الصحيح أولاً!" }
  ],
  "2": [
    { range: [0, 15], text: "مرحباً بك في الدرس الثاني! سنناقش بالتفصيل كيف تجد وتفرز فكرة كتاب الطبخ، أدلة القياس، والمقادير المعيارية بالجرامات." },
    { range: [15, 35], text: "لا تبتكر مشكلة خيالية من رأسك؛ راقب تعليقات التيك توك ومنشورات الفيسبوك، حيث يشتكي الناس من عدم ضبط البهارات أو فشل الطبخة." },
    { range: [35, 60], text: "صنع دليلك الرقمي ممثلاً في كتاب PDF جذاب أصبح سهلاً جداً باستعمال Google Docs لتنظيم النص وقوالب Canva لإخراجه." },
    { range: [60, 80], text: "يمكنك الاعتماد على أدلة الـ PLR الجاهزة أو ترخيص الـ MRR التجاري لتخفيف مشقة التأليف بنسبة 90% والبدء فوراً." },
    { range: [80, 101], text: "باشر بحيازة فكرتك المعرفية وحصر وعاء القيمة لحل هذه المعضلة للجمهور المستعد لدفع ثمن الاختصارات المفيدة!" }
  ],
  "3": [
    { range: [0, 15], text: "أهلاً بك في الدرس الثالث! اليوم سنقوم بربط عتاد الدفع والـ YouCan وإطلاق متجرك الإلكتروني في أقل من 30 دقيقة." },
    { range: [15, 35], text: "سنعتمد على Gumroad أو YouCan كبوابات ميسرة جداً ومجانية في البدايات، لتتكفل باستلام الأموال من مدى أو بطاقات الائتمان." },
    { range: [35, 65], text: "السر الأعظم يكمن في تهيئة تسليم ملف الكتيب آلياً بمجرد تأكيد الدفع ليعمل مشروعك بمثابة موظف صامت ومخلص." },
    { range: [65, 85], text: "إن صوغ وصف مقنع يركز على الفوائد الملموسة لا المواصفات الجافة هو البكر التسويقي لانتزاع الرغبة ومضاعفة الأرباح." },
    { range: [85, 101], text: "افتح متجرك، ارفع منتجك، وثبت رابط الدفع وبوابتك الإلكترونية آلياً لتستعد لاستقبال الفواتير الحقيقية." }
  ],
  "4": [
    { range: [0, 15], text: "مرحباً بك في الدرس الرابع! سنتعلم استراتيجية التسويق الذكي وجذب أول 10 مشترين بميزانية ترويجية صفر دولار." },
    { range: [15, 35], text: "التسويق بالمحتوى العضوي المجاني هو عصب البدايات. سنعتمد على فيديوهات قصيرة في TikTok وإنستجرام دون الظهور بالوجه." },
    { range: [35, 60], text: "تذكر قاعدة الـ 80/20: شارك في 80% من منشوراتك نصائح وفائدة مجانية لبناء الهيبة، وفي الـ 20% أعلن عن دليلك ورابط البايو." },
    { range: [60, 85], text: "ادخل إلى قروبات ومجتمعات تليجرام المتخصصة، قدم حلولاً للناس بصدق ودع رابط كتابك يظهر كمرجع خبير يحل القضية." },
    { range: [85, 101], text: "ألقِ نظرة على حزمة السكريبتات الـ 15 الجاهزة لتوليد وصنع أول محتوى تسويقي لك في دقيقة واحدة!" }
  ],
  "5": [
    { range: [0, 15], text: "أهلاً بك في الدرس الخامس والختامي! سنشرح كيفية نقل مبيعتك الأولى لنهر مستمر من النجاح والنمو للعلامة المستدامة." },
    { range: [15, 35], text: "حاول جمع تقييمات العملاء وشهاداتهم فور تحقيق المبيعات الأولى، واعرض صورها بصفحات البيع لأن الناس يثقون بكلام المشترين!" },
    { range: [35, 60], text: "عندما تزداد ثقة السوق وتتراكم الشهادات الفضلى، يمكنك رفع السعر تدريجياً وإضافة بونصات مكملة لزيادة هامش ربحك بحكمة." },
    { range: [60, 85], text: "احرص على بناء نظام قائمة بريدية للاحتفاظ بعملائك للأبد وتقديم عروض تنافسية لإطلاق منتجك القادم المفيد." },
    { range: [85, 101], text: "مبارك لك تفوقك والوصول لنهاية المنهج ومطاردة الاستقلال المالي والمصداقية العالية!" }
  ]
};

interface LessonLanguageVersion {
  title: string;
  desc: string;
  secret: string;
  material: string;
  time: string;
  tasks: string[];
  prompts: string[];
  slides: {
    title: string;
    text: string;
    actionCode?: string;
  }[];
}

const LESSONS_DETAILS: Record<string, { ar: LessonLanguageVersion; en: LessonLanguageVersion }> = {
  lesson_1: {
    ar: {
      title: "حجر التأسيس: فهم مبدأ ريادة الأعمال الرقمية الأخلاقية ذو المصداقية العالية",
      desc: "الأسس الصحيحة للنشاط التجاري والبعد عن مغالطات الترويج المفرط والوعود الوهمية للبراندات.",
      secret: "سر الأفكار الواقعية ذات الطلب المستدام والولاء الفوري",
      time: "مدته 22 دقيقة",
      material: "مرحباً بك في الدرس التأسيسي الأول! في هذا المسار نكسر القالب التقليدي ونعلمك كيف تبني مشروعاً معرفياً ذا مصداقية مع تعزيز الأمانة العلمية والدقة.\n\nتجارة المعرفة هي واحدة من أنجح قنوات الكسب الرقمي المعاصر، ولكن سر ديمومتها يرجع لعاطفة 'المصداقية المطلقة والصدق البنائي'. عندما تبيع دليلاً تضمن من خلاله حلاً لمشكلة، يجب أن يكون الحل مجرباً وعملياً بنسبة 100%.\n\nالقواعد البلاتينية للريادة الأخلاقية:\n1. الصدق المطلق في صياغة العروض التسويقية: لا تعد المشتري بوعود واهية بالثراء السريع، بل ركز على المهارة التي سيتعلمها (مثال: طريقة تشغيل متجر سلة بنجاح، أو أسرار خبز الكبسة الخليجي بمقادير غرامية دقيقة).\n2. بناء واجهات تلقي وتقديم المنتجات الرقمية المرخصة (PLR): بدلاً من بيع ملفات مكررة منسوخة، قم بإعادة تسميتها وتجربتها بنفسك وأضف إليها لمستك الخاصة وجداول تتبع لتضمن رضا العميل بنسبة 100%.\n3. أتمتة الدعم الفني لتمكين الطالب من مراجعة خطواته بنجاح.",
      tasks: [
        "تحديد المجال (Niche) الذي تملك فيه خبرة أو قادراً على تفكيكه (الطهي، التصميم، البرمجة، إدارة الأعمال)",
        "دراسة وتحديد 3 مشكلات حقيقية يواجهها الناس في هذا الصدد لتقديم حل ملموس",
        "صياغة ميثاق المصداقية والالتزام الأخلاقي لعلامتك المعرفية أمام المشترين"
      ],
      prompts: [
        "أريد دراسة سوقية متكاملة لـ [المجال أو المطبخ الخليجي] باللغة العربية، لتحديد أكثر 3 مشكلات تواجه الطهاة المبتدئين أو المتعلمين وكيفية تداركها."
      ],
      slides: [
        {
          title: "🎯 الفلسفة الأخلاقية للريادة المعرفية",
          text: "الرواد الصغار ينهضون من خلال الصدق المطلق. هدفنا هو استبدال وعود الثراء السهمي الزائفة بمنتجات رقمية حقيقية ومصممة بدقة تقدم حلولاً معيارية واضحة للمستهلكين، مما يبني ولاء جارفاً وعقود مبيعات دائمة.",
          actionCode: "INIT_ETHICAL_WORKSPACE"
        },
        {
          title: "🔬 سر المنتجات المستدامة",
          text: "أكثر المنتجات مبيعاً هي التي تحل مشكلة حقيقية ملموسة. في مطبخ الطهي مثلاً، يبحث الناس عن غرامات ومقادير رياضية كيميائية تضمن استواء وسر نجاح الأكلات، بدلاً من الفيديوهات العاطفية الفاشلة عند التطبيق المنزلي.",
          actionCode: "EXTRACT_NICHE_VARIABLES"
        },
        {
          title: "💰 دراسة الأرباح: مبدأ الـ $147 اليومي",
          text: "بيع 3 أدلة معرفية معيارية بسعر $49 يومياً يعادل $147 صافية، خالية تماماً من تكاليف الشحن وتخزين البضائع وصداع الاسترجاع، مع تسليم آلي فوري عبر زين كاش وبوابات اليوكان.",
          actionCode: "CALCULATE_FINANCIAL_FREEDOM"
        },
        {
          title: "🛠️ خريطة العمل والخطوة الفورية",
          text: "مهمتك الآن هي صياغة المجال المعرفي وتحديد أكثر مشكلة يعاني منها المستهلك في محيطك (كالطهي، المعايرة، أو إعداد محفظة زين كاش التجارية) والبدء بالتصميم الداخلي لصفحة العمل المفيدة.",
          actionCode: "SET_DAILY_MILESTONE_1"
        }
      ]
    },
    en: {
      title: "The Foundation Stone: Understanding Ethical & High-Credibility Digital Entrepreneurship",
      desc: "Establishing accurate business fundamentals and avoiding hyper-marketing and false claims.",
      secret: "The Secret to Sustainable In-Demand Ideas with Instant Loyalty",
      time: "Duration 22 minutes",
      material: "Welcome to your first foundational lesson! In this module, we break the traditional copy-paste mold and teach you how to build a digital knowledge business backed by science, precision, and truth.\n\nKnowledge commerce is one of the most lucrative modern digital channels, but its longevity relies entirely on 'absolute authenticity and educational honesty'. When you sell a guide to solve a real human pain, the implementation must be 100% verified and reproducible.\n\nPlatinum Rules of Ethical Digital Products:\n1. Absolute Honesty in Marketing Hooks: Never promise unrealistic quick-wealth dreams. Focus transparently on the core skill being acquired (e.g., how to configure a Salla storefront safely, or the milligram-precise culinary recipes of Gulf cuisine).\n2. Value-Add for Private Label Rights (PLR): Resell products that you have personally experienced, modified, and upgraded rather than generic clones.\n3. Automation & True Assistance: Deliver files via automated systems combined with local gateways (like Zain Cash) for instant 24/7 delivery.",
      tasks: [
        "Identify your core Niche or expertise that you can deconstruct (e.g., Culinary, Business Design, Salla/YouCan Setup, AI Prompts)",
        "Pinpoint 3 core real-world pain points your target audience encounters daily",
        "Draft the Credibility & Quality Charter of your knowledge brand to gain immediate customer trust"
      ],
      prompts: [
        "Provide a comprehensive niche study for [Your Niche / Gulf Cuisine] in English, identifying the top 3 friction points beginners face and how to address them with clean actionable guides."
      ],
      slides: [
        {
          title: "🎯 Ethical Philosophy of Knowledge Commerce",
          text: "True entrepreneurs rise through integrity. Our goal is to replace hyper-promoted fake wealth courses with exact, high-utility digital files that deliver visible results, ensuring deep customer satisfaction and automatic recurring sales.",
          actionCode: "INIT_ETHICAL_WORKSPACE"
        },
        {
          title: "🔬 The Secret to High-Value Products",
          text: "The best-selling files are those that act as math/science manuals. In gastronomy, users look for highly specific gram-weights, temperature curves, and chemical reactions that guarantee victory, over confusing visual-only video clips.",
          actionCode: "EXTRACT_NICHE_VARIABLES"
        },
        {
          title: "💰 The $147/Day Business Blueprint",
          text: "Selling exactly 3 standardized digital manuals at $49 each yields a daily pure profit of $147, with absolute zero shipment, storage, or fulfillment costs. Fully managed by automated payment integration scripts.",
          actionCode: "CALCULATE_FINANCIAL_FREEDOM"
        },
        {
          title: "🛠️ Practical Action & Immediate Step",
          text: "Formulate your focus area and catalog the primary friction points your target market faces (such as local business setup, precise cooking weights, or YouCan integrations) to start drafting.",
          actionCode: "SET_DAILY_MILESTONE_1"
        }
      ]
    }
  },
  lesson_2: {
    ar: {
      title: "الخطوة الأولى: اختيار مجالات المنتجات الناجحة وعزل الأطباق ووصفات الطعام الحديثة",
      desc: "أدبيات صياغة ملفات متكاملة للمأكولات والوصفات الطبية والكيميائية للمقادير بنجاح وتوثيق دقيق.",
      secret: "تحويل المهارات الشخصية لملفات PLR للبيع الفوري",
      time: "مدته 35 دقيقة",
      material: "الطهي وأدب المأكولات يعد واحداً من المنتجات الرقمية الأكثر مبيعاً وثباتاً في المتاجر الرقمية! المستهلك المعاصر يبحث عن أدلة طهي معيارية رياضية (بالجرام، المليلتر، النسب الكيميائية المعتمدة لقفل السطح واستواء البروتينات) بدلاً من الفيديوهات السريعة التي تفشل عند تطبيقها بالمنزل.\n\nأركان صياغة كتاب طبخ مميز للبيع الفوري:\n1. تصميم الأطباق المعيارية: حدد 3 أطباق رئيسية هامة وتأكد من شرح أوزانها الجافة بدقة ملليمترية تضمن نجاح الطبخة من أول تجربة.\n2. إبراز سر الطهاة: اشرح النكهات، البهارات والسر وراء نجاح الطبق لضمان مبيعات تقييمها هائل.\n3. تزويد الكتيب بملخصات ملهمة وجداول متابعة السعرات والوقت.",
      tasks: [
        "توليف 3 وصفات رئيسية مكتملة المكونات بالجرام والمل والنسب المعيارية لفائدة الطلبة",
        "تسمية كتاب الطبخ باسم إبداعي (مثال: دليل الشيف الخليجي المعاصر لأطباق العزائم)",
        "تحديد قائمة الإرشادات وميكانيكية التحضير الدقيقة والسر في نجاحها"
      ],
      prompts: [
        "أريد تأليف وصفة حديثة وراقية لـ [اسم الطبق] باللغة العربية مع إعطاء المقادير الدقيقة بالغرام وتبيان سر الطهاة المحترفين لتماسك واستواء المكونات، وصياغيتها بنمط فاخر ومشوق."
      ],
      slides: [
        {
          title: "🍱 لماذا أدب الطهي والوصفات؟",
          text: "الطهي هو لغة عالمية واحتياج يومي مستمر. الكتيبات التي تقدم شرحاً كيميائياً ووزناً بالغرامات هي بمثابة أصول معرفية يشتريها الناس بثقة عالية لأنها تضمن حماية ميزانياتهم وهدر المكونات.",
          actionCode: "CULINARY_BENCHMARKING"
        },
        {
          title: "⚖️ صياغة المكونات بالغرامات",
          text: "بدلاً من المصطلحات المبهمة كـ 'ملعقة كبيرة' أو 'رشة بهار'، نكتب '14 غرام بهارات الكبسة الفاخرة'، '250 مل ماء دافئ بدرجة 35 مئوية'. هذه الدقة الفائقة تبهر عميلك وتجعله ينصح الجميع بكتيبك المتميز.",
          actionCode: "METRIC_CONVERSION"
        },
        {
          title: "📝 هيكلية فصول الكتيب المعتمد",
          text: "يحتوي كتيبك على: هيدر البراند الكلاسيكي، مقدمة التعهد الصادق، الأواني المفضلة، تفصيل الـ 3 وصفات، وأخيراً جدول التطبيق المطبوع ليعلقه العميل على أبواب ثلاجته كأداة عملية مفيدة.",
          actionCode: "DRAFT_BOOK_OUTLINE"
        },
        {
          title: "🧭 خطتك لليوم: كتابة الوصفة الأولى",
          text: "اختر طبقاً تعشقه أو أطباقاً شعبية فاخرة في محيطك، واكتب مسودتها المعيارية بالغرام والمل مع إدراج السر المكتسب لتنتقل للبناء الذكي.",
          actionCode: "FINISH_MILESTONE_2"
        }
      ]
    },
    en: {
      title: "Step One: Selecting Winning Digital Niches & Professional Culinary Crafting",
      desc: "Scientific crafting of food specifications, measurements, and high-accuracy weights for repeatable success.",
      secret: "Transforming Personal Recipes into Premium PLR Ready Files",
      time: "Duration 35 minutes",
      material: "The culinary craft is one of the highest-converting, bulletproof digital products worldwide! Modern clients look for scientific, absolute-weight recipes (in grams, milliliters, exact chemical steps for caramelization, temperature control) instead of generic social media videos that fail at home.\n\nKey Pillars of a Stellar Culinary PLR Guide:\n1. Standardized Precise Weights: Define at least 3 signature recipes with exact dry/liquid weights in grams to guarantee success from the first attempt.\n2. Reveal the Chef's Hidden Key: Detail the flavor physics, the specific resting times, or exact spices mix that elevates the end-product.\n3. Supplement with Worksheets: Add progress trackers, printable logs, and calorie/preparation time matrices to increase perceive utility.",
      tasks: [
        "Formulate 3 signature recipes detailing complete ingredients in draft weights",
        "Draft a compelling, professional title (e.g., 'The Gulf Gourmet: High-Precision Gastronomy Guide')",
        "List the exact step-by-step preparation physics, spices ratios, and secret chef techniques"
      ],
      prompts: [
        "Generate a classic luxury culinary recipe in English for [Dish Name] containing milligram-precise weights of ingredients and highlighting the precise thermal reaction and spices secrets of top chefs."
      ],
      slides: [
        {
          title: "🍱 Why Culinary & Gastronomic Literature?",
          text: "Food is an absolute, evergreen daily necessity. High-precision guides providing scientific heat limits and metric gram weights are bought as valuable masterclasses because they prevent expensive ingredient waste.",
          actionCode: "CULINARY_BENCHMARKING"
        },
        {
          title: "⚖️ Formulating in Grams and Milliliters",
          text: "Instead of vague terms like 'a pinch of salt' or 'spoonful of curry', write '12g premium Gulf spices', '240ml warm mineral water at 35°C'. This flawless precision builds enormous authority.",
          actionCode: "METRIC_CONVERSION"
        },
        {
          title: "📝 Structuring Your E-Book Sections",
          text: "Your master file includes: clean minimalist header, the Honesty Promise statement, chosen utensils, 3 standardized dishes, and the printable checklist for the kitchen wall.",
          actionCode: "DRAFT_BOOK_OUTLINE"
        },
        {
          title: "🧭 Task of the Day: The First Recipe",
          text: "Pick an elegant popular dish and document its weights, ingredients, and secret thermal timings to proceed to compiling the smart PDF.",
          actionCode: "FINISH_MILESTONE_2"
        }
      ]
    }
  },
  lesson_3: {
    ar: {
      title: "العمل التطبيقي المباشر: بناء المنتج المعرفي وتدقيقه ومراجعته مع المعين الذكي للريادة",
      desc: "خطوة بخطوة بالصوت والصورة لصنع الكتاب الإلكتروني الأول، الفصول المتسلسلة، والكراسة الرديفة الحصرية.",
      secret: "توليد نصوص مقنعة بالذكاء الاصطناعي وبناء الولاء القويم",
      time: "مدته 45 دقيقة",
      material: "في هذا المقطع العملي، نتعلم كيف نوظف طاقات نماذج Gemini الذكية معنا لتأليف هيكلية الفصول وصياغة المحتوى المتكامل بسرعة لتوفير الوقت والجهد وتجنب الأخطاء التقنية.\n\nخطوات بناء محتوى متكامل مع المعين الذكي:\n1. توليد الهيكل العام: اطلب من الذكاء الاصطناعي وضع هيكلية واضحة مقسمة إلى فصول أو جولات تفصيلية ملموسة.\n2. تفصيل الفصول: خذ فصلاً تلو الآخر وتناقش مع النموذج لإضافة طابعك ووجهة نظرك وأسرارك الخاصة لضمان الأمانة المعرفية الشديدة.\n3. كراسة المراجعة وبناء الولاء: أضف دائماً في نهاية كل كتاب ورقة عمل أو جدولاً تفاعلياً فارغاً يقوم المشتري بملئه بنفسه للتجسيد الفعلي للقيمة.",
      tasks: [
        "استخدام أداة (باني ومصنف المنتجات PLR) المدمجة بالأسفل لبناء مسودة الكتيب الأول",
        "مراجعة نصوص الفصول وإدخال طابعك الشخصي والسري عليها لزيادة المصداقية",
        "إدراج صفحة الدعم والضمان الفعلي ومجتمع التمكين في ذيل المستند"
      ],
      prompts: [
        "اقترح علي جدولاً تفاعلياً وكراسة تطبيقية ممتازة لتمكين المشتري من تطبيق ما ورد في الفصل الخاص بـ [موضوع الفصل] ومتابعة نتائجه يومياً."
      ],
      slides: [
        {
          title: "🤖 قوة المعين الذكي ببرينجل",
          text: "نستخدم الذكاء الاصطناعي كمعين ومسرع للمسودات، وليس لنسخ كلام مجهول. نقوم ببناء الهياكل وتفصيل فصول الكتاب مع إدراج بصمتك الحقيقية والصدق المعرفي.",
          actionCode: "LOAD_AI_ASSISTANT"
        },
        {
          title: "⚡ توليد هيكلية الفصول الذكية",
          text: "الكتب المعرفية الناجحة لا تتعدى 25 صفحة كحد أقصى ولكنها عميقة ومثيرة للفكر. هيكل ذكي من 4 فصول كافٍ تماماً لإصدار النسخة الأولى والبدء الفوري بالتسويق.",
          actionCode: "GENERATE_CHAPTERS_MAP"
        },
        {
          title: "💎 تصميم كراسة العمل المرادفة",
          text: "إضافة أوراق عمل تفاعلية قابلة للطباعة تعزز قيمة دليلك بنسبة 300%. المشتري يحب الإمساك بقلم وتدوين أرقامه وحساباته للوصول إلى النتيجة العملية الموعودة.",
          actionCode: "BUILD_COMPANION_SHEETS"
        },
        {
          title: "🛠️ باني المنتجات جاهز للتحميل",
          text: "استخدم الأداة رقم 3 بالمنصة لتصميم منتجك الرقمي الآن. صغ العناوين والوصف والمشكلة الحقيقية لتلقي مسودة مصبوغة بجمال الألوان.",
          actionCode: "SET_DAILY_MILESTONE_3"
        }
      ]
    },
    en: {
      title: "Direct Practical Walkthrough: Compiling files with high-credibility AI Assistants",
      desc: "Step-by-step generation of chapters, table of contents, and printable companion logs.",
      secret: "Leveraging Ethical Prompt Engineering & Building High Retention",
      time: "Duration 45 minutes",
      material: "In this practical walkthrough, we learn how to harness Gemini's intelligence to orchestrate structural chapters and organize high-quality text in seconds, avoiding blank-screen syndrome and mistakes.\n\nSteps to Compiling with Your AI Co-pilot:\n1. Generating the Roadmap: Ask the AI for a cohesive table of contents split into highly practical sections.\n2. Expanding and Tuning Chapters: Take sections sequentially and input your unique experience and secrets to preserve absolute scientific honesty.\n3. Printable Worksheets layout: Insert structured bullet charts, calorie grids, or milestone sheets that the reader manually tracks.",
      tasks: [
        "Utilize the built-in PLR Product Builder to generate your initial drafted PDF content",
        "Review compiled sentences, inserting your personal flare, tone, and specific local tips",
        "Append the Dedicated Support email and Trust Guarantee block in the footer of your document"
      ],
      prompts: [
        "Outline an elegant, highly practical printable workbook layout in English for [Chapter Subject], listing columns and calorie/gram weight scales users can easily write in."
      ],
      slides: [
        {
          title: "🤖 Utilizing the AI Co-pilot Ethically",
          text: "We employ Gemini to organize and format our drafts, rather than copy-pasting generic fluff. This keeps your delivery pristine, professional, and directly tailored to user needs.",
          actionCode: "LOAD_AI_ASSISTANT"
        },
        {
          title: "⚡ Building a Focused, Punchy E-book",
          text: "Successful knowledge products are rarely over 25 pages. They are dense, clear, and actionable. A tight 4-chapter volume is sufficient to kick-start test sales instantly.",
          actionCode: "GENERATE_CHAPTERS_MAP"
        },
        {
          title: "💎 Companion Worksheets and perception of value",
          text: "Printable logs enrich your file's worth by 300%. Buyers appreciate printable sheets they can physically write on, such as calorie balances or kitchen charts on their fridge.",
          actionCode: "BUILD_COMPANION_SHEETS"
        },
        {
          title: "🛠️ Launch Your Draft Compilation Now",
          text: "Use our built-in AI PLR compiler to start drafting. Craft your title, insert target pain points, let the system assemble your beautiful, styled master workspace.",
          actionCode: "SET_DAILY_MILESTONE_3"
        }
      ]
    }
  },
  lesson_4: {
    ar: {
      title: "التهيئة التكنولوجية: تشييد بوابات الدفع (Zain Cash / Crypto) وتدشين واجهات المبيعات الفورية",
      desc: "كيف تعد صفحة هبوط ذات جودة عالية مع ربط معالج الدفع واستغلال العملات لتلقي الاشتراكات تلقائياً.",
      secret: "الموجة المؤتمتة لتأمين استلام الأرصدة آلياً ودعم زين كاش",
      time: "مدته 28 دقيقة",
      material: "التكنولوجيا سهلة جداً عندما ننظمها بالشكل الصحيح برصانة تامة أمنية. لسنا بحاجة لكتابة كود برمجي معقد بل سنستخدم منصات بناء المتاجر الرقمية السهلة (مثل سلة Salla أو YouCan أو Payhip أو Gumroad) في خطوتين لتفعيل بوابات الدفع وتسليم الملفات التلقائي.\n\nآلية التكامل لاستلام الأرباح:\n1. إعداد المتجر والروابط الحقيقية: قم برفع الملف الذي قمت بتصديره (PDF) كمنتج رقمي جاهز للتحميل بعد الشراء.\n2. تكامل Zain Cash والمحفظة المحلية: أضف تفاصيل محفظتك ليتسن للطلبة والمشترين التحويل الفوري المباشر.\n3. أتمتة الإرسال والتحويل: بمجرد إتمام العميل للدفع، ترسل المنصة له رابط تنزيل الملف آلياً دون أي تدخل منك، مما يحقق لك ربحاً وتواجداً مستمراً في السوق.",
      tasks: [
        "تسجيل حساب على منصة YouCan أو سلة (تستغرق دقيقتين فقط)",
        "تفعيل بوابة دفع تجريبية ووضع محفظة Zain Cash كخيار أساسي للرواد الصغار",
        "رفع ملف منتج تجريبي وربطه بصفحة التحميل المؤتمتة والتسليم الفوري"
      ],
      prompts: [
        "اكتب دليلاً خطوة بخطوة باللغة العربية لكيفية ربط واجهة دفع إلكترونية وتسليم ملف رقمي بعد الشراء فوراً على منصة [اسم المنصة] للمبتدئين دون تعقيدات تقنية."
      ],
      slides: [
        {
          title: "🛡️ فك العقدة التقنية بالكامل",
          text: "البرمجة ليست عائقاً. باستخدام المنصات الحديثة مثل سلة Salla أو YouCan، تستطيع بناء واجهة الدفع الرقمي وتسجيل المنتجات مجاناً وبأعلى درجات الخصوصية والأمان الفوري.",
          actionCode: "CONNECT_GATEWAYS"
        },
        {
          title: "📲 ربط محفظة Zain Cash في لحظات",
          text: "في العراق والخليج، Zain Cash هي أسهل طريقة للدفع المباشر والسريع. سنوضح للعميل كيفية التحويل الفوري لرقم المحفظة مع أتمتة إرسال البريد ورابط التحميل بلحظة إرفاق مستند الإتمام للطلب.",
          actionCode: "INTEGRATE_ZAIN_CASH"
        },
        {
          title: "🚀 ميكانيكية تسليم الملف المعرفي",
          text: "يقوم العميل بالدفع -> يتأشر الطلب توماتيكيا كمكتمل -> يرسل الخادم رابط تحميل الملف الحقيقي فورياً لبريد العميل. نظام يعمل من أجلك 24 ساعة بكل رصانة ومصداقية.",
          actionCode: "SET_AUTOMATIC_DELIVERY"
        },
        {
          title: "🛠️ اختبر البوابة التجريبية اليوم",
          text: "افتح حسابك التجريبي وارفع مسودة كتابك الأول كملف رقمي. جرب عملية الشراء والتحويل لتشاهد بنفسك النتيجة الآلية السريعة الرصينة.",
          actionCode: "RUN_GATEWAY_SIMULATOR"
        }
      ]
    },
    en: {
      title: "Tech Implementation: Deploying Payment Gateways (Zain Cash / Card) & Automated Checkout Flow",
      desc: "Setting up a high-converting storefront on YouCan/Salla and enabling automatic file delivery on payment.",
      secret: "Automated Micro-Payment Gateways & Local Mobile Cash Integrations",
      time: "Duration 28 minutes",
      material: "Technology is extremely approachable when structured correctly. We don’t need complex coding skills. We will leverage simple store builders (like Salla, YouCan, or Payhip) to manage payments and automate product downloads seamlessly.\n\nAutomated Revenue Mechanics:\n1. Uploading Your Digital Asset: Put your final exported guide (PDF/Document format) onto your store as a 'Digital Product'.\n2. Gateway Binding: Configure Zain Cash or local bank cards so buyers can instantly execute digital transactions.\n3. Automatic Settlement: On successful payment, the system flags the transaction as 'Completed' and instantly emails the secure download token, earning passive sales 24/7.",
      tasks: [
        "Open a free merchant account on YouCan.shop or Salla.sa (takes under 4 minutes)",
        "Configure trial payment systems, prioritizing mobile wallets (Zain Cash / local cards)",
        "Upload a mock item and perform a sandbox purchase to verify automatic delivery"
      ],
      prompts: [
        "Write a step-by-step walkthrough in English detailing how to connect a custom local e-wallet gateway to YouCan or Salla and configure instant file download post-purchase."
      ],
      slides: [
        {
          title: "🛡️ Demystifying Store Technologies",
          text: "No programming degrees needed. Modern platforms like YouCan let you build beautiful conversion funnels and launch online collection portals safely without advanced web infrastructure.",
          actionCode: "CONNECT_GATEWAYS"
        },
        {
          title: "📲 Linking Zain Cash and Local Wallets",
          text: "Mobile cash is the fastest-growing transaction method. Inform customers of instant transfer steps with automated script emails carrying download links immediately on voucher submission.",
          actionCode: "INTEGRATE_ZAIN_CASH"
        },
        {
          title: "🚀 Automated Digital Delivery Mechanics",
          text: "Customer pays -> Order completes automatically -> Automated servers send individual, secure file links instantly. High-fidelity automation running seamlessly for you.",
          actionCode: "SET_AUTOMATIC_DELIVERY"
        },
        {
          title: "🛠️ Sandbox Gateways Trial",
          text: "Kick-start your store layout, register your primary file as digital download. Complete a test sandbox buy to review the flawless automated delivery yourself.",
          actionCode: "RUN_GATEWAY_SIMULATOR"
        }
      ]
    }
  },
  lesson_5: {
    ar: {
      title: "استراتيجيات الاستقطاب: التسويق العضوي عالي الجاذبية عبر محتوى الفيديو القصير وتدوير المنشورات",
      desc: "طريقة حصد آلاف الزوار لصفحة البيع مجاناً عبر تيك توك وإنستجرام باستخدام صور وأوصاف جاهزة.",
      secret: "آلية الظهور غير الشفهي والقوالب الرديفة للتسويق العضوي الصامت",
      time: "مدته 40 دقيقة",
      material: "التسويق هو روح أي مشروع ناجح. في هذا الدرس العملي، نستكشف قنوات الاستقطاب العضوي والتسويق التلقائي للعملاء دون الحاجة حتى للظهور بوجهك أو صرف دولار واحد على الإعلانات الممولة!\n\nمنهج الفيديوهات القصيرة (TikTok / Reels / Shorts):\n1. التقاط المشاهد الملفتة: سنستخدم واجهات بصرية هادئة (كعملية تحضير طبق معين، أو تدوين ملاحظات في هدوء مع موسيقى مريحة وصوت المطر).\n2. الخطاف البصري (Hook & Caption): نضع نصاً خاطفاً على الشاشة (مثال: 'كيف صممت دليلاً كاملاً لأشهر 5 أكلات خليجية مع الأسرار الدقيقة بالغرامات؟ الرابط في البايو بالتفصيل!').\n3. النشر المستدام واليومي: النشر بانتظام وبنبرة صادقة تصف المنفعة الحقيقية يبني ولاء جارفاً ويقود آلاف الزوار لمتجرك مجاناً.",
      tasks: [
        "إنشاء حساب تجاري صامت على تيك توك وإنستقرام للبراند الرقمي المستقل",
        "كتابة 3 نصوص خطافية خاطفة للانتباه مع صياغة أوصاف معيارية صادقة",
        "جدولة ونشر فيديو قصير تجريبي مع تبيان رابط متجر Zain Cash في البايو"
      ],
      prompts: [
        "ابتكر لبراندي الرقمي 5 أفكار لفيديوهات تيك توك قصيرة صامتة وجاذبة تتناول فكرة [اسم المنتج]، واشرح المشهد المقترح والنص الخاطف المكتوب على الشاشة."
      ],
      slides: [
        {
          title: "📸 التسويق العضوي والحرية المالية",
          text: "أفضل الزوار هم الزوار العضويون من منصات الفيديو القصيرة. الصدق والجاذبية الهادئة يبني تقارباً حقيقياً وصادقاً مع المشتري مما يسهم في مبيعات هائلة وثابتة.",
          actionCode: "ORGANIC_STRATEGY"
        },
        {
          title: "☕ تكتيك القنوات الصامتة (Faceless Channels)",
          text: "أنت لا تحتاج إلى الظهور بوجهك! سجل فيديوهات هادئة تظهر المهارة المعروضة أو لقطات مريحة مع كتابة عبارات مقتضبة تدل المتابع على الحل المادي الموجود في البايو.",
          actionCode: "FACELESS_SETUP"
        },
        {
          title: "🔗 ميكانيكية تحويل المشاهير لزبائن",
          text: "استخدم جملة واضحة 'دليل المبتدئين متوفر للتحميل المباشر الآن في البايو بسعر رمزي كدعم معنوي متكامل'. صغ الأوصاف بلغة قوية ووقورة تثير الثقة الشديدة.",
          actionCode: "CONVERSION_FUNNEL_SETUP"
        },
        {
          title: "🛠️ جهز نشرتك العضوية الأولى",
          text: "اكتب نصوص الخطاف البصري الـ 3 اليوم، وسجل فيديو تجميلي هادئ بالمنزل أو استعن بمخزون الفيديوهات الهادئة لجدولة أول لقطاتك العضوية الرصينة.",
          actionCode: "LAUNCH_TRAFFIC_FLOW"
        }
      ]
    },
    en: {
      title: "Traffic Generation: Organic High-Credibility Faceless Short Video Marketing",
      desc: "Attracting thousands of laser-targeted buyers for free through TikTok Reels & Shorts using pre-written scripts.",
      secret: "Silent Aesthetics Loops & Strategic Call-To-Action Frameworks",
      time: "Duration 40 minutes",
      material: "Marketing is the lifeblood of business. In this lesson, we explore zero-dollar organic user acquisition funnels without ever revealing your face or spending money on complex paid advertisements.\n\nShort-Form Video System (TikTok / Reels / Shorts):\n1. Aesthetic Video Capture: We capture beautiful, high-clarity zen clips (like brewing coffee, writing out notebooks, quiet study rooms on raining days).\n2. Strategic Video Hook: Place dynamic text on screen (e.g., 'Stop guessing. The key to absolute restaurant-grade curry relies on chemical spice ratios by the gram. Link in bio!').\n3. Consistent Delivery: Posting consistently with a genuine, value-packed perspective fosters immediate loyalty and brings endless stream of clients.",
      tasks: [
        "Create an aesthetic faceless business asset on TikTok & Instagram with elegant layouts",
        "Write down 3 copy-ready visually catchy textual hooks to grab passive scrollers’ attention",
        "Post and analyze your first quiet high-aesthetic short video showing your Zain Cash checkout link"
      ],
      prompts: [
        "Craft 5 highly aesthetic silent-video scenarios for TikTok/Reels showcasing my [Product Topic] digital guide, specifying recommended ambient sounds, visual frame, and on-screen quote hook."
      ],
      slides: [
        {
          title: "📸 The Authority of Organic Traffic",
          text: "Organic visitors are your warmest prospects. Standardized educational snippets provide immense immediate value, convincing users of your integrity and leading them directly to checkout.",
          actionCode: "ORGANIC_STRATEGY"
        },
        {
          title: "☕ Deploying Faceless Visual Loopers",
          text: "In-video face exposure is optional. Record calming, high-definition background activities paired with text detailing instructions. This allows you to run multiple international assets simultaneously.",
          actionCode: "FACELESS_SETUP"
        },
        {
          title: "🔗 From Viewer directly to Customer",
          text: "Ensure a crisp 'Download your precise cookbook from the link in bio' CTA is clear in the descriptions. Maintain a respectful, humble, and polite brand accent to cultivate trust.",
          actionCode: "CONVERSION_FUNNEL_SETUP"
        },
        {
          title: "🛠️ Map Your First Traffic Sequence",
          text: "Formulate 3 high-impact hooks now. Gather high-definition video materials to schedule your introductory aesthetic video today.",
          actionCode: "LAUNCH_TRAFFIC_FLOW"
        }
      ]
    }
  },
  lesson_6: {
    ar: {
      title: "مضاعفة الأرباح: تفعيل الأفرع الربحية الثلاثة وبونص إعادة التراخيص للعملاء والمشتركين",
      desc: "كيف تبيع نفس المنتج بمخرجات ورخص توزيع مختلفة لزيادة العائدات 10 أضعاف بذات الجهد.",
      secret: "إضافة ملفات الدعم المباشر ومقيد الخدمة كترخيص ممتاز PLR",
      time: "مدته 30 دقيقة",
      material: "تهانينا لوصولك للدرس الأخير! هنا نكشف لك كيف تعيد صياغة نفس منتجك لبيعه برخص وتراخيص استخدام مختلفة، لتزيد من تدفق أرباحك وتؤسس نبع دخل متكرر حقيقي.\n\nالترخيص ثنائي المسار (Double License Strategy):\n1. تراخيص الاستخدام الشخصي (Personal Use): بيع الكتيب للقارئ العادي ليتعلم ويطبق بسعر رمزي ($15 - $40).\n2. تراخيص الترخيص التجاري وإعادة البيع (PLR / Resell Rights): بيع الكتيب بسعر ممتاز ($97 - $147) لرواد الأعمال ليكون لهم الحق في إعادة تسمته ككتيب وتعديله وإعادة بيعه بالكامل!\n3. الحزم الإضافية الشاملة: تجميع الملف والجدول مع بونص المتابعة وسؤال المدرب كباقة متميزة تعظم العائد وتثير الإثارة الصادقة لدى المشترين.",
      tasks: [
        "إرفاق مستند رخصة إعادة الاستخدام والتراخيص التجارية (PLR Licence) داخل ملف منتجك الرقمي المعتمد",
        "صياغة صفحة العرض المزدوج لتبيان الفرق الحقيقي والمزايا الجوهرية لكل رخصة بوضوح",
        "إطلاق العرض الممتاز على مجموعات وقنوات برينجل ومشاركة قصة نجاح أولية واقعية مبهرة"
      ],
      prompts: [
        "صغ لي بذكاء ومصداقية نص رخصة قانونية وأخلاقية باللغة العربية للاستخدام التجاري وإعادة البيع (PLR License)، تحدد حقوق المشتري والتزاماته لضمان الأمانة المعرفية في السوق."
      ],
      slides: [
        {
          title: "💎 فلسفة مضاعفة المداخيل الرقمية",
          text: "الرواد المحترفون يزيدون الأرباح بتغيير 'رخص الفائدة' وليس بتعدد المنتجات. الملف الواحد يمكن بيعه ليتعلم منه شخص، أو بيعه لتاجر ليعيد تسميته وتسويقه بالكامل وتحقيق مبيعات خاصة به.",
          actionCode: "LICENSING_SYSTEMS"
        },
        {
          title: "📜 تراخيص الـ PLR (حقوق إعادة البيع المتميزة)",
          text: "قم بتوفير ترخيص تجاري قانوني وأخلاق وموثق من برينجل لطلبتك ليمتلكوا حق إعادة بيع دليلك بالغرامات، لتعطيهم فرصة نادرة لبدء رحلتهم التجارية فوراً وتلقي أرباحهم.",
          actionCode: "ISSUE_COMMERC_LICENSES"
        },
        {
          title: "📦 حزمة العرض المتكامل الفائق (The Ultimate Stack)",
          text: "صمم عرضك: 'أدلة الطهو بالغرامات + كراسات عمل مرادفة + رخصة إعادة البيع + بونص 150 أمر ذكي'. حزمة ذات فائدة ساحقة وملموسة تستقطب آلاف الزوار لمتجرك.",
          actionCode: "ASSEMBLE_ULTIMATE_STACK"
        },
        {
          title: "🛠️ فعّل رخصتك وحلقاتك اليوم",
          text: "صغ شهادة ترخيص كلاسيكية وأدرجها في ملفك. حدث صفحة هبوطك باليوكان لتبيان سعر التراخيص التجارية وابدأ بجمع عوائد التمكين الأخلاقية.",
          actionCode: "SET_DAILY_MILESTONE_6"
        }
      ]
    },
    en: {
      title: "Maximizing Revenue: The Double-Licensing Model & PLR Reselling Freedom",
      desc: "How to commercialize the exact same guide under distinct usage rights to multiply yields 10x.",
      secret: "Distributing Premium PLR Rights & Companion Worksheets",
      time: "Duration 30 minutes",
      material: "Congratulations on reaching the final lesson! Here we reveal the strategic masterstroke of modern creators: selling the exact same digital asset under distinct licensing grades to compound net margins.\n\nDouble-Licensing Strategy Matrix:\n1. Personal Study License (Personal Use): Selling the recipe file for single home cooks at a modest cost ($15 - $40).\n2. Master Commercial Rights License (PLR / Resell Rights): Selling the same guide at a premium rate ($97 - $147) targeting starting creators, authorizing them to append their brand name and resell it freely.\n3. The Super Stack: Nesting the core ebook, printable logs, and resell rights as a bundled VIP package that secures enormous buyer willingness to pay.",
      tasks: [
        "Include an elegant PLR commercial certification document inside your final master file directory",
        "Formulate a comparison table on your storefront listing the boundaries of personal vs commercial licenses",
        "Distribute your commercial bundle across specialized online developer and entrepreneur groups"
      ],
      prompts: [
        "Draft a formal, highly professional legal and ethical PLR Resell License in English outlining permissions to re-purpose, modify and sell a digital guide while maintaining code integrity."
      ],
      slides: [
        {
          title: "💎 The Philosophy of Multi-Tier Pricing",
          text: "Professionals scale earnings by shifting usage licensing rights, never by creating 10 different products. The same document satisfies a student looking to learn or a business owner looking for ready-to-sell content.",
          actionCode: "LICENSING_SYSTEMS"
        },
        {
          title: "📜 Establishing Genuine PLR Rights",
          text: "Equip your starting students with signed commercial PLR certifications. This grants them immediate agency to launch their own online operation, generating maximum trust and loyalty toward you.",
          actionCode: "ISSUE_COMMERC_LICENSES"
        },
        {
          title: "📦 Custom Bundling (The Irresistible Value Offer)",
          text: "Package your core eBook, calorie spreadsheets, signed licensing file, and AI prompts treasure. A bundle of unmatched, absolute value that converts visitors instantly.",
          actionCode: "ASSEMBLE_ULTIMATE_STACK"
        },
        {
          title: "🛠️ Activate Custom Commercial Certs",
          text: "Create a signed digital license card and insert it inside your compiled product. Update your storefront with premium PLR prices to capture higher order values immediately.",
          actionCode: "SET_DAILY_MILESTONE_6"
        }
      ]
    }
  },
  lesson_7: {
    ar: {
      title: "الدورة الذكية العالمية للريادة المعرفية والطبخ الكيميائي المعياري السمعي البصري 🌍 [Flagship Smart Global Course]",
      desc: "نظام مستقبلي ذكي عالي المصداقية يعلمك ريادة الأعمال وصنع أصول رقمية فاخرة بالغرامات وتسليمها الذاتي.",
      secret: "الامتياز المعرفي الشامل وتكامل Zain Cash العابر للقارات لطلبة باقة الـ $197 الممتازة",
      time: "تحفة دراسية عالمية جاهزة بالتحديث",
      material: "أهلاً بك في الدورة المستقلة الأكثر ربحية ومصداقية للتمكين والريادة المعرفية الرقمية على مستوى العالم!\n\nهذا المسار الاستراتيجي المستقبلي تم تصميمه وتدقيقه لتمكين الرواد الصغار والخرجين من تأسيس كيانات ربحية ذكية عابرة للحدود بالاعتماد الكلي على 'الطبخ الكيميائي المعياري' وتأليف الكتيبات المعرفية فائقة القيمة، مصحوبة بخطط تسويق خوارزمية ذكية لا تتطلب أي ميزانية ترويجية.\n\nلماذا تعتبر هذه الدورة هي الدورة الذكية العالمية الأنسب لك؟\n1. المصداقية والالتزام العلمي: نبتعد تماماً عن وعود تسويق المتوهمين بالثراء الكاذب. نعلمك خطوات تشغيلية حقيقية لصناعة كتب طبخ ودلائل علمية دقيقة تصف المقادير بالغرام والمللي كأنها تجربة مخبرية لا تفشل أبداً.\n2. تكامل Zain Cash والتحويل التلقائي: نربط بواباتك المحلية بالتحف والمنتجات الرقمية لتعمل ذاتياً 24/7 دون أي تراجع في الخدمة.\n3. رخص التراخيص التجارية الدولية PLR: يمنحك البرنامج شهادة ترخيص قانونية تتيح لك تعديل المنهج بالكامل في منطقتك، ترجمته عبر مترجم جيميناي الفوقي لـ 15 لغة، وإعادة بيعه وجمع الأرباح بمحفظتك الفردية مباشرة بمصداقية مطلقة.",
      tasks: [
        "مراجعة خطة تدوير المناهج العابرة لـ 15 لغة وخدمتها لطلبة الخليج والعراق والدول الغربية بموثوقية",
        "الربط النهائي للمتجر الحقيقي وإجراء تجارب الدفع مع زين كاش بالدينار العراقي والخليجي",
        "الحصول على رختك القانونية الموثقة PLR والبدء في تلقي الأرباح"
      ],
      prompts: [
        "صمم لي استراتيجية تسويق عالمية عابرة للقارات لمنتجي المعرفي المترجم لـ 3 لغات، تصف آليات الترويج الهادئ والعضوي في تيك توك وتضمن توقيت النشر الفعال حسب فروق التوقيت العالمي."
      ],
      slides: [
        {
          title: "🌍 مستقبل ريادة الأعمال المعرفية المستقلة",
          text: "بصفتك شريكاً في هذه الدورة المعرفية الحقيقية والمصداقية العالية، ستتجاوز كل القنوات التقليدية. ستعرض أمام مستهلكيك منتجاً ذكياً تم تفكيك مقاديره بالغرام والمل على الطريقة الكيميائية المضمونة، مما يخلق ولاء لا ينضب.",
          actionCode: "GLOBAL_SYSTEM_INIT"
        },
        {
          title: "🧪 هندسة الطبخ الكيميائي المعياري والـ PLR",
          text: "المنتج الرقمي الفاخر هو المرجع الأوثق. تصف المقادير بدقة عالية للمطاعم ومحبي الطهو العائلية مع إضافة السوائل بدرجات حرارة معينة وتزامن رياضي. دليلك الرقمي ليس مجرد نصوص، هو صيغة علمية صادقة.",
          actionCode: "GASTRONOMY_MATH_ENGINE"
        },
        {
          title: "💰 هيكل التدفقات المالية العابرة للقارات وحساب زين كاش آلياً",
          text: "الدورة تدر ربحاً متواصلاً ومضموناً من 3 قنوات مستقلة: بيع أدلة الطهو بالغرامات لآلاف المستهلكين محلياً، وإعادة بيع الكورس مع الترخيص التجاري PLR للطلبة، وترويج الأدوات الساندة بالعمولة بذكاء.",
          actionCode: "AUTOMATED_GLOBAL_STREAMS"
        },
        {
          title: "🛠️ خريطة الـ 30 يوماً للثروة المعرفية الصادقة عالمياً",
          text: "برنامج عملي شامل مع مريم ناهي وبرينجل يتضمن جداول دقيقة بالساعة. استعد لإطلاق متجرك المتكامل اليوم، وتلقي تحويلاتك الأولى عبر زين كاش والنهوض الفوري بالبونصات الذهبية المصممة بدقة.",
          actionCode: "COMPREHENSIVE_SUCCESS_LAUNCH"
        }
      ]
    },
    en: {
      title: "Global Smart AI-Driven Culinary PLR Systems & Automated Micro-Entrepreneurship Masterclass 🌍 [Flagship Future Course]",
      desc: "The ultimate profitable digital knowledge system teaching you how to engineer precise recipes and local cash automated collection.",
      secret: "Global Universal Branding Privileges & Automated Cross-Continent Zain Cash Payouts for $197 VIP Students",
      time: "Innovative World-Class Curriculum",
      material: "Welcome to the world's most profitable, honest, and high-credibility digital knowledge system designed for modern graduates and aspiring entrepreneurs!\n\nThis strategic masterpiece path is researched and refined to enable starters to build bulletproof online brands utilizing high-precision 'Metric Cooking Methods' and premium designed PLR assets. Fully backed by cross-continent mobile micro-wallets and organic social traffic sequences that cost exactly zero dollars to launch,\n\nWhy this is the chosen global smart masterclass for high authority and sales:\n1. Absolute Integrity & Scientific Honesty: We discard fake dreams and high-claims. We detail real processes to build recipes in precise weight grams and thermal guidelines, ensuring success for the ultimate consumer.\n2. Seamless Mobile Payout Automation: Interface Iraqi Zain Cash and Gulf pay gateways with cloud servers to automatically verify transfers and send links 24/7.\n3. Universal Commercial PLR Certification: Acquire a signed commercial resell license so you can rebrand, translate across Gemini Translator to 15 different languages, and pocket 100% of the course fees directly to your individual wallet.",
      tasks: [
        "Audit the multi-lingual global translation schema to reach clients across America, Europe & Gulf markets properly",
        "Enable local API parameters for Zain Cash or credit cards to enable effortless mobile checkout",
        "Download your validated commercial licensing token and start receiving automatic sales"
      ],
      prompts: [
        "Generate a cross-border organic video script strategy in English for my scientific metric culinary manual, mapping the ideal posting hours across international time zones to secure views."
      ],
      slides: [
        {
          title: "🌍 The Vision of High-Credibility Knowledge Brands",
          text: "As a global pioneer in this smart educational framework, you bypass speculative markets. You provide buyers with precise, gram-weight culinary specifications that yield professional culinary success every single time, forging deep trust.",
          actionCode: "GLOBAL_SYSTEM_INIT"
        },
        {
          title: "🧪 Standardized Metric Food Physics & PLR",
          text: "High-end PDF guides act as absolute math guides. Document weights, exact utensil dimensions, liquid resting temps, and molecular advice. Your work is a respected scientific manual, not casual recipes.",
          actionCode: "GASTRONOMY_MATH_ENGINE"
        },
        {
          title: "💰 Configuring 3 Robust Cross-Continent Income Streams",
          text: "Harvest consistent returns from 3 proven channels: retailing high-precision culinary books to home chefs, licensing full PLR rights to other starting creators, and earning recurring fees from Canva & ChatGPT tools.",
          actionCode: "AUTOMATED_GLOBAL_STREAMS"
        },
        {
          title: "🛠️ The 30-Day Blueprint to Authority and Sales",
          text: "A comprehensive hourly scheduled playbook. Deploy your automated store layout today, link local mobile collection widgets, and activate your exquisite designed bonus packs immediately.",
          actionCode: "COMPREHENSIVE_SUCCESS_LAUNCH"
        }
      ]
    }
  }
};

const BONUSES_DATA: Record<
  string,
  {
    ar: {
      title: string;
      desc: string;
      sections: { heading: string; items: { label: string; details: string; value?: string }[] }[];
    };
    en: {
      title: string;
      desc: string;
      sections: { heading: string; items: { label: string; details: string; value?: string }[] }[];
    };
  }
> = {
  "Commands_Treasury_Arabic.pdf": {
    ar: {
      title: "الحقيبة الذهبية الحصرية: 150 أمر محكم للذكاء الاصطناعي وصياغة الوصفات والتسويق المعياري",
      desc: "محررة وجاهزة بالكامل لتشغيل المخرجات الفورية 🧪. انسخ أي أمر ذكي وضعه بجد بـ ChatGPT أو Gemini للتمكين ومضاعفة الإنتاجية.",
      sections: [
        {
          heading: "الجزء الأول: أوامر طبخ ومناهج غرامية معيارية دقيقة للمأكولات والأطباق",
          items: [
            {
              label: "الأمر 1 (تأسيس القوام والسر الكامن والطهي الصادق)",
              details: "يوجه نموذج الذكاء الاصطناعي لوضع نسب وزنية بالجرام والمل للمطبخ الخليجي المعاصر مع سر تماسك القوام.",
              value: "أريد صياغة وصفة دقيقة مبنية على المطبخ الخليجي المعاصر لـ [اسم الطبق] باللغة العربية، موضحاً المكونات الجافة بالغرام والنسب المعيارية بالمل، مع شرح ميكانيكية الطهي خطوة بخطوة وإدراج 'السر الكيميائي الدقيق' الذي يجعل العجينة هشة والقوام متماسكاً تماماً مثل كبار الطهاة."
            },
            {
              label: "الأمر 2 (إعداد كراسة المراجعة والنسخة المرادفة للمشتري)",
              details: "يولد مسودة كراسة وجداول تتبع يومية للسعرات وصحيفة ورقية يقوم المشتري بملئها يدوياً لدعم القيمة المضافة للمستند.",
              value: "اكتب فصلاً كاملاً لـ [اسم الكتيب] يحتوي على 3 طرق مبتكرة لتنسيق الأطباق العائلية، مع وضع كراسة متبعة بها جدول يومي لحساب السعرات وموازنة المكونات يملؤه القارئ بنفسه، وصغ النصوص برصانة فائقة تدعم المصداقية والموثوقية."
            },
            {
              label: "الأمر 3 (هيكلة دليل PLR المعرفي الفاخر)",
              details: "يؤسس الهيكلية المثالية للفصول المتسلسلة والمقدمة التعهدية الصادقة التي تجذب القراء وتمنع الارتصاص.",
              value: "أنت المدير الإبداعي لصناعة الكتب المعرفية ببرينجل. صمم هيكلية فصل تمهيدي لكتيب إلكتروني حول [موضوع الكتيب]، يشمل عنواناً مثيراً للاهتمام، ومقدمة واقعية تحث على الالتزام دون ادعاءات الثراء السريع، ثم 3 نقاط تنفيذية فورية."
            }
          ]
        },
        {
          heading: "الجزء الثاني: أوامر تشييد المتاجر وإعداد صفحات الهبوط الجاذبة الصادقة",
          items: [
            {
              label: "الأمر 4 (صياغة نبرة صفحة الهبوط ذات المصداقية العالية)",
              details: "يكتب نصوص العرض والأسئلة الشائعة وضمان الرضا الحقيقي للمستهلك لتوليد ثقة جارفة بالشراء.",
              value: "اكتب نص صفحة الهبوط الكامل لمنتجي المعرفي المسمى [اسم المنتج]. أريد عنواناً خاطفاً، رصداً للمشكلة الحقيقية (حضور فوضى المعلومات)، يليه العرض المغري Stack والضمان الحقيقي لتأمين راحة المشتري، والأسئلة الشائعة بنهاية الصفحة."
            },
            {
              label: "الأمر 5 (رسائل تسويقية مؤتمتة عبر البريد الإلكتروني)",
              details: "يصمم سلسلة من 3 رسائل تسلسلية بالبريد لتهيئة المشترك بالحلول الرقمية وإظهار مميزات زين كاش.",
              value: "صغ لي سلسلة من 3 رسائل بريد إلكتروني تسلسلية بمصداقية مطلقة لتهيئة القارئ لشراء [اسم الكتاب الإلكتروني]، تركز الرسالة الأولى على القيمة العلمية الحقيقية، والثانية على كراسة العمل المجانية المضمنة، والثالثة على التخفيض المؤقت لاستيراد التراخيص التجارية."
            }
          ]
        },
        {
          heading: "الجزء الثالث: أوامر صناعة الفيديوهات العضوية ومقاطع الاستقطاب الصامتة",
          items: [
            {
              label: "الأمر 6 (خطط الانتشار ومقاطع التيك توك الصامتة الجاذبة)",
              details: "يصوغ 5 قوالب لتصوير مقاطع الجاذبية البصرية وتفصيل نصوص الخطاف المكتوبة على الشاشة في البايو.",
              value: "اقترح علي 5 قوالب لتسجيل فيديوهات تيك توك قصيرة صامتة وذات طابع جمالي مهدئ لـ [الموضوع]، اشرح مظهر الكادر (سجل إعداد كوب قهوة أو تقليب أوراق عمل)، واكتب الكوبونات الفورية والخطاف البصري الجاهز ليوضع كشرح على الشاشة."
            },
            {
              label: "الأمر 7 (عناوين تريند مقنعة وصادقة للتوجيه لزين كاش)",
              details: "يولد 10 عناوين راقية ومقنعة للريلز تقود الزوار لمتجرك بالتسليم التلقائي في البايو.",
              value: "صمم 10 عناوين خاطفة ومقنعة لإنستغرام ريلز تتناول [المشكلة أو المجال] لكي تجذب العملاء بكثافة إلى رابط Zain Cash في البايو، بعيداً عن الترويج الوهمي والمباهاة الفوقية."
            }
          ]
        }
      ]
    },
    en: {
      title: "Exclusive Golden Bag: 150 Standardized High-Precision AI Commands for Copy-Paste",
      desc: "Fully researched and engineered for direct execution 🧪. Copy any smart command and paste it directly into ChatGPT or Gemini.",
      sections: [
        {
          heading: "Part 1: Metric Gastronomy & Standardized Weight Formulations",
          items: [
            {
              label: "Command 1 (Precision Food Chemistry and Structural Integrity)",
              details: "Instructs AI to output complete ingredient specifications in grams and milliliters for Gulf gourmet dishes.",
              value: "Generate a classic luxury culinary recipe in English for [Dish Name] containing milligram-precise weights of ingredients and highlighting the precise thermal reaction and spices secrets of top chefs."
            },
            {
              label: "Command 2 (Crafting Interactive Printable Worksheets)",
              details: "Compiles printable trackers and progress grids that the purchaser fills manually to elevate perception of value.",
              value: "Draft a complete printable worksheet for [Guide Title] containing daily calorie balance logs and ingredient trackers that users fill out themselves with a highly formal tone."
            },
            {
              label: "Command 3 (Skeletal Structure for High-Credibility PLR Guides)",
              details: "Generates table of contents, introduction pledges, and chapter layouts that avoid clutter and secure retention.",
              value: "You are the creative director of knowledge guides. Design the outline of an introductory chapter for an ebook on [Ebook Subject], including an enticing title, realistic dedication, and 3 actionable steps."
            }
          ]
        },
        {
          heading: "Part 2: Storefront Configuration & High-Converting Landing Page Copy",
          items: [
            {
              label: "Command 4 (Honest High-Credibility Landing Page Copy)",
              details: "Outputs conversion copy, trust guarantees block, and transparent FAQs to maximize buyer trust.",
              value: "Create copy for a YouCan landing page targeting [Product Name], featuring a realistic hook, a trust guarantees block, and transparent FAQs."
            },
            {
              label: "Command 5 (Automated Email Marketing Sequences)",
              details: "Generates an automated series of 3 emails explaining the digital file's weights and the Zain Cash transfer process.",
              value: "Draft a sequence of 3 email marketing messages in English focusing on deep culinary value, companion logs, and limited commercial resale rights coupons."
            }
          ]
        }
      ]
    }
  },
  "Digital_Storefront_Guide.pdf": {
    ar: {
      title: "دليل تشييد المتاجر: إعداد وبناء متجر Salla & YouCan في 48 ساعة فقط وتلقي التمويل",
      desc: "مسودة حقيقية متكاملة وبخطوة بخطوة 📱. يوضح ميكانيكية إطلاق المتجر وربط محفظتك الرقمية والتسليم المؤتمت بالكامل.",
      sections: [
        {
          heading: "الخطوة الأولى: تهيئة المتجر الرقمي (YouCan / Salla)",
          items: [
            {
              label: "1. التسجيل والترخيص الأساسي",
              details: "اذهب لموقع YouCan.shop أو salla.sa وافتح حساباً جديداً باسم براندك المعرفي. اختر خطة المبتدئين الرمزية لتقليل تكاليف الإطلاق لـ 0$ والتحويل الفوري."
            },
            {
              label: "2. إعداد واجهة المتجر والجماليات الأساسية",
              details: "اختر قالب بيع أحادي المنتج (Single-Product Landing Layout). رتب الهيدر والبانر والرموز مستعيناً بالخط الرمادي البصري والروز الداكن الفاخر."
            }
          ]
        },
        {
          heading: "الخطوة الثانية: تكامل Zain Cash وبوابات الدفع المحلية والعالمية",
          items: [
            {
              label: "1. ربط محفظة Zain Cash الساحرة",
              details: "سجل حساب محفظة زين كاش التجارية أو الشخصية واطلب المعرف الرقمي Merchant ID و Secret Key من أقرب وكيل زين لتلقي الحوالات كعجلة ثقة بالدينار."
            },
            {
              label: "2. تفعيل بوابات الدفع الإلكتروني الرديفة للعملاء",
              details: "لتلقي المبيعات عبر البطاقات الائتمانية بملف YouCan Pay أو Stripe ، ضع إخطاراً واضح كالتالي: 'يمكنك التحويل الفوري عبر زين كاش وتلقي كتاب الوصفات ومقادير الأكلات آلياً بلحظة واحدة!'."
            }
          ]
        },
        {
          heading: "الخطوة الثالثة: رفع الملف الرقمي وتسليمه التلقائي المؤتمت للمشترين",
          items: [
            {
              label: "1. إضافة منتج رقمي (Digital Product Setup)",
              details: "اضغط على 'أضف منتج جديد' > المسمى: دليل الكتيب المعرفي الفاخر مع رخصة مريم ناهي. اختر النوع: 'ملف رقمي تنزيل فوري (Digital Download)' وارفع ملف الـ PDF أو الرابط النهائي للكتيب الموفر من برينجل المعياري."
            },
            {
              label: "2. ميكانيكية التحويل والتسليم الفوري",
              details: "بمجرد قيام المشتري بالتحويل والتحقق بالبحر الرقمي، يقوم خادم المنصة بتأشير الطلب كمكتمل (Completed) تلقائيًا، ويتلقى العميل بريداً فورياً به زر 'تحميل الملف الرقمي بالغرامات' للتنزيل برصانة تامة."
            }
          ]
        }
      ]
    },
    en: {
      title: "Storefront Builder Guide: Deploying Salla & YouCan Stores in 48 Hours",
      desc: "An absolute detailed blueprint mapping out mobile collection workflows and file delivery loops 📱.",
      sections: [
        {
          heading: "Phase 1: Store Setup and Accounts Registration",
          items: [
            {
              label: "1. Signing Up & Choosing the Right Plan",
              details: "Visit Salla.sa or YouCan.shop and create your account. Use zero-upfront monthly plans to secure high margins from the initial client."
            },
            {
              label: "2. Structuring Single-Product Theme Landing Pages",
              details: "Deploy a clean single-product sales template. Choose soft colors (rose gold dark, gray backgrounds) to maintain extreme customer visual ease."
            }
          ]
        },
        {
          heading: "Phase 2: Mobile E-Wallets & Zain Cash Configuration",
          items: [
            {
              label: "1. Activating Mobile Wallets for Iraq & the Gulf",
              details: "Apply for a Merchant ID and Secret Key from your local mobil operator. Link these credentials to Salla/YouCan under settings."
            },
            {
              label: "2. Setting Up Backup Checkout Columns",
              details: "Add Stripe or credit cards. Post clear instructions on screen: 'Zain Cash transfers unlock instant recipe file download links instantly!'"
            }
          ]
        },
        {
          heading: "Phase 3: Digital File Inventory & Instant Delivery Scripts",
          items: [
            {
              label: "1. Registering the Digital Asset",
              details: "Add new product > Choose 'Digital Download'. Upload your master PDF guide synthesized by our dynamic PLR compiler."
            },
            {
              label: "2. Instant passive checkout fulfillment loop",
              details: "When payment status updates to 'Paid', the server automatically fires the file links directly to the customer's mailbox. Highly efficient transaction flow."
            }
          ]
        }
      ]
    }
  },
  "Organic_Traffic_Formula.pdf": {
    ar: {
      title: "نظم الانتشار المجاني: ملف تخطيط الفيديوهات العضوية المؤدية للمبيعات",
      desc: "كتالوج صامت وموثوق وممهد للانتشار الفايرالي 📈. يعرض خطة الـ 30 يوماً بالتفصيل وقوالب النصوص الجاهزة للكراسات.",
      sections: [
        {
          heading: "مفهوم التسويق الصامت غير الشفهي (Faceless Aesthetic)",
          items: [
            {
              label: "1. جوهر الهدوء النفسي (Calm Aesthetic)",
              details: "يتجنب التسويق الصامت الوعود الضخمة وبهرجة التسويق المزعجة. بدلاً من ذلك، نركز على تبيان المنفعة المعرفية والأوزان وتوثيق الخطوات بهدوء لترسيخ الأمانة والمصداقية."
            }
          ]
        },
        {
          heading: "الجدولة الأسبوعية الـ 30 يوماً للتسويق العضوي الشامل",
          items: [
            {
              label: "الأسبوع الأول: التأسيس وجذب ثقة الجمهور لزين كاش",
              details: "اليوم 1: تصميم شعار أنيق ومريح. اليوم 3: تصوير أول 5 مقاطع فيديو قصيرة مهدئة ومصقولة بالجرام. اليوم 5: نشر اللقطات مع إضافة خطاف بصري: 'السر ليس في الحظ، بل في دقة المقادير. دليلي المطبوع في البايو بالتفصيل'."
            },
            {
              label: "الأسبوع الثاني: ترسيخ المصداقية وتأصيل ميثاق الأوزان",
              details: "اليوم 8: نشر فيديو يشرح ميكانيكية استواء اللحوم أو تحضير التتبيلة كيميائياً. اليوم 11: تقديم ورقة عمل متبعة فارغة ليمسك الجمهور ورقة ويدونوا السعرات. اليوم 14: تبيان الضمان الفعلي ورخصة التمكين."
            }
          ]
        },
        {
          heading: "قوالب نصوص الفيديو القصير الجاهزة للنشر والتعديل",
          items: [
            {
              label: "القالب الأول: تقليب الصفحات والسر الكامن",
              details: "المشهد: إضاءة ناعمة، يد طاهٍ تقلب كتيب المطبوعات المعياري، ثم ميزان يعاير غرامات التوابل. النص الساطع: 'السر يكمن بكيمياء التوابل والمقادير وليس بالموهبة العشوائية. صممت لك كتيب الأكلات الأجدر لنجاح دائم من أول محاولة. حمله من الرابط'."
            },
            {
              label: "القالب الثاني: لابتوب مفتوح وإعداد المحفظة",
              details: "المشهد: قلم راقٍ يخط على دفتر أوراق، وبجانبه متجر YouCan يتلقى طلباً آلياً بسعر $49. النص: 'بيع الكتيبات الرقمية يحتاج أمانة ومعرفة بديلة مدتها 30 يوماً لتهيئة بوابات زين كاش تلقائياً. خطوتك الأولى مؤرخة بالتفصيل بالبايو'."
            }
          ]
        }
      ]
    },
    en: {
      title: "Organic Traffic Blueprint: Faceless Video Marketing Formula",
      desc: "Proven short video layout checklist to gain millions of views with zero ad spend 📈.",
      sections: [
        {
          heading: "Understanding the Power of Aesthetic Silent Clips",
          items: [
            {
              label: "1. The Silent Authority Formula",
              details: "Faceless marketing drives premium sales by stripping out voice noise and showcasing the beautiful weight precision. Calming visuals command immense human credibility."
            }
          ]
        },
        {
          heading: "The 30-Day Growth Matrix Schedule",
          items: [
            {
              label: "Week 1: Foundations and Initial Authority Capture",
              details: "Day 1: Design clean stone-color logo. Day 3: Video capture 5 quiet clips of food weighing. Day 5: Publish videos with on-screen hooks: 'Cooking is chemistry by the gram. Standard cookbook in bio.'"
            },
            {
              label: "Week 2: Social Proof and Printable Companion Sheets",
              details: "Day 8: Technical breakdown of protein temperatures and resting times. Day 11: Put downloadable helper sheets. Day 14: Offer signed licenses."
            }
          ]
        },
        {
          heading: "Pre-Written High-Retention Video Script Templates",
          items: [
            {
              label: "Template A: Flipping Book Pages on Scale",
              details: "Frame: Soft shadows, hand flipping luxurious metrics guide near a digital scale. Screen Text: 'Stop cooking based on feelings. Spices require milligram precision to satisfy people. Grab my guide from the bio.'"
            }
          ]
        }
      ]
    }
  }
};

interface AdminSuiteProps {
  answers: any;
  daysCompletedCount: number;
  onNavigateToPanel: (panelId: string) => void;
  lang?: string;
}

export default function AdminSuite({ answers, daysCompletedCount, onNavigateToPanel, lang = "ar" }: AdminSuiteProps) {
  // Navigation active tab inside Admin Suite
  const [activeTab, setActiveTab] = useState<"ai_tools" | "affiliate" | "analytics" | "payments" | "digital_course" | "users_admin">("ai_tools");

  // Multilingual states for the selected lesson player
  const [lessonLang, setLessonLang] = useState<"ar" | "en">("ar");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // States for the interactive designed bonuses viewer
  const [selectedBonus, setSelectedBonus] = useState<any | null>(null);
  const [bonusSearchQuery, setBonusSearchQuery] = useState("");

  // New state variables for Video Mode and Smart Support Thread
  const [videoMode, setVideoMode] = useState<"video" | "slides">("video");
  const [supportQuery, setSupportQuery] = useState("");
  const [supportMessages, setSupportMessages] = useState<Array<{ role: "student" | "coach"; text: string; date: string }>>([
    {
      role: "coach",
      text: "أهلاً بك يا شريك الإطلاق الرائع في قناة المتابعة الحية ومجلس تذليل العقبات التقنية والتسويقية! 👋 أنا مريم ناهي، مستشارتك الشخصية والمدربة لكل وحدات وبونصات هذه الدورة الشاملة.\n\nاكتب لي أي استفسار أو مشكلة تواجهك بالتفصيل (مثل: تحديد نوع الطبخة بالجرامات، طريقة ربط Zain Cash في YouCan، أو صياغة سكريبت تيك توك الأول)، وسأحلل المشكلة فوراً وأضع لك الحل الدقيق والأصدق لمواصلة رحلتك بنجاح وعلو!",
      date: "الآن"
    }
  ]);
  const [supportLoading, setSupportLoading] = useState(false);


  // Affiliate Links state
  const [links, setLinks] = useState<AffiliateLinks>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LINKS);
      return saved ? JSON.parse(saved) : DEFAULT_AFFILIATE_LINKS;
    } catch {
      return DEFAULT_AFFILIATE_LINKS;
    }
  });

  const [savingLinks, setSavingLinks] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Affiliate click tracker count state
  const [clickCounts, setClickCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CLICKS);
      return saved ? JSON.parse(saved) : {
        canva: 12, gumroad: 8, chatgpt: 15, notion: 5, capcut: 7, mailchimp: 4, payhip: 3, gdocs: 2, gemini: 6, stripe: 1
      };
    } catch {
      return {};
    }
  });

  // Track page views locally
  const [pageViews, setPageViews] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VIEWS);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Safe links save trigger
  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLinks(true);
    setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(links));
        setSavingLinks(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (e) {
        setSavingLinks(false);
        alert("فشل حفظ الروابط الترويجية.");
      }
    }, 800);
  };

  const handleResetLinksToDefault = () => {
    if (window.confirm("هل أنت متأكد من استعادة الروابط الافتراضية؟")) {
      setLinks(DEFAULT_AFFILIATE_LINKS);
      localStorage.setItem(LOCAL_STORAGE_KEY_LINKS, JSON.stringify(DEFAULT_AFFILIATE_LINKS));
    }
  };

  // --- TAB 1: AI TOOLS & UNIVERSAL TRANSLATOR STATES ---
  const [selectedAiTool, setSelectedAiTool] = useState<"translator" | "headline" | "roadmap" | "simplifier" | "ads" | "funnel_architect" | "ebook_architect" | "idea_innovator" | "product_generator">("translator");
  
  // Subscriber gifts status state (which tools are restricted as direct subscription incentives)
  const [giftSubscribersTools, setGiftSubscribersTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sub_gift_ai_tools_v1");
      return saved ? JSON.parse(saved) : ["funnel_architect", "ebook_architect", "idea_innovator", "product_generator"];
    } catch {
      return ["funnel_architect", "ebook_architect", "idea_innovator", "product_generator"];
    }
  });

  useEffect(() => {
    localStorage.setItem("sub_gift_ai_tools_v1", JSON.stringify(giftSubscribersTools));
  }, [giftSubscribersTools]);

  const toggleToolGiftStatus = (toolKey: string) => {
    if (giftSubscribersTools.includes(toolKey)) {
      setGiftSubscribersTools(giftSubscribersTools.filter(t => t !== toolKey));
    } else {
      setGiftSubscribersTools([...giftSubscribersTools, toolKey]);
    }
  };

  // Funnel Architect states
  const [funnelProductName, setFunnelProductName] = useState("");
  const [funnelTargetUser, setFunnelTargetUser] = useState("");
  const [funnelPricingType, setFunnelPricingType] = useState("شراء فردي 19$ مع مكافآت");
  const [funnelResult, setFunnelResult] = useState("");
  const [generatingFunnel, setGeneratingFunnel] = useState(false);

  // Ebook outline generator states
  const [ebookTopicField, setEbookTopicField] = useState("");
  const [ebookChaptersCount, setEbookChaptersCount] = useState("5");
  const [ebookToneStyle, setEbookToneStyle] = useState("تعليمي ملهم مع خطة عمل");
  const [ebookOutlineResult, setEbookOutlineResult] = useState("");
  const [generatingEbook, setGeneratingEbook] = useState(false);

  // Idea Innovator states
  const [innovatorNiche, setInnovatorNiche] = useState("الطبخ والمأكولات والأطباق");
  const [innovatorCustomNiche, setInnovatorCustomNiche] = useState("");
  const [innovatorTimeframe, setInnovatorTimeframe] = useState("العشر سنوات المقبلة والذكاء الاصطناعي 2026-2035");
  const [innovatorStyle, setInnovatorStyle] = useState("مبتكر للغاية وقابل للتوسع السريع ومربح");
  const [generatingInnovator, setGeneratingInnovator] = useState(false);
  const [innovatorResult, setInnovatorResult] = useState("");

  // Product Generator states
  const [generatorTopic, setGeneratorTopic] = useState("أطباق عصرية صحية وسريعة التحضير للبيع");
  const [generatorType, setGeneratorType] = useState("كتيب مأكولات ووصفات طعام متكامل للتسويق والبيع");
  const [generatorCredibility, setGeneratorCredibility] = useState("مصداقية مطلقة مع مقادير علمية وطرق تحضير دقيقة ومُثبَتة");
  const [generatingProduct, setGeneratingProduct] = useState(false);
  const [productGeneratorResult, setProductGeneratorResult] = useState("");

  // Course Interactive & AI Helper states
  const [courseSecretArea, setCourseSecretArea] = useState("إعادة هندسة أرباح المنتجات وتوليف PLR ذو الجودة العالية");
  const [courseTargetOutput, setCourseTargetOutput] = useState("وضع خطة بيع وتراخيص كتيب لتكرار العائد أكثر من 10 مرات");
  const [generatingCourseSecret, setGeneratingCourseSecret] = useState(false);
  const [courseSecretResult, setCourseSecretResult] = useState("");

  const [coursePlannedNiche, setCoursePlannedNiche] = useState("المأكولات والمطبخ الخليجي والعربي المعاصر");
  const [courseDailyHours, setCourseDailyHours] = useState("ساعتان (2 ساعة) بتركيز عالٍ");
  const [courseGoalUrl, setCourseGoalUrl] = useState("ربط Zain Cash وبوابة الدفع واستقبال مبيعات حقيقية وتصدير الملفات");
  const [generatingCoursePlan, setGeneratingCoursePlan] = useState(false);
  const [coursePlanResult, setCoursePlanResult] = useState("");

  const [courseProductTopic, setCourseProductTopic] = useState("دليل الطهي الخليجي الحديث ذو المصداقية العالية");
  const [courseProductType, setCourseProductType] = useState("كتاب طبخ ووصفات عصرية مبتكرة ومقادير رياضية");
  const [generatingCourseProduct, setGeneratingCourseProduct] = useState(false);
  const [courseProductResult, setCourseProductResult] = useState("");

  const [tierCoursePrice, setTierCoursePrice] = useState("147");
  const [completedCourseLessons, setCompletedCourseLessons] = useState<string[]>([]);
  
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [lessonVideoPlaying, setLessonVideoPlaying] = useState(false);
  const [lessonVideoProgress, setLessonVideoProgress] = useState(15);
  const [lessonActiveTab, setLessonActiveTab] = useState<"material" | "tasks" | "prompts">("material");

  // Real-time video progression simulator
  useEffect(() => {
    let interval: any = null;
    if (lessonVideoPlaying) {
      interval = setInterval(() => {
        setLessonVideoProgress(prev => {
          if (prev >= 100) {
            return 0; // Loopback
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lessonVideoPlaying, playbackSpeed]);

  const triggerLessonDownload = (lesson: any) => {
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
${details.slides.map((s, idx) => `[المحور ${idx + 1}] ${s.title}\n${s.text}`).join('\n\n')}

------------------------------------------------------------------------
✅ ثالثاً: جدول المهام العملية وخطوات الإنجاز المباشرة
------------------------------------------------------------------------
${details.tasks.map((t, idx) => `[ ] المهمة ${idx + 1}: ${t}`).join('\n')}

------------------------------------------------------------------------
🤖 رابعاً: أوامر الذكاء الاصطناعي الجاهزة للتوليف والأتمتة
------------------------------------------------------------------------
${details.prompts.map((p, idx) => `الأمر ${idx + 1}:\n"${p}"`).join('\n\n')}

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
    link.download = `الدرس_${lesson.id}_${details.title.replace(/[\s\/:*?"<>|]+/g, '_')}_المادة_العلمية.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`✓ تم بنجاح تحميل وتوليد المادة العلمية الكاملة لهذا الدرس!\nالملف: [${details.title}]\nتم حفظ المادة على جهازك بصيغة قابلة للمراجعة والتطبيق دون إنترنت.`);
  };

  const triggerRealFileDownload = (fileName: string, fileTitle: string) => {
    let content = "";
    if (fileName === "Commands_Treasury_Arabic.pdf") {
      content = `========================================================================
الخزينة الذهبية لبرينجل للحلول التقنية والذكاء الاصطناعي 🧠
أقوى 150 أمرًا محكمًا للذكاء الاصطناعي وصياغة المناهج ووصفات المنتجات الرقمية والتسويق
========================================================================

هذا الملف الحقيقي المرفق كبونص حصري لبرنامج التمكين والريادة الرقمية الشامل ($147).
مُرخص لك بإعادة الاستخدام والتوزيع لخدمة عملائك وبناء الثقة لزيادة المبيعات.

------------------------------------------------------------------------
الجزء الأول: أوامر هندسة وتوليف أدب الطبخ والمقادير المعيارية الدقيقة
------------------------------------------------------------------------
الأمر 1 (تأسيس القوام والسر الكامن):
"أريد صياغة وصفة دقيقة مبنية على المطبخ الخليجي المعاصر لـ [اسم الطبق] باللغة العربية، موضحاً المكونات الجافة بالغرام والنسب المعيارية بالمل، مع شرح ميكانيكية الطهي خطوة بخطوة وإدراج 'السر الكيميائي الدقيق' الذي يجعل العجينة هشة والقوام متماسكاً تماماً مثل كبار الطهاة."

الأمر 2 (إعداد كراسة العمل المرادفة للمشتري):
"اكتب فصلاً كاملاً لـ [اسم الكتيب] يحتوي على 3 طرق مبتكرة لتنسيق الأطباق العائلية، مع وضع كراسة متبعة بها جدول يومي لحساب السعرات وموازنة المكونات يملؤه القارئ بنفسه، وصغ النصوص برصانة فائقة تدعم المصداقية والموثوقية."

الأمر 3 (هيكلة دليل PLR المعرفي الفاخر):
"أنت المدير الإبداعي لصناعة الكتب المعرفية ببرينجل. صمم هيكلية فصل تمهيدي لكتيب إلكتروني حول [موضوع الكتيب]، يشمل عنواناً مثيراً للاهتمام، ومقدمة واقعية تحث على الالتزام دون ادعاءات الثراء السريع، ثم 3 نقاط تنفيذية فورية."

------------------------------------------------------------------------
الجزء الثاني: أوامر تشييد المتاجر وإعداد صفحات الهبوط الجاذبة
------------------------------------------------------------------------
الأمر 4 (صياغة الهوية والنبرة الصادقة):
"اكتب نص صفحة الهبوط الكامل لمنتجي المعرفي المسمى [اسم المنتج]. أريد عنواناً خاطفاً، رصداً للمشكلة الحقيقية (حضور فوضى المعلومات)، يليه العرض المغري Stack والضمان الحقيقي لتأمين راحة المشتري، والأسئلة الشائعة بنهاية الصفحة."

الأمر 5 (رسائل تسويقية مؤتمتة عبر البريد وساقي المبيعات):
"صغ لي سلسلة من 3 رسائل بريد إلكتروني تسلسلية بمصداقية مطلقة لتهيئة القارئ لشراء [اسم الكتاب الإلكتروني]، تركز الرسالة الأولى على القيمة العلمية الحقيقية، والثانية على كراسة العمل المجانية المضمنة، والثالثة على التخفيض المؤقت لاستيراد التراخيص التجارية."

------------------------------------------------------------------------
الجزء الثالث: أوامر صناعة الفيديوهات العضوية المؤدية ومقاطع الاستقطاب الصامتة
------------------------------------------------------------------------
الأمر 6 (خطط الانتشار ومقاطع التيك توك الصامتة):
"اقترح علي 5 قوالب لتسجيل فيديوهات تيك توك قصيرة صامتة وذات طابع جمالي مهدئ لـ [الموضوع]، اشرح مظهر الكادر (سجل إعداد كوب قهوة أو تقليب أوراق عمل)، واكتب الكوبونات الفورية والخطاف البصري الجاهز ليوضع كشرح على الشاشة."

الأمر 7 (عناوين تريند جاذبة صادقة ومقنعة):
"صمم 10 عناوين خاطفة ومقنعة لإنستغرام ريلز تتناول [المشكلة أو المجال] لكي تجذب العملاء بكثافة إلى رابط Zain Cash في البايو، بعيداً عن الترويج الوهمي والمباهاة الفوقية."

---
تم توليد هذا المنتج بدقة متكاملة من أدوات الذكاء الاصطناعي الراقية لبرينجل للحلول التقنية والذكاء الاصطناعي.
الرواد الصغار ينهضون بالصدق والمصداقية!`;
    } else if (fileName === "Digital_Storefront_Guide.pdf") {
      content = `========================================================================
دليل تشييد المتاجر الرقمية وعمليات التشغيل المتكاملة لبرينجل للرواد 🚀
إعداد وبناء متجر Salla & YouCan والدفع الإلكتروني المؤتمت في 48 ساعة فقط
========================================================================

الدليل التنفيذي المتكامل لغير المبرمجين - مبرمج خصيصًا لطلاب باقة الـ $147.
يتناول بناء متاجركم ومتاجر عملائك من المبتدئين خطوة بخطوة بنجاح مطلق.

------------------------------------------------------------------------
الخطوة الأولى: تهيئة المتجر الرقمي (YouCan / Salla)
------------------------------------------------------------------------
1. التسجيل والترخيص:
   - اذهب لموقع YouCan.shop أو salla.sa وافتح حساباً جديداً باسم براندك المعرفي.
   - اختر خطة المبتدئين الرمزية (YouCan تعتمد عمولة رمزية فقط من الأرباح ولا تحتاج اشتراكاً شهرياً مقدماً، وهي الأفضل للطلبة الصغار).
2. إعداد واجهة المتجر:
   - اختر قالب بيع أحادي المنتج (Single-Product Landing Page Layout).
   - رتب الهيدر والبانر باستخدام الألوان المريحة المستوحاة من الغسق أو الرمادي الفاخر.

------------------------------------------------------------------------
الخطوة الثانية: تكامل Zain Cash وبوابات الدفع المحلية والعالمية
------------------------------------------------------------------------
1. ربط محفظة Zain Cash:
   - سجل حساب محفظة Zain Cash للشركات أو المحفظة الذاتية وتلق رمز Merchant ID & Secret Key من وكيل زين المحلي.
   - في لوحة YouCan > Settings > Payment Gateways > اختر Zain Cash أو Custom Gateway وضع أرقام محفظتك وتحديث المستلمين.
2. تفعيل بوابات الدفع البديلة:
   - لتلقي الأموال بالعملات والبطاقات (Stripe أو YouCan Pay أو التحويلات المصرفية المباشرة).
   - قم بوضع إشعار واضح للعملاء: 'يمكنك التحويل الفوري عبر زين كاش وتلقي رابط تحميل كتاب الوصفات ومقادير الأكلات آلياً بلحظة واحدة!'.

------------------------------------------------------------------------
الخطوة الثالثة: رفع الملف الرقمي وتسليمه التلقائي المؤتمت
------------------------------------------------------------------------
1. إضافة منتج رقمي (Digital Product Setup):
   - اضغط على 'أضف منتج جديد' > المسمى: دليل الكتيب المعرفي الفاخر مع رخصة مريم ناهي.
   - اختر النوع: 'ملف رقمي تنزيل فوري (Digital Download)'.
   - ارفع ملف الـ PDF أو الرابط النهائي للكتيب الموفر من ذكاء برينجل الاصطناعي.
2. ميكانيكية التحويل والتسليم:
   - بمجرد قيام المشتري بالتحويل بنجاح، يقوم النظام تلقائياً بتغيير حالة الطلب إلى 'مكتمل' (Completed).
   - يتلقى العميل بلحظتها بريداً إلكترونياً فورياً يحتوي على زر 'تحميل الملف الرقمي المعتمد'.
   - تتم أرشفة الأرباح بمحفظتك فوراً دون تدخل بشري 24/7!

========================================================================
تم توليد الدليل بالكامل لتمكين الطلاب ورفع ثقة الشراء والمبيعات الحقيقية بمصداقية مطلقة!`;
    } else if (fileName === "Organic_Traffic_Formula.pdf") {
      content = `========================================================================
نظم الانتشار المجاني وتكتيكات الاستقطاب التلقائي للعملاء 📽️
الكتالوج التنفيذي والجدولة لإنتاج الفيديوهات العضوية المؤدية للمبيعات
========================================================================

أنت لا تحتاج إلى رأس مال ضخم للإعلانات!
بهذا الدليل نكشف لك كيف قادت قنوات التيك توك الصامتة مبيعات تفوق مئات الدولارات شهرياً لكتيبات PLR ووصفات الطبخ والمطبوعات.

------------------------------------------------------------------------
مفهوم التسويق الصامت غير الشفهي (Faceless Organic Aesthetic Traffic)
------------------------------------------------------------------------
يبحث الناس في منصات التواصل اليوم عن الهدوء النفسي (Calm Aesthetic). بدلاف من الصراخ الإعلاني والمصلحة الفجّة، سنتبع صيغة:
"إظهار المنفعة وتوثيق طريقة العمل بهدوء وتأصيل المصداقية".

------------------------------------------------------------------------
الجدولة الأسبوعية الـ 30 يوماً للتسويق العضوي الشامل
------------------------------------------------------------------------
الأسبوع الأول: تأسيس الجاذبية وصناعة الهوية البصرية
- اليوم 1: تصميم شعار البراند باستخدام دمج أنيق للألوان الرمادية والحجرية والروز بذكاء بالمنصة.
- اليوم 3: تصوير أول 5 مقاطع فيديو هادئة (مثال: الشيف يعد كوب قهوة خليجية، أو يقلب أطباقاً بخارية في الصباح بوضوح عالٍ).
- اليوم 5: نشر الفيديوهات على تيك توك مع عبارة رصينة واحدة: 'الطبخ ليس مجرد أكل، هو دقة ووصفات معيارية بالغرامات تحترم عقلك وتضمن نجاح الطبق. دليل المبتدئين في البايو'.

الأسبوع الثاني: ترسيخ المصداقية والأمانة المعرفية
- اليوم 8: نشر فيديو يشرح ميكانيكية حساب دقيق لطهي طبق اللحم الفاخر مع إظهار المقادير بالأوزان.
- اليوم 11: وضع كراسة العمل المرادفة للجمهور لملء الوزن بمشاهدتها.
- اليوم 14: كتابة منشور يطرح حلول كبرى الخرافات الشائعة بالطبخ أو التوليف المعرفي.

الأسبوع الثالث والرابع: استقطاب المبيعات والجمهور المستهدف
- اليوم 18: نشر شهادات رضا العملاء وعقد التراخيص التجارية PLR بلباقة.
- اليوم 22: تفعيل زر 'خصم طلاب الخليج اليوم عبر Zain Cash'.
- اليوم 30: الإعلان عن الدفعة الثانية من مساعدة برينجل التقنية والتميز المعرفي.

------------------------------------------------------------------------
قوالب نصوص الفيديو (Video Scripts Templates for Faceless Channels)
------------------------------------------------------------------------
القالب 1:
- المشهد: إضاءة دافئة، يد تقلب صفحات كتيب الطهي الفاخر، ثم تنتقل لشرح مقدار بهارات كبسة اللحم على ميزان رقمي صغير.
- النص على الشاشة: 'السر ليس في الموهبة... السر يكمن في غرامات التوابل والنسب المعيارية الكيميائية. صممت لك الدليل الأصدق ليذهل ضيوفك من أول محاولة. حمله الآن من البايو وسجل المتابعة.'

القالب 2:
- المشهد: قلم يخط على دفتر أوراق وتخطيط مالي رصين لرواد الأعمال، وبجانبه لابتوب مفتوح على صفحة المتجر الرقمي YouCan.
- النص على الشاشة: 'ابتعد عن أحلام الثراء الفهمية. بيع الكتيبات الرقمية يحتاج خطة حقيقية مدتها 30 يوماً لتهيئة بوابات الدفع وزين كاش آلياً. خطوتك الأولى مبرمجة تماماً بضماننا.'

========================================================================
صناعة برينجل للحلول التقنية والذكاء الاصطناعي - طريقك نحو الريادة الشفافة والمبيعات والولاء الحقيقي!`;
    }

    const blob = new Blob([content.trim()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(".pdf", "_Guide.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✓ تم توليد وتنزيل مستندك الحقيقي بنجاح: ${fileTitle}\nالملف جاهز الآن لمراجعته واستعمال مخرجاته الصادقة!`);
  };
  
  const handleSupportSubmit = async () => {
    if (!supportQuery.trim()) {
      alert("الرجاء كتابة سؤالك أو استفسارك أولاً!");
      return;
    }
    const currentQuery = supportQuery;
    setSupportQuery("");
    
    // Add student message to thread
    const newMsg = {
      role: "student" as const,
      text: currentQuery,
      date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    setSupportMessages(prev => [...prev, newMsg]);
    setSupportLoading(true);

    try {
      const mappedHistory = supportMessages.map(msg => ({
        role: msg.role === "student" ? ("user" as const) : ("model" as const),
        text: msg.text
      }));

      const response = await authenticatedFetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `أنت مريم ناهي حسن، خبيرة ومؤلفة الدورة الشاملة للمنتجات الرقمية لبرينجل للحلول التقنية والذكاء الاصطناعي. لقد أرسل لك أحد طلابك الدائمين هذا الاستفسار الهام والملحّ بخصوص تطبيق خطوات الدورة أو اختيار المنتجات والمشاكل وعقبات الدفع والمتابعة. الرجاء تفصيل وتحديد المشكلة والإجابة بدقة ذكاء غير مسبوقة تليق بأفضل مرشد طبيعي، وتقديم متابعة حقيقية وملم بكل تفاصيل ومحتوى وبونصات الدورة. لا تلتزم بإجابة مقتضبة، بل قدم حلولاً علمية وتخطيطات حقيقية للمصاعب.
سؤال الطالب: ${currentQuery}`,
          history: mappedHistory
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل الاتصال بمجلس المتابعة.");
      }

      const coachMsg = {
        role: "coach" as const,
        text: data.reply || "أهلاً بك! لقد تلقيت استشارتك وسعيدة بذكائك الفائق. دعنا نتابع معاً خطوتك التالية في تصميم الدليل بكل مهارة.",
        date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg = {
        role: "coach" as const,
        text: `عذراً شريكي العزيز، يبدو أن هناك ضغط مادي مؤقت على أجهزة الخادم. تأكد من ثبات اتصالك التقني الفوري وسأجيبك بكل حب. الخطأ: ${err.message}`,
        date: "الآن"
      };
      setSupportMessages(prev => [...prev, errMsg]);
    } finally {
      setSupportLoading(false);
    }
  };
  
  // Translator states
  const [transText, setTransText] = useState("");
  const [transLang, setTransLang] = useState("English");
  const [transposing, setTransposing] = useState(false);
  const [translatedResult, setTranslatedResult] = useState("");
  const [transError, setTransError] = useState("");

  // Headline sub-tool states
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPain, setProdPain] = useState("");
  const [headGenLoading, setHeadGenLoading] = useState(false);
  const [headlineResult, setHeadlineResult] = useState("");

  // Roadmap Planner states
  const [rmNiche, setRmNiche] = useState("");
  const [rmDays, setRmDays] = useState("14");
  const [rmFormat, setRmFormat] = useState("دليل PDF مع ورش عمل");
  const [rmPlanning, setRmPlanning] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState("");

  // Content simplifier states
  const [simpleInput, setSimpleInput] = useState("");
  const [simpleStyle, setSimpleStyle] = useState("تبسيط مع نقاط عملية للمبتدئين");
  const [simplifying, setSimplifying] = useState(false);
  const [simplifierResult, setSimplifierResult] = useState("");

  // Ad Copywriter states
  const [copyTopic, setCopyTopic] = useState("");
  const [copyChannel, setCopyChannel] = useState("TikTok Video Script");
  const [copyTone, setCopyTone] = useState("حماسي وتحدي عملي");
  const [copywriting, setCopywriting] = useState(false);
  const [copyResult, setCopyResult] = useState("");

  // Simulation App Layout Language Toggle
  const [simulationLanguage, setSimulationLanguage] = useState<"ar" | "en" | "fr" | "es">("ar");

  // Copy success tooltip states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const triggerCopy = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Safe dynamic API call wrapper
  const callAiTranslator = async () => {
    if (!transText.trim()) {
      setTransError("رجاءً أدخل النص الذي تود ترجمته بالأسفل أولاً.");
      return;
    }
    setTransposing(true);
    setTransError("");
    setTranslatedResult("");

    try {
      const response = await authenticatedFetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transText, targetLanguage: transLang })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل الاتصال بخادم الترجمة الفوري.");
      }
      setTranslatedResult(data.translatedText);
    } catch (err: any) {
      console.error(err);
      setTransError(err.message || "عذراً، فشل الاتصال بالذكاء الاصطناعي لتأكيد الترجمة.");
    } finally {
      setTransposing(false);
    }
  };

  const callAiToolHelper = async (toolId: string) => {
    let inputData = {};
    if (toolId === "headline") {
      if (!prodName) {
        alert("يرجى ملء اسم المنتج الرقمي.");
        return;
      }
      inputData = { productName: prodName, productDescription: prodDesc, painPoint: prodPain };
      setHeadGenLoading(true);
      setHeadlineResult("");
    } else if (toolId === "roadmap") {
      if (!rmNiche) {
        alert("يرجى ملء مجال المنتج (Niche).");
        return;
      }
      inputData = { niche: rmNiche, durationDays: rmDays, formatType: rmFormat };
      setRmPlanning(true);
      setRoadmapResult("");
    } else if (toolId === "summarizer") {
      if (!simpleInput) {
        alert("يرجى لصق محتوى التلخيص.");
        return;
      }
      inputData = { contentToSummarize: simpleInput, style: simpleStyle };
      setSimplifying(true);
      setSimplifierResult("");
    } else if (toolId === "copywriter") {
      if (!copyTopic) {
        alert("يرجى ملء موضوع الإعلان.");
        return;
      }
      inputData = { topic: copyTopic, channel: copyChannel, tone: copyTone };
      setCopywriting(true);
      setCopyResult("");
    } else if (toolId === "funnel_architect") {
      if (!funnelProductName) {
        alert("يرجى ملء اسم المنتج الرقمي لتصميم صفحة الهبوط.");
        return;
      }
      inputData = { productName: funnelProductName, targetUser: funnelTargetUser, pricingType: funnelPricingType };
      setGeneratingFunnel(true);
      setFunnelResult("");
    } else if (toolId === "ebook_architect") {
      if (!ebookTopicField) {
        alert("يرجى ملء موضوع أو عنوان الكتاب الإلكتروني.");
        return;
      }
      inputData = { bookTopic: ebookTopicField, bookTargetParts: ebookChaptersCount, toneStyle: ebookToneStyle };
      setGeneratingEbook(true);
      setEbookOutlineResult("");
    } else if (toolId === "idea_innovator") {
      const activeNiche = innovatorNiche === "أخرى" ? innovatorCustomNiche : innovatorNiche;
      if (!activeNiche) {
        alert("يرجى كتابة أو اختيار المجال المستهدف.");
        return;
      }
      inputData = { niche: activeNiche, timeframe: innovatorTimeframe, style: innovatorStyle };
      setGeneratingInnovator(true);
      setInnovatorResult("");
    } else if (toolId === "product_generator") {
      if (!generatorTopic) {
        alert("يرجى كتابة موضوع أو عنوان الملف للمنتج الرقمي المتكامل.");
        return;
      }
      inputData = { topic: generatorTopic, type: generatorType, credibility: generatorCredibility };
      setGeneratingProduct(true);
      setProductGeneratorResult("");
    } else if (toolId === "course_materializer") {
      if (!courseSecretArea) {
        alert("يرجى كتابة أو اختيار سر ربحي خفي لتفصيله.");
        return;
      }
      inputData = { secretArea: courseSecretArea, targetOutput: courseTargetOutput };
      setGeneratingCourseSecret(true);
      setCourseSecretResult("");
    } else if (toolId === "course_roadmap_planner") {
      if (!coursePlannedNiche) {
        alert("يرجى تحديد المجال المستهدف.");
        return;
      }
      inputData = { niche: coursePlannedNiche, dailyHours: courseDailyHours, goalUrl: courseGoalUrl };
      setGeneratingCoursePlan(true);
      setCoursePlanResult("");
    } else if (toolId === "course_product_generator") {
      if (!courseProductTopic) {
        alert("يرجى كتابة موضوع أو عنوان المنتج المستهدف.");
        return;
      }
      inputData = { topic: courseProductTopic, type: courseProductType };
      setGeneratingCourseProduct(true);
      setCourseProductResult("");
    }

    try {
      const response = await authenticatedFetch("/api/ai-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, inputData })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل توليد نصوص الذكاء الاصطناعي.");
      }

      if (toolId === "headline") setHeadlineResult(data.aiOutput);
      else if (toolId === "roadmap") setRoadmapResult(data.aiOutput);
      else if (toolId === "summarizer") setSimplifierResult(data.aiOutput);
      else if (toolId === "copywriter") setCopyResult(data.aiOutput);
      else if (toolId === "funnel_architect") setFunnelResult(data.aiOutput);
      else if (toolId === "ebook_architect") setEbookOutlineResult(data.aiOutput);
      else if (toolId === "idea_innovator") setInnovatorResult(data.aiOutput);
      else if (toolId === "product_generator") setProductGeneratorResult(data.aiOutput);
      else if (toolId === "course_materializer") setCourseSecretResult(data.aiOutput);
      else if (toolId === "course_roadmap_planner") setCoursePlanResult(data.aiOutput);
      else if (toolId === "course_product_generator") setCourseProductResult(data.aiOutput);
    } catch (err: any) {
      alert(err.message || "حدث خطأ غير متوقع بطلب المعين الذكي.");
    } finally {
      setHeadGenLoading(false);
      setRmPlanning(false);
      setSimplifying(false);
      setCopywriting(false);
      setGeneratingFunnel(false);
      setGeneratingEbook(false);
      setGeneratingInnovator(false);
      setGeneratingProduct(false);
      setGeneratingCourseSecret(false);
      setGeneratingCoursePlan(false);
      setGeneratingCourseProduct(false);
    }
  };


  // --- TAB 3: AUDIENCE & TRAFFIC TRACKER SIMULATION ---
  // We keep a rolling live feed of simulated customer activities!
  const [liveEvents, setLiveEvents] = useState<Array<{ id: number; text: string; time: string; color: string }>>([
    { id: 1, text: "زائر جديد متفاعل من الرياض تصفح صفحة بونص 2 (25 فكرة)", time: "منذ دقيقة", color: "indigo" },
    { id: 2, text: "قام مروان بنسخ أوامر ChatGPT للتسويق لكتاب الطبخ", time: "منذ 4 دقائق", color: "amber" },
    { id: 3, text: "أحمد العتيبي أكمل كراسة تخطيط الوعد وصدر النسخة", time: "منذ 9 دقائق", color: "emerald" },
    { id: 4, text: "زائرة من الإمارات نقرت رابط Canva الترويجي لبدء التصميم", time: "منذ 15 دقيقة", color: "pink" },
    { id: 5, text: "تلقيت تصفحاً لصفحة البيع من عميل مهتم في مسقط", time: "منذ 24 دقيقة", color: "violet" }
  ]);

  useEffect(() => {
    // Periodically insert random actions to simulate a viral live traffic analytics dashboard
    const arabicNames = ["خالد", "ليلى", "فاطمة", "عبد الله", "ياسمين", "سارة", "صالح", "إبراهيم", "رنا", "رائد"];
    const locations = ["جدة", "دبي", "المنامة", "الكويت", "الدوحة", "عمان", "القاهرة", "الرباط", "تونس", "بغداد"];
    const actions = [
      "أكمل بنجاح اليوم الخامس من تحدي الـ 12 يوماً 🗓️",
      "نقرت على رابط التسجيل الترويجي في متجر Gumroad 🔗",
      "حملت قالب دراسة جدوى المشروع كملف Excel 📋",
      "قامت بتوليد 15 سيناريو تيك توك باستخدام صانع المحتوى الذكي 🤖",
      "أرسلت رابط صفحة البيع المعدة عبر تطبيق WhatsApp التجريبي 📲",
      "قامت بتجربة محاكي بوابات الدفع واشترت الباقة الفضية 💳"
    ];
    const colors = ["emerald", "indigo", "amber", "blue", "pink", "violet", "cyan"];

    const interval = setInterval(() => {
      const name = arabicNames[Math.floor(Math.random() * arabicNames.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const act = actions[Math.floor(Math.random() * actions.length)];
      const col = colors[Math.floor(Math.random() * colors.length)];
      
      const newEvent = {
        id: Date.now(),
        text: `${name} من ${loc} ${act}`,
        time: "الآن",
        color: col
      };

      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Compute stats based on the interactive guide data filled by the active user
  const calculateTotalAnswersFilled = () => {
    let filled = 0;
    if (answers.u1Problem) filled++;
    if (answers.u1Customer) filled++;
    if (answers.u1Solution) filled++;
    if (answers.u1Format) filled++;
    if (answers.u1Check1) filled++;
    if (answers.u1Check2) filled++;
    if (answers.u2SelectedIdea) filled++;
    if (answers.u2ReadyToSell) filled++;
    if (answers.u3StorePlatform) filled++;
    if (answers.u3ProductName) filled++;
    if (answers.u3ProductPrice) filled++;
    if (answers.u4MarketingPosts) filled++;
    if (answers.u5BrandName) filled++;
    if (answers.u5ThankYouMessage) filled++;
    return filled;
  };

  const workbookFilledAnswers = calculateTotalAnswersFilled();
  const totalAffiliateClicks = (Object.values(clickCounts) as number[]).reduce((a, b) => a + b, 0);


  // --- TAB 4: MOCK PAYMENT GATEWAYS SANDBOX STATES ---
  const [tierBronzePrice, setTierBronzePrice] = useState("19");
  const [tierSilverPrice, setTierSilverPrice] = useState("39");
  const [tierGoldPrice, setTierGoldPrice] = useState("79");

  // PayPal Global Gateway State
  const [paypalClientId, setPaypalClientId] = useState(() => localStorage.getItem("paypal_client_id") || "pay_sandbox_client_id_7749826359");
  const [paypalSecretKey, setPaypalSecretKey] = useState("");
  const [paypalEnv, setPaypalEnv] = useState<"sandbox" | "live">(() => (localStorage.getItem("paypal_env") as any) || "sandbox");
  const [paypalSaveSuccess, setPaypalSaveSuccess] = useState(false);
  const [paypalSaving, setPaypalSaving] = useState(false);

  // Mastercard Integration States
  const [mcCardMerchantId, setMcCardMerchantId] = useState(() => localStorage.getItem("mc_merchant_id") || "merch_mc_intl_88204");
  const [mcCardPublicKey, setMcCardPublicKey] = useState(() => localStorage.getItem("mc_public_key") || "pk_live_mc_8492048596");
  const [mcCardSecretKey, setMcCardSecretKey] = useState("");
  const [mcCardEnv, setMcCardEnv] = useState<"sandbox" | "live">(() => (localStorage.getItem("mc_env") as any) || "live");
  const [mcCardSaveSuccess, setMcCardSaveSuccess] = useState(false);
  const [mcCardSaving, setMcCardSaving] = useState(false);

  // Zain Cash Integration States
  const [zainMSISDN, setZainMSISDN] = useState(() => localStorage.getItem("zain_msisdn") || "9647700000000");
  const [zainSecretKey, setZainSecretKey] = useState("");
  const [zainMerchantPIN, setZainMerchantPIN] = useState("");
  const [zainEnv, setZainEnv] = useState<"sandbox" | "live">(() => (localStorage.getItem("zain_env") as any) || "sandbox");
  const [zainSaveSuccess, setZainSaveSuccess] = useState(false);
  const [zainSaving, setZainSaving] = useState(false);

  // Cryptocurrencies States
  const [cryptoUSDTAddress, setCryptoUSDTAddress] = useState(() => localStorage.getItem("crypto_usdt_address") || "TY2k8VpBsE982nSkmf298saKbBfX87W6sa");
  const [cryptoBtcAddress, setCryptoBtcAddress] = useState(() => localStorage.getItem("crypto_btc_address") || "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
  const [cryptoNetworkCheck, setCryptoNetworkCheck] = useState(() => localStorage.getItem("crypto_network_check") || "automatic");
  const [cryptoSaveSuccess, setCryptoSaveSuccess] = useState(false);
  const [cryptoSaving, setCryptoSaving] = useState(false);

  // AI Automated Inactivity Reminder State
  const [inactivityDays, setInactivityDays] = useState("3");
  const [motivationEmailSubject, setMotivationEmailSubject] = useState("هل تعثرتِ يا مريم؟ إليك مفتاح التخطي السريع اليوم 🧠⚡");
  const [motivationEmailBody, setMotivationEmailBody] = useState(`عزيزتي مريم ناهي،

لاحظنا في محراب المنصة توقفك المؤقت عند الوحدة الرابعة في صياغة منتجك الرقمي المذهل. ندرك تماماً أن العقبة الذهنية قد تظهر فجأة، ولكن تذكري: الجمهور بحاجة لحلك العملي الآن!

إليك وصفة سريعة للتحفيز والعودة الفعالة:
1. صممي 3 صفحات مسودة فقط للبداية (لا تسعي للكمال!).
2. ادخلي إلى ميزة مولد السكريبتات فوراً لتقومي بإنشاء نصوص تيك توك الترويجية بضغطة واحدة، سيعطيكِ ذلك طاقة تشغيلية ممتازة!
3. شاهدي لوحة الإنجازات بالأسفل - عشرات الزملاء يطلقون ويبيعون خدماتهم الآن، وأنتِ لستِ بأقل منهم شغفاً!

ننتظر عودتك الشجاعة لإكمال التحدي اليوم!
— مرشدك التفاعلي بالذكاء الفوقي 🌟`);
  const [emailCampaignStatus, setEmailCampaignStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [isReminderSchedulerActive, setIsReminderSchedulerActive] = useState(true);

  // SuperAdmin User accounts list & Complete Authority Panel state
  const [simulatedUsers, setSimulatedUsers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("digital_guide_simulated_users_v1");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, name: "مريم ناهي حسن", email: "marimp0o9i8@gmail.com", role: "مؤلفة الدليل والمؤسسة 👑", progress: "92%", status: "نشط", tier: "VIP Gold" },
      { id: 2, name: "علاء جاسم حمزة", email: "alaa.jassim@gmail.com", role: "طالب منجز 🚀", progress: "85%", status: "نشط", tier: "Silver" },
      { id: 3, name: "سارة قتيبة الملا", email: "sara.q@outlook.com", role: "طالبة مبادرة 📝", progress: "30%", status: "نشط", tier: "Bronze" },
      { id: 4, name: "أحمد بن عبد الله العتيبي", email: "ahmed.otb@gmail.com", role: "طالب منجز 🚀", progress: "70%", status: "نشط", tier: "Silver" },
      { id: 5, name: "ريما الشمري", email: "reema.sh@gmail.com", role: "طالبة متوقفة ⏳", progress: "15%", status: "مجمّد", tier: "Bronze" }
    ];
  });

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserTier, setNewUserTier] = useState<"Bronze" | "Silver" | "Gold">("Silver");
  const [newUserProgress, setNewUserProgress] = useState("10%");

  // SuperAdmin Platform variables
  const [forcePreCheckoutMode, setForcePreCheckoutMode] = useState(() => {
    return localStorage.getItem("admin_force_checkout") === "true";
  });
  const [enableStudentAiWorkspace, setEnableStudentAiWorkspace] = useState(() => {
    return localStorage.getItem("admin_ai_workspace") !== "false";
  });
  const [globalDiscountPercentage, setGlobalDiscountPercentage] = useState("0");
  const [adminPlatformStatus, setAdminPlatformStatus] = useState("نشط ومستقر (Live & Active)");
  const [userNotificationMsg, setUserNotificationMsg] = useState("مرحباً بكِ في محراب إطلاق المنتجات الرقمية والتحدي الكوني! 📚✨");

  useEffect(() => {
    try {
      localStorage.setItem("digital_guide_simulated_users_v1", JSON.stringify(simulatedUsers));
    } catch {}
  }, [simulatedUsers]);

  useEffect(() => {
    localStorage.setItem("admin_force_checkout", String(forcePreCheckoutMode));
  }, [forcePreCheckoutMode]);

  useEffect(() => {
    localStorage.setItem("admin_ai_workspace", String(enableStudentAiWorkspace));
  }, [enableStudentAiWorkspace]);

  // Selection for checkout simulation
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutSelectedTier, setCheckoutSelectedTier] = useState<"Bronze" | "Silver" | "Gold" | "Course">("Silver");
  const [checkoutCardName, setCheckoutCardName] = useState("");
  const [checkoutCardNumber, setCheckoutCardNumber] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutGatewayType, setCheckoutGatewayType] = useState<"card" | "zain" | "crypto">("card");
  const [checkoutZainPhone, setCheckoutZainPhone] = useState("");
  const [checkoutCryptoTx, setCheckoutCryptoTx] = useState("");

  const launchPaymentCheckout = (tier: "Bronze" | "Silver" | "Gold" | "Course") => {
    setCheckoutSelectedTier(tier);
    setCheckoutModalOpen(true);
    setCheckoutSuccess(false);
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail) {
      alert("الرجاء إدخال البريد الإلكتروني لتسليمه الملف الرقمي للمحاكاة.");
      return;
    }
    if (checkoutGatewayType === "card" && !checkoutCardNumber) {
      alert("الرجاء إدخال رقم بطاقة الماستر كارد للمحاكاة.");
      return;
    }
    if (checkoutGatewayType === "zain" && !checkoutZainPhone) {
      alert("الرجاء إدخال رقم محفظة زين كاش للمحاكاة.");
      return;
    }
    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutSuccess(true);
      
      // Save simulated order under real metrics
      setPageViews(prev => prev + 1);
      
      // Define channel arabic text
      const channelLabel = checkoutGatewayType === "card" 
        ? "بطاقة ماستر كارد" 
        : checkoutGatewayType === "zain" 
        ? "زين كاش" 
        : "العملات الرقمية";

      // Append a custom live track action
      let selectedTierName = "";
      let selectedTierPrice = "";
      if (checkoutSelectedTier === "Bronze") {
        selectedTierName = "البرونزية";
        selectedTierPrice = tierBronzePrice;
      } else if (checkoutSelectedTier === "Silver") {
        selectedTierName = "الفضية";
        selectedTierPrice = tierSilverPrice;
      } else if (checkoutSelectedTier === "Gold") {
        selectedTierName = "الذهبية";
        selectedTierPrice = tierGoldPrice;
      } else {
        selectedTierName = "الدورة العملية المتكاملة";
        selectedTierPrice = tierCoursePrice;
      }

      const newSimulatedSale = {
        id: Date.now(),
        text: `💰 مبيعة حقيقية! قام العميل بالدفع لـ [الباقة ${selectedTierName}] بمبلغ ${selectedTierPrice}$ عبر [${channelLabel}] بنجاح وتلقائي آلي.`,
        time: "الآن",
        color: "emerald"
      };
      setLiveEvents(prev => [newSimulatedSale, ...prev]);

    }, 2000);
  };

  const handleSavePaypalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalSaving(true);
    localStorage.setItem("paypal_client_id", paypalClientId);
    // Secret keys must be held and processed server-side, never persisted in browser storage.
    localStorage.setItem("paypal_env", paypalEnv);
    setTimeout(() => {
      setPaypalSaving(false);
      setPaypalSaveSuccess(true);
      setTimeout(() => setPaypalSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSaveMcCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setMcCardSaving(true);
    localStorage.setItem("mc_merchant_id", mcCardMerchantId);
    localStorage.setItem("mc_public_key", mcCardPublicKey);
    // Secret keys must be held and processed server-side, never persisted in browser storage.
    localStorage.setItem("mc_env", mcCardEnv);
    setTimeout(() => {
      setMcCardSaving(false);
      setMcCardSaveSuccess(true);
      setTimeout(() => setMcCardSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSaveZainConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setZainSaving(true);
    localStorage.setItem("zain_msisdn", zainMSISDN);
    // Secret keys must be held and processed server-side, never persisted in browser storage.
    // Secret keys must be held and processed server-side, never persisted in browser storage.
    localStorage.setItem("zain_env", zainEnv);
    setTimeout(() => {
      setZainSaving(false);
      setZainSaveSuccess(true);
      setTimeout(() => setZainSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSaveCryptoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCryptoSaving(true);
    localStorage.setItem("crypto_usdt_address", cryptoUSDTAddress);
    localStorage.setItem("crypto_btc_address", cryptoBtcAddress);
    localStorage.setItem("crypto_network_check", cryptoNetworkCheck);
    setTimeout(() => {
      setCryptoSaving(false);
      setCryptoSaveSuccess(true);
      setTimeout(() => setCryptoSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleTriggerEmailCampaign = () => {
    setEmailCampaignStatus("sending");
    setTimeout(() => {
      setEmailCampaignStatus("sent");
      
      // Add simulated activity log event
      const newLiveEvent = {
        id: Date.now(),
        text: `✉️ أطلق الذكاء رادار التذكير والمتابعة بالبريد! أرسل تذكيراً تلقائياً لجميع المشتركين المتوقفين منذ ${inactivityDays} أيام.`,
        time: "الآن",
        color: "amber"
      };
      setLiveEvents(prev => [newLiveEvent, ...prev]);
    }, 1500);
  };


  // Language Translation mapping file dictionary
  const TRANSLATIONS_DICTIONARY = {
    ar: {
      title: "لوحة التحكم والإدارة الفوقية",
      subtitle: "إدارة متكاملة لروابط الإفلييت، وأدوات الذكاء الاصطناعي، وتحليلات الجمهور، واستقبال بوابات الدفع ومستلمات البيع",
      view_guide: "دراسة الدليل",
      visitors: "رؤية الزوار",
      total_visits: "مشاهدات المنصة الكلية",
      workbook_done: "كراسة العمل المنجزة",
      total_actions: "مجموع الكبسات الترويجية",
      active_challenge: "تحدي الـ 12 يوماً حالياً"
    },
    en: {
      title: "Comprehensive Admin & AI Hub",
      subtitle: "Manage all affiliate marketing links, free AI generation engines, visitor tracking analytics, and modern checkout gateways",
      view_guide: "View Book Guide",
      visitors: "Live Visitors",
      total_visits: "Total Platform Pageviews",
      workbook_done: "Completed Worksheets",
      total_actions: "Affiliate Click Count",
      active_challenge: "Active Days Challenges"
    },
    fr: {
      title: "Suite Administrative & IA Universelle",
      subtitle: "Gérez tous les liens d'affiliation, les moteurs d'IA gratuits, le suivi des visiteurs et les passerelles de paiement",
      view_guide: "Consulter le Guide",
      visitors: "Visiteurs en direct",
      total_visits: "Total des pages vues",
      workbook_done: "Cahier d'exercices rempli",
      total_actions: "Clics d'affiliation totaux",
      active_challenge: "Défi d'activité 12 Jours"
    },
    es: {
      title: "Panel de Control y Suite de IA",
      subtitle: "Gestión unificada de enlaces de afiliación, herramientas de IA gratuitas, analíticas de audiencia y pasarelas de pago",
      view_guide: "Leer Guía Completa",
      visitors: "Visitantes en vivo",
      total_visits: "Vistas de Página Totales",
      workbook_done: "Hojas de Trabajo Listas",
      total_actions: "Total de Clics de Enlaces",
      active_challenge: "Reto Diario de 12 Días"
    }
  };

  const currentLabels = TRANSLATIONS_DICTIONARY[simulationLanguage];

  return (
    <div className="space-y-6">
      
      {/* Dynamic Simulation Language Floating Info Indicator */}
      <div className="bg-[#0b1d33] border-b-4 border-[#f2a900] text-white p-5 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#f2a900]/10 text-[#f2a900] px-3 py-1 rounded-full text-xs font-bold border border-[#f2a900]/20 mb-2.5">
              <Languages className="w-3.5 h-3.5" />
              <span>أداة الترجمة الفوقية ولغات العالم 🌍</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">{currentLabels.title}</h2>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              {currentLabels.subtitle}
            </p>
          </div>

          {/* Real Language simulator buttons */}
          <div className="flex flex-col xs:flex-row gap-2 bg-slate-900/45 p-1.5 rounded-xl border border-slate-800 select-none">
            <span className="text-[10px] text-slate-400 font-bold px-2 py-1 flex items-center gap-1">🌐 محاكاة لغة المنصة:</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setSimulationLanguage("ar")}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${simulationLanguage === 'ar' ? 'bg-[#f2a900] text-[#0b1d33]' : 'text-slate-300 hover:text-white'}`}
              >
                العربية
              </button>
              <button 
                onClick={() => setSimulationLanguage("en")}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${simulationLanguage === 'en' ? 'bg-[#f2a900] text-[#0b1d33]' : 'text-slate-300 hover:text-white'}`}
              >
                English
              </button>
              <button 
                onClick={() => setSimulationLanguage("fr")}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${simulationLanguage === 'fr' ? 'bg-[#f2a900] text-[#0b1d33]' : 'text-slate-300 hover:text-white'}`}
              >
                Français
              </button>
              <button 
                onClick={() => setSimulationLanguage("es")}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-colors cursor-pointer ${simulationLanguage === 'es' ? 'bg-[#f2a900] text-[#0b1d33]' : 'text-slate-300 hover:text-white'}`}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Buttons Routing */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl select-none overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("ai_tools")}
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "ai_tools"
              ? "bg-[#0b1d33] text-[#f2a900] shadow-md"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الأدوات والترجمة بالذكاء الاصطناعي</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_tools")} disabled title="غير مفعّل: لا تتوفر بيانات حقيقية أو تكامل مثبت بعد"
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "affiliate"
              ? "bg-[#0b1d33] text-[#f2a900] shadow-md"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>الروابط التسويقية (Affiliate)</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_tools")} disabled title="غير مفعّل: لا تتوفر بيانات حقيقية أو تكامل مثبت بعد"
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "analytics"
              ? "bg-[#0b1d33] text-[#f2a900] shadow-md"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>تتبع وتحليلات الجمهور</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_tools")} disabled title="غير مفعّل: لا تتوفر بيانات حقيقية أو تكامل مثبت بعد"
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "payments"
              ? "bg-[#0b1d33] text-[#f2a900] shadow-md"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>إعداد بوابات وطرق الدفع</span>
        </button>

        <button
          onClick={() => setActiveTab("digital_course")}
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "digital_course"
              ? "bg-[#0b1d33] text-[#f43f5e] shadow-md border-b-2 border-[#f43f5e]"
              : "text-slate-700 hover:bg-slate-200 hover:text-slate-900 bg-rose-50/60"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>الدورة العملية المتكاملة 🎓</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_tools")} disabled title="غير مفعّل: لا تتوفر بيانات حقيقية أو تكامل مثبت بعد"
          className={`flex-1 text-center py-3.5 px-4 text-xs font-black rounded-xl transition duration-200 cursor-pointer min-w-[130px] flex items-center justify-center gap-2 ${
            activeTab === "users_admin"
              ? "bg-[#0b1d33] text-[#f2a900] shadow-md"
              : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة الأعضاء والصلاحيات الفوقية</span>
        </button>
      </div>

      {/* TAB 1 CONTENT: FREE AI TOOLS AND TRANSLATION WORKSPACE */}
      {activeTab === "ai_tools" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Quick sidebar widgets trigger */}
          <div className="lg:col-span-1 space-y-2 select-none">
            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider pl-1 mb-2 block">
              قائمة المساعدين المجانية
            </span>

            <button
              onClick={() => setSelectedAiTool("translator")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "translator"
                  ? "bg-[#0b1d33] text-white border-[#0b1d33] shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>🌐 مترجم جميناي الفوقي (Accuracy 100%)</span>
              <Languages className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setSelectedAiTool("headline")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "headline"
                  ? "bg-[#0b1d33] text-white border-[#0b1d33] shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>🔥 صانع العناوين والوعود المغناطيسية</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setSelectedAiTool("roadmap")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "roadmap"
                  ? "bg-[#0b1d33] text-white border-[#0b1d33] shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>🗓️ خطة المنتجات والمسار الزمني</span>
              <Calendar className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setSelectedAiTool("simplifier")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "simplifier"
                  ? "bg-[#0b1d33] text-white border-[#0b1d33] shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>📝 مبسط ومعرّب الأوراق للمبتدئين</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setSelectedAiTool("ads")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "ads"
                  ? "bg-[#0b1d33] text-white border-[#0b1d33] shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>🎬 كاتب إعلانات السوشيال ميديا</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </button>

            <span className="text-[10px] text-slate-400 font-extrabold tracking-wider pl-1 pt-3 mb-1.5 block border-t border-slate-100">
              🎁 هدايا ومحفّزات المشتركين الحصرية (VIP)
            </span>

            <button
              onClick={() => setSelectedAiTool("funnel_architect")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "funnel_architect"
                  ? "bg-amber-500 text-[#0b1d33] font-black border-amber-500 shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="flex flex-col text-right">
                <span className="font-extrabold">🚀 مصمم هيكل الهبوط والصفحات</span>
                {giftSubscribersTools.includes("funnel_architect") ? (
                  <span className="text-[9px] text-[#0b1d33]/80 font-bold block">🎁 هدية مقتصرة للمشتركين الجدد</span>
                ) : (
                  <span className="text-[9px] text-slate-400 block">✓ متاحة للمجال العام</span>
                )}
              </div>
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            </button>

            <button
              onClick={() => setSelectedAiTool("ebook_architect")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "ebook_architect"
                  ? "bg-amber-500 text-[#0b1d33] font-black border-amber-500 shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="flex flex-col text-right">
                <span className="font-extrabold">📓 كاتب خطط فصول الكتيبات</span>
                {giftSubscribersTools.includes("ebook_architect") ? (
                  <span className="text-[9px] text-[#0b1d33]/80 font-bold block">🎁 هدية حصرية للمنتسبين</span>
                ) : (
                  <span className="text-[9px] text-slate-400 block">✓ متاحة للمجال العام</span>
                )}
              </div>
              <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            </button>

            <button
              onClick={() => setSelectedAiTool("idea_innovator")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "idea_innovator"
                  ? "bg-amber-500 text-[#0b1d33] font-black border-amber-500 shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="flex flex-col text-right">
                <span className="font-extrabold">💡 مبتكر أفكار المنتجات الحديثة</span>
                {giftSubscribersTools.includes("idea_innovator") ? (
                  <span className="text-[9px] text-[#0b1d33]/80 font-bold block">🎁 هدية حصرية مدمجة</span>
                ) : (
                  <span className="text-[9px] text-slate-400 block">✓ متاحة للمجال العام</span>
                )}
              </div>
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
            </button>

            <button
              onClick={() => setSelectedAiTool("product_generator")}
              className={`text-right w-full p-4 rounded-xl border text-xs font-bold transition duration-150 cursor-pointer flex items-center justify-between ${
                selectedAiTool === "product_generator"
                  ? "bg-amber-500 text-[#0b1d33] font-black border-amber-500 shadow"
                  : "bg-white border-slate-100 text-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="flex flex-col text-right">
                <span className="font-extrabold">📦 صانع المنتجات الجاهزة للبيع</span>
                {giftSubscribersTools.includes("product_generator") ? (
                  <span className="text-[9px] text-[#0b1d33]/80 font-bold block">🎁 هدية حصرية للتحميل</span>
                ) : (
                  <span className="text-[9px] text-slate-400 block">✓ متاحة للمجال العام</span>
                )}
              </div>
              <Layers className="w-4 h-4 text-amber-600 shrink-0" />
            </button>
          </div>

          {/* Active Workspace Container */}
          <div className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            
            {/* 1. Universal translator block representation */}
            {selectedAiTool === "translator" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🌐 مترجم جيميناي فائق الدقة لأي لغة بالعالم</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    انسخ أي قسم من الدليل أو الكراسة، والصقه بالأسفل ليقوم نموذج Gemini بترجمته ترجمة بشرية مبدعة دقيقة ومطابقة لكل لغات العالم!
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-600 text-xs font-bold block">الصق النص المراد ترجمته هنا:</label>
                  <textarea
                    rows={5}
                    placeholder="اكتب أو الصق نصوص أفكارك، أوراق عملك، فصول الدليل الـ 33، أو أي نص تريده هنا..."
                    value={transText}
                    onChange={(e) => setTransText(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3.5 border border-slate-200 rounded-xl focus:border-[#0b1d33] focus:ring-1 focus:ring-[#0b1d33] outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-xs text-slate-600 font-bold font-sans">اختر لغة الإخراج والترجمة الدقيقة:</span>
                    <select
                      value={transLang}
                      onChange={(e) => setTransLang(e.target.value)}
                      className="bg-white border font-semibold text-xs py-1.5 px-3 rounded-lg outline-none cursor-pointer focus:border-[#0b1d33]"
                    >
                      <option value="English">الانجليزية (English)</option>
                      <option value="French">الفرنسية (Français)</option>
                      <option value="Spanish">الإسبانية (Español)</option>
                      <option value="Turkish">التركية (Türkçe)</option>
                      <option value="German">الألمانية (Deutsch)</option>
                      <option value="Urdu">الأوردو (اردو)</option>
                      <option value="Chinese">الصينية (中文)</option>
                      <option value="Japanese">اليابانية (日本語)</option>
                      <option value="Russian">الروسية (Русский)</option>
                      <option value="Italian">الإيطالية (Italiano)</option>
                    </select>
                  </div>

                  <button
                    onClick={callAiTranslator}
                    disabled={transposing}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#f2a900] text-[#0b1d33] font-black rounded-lg text-xs transition select-none flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-[#d69600]"
                  >
                    {transposing ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#0b1d33] rounded-full w-3.5 h-3.5" />
                        <span>يجري صهر النص وترجمته بـ Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Languages className="w-3.5 h-3.5" />
                        <span>ترجم الآن بدقة فائقة ✨</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error handling */}
                {transError && (
                  <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 flex items-center gap-2 font-semibold">
                    <span>⚠️</span>
                    <p>{transError}</p>
                  </div>
                )}

                {/* Result Block */}
                {translatedResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">💎 الترجمة الاحترافية المطابقة من Gemini:</span>
                      <button
                        onClick={() => triggerCopy(translatedResult, "translator")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer hover:bg-slate-50"
                      >
                        {copiedSection === "translator" ? (
                          <>
                            <Check className="w-3" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3" />
                            <span>نسخ الكسوة المترجمة</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-left bg-white p-4 rounded-xl border">
                      {translatedResult}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Headline Generator Block */}
            {selectedAiTool === "headline" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🔥 صانع العناوين والوعود البيعية المغناطيسية بالذكاء الاصطناعي</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    أول قاعدة بالإنتاج الرقمي: العنوان الممتاز يبع مسبقاً! اكتب اسم منتجك وفكرته ليصنع لك محرك الذكاء عناوين تخطف انتباه الزبون.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">اسم المنتج الرقمي أو فكرته:</label>
                    <input
                      type="text"
                      placeholder="مثال: الدليل الشامل لخيارات تيك توك"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">الغصة والوجع الأساسي للمشتري (Pain Point):</label>
                    <input
                      type="text"
                      placeholder="مثال: القلق من المماطلة وتأخر المبيعات الأولى"
                      value={prodPain}
                      onChange={(e) => setProdPain(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">وصف مختصر لما يجده بداخل هذا المنتج:</label>
                    <textarea
                      rows={2}
                      placeholder="اكتب شرحاً بسيطاً لمنتجك الرقمي (مثال: كراسة وقوالب Canva جاهزة لإنتاج الفيديوهات وتصدر التريند)"
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("headline")}
                    disabled={headGenLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {headGenLoading ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري توليد العناوين النارية...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>ولد العناوين الترويجية والفرعية</span>
                      </>
                    )}
                  </button>
                </div>

                {headlineResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">🔥 العناوين والوعود المصنوعة بذكاء جميناي:</span>
                      <button
                        onClick={() => triggerCopy(headlineResult, "headline")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "headline" ? "تم نسخها!" : "نسخ العناوين المجهزة"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border leading-relaxed text-right md:text-right">
                      {headlineResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 3. Roadmap Planner block */}
            {selectedAiTool === "roadmap" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🗓️ مخطط المسار الزمني للمنتج الرقمي (AI Roadmap Builder)</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    تريد تجزئة فكرتك لخطط وخطوات يومية مرتبة؟ أدخل المجال وفترة الإنفاد وسيهندس لك المعين الذكي خطة عمل فورية.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">مجال العمل (Niche):</label>
                    <input
                      type="text"
                      placeholder="مثال: التصميم بالذكاء الاصطناعي، الطبخ، تنمية الشغف"
                      value={rmNiche}
                      onChange={(e) => setRmNiche(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">مجموع أيام الإطلاق المفضل:</label>
                    <select
                      value={rmDays}
                      onChange={(e) => setRmDays(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="7">7 أيام (شديد السرعة)</option>
                      <option value="12">12 يوماً (التحدي المعتمد)</option>
                      <option value="14">14 يوماً (نموذج مريم الذهبي)</option>
                      <option value="30">30 يوماً (للمشاريع الكبيرة المعمقة)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">صيغة ونوع الملف المعني:</label>
                    <input
                      type="text"
                      placeholder="مثال: كتيب تفاعلي PDF، قوالب ومخططات جاهزة"
                      value={rmFormat}
                      onChange={(e) => setRmFormat(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("roadmap")}
                    disabled={rmPlanning}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {rmPlanning ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري رسم خريطة الطريق الذهبية...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>ولد جدول وخرائط العمل المطلوبة</span>
                      </>
                    )}
                  </button>
                </div>

                {roadmapResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">🗓️ مخطط المسار الزمني لبرنامج الإطلاق:</span>
                      <button
                        onClick={() => triggerCopy(roadmapResult, "roadmap")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "roadmap" ? "تم نسخه!" : "نسخ الجدول الزمن كامل"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border leading-relaxed text-right md:text-right">
                      {roadmapResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 4. Content simplifier content */}
            {selectedAiTool === "simplifier" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">📝 مبسط ومعرّب المحتوى ومزيلات التعقيد الرقمي</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    عثرت على مادة معقدة أو نص طويل وتريد صياغته كأساس لدليلك؟ الصق النصوص المبعثرة وسهّلها فوراً بشكل مبسط يفهمه أي عميل مبتدئ.
                  </p>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-slate-600 text-xs font-bold block">النص أو القالب المبعثر المراد تبسيطه:</label>
                  <textarea
                    rows={4}
                    placeholder="الصق نصوص مسودتك المبدأية الكثيفة، أو أي مرجع خارجي ومقالات باللغة العربية أو الإنجليزية لتنظيفها وتعريبها..."
                    value={simpleInput}
                    onChange={(e) => setSimpleInput(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 select-none w-full sm:w-auto">
                    <span className="text-xs text-slate-500 font-bold whitespace-nowrap">الأسلوب المفضل:</span>
                    <input
                      type="text"
                      value={simpleStyle}
                      onChange={(e) => setSimpleStyle(e.target.value)}
                      className="bg-white border text-xs py-1.5 px-3 rounded-lg outline-none w-full sm:w-64 font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => callAiToolHelper("summarizer")}
                    disabled={simplifying}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0b1d33] text-[#f2a900] font-black rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {simplifying ? "تبسيط النص جارٍ..." : "ولد النسخة الأبسط"}
                  </button>
                </div>

                {simplifierResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">📝 النسخة المصنعة البسيطة والعملية:</span>
                      <button
                        onClick={() => triggerCopy(simplifierResult, "simplifier")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "simplifier" ? "نسخ نجاح!" : "نسخ المحتوى المبسط"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border leading-relaxed text-right md:text-right">
                      {simplifierResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 5. Marketing Copywriter */}
            {selectedAiTool === "ads" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🎬 صانع نصوص الإعلانات وسيناريوهات التلفاز القصيرة (TikTok & Reels Copywriter)</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    لديك فكرة منشور أو كتاب رقمي؟ أدخل الفكرة والشبكة وسيكتب لك جميناي سيناريو فيديو ناري يبدأ بهطاف وخطاف وينتهي بتوجيه فوري للشراء!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right md:col-span-1">
                    <label className="text-slate-600 text-xs font-bold block">موضوع أو فكرة الإعلان:</label>
                    <input
                      type="text"
                      placeholder="مثال: الخطة المالية للتحرر، كيفية كسب 100$"
                      value={copyTopic}
                      onChange={(e) => setCopyTopic(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">شبكة النشر والقناة:</label>
                    <select
                      value={copyChannel}
                      onChange={(e) => setCopyChannel(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="سيناريو فيديو TikTok (مع لقطات بصرية)">سيناريو فيديو TikTok (مع لقطات بصرية)</option>
                      <option value="بوست مكتوب طويل Instagram Reels">بوست مكتوب طويل Instagram Reels</option>
                      <option value="رسالة برودكاست WhatsApp خاطفة">رسالة برودكاست WhatsApp خاطفة</option>
                      <option value="سلسلة إيميلات قمع تحويل بريدي">سلسلة إيميلات قمع تحويل بريدي</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">نبرة الصوت (Tone of Voice):</label>
                    <input
                      type="text"
                      value={copyTone}
                      onChange={(e) => setCopyTone(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("copywriter")}
                    disabled={copywriting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copywriting ? "يكتب الآن إعلانك بدقة..." : "ولد نصوص الإعلان والسيناريو المائي"}
                  </button>
                </div>

                {copyResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">🎬 الإعلان والسيناريو المصنوع للانتشار الشديد:</span>
                      <button
                        onClick={() => triggerCopy(copyResult, "copywriter")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "copywriter" ? "تم نسخ الإعلان!" : "نسخ السكريبت كامل"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border leading-relaxed text-right md:text-right">
                      {copyResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 6. AI Funnel Architect Workspace */}
            {selectedAiTool === "funnel_architect" && (
              <div className="space-y-5 text-right font-sans" style={{ direction: "rtl" }}>
                <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-1.5">
                      <span>🚀 مهندس الهيكل التسويقي لصفحات الهبوط (Digital Sales Funnel)</span>
                      <span className="text-[10px] bg-red-100 text-red-750 font-black px-2 py-0.5 rounded-full select-none">حديث ومطور</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      صمم قمع مبيعات متكامل لمنتجك الرقمي مع العناوين والوعود وحزم المكافآت المحفزة بذكاء اصطناعي فائق لدفع الزوار للشراء الفوري.
                    </p>
                  </div>
                  
                  {/* Admin Gift Strategy Authority Toggle Switch */}
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2.5 self-stretch md:self-auto select-none">
                    <div className="text-right">
                      <span className="text-[10px] text-[#0b1d33] font-black block">تقديم كهدية حصرية للمشتركين 🎁</span>
                      <span className="text-[8.5px] text-slate-500 font-bold block">تتحكم مريم بصلاحية الاستخدام كهدية ترويجية</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={giftSubscribersTools.includes("funnel_architect")} 
                        onChange={() => toggleToolGiftStatus("funnel_architect")} 
                      />
                      <div className="w-8 h-4 bg-slate-350 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right md:col-span-1">
                    <label className="text-slate-600 text-xs font-bold block">اسم وفكرة المنتج الرقمي:</label>
                    <input
                      type="text"
                      placeholder="مثال: كتاب الطبخ الخليجي الحديث بـ 5 دقائق"
                      value={funnelProductName}
                      onChange={(e) => setFunnelProductName(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">الجمهور المستهدف (Target Audience):</label>
                    <input
                      type="text"
                      placeholder="مثال: الموظفات المغتربات، الأمهات الجدد"
                      value={funnelTargetUser}
                      onChange={(e) => setFunnelTargetUser(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">السعر المستهدف وإستراتيجية العرض:</label>
                    <input
                      type="text"
                      placeholder="مثال: 29$ مع 3 بونصات مجانية للمشترين اليوم"
                      value={funnelPricingType}
                      onChange={(e) => setFunnelPricingType(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("funnel_architect")}
                    disabled={generatingFunnel}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-slate-900 transition"
                  >
                    {generatingFunnel ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري رسم وكتابة محتوى صفحة الهبوط بـ Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>ولد هيكل صفحة البيع المغناطيسيّة 🚀</span>
                      </>
                    )}
                  </button>
                </div>

                {funnelResult && (
                  <div className="border border-amber-200 bg-amber-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-amber-50 p-2.5 px-4 rounded-xl">
                      <span className="text-xs text-amber-900 font-extrabold flex items-center gap-1">
                        <span>🚀 الهيكل البيعي المقترح من المعين الذكي لعرض منتجك:</span>
                      </span>
                      <button
                        onClick={() => triggerCopy(funnelResult, "funnel_copy")}
                        className="p-1 px-3 bg-white text-slate-800 hover:bg-slate-100 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "funnel_copy" ? "تم نسخ الهيكل بنجاح!" : "نسخ محتوى صفحة الهبوط كامل"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4.5 rounded-xl border text-right leading-relaxed block overflow-x-auto">
                      {funnelResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 7. AI Ebook Chapter/Outline Architect Workspace */}
            {selectedAiTool === "ebook_architect" && (
              <div className="space-y-5 text-right font-sans" style={{ direction: "rtl" }}>
                <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-1.5">
                      <span>📓 مهندس خطط ومنهج الكتيبات وفصول المنتجات الرقمية (Book Chapter Outline Builder)</span>
                      <span className="text-[10px] bg-red-100 text-red-750 font-black px-2 py-0.5 rounded-full select-none">حديث ومطور</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      لا تبدأ من الصفر المشتت! أدخل موضوع كتابك وفكرة شغفك وسيتكفل الذكاء الاصطناعي بصياغة تقسيم فصول دقيق يثير شهية المشتري.
                    </p>
                  </div>

                  {/* Admin Gift Strategy Authority Toggle Switch */}
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2.5 self-stretch md:self-auto select-none">
                    <div className="text-right">
                      <span className="text-[10px] text-[#0b1d33] font-black block">تقديم كهدية حصرية للمشتركين 🎁</span>
                      <span className="text-[8.5px] text-slate-500 font-bold block">تتحكم مريم بصلاحية الاستخدام كهدية ترويجية</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={giftSubscribersTools.includes("ebook_architect")} 
                        onChange={() => toggleToolGiftStatus("ebook_architect")} 
                      />
                      <div className="w-8 h-4 bg-slate-350 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right md:col-span-1">
                    <label className="text-slate-600 text-xs font-bold block">عنوان أو موضوع الكتيب الرقمي:</label>
                    <input
                      type="text"
                      placeholder="مثال: دليلك لتنظيم النوم للأطفال الرضع"
                      value={ebookTopicField}
                      onChange={(e) => setEbookTopicField(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">عدد الفصول أو التقسيمات المطلوبة:</label>
                    <select
                      value={ebookChaptersCount}
                      onChange={(e) => setEbookChaptersCount(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="3">3 فصول (كتيب مكثف سريع)</option>
                      <option value="5">5 فصول (كتاب رقمي قياسي ممتاز)</option>
                      <option value="7">7 فصول (دليلك المفصل الفاخر)</option>
                      <option value="10">10 فصول (مرجع كوني شامل)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">نبرة وأسلوب الطرح التوجيهي اليومي:</label>
                    <input
                      type="text"
                      value={ebookToneStyle}
                      onChange={(e) => setEbookToneStyle(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("ebook_architect")}
                    disabled={generatingEbook}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-slate-900 transition"
                  >
                    {generatingEbook ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري غزل فصول كراستك الرقمية بجميناي...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>أنتج هيكلية الكتيب والخطوط التفصيلية للفصول ✨</span>
                      </>
                    )}
                  </button>
                </div>

                {ebookOutlineResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2.5 px-4 rounded-xl">
                      <span className="text-xs text-indigo-900 font-extrabold flex items-center gap-1">
                        <span>📖 المنهج الموزع المقترح لفصول الكتاب الرقمي الممتاز:</span>
                      </span>
                      <button
                        onClick={() => triggerCopy(ebookOutlineResult, "ebook_copy")}
                        className="p-1 px-3 bg-white text-slate-800 hover:bg-slate-100 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "ebook_copy" ? "تم نسخ الهيكل بنجاح!" : "نسخ منهج الكتيب كالتالي"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4.5 rounded-xl border text-right leading-relaxed block overflow-x-auto">
                      {ebookOutlineResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 8. AI Idea Innovator Workspace */}
            {selectedAiTool === "idea_innovator" && (
              <div className="space-y-5 text-right font-sans" style={{ direction: "rtl" }}>
                <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-1.5">
                      <span>💡 مبتكر ومستشار أفكار المنتجات الرقمية الحديثة (Future Digital Ideas Innovator)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full select-none">حديث ومستقبلي</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      ابتكر أفكار منتجات رقمية حقيقية وفعالة تتماشى مع العصر الحالي والمستقبلي لضمان تحقيق كسب مستدام على أسس مهنية ذات مصداقية قصوى وتجلب الولاء الحقيقي.
                    </p>
                  </div>

                  {/* Admin Gift Strategy Authority Toggle Switch */}
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2.5 self-stretch md:self-auto select-none">
                    <div className="text-right">
                      <span className="text-[10px] text-[#0b1d33] font-black block">تقديم كهدية حصرية للمشتركين 🎁</span>
                      <span className="text-[8.5px] text-slate-500 font-bold block">تتحكم مريم بصلاحية الاستخدام كهدية ترويجية</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={giftSubscribersTools.includes("idea_innovator")} 
                        onChange={() => toggleToolGiftStatus("idea_innovator")} 
                      />
                      <div className="w-8 h-4 bg-slate-350 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">المجال / قطاع المنتجات المستهدف:</label>
                    <select
                      value={innovatorNiche}
                      onChange={(e) => setInnovatorNiche(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="الطبخ والمأكولات والأطباق">الطبخ والأطباق والمطبخ الحديث 🍲</option>
                      <option value="التصميم والهويات البصرية">التصميم الجرافيكي وقوالب الهوية الرقمية 🎨</option>
                      <option value="تنظيم وإدارة الأعمال والتقنيات">تنظيم وإدارة الأعمال والتقنيات الرقمية 💻</option>
                      <option value="الصحة والرشاقة واللياقة">الصحة، الرشاقة واللياقة البدنية المنزلية 🏃‍♂️</option>
                      <option value="الذكاء الاصطناعي والتعليم الذاتي">الذكاء الاصطناعي وكورسات التعليم الذاتي السريعة 🤖</option>
                      <option value="أخرى">مجال مخصص... (اكتب بالأسفل) 📝</option>
                    </select>
                  </div>

                  {innovatorNiche === "أخرى" && (
                    <div className="space-y-1.5 text-right">
                      <label className="text-slate-600 text-xs font-bold block">اكتب المجال المخصص هنا:</label>
                      <input
                        type="text"
                        placeholder="مثال: تصاميم زجاجات العطور الفاخرة"
                        value={innovatorCustomNiche}
                        onChange={(e) => setInnovatorCustomNiche(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">النطاق والبعد الزمني الحديث والمستقبلي:</label>
                    <select
                      value={innovatorTimeframe}
                      onChange={(e) => setInnovatorTimeframe(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="العشر سنوات المقبلة والذكاء الاصطناعي 2026-2035">العقود المقبلة والذكاء الاصطناعي (2026-2035)</option>
                      <option value="خلال العام الجاري والموسم الحالي 2026">الموسم الحالي والصناعة المتسارعة (2026)</option>
                      <option value="المدى القريب الفوري والشهور الثلاث المقبلة">المدى التكتيكي الفوري (الـ 3 أشهر المقبلة)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">أسلوب الأفكار والجاذبية التجارية المرجوة:</label>
                    <input
                      type="text"
                      value={innovatorStyle}
                      onChange={(e) => setInnovatorStyle(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("idea_innovator")}
                    disabled={generatingInnovator}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-slate-900 transition"
                  >
                    {generatingInnovator ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري تحليل السوق وابتكار الذهب الرقمي...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>ابتكر 4 أفكار منتجات رقمية حديثة عالية الكسب والموثوقية 🚀</span>
                      </>
                    )}
                  </button>
                </div>

                {innovatorResult && (
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
                        <span className="text-xs font-black text-indigo-700">غير مقاس — نموذج توضيحي</span>
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
                )}
              </div>
            )}

            {/* 9. AI Ready-to-Sell Turnkey Product Content Creator Workspace */}
            {selectedAiTool === "product_generator" && (
              <div className="space-y-5 text-right font-sans" style={{ direction: "rtl" }}>
                <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-1.5">
                      <span>📦 صانع ومؤلف المنتجات الرقمية المتكاملة الجاهزة للبيع (Direct Ready-to-Sell Product Creator)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full select-none">كامل ومنسق</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      صمم وألف كتاباً، كتيباً أو كراسة عملية ممتازة متكاملة المحتوى في كافة المجالات (مثل أطباق الطهي، وصفات الطعام، الديكور، أو ريادة الأعمال)، واجعلها جاهزة فورا كملف للحقوق والتصدير والبيع المباشر الفعال!
                    </p>
                  </div>

                  {/* Admin Gift Strategy Authority Toggle Switch */}
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2.5 self-stretch md:self-auto select-none">
                    <div className="text-right">
                      <span className="text-[10px] text-[#0b1d33] font-black block">تقديم كهدية حصرية للمشتركين 🎁</span>
                      <span className="text-[8.5px] text-slate-500 font-bold block">تتحكم مريم بصلاحية الاستخدام كهدية ترويجية</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={giftSubscribersTools.includes("product_generator")} 
                        onChange={() => toggleToolGiftStatus("product_generator")} 
                      />
                      <div className="w-8 h-4 bg-slate-350 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">موضوع أو عنوان المنتج تفصيلاً:</label>
                    <input
                      type="text"
                      placeholder="مثال: وصفات أطباق خليجية حديثة لنمط حياة صحي"
                      value={generatorTopic}
                      onChange={(e) => setGeneratorTopic(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">نوع الملف والمنتج الرقمي النهائي:</label>
                    <select
                      value={generatorType}
                      onChange={(e) => setGeneratorType(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="كتيب مأكولات ووصفات طعام متكامل للتسويق والبيع">كتيب مأكولات ووصفات طعام متكامل 🍲</option>
                      <option value="مذكرة عمل ومطبوعات PDF لتنظيم يومي وإنتاجي">مذكرة عمل وكراسة تخطيط إنتاجية PDF 📒</option>
                      <option value="دليل تدريبي شامل منسق بالكامل">دليل تعليمي احترافي جاهز للعملاء 📖</option>
                      <option value="كتاب إلكتروني رفيع المستوى كامل الفصول">كتاب إلكتروني شامل للبيع المباشر 📚</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">نموذج ومعيار الموثوقية والمصداقية العالية:</label>
                    <input
                      type="text"
                      value={generatorCredibility}
                      onChange={(e) => setGeneratorCredibility(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("product_generator")}
                    disabled={generatingProduct}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-slate-900 transition"
                  >
                    {generatingProduct ? (
                      <>
                        <div className="animate-spin border-2 border-t-transparent border-[#f2a900] rounded-full w-3.5 h-3.5" />
                        <span>يجري تأليف وصياغة وتصميم محتوى الكتيب والملف...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>أنشئ الملف المتكامل للمنتج الرقمي للبيع المباشر 🚀</span>
                      </>
                    )}
                  </button>
                </div>

                {productGeneratorResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2.5 px-4 rounded-xl">
                      <span className="text-xs text-indigo-900 font-extrabold flex items-center gap-1">
                        <span>📦 محتوى الملف الرقمي المتكامل للبيع المباشر (يمكنك نسخه وتصديره مباشرة في كتب أو كرسات):</span>
                      </span>
                      <button
                        onClick={() => triggerCopy(productGeneratorResult, "product_gen_copy")}
                        className="p-1 px-3 bg-white text-slate-800 hover:bg-slate-100 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "product_gen_copy" ? "تم نسخ محتوى الملف!" : "نسخ محتوى الملف المنسق"}
                      </button>
                    </div>
                    <div className="bg-white p-6 rounded-xl border text-right text-slate-800 leading-relaxed max-h-[500px] overflow-y-auto text-xs sm:text-sm whitespace-pre-wrap font-sans">
                      {productGeneratorResult}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Marketing Copywriter */}
            {selectedAiTool === "ads" && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🎬 صانع نصوص الإعلانات وسيناريوهات التلفاز القصيرة (TikTok & Reels Copywriter)</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    لديك فكرة منشور أو كتاب رقمي؟ أدخل الفكرة والشبكة وسيكتب لك جميناي سيناريو فيديو ناري يبدأ بهطاف وخطاف وينتهي بتوجيه فوري للشراء!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-right md:col-span-1">
                    <label className="text-slate-600 text-xs font-bold block">موضوع أو فكرة الإعلان:</label>
                    <input
                      type="text"
                      placeholder="مثال: الخطة المالية للتحرر، كيفية كسب 100$"
                      value={copyTopic}
                      onChange={(e) => setCopyTopic(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">شبكة النشر والقناة:</label>
                    <select
                      value={copyChannel}
                      onChange={(e) => setCopyChannel(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="سيناريو فيديو TikTok (مع لقطات بصرية)">سيناريو فيديو TikTok (مع لقطات بصرية)</option>
                      <option value="بوست مكتوب طويل Instagram Reels">بوست مكتوب طويل Instagram Reels</option>
                      <option value="رسالة برودكاست WhatsApp خاطفة">رسالة برودكاست WhatsApp خاطفة</option>
                      <option value="سلسلة إيميلات قمع تحويل بريدي">سلسلة إيميلات قمع تحويل بريدي</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-slate-600 text-xs font-bold block">نبرة الصوت (Tone of Voice):</label>
                    <input
                      type="text"
                      value={copyTone}
                      onChange={(e) => setCopyTone(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border rounded-xl outline-none focus:border-[#0b1d33]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => callAiToolHelper("copywriter")}
                    disabled={copywriting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0b1d33] text-[#f2a900] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copywriting ? "يكتب الآن إعلانك بدقة..." : "ولد نصوص الإعلان والسيناريو المائي"}
                  </button>
                </div>

                {copyResult && (
                  <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl space-y-3.5 mt-4">
                    <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 rounded-xl">
                      <span className="text-xs text-indigo-800 font-bold">🎬 الإعلان والسيناريو المصنوع للانتشار الشديد:</span>
                      <button
                        onClick={() => triggerCopy(copyResult, "copywriter")}
                        className="p-1 px-3 bg-white text-indigo-700 text-[10px] font-black rounded-lg border flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === "copywriter" ? "تم نسخ الإعلان!" : "نسخ السكريبت كامل"}
                      </button>
                    </div>
                    <pre className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border leading-relaxed text-right md:text-right">
                      {copyResult}
                    </pre>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2 CONTENT: AFFILIATE LINKS MANAGER */}
      {activeTab === "affiliate" && (
        <form onSubmit={handleSaveLinks} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 select-none">
            <div>
              <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🔗 لوحة التحكم بروابط الترويج والتسويق بالعمولة (Affiliate Manager)</h4>
              <p className="text-slate-400 text-xs mt-1">
                قم بتعديل وإدخال روابط التسجيل الترويجية الخاصة بك لجميع بوابات الدفع والأدوات بالدليل. عندما ينقر أي مستخدم أو زبون عليها لتنفيذ درسه، ستتلقى عمولتك مباشرة!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetLinksToDefault}
                className="px-3.5 py-2 text-xs font-bold text-red-650 bg-red-100/60 rounded-xl hover:bg-red-150 transition cursor-pointer"
              >
                استعادة الافتراضي
              </button>
              
              <button
                type="submit"
                disabled={savingLinks}
                className="px-4 py-2 text-xs font-black text-[#0b1d33] bg-[#f2a900] hover:bg-[#d69600] rounded-xl transition cursor-pointer shadow flex items-center gap-1.5"
              >
                {savingLinks ? "يجري الحفظ..." : "حفظ جميع الروابط"}
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Toast Notification message */}
          {saveSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-xl border border-emerald-100 flex items-center gap-2 animate-fade-in font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>تم تحديث روابط الإفلييت وحفظ التعديلات محلياً بنجاح! جميع أزرار الروابط تشير لروابطك الجديدة الآن. 🚀</span>
            </div>
          )}

          {/* Grid inputs for links editing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Canva */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Canva (أداة التصاميم والكتب)</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.canva || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.canva}
                onChange={(e) => setLinks({ ...links, canva: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://www.canva.com/your-partner-id"
              />
            </div>

            {/* Gumroad */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Gumroad (بوابة استلام وبياعات الدفع)</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.gumroad || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.gumroad}
                onChange={(e) => setLinks({ ...links, gumroad: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://gumroad.com/a/your-affiliate-id"
              />
            </div>

            {/* Payhip */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Payhip (بوابة لاندينج بديلة ودعم PayPal)</span>
                <span className="text-[10px] bg-pink-100 text-pink-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.payhip || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.payhip}
                onChange={(e) => setLinks({ ...links, payhip: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://payhip.com?fp_ref=your-id"
              />
            </div>

            {/* ChatGPT */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">ChatGPT Plus (الذكاء الاصطناعي للمساعدة)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.chatgpt || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.chatgpt}
                onChange={(e) => setLinks({ ...links, chatgpt: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://chatgpt.com"
              />
            </div>

            {/* Notion */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Notion (أداة تتبع ونوت أعمالك)</span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.notion || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.notion}
                onChange={(e) => setLinks({ ...links, notion: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://notion.so"
              />
            </div>

            {/* CapCut */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">CapCut (أداة تحرير الفيديوهات المبدعة)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.capcut || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.capcut}
                onChange={(e) => setLinks({ ...links, capcut: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://capcut.com"
              />
            </div>

            {/* Mailchimp */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Mailchimp / Brevo (إدارة القائمة البريدية)</span>
                <span className="text-[10px] bg-violet-100 text-violet-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.mailchimp || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.mailchimp}
                onChange={(e) => setLinks({ ...links, mailchimp: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://mailchimp.com"
              />
            </div>

            {/* Gemini Translator Link */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-700">Gemini AI Engine (تراخيص ومترجمات)</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  نقرات: {clickCounts.gemini || 0}
                </span>
              </div>
              <input
                type="url"
                value={links.gemini}
                onChange={(e) => setLinks({ ...links, gemini: e.target.value })}
                className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33] font-mono text-left"
                placeholder="https://gemini.google.com"
              />
            </div>

          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-xs text-[#d69600] flex items-start gap-2 leading-relaxed">
            <span>💡</span>
            <p>
              **نصيحة إشادة مريم:** عند تعديل الروابط أعلاه بروابط تحتوي على معرّفك الشخصي (Affiliate Identifiers)، تأكد من اختبار عمل الروابط في صفحة جديدة للتأكد من تخطيط العمولة في بنية حساباتك بالGumroad والمنصات الأخرى.
            </p>
          </div>
        </form>
      )}

      {/* TAB 3 CONTENT: DETAILED AUDIENCE TRACKING & EVENT ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          
          {/* Quick Metrics Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            
            {/* Visitors metric */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">{currentLabels.total_visits}</span>
                <span className="text-2xl font-black text-[#0b1d33] mt-1 block">{pageViews}</span>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 12% من الأسبوع الماضي</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Workbook progress metric */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">{currentLabels.workbook_done}</span>
                <span className="text-2xl font-black text-[#0b1d33] mt-1 block">
                  {Math.round((workbookFilledAnswers / 15) * 100)}%
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  تم ملء {workbookFilledAnswers} من 15 سؤالاً تفاعلياً
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl font-bold">
                ✍️
              </div>
            </div>

            {/* Affiliate Clicks metrics */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">{currentLabels.total_actions}</span>
                <span className="text-2xl font-black text-[#0b1d33] mt-1 block">{totalAffiliateClicks}</span>
                <p className="text-[10px] text-indigo-550 font-bold mt-1">معدل نقر الزوار للروابط الترويجية</p>
              </div>
              <div className="p-3 bg-[#f2a900]/10 text-[#d69600] rounded-xl">
                <Link2 className="w-5 h-5" />
              </div>
            </div>

            {/* Active Challenge progress */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">تجاوز التحدي 12 يوماً</span>
                <span className="text-2xl font-black text-[#0b1d33] mt-1 block">{daysCompletedCount} / 12</span>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  نسبة التزام: {Math.round((daysCompletedCount / 12) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Line Chart block representation */}
            <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3 select-none">
                <div>
                  <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">🚀 إحصائيات تصفح وجدوى المنصة (Audience Performance Graph)</h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">معدل تتبع القراء والتحصيلات على مدار الأيام الـ 7 الأخيرة</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 border p-1 rounded-lg text-[10px] font-bold text-slate-500">
                  <span>● الزيارات</span>
                  <span className="text-emerald-500 mr-2">● الإفلييت</span>
                </div>
              </div>

              {/* Pure CSS/Tailwind diagram graph mimicking high quality analytics platform */}
              <div className="h-56 flex items-end justify-between pt-6 px-4 relative">
                
                {/* Horizontal grid rows */}
                <div className="absolute inset-x-0 bottom-4 border-b border-slate-100"></div>
                <div className="absolute inset-x-0 bottom-16 border-b border-slate-100"></div>
                <div className="absolute inset-x-0 bottom-28 border-b border-slate-100"></div>
                <div className="absolute inset-x-0 bottom-40 border-b border-slate-100"></div>

                {/* Graph bars representation with heights */}
                {[
                  { day: "الأحد", visits: 60, clicks: 30 },
                  { day: "الاثنين", visits: 85, clicks: 45 },
                  { day: "الثلاثاء", visits: 110, clicks: 70 },
                  { day: "الأربعاء", visits: 95, clicks: 50 },
                  { day: "الخميس", visits: 140, clicks: 95 },
                  { day: "الجمعة", visits: 120, clicks: 80 },
                  { day: "السبت", visits: 165, clicks: 115 }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 z-10 w-1/8">
                    <div className="flex gap-1.5 items-end justify-center h-40">
                      
                      {/* Visits Bar */}
                      <div 
                        className="bg-[#0b1d33] w-2 sm:w-3.5 rounded-t-md transition-all duration-700 hover:opacity-85 shadow group relative"
                        style={{ height: `${(item.visits / 180) * 100}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition shadow block whitespace-nowrap">
                          {item.visits} زائر
                        </span>
                      </div>

                      {/* Clicks Bar */}
                      <div 
                        className="bg-[#f2a900] w-2 sm:w-3.5 rounded-t-md transition-all duration-700 hover:opacity-85 shadow group relative"
                        style={{ height: `${(item.clicks / 180) * 100}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition shadow block whitespace-nowrap">
                          {item.clicks} حافز
                        </span>
                      </div>

                    </div>
                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{item.day}</span>
                  </div>
                ))}

              </div>
            </div>

            {/* Audience Live feeds monitor */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="border-b pb-3 select-none flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-[#0b1d33] text-sm">🟢 تغذية تتبع الجمهور بالبث الحي</h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">عمليات تصفح، تقدم، ونقرات تجري الآن بنجاح</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              {/* Scrolling events simulator */}
              <div className="space-y-3.5 overflow-y-auto max-h-[220px] scrollbar-thin pr-1">
                {liveEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-start gap-2.5 transition animate-fade-in hover:bg-slate-100"
                  >
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed text-right">{evt.text}</p>
                      <span className="text-[9px] text-slate-400 font-mono font-medium block text-right">{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#0b1d33] text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
            <div className="text-right">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-400">📈 كيف تبدأ بجمع بيانات زوارك الحقيقية؟</h4>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                هذه الإحصائيات هي محاكاة تفاعلية ذكية مصممة لمحاكاة نشاط تتبع الزوار والعملاء الفعليين بذكاء. يمكنك ربط أدوات التحليل الخاصة بك مثل Google Analytics أو Facebook Pixel لتتبع السلوك الفعلي لطلابك عند توفر إصدار مبيعاتك الحقيقي!
              </p>
            </div>
          </div>

          
          {/* New Section 2: AI Automated Inactivity Reminder & Motivation Radar */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4 text-right" style={{ direction: "rtl" }}>
            <div className="border-b border-slate-800 pb-3 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-400/10 text-amber-400 font-black px-2.5 py-0.5 rounded-full uppercase">AI Reminder & Retention Cabin</span>
                <h4 className="font-extrabold text-[#f6b118] text-sm sm:text-base mt-1">🤖 رادار المتابعة والتحفيز التلقائي بالبريد والإشعار (AI Smart Retention Radar)</h4>
              </div>
              <span className="text-xl animate-pulse">✉️</span>
            </div>

            <p className="text-slate-350 text-xs leading-relaxed">
              عندما يتوقف الطالب أو العميل عن التفاعل ومواصلة قراءة الدليل أو حل كراسة التخطيط لعدة أيام متواصلة، يقوم رادار الذكاء الاصطناعي التوليدي تلقائياً برصد الخمول، وصياغة بريد تحفيزي ذكي مخصص وموجه لمعالجة العقبة النفسية، وبثه لصاحب الحساب لضمان عودته واستكماله الرحلة وتحقيق مبيعاته!
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Left Settings Panel */}
              <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <h5 className="font-extrabold text-xs text-amber-400">⚙️ إعدادات معايير الرصد</h5>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">تفعيل التذكير التلقائي النشط:</label>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isReminderSchedulerActive} 
                      onChange={(e) => setIsReminderSchedulerActive(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="mr-3 text-xs peer-checked:text-amber-400 text-slate-400 font-extrabold">
                      {isReminderSchedulerActive ? "الرادار مفعّل ونشط" : "الرادار معطّل حالياً"}
                    </span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">فترة التوقف المستهدفة للتحفيز:</label>
                  <select
                    value={inactivityDays}
                    onChange={(e) => setInactivityDays(e.target.value)}
                    className="w-full text-xs font-semibold p-2 bg-slate-900 border border-slate-800 rounded outline-none text-white focus:border-amber-400"
                  >
                    <option value="1">بعد 24 ساعة من التوقف والانقطاع</option>
                    <option value="3">بعد 3 أيام من التوقف والانقطاع (موصى به)</option>
                    <option value="5">بعد 5 أيام من التوقف والانقطاع</option>
                    <option value="7">بعد أسبوع كامل من الغياب والركود</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-850">
                  <h6 className="text-[10px] font-black text-slate-400">📊 رصد من قِبل الرادار الآن:</h6>
                  <p className="text-slate-300 text-xs">عدد العملاء الخاملين حالياً: <b className="text-amber-400">3 زملاء</b></p>
                  <div className="text-[10px] text-slate-500 leading-normal">
                    * شملت التصفية الذكية: سارة أ. (توقفت باليوم 6)، خالد بن م. (توقف بكراسة العمل)، ياسين ك. (لم يفتح الدليل منذ يومين).
                  </div>
                </div>
              </div>

              {/* Right generated Body Preview */}
              <div className="lg:col-span-2 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-extrabold text-xs text-slate-300">✉️ معاينة وتعديل البريد التحفيزي الذكي المولد بالذكاء الصياغي:</h5>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md font-mono">Dynamic AI Template</span>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="text"
                      value={motivationEmailSubject}
                      onChange={(e) => setMotivationEmailSubject(e.target.value)}
                      className="w-full text-xs font-bold p-2 bg-slate-900 border border-slate-800 rounded outline-none text-amber-400"
                      placeholder="عنوان بريد المتابعة والتحفيز..."
                    />
                    <textarea
                      value={motivationEmailBody}
                      onChange={(e) => setMotivationEmailBody(e.target.value)}
                      rows={6}
                      className="w-full text-xs font-medium p-3 bg-slate-900 border border-slate-800 rounded outline-none text-slate-200 leading-relaxed font-mono"
                      placeholder="محتوى بريد المتابعة والتحفيز المتكامل..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-850">
                  <div className="text-[10px] text-slate-450 font-medium">
                    * يقوم النظام بإدخال الهوية والاسم والمستوى للمستلم تلقائياً بناءً على موضع التوقف.
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleTriggerEmailCampaign}
                    disabled={emailCampaignStatus === "sending"}
                    className="bg-[#f2a900] hover:bg-[#d69600] text-[#0b1d33] font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 "
                  >
                    <span>🚀 إطلاق دفعة تحفيز تذكيرية تجريبية للبريد الآن</span>
                    {emailCampaignStatus === "sending" && <span className="animate-spin text-xs">⏳</span>}
                    {emailCampaignStatus === "sent" && <span className="text-emerald-950 font-black bg-emerald-100 px-2 py-0.5 rounded">✓ أرسلت بنجاح!</span>}
                  </button>
                </div>
              </div>

            </div>
          </div>

          

        </div>
      )}

      {/* TAB 4 CONTENT: CENTRAL CHANNELS AND PAYMENT GATEWAYS MANAGEMENT CABINET */}
      {activeTab === "payments" && (
        <div className="space-y-6" style={{ direction: "rtl" }}>
          
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-right">
            <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center justify-between">
              <span>💳 إعداد بوابات وطرق الدفع المباشرة والعملات الذكية</span>
              <span className="text-xs font-normal text-slate-400">إشراف: مريم ناهي</span>
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              ثبّتي معرّفات بواباتك وحساباتك أدناه لتلقي أموال الكورسات والكتيب المباشرة بدون أي وسيط مالي خارجي. المعرّفات المدخلة تحفظ محلياً لتوجيه عمليات الشراء والمبيعات مباشرة لمحفظتك أو حسابك البنكي.
            </p>
          </div>

          {/* New Section 1: PayPal Global Direct Gateway API & SDK */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-right" style={{ direction: "rtl" }}>
            <div className="border-b pb-3 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-100 text-[#d69600] font-black px-2.5 py-0.5 rounded-full uppercase">Standard Direct Gateway</span>
                <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base mt-1">🌐 بوابة الدفع العالمية المباشرة PayPal Global Setup</h4>
              </div>
              <span className="text-xl">💳</span>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              اربط حساب المطور الخاص بك في <b>PayPal Developer Console</b> بلمسة واحدة لتمكين أزرار الدفع الذكية (Smart Payment Buttons) التي تقبل الدفع بالبطاقات الائتمانية ورصيد باي بال مباشرة، وتسليم كتابك ومنتجاتك الرقمية للعملاء تلقائياً لجميع دول العالم.
            </p>

            <form onSubmit={handleSavePaypalConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1 font-sans">معرّف العميل المباشر Client ID:</label>
                <input 
                  type="text" 
                  value={paypalClientId}
                  onChange={(e) => setPaypalClientId(e.target.value)}
                  placeholder="Enter PayPal Client ID..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-750 block mb-1 font-sans">المفتاح السري المباشر Secret Key:</label>
                <input 
                  type="password" 
                  value={paypalSecretKey}
                  onChange={(e) => setPaypalSecretKey(e.target.value)}
                  placeholder="Enter PayPal Secret Key..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-750 block mb-1 font-sans">بيئة تشغيل الدفع (Environment Mode):</label>
                <select
                  value={paypalEnv}
                  onChange={(e: any) => setPaypalEnv(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]"
                >
                  <option value="sandbox">بيئة تجريبية آمنة (Sandbox)</option>
                  <option value="live">بيئة إنتاج حقيقية واستقبل أموال (Live Production)</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-between items-center pt-2">
                <div className="text-[10px] text-slate-400">
                  * يتطلب تفعيل رابط IPN (إشعار الدفع الفوري) لتسليم ملف تذكرة الشراء والربط مع المنصة تلقائياً.
                </div>
                <button
                  type="submit"
                  disabled={paypalSaving}
                  className="bg-[#0b1d33] hover:bg-slate-900 text-white font-black text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  {paypalSaving ? "جاري الحفظ والمزامنة..." : "حفظ ومزامنة معرّفات باي بال العالمية"}
                  {paypalSaveSuccess && <span className="text-emerald-400 font-bold">✓ تم الحفظ!</span>}
                </button>
              </div>
            </form>
          </div>

          {/* New Section 1.1: Mastercard / Visa International Configuration Cabinet */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-right" style={{ direction: "rtl" }}>
            <div className="border-b pb-3 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-orange-100 text-orange-850 font-black px-2.5 py-0.5 rounded-full uppercase">Credit Card Native API Gateway</span>
                <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base mt-1">💳 بوابة ماستر كارد الدولية والفيزا كارد المباشرة Mastercard ID Integration</h4>
              </div>
              <span className="text-xl">💳</span>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              اربط بوابة ماستر كارد والفيزا كارد بشكل مستقل بدون وسيط لتفادي العمولات العالية وتأمين الخصم المباشر. بمجرد تفعيل المعرّفات وحفظها، ستظهر حقول البطاقة للمشترين في نافذة الدفع، لتنتقل المبيعات مباشرة لفاتورة تسليم المنتج الرقمي.
            </p>

            <form onSubmit={handleSaveMcCardConfig} className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">رقم التاجر Card Merchant ID:</label>
                <input 
                  type="text" 
                  value={mcCardMerchantId}
                  onChange={(e) => setMcCardMerchantId(e.target.value)}
                  placeholder="Enter Merchant ID..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">المفتاح العام Public Key:</label>
                <input 
                  type="text" 
                  value={mcCardPublicKey}
                  onChange={(e) => setMcCardPublicKey(e.target.value)}
                  placeholder="pk_live_mc_..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">المفتاح السري المباشر Secret Key:</label>
                <input 
                  type="password" 
                  value={mcCardSecretKey}
                  onChange={(e) => setMcCardSecretKey(e.target.value)}
                  placeholder="sk_live_mc_..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">بيئة تشغيل الدفع (Environment):</label>
                <select
                  value={mcCardEnv}
                  onChange={(e: any) => setMcCardEnv(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#0b1d33]"
                >
                  <option value="sandbox">بيئة تجريبية آمنة للبطاقات (Sandbox)</option>
                  <option value="live">بيئة إنتاج حقيقية واستقبال فوري (Live Production)</option>
                </select>
              </div>

              <div className="md:col-span-4 flex justify-between items-center pt-2">
                <div className="text-[10px] text-slate-400">
                  * يقبل بطاقات Visa, Mastercard, American Express وApple Pay تلقائياً بحد عمولة أزلي 2.5%.
                </div>
                <button
                  type="submit"
                  disabled={mcCardSaving}
                  className="bg-[#0b1d33] hover:bg-slate-900 text-white font-black text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  {mcCardSaving ? "جاري الحفظ والمزامنة..." : "حفظ وتنشيط بوابة الماستر كارد"}
                  {mcCardSaveSuccess && <span className="text-emerald-500 font-bold">✓ تم الحفظ بنجاح!</span>}
                </button>
              </div>
            </form>
          </div>

          {/* New Section 1.2: Zain Cash Iraq Integration Config Cabinet */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-right" style={{ direction: "rtl" }}>
            <div className="border-b pb-3 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-850 font-black px-2.5 py-0.5 rounded-full uppercase">Mobile Wallet API</span>
                <h4 className="font-extrabold text-[#088258] text-sm sm:text-base mt-1">📱 بوابة الدفع بالهاتف زين كاش العراق Zain Cash Iraq Setup</h4>
              </div>
              <span className="text-xl">📲</span>
            </div>
            
            <p className="text-slate-550 text-xs leading-relaxed">
              اربط حساب محفظة التاجر لشركة <b>زين كاش (Zain Cash Iraq)</b> للموافقة واستلام الأموال فورياً من رواد الكورس في العراق ومحيطه الإقليمي. تتيح قبول عمليات الدفع عبر الهاتف الجوال وتسليم الدليل الفوري للطلاب دون الحاجة لبطاقات دولية.
            </p>

            <form onSubmit={handleSaveZainConfig} className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">رقم هاتف المحفظة MSISDN/Phone:</label>
                <input 
                  type="text" 
                  value={zainMSISDN}
                  onChange={(e) => setZainMSISDN(e.target.value)}
                  placeholder="96477XXXXXXXX"
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#088258]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">المفتاح السري للواجهة API Secret:</label>
                <input 
                  type="password" 
                  value={zainSecretKey}
                  onChange={(e) => setZainSecretKey(e.target.value)}
                  placeholder="Enter Zain API SecretKey..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#088258]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">رمز PIN كود للتاجر (PIN Code):</label>
                <input 
                  type="password" 
                  value={zainMerchantPIN}
                  onChange={(e) => setZainMerchantPIN(e.target.value)}
                  placeholder="****"
                  maxLength={4}
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#088258]" 
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">بيئة الاتصال (API Host):</label>
                <select
                  value={zainEnv}
                  onChange={(e: any) => setZainEnv(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-[#088258]"
                >
                  <option value="sandbox">بيئة الفحص التجريبية (Zain Sandbox)</option>
                  <option value="live">البيئة الحية المباشرة للاموال (Zain Cash Live)</option>
                </select>
              </div>

              <div className="md:col-span-4 flex justify-between items-center pt-2">
                <div className="text-[10px] text-slate-400">
                  * يتم إرسال طلبات الدفع الفوري لهواتف عملائك مباشرة وتأكيدها آلياً خلال 5 ثواني.
                </div>
                <button
                  type="submit"
                  disabled={zainSaving}
                  className="bg-[#088258] hover:bg-emerald-800 text-white font-black text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  {zainSaving ? "جاري الحفظ والمزامنة..." : "حفظ وتفعيل بوابة زين كاش العراق"}
                  {zainSaveSuccess && <span className="text-emerald-300 font-bold">✓ تم تفعيل المحفظة بنجاح!</span>}
                </button>
              </div>
            </form>
          </div>

          {/* New Section 1.3: Cryptocurrencies Node Setup */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-right" style={{ direction: "rtl" }}>
            <div className="border-b pb-3 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-purple-100 text-purple-855 font-black px-2.5 py-0.5 rounded-full uppercase">Web3 Wallets & Node Verification</span>
                <h4 className="font-extrabold text-[#7c3aed] text-sm sm:text-base mt-1">🪙 إعدادات بوابة الدفع والتحقق للعملات الرقمية USDT & Cryptocurrencies</h4>
              </div>
              <span className="text-xl">🪙</span>
            </div>
            
            <p className="text-slate-550 text-xs leading-relaxed">
              عيّني عناوين المحافظ الرقمية الخاصة بك لتلقي الأموال مباشرة. بمجرد قيام الطالب بإكمال الدفع ونسخ العنوان، سيقوم العقد الذكي و/أو واجهة نظام التحقق برصد المعاملة وتأكيدها تلقائياً لتسليم الدليل دون أي تدخل صيدلاني بشري.
            </p>

            <form onSubmit={handleSaveCryptoConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5 text-right font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">عنوان محفظة USDT المستقر (TRC-20/Tron Network):</label>
                <input 
                  type="text" 
                  value={cryptoUSDTAddress}
                  onChange={(e) => setCryptoUSDTAddress(e.target.value)}
                  placeholder="Enter TRC20 Wallet Address..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-purple-650 text-left font-mono" 
                />
              </div>

              <div className="space-y-1.5 text-right font-sans">
                <label className="text-xs font-bold text-slate-705 block mb-1">عنوان محفظة البيتكوين الأساسي (Optional Bitcoin Node):</label>
                <input 
                  type="text" 
                  value={cryptoBtcAddress}
                  onChange={(e) => setCryptoBtcAddress(e.target.value)}
                  placeholder="Enter BTC Wallet Address..."
                  className="w-full text-xs font-mono p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-purple-650 text-left font-mono" 
                />
              </div>

              <div className="space-y-1.5 text-right font-sans">
                <label className="text-xs font-bold text-slate-750 block mb-1">نظام التحقق من معاملة الحوالة الرقمية:</label>
                <select
                  value={cryptoNetworkCheck}
                  onChange={(e: any) => setCryptoNetworkCheck(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 border rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-purple-650"
                >
                  <option value="automatic">تحقق آلي بالكامل عبر البلوكشين (TRON Scan Observer API)</option>
                  <option value="manual">مراجعة يدوية للهاش وموافقة المشرف مريم ناهي</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-between items-center pt-2">
                <div className="text-[10px] text-slate-400">
                  * يتم إظهار رمز الاستجابة السريعة (QR Code) لعنوان المحفظة للمشتري تلقائياً عند الدفع.
                </div>
                <button
                  type="submit"
                  disabled={cryptoSaving}
                  className="bg-purple-600 hover:bg-purple-800 text-white font-black text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  {cryptoSaving ? "جاري الحفظ والمزامنة..." : "حفظ وتأمين عناوين العملات الرقمية"}
                  {cryptoSaveSuccess && <span className="text-emerald-500 font-bold">✓ تم حفظ العناوين!</span>}
                </button>
              </div>
            </form>
          </div>

          {/* Pricing Tiers Sandbox & Interactive Checkout Simulator */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="border-b pb-3 select-none">
              <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base">💎 محاكي ومهيئ خطط أسعار الإصدار اللاحق (Simulated Payment Portal)</h4>
              <p className="text-slate-400 text-xs mt-1">
                صمم وحدد أسعار فئات منتجك للإصدار القادم، وجرب الضغط على "اختبار الدفع" لتشاهد كيف تظهر شاشات الدفع الآمن للعميل وتسليم الملفات تلقائياً!
              </p>
            </div>

            {/* Price Plan configurator sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">سعر الباقة البرونزية (Bronze Tier $):</label>
                <input 
                  type="number" 
                  value={tierBronzePrice}
                  onChange={(e) => setTierBronzePrice(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">سعر الباقة الفضية (Silver Tier $):</label>
                <input 
                  type="number" 
                  value={tierSilverPrice}
                  onChange={(e) => setTierSilverPrice(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">سعر الباقة الذهبية (Gold Tier $):</label>
                <input 
                  type="number" 
                  value={tierGoldPrice}
                  onChange={(e) => setTierGoldPrice(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border rounded-lg bg-white outline-none focus:border-[#0b1d33]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#rose-600] text-rose-800 block">الدورة العملية المتكاملة (Course Tier $):</label>
                <input 
                  type="number" 
                  value={tierCoursePrice}
                  onChange={(e) => setTierCoursePrice(e.target.value)}
                  className="w-full text-xs font-extrabold p-2.5 border rounded-lg bg-white border-rose-200 text-rose-700 outline-none focus:border-[#0b1d33]"
                />
              </div>
            </div>

            {/* Interactive Checkout Plans Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              
              {/* Plan Bronze Card */}
              <div className="border border-slate-200 bg-white rounded-2xl p-5 hover:shadow transition flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">الباقة البرونزية</span>
                  <h5 className="font-black text-[#0b1d33] text-base sm:text-lg mt-1">نسخة الدليل الرقمي الأساسي</h5>
                  <div className="my-4 text-3xl font-black text-[#0b1d33]">
                    {tierBronzePrice}$ <span className="text-xs text-slate-400 font-normal">مرة واحدة</span>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-600 border-t pt-4">
                    <li className="flex items-center gap-2">✔️ حصرياً الدليل الشامل لخيارات المنتجات الـ 33</li>
                    <li className="flex items-center gap-2">✔️ كراسة خطط العمل المفتعلة للطباعة</li>
                    <li className="text-slate-300">❌ تحديثات شهرية وإصدارات ثانية بونص</li>
                    <li className="text-slate-300">❌ مركز أوامر ChatGPT الـ 50 الكنز</li>
                  </ul>
                </div>
                <button
                  onClick={() => launchPaymentCheckout("Bronze")}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs mt-6 transition cursor-pointer text-center"
                >
                  اختبار شراء الباقة البرونزية 💳
                </button>
              </div>

              {/* Plan Silver Card */}
              <div className="border-2 border-[#f2a900] bg-white rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f2a900] text-[#0b1d33] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  الأكثر مبيعاً ورغبة 🔥
                </div>
                <div>
                  <span className="text-xs font-bold text-[#f2a900] block">الباقة الفضية</span>
                  <h5 className="font-black text-[#0b1d33] text-base sm:text-lg mt-1">الباقة المتكاملة للألفية</h5>
                  <div className="my-4 text-3xl font-black text-[#0b1d33]">
                    {tierSilverPrice}$ <span className="text-xs text-slate-400 font-normal">مرة واحدة</span>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-600 border-t pt-4">
                    <li className="flex items-center gap-2">✔️ الدليل الشامل للإطلاق الـ 33 صفحة كاملة</li>
                    <li className="flex items-center gap-2">✔️ نسخة كراسة العمل التفاعلية المحدثة</li>
                    <li className="flex items-center gap-2">✔️ مركز أوامر ChatGPT الـ 50 كاملة مجاناً</li>
                    <li className="flex items-center gap-2">✔️ الـ 6 قوالب العملية لتنزيل Excel & Docs</li>
                  </ul>
                </div>
                <button
                  onClick={() => launchPaymentCheckout("Silver")}
                  className="w-full py-2.5 bg-[#f2a900] hover:bg-[#d69600] text-[#0b1d33] font-black rounded-xl text-xs mt-6 transition cursor-pointer text-center"
                >
                  اختبار شراء الباقة الفضية 💳
                </button>
              </div>

              {/* Plan Gold Card */}
              <div className="border border-slate-200 bg-white rounded-2xl p-5 hover:shadow transition flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">الباقة الذهبية</span>
                  <h5 className="font-black text-[#0b1d33] text-base sm:text-lg mt-1">الحرية المالية وعوائد الـ VIP</h5>
                  <div className="my-4 text-3xl font-black text-[#0b1d33]">
                    {tierGoldPrice}$ <span className="text-xs text-slate-400 font-normal">دفع دفعة واحدة</span>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-600 border-t pt-4">
                    <li className="flex items-center gap-2">✔️ جميع مزايا ومستلزمات الباقة الفضية كاملاً</li>
                    <li className="flex items-center gap-2">✔️ جلسة كوتشنج هاتفية زووم 45 دقيقة مع مريم</li>
                    <li className="flex items-center gap-2">✔️ مراجعة غلاف كتيبك وإملائك بـ PDF وتسعيره</li>
                    <li className="flex items-center gap-2">✔️ تحديثات وتنزيل مجاني لأي كتاب قادم للأبد</li>
                  </ul>
                </div>
                <button
                  onClick={() => launchPaymentCheckout("Gold")}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs mt-6 transition cursor-pointer text-center"
                >
                  اختبار شراء باقة الـ VIP 💳
                </button>
              </div>

              {/* PREMIUM COURSE CARD - $147 */}
              <div className="border-2 border-rose-500 bg-[#fffdfd] rounded-2xl p-5 hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-550 bg-rose-600 text-white px-2.5 py-0.5 rounded-bl-xl text-[8.5px] font-black uppercase tracking-wider animate-pulse">
                  شامل ومستقبلي 🎓
                </div>
                <div>
                  <span className="text-xs font-black text-rose-600 block flex items-center gap-1">
                    <span>الدورة العملية المتكاملة</span>
                    <span className="text-[9px] bg-rose-100 px-1 py-0.2 rounded font-mono">147$ Only</span>
                  </span>
                  <h5 className="font-black text-rose-950 text-base sm:text-lg mt-1 leading-tight">امتياز التأسيس وصناعة الذهب الرقمي</h5>
                  <div className="my-4 text-3xl font-black text-rose-600">
                    {tierCoursePrice}$ <span className="text-xs text-slate-400 font-normal">انضمام كامل</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 border-t border-rose-150 pt-4">
                    <li className="flex items-center gap-1.5 font-bold text-rose-900">🎁 يشمل مجتمع المتابعة وقناة التليجرام</li>
                    <li className="flex items-center gap-1.5">✔️ كشف أسرار أفرع البيع الـ 3 المربحة</li>
                    <li className="flex items-center gap-1.5">✔️ لوحة تخطيط مع معالجة ذكية للخطط الزمنية</li>
                    <li className="flex items-center gap-1.5">✔️ كراسة تطبيق تفاعلية كاملة مع بونصات</li>
                    <li className="flex items-center gap-1.5">✔️ مستند شرح مريم ناهي خطوة بخطوة</li>
                  </ul>
                </div>
                <button
                  onClick={() => launchPaymentCheckout("Course")}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs mt-6 transition cursor-pointer text-center shadow-md animate-bounce"
                >
                  اختبار شراء الاشتراك الشامل 🚀
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB: DIGITAL COURSE INTEGRATED PLATFORM - $147 */}
      {activeTab === "digital_course" && (
        <div className="space-y-8 animate-fadeIn animate-duration-300" style={{ direction: "rtl" }}>
          
          {/* Main Hero Header */}
          <div className="bg-gradient-to-r from-rose-950 via-[#0b1d33] to-[#041121] text-white p-8 rounded-3xl border border-rose-900/60 shadow-2xl relative overflow-hidden" style={{ direction: "rtl" }}>
          </div>
      {selectedLesson && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row h-auto md:h-[620px] text-right" style={{ direction: "rtl" }}>
            
            {/* Left/Top Column: Video & Interactive Slide deck with Audio Visualizer */}
            <div className="md:w-5/12 bg-slate-900 text-white p-6 flex flex-col justify-between space-y-4 border-l border-slate-800">
              <div className="space-y-4 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-rose-600 font-extrabold px-2.5 py-1 rounded-full text-white">الشاشة الذكية للمشاهدة والتطبيق التفاعلي 📱</span>
                    
                    {/* Multilingual Selector inside Lesson Player Modal */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setLessonLang(prev => prev === "ar" ? "en" : "ar");
                          setActiveSlide(0);
                        }}
                        className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold rounded transiton cursor-pointer"
                      >
                        {lessonLang === "ar" ? "English 🇬🇧" : "عربي 🇸🇦"}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedLesson(null);
                          setLessonVideoPlaying(false);
                          setActiveSlide(0);
                        }}
                        className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mode Selector Tab */}
                  <div className="flex bg-[#0b1b2d] p-1 rounded-xl border border-slate-800 text-[10px] text-slate-400 select-none mt-3.5">
                    <button 
                      onClick={() => {
                        setVideoMode("video");
                        setLessonVideoPlaying(false);
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${videoMode === "video" ? "bg-rose-600 text-white shadow-sm" : "hover:text-white"}`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>الفيديو التعليمي عالي الدقة (HD) 🎥</span>
                    </button>
                    <button 
                      onClick={() => {
                        setVideoMode("slides");
                        setLessonVideoPlaying(false);
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${videoMode === "slides" ? "bg-rose-600 text-white shadow-sm" : "hover:text-white"}`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>عرض الشرائح والملخصات 📊</span>
                    </button>
                  </div>

                  {/* High fidelity interactive learning presentation screen */}
                  <div className="bg-slate-950 rounded-2xl aspect-video border border-slate-800/80 p-4.5 mt-3 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                    
                    {/* Screen header */}
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

                    {/* Simulated Voice Waveform Indicator */}
                    {lessonVideoPlaying && soundEnabled && (
                      <div className="flex justify-center items-center gap-[3px] h-3 mb-1 animate-fadeIn select-none">
                        {[0.2, 0.5, 0.8, 0.4, 0.9, 0.5, 0.7, 0.3, 0.6, 0.9, 0.4, 0.7, 0.2].map((val, idx) => (
                          <div 
                            key={idx} 
                            className="w-[1.5px] bg-gradient-to-t from-rose-500 to-rose-400 rounded-full"
                            style={{ 
                              height: `${val * 100}%`,
                              animation: `bounce 0.7s ease-in-out infinite alternate`,
                              animationDelay: `${idx * 0.04}s`
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Screen Footer meta state */}
                    <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-500 border-t border-slate-900 pt-1 select-none">
                      <span>{videoMode === "video" ? `توقيت الفيديو: ${Math.floor(lessonVideoProgress / 20)}: ${String(lessonVideoProgress % 20 * 3).padStart(2, '0')} / 05:00` : (lessonLang === "ar" ? `شريحة ${activeSlide + 1} من 4` : `Slide ${activeSlide + 1} of 4`)}</span>
                      <span>1080P • PRINGLE LEARNING SYSTEM • LIVE</span>
                    </div>

                  </div>

                  {/* Slide navigator or Video scrubber controls */}
                  <div className="flex items-center justify-between gap-2.5 mt-3 select-none">
                    <button 
                      disabled={videoMode === "video" ? lessonVideoProgress === 0 : activeSlide === 0}
                      onClick={() => {
                        if (videoMode === "video") {
                          setLessonVideoProgress(p => Math.max(0, p - 10));
                        } else {
                          setActiveSlide(p => Math.max(0, p - 1));
                          setLessonVideoProgress(p => Math.max(15, p - 20));
                        }
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[10px] text-slate-300 rounded font-bold transition cursor-pointer select-none"
                    >
                      {videoMode === "video" ? "ارجاع 10ث ⏪" : (lessonLang === "ar" ? "🡠 الشريحة السابقة" : "🡠 Prev")}
                    </button>
                    
                    <button
                      onClick={() => {
                        setLessonVideoPlaying(!lessonVideoPlaying);
                      }}
                      className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1 select-none shadow-md"
                    >
                      <span>{videoMode === "video" ? (lessonVideoPlaying ? "إيقاف الفيديو ⏸" : "عرض وتشغيل المحاضرة 🎥 ▶") : (lessonVideoPlaying ? "إيقاف مؤقت ⏸" : "تشغيل الشرح 🔊")}</span>
                    </button>

                    <button 
                      disabled={videoMode === "video" ? lessonVideoProgress >= 100 : activeSlide === 3}
                      onClick={() => {
                        if (videoMode === "video") {
                          setLessonVideoProgress(p => Math.min(100, p + 10));
                        } else {
                          setActiveSlide(p => Math.min(3, p + 1));
                          setLessonVideoProgress(p => Math.min(100, p + 20));
                        }
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[10px] text-slate-300 rounded font-bold transition cursor-pointer select-none"
                    >
                      {videoMode === "video" ? "تقديم 10ث ⏩" : (lessonLang === "ar" ? "التالية 🡢" : "Next 🡢")}
                    </button>
                  </div>
                </div>

                {/* Progress simulator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 select-none">
                    <span>{lessonVideoProgress}% منجز من مادة الشرح</span>
                    <span>المتابعة التفاعلية لمريم ناهي</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full transition-all duration-300" style={{ width: `${lessonVideoProgress}%` }}></div>
                  </div>
                </div>

                {/* Speed Controls & Voice Settings */}
                <div className="flex justify-between items-center bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl select-none text-[9.5px]">
                  <span className="text-slate-400">{lessonLang === "ar" ? "خصائص محاكي الصوت:" : "Voice Features:"}</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)} 
                      className={`px-2 py-0.5 rounded transition ${soundEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}
                    >
                      {soundEnabled ? "مفعل 🔊" : "كتم 🔇"}
                    </button>
                    <button 
                      onClick={() => setPlaybackSpeed(p => p === 1.0 ? 1.5 : (p === 1.5 ? 2.0 : 1.0))} 
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>
                </div>

                {/* Mentorship Card */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2 text-right">
                  <span className="text-[9px] font-black font-mono text-slate-400 block uppercase">استكشاف السر المضمن للريادة</span>
                  <p className="text-[11px] font-black text-rose-300 leading-snug">{LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.secret || selectedLesson.secret}</p>
                  <div className="text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-800/80 pt-2">
                    {lessonLang === "ar" ? "هذا الكورس ذكي ومتكامل، مصمم لغوص الأمانة والتحصيل المباشر دون تعقيدات وبأعلى جودة ومصداقية." : "This curriculum is engineered strictly for high integrity, precision and instant passive cash monetization."}
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Bottom Column: Rich Lessons tabs (reading material, prompts, copy task items) */}
            <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4 bg-slate-50">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">{lessonLang === "ar" ? "شرح وتفاصيل الدرس العملي" : "Practical Lessons Explanations"}</span>
                  <h4 className="text-sm sm:text-base font-black text-[#0b1d33] leading-snug">{LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.title || selectedLesson.title}</h4>
                </div>

                {/* Tabs Selector headers */}
                <div className="flex border-b border-slate-200 select-none">
                  {(["material", "tasks", "prompts"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLessonActiveTab(tab)}
                      className={`flex-1 pb-2.5 text-center text-xs font-black transition-all cursor-pointer relative ${
                        lessonActiveTab === tab 
                          ? "text-rose-600 font-extrabold border-b-2 border-rose-600" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab === "material" && "المادة العلمية 📖"}
                      {tab === "tasks" && "المهام المطلوبة 🎯"}
                      {tab === "prompts" && "خزينة الأوامر 🔑"}
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="h-[280px] md:h-[320px] overflow-y-auto text-slate-700 bg-white border border-slate-150 p-4.5 rounded-2xl shadow-inner scrollbar-thin">
                  
                  {/* Material Tab */}
                  {lessonActiveTab === "material" && (
                    <div className="space-y-3.5 text-right text-xs sm:text-[12.5px] leading-relaxed font-semibold whitespace-pre-wrap text-slate-850">
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.material}
                    </div>
                  )}

                  {/* Tasks Checklist Tab */}
                  {lessonActiveTab === "tasks" && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 mb-2">المهام العملية لبناء مشروع حقيقي والنهوض السلفي المربح الأخلاقي:</p>
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.tasks.map((tsk, index) => {
                        const isTaskCompleted = completedCourseLessons.includes(selectedLesson.id);
                        return (
                          <div key={index} className="bg-slate-50 border p-3.5 rounded-xl flex items-start gap-3 justify-between">
                            <span className="text-xs text-[#0b1d33] font-black leading-snug flex-1 text-right">{tsk}</span>
                            <div className="pt-0.5 shrink-0">
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                isTaskCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {isTaskCompleted ? "منجز ومتحقق ✓" : "بانتظار الإنجاز"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Prompts Treasury Tab */}
                  {lessonActiveTab === "prompts" && (
                    <div className="space-y-4">
                      <p className="text-[10.5px] font-bold text-slate-400 leading-snug text-right">
                        استنسخ هذه الأوامر الذكية الحقيقية وضعها في ChatGPT أو Gemini للحصول على نتائج معيارية مذهلة الدقة وتوفير وقتك:
                      </p>
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.prompts.map((pr, index) => (
                        <div key={index} className="bg-slate-900 text-white p-4 rounded-xl space-y-3 border border-slate-850">
                          <p className="text-xs font-mono select-all text-rose-250 font-bold leading-relaxed text-right" style={{ direction: "rtl" }}>{pr}</p>
                          <div className="flex justify-start">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(pr);
                                alert("✓ تم نسخ الأمر الذكي الحرفي بنجاح! ضعه الآن في ChatGPT أو Gemini للحصول على نتائج مبهرة.");
                              }}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black rounded transition flex items-center gap-1 cursor-pointer"
                            >
                              نسخ الأمر الفعال 📋
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Footer CTA Actions */}
              <div className="flex items-center gap-3 border-t pt-4 bg-slate-5 font-semibold">
                <button
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
                </button>
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setLessonVideoPlaying(false);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl text-center transition cursor-pointer select-none"
                >
                  إغلاق ❌
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STUNNING PREMIUM DESIGNED BONUS DETAIL viewer MODAL */}
      {selectedBonus && (() => {
        const bonusLang = lessonLang; // bound to global layout language context
        const bonusContent = BONUSES_DATA[selectedBonus.file]?.[bonusLang] || BONUSES_DATA[selectedBonus.file]?.ar;
        
        // Define high-fidelity matches highlighter
        const highlightMatchText = (text: string, query: string) => {
          if (!query.trim()) return <span>{text}</span>;
          const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
          return (
            <span>
              {parts.map((part, i) => 
                part.toLowerCase() === query.toLowerCase() 
                  ? <mark key={i} className="bg-amber-400 text-black px-1.5 py-0.2 rounded font-black animate-pulse select-all">{part}</mark> 
                  : part
              )}
            </span>
          );
        };

        // local filter for the items based on search query
        const filteredSections = bonusContent ? bonusContent.sections.map(sec => {
          const matchedItems = sec.items.filter(it => 
            it.label.toLowerCase().includes(bonusSearchQuery.toLowerCase()) || 
            it.details.toLowerCase().includes(bonusSearchQuery.toLowerCase())
          );
          return { ...sec, items: matchedItems };
        }).filter(sec => sec.items.length > 0) : [];

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#0b1322] border border-slate-800 text-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col h-auto md:h-[620px] text-right" style={{ direction: "rtl" }}>
              
              {/* Header section with brand accent */}
              <div className="bg-[#121c30] p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-black text-rose-400 bg-rose-950/50 px-2.5 py-0.5 rounded border border-rose-900/40 uppercase">البونص الحصري الفاخر 🎁</span>
                  <h4 className="text-sm sm:text-base font-black text-white">{selectedBonus.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLessonLang(prev => prev === "ar" ? "en" : "ar");
                      setBonusSearchQuery("");
                    }}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold border border-slate-700 rounded-lg transition"
                  >
                    {bonusLang === "ar" ? "Switch to English 🇬🇧" : "التحويل للغة العربية 🇸🇦"}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedBonus(null);
                      setBonusSearchQuery("");
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subheader Search and Quick Guide */}
              <div className="p-4 bg-[#0e1728]/80 border-b border-indigo-950/40 flex flex-col md:flex-row items-center justify-between gap-3.5 select-none">
                <p className="text-[11px] text-slate-350 text-right leading-relaxed font-medium">
                  {bonusContent?.desc} <br />
                  <span className="text-rose-350 text-[10px] font-bold">* انقر على أي زر نسخ منسق وضعه الفرد للتطبيق الفوري.</span>
                </p>

                {/* Search Bar Input */}
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    placeholder={bonusLang === "ar" ? "ابحث عن كلمة، أمر، أو تفاصيل بالبونص... 🔍" : "Search in bonus keys or prompts... 🔍"} 
                    value={bonusSearchQuery} 
                    onChange={(e) => setBonusSearchQuery(e.target.value)} 
                    className="w-full bg-[#121c30] text-xs text-white placeholder-slate-400 p-2.5 pr-3 pl-8 rounded-xl outline-none focus:ring-1 focus:ring-rose-500 border border-slate-800 text-right font-bold"
                  />
                </div>
              </div>

              {/* Scrollable list of prompts / guide files */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-gradient-to-b from-[#0b1322] to-[#070b14]">
                
                {filteredSections.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2 text-center">
                    <span className="text-3xl">🧩</span>
                    <p className="text-xs font-black">{bonusLang === "ar" ? "لا توجد نتائج مطابقة لبحثك، جرب كتابة مفرقة أخرى" : "No matching items found. Try different filters."}</p>
                  </div>
                ) : (
                  filteredSections.map((sec, sIdx) => {
                    return (
                      <div key={sIdx} className="space-y-3 font-sans text-right" style={{ direction: "rtl" }}>
                        <h5 className="text-xs sm:text-[13px] font-black text-rose-300 border-r-3 border-rose-600 pr-2 pb-0.5 select-none text-right">
                          {sec.heading}
                        </h5>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {sec.items.map((it, iIdx) => {
                            const isSearched = bonusSearchQuery.trim().length > 0;
                            return (
                              <div 
                                key={iIdx} 
                                className={`relative overflow-hidden bg-gradient-to-br from-[#121c30] to-[#0c1424] border p-4.5 rounded-2xl hover:bg-[#15233c] transition-all flex flex-col justify-between space-y-3 text-right ${
                                  isSearched 
                                    ? "border-amber-400/80 shadow-[0_0_15px_rgba(242,169,0,0.15)] ring-1 ring-amber-400/30 scale-[1.01]" 
                                    : "border-slate-800 hover:border-slate-700"
                                }`}
                              >
                                {/* Corner label for target keyword occurrences */}
                                {isSearched && (
                                  <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1d33] px-3 py-0.5 rounded-br-xl text-[8px] font-black tracking-widest animate-pulse select-none uppercase shadow-sm">
                                    محتوى مطابق عالي الدقة ومفحّص ✨
                                  </div>
                                )}

                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[10px] font-black text-[#f2a900] block text-right flex items-center gap-1 justify-start">
                                    <span>{highlightMatchText(it.label, bonusSearchQuery)}</span>
                                    {isSearched && <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">MATCH</span>}
                                  </span>
                                  <p className="text-xs text-slate-300 font-semibold leading-relaxed text-right">
                                    {highlightMatchText(it.details, bonusSearchQuery)}
                                  </p>
                                </div>

                                {it.value && (
                                  <div className="relative group/val">
                                    <div className="bg-[#070c14] border border-indigo-950/60 p-4 rounded-xl font-mono text-[11px] text-rose-100 select-all whitespace-pre-wrap leading-relaxed text-right relative" style={{ direction: "rtl" }}>
                                      {highlightMatchText(it.value, bonusSearchQuery)}
                                    </div>
                                    <span className="absolute top-2 left-2 text-[8px] bg-[#121c30] text-slate-400 group-hover/val:text-rose-400 px-1.5 py-0.5 rounded border border-slate-800 select-none">
                                      تشفير منسق وآلي 🔒
                                    </span>
                                  </div>
                                )}

                                {it.value && (
                                  <div className="flex justify-between items-center select-none pt-1">
                                    <span className="text-[8px] font-bold text-slate-500 font-mono">MATCH_SCORE: {isSearched ? "9.99/10 ✅" : "STANDARD"}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(it.value || "");
                                        alert("✓ تم نسخ صيغة الأمر المحكم بنجاح! جاهز تماماً للوضع بـ ChatGPT أو Gemini.");
                                      }}
                                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg transition-transform active:scale-95 flex items-center gap-1 cursor-pointer shadow-md"
                                    >
                                      نسخ الأمر الكامل جاهزاً 📋
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}

              </div>

              {/* Footer actions with download triggered real UTF-8 file */}
              <div className="bg-[#121c30] p-4 border-t border-slate-800 flex items-center justify-between gap-4 select-none">
                <button
                  onClick={() => triggerRealFileDownload(selectedBonus.file, selectedBonus.title)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <span>تنزيل الدليل كملف حقيقي 💾 ⬇️</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBonus(null);
                    setBonusSearchQuery("");
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إغلاق ❌
                </button>
              </div>

            </div>
          </div>
        );
      })()}

          {/* Main Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Core Lessons & Academic Pathway (Span 2) */}
            <div className="lg:col-span-2 space-y-6 text-right">
              
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-2 select-none justify-start font-sans">
                  <BookOpen className="text-rose-600 w-5 h-5 animate-pulse" />
                  <span>المناهج والدروس العملية المبرمجة للمشروع 📖</span>
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                  تابعي الجولات التعليمية خطوة بخطوة. انقري على "تشغيل الشرح" لفتح المرشد التفاعلي الصوتي، والاطلاع على المادة العلمية، واقتباس الأوامر الذكية المطلوبة للمهمة.
                </p>

                {/* Lessons list rendering */}
                <div className="space-y-4">
                  {Object.entries(LESSONS_DETAILS).map(([id, lessonData]) => {
                    const isCompleted = completedCourseLessons.includes(id);
                    const lesson = {
                      id,
                      title: lessonData.ar.title,
                      desc: lessonData.ar.desc,
                      secret: lessonData.ar.secret,
                      time: lessonData.ar.time
                    };
                    return (
                      <div 
                        key={id} 
                        className={`p-4 rounded-2xl border transition-all duration-250 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          isCompleted 
                            ? "bg-emerald-50/40 border-emerald-100" 
                            : "bg-white border-slate-100 hover:border-rose-100 hover:shadow-md"
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap justify-start">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-rose-50 text-rose-700"
                            }`}>
                              {isCompleted ? "مكتمل ✓" : "جاري التطبيق"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold font-mono">⏱ {lesson.time}</span>
                          </div>
                          <h5 className="font-black text-slate-800 text-xs sm:text-sm leading-snug">{lesson.title}</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed select-none">{lesson.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Column 2: Elegant Sidebar (Span 1) */}
            <div className="space-y-6 font-sans">
              
              {/* Box A: Target Profit Axes */}
              <div className="bg-gradient-to-br from-[#0b1d33] to-[#041121] text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#f2a900] text-xs sm:text-sm flex items-center gap-2 select-none justify-start">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span>محاور وأفرع الأرباح الثلاث المستهدفة 💰</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  هذا الكورس لا يتوقف عند فرع واحد، بل يهيئك لثلاث قنوات مستقلة لكسب الأموال والتسليم التلقائي:
                </p>
                <div className="space-y-3 pt-1 text-xs text-right">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-black text-rose-400 text-[10px]">01 / بيع المنتجات الرقمية الفاخرة</span>
                    <p className="text-slate-300 text-[10px] leading-relaxed">توليف أدلة الأطباق، كتب الطهي، مستندات الـ PLR وبيع مئات المطبوعات مباشرة.</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-black text-[#f2a900] text-[10px]">02 / تسويق أدوات المنصة بالعمولة</span>
                    <p className="text-slate-300 text-[10px] leading-relaxed">ترويج رابط Canva و ChatGPT الخاص بك وكسب عمولات متتالية عند تجديد اشتراك عملائك.</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-black text-emerald-400 text-[10px]">03 / إعادة ترخيص الاستخدام للطلبة الجدد</span>
                    <p className="text-slate-300 text-[10px] leading-relaxed">تصدير أدلتك برخصة إعادة البيع للترقية وتحصيل ضعف القيمة دون منافسين.</p>
                  </div>
                </div>
              </div>

              {/* Box B: Exquisite Bonuses Bag */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#0b1d33] text-xs sm:text-sm flex items-center gap-2 select-none">
                  <Award className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>حقيبة البونصات الحصرية المرفقة الكنز 🎁</span>
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">انقر لتصفح البونص تفاعلياً، نسخ الأوامر الجاهزة، أو تنزيل الملف كاملاً مجاناً:</p>
                
                <div className="space-y-3 font-sans">
                  {[
                    { title: "الحقيبة الذهبية: 150 أمر محكم للذكاء الاصطناعي وصياغة الوصفات والتسويق", file: "Commands_Treasury_Arabic.pdf", size: "4.5 MB" },
                    { title: "دليل تشييد المتاجر: إعداد وبناء متجر Salla & YouCan في 48 ساعة فقط", file: "Digital_Storefront_Guide.pdf", size: "12.2 MB" },
                    { title: "نظم الانتشار المجاني: ملف تخطيط الفيديوهات العضوية المؤدية للمبيعات", file: "Organic_Traffic_Formula.pdf", size: "3.1 MB" }
                  ].map((bon, idx) => (
                    <div 
                      key={idx} 
                      className="group bg-gradient-to-l from-slate-50 to-white hover:from-rose-50/20 hover:to-white border border-slate-150 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right transition-all hover:border-rose-200 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
                    >
                      {/* Ribbon indicator */}
                      <span className="absolute top-0 right-0 w-1.5 h-full bg-rose-500 rounded-l-full opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      
                      <div 
                        onClick={() => setSelectedBonus(bon)} 
                        className="space-y-1 flex-1 text-right select-none pr-1.5"
                      >
                        <span className="text-[11.5px] font-black text-[#0b1d33] block leading-tight group-hover:text-rose-700 transition-colors text-right">{bon.title}</span>
                        <div className="flex items-center gap-2 text-[9.5px] justify-start mt-1">
                          <span className="text-slate-400 font-mono font-bold">{bon.file} • {bon.size}</span>
                          <span className="text-rose-500 font-bold bg-rose-100/75 px-1.5 py-0.2 rounded">تفاعلي ⚡ 👁️</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 select-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBonus(bon);
                          }}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-[#0b1d33] hover:bg-black text-white text-[10px] font-extrabold rounded-lg transition cursor-pointer"
                        >
                          تصفح 👁️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerRealFileDownload(bon.file, bon.title);
                          }}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg transition text-center cursor-pointer"
                        >
                          تنزيل 💾
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box C: Live Interactive Expert Support Channel (Q&A & Verification) */}
              <div className="bg-gradient-to-br from-indigo-50/70 via-rose-50/70 to-amber-50/70 p-6 rounded-3xl border border-rose-100/40 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2 select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                      <h4 className="font-extrabold text-[#0b1d33] text-xs sm:text-sm text-right">قناة المتابعة والرد الفوري الذكي 👥</h4>
                    </div>
                    <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">استشارة حية فاعلة</span>
                  </div>

                  {/* Chat messages list */}
                  <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rose-200">
                    {supportMessages.map((msg, mIdx) => (
                      <div 
                        key={mIdx} 
                        className={`p-3 rounded-2xl text-right animate-fadeIn text-xs leading-relaxed font-sans ${
                          msg.role === "coach" 
                            ? "bg-[#0b1d33] text-white rounded-tr-none border border-slate-800" 
                            : "bg-white text-slate-800 rounded-tl-none border border-rose-100/70 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-current/10 pb-1 mb-1.5 select-none text-[9px] font-black opacity-80">
                          <span>{msg.role === "coach" ? "🎓 مريم ناهي (المدربة الذكية)" : "👤 استشارتك الكورسية"}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className="whitespace-pre-wrap font-semibold text-[10.5px] leading-relaxed text-right">{msg.text}</p>
                      </div>
                    ))}

                    {supportLoading && (
                      <div className="bg-white/85 border border-rose-100 p-3 rounded-2xl flex items-center justify-center gap-2 text-right select-none animate-pulse">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[10px] text-slate-600 font-bold font-sans">تقوم مريم بتحليل سؤالك لتحدد وتجيب المطلب... 📝</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Controls */}
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
                  </div>
                  <textarea 
                    value={supportQuery}
                    onChange={(e) => setSupportQuery(e.target.value)}
                    placeholder="اكتب استشارتك أو سؤالك حول تطبيق المناهج أو اختيار الأطباق هنا..."
                    rows={2}
                    disabled={supportLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSupportSubmit();
                      }
                    }}
                    className="w-full text-xs p-2.5 border border-rose-200/60 rounded-xl bg-white outline-none focus:border-rose-500 placeholder-slate-400 text-right font-semibold text-slate-800"
                  ></textarea>
                  <button 
                    onClick={handleSupportSubmit}
                    disabled={supportLoading || !supportQuery.trim()}
                    className="w-full py-2 bg-[#0b1d33] hover:bg-black disabled:bg-slate-400 text-white font-bold text-[10.5px] rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>إرسال استشارة للمتابعة الحية وسؤال المدرب 💬</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Section: High-Level Interactive AI Tools for Course Students */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-8">
            <div className="border-b pb-4 select-none text-right">
              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                مطورين من برينجل للحلول التقنية والذكاء الاصطناعي 🧠
              </span>
              <h4 className="font-extrabold text-[#0b1d33] text-base sm:text-lg mt-2 flex items-center gap-2 justify-start">
                <Sparkles className="w-5 h-5 text-rose-500 animate-pulse animate-duration-1000" />
                <span>أدوات الذكاء الاصطناعي الراقية لتذليل معضلات الطلاب (AI Study Assistants)</span>
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                قوتنا تنعكس في الأفعال لا الأقوال. لقد طورنا لك 3 مساعظات ذكاء اصطناعي تفاعلية فائقة الأداء من طراز Gemini لمعالجة الأفكار وصياغة الكتب الرقمية ووضع الجداول التطبيقية الـ 30 بمجموعات مبرمجة تماماً.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Tool A Interface: Secrets Decoder */}
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-right flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 select-none justify-start">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <Layers className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <h5 className="font-black text-[#0b1d33] text-xs sm:text-xs">🔬 مفكك الأسرار الربحية وكاشف دراسات الحالة</h5>
                      <p className="text-slate-400 text-[10px]">يكشف لك خطة التطبيق العملي للسر مع نموذج مالي وإداري مبسط.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5 text-right font-medium">
                      <label className="text-[10px] font-black text-slate-700 block">اختر المجال والسر المستورد:</label>
                      <select
                        value={courseSecretArea}
                        onChange={(e) => setCourseSecretArea(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 bg-white border rounded-xl outline-none focus:border-rose-500 text-right text-slate-800"
                      >
                        <option value="إعادة هندسة أرباح المنتجات وتوليف PLR ذو الجودة العالية">إعادة هندسة أرباح المنتجات وتوليف PLR ذو الجودة العالية 🎁</option>
                        <option value="صناعة أدب الطبخ والأطباق العصرية وتصديرها كملفات رقمية ممتازة للبيع">صناعة أدب الطبخ والأطباق العصرية وتصديرها كملفات رقمية ممتازة للبيع 🍳</option>
                        <option value="بناء قنوات الاستقطاب التلقائي للعملاء دون الظهور بالوجه">بناء قنوات الاستقطاب التلقائي للعملاء دون الظهور بالوجه 📽️</option>
                        <option value="استغلال مسارات الترخيص التجاري الثنائي لتوسيع قاعدة العملاء">استغلال مسارات الترخيص التجاري الثنائي لتوسيع قاعدة العملاء 📑</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-right font-medium">
                      <label className="text-[10px] font-black text-slate-700 block">المخرجات والهدف الملموس:</label>
                      <input 
                        type="text"
                        value={courseTargetOutput}
                        onChange={(e) => setCourseTargetOutput(e.target.value)}
                        placeholder="مثال: دليلاً تفصيلياً لبيع كتب الوصفات وصنع أول 150$"
                        className="w-full text-xs p-2.5 bg-white border rounded-xl outline-none focus:border-rose-500 placeholder-slate-400 text-slate-800 font-semibold text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => callAiToolHelper("course_materializer")}
                    disabled={generatingCourseSecret}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400/80 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {generatingCourseSecret ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                        <span>جاري التحليل وتوليد الحالة...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تحليل وفك تشفير السر الربحي ✨</span>
                      </>
                    )}
                  </button>

                  {/* Secret Decoder Response Container */}
                  {courseSecretResult && (
                    <div className="bg-white border rounded-xl p-4 text-right animate-fadeIn max-h-[350px] overflow-y-auto space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 select-none">
                        <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          جاهز للتطبيق فوراً
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(courseSecretResult);
                            alert("تم نسخ المخرجات والتحليلات لمفكرة الحساب بنجاح!");
                          }}
                          className="text-rose-600 hover:text-rose-800 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-0.5 rounded"
                        >
                          نسخ الشرح 📋
                        </button>
                      </div>
                      <div className="text-slate-750 text-[11.5px] leading-relaxed space-y-2 whitespace-pre-wrap font-semibold font-sans">
                        {courseSecretResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tool B Interface: Roadmap Planner */}
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-right flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 select-none justify-start">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Calendar className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <h5 className="font-black text-[#0b1d33] text-xs sm:text-xs">🗓️ مصمم الخطط الزمنية وجداول المتابعة الـ 30 يوماً</h5>
                      <p className="text-slate-400 text-[10px]">يبرمج لك مساراً تفصيلياً مع فترات ساعات الفراغ والبوابة المالية.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 gap-3.5">
                      <div className="space-y-1.5 font-medium text-right">
                        <label className="text-[10px] font-black text-slate-700 block">المجال المستهدف للتجارة المعرفية :</label>
                        <input 
                          type="text"
                          value={coursePlannedNiche}
                          onChange={(e) => setCoursePlannedNiche(e.target.value)}
                          placeholder="مثال: المطبخ الخليجي أو قوالب الإعلانات"
                          className="w-full text-xs p-2.5 bg-white border rounded-xl outline-none focus:border-rose-500 font-bold text-slate-800 text-right"
                        />
                      </div>
                      <div className="space-y-1.5 font-medium text-right">
                        <label className="text-[10px] font-black text-slate-700 block">وقتك اليومي المكرّس للتطبيق:</label>
                        <select
                          value={courseDailyHours}
                          onChange={(e) => setCourseDailyHours(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 bg-white border rounded-xl outline-none focus:border-[#0b1d33] text-right text-slate-800"
                        >
                          <option value="ساعة واحدة صامتة للتحصيل">ساعة واحدة صامتة للتطبيق ⏳</option>
                          <option value="ساعتان (2 ساعة) بتركيز عالٍ">ساعتان بتركيز عالٍ ⚡</option>
                          <option value="أربع ساعات مخصصة للتجهيز الفعلي">4 ساعات مخصصة للتجهيز الفعلي 🚀</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 font-medium text-right">
                      <label className="text-[10px] font-black text-slate-700 block">هدف وقناة استقبال المبيعات:</label>
                      <input 
                        type="text"
                        value={courseGoalUrl}
                        onChange={(e) => setCourseGoalUrl(e.target.value)}
                        placeholder="مثال: محفظة Zain Cash وتسليم الملفات التلقائي"
                        className="w-full text-xs p-2.5 bg-white border rounded-xl outline-none focus:border-rose-500 font-bold text-slate-800 text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => callAiToolHelper("course_roadmap_planner")}
                    disabled={generatingCoursePlan}
                    className="w-full py-2.5 bg-[#0b1d33] hover:bg-black disabled:bg-slate-400 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {generatingCoursePlan ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                        <span>جاري صياغة الجداول اليومية...</span>
                      </span>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>بناء الجدول والمسار الزمني المستهدف ⚡</span>
                      </>
                    )}
                  </button>

                  {/* Plan Results Container */}
                  {coursePlanResult && (
                    <div className="bg-white border rounded-xl p-4 text-right animate-fadeIn max-h-[350px] overflow-y-auto space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 select-none">
                        <span className="text-[10px] text-amber-600 font-black flex items-center gap-1">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          خطة الـ 30 يوماً جاهزة
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coursePlanResult);
                            alert("تم نسخ جدولك الـ 30 يوماً بنجاح لتحفيز نفسك يومياً!");
                          }}
                          className="text-amber-700 hover:text-amber-900 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-0.5 rounded"
                        >
                          نسخ الجدول 📋
                        </button>
                      </div>
                      <div className="text-slate-750 text-[11.5px] leading-relaxed space-y-2 whitespace-pre-wrap font-semibold font-sans">
                        {coursePlanResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tool C Interface: Future Product Materializer */}
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-right flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 select-none justify-start">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Award className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <h5 className="font-black text-[#0b1d33] text-xs sm:text-xs">🚀 باني ومصنف المنتجات الرقمية الحديثة المتكامل (PLR Creator)</h5>
                      <p className="text-slate-400 text-[10px]">يؤلف ويهيكل كتيبك الأول ومقادير الأطباق وصيغ الأوامر الفورية للبيع المعرفي.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5 text-right font-medium">
                      <label className="text-[10px] font-black text-slate-700 block">موضوع المنتج الرقمي المستقبلي:</label>
                      <input 
                        type="text"
                        value={courseProductTopic}
                        onChange={(e) => setCourseProductTopic(e.target.value)}
                        placeholder="مثال: أطباق المطبخ الصحي الخليجي العصري"
                        className="w-full text-xs p-2.5 bg-white border rounded-xl outline-none focus:border-rose-500 font-bold text-slate-800 text-right"
                      />
                    </div>

                    <div className="space-y-1.5 text-right font-medium">
                      <label className="text-[10px] font-black text-slate-700 block">شكل ونوع وهيكلية الكتيب:</label>
                      <select
                        value={courseProductType}
                        onChange={(e) => setCourseProductType(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 bg-white border rounded-xl outline-none focus:border-[#0b1d33] text-right text-slate-800"
                      >
                        <option value="كتاب طبخ ووصفات عصرية مبتكرة ومقادير رياضية">كتاب طبخ ووصفات عصرية مبتكرة ومقادير رياضية 🍳</option>
                        <option value="دليل أوامر ذكاء اصطناعي وصياغة هندسة التوليف">دليل أوامر ذكاء اصطناعي وصياغة هندسة التوليف 🤖</option>
                        <option value="كراسة عمل تفاعلية لبناء الخطط المالية وتطوير المشاريع">كراسة عمل تفاعلية لبناء الخطط المالية وتطوير المشاريع 📊</option>
                        <option value="قالب تخطيط وإدارة المهام متكامل للرواد الصغار">قالب تخطيط وإدارة المهام متكامل للرواد الصغار 📁</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => callAiToolHelper("course_product_generator")}
                    disabled={generatingCourseProduct}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {generatingCourseProduct ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                        <span>جاري صياغة وتوليف المنتج المعرفي...</span>
                      </span>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>تصميم وتأليف مسوّدة الكتيب للبيع 🚀</span>
                      </>
                    )}
                  </button>

                  {/* Product Creator Response Container */}
                  {courseProductResult && (
                    <div className="bg-white border rounded-xl p-4 text-right animate-fadeIn max-h-[350px] overflow-y-auto space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 select-none">
                        <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          تم توليد الكتيب بنجاح
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(courseProductResult);
                            alert("تم نسخ محتوى كتاب الطلاب الجديد! يمكنك تصديره مباشرة وملاءمته بنجاح للبدء بالربح الحقيقي.");
                          }}
                          className="text-emerald-700 hover:text-emerald-900 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded"
                        >
                          نسخ الكتيب الكامل 📋
                        </button>
                      </div>
                      <div className="text-slate-750 text-[11.5px] leading-relaxed space-y-2 whitespace-pre-wrap font-semibold font-sans">
                        {courseProductResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Timeline Visual Progress Track Node Flow */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base flex items-center gap-2 select-none border-b pb-3.5">
              <Calendar className="text-rose-600 w-5 h-5" />
              <span>الخطة الزمنية الحقيقية لنجاح المشاريع الطلابية (The Authentic 30-Day Launch Timeline)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative select-none">
              
              {[
                { 
                  week: "الأسبوع الأول", 
                  title: "دراسة وحفر الأسرار", 
                  color: "bg-rose-600", 
                  steps: ["اختيار النيتش والبراند", "تأكيد المصداقية وإحصاء الفئات", "فك شفرات تسعير الأدلة"] 
                },
                { 
                  week: "الأسبوع الثاني", 
                  title: "صياغة وتخمير المنتج", 
                  color: "bg-[#0b1d33]", 
                  steps: ["توليف ملفك الرقمي الأول", "تنسيق الفصول والوصفات تجارياً", "بناء كراسة العمل بونص"] 
                },
                { 
                  week: "الأسبوع الثالث", 
                  title: "بناء قمع المبيعات المحكم", 
                  color: "bg-amber-500", 
                  steps: ["ربط معالجات الدفع (Zain Cash)", "إقامة شاشات الـ Checkout", "تصميم صفحات الهبوط الموثوقة"] 
                },
                { 
                  week: "الأسبوع الرابع", 
                  title: "الانتشار وحصد الأرصدة", 
                  color: "bg-emerald-600", 
                  steps: ["إطلاق محتوى الكبسولة العضوية", "تلقي المبيعات وتتبع الحسابات", "متابعة الطلبة واستمرار الأرباح"] 
                }
              ].map((timeline, tidx) => (
                <div key={tidx} className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3.5 text-right relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#0b1d33] bg-rose-50 px-2 py-0.5 rounded-full">{timeline.week}</span>
                    <span className={`w-3.5 h-3.5 ${timeline.color} rounded-full`}></span>
                  </div>
                  <h5 className="font-black text-[#0b1d33] text-xs sm:text-sm">{timeline.title}</h5>
                  <ul className="text-[10.5px] text-slate-500 space-y-2 border-t pt-3">
                    {timeline.steps.map((st, sidx) => (
                      <li key={sidx} className="flex items-center gap-1.5 font-medium leading-tight">
                        <span className="text-emerald-500 font-bold">✓</span>
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>
          </div>

        </div>
      )}

      {/* REAL-TIME INTERACTIVE LESSON MODAL PLAYER */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row h-auto md:h-[620px] text-right" style={{ direction: "rtl" }}>
            
            {/* Left/Top Column: Video Simulation & Media Controls */}
            <div className="md:w-5/12 bg-slate-900 text-white p-6 flex flex-col justify-between space-y-4 border-l border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-rose-600 font-extrabold px-2.5 py-1 rounded-full text-white">البث العملي المعياري 🎥</span>
                  <button 
                    onClick={() => {
                      setSelectedLesson(null);
                      setLessonVideoPlaying(false);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Simulated Screen */}
                <div className="bg-slate-950 rounded-2xl aspect-video border border-slate-800/80 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                  {lessonVideoPlaying ? (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-rose-950/20 to-slate-950 flex flex-col items-center justify-center text-center p-4 space-y-3.5">
                      <span className="text-emerald-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        بث المحاكاة نشط حالياً
                      </span>
                      <p className="text-xs text-slate-300 font-black leading-tight">{selectedLesson.title}</p>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <button 
                          onClick={() => setLessonVideoPlaying(false)}
                          className="px-3.5 py-1.5 bg-rose-600 rounded-lg hover:bg-rose-700 transition font-bold"
                        >
                          إيقاف مؤقت ⏸
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-2.5">
                      <button 
                        onClick={() => {
                          setLessonVideoPlaying(true);
                          // progressive simulation
                          const interval = setInterval(() => {
                            setLessonVideoProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                return 100;
                              }
                              return prev + 5;
                            });
                          }, 1500);
                        }}
                        className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white text-lg transition-transform hover:scale-105 active:scale-95 shadow-md shadow-rose-950/50 cursor-pointer"
                      >
                        ▶
                      </button>
                      <p className="text-[10px] font-bold text-slate-400">انقر لتشغيل المقطع العملي للدرس</p>
                    </div>
                  )}
                  {/* Subtle lower vignette */}
                  <div className="absolute bottom-1 right-2 left-2 text-[8px] font-mono text-slate-500 text-left">
                    SIMULATION • B3-FLASH • UTC
                  </div>
                </div>

                {/* Progress simulator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>{lessonVideoProgress}% منجز</span>
                    <span>المشاهدة التفاعلية</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full transition-all duration-300" style={{ width: `${lessonVideoProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Mentorship Card */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2 text-right">
                <span className="text-[9px] font-black font-mono text-slate-400 block uppercase">استكشاف السر المضمن</span>
                <p className="text-[11px] font-black text-rose-300 leading-snug">{selectedLesson.secret}</p>
                <div className="text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-800/80 pt-2">
                  هذا الكورس لا يقتصر على سرد النصوص، بل يمنحك سر الصناعة والمعايرة الدقيقة لكل مخرجاتك بموثوقية.
                </div>
              </div>
            </div>

            {/* Right/Bottom Column: Rich Lessons tabs (reading material, prompts, copy task items) */}
            <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4 bg-slate-50 text-right" style={{ direction: "rtl" }}>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">محتوى الجولة الدراسية الشاملة</span>
                  <h4 className="text-sm sm:text-base font-black text-[#0b1d33] leading-snug">{selectedLesson.title}</h4>
                </div>

                {/* Tabs Selector headers */}
                <div className="flex border-b border-slate-250 select-none" style={{ direction: "rtl" }}>
                  {(["material", "tasks", "prompts"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLessonActiveTab(tab)}
                      className={`flex-1 pb-2.5 text-center text-xs font-black transition-all cursor-pointer relative ${
                        lessonActiveTab === tab 
                          ? "text-rose-600 font-extrabold border-b-2 border-rose-600" 
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab === "material" && "المادة العلمية 📖"}
                      {tab === "tasks" && "المهام المطلوبة 🎯"}
                      {tab === "prompts" && "خزينة الأوامر 🔑"}
                    </button>
                  ))}
                </div>

                {/* Tab content area */}
                <div className="h-[280px] md:h-[320px] overflow-y-auto text-slate-700 bg-white border border-slate-150 p-4.5 rounded-2xl shadow-inner scrollbar-thin text-right" style={{ direction: "rtl" }}>
                  
                  {/* Material Tab */}
                  {lessonActiveTab === "material" && (
                    <div className="space-y-3.5 text-right text-xs sm:text-[12.5px] leading-relaxed font-semibold whitespace-pre-wrap text-slate-850">
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.material}
                    </div>
                  )}

                  {/* Tasks Checklist Tab */}
                  {lessonActiveTab === "tasks" && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 mb-2">المهام العملية لبناء مشروع حقيقي والنهوض السلفي:</p>
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.tasks?.map((tsk: string, index: number) => {
                        const isTaskCompleted = completedCourseLessons.includes(selectedLesson.id);
                        return (
                          <div key={index} className="bg-slate-50 border p-3.5 rounded-xl flex items-start gap-3 justify-between">
                            <span className="text-xs text-[#0b1d33] font-black leading-snug">{tsk}</span>
                            <div className="pt-0.5 shrink-0">
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                isTaskCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {isTaskCompleted ? "منجز ووحدت القيمة" : "قيد المراجعة"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Prompts Treasury Tab */}
                  {lessonActiveTab === "prompts" && (
                    <div className="space-y-4">
                      <p className="text-[10.5px] font-bold text-slate-400 leading-snug">
                        استنسخ هذه الأوامر الذكية الحقيقية وضعها في ChatGPT أو Gemini للحصول على مسودة فصول ووصفات معيارية مذهلة الدقة وتوفير وقتك:
                      </p>
                      {LESSONS_DETAILS[selectedLesson.id]?.[lessonLang]?.prompts?.map((pr: string, index: number) => (
                        <div key={index} className="bg-slate-900 text-white p-4 rounded-xl space-y-3 border border-slate-850">
                          <p className="text-xs font-mono select-all text-rose-250 font-bold leading-relaxed">{pr}</p>
                          <div className="flex justify-start">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(pr);
                                alert("✓ تم نسخ الأمر الذكي الحرفي بنجاح! ضعه الآن في ChatGPT أو Gemini للحصول على نتائج مبهرة.");
                              }}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black rounded transition flex items-center gap-1 cursor-pointer"
                            >
                              نسخ الأمر الفعال 📋
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Footer CTA Actions */}
              <div className="flex items-center gap-3 border-t pt-4 bg-slate-5 font-semibold">
                <button
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
                    alert(`✓ تهانينا! قمت بإكمال الدرس [${selectedLesson.title}] بنجاح، تم رفع نسبة إنجاز منهجك بنجاح!`);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl text-center shadow-md transition cursor-pointer select-none"
                >
                  تأشير الحلقة كمكتملة والانتقال التالي ☑️
                </button>
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setLessonVideoPlaying(false);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl text-center transition cursor-pointer select-none"
                >
                  إغلاق ❌
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

{/* TAB 5 CONTENT: SUPERADMIN CONTROL OVER EVERYTHING & SIMULATED USERS */}
      {activeTab === "users_admin" && (
        <div className="space-y-6" style={{ direction: "rtl" }}>
          
          {/* Section 1: Dynamic Global Platform Variables & Controls */}
          <div className="bg-[#0b1d33] text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-right">
            <div className="border-b border-indigo-950 pb-4 select-none flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-[#f2a900]/10 text-[#f2a900] font-black px-3 py-1 rounded-full uppercase border border-[#f2a900]/20">
                  Global System Variables & Power Panel
                </span>
                <h4 className="font-extrabold text-white text-base sm:text-lg mt-1.5 flex items-center gap-2">
                  <span>👑 لوحة التحكم والمشرف السيادي في كل شاردة وواردة</span>
                </h4>
              </div>
              <span className="text-2xl animate-spin text-[#f2a900]">⚙️</span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              بصفتكِ المشرفة الحصرية والمؤسسة للمنصة (مريم ناهي)، تمنحكِ هذه اللوحة التحكم الفوقي المطلق لتعطيل الميزات، فرض عمليات المحاكاة للدفع، وتعديل قيم الخصومات العالمية وتعديل الإشارات، لتوجيه تجربة الطلاب آلياً.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              
              {/* Box 1: Pre-Checkout Force */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5 flex flex-col justify-between">
                <div>
                  <h6 className="font-bold text-xs text-[#f2a900] flex items-center gap-1.5">
                    <span>🛑 الدفع الإجباري للتحميل</span>
                  </h6>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    عند التفعيل، لن يتمكن الزائر من تحميل كراسة العمل أو نسخ القوالب الجاهزة إلا بعد محاكاة الدفع بنجاح.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-[10px] text-slate-400">حالة الخاصية:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={forcePreCheckoutMode} 
                      onChange={(e) => setForcePreCheckoutMode(e.target.checked)} 
                    />
                    <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:bg-[#f2a900] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
              </div>

              {/* Box 2: Generative AI Student Workspace */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5 flex flex-col justify-between">
                <div>
                  <h6 className="font-bold text-xs text-[#f2a900] flex items-center gap-1.5">
                    <span>🧠 أدوات الذكاء التوليدي</span>
                  </h6>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    تفعيل أو إفشال لوحة توليد سكريبتات تيك توك ومقالات الذكاء الاصطناعي المجانية المتاحة لتسهيل الرحلة.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-[10px] text-slate-400">متاحة ومجانية:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={enableStudentAiWorkspace} 
                      onChange={(e) => setEnableStudentAiWorkspace(e.target.checked)} 
                    />
                    <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:bg-[#f2a900] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
              </div>

              {/* Box 3: Discount Percentage Slider */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 flex flex-col justify-between">
                <div>
                  <h6 className="font-bold text-xs text-[#f2a900]">🏷️ نسبة الخصم العالمي</h6>
                  <p className="text-slate-400 text-[11px] mt-1">
                    أدخل نسبة لتفعيل الخصم فورا لكافة الباقات للطلاب والزوار الجدد (مثل 15% أو 30%).
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="75" 
                      value={globalDiscountPercentage}
                      onChange={(e) => setGlobalDiscountPercentage(e.target.value)}
                      className="w-full accent-[#f2a900]" 
                    />
                    <span className="font-mono text-sm font-black text-[#f2a900]">{globalDiscountPercentage}%</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 select-none">
                  * سيتم تطبيقه على فواتير بوابة الدفع تلقائياً.
                </div>
              </div>

              {/* Box 4: Platform Overall Status */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5 flex flex-col justify-between">
                <div>
                  <h6 className="font-bold text-xs text-[#f2a900]">🛠️ الحالة العامة للمنصة</h6>
                  <p className="text-slate-400 text-[11px] mt-1">
                    حدد رتبة تشغيل البنية التحتية لعرضها للطلاب لزيادة مصداقية الموثوقية والأمان الفني.
                  </p>
                </div>
                <select
                  value={adminPlatformStatus}
                  onChange={(e) => setAdminPlatformStatus(e.target.value)}
                  className="w-full p-1.5 bg-slate-900 text-[11px] font-bold border border-slate-800 rounded outline-none text-[#f2a900]"
                >
                  <option value="نشط ومستقر (Live & Active)">نشط ومستقر جداً ✓</option>
                  <option value="صيانة مجدولة خفيفة">تحت صيانة مجدولة بسيطة 🛠️</option>
                  <option value="تحت التحديث للتكامل المستمر">جاري تحديث قاعدة البيانات 🐳</option>
                </select>
              </div>

            </div>

            {/* Notification push system */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
              <h5 className="font-black text-xs text-[#f2a900] flex items-center gap-2">
                <span>📢 بث إشعار توجيهي فوري للطلاب (Push Realtime Guide Broadcast)</span>
              </h5>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={userNotificationMsg}
                  onChange={(e) => setUserNotificationMsg(e.target.value)}
                  placeholder="أدخل رسالة حية لتظهر في شريط ترحيب الطلاب..." 
                  className="flex-1 text-xs font-semibold p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#f2a900]"
                />
                <button
                  onClick={() => alert("تم تعميم الرسالة ونشرها لجميع الطلاب والرواد النشطين بنجاح عبر نظام البث الفوري!")}
                  className="px-5 py-2.5 bg-[#f2a900] hover:bg-[#d69600] text-[#0b1d33] text-xs font-black rounded-lg transition"
                >
                  حفظ وتعميم فوري
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Complete User Accounts Simulator Dashboard & Actions */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="border-b pb-4 select-none flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-850 font-black px-3 py-1 rounded-full uppercase">
                  Simulated Student Database
                </span>
                <h4 className="font-extrabold text-[#0b1d33] text-sm sm:text-base mt-1.5">👥 لوحة إدارة حسابات الطلاب والعملاء وتعديل الصلاحيات</h4>
              </div>
              <span className="text-xl">🗂️</span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              تحكم بجميع تفاصيل المشاركين المسجلين في كورس الـ 14 يوماً لإطلاق المنتج الرقمي. يمكنك تجميد حساب العميل لتوقير الدفع، ترقية مستوى الطلاب، أو إنشاء وتخيل عضوية جديدة بالكامل لتجربة الكفاءة.
            </p>

            {/* Simulated Add user form inline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
              <h5 className="font-extrabold text-xs text-slate-800">➕ إضافة وتسجيل حساب عميل/عضو جديد بالمنظومة آلياً:</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">اسم الطالب الكامل:</span>
                  <input 
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="مثال: يوسف الكرخي"
                    className="w-full text-xs p-2 bg-white border rounded outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">البريد الإلكتروني:</span>
                  <input 
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="yousef@gmail.com"
                    className="w-full text-xs p-2 bg-white border rounded outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">الباقة المشتراة الافتراضية:</span>
                  <select 
                    value={newUserTier}
                    onChange={(e: any) => setNewUserTier(e.target.value)}
                    className="w-full text-xs p-2 bg-white border rounded outline-none focus:border-indigo-600"
                  >
                    <option value="Bronze">الباقة البرونزية</option>
                    <option value="Silver">الباقة الفضية</option>
                    <option value="Gold">الباقة الذهبية VIP</option>
                  </select>
                </div>
                <div className="space-y-1 flex items-end">
                  <button
                    onClick={() => {
                      if (!newUserName || !newUserEmail) {
                        alert("يرجى إكمال الاسم والبريد أولاً!");
                        return;
                      }
                      const nu = {
                        id: Date.now(),
                        name: newUserName,
                        email: newUserEmail,
                        role: `طالب منضم حديثاً 📊`,
                        progress: "5%",
                        status: "نشط",
                        tier: `${newUserTier} Tier`
                      };
                      setSimulatedUsers([nu, ...simulatedUsers]);
                      setNewUserName("");
                      setNewUserEmail("");
                      alert("تم تسجيل حساب الطالب الجديد في قاعدة البيانات المحلية بنجاح ومزامنة لوحة المشاهد السريعة!");
                    }}
                    className="w-full py-2 bg-[#0b1d33] hover:bg-slate-800 text-white text-xs font-black rounded-lg transition"
                  >
                    تسجيل وتنشيط العضوية
                  </button>
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-xs text-right whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 font-extrabold text-slate-700 select-none">
                    <th className="p-3">رقم العضو</th>
                    <th className="p-3">اسم المستخدم</th>
                    <th className="p-3">البريد الإلكتروني</th>
                    <th className="p-3">الباقة المقتناة</th>
                    <th className="p-3">نسبة التقدم بالدليل</th>
                    <th className="p-3">حالة الحساب الكلي</th>
                    <th className="p-3 text-center animate-pulse">عمليات وإجراءات سيادية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {simulatedUsers.map((usr, i) => (
                    <tr key={usr.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-slate-400 font-mono">#{1020 + i}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-[#0b1d33]">{usr.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{usr.role}</div>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-600">{usr.email}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-100 text-[#0b1d33] font-black px-2 py-0.5 rounded border border-slate-200">
                          {usr.tier}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: usr.progress }}></div>
                          </div>
                          <span className="font-mono font-bold text-[#0b1d33]">{usr.progress}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          usr.status === "نشط" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}>
                          ● {usr.status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            const updated = simulatedUsers.map(u => 
                              u.id === usr.id ? { ...u, status: u.status === "نشط" ? "مجمّد" : "نشط" } : u
                            );
                            setSimulatedUsers(updated);
                          }}
                          className="px-2.5 py-1 text-[10px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer"
                        >
                          {usr.status === "نشط" ? "🔐 تجميد الحساب" : "🔓 إلغاء التجميد"}
                        </button>
                        <button
                          onClick={() => {
                            const updated = simulatedUsers.map(u => 
                              u.id === usr.id ? { ...u, role: "طالب فائق (VIP) ⭐", tier: "Gold VIP" } : u
                            );
                            setSimulatedUsers(updated);
                            alert("تم ترقية العضو بنجاح للباقة الذهبية المطلقة وكبار الشخصيات!");
                          }}
                          className="px-2.5 py-1 text-[10px] font-black bg-[#f2a900]/10 hover:bg-[#f2a900]/20 text-[#0b1d33] rounded transition cursor-pointer"
                        >
                          ⭐ ترقية لـ VIP
                        </button>
                        <button
                          onClick={() => {
                            if (usr.id === 1) {
                              alert("عذراً، لا يمكن حذف حساب المؤسسة الأساسي!");
                              return;
                            }
                            const updated = simulatedUsers.filter(u => u.id !== usr.id);
                            setSimulatedUsers(updated);
                          }}
                          className="px-2 py-1 text-[10px] font-black bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition cursor-pointer"
                        >
                          🗑️ حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* SECURE CHECKOUT INTERACTIVE MODAL DIALOG */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl relative text-right">
            
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
            >
              ✕
            </button>

            {!checkoutSuccess ? (
              <form onSubmit={handleProcessCheckout} className="space-y-4">
                
                <div className="text-center select-none pb-3 border-b border-slate-150">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    بوابة دفع آمنة موثوقة (Secure Gateway)
                  </span>
                  <h4 className="font-black text-[#0b1d33] text-base sm:text-lg mt-2">
                    شراء الباقة {" "}
                    {checkoutSelectedTier === "Bronze" ? "البرونزية" : checkoutSelectedTier === "Silver" ? "الفضية" : checkoutSelectedTier === "Gold" ? "الذهبية" : "الدورة العملية المتكاملة"}
                  </h4>
                  <p className="text-[#f2a900] text-xl font-black mt-1">
                    قيمة الاشتراك: {" "}
                    {checkoutSelectedTier === "Bronze" ? tierBronzePrice : checkoutSelectedTier === "Silver" ? tierSilverPrice : checkoutSelectedTier === "Gold" ? tierGoldPrice : tierCoursePrice}$
                  </p>
                </div>

                {/* Gateway tab selection */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl select-none">
                  <button
                    type="button"
                    onClick={() => setCheckoutGatewayType("card")}
                    className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                      checkoutGatewayType === "card"
                        ? "bg-[#0b1d33] text-white shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    💳 ماستر كارد
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutGatewayType("zain")}
                    className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                      checkoutGatewayType === "zain"
                        ? "bg-[#088258] text-white shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📱 زين كاش
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutGatewayType("crypto")}
                    className={`py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                      checkoutGatewayType === "crypto"
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🪙 كريبتو USDT
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Shared Email Field */}
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-705 block mb-1">بريدك الإلكتروني (لتلقي رابط الكتيب فورا):</label>
                    <input 
                      type="email" 
                      required
                      placeholder="you@example.com"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full p-2.5 border text-xs sm:text-sm rounded-xl outline-none focus:border-[#0b1d33] text-left"
                    />
                  </div>

                  {/* Render conditional gateway field packages */}
                  {checkoutGatewayType === "card" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل على بطاقة الدفع:</label>
                        <input 
                          type="text" 
                          required={checkoutGatewayType === "card"}
                          placeholder="كتب اسمك الكامل بالإنجليزية"
                          value={checkoutCardName}
                          onChange={(e) => setCheckoutCardName(e.target.value)}
                          className="w-full p-2.5 border text-xs sm:text-sm rounded-xl outline-none focus:border-[#0b1d33]"
                        />
                      </div>

                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-slate-700 block mb-1">رقم بطاقة الماستر كارد الدولية:</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required={checkoutGatewayType === "card"}
                            placeholder="5412 7500 1234 5678"
                            value={checkoutCardNumber}
                            onChange={(e) => setCheckoutCardNumber(e.target.value)}
                            className="w-full p-2.5 border text-xs sm:text-sm rounded-xl outline-none focus:border-[#0b1d33] pl-10 text-left font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-slate-700 block mb-1">تاريخ الانتهاء:</label>
                          <input 
                            type="text" 
                            required={checkoutGatewayType === "card"}
                            placeholder="MM/YY"
                            className="w-full p-2.5 border text-xs rounded-xl outline-none focus:border-[#0b1d33] text-center font-mono"
                          />
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-slate-700 block mb-1">رمز الأمان (CVC):</label>
                          <input 
                            type="text" 
                            required={checkoutGatewayType === "card"}
                            placeholder="123"
                            className="w-full p-2.5 border text-xs rounded-xl outline-none focus:border-[#0b1d33] text-center font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutGatewayType === "zain" && (
                    <div className="space-y-3 animate-fade-in text-right">
                      <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-[11px] text-[#088258] leading-relaxed">
                        ⚠️ سيقوم النظام بتوجيه الحوالة مباشرة وبشكل آمن إلى محفظة المسؤول المعتمدة ومستلم الأموال: 
                        <strong className="block font-mono text-xs mt-1 underline select-all">{zainMSISDN || "لا تزال غير مثبتة"}</strong>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block mb-1">رقم هاتف محفظة زين كاش العراق (Zain Cash Iraq):</label>
                        <input 
                          type="tel" 
                          required={checkoutGatewayType === "zain"}
                          placeholder="077XXXXXXXX"
                          value={checkoutZainPhone}
                          onChange={(e) => setCheckoutZainPhone(e.target.value)}
                          className="w-full p-2.5 border text-xs sm:text-sm rounded-xl outline-none focus:border-[#088258] text-left font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block mb-1">الرمز السري للمحفظة (PIN):</label>
                        <input 
                          type="password" 
                          placeholder="****"
                          maxLength={4}
                          className="w-full p-2.5 border text-xs sm:text-sm rounded-xl outline-none focus:border-[#088258] text-center font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        * سيتم إرسال طلب دفع فوري لهاتفك للموافقة وتأكيد تفويض الخصم التلقائي آمن 100%.
                      </p>
                    </div>
                  )}

                  {checkoutGatewayType === "crypto" && (
                    <div className="space-y-3 animate-fade-in text-center p-3 bg-slate-50 border rounded-2xl">
                      <p className="text-xs font-bold text-purple-850">أرسل المبلغ المطلوب إلى عنوان المحفظة أدناه:</p>
                      
                      <div className="w-28 h-28 bg-white mx-auto flex items-center justify-center border border-slate-200 rounded-xl relative select-none">
                        <span className="text-[10px] font-black text-purple-650">QR CODE IMAGE</span>
                        <div className="absolute inset-2 border-2 border-dashed border-purple-400 rounded-lg opacity-30"></div>
                      </div>

                      <div className="space-y-1.5 text-right font-sans">
                        <label className="text-[10px] font-bold text-slate-550 block mb-1 text-purple-900">عنوان محفظة USDT (TRC-20) المعتمد لمريم ناهي:</label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            readOnly
                            value={cryptoUSDTAddress || "لم يتم التثبيت بعد"}
                            className="flex-1 p-2 bg-white border text-[10px] rounded-lg text-left font-mono select-all outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              if (!cryptoUSDTAddress) return;
                              navigator.clipboard.writeText(cryptoUSDTAddress);
                              alert("تم نسخ العنوان للمحفظة بنجاح!");
                            }}
                            className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-[10px] font-bold"
                          >
                            نسخ
                          </button>
                        </div>
                      </div>

                      {cryptoBtcAddress && (
                        <div className="space-y-1.5 text-right font-sans border-t pt-2 mt-2">
                          <label className="text-[10px] font-bold text-slate-550 block mb-1 text-purple-900">عنوان محفظة البيتكوين (BTC):</label>
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              readOnly
                              value={cryptoBtcAddress}
                              className="flex-1 p-2 bg-white border text-[10px] rounded-lg text-left font-mono select-all outline-none"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(cryptoBtcAddress);
                                alert("تم نسخ عنوان محفظة BTC بنجاح!");
                              }}
                              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-[10px] font-bold"
                            >
                              نسخ
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-[9px] text-slate-400 leading-normal">
                        * سيقوم النظام بتأكيد ترحيل الحوالة تلقائياً بمجرد إرسالها على شبكة الترون.
                      </p>
                    </div>
                  )}

                </div>

                <div className="pt-2 text-slate-450 text-[10px] leading-relaxed select-none text-center flex items-center justify-center gap-1.5">
                  <span className="text-[#0b1d33]">🔒 SSL SECURE</span>
                  <span>جميع البيانات وهمية لأغراض العرض والتعليم ولا تخزن أي أسرار ائتمانية.</span>
                </div>

                <button
                  type="submit"
                  disabled={checkoutProcessing}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  {checkoutProcessing ? (
                    <>
                      <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4" />
                      <span>يجري مراجعة العملية وتفويض البنك...</span>
                    </>
                  ) : (
                    <>
                      <span>تأكيد عملية الفحص وشراء الملف</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              <div className="text-center py-6 space-y-4 select-none">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 stroke-3" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#0b1d33]">💳 تمت المحاكاة للدفع بنجاح كجزء من المعاينة الحقيقية!</h4>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    لقد تم إرسال الدليل الشامل كملف PDF تفاعلي إلى بريدك الإلكتروني المستهدف: **{checkoutEmail}** وملحقات التحدي بنجاح.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border text-xs text-slate-650 space-y-1 leading-relaxed text-right font-semibold">
                  <p>● **رقم العملية:** 2026_SANDBOX_ST_098</p>
                  <p>● **البريد المُثبت:** {checkoutEmail}</p>
                  <p>● **المنتج المسلّم:** {checkoutSelectedTier === "Bronze" ? "الباقة البرونزية الأساسية" : checkoutSelectedTier === "Silver" ? "الباقة الفضية المتكاملة" : checkoutSelectedTier === "Gold" ? "الباقة الذهبية VIP" : "الدورة الرقمية الدراسية العملية المتكاملة"}</p>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full py-2.5 bg-[#0b1d33] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  العودة للوحة الإدارة
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* STUNNING PREMIUM DESIGNED BONUS DETAIL viewer MODAL */}
      {selectedBonus && (() => {
        const bonusLang = lessonLang; // bound to global layout language context
        const bonusContent = BONUSES_DATA[selectedBonus.file]?.[bonusLang] || BONUSES_DATA[selectedBonus.file]?.ar;
        
        // Define high-fidelity matches highlighter
        const highlightMatchText = (text: string, query: string) => {
          if (!query.trim()) return <span>{text}</span>;
          const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
          return (
            <span>
              {parts.map((part, i) => 
                part.toLowerCase() === query.toLowerCase() 
                  ? <mark key={i} className="bg-amber-400 text-black px-1.5 py-0.2 rounded font-black animate-pulse select-all">{part}</mark> 
                  : part
              )}
            </span>
          );
        };

        // local filter for the items based on search query
        const filteredSections = bonusContent ? bonusContent.sections.map(sec => {
          const matchedItems = sec.items.filter(it => 
            it.label.toLowerCase().includes(bonusSearchQuery.toLowerCase()) || 
            it.details.toLowerCase().includes(bonusSearchQuery.toLowerCase())
          );
          return { ...sec, items: matchedItems };
        }).filter(sec => sec.items.length > 0) : [];

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#0b1322] border border-slate-800 text-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col h-auto md:h-[620px] text-right" style={{ direction: "rtl" }}>
              
              {/* Header section with brand accent */}
              <div className="bg-[#121c30] p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="space-y-1 text-right font-sans">
                  <span className="text-[9px] font-black text-rose-400 bg-rose-950/50 px-2.5 py-0.5 rounded border border-rose-900/40 uppercase">البونص الحصري الفاخر 🎁</span>
                  <h4 className="text-sm sm:text-base font-black text-white">{selectedBonus.title}</h4>
                </div>
                <div className="flex items-center gap-2 font-sans">
                  <button
                    onClick={() => {
                      setLessonLang(prev => prev === "ar" ? "en" : "ar");
                      setBonusSearchQuery("");
                    }}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold border border-slate-700 rounded-lg transition"
                  >
                    {bonusLang === "ar" ? "Switch to English 🇬🇧" : "التحويل للغة العربية 🇸🇦"}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedBonus(null);
                      setBonusSearchQuery("");
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subheader Search and Quick Guide */}
              <div className="p-4 bg-[#0e1728]/85 border-b border-indigo-950/40 flex flex-col md:flex-row items-center justify-between gap-3.5 select-none font-sans">
                <p className="text-[11px] text-slate-355 text-right leading-relaxed font-semibold">
                  {bonusContent?.desc} <br />
                  <span className="text-rose-350 text-[10px] font-black">* انقر على أي زر نسخ منسق وضعه الفرد للتطبيق الفوري.</span>
                </p>

                {/* Search Bar Input */}
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    placeholder={bonusLang === "ar" ? "ابحث عن كلمة، أمر، أو تفاصيل بالبونص... 🔍" : "Search in bonus keys or prompts... 🔍"} 
                    value={bonusSearchQuery} 
                    onChange={(e) => setBonusSearchQuery(e.target.value)} 
                    className="w-full bg-[#121c30] text-xs text-white placeholder-slate-400 p-2.5 pr-3 pl-8 rounded-xl outline-none focus:ring-1 focus:ring-rose-500 border border-slate-800 text-right font-bold"
                  />
                </div>
              </div>

              {/* Scrollable list of prompts / guide files */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-gradient-to-b from-[#0b1322] to-[#070b14]">
                
                {filteredSections.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2 text-center">
                    <span className="text-3xl">🧩</span>
                    <p className="text-xs font-black">{bonusLang === "ar" ? "لا توجد نتائج مطابقة لبحثك، جرب كتابة مفرقة أخرى" : "No matching items found. Try different filters."}</p>
                  </div>
                ) : (
                  filteredSections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3 font-sans">
                      <h5 className="text-xs sm:text-[13px] font-black text-rose-300 border-r-3 border-rose-600 pr-2 pb-0.5 select-none text-right">
                        {sec.heading}
                      </h5>
                      
                      <div className="grid grid-cols-1 gap-3.5">
                        {sec.items.map((it, iIdx) => (
                          <div key={iIdx} className="bg-[#121c30]/70 border border-slate-800 p-4 rounded-2xl hover:border-slate-750 transition flex flex-col justify-between space-y-3 text-right">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-[#f2a900] block text-right">{it.label}</span>
                              <p className="text-xs text-slate-300 font-semibold leading-relaxed text-right">{it.details}</p>
                            </div>

                            {it.value && (
                              <div className="bg-[#070c14] border border-indigo-950/40 p-3.5 rounded-xl font-mono text-[11px] text-rose-100 select-all whitespace-pre-wrap leading-relaxed text-right" style={{ direction: "rtl" }}>
                                {it.value}
                              </div>
                            )}

                            {it.value && (
                              <div className="flex justify-end select-none">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(it.value || "");
                                    alert("✓ تم نسخ صيغة الأمر المحكم بنجاح! جاهز تماماً للوضع بـ ChatGPT أو Gemini.");
                                  }}
                                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                                >
                                  نسخ الأمر الكامل جاهزاً 📋
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

              </div>

              {/* Footer actions with download triggered real UTF-8 file */}
              <div className="bg-[#121c30] p-4 border-t border-slate-800 flex items-center justify-between gap-4 select-none font-sans">
                <button
                  onClick={() => triggerRealFileDownload(selectedBonus.file, selectedBonus.title)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <span>تنزيل الدليل كملف حقيقي 💾 ⬇️</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBonus(null);
                    setBonusSearchQuery("");
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إغلاق ❌
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
