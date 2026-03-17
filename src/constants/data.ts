export const PROPERTIES = [
  { id: '1', name: 'عمارة النخيل', location: 'الرياض، حي الصحافة', units: 24, type: 'سكني' },
  { id: '2', name: 'برج الياسمين', location: 'الرياض، حي الملقا', units: 36, type: 'سكني' },
  { id: '3', name: 'مجمع الروضة', location: 'الرياض، حي الروضة', units: 12, type: 'سكني' },
  { id: '4', name: 'برج بيان', location: 'الرياض، شارع الملك فهد', units: 48, type: 'سكني تجاري' },
  { id: '5', name: 'برج النخيل', location: 'الرياض، حي العليا', units: 30, type: 'تجاري' },
  { id: '6', name: 'مجمع الياسمين', location: 'الرياض، حي الياسمين', units: 15, type: 'تجاري' },
  { id: '7', name: 'حي النرجس', location: 'الرياض، حي النرجس', units: 1, type: 'سكني' },
  { id: '8', name: 'أبراج النخيل', location: 'الرياض، حي النخيل', units: 60, type: 'سكني' },
  { id: '9', name: 'فيلا السعادة', location: 'جدة، حي الشاطئ', units: 1, type: 'سكني' },
  { id: '10', name: 'برج المجد', location: 'الرياض، حي السليمانية', units: 40, type: 'تجاري' },
  { id: '11', name: 'مجمع الواحة', location: 'الرياض، حي الواحة', units: 20, type: 'سكني' },
  { id: '12', name: 'فيلا الياسمين', location: 'الرياض، حي الياسمين', units: 1, type: 'سكني' },
  { id: '13', name: 'عمارة السلام', location: 'الرياض، حي السلام', units: 18, type: 'سكني' },
  { id: '14', name: 'برج الجوهرة', location: 'جدة، الكورنيش', units: 55, type: 'سكني تجاري' },
  { id: '15', name: 'مجمع الفهد', location: 'الدمام، حي الشاطئ', units: 25, type: 'سكني' },
];

export const MAINTENANCE_REQUESTS = [
  {
    id: "1",
    property: "برج الياسمين",
    unit: "شقة ٥٠٢",
    date: "2024-05-24",
    type: "سباكة",
    technician: "أحمد محمود",
    status: "in_progress",
    description: "صنبور يسرب الماء في الحمام الرئيسي",
    priority: "high",
  },
  {
    id: "2",
    property: "مجمع النخيل",
    unit: "شقة ٣٠١",
    date: "2024-05-20",
    type: "كهرباء",
    technician: "خالد علي",
    status: "completed",
    description: "إصلاح مفتاح الإنارة في الصالة",
    priority: "medium",
  },
  {
    id: "3",
    property: "فلل الروضة",
    unit: "فيلا ١٢",
    date: "2024-05-25",
    type: "تكييف",
    technician: "ياسين حسن",
    status: "new",
    description: "المكيف لا يبرد بشكل جيد",
    priority: "medium",
  },
  {
    id: "4",
    property: "برج الياسمين",
    unit: "شقة ١٠٢",
    date: "2024-05-15",
    type: "دهانات",
    technician: "سعيد محمد",
    status: "completed",
    description: "إعادة دهان جدار الغرفة الرئيسية",
    priority: "low",
  },
  {
    id: "5",
    property: "عمارة السعادة",
    unit: "شقة ٤٠٤",
    date: "2024-05-10",
    type: "سباكة",
    technician: "أحمد محمود",
    status: "completed",
    description: "تسليك مجاري المطبخ",
    priority: "high",
  },
  {
    id: "6",
    property: "برج الأعمال",
    unit: "مكتب ٢٠١",
    date: "2024-05-26",
    type: "كهرباء",
    technician: "خالد علي",
    status: "new",
    description: "عطل في لوحة التوزيع الرئيسية",
    priority: "high",
  },
];

export const UNITS = [
  {
    id: "101",
    type: "شقة",
    property: "عمارة النور",
    rent: "4,500",
    status: "مؤجرة",
  },
  {
    id: "402",
    type: "مكتب",
    property: "مجمع الأعمال",
    rent: "12,000",
    status: "شاغرة",
  },
  {
    id: "7",
    type: "فيلا",
    property: "فلل قرطبة",
    rent: "8,000",
    status: "تحت الصيانة",
  },
  {
    id: "205",
    type: "شقة",
    property: "عمارة السلام",
    rent: "3,800",
    status: "مؤجرة",
  },
  {
    id: "301",
    type: "مكتب",
    property: "برج الأعمال",
    rent: "15,000",
    status: "شاغرة",
  },
  {
    id: "15",
    type: "فيلا",
    property: "مجمع الفيلات",
    rent: "9,500",
    status: "مؤجرة",
  },
  {
    id: "502",
    type: "شقة",
    property: "برج الياسمين",
    rent: "5,200",
    status: "شاغرة",
  },
  {
    id: "104",
    type: "شقة",
    property: "مجمع النخيل",
    rent: "4,800",
    status: "مؤجرة",
  },
];
export const TENANTS = [
  { id: '1', name: 'محمد العتيبي', unit: 'شقة ٤٠٢', property: PROPERTIES[1].name, phone: '٠٥٠١٢٣٤٥٦٧', paid: true, status: 'active', rent: '4,800', contractEnd: '٢٠٢٤/١٢/٣١' },
  { id: '2', name: 'سارة القحطاني', unit: 'فيلا ٧', property: PROPERTIES[6].name, phone: '٠٥٥٩٨٧٦٥٤٣', paid: false, status: 'active', rent: '8,000', contractEnd: '٢٠٢٥/٠٣/٢٠' },
  { id: '3', name: 'عبدالله الشمري', unit: 'مكتب ١٠١', property: PROPERTIES[4].name, phone: '٠٥٤٣٢١٠٩٨٧', paid: true, status: 'expiring', rent: '4,500', contractEnd: '٢٠٢٤/٠٦/٣٠' },
  { id: '4', name: 'فاطمة الزهراني', unit: 'شقة ٢٠٥', property: PROPERTIES[10].name, phone: '٠٥٦٧٨٩٠١٢٣', paid: false, status: 'late', rent: '3,800', contractEnd: '٢٠٢٤/٠٩/١٥' },
  { id: '5', name: 'خالد حسن المالكي', unit: 'شقة ١٠٤', property: PROPERTIES[1].name, phone: '٠٥٠٠١١٢٢٣٣', paid: true, status: 'active', rent: '4,800', contractEnd: '٢٠٢٥/٠١/٠١' },
  { id: '6', name: 'نورة الدوسري', unit: 'فيلا ١٥', property: PROPERTIES[11].name, phone: '٠٥٣٤٥٦٧٨٩٠', paid: true, status: 'active', rent: '9,500', contractEnd: '٢٠٢٥/٠٢/١٠' },
  { id: '7', name: 'أحمد سالم البلوي', unit: 'شقة ١٠٢', property: PROPERTIES[0].name, phone: '٠٥٦٦٧٧٨٨٩٩', paid: false, status: 'late', rent: '5,200', contractEnd: '٢٠٢٤/٠٨/٠١' },
  { id: '8', name: 'ريم الحربي', unit: 'مكتب ٣٠١', property: PROPERTIES[9].name, phone: '٠٥١٢٣٤٥٦٧٨', paid: true, status: 'active', rent: '15,000', contractEnd: '٢٠٢٤/١١/٣٠' },
];

export const OWNERS = [
  { id: '1', name: 'عبد الرحمن السديري', properties: 5, phone: '٠٥٠١٢٣٤٥٦٧', status: 'نشط', totalRevenue: '٤٥,٠٠٠', email: 'sidirey@example.com' },
  { id: '2', name: 'شركة نجد للاستثمار', properties: 12, phone: '٠١١٤٥٦٧٨٩٠', status: 'نشط', totalRevenue: '١٢٠,٠٠٠', email: 'najd@invest.com' },
  { id: '3', name: 'فهد بن سلطان', properties: 3, phone: '٠٥٥٩٨٧٦٥٤٣', status: 'غير نشط', totalRevenue: '١٨,٠٠٠', email: 'fahad@example.com' },
  { id: '4', name: 'مريم الخليفة', properties: 2, phone: '٠٥٤٤٣٣٢٢١١', status: 'نشط', totalRevenue: '٢٢,٠٠٠', email: 'mariam@example.com' },
  { id: '5', name: 'مجموعة الفهد العقارية', properties: 8, phone: '٠١١٢٢٣٣٤٤٥', status: 'نشط', totalRevenue: '٩٥,٠٠٠', email: 'alfahd@group.com' },
];

export const CONTRACTS = [
  { id: '1', tenant: 'محمد العتيبي', unit: 'شقة ٤٠٢', property: PROPERTIES[1].name, start: '٢٠٢٤/٠١/٠١', end: '٢٠٢٤/١٢/٣١', rent: '4,800', status: 'ساري' },
  { id: '2', tenant: 'شركة الأفق', unit: 'مكتب ٥', property: PROPERTIES[4].name, start: '٢٠٢٣/٠٧/١', end: '٢٠٢٤/٠٦/١٥', rent: '12,000', status: 'ينتهي قريباً' },
  { id: '3', tenant: 'سارة العمري', unit: 'فيلا ١٢', property: PROPERTIES[6].name, start: '٢٠٢٤/٠١/٢٠', end: '٢٠٢٥/٠١/٢٠', rent: '8,000', status: 'ساري' },
  { id: '4', tenant: 'فاطمة الزهراني', unit: 'شقة ٢٠٥', property: PROPERTIES[10].name, start: '٢٠٢٣/١٠/١', end: '٢٠٢٤/٠٩/١٥', rent: '3,800', status: 'منتهي' },
  { id: '5', tenant: 'خالد المالكي', unit: 'شقة ١٠٤', property: PROPERTIES[1].name, start: '٢٠٢٤/٠١/٠١', end: '٢٠٢٥/٠١/٠١', rent: '4,800', status: 'ساري' },
  { id: '6', tenant: 'نورة الدوسري', unit: 'فيلا ١٥', property: PROPERTIES[11].name, start: '٢٠٢٤/٠٢/١٠', end: '٢٠٢٥/٠٢/١٠', rent: '9,500', status: 'ساري' },
];

export const INVOICES = TENANTS.map((t, i) => ({
  id: `#INV-2024-${String(i + 1).padStart(3, '0')}`,
  tenant: t.name,
  property: t.property,
  unit: t.unit,
  amount: t.rent,
  status: t.paid ? 'مدفوعة' : (t.status === 'late' ? 'متأخرة' : 'غير مدفوعة'),
  date: t.contractEnd.slice(0, 7),
}));

export const VENDORS = [
  { id: '1', name: 'شركة التكييف المتقدمة', service: 'صيانة تكييف', type: 'تكييف', rating: 4.8, status: 'available', phone: '966500000001', jobs: 32, city: 'الرياض' },
  { id: '2', name: 'الكهربائي المتميز', service: 'أعمال كهرباء', type: 'كهرباء', rating: 4.5, status: 'busy', phone: '966500000002', jobs: 18, city: 'الرياض' },
  { id: '3', name: 'سباكة الخليج', service: 'سباكة وعزل', type: 'سباكة', rating: 4.2, status: 'available', phone: '966500000003', jobs: 24, city: 'الرياض' },
  { id: '4', name: 'شركة الدهانات الذهبية', service: 'دهانات وديكور', type: 'دهانات', rating: 4.6, status: 'available', phone: '966500000004', jobs: 15, city: 'جدة' },
  { id: '5', name: 'مكافحة الآفات السريعة', service: 'مكافحة آفات', type: 'مكافحة', rating: 4.3, status: 'busy', phone: '966500000005', jobs: 9, city: 'الدمام' },
  { id: '6', name: 'صيانة مصاعد الخليج', service: 'صيانة مصاعد', type: 'مصاعد', rating: 4.9, status: 'available', phone: '966500000006', jobs: 41, city: 'الرياض' },
];

export const MSG_TEMPLATES = [
  // Contract templates
  { id: '1', category: 'عقود', recipient: 'مستأجر', title: 'ترحيب بمستأجر جديد', preview: 'أهلاً وسهلاً بكم في [اسم العقار]. نسعد بانضمامكم كمستأجر جديد في الوحدة [رقم الوحدة]. نود إعلامكم بأن عقد الإيجار بدأ بتاريخ [تاريخ البدء] ويمتد حتى [تاريخ الانتهاء]. يسعدنا خدمتكم دائماً. إدارة العقار.', icon: 'celebration', color: 'text-green-600', bg: 'bg-green-50', auto: false },
  { id: '2', category: 'عقود', recipient: 'مستأجر', title: 'تذكير انتهاء العقد (30 يوم)', preview: 'عزيزي المستأجر [اسم المستأجر]، نودّ إعلامكم بأن عقد إيجار الوحدة [رقم الوحدة] في [اسم العقار] سينتهي بعد 30 يوماً بتاريخ [تاريخ الانتهاء]. يرجى التواصل معنا لتجديد العقد أو تحديد موعد الإخلاء. إدارة العقار.', icon: 'event_upcoming', color: 'text-amber-600', bg: 'bg-amber-50', auto: true },
  { id: '3', category: 'عقود', recipient: 'مستأجر', title: 'تذكير انتهاء العقد (7 أيام)', preview: 'عزيزي المستأجر [اسم المستأجر]، تذكير هام: ينتهي عقد إيجاركم للوحدة [رقم الوحدة] خلال 7 أيام فقط. يرجى الاتصال بنا عاجلاً على الرقم [رقم الهاتف] لتجديد العقد أو الإفادة بقرار المغادرة.', icon: 'event_busy', color: 'text-red-600', bg: 'bg-red-50', auto: true },
  { id: '4', category: 'عقود', recipient: 'مستأجر', title: 'عرض تجديد العقد', preview: 'عزيزي المستأجر [اسم المستأجر]، يسعدنا دعوتكم لتجديد عقد الإيجار للسنة القادمة بنفس الشروط. الإيجار الشهري: [المبلغ] ر.س. إذا كنتم مهتمين، يرجى الرد على هذه الرسالة خلال 10 أيام. شكراً لثقتكم بنا.', icon: 'autorenew', color: 'text-blue-600', bg: 'bg-blue-50', auto: false },
  { id: '5', category: 'عقود', recipient: 'مالك', title: 'إشعار تجديد عقد للمالك', preview: 'أصحاب السعادة [اسم المالك]، نحيطكم علماً بأن عقد إيجار الوحدة [رقم الوحدة] بعقاركم [اسم العقار] سيُجدَّد اعتباراً من [تاريخ التجديد] بقيمة إيجار شهري [المبلغ] ر.س. سيتم تحويل العائد في الموعد المعتاد. إدارة شركة رمز الإبداع.', icon: 'real_estate_agent', color: 'text-emerald-600', bg: 'bg-emerald-50', auto: true },
  { id: '6', category: 'عقود', recipient: 'مالك', title: 'تقرير أداء العقار الشهري', preview: 'أصحاب السعادة [اسم المالك]، نقدم لكم ملخص أداء عقاراتكم لشهر [الشهر]: إجمالي الإيرادات: [المبلغ] ر.س، الوحدات المؤجرة: [العدد]، طلبات الصيانة المغلقة: [العدد]. يمكنكم الاطلاع على التفاصيل الكاملة عبر التطبيق.', icon: 'analytics', color: 'text-indigo-600', bg: 'bg-indigo-50', auto: true },
  // Payment templates
  { id: '7', category: 'مالية', recipient: 'مستأجر', title: 'تذكير سداد الإيجار الشهري', preview: 'عزيزي المستأجر [اسم المستأجر]، نذكّركم بأن إيجار شهر [الشهر] للوحدة [رقم الوحدة] بمبلغ [المبلغ] ر.س لم يُسدَّد حتى تاريخ [التاريخ]. يرجى السداد خلال 3 أيام لتجنب الغرامات. شكراً.', icon: 'payments', color: 'text-rose-600', bg: 'bg-rose-50', auto: true },
  { id: '8', category: 'مالية', recipient: 'مستأجر', title: 'تأكيد استلام الدفعة', preview: 'نؤكد لكم استلام دفعة الإيجار بتاريخ [التاريخ] بقيمة [المبلغ] ر.س للوحدة [رقم الوحدة]. رقم الإيصال: [الرقم]. نشكركم على الالتزام بالسداد في الموعد المحدد. إدارة العقار.', icon: 'receipt_long', color: 'text-green-600', bg: 'bg-green-50', auto: false },
  { id: '9', category: 'مالية', recipient: 'مستأجر', title: 'إشعار تأخر السداد', preview: 'عزيزي المستأجر [اسم المستأجر]، تنبيه: لم يُسدَّد إيجار شهر [الشهر] حتى الآن. المبلغ المستحق: [المبلغ] ر.س + غرامة تأخير [قيمة الغرامة] ر.س. يرجى السداد فوراً لتجنب الإجراءات القانونية. للاستفسار: [رقم الهاتف].', icon: 'warning_amber', color: 'text-red-600', bg: 'bg-red-50', auto: true },
  { id: '10', category: 'مالية', recipient: 'مالك', title: 'إشعار تحويل العائد الشهري', preview: 'أصحاب السعادة [اسم المالك]، يسعدنا إعلامكم بتحويل عائد شهر [الشهر] لعقاراتكم بإجمالي [المبلغ] ر.س إلى حسابكم البنكي المسجل. رقم العملية: [الرقم]. يرجى مراجعة كشف الحساب.', icon: 'account_balance', color: 'text-teal-600', bg: 'bg-teal-50', auto: true },
  // Maintenance templates
  { id: '11', category: 'صيانة', recipient: 'مستأجر', title: 'تأكيد استلام طلب الصيانة', preview: 'عزيزي المستأجر [اسم المستأجر]، تأكيداً لاستلام طلب صيانة رقم [الرقم] الخاص بـ [نوع العطل] في الوحدة [رقم الوحدة]. سيتواصل معكم الفني [اسم الفني] قريباً لتحديد موعد الزيارة.', icon: 'build_circle', color: 'text-orange-600', bg: 'bg-orange-50', auto: true },
  { id: '12', category: 'صيانة', recipient: 'مستأجر', title: 'جدولة موعد الصيانة', preview: 'عزيزي المستأجر، تم جدولة زيارة الصيانة لطلبكم رقم [الرقم] يوم [اليوم] الموافق [التاريخ] بين الساعة [من] و [حتى]. يرجى التأكد من وجودكم أو وجود شخص بالغ في الوحدة.', icon: 'calendar_clock', color: 'text-blue-600', bg: 'bg-blue-50', auto: false },
  { id: '13', category: 'صيانة', recipient: 'مستأجر', title: 'إغلاق طلب الصيانة', preview: 'عزيزي المستأجر [اسم المستأجر]، يسعدنا إعلامكم بإنجاز طلب الصيانة رقم [الرقم] الخاص بـ [نوع العطل] وإغلاقه بنجاح. نتطلع إلى خدمتكم دائماً. إدارة العقار.', icon: 'task_alt', color: 'text-green-600', bg: 'bg-green-50', auto: true },
  // General templates
  { id: '14', category: 'عام', recipient: 'الجميع', title: 'إشعار الفحص الدوري', preview: 'عزيزي المستأجر [اسم المستأجر]، نودّ إعلامكم بأنه سيُجرى الفحص الدوري للوحدة [رقم الوحدة] يوم [اليوم] الموافق [التاريخ]. يهدف الفحص إلى التأكد من سلامة المبنى. شكراً لتعاونكم.', icon: 'manage_search', color: 'text-purple-600', bg: 'bg-purple-50', auto: false },
  { id: '15', category: 'عام', recipient: 'الجميع', title: 'إشعار صيانة المبنى', preview: 'عزيزي السكان، نعلمكم بأنه ستُجرى أعمال صيانة للمبنى يوم [اليوم] من الساعة [من] إلى [حتى] وقد يؤثر ذلك على [الخدمات المتأثرة]. نعتذر عن أي إزعاج. إدارة المبنى.', icon: 'engineering', color: 'text-slate-600', bg: 'bg-slate-100', auto: false },
  { id: '16', category: 'عام', recipient: 'مستأجر', title: 'طلب استبيان رضا المستأجر', preview: 'عزيزي المستأجر [اسم المستأجر]، نقدّر رأيكم! يرجى تخصيص دقيقتين للإجابة على استبيان رضا المستأجرين. مشاركتكم تساعدنا على تقديم خدمة أفضل. رابط الاستبيان: [الرابط]', icon: 'star_rate', color: 'text-amber-600', bg: 'bg-amber-50', auto: false },
];

export const PROPERTY_FORMS = [
  { id: '1', title: 'نموذج استلام وتسليم الوحدة', desc: 'محضر رسمي عند بداية ونهاية الإيجار', category: 'عقارات', icon: 'handshake', color: 'text-blue-600', bg: 'bg-blue-50', fields: [{ label: 'حالة الجدران', type: 'select', options: ['ممتازة', 'جيدة', 'تحتاج صيانة'] }, { label: 'حالة الأرضيات', type: 'select', options: ['ممتازة', 'جيدة', 'تحتاج صيانة'] }, { label: 'حالة الأجهزة', type: 'select', options: ['تعمل جميعها', 'بعضها معطل', 'لا توجد أجهزة'] }, { label: 'حالة التمديدات الكهربائية', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة السباكة', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'ملاحظات إضافية', type: 'textarea' }] },
  { id: '2', title: 'نموذج إشعار إخلاء الوحدة', desc: 'إشعار رسمي للمستأجر بضرورة الإخلاء', category: 'عقارات', icon: 'exit_to_app', color: 'text-red-600', bg: 'bg-red-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'رقم الوحدة', type: 'text' }, { label: 'سبب الإخلاء', type: 'select', options: ['انتهاء العقد', 'مخالفة الشروط', 'عدم السداد', 'أعمال بناء', 'أخرى'] }, { label: 'تاريخ الإخلاء المطلوب', type: 'date' }, { label: 'ملاحظات', type: 'textarea' }] },
  { id: '3', title: 'نموذج الفحص الدوري', desc: 'سجل فحص دوري لحالة الوحدة', category: 'صيانة', icon: 'fact_check', color: 'text-purple-600', bg: 'bg-purple-50', fields: [{ label: 'تاريخ الفحص', type: 'date' }, { label: 'المفتش المسؤول', type: 'text' }, { label: 'حالة الكهرباء', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة السباكة', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة التكييف', type: 'select', options: ['يعمل', 'بحاجة صيانة', 'معطل'] }, { label: 'الأمان والسلامة', type: 'select', options: ['مطابق', 'يحتاج تحسين', 'غير مطابق'] }, { label: 'ملاحظات المفتش', type: 'textarea' }] },
  { id: '4', title: 'نموذج الزيادة في الإيجار', desc: 'إشعار رسمي بزيادة قيمة الإيجار', category: 'مالية', icon: 'trending_up', color: 'text-emerald-600', bg: 'bg-emerald-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'قيمة الإيجار الحالية (ر.س)', type: 'number' }, { label: 'قيمة الإيجار الجديدة (ر.س)', type: 'number' }, { label: 'نسبة الزيادة (%)', type: 'number' }, { label: 'تاريخ تطبيق الزيادة', type: 'date' }, { label: 'مرفقات (لائحة وزارة الإسكان)', type: 'file' }] },
  { id: '5', title: 'نموذج طلب صيانة رسمي', desc: 'توثيق طلب صيانة من إدارة العقار', category: 'صيانة', icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50', fields: [{ label: 'نوع العطل', type: 'select', options: ['سباكة', 'كهرباء', 'تكييف', 'دهانات', 'نجارة', 'أخرى'] }, { label: 'درجة الأولوية', type: 'select', options: ['عاجل', 'متوسط', 'عادي'] }, { label: 'وصف المشكلة', type: 'textarea' }, { label: 'التكلفة التقديرية (ر.س)', type: 'number' }, { label: 'المورد المختار', type: 'select', options: VENDORS.map(v => v.name) }] },
  { id: '6', title: 'نموذج استبيان رضا المستأجرين', desc: 'قياس مستوى رضا السكان عن الخدمات', category: 'خدمات', icon: 'poll', color: 'text-amber-600', bg: 'bg-amber-50', fields: [{ label: 'تقييم جودة الخدمة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'سرعة الاستجابة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'مستوى النظافة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'الأمن والسلامة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'هل تنصح بعقارنا للآخرين؟', type: 'select', options: ['نعم بالتأكيد', 'ربما', 'لا'] }, { label: 'ملاحظات واقتراحات', type: 'textarea' }] },
  { id: '7', title: 'نموذج الشكوى والاقتراح', desc: 'استقبال شكاوى واقتراحات المستأجرين', category: 'خدمات', icon: 'feedback', color: 'text-pink-600', bg: 'bg-pink-50', fields: [{ label: 'نوع البلاغ', type: 'select', options: ['شكوى', 'اقتراح', 'استفسار', 'طلب خدمة'] }, { label: 'القسم المعني', type: 'select', options: ['إدارة العقار', 'الصيانة', 'الأمن', 'النظافة', 'الإيجار', 'أخرى'] }, { label: 'تفاصيل البلاغ', type: 'textarea' }, { label: 'مرفقات (صور)', type: 'file' }] },
  { id: '8', title: 'نموذج إشعار انتهاء العقد (من المستأجر)', desc: 'إشعار رسمي من المستأجر بنيته الإخلاء', category: 'عقارات', icon: 'event_available', color: 'text-violet-600', bg: 'bg-violet-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'رقم الوحدة', type: 'text' }, { label: 'تاريخ الإخلاء المتوقع', type: 'date' }, { label: 'سبب المغادرة', type: 'select', options: ['انتهاء العقد', 'تغيير محل الإقامة', 'شراء مسكن', 'أسباب عائلية', 'أخرى'] }, { label: 'ملاحظات', type: 'textarea' }] },
];
