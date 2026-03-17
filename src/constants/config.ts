export const PROPERTY_CONTEXT = `أنت مساعد ذكي متخصص في إدارة الأملاك والعقارات في المملكة العربية السعودية.
مهمتك مساعدة الملاك، المستأجرين، ومديري الأملاك في مهامهم اليومية.
أجب باختصار، بمهنية، وباللغة العربية.`;

export const AI_QUICK_PROMPTS = [
  { text: "لخص حالة الصيانة", icon: "wrench" },
  { text: "صغ رسالة تذكير بالإيجار", icon: "message-square" },
  { text: "ما هي نسبة الإشغال؟", icon: "pie-chart" },
  { text: "تحليل الإيرادات", icon: "trending-up" },
];

export const PUBLISH_PLATFORMS = [
  {
    name: 'Vercel',
    desc: 'نشر فوري مع دعم CI/CD ونطاقات مخصصة',
    icon: 'cloud_upload',
    color: 'text-slate-800',
    bg: 'bg-slate-100',
    url: 'https://vercel.com/new',
    badge: 'مجاني',
    badgeColor: 'bg-green-100 text-green-700',
    steps: ['سجّل في Vercel', 'اربط مستودع GitHub', 'أضف GEMINI_API_KEY في Environment Variables', 'انقر Deploy'],
  },
  {
    name: 'Netlify',
    desc: 'منصة نشر سهلة مع شبكة CDN عالمية',
    icon: 'language',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    url: 'https://app.netlify.com/start',
    badge: 'مجاني',
    badgeColor: 'bg-green-100 text-green-700',
    steps: ['سجّل في Netlify', 'اربط مستودع GitHub', 'أضف GEMINI_API_KEY في Site Variables', 'انقر Deploy site'],
  },
  {
    name: 'GitHub Pages',
    desc: 'نشر مباشر من مستودعك على GitHub',
    icon: 'hub',
    color: 'text-gray-800',
    bg: 'bg-gray-100',
    url: 'https://pages.github.com',
    badge: 'مجاني',
    badgeColor: 'bg-green-100 text-green-700',
    steps: ['شغّل: npm run build', 'ادفع مجلد dist إلى فرع gh-pages', 'فعّل GitHub Pages من إعدادات المستودع'],
  },
  {
    name: 'Google Cloud Run',
    desc: 'يعمل المشروع حالياً على Cloud Run في AI Studio',
    icon: 'deployed_code',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    url: 'https://console.cloud.google.com/run',
    badge: 'مُفعَّل',
    badgeColor: 'bg-blue-100 text-blue-700',
    steps: ['المشروع مُضاف تلقائياً عبر AI Studio', 'يمكن إضافة نطاق مخصص من Cloud Console', 'راجع الإعدادات في قسم المتغيرات'],
  },
];

