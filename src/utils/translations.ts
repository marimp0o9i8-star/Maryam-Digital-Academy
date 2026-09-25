export interface AppTranslations {
  navGuide: string;
  navWorkbook: string;
  navChallenge: string;
  navGenerator: string;
  navPrompts: string;
  navTemplates: string;
  navAdmin: string;
  navCoach: string;
  copyright: string;
  changeLanguage: string;
  adminLockedTitle: string;
  adminLockedSub: string;
  adminEmail: string;
  adminPIN: string;
  adminPINHint: string;
  adminUnlockBtn: string;
  adminUnlockProcessing: string;
  adminWrongCredentials: string;
  adminLogoutBtn: string;
  adminSuccessUnlocked: string;
  generalWelcome: string;
  digitalGold: string;
}

export const METADATA_TRANSLATIONS: Record<string, AppTranslations> = {
  ar: {
    navGuide: "كتاب الدليل (33 صفحة)",
    navWorkbook: "كراسة العمل والتخطيط",
    navChallenge: "تحدي الـ 12 يوماً",
    navGenerator: "صانع السكريبتات ورسائل البيع",
    navPrompts: "مركز أوامر ChatGPT (50 أمراً)",
    navTemplates: "الأدوات والقوالب العملية",
    navAdmin: "لوحة التحكم المشرف والذكاء الفوقي",
    navCoach: "المستشار الذكي والتحفيز 🤖",
    copyright: "منصة الكاتبة مريم © 2026. صناعة المنتج الرقمي الأول باحترافية.",
    changeLanguage: "لغة المنصة:",
    adminLockedTitle: "🔒 بوابة الإدارة والتحقق الآمن المفوّض",
    adminLockedSub: "لوحة التحكم الحقيقية مغلقة وحصرية لمالكة ومؤسسة الدليل (مريم - marimp0o9i8@gmail.com). الرجاء تأكيد البيانات وتفويض البنك لمشاهدة المبيعات والإحصائيات.",
    adminEmail: "عنوان بريد مالكة الدليل الإلكتروني المُعتمد:",
    adminPIN: "رمز الدخول الفوقي السري (Security PIN):",
    adminPINHint: "💡 للاختبار السريع كمالك، استخدم البريد المذكور والرمز الافتراضي: 2026",
    adminUnlockBtn: "تفويض الصلاحيات وفتح لوحة الإدارة 🔑",
    adminUnlockProcessing: "يجري مطابقة المفاتيح وفحص صلاحيات الهوية...",
    adminWrongCredentials: "❌ البريد الإلكتروني أو رمز المرور غير مصرح به. هذه اللوحة تظهر للمالك والمشرف مريم فقط!",
    adminLogoutBtn: "قفل الخروج الآمن للمشرف 🔒",
    adminSuccessUnlocked: "✨ تم تأكيد الصلاحيات والتحقق بنجاح كمالك للمنصة! مبارك مريم.",
    generalWelcome: "أهلاً بك مريم في وحدة التحكم والمبيعات الكونية",
    digitalGold: "صناعة الذهب الرقمي"
  },
  en: {
    navGuide: "eBook Guide (33 Pages)",
    navWorkbook: "Interactive Planner & Notebook",
    navChallenge: "12-Day Launch Challenge",
    navGenerator: "Instant Copy & Script Maker",
    navPrompts: "ChatGPT Prompts Hub (50 Commands)",
    navTemplates: "Action Tools & Templates Center",
    navAdmin: "SuperAdmin Suite & Analytics",
    navCoach: "AI Launch Coach & Mentor 🤖",
    copyright: "Author Mariam Platform © 2026. Creating Your First Passive Digital Product.",
    changeLanguage: "Platform Language:",
    adminLockedTitle: "🔒 Secure SuperAdmin Authorization Gateway",
    adminLockedSub: "This metrics workspace is locked and strictly reserved for the owner (Mariam - marimp0o9i8@gmail.com). Confirm your admin credentials to review active sales and web earnings.",
    adminEmail: "Authorized Owner Email Adress:",
    adminPIN: "Secret Security Access PIN:",
    adminPINHint: "💡 For rapid testing, enter the owner email and default security PIN: 2026",
    adminUnlockBtn: "Authorize Identity & Open Admin Suite 🔑",
    adminUnlockProcessing: "Matching cryptographic keys and verifying owner identity...",
    adminWrongCredentials: "❌ Unauthorized Access. This terminal is strictly available for admin user: marimp0o9i8@gmail.com",
    adminLogoutBtn: "Secure Admin Session Logout 🔒",
    adminSuccessUnlocked: "✨ Cryptographic session authorized. Welcome back, Admin Mariam!",
    generalWelcome: "Welcome back, Owner Mariam, to the cosmic analytics cockpit",
    digitalGold: "Crafting Digital Passive Gold"
  },
  fr: {
    navGuide: "Guide eBook (33 Pages)",
    navWorkbook: "Cahier d'Exercices & Planificateur",
    navChallenge: "Défi de Lancement de 12 Jours",
    navGenerator: "Générateur d'Écritures de Vente",
    navPrompts: "Centre de Prompts ChatGPT (50)",
    navTemplates: "Outils Pratiques & Modèles",
    navAdmin: "SuperAdmin Suite & Statistiques",
    navCoach: "AI Coach & Guide de Motivation 🤖",
    copyright: "Plateforme Auteur Mariam © 2026. Créez Votre Premier Produit Numérique.",
    changeLanguage: "Langue de la plateforme:",
    adminLockedTitle: "🔒 Passerelle d'Autorisation Sécurisée SuperAdmin",
    adminLockedSub: "Cet espace et tableau de bord est exclusivement réservé au propriétaire (Mariam - marimp0o9i8@gmail.com). Veuillez saisir vos identifiants pour voir les ventes.",
    adminEmail: "Adresse E-mail du Propriétaire Autorisé:",
    adminPIN: "Code PIN d'Accès Sécurisé:",
    adminPINHint: "💡 Pour tester rapidement, utilisez l'email ci-dessus et le code PIN par défaut: 2026",
    adminUnlockBtn: "Autoriser l'Identité & Ouvrir l'Espace Admin 🔑",
    adminUnlockProcessing: "Vérification des clés de cryptographie et de l'identité du propriétaire...",
    adminWrongCredentials: "❌ Accès non autorisé. Ce terminal est exclusivement réservé à l'administrateur Mariam.",
    adminLogoutBtn: "Déconnexion Sécurisée de la Session Admin 🔒",
    adminSuccessUnlocked: "✨ Session cryptographique autorisée. Bon retour, Administratrice Mariam!",
    generalWelcome: "Bienvenue, Propriétaire Mariam, sur votre cockpit d'analyse",
    digitalGold: "Création d'Or Passif Numérique"
  },
  es: {
    navGuide: "Guía de eBook (33 Páginas)",
    navWorkbook: "Cuaderno Teórico y Planificador",
    navChallenge: "Desafío de Lanzamiento de 12 Días",
    navGenerator: "Generador de Textos de Venda",
    navPrompts: "Centro de Prompts de ChatGPT (50)",
    navTemplates: "Centro de Plantillas y Herramientas",
    navAdmin: "SuperAdmin Suite y Analíticas",
    navCoach: "Entrenador AI y Motivación de Lanzamiento 🤖",
    copyright: "Plataforma de Autora Mariam © 2026. Crea tu Primer Producto Pasivo Digital.",
    changeLanguage: "Idioma de plataforma:",
    adminLockedTitle: "🔒 Portal de Autorización Segura de SuperAdmin",
    adminLockedSub: "Este espacio de métricas financieras está restringido al propietario (Mariam - marimp0o9i8@gmail.com). Confirma tus datos de acceso para ver las ventas simuladas.",
    adminEmail: "Correo Electrónico del Propietario de la Guía:",
    adminPIN: "PIN Secreto de Seguridad:",
    adminPINHint: "💡 Para pruebas rápidas, introduzca el correo anterior y el PIN por defecto: 2026",
    adminUnlockBtn: "Autorizar Identidad y Desbloquear Panel de Control 🔑",
    adminUnlockProcessing: "Comprobando credenciales y validando firma de administrador...",
    adminWrongCredentials: "❌ Acceso restringido. Este panel de control es exclusivo para la fundadora Mariam.",
    adminLogoutBtn: "Cerrar Sesión Segura de Administrador 🔒",
    adminSuccessUnlocked: "✨ Identidad de administrador comprobada. ¡Bienvenida, Administradora Mariam!",
    generalWelcome: "Bienvenida, Propietaria Mariam, al cuadro de mandos analítico",
    digitalGold: "Forjando Oro Digital Pasivo"
  },
  tr: {
    navGuide: "E-Kitap Rehberi (33 Sayfa)",
    navWorkbook: "İnteraktif Planlama Defteri",
    navChallenge: "12 Günlük Lansman Mücadelesi",
    navGenerator: "Satış Metni Oluşturucu",
    navPrompts: "ChatGPT Komut Kütüphanesi (50)",
    navTemplates: "Uygulamalı Şablonlar & Araçlar",
    navAdmin: "Yönetici Paneli (SuperAdmin)",
    navCoach: "Yapay Zeka Motivasyon Koçu 🤖",
    copyright: "Yazar Mariam Platformu © 2026. İlk Pasif Dijital Ürününüzü Oluşturun.",
    changeLanguage: "Platform Dili:",
    adminLockedTitle: "🔒 Güvenli SüperYönetici Doğrulama Kapısı",
    adminLockedSub: "Bu istatistik ekranı kilitlidir ve yalnızca rehberin kurucusu Meryem (marimp0o9i8@gmail.com) için ayrılmıştır. Satışları izlemek için yönetici kimliğinizi girin.",
    adminEmail: "Yetkili Yönetici E-Postası:",
    adminPIN: "Güvenlik Geçiş Kodu (PIN):",
    adminPINHint: "💡 Hızlı test etmek için yukarıdaki e-postayı ve varsayılan PIN kodunu kullanın: 2026",
    adminUnlockBtn: "Kimliği Doğrula & Yönetici Panelini Aç 🔑",
    adminUnlockProcessing: "Eşleştirme yapılıyor ve yönetici kimliği doğrulanıyor...",
    adminWrongCredentials: "❌ Yetkisiz Giriş. Bu terminal sadece Kurucu Meryem için kullanılabilir.",
    adminLogoutBtn: "Yönetici Oturumunu Güvenle Kapat 🔒",
    adminSuccessUnlocked: "✨ Oturum başarıyla açıldı. Tekrar hoş geldiniz, Yönetici Meryem!",
    generalWelcome: "Meryem Hanım, kozmik satış analiz odasına hoş geldiniz",
    digitalGold: "Dijital Pasif Altın Üretimi"
  }
};
