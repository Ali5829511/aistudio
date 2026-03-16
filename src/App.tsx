import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  apiGetProperties, apiGetMaintenance, apiGetUnits, apiGetTenants,
  apiGetOwners, apiGetContracts, apiGetVendors, apiGetInvoices,
  apiUpdateMaintenanceStatus, apiCreateMaintenance, apiRecordPayment,
  apiAddProperty, apiCreateContract, apiUpdateContract,
  apiLogin,
  type Property, type MaintenanceRequest, type Unit, type Tenant,
  type Owner, type Contract, type Vendor, type Invoice, type AdminUser,
} from './api.ts';
import { useLang, LanguageProvider, LanguageToggle } from './LanguageContext';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const toArabicDigits = (num: number | string, lang: string = 'ar') => {
  if (lang !== 'ar') return num.toString();
  const id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => id[+w]);
};

// --- Types ---
type View = 
  | 'welcome' 
  | 'login'
  | 'manager_dashboard' 
  | 'accounting' 
  | 'invoices' 
  | 'maintenance' 
  | 'property_details' 
  | 'new_maintenance' 
  | 'tenant_dashboard'
  | 'settings'
  | 'reports'
  | 'add_property'
  | 'owners'
  | 'units'
  | 'contracts'
  | 'notifications'
  | 'support'
  | 'docs'
  | 'financial_report'
  | 'zakat_tax'
  | 'ejar_integration'
  | 'tech_performance'
  | 'dev_center'
  | 'archive'
  | 'tenant_satisfaction'
  | 'tenants_management'
  | 'vendors_management'
  | 'asset_management'
  | 'property_report'
  | 'official_print'
  | 'publish'
  | 'ai_assistant'
  | 'payment'
  | 'owner_dashboard'
  | 'tech_portal'
  | 'msg_templates'
  | 'property_forms';

// --- Constants & Mock Data ---

const PROPERTIES = [
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

const MAINTENANCE_REQUESTS = [
  {
    id: '1',
    property: PROPERTIES[0].name,
    unit: 'شقة ٥٠٢',
    date: '2024-05-24',
    type: 'سباكة',
    technician: 'أحمد محمود',
    status: 'in_progress',
    description: 'صنبور يسرب الماء في الحمام الرئيسي',
    priority: 'high'
  },
  {
    id: '2',
    property: PROPERTIES[1].name,
    unit: 'شقة ٣٠١',
    date: '2024-05-20',
    type: 'كهرباء',
    technician: 'خالد علي',
    status: 'completed',
    description: 'إصلاح مفتاح الإنارة في الصالة',
    priority: 'medium'
  },
  {
    id: '3',
    property: PROPERTIES[2].name,
    unit: 'فيلا ١٢',
    date: '2024-05-25',
    type: 'تكييف',
    technician: 'ياسين حسن',
    status: 'new',
    description: 'المكيف لا يبرد بشكل جيد',
    priority: 'medium'
  },
  {
    id: '4',
    property: PROPERTIES[0].name,
    unit: 'شقة ١٠٢',
    date: '2024-05-15',
    type: 'دهانات',
    technician: 'سعيد محمد',
    status: 'completed',
    description: 'إعادة دهان جدار الغرفة الرئيسية',
    priority: 'low'
  },
  {
    id: '5',
    property: PROPERTIES[3].name,
    unit: 'شقة ٤٠٤',
    date: '2024-05-10',
    type: 'سباكة',
    technician: 'أحمد محمود',
    status: 'completed',
    description: 'تسليك مجاري المطبخ',
    priority: 'high'
  },
  {
    id: '6',
    property: PROPERTIES[9].name,
    unit: 'مكتب ٢٠١',
    date: '2024-05-26',
    type: 'كهرباء',
    technician: 'خالد علي',
    status: 'new',
    description: 'عطل في لوحة التوزيع الرئيسية',
    priority: 'high'
  }
];

const UNITS = [
  { id: '101', type: 'شقة', property: PROPERTIES[4].name, rent: '4,500', status: 'مؤجرة' },
  { id: '402', type: 'مكتب', property: PROPERTIES[5].name, rent: '12,000', status: 'شاغرة' },
  { id: '7', type: 'فيلا', property: PROPERTIES[6].name, rent: '8,000', status: 'تحت الصيانة' },
  { id: '205', type: 'شقة', property: PROPERTIES[10].name, rent: '3,800', status: 'مؤجرة' },
  { id: '301', type: 'مكتب', property: PROPERTIES[9].name, rent: '15,000', status: 'شاغرة' },
  { id: '15', type: 'فيلا', property: PROPERTIES[11].name, rent: '9,500', status: 'مؤجرة' },
  { id: '502', type: 'شقة', property: PROPERTIES[0].name, rent: '5,200', status: 'شاغرة' },
  { id: '104', type: 'شقة', property: PROPERTIES[1].name, rent: '4,800', status: 'مؤجرة' },
];

const TENANTS = [
  { id: '1', name: 'محمد العتيبي', unit: 'شقة ٤٠٢', property: PROPERTIES[1].name, phone: '٠٥٠١٢٣٤٥٦٧', paid: true, status: 'active', rent: '4,800', contractEnd: '٢٠٢٤/١٢/٣١' },
  { id: '2', name: 'سارة القحطاني', unit: 'فيلا ٧', property: PROPERTIES[6].name, phone: '٠٥٥٩٨٧٦٥٤٣', paid: false, status: 'active', rent: '8,000', contractEnd: '٢٠٢٥/٠٣/٢٠' },
  { id: '3', name: 'عبدالله الشمري', unit: 'مكتب ١٠١', property: PROPERTIES[4].name, phone: '٠٥٤٣٢١٠٩٨٧', paid: true, status: 'expiring', rent: '4,500', contractEnd: '٢٠٢٤/٠٦/٣٠' },
  { id: '4', name: 'فاطمة الزهراني', unit: 'شقة ٢٠٥', property: PROPERTIES[10].name, phone: '٠٥٦٧٨٩٠١٢٣', paid: false, status: 'late', rent: '3,800', contractEnd: '٢٠٢٤/٠٩/١٥' },
  { id: '5', name: 'خالد حسن المالكي', unit: 'شقة ١٠٤', property: PROPERTIES[1].name, phone: '٠٥٠٠١١٢٢٣٣', paid: true, status: 'active', rent: '4,800', contractEnd: '٢٠٢٥/٠١/٠١' },
  { id: '6', name: 'نورة الدوسري', unit: 'فيلا ١٥', property: PROPERTIES[11].name, phone: '٠٥٣٤٥٦٧٨٩٠', paid: true, status: 'active', rent: '9,500', contractEnd: '٢٠٢٥/٠٢/١٠' },
  { id: '7', name: 'أحمد سالم البلوي', unit: 'شقة ١٠٢', property: PROPERTIES[0].name, phone: '٠٥٦٦٧٧٨٨٩٩', paid: false, status: 'late', rent: '5,200', contractEnd: '٢٠٢٤/٠٨/٠١' },
  { id: '8', name: 'ريم الحربي', unit: 'مكتب ٣٠١', property: PROPERTIES[9].name, phone: '٠٥١٢٣٤٥٦٧٨', paid: true, status: 'active', rent: '15,000', contractEnd: '٢٠٢٤/١١/٣٠' },
];

const OWNERS = [
  { id: '1', name: 'عبد الرحمن السديري', properties: 5, phone: '٠٥٠١٢٣٤٥٦٧', status: 'نشط', totalRevenue: '٤٥,٠٠٠', email: 'sidirey@example.com' },
  { id: '2', name: 'شركة نجد للاستثمار', properties: 12, phone: '٠١١٤٥٦٧٨٩٠', status: 'نشط', totalRevenue: '١٢٠,٠٠٠', email: 'najd@invest.com' },
  { id: '3', name: 'فهد بن سلطان', properties: 3, phone: '٠٥٥٩٨٧٦٥٤٣', status: 'غير نشط', totalRevenue: '١٨,٠٠٠', email: 'fahad@example.com' },
  { id: '4', name: 'مريم الخليفة', properties: 2, phone: '٠٥٤٤٣٣٢٢١١', status: 'نشط', totalRevenue: '٢٢,٠٠٠', email: 'mariam@example.com' },
  { id: '5', name: 'مجموعة الفهد العقارية', properties: 8, phone: '٠١١٢٢٣٣٤٤٥', status: 'نشط', totalRevenue: '٩٥,٠٠٠', email: 'alfahd@group.com' },
];

const CONTRACTS = [
  { id: '1', tenant: 'محمد العتيبي', unit: 'شقة ٤٠٢', property: PROPERTIES[1].name, start: '٢٠٢٤/٠١/٠١', end: '٢٠٢٤/١٢/٣١', rent: '4,800', status: 'ساري' },
  { id: '2', tenant: 'شركة الأفق', unit: 'مكتب ٥', property: PROPERTIES[4].name, start: '٢٠٢٣/٠٧/١', end: '٢٠٢٤/٠٦/١٥', rent: '12,000', status: 'ينتهي قريباً' },
  { id: '3', tenant: 'سارة العمري', unit: 'فيلا ١٢', property: PROPERTIES[6].name, start: '٢٠٢٤/٠١/٢٠', end: '٢٠٢٥/٠١/٢٠', rent: '8,000', status: 'ساري' },
  { id: '4', tenant: 'فاطمة الزهراني', unit: 'شقة ٢٠٥', property: PROPERTIES[10].name, start: '٢٠٢٣/١٠/١', end: '٢٠٢٤/٠٩/١٥', rent: '3,800', status: 'منتهي' },
  { id: '5', tenant: 'خالد المالكي', unit: 'شقة ١٠٤', property: PROPERTIES[1].name, start: '٢٠٢٤/٠١/٠١', end: '٢٠٢٥/٠١/٠١', rent: '4,800', status: 'ساري' },
  { id: '6', tenant: 'نورة الدوسري', unit: 'فيلا ١٥', property: PROPERTIES[11].name, start: '٢٠٢٤/٠٢/١٠', end: '٢٠٢٥/٠٢/١٠', rent: '9,500', status: 'ساري' },
];

const INVOICES = TENANTS.map((t, i) => ({
  id: `#INV-2024-${String(i + 1).padStart(3, '0')}`,
  tenant: t.name,
  property: t.property,
  unit: t.unit,
  amount: t.rent,
  status: t.paid ? 'مدفوعة' : (t.status === 'late' ? 'متأخرة' : 'غير مدفوعة'),
  date: t.contractEnd.slice(0, 7),
}));

const VENDORS = [
  { id: '1', name: 'شركة التكييف المتقدمة', service: 'صيانة تكييف', type: 'تكييف', rating: 4.8, status: 'available', phone: '966500000001', jobs: 32, city: 'الرياض' },
  { id: '2', name: 'الكهربائي المتميز', service: 'أعمال كهرباء', type: 'كهرباء', rating: 4.5, status: 'busy', phone: '966500000002', jobs: 18, city: 'الرياض' },
  { id: '3', name: 'سباكة الخليج', service: 'سباكة وعزل', type: 'سباكة', rating: 4.2, status: 'available', phone: '966500000003', jobs: 24, city: 'الرياض' },
  { id: '4', name: 'شركة الدهانات الذهبية', service: 'دهانات وديكور', type: 'دهانات', rating: 4.6, status: 'available', phone: '966500000004', jobs: 15, city: 'جدة' },
  { id: '5', name: 'مكافحة الآفات السريعة', service: 'مكافحة آفات', type: 'مكافحة', rating: 4.3, status: 'busy', phone: '966500000005', jobs: 9, city: 'الدمام' },
  { id: '6', name: 'صيانة مصاعد الخليج', service: 'صيانة مصاعد', type: 'مصاعد', rating: 4.9, status: 'available', phone: '966500000006', jobs: 41, city: 'الرياض' },
];

const MSG_TEMPLATES = [
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

const PROPERTY_FORMS = [
  { id: '1', title: 'نموذج استلام وتسليم الوحدة', desc: 'محضر رسمي عند بداية ونهاية الإيجار', category: 'عقارات', icon: 'handshake', color: 'text-blue-600', bg: 'bg-blue-50', fields: [{ label: 'حالة الجدران', type: 'select', options: ['ممتازة', 'جيدة', 'تحتاج صيانة'] }, { label: 'حالة الأرضيات', type: 'select', options: ['ممتازة', 'جيدة', 'تحتاج صيانة'] }, { label: 'حالة الأجهزة', type: 'select', options: ['تعمل جميعها', 'بعضها معطل', 'لا توجد أجهزة'] }, { label: 'حالة التمديدات الكهربائية', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة السباكة', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'ملاحظات إضافية', type: 'textarea' }] },
  { id: '2', title: 'نموذج إشعار إخلاء الوحدة', desc: 'إشعار رسمي للمستأجر بضرورة الإخلاء', category: 'عقارات', icon: 'exit_to_app', color: 'text-red-600', bg: 'bg-red-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'رقم الوحدة', type: 'text' }, { label: 'سبب الإخلاء', type: 'select', options: ['انتهاء العقد', 'مخالفة الشروط', 'عدم السداد', 'أعمال بناء', 'أخرى'] }, { label: 'تاريخ الإخلاء المطلوب', type: 'date' }, { label: 'ملاحظات', type: 'textarea' }] },
  { id: '3', title: 'نموذج الفحص الدوري', desc: 'سجل فحص دوري لحالة الوحدة', category: 'صيانة', icon: 'fact_check', color: 'text-purple-600', bg: 'bg-purple-50', fields: [{ label: 'تاريخ الفحص', type: 'date' }, { label: 'المفتش المسؤول', type: 'text' }, { label: 'حالة الكهرباء', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة السباكة', type: 'select', options: ['سليمة', 'بحاجة فحص', 'بحاجة إصلاح'] }, { label: 'حالة التكييف', type: 'select', options: ['يعمل', 'بحاجة صيانة', 'معطل'] }, { label: 'الأمان والسلامة', type: 'select', options: ['مطابق', 'يحتاج تحسين', 'غير مطابق'] }, { label: 'ملاحظات المفتش', type: 'textarea' }] },
  { id: '4', title: 'نموذج الزيادة في الإيجار', desc: 'إشعار رسمي بزيادة قيمة الإيجار', category: 'مالية', icon: 'trending_up', color: 'text-emerald-600', bg: 'bg-emerald-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'قيمة الإيجار الحالية (ر.س)', type: 'number' }, { label: 'قيمة الإيجار الجديدة (ر.س)', type: 'number' }, { label: 'نسبة الزيادة (%)', type: 'number' }, { label: 'تاريخ تطبيق الزيادة', type: 'date' }, { label: 'مرفقات (لائحة وزارة الإسكان)', type: 'file' }] },
  { id: '5', title: 'نموذج طلب صيانة رسمي', desc: 'توثيق طلب صيانة من إدارة العقار', category: 'صيانة', icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50', fields: [{ label: 'نوع العطل', type: 'select', options: ['سباكة', 'كهرباء', 'تكييف', 'دهانات', 'نجارة', 'أخرى'] }, { label: 'درجة الأولوية', type: 'select', options: ['عاجل', 'متوسط', 'عادي'] }, { label: 'وصف المشكلة', type: 'textarea' }, { label: 'التكلفة التقديرية (ر.س)', type: 'number' }, { label: 'المورد المختار', type: 'select', options: VENDORS.map(v => v.name) }] },
  { id: '6', title: 'نموذج استبيان رضا المستأجرين', desc: 'قياس مستوى رضا السكان عن الخدمات', category: 'خدمات', icon: 'poll', color: 'text-amber-600', bg: 'bg-amber-50', fields: [{ label: 'تقييم جودة الخدمة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'سرعة الاستجابة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'مستوى النظافة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'الأمن والسلامة (1-5)', type: 'select', options: ['5 - ممتاز', '4 - جيد جداً', '3 - جيد', '2 - مقبول', '1 - ضعيف'] }, { label: 'هل تنصح بعقارنا للآخرين؟', type: 'select', options: ['نعم بالتأكيد', 'ربما', 'لا'] }, { label: 'ملاحظات واقتراحات', type: 'textarea' }] },
  { id: '7', title: 'نموذج الشكوى والاقتراح', desc: 'استقبال شكاوى واقتراحات المستأجرين', category: 'خدمات', icon: 'feedback', color: 'text-pink-600', bg: 'bg-pink-50', fields: [{ label: 'نوع البلاغ', type: 'select', options: ['شكوى', 'اقتراح', 'استفسار', 'طلب خدمة'] }, { label: 'القسم المعني', type: 'select', options: ['إدارة العقار', 'الصيانة', 'الأمن', 'النظافة', 'الإيجار', 'أخرى'] }, { label: 'تفاصيل البلاغ', type: 'textarea' }, { label: 'مرفقات (صور)', type: 'file' }] },
  { id: '8', title: 'نموذج إشعار انتهاء العقد (من المستأجر)', desc: 'إشعار رسمي من المستأجر بنيته الإخلاء', category: 'عقارات', icon: 'event_available', color: 'text-violet-600', bg: 'bg-violet-50', fields: [{ label: 'اسم المستأجر', type: 'text' }, { label: 'رقم الوحدة', type: 'text' }, { label: 'تاريخ الإخلاء المتوقع', type: 'date' }, { label: 'سبب المغادرة', type: 'select', options: ['انتهاء العقد', 'تغيير محل الإقامة', 'شراء مسكن', 'أسباب عائلية', 'أخرى'] }, { label: 'ملاحظات', type: 'textarea' }] },
];

// --- App Data Context (live data from SQLite API, seed data as fallback) ---

interface AppData {
  PROPERTIES:           typeof PROPERTIES;
  MAINTENANCE_REQUESTS: typeof MAINTENANCE_REQUESTS;
  UNITS:                typeof UNITS;
  TENANTS:              typeof TENANTS;
  OWNERS:               typeof OWNERS;
  CONTRACTS:            typeof CONTRACTS;
  VENDORS:              typeof VENDORS;
  INVOICES:             typeof INVOICES;
  // Mutations
  updateMaintenanceStatus: (id: string, status: string) => Promise<void>;
  createMaintenanceRequest: (data: {
    property: string; unit: string; date: string; type: string;
    technician?: string; description?: string; priority?: string;
  }) => Promise<void>;
  recordPayment: (tenantId: string) => Promise<void>;
  addProperty: (data: Property) => Promise<void>;
  renewContract: (id: string, newEnd: string) => Promise<void>;
}

const AppDataContext = createContext<AppData>({
  PROPERTIES,
  MAINTENANCE_REQUESTS,
  UNITS,
  TENANTS,
  OWNERS,
  CONTRACTS,
  VENDORS,
  INVOICES,
  updateMaintenanceStatus: async () => {},
  createMaintenanceRequest: async () => {},
  recordPayment: async () => {},
  addProperty: async () => {},
  renewContract: async () => {},
});

const useAppData = () => useContext(AppDataContext);

// --- Shared Components ---

const Icon = ({ name, className = "", filled = false }: { name: string, className?: string, filled?: boolean }) => (
  <span className={cn("material-symbols-outlined", filled && "filled", className)}>{name}</span>
);

type NavItem = {
  id: string;
  label: string;
  icon: string;
  highlight?: boolean;
};

const BottomNav = ({ active, onSelect }: { active: View, onSelect: (v: View) => void }) => {
  const { t } = useLang();
  const items: NavItem[] = [
    { id: 'manager_dashboard', label: t('nav_home'), icon: 'grid_view' },
    { id: 'property_details', label: t('nav_properties'), icon: 'apartment' },
    { id: 'ai_assistant', label: t('nav_ai_assistant'), icon: 'auto_awesome', highlight: true },
    { id: 'accounting', label: t('nav_finance'), icon: 'account_balance_wallet' },
    { id: 'settings', label: t('nav_settings'), icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {items.map((item) => {
        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id as View)}
              className="flex flex-col items-center gap-1 transition-all relative -mt-5"
            >
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all",
                active === item.id
                  ? "gold-gradient text-brand-dark scale-110 shadow-primary/30"
                  : "bg-brand-dark text-white"
              )}>
                <Icon name={item.icon} className="text-2xl" filled={active === item.id} />
              </div>
              <span className={cn("text-[9px] font-black", active === item.id ? "text-primary" : "text-slate-400")}>{item.label}</span>
            </button>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id as View)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative px-3 py-1 rounded-2xl",
              active === item.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {active === item.id && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 bg-primary/5 rounded-2xl"
              />
            )}
            <Icon name={item.icon} className="text-2xl relative z-10" filled={active === item.id} />
            <span className="text-[10px] font-black relative z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// --- Screen Components ---

const Logo = ({ className = "size-32" }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
    <img 
      src="https://ramzabdae.com/wp-content/uploads/2023/06/ramz005.png" 
      alt="Logo" 
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

// ── Login Screen (Admin) ──────────────────────────────────────────────────
const LoginScreen = ({
  onSuccess,
  onBack,
}: {
  onSuccess: (user: AdminUser) => void;
  onBack: () => void;
}) => {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('error_fill_fields'));
      return;
    }
    setLoading(true);
    try {
      const user = await apiLogin(email.trim(), password);
      onSuccess(user);
    } catch {
      setError(t('error_invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30 flex flex-col items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-primary rounded-2xl shadow-xl shadow-primary/30 mb-4">
            <Icon name="corporate_fare" className="text-3xl text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{t('login_title')}</h1>
          <p className="text-slate-400 text-sm mt-1">{t('property_managers_portal')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-7">
          <h2 className="text-lg font-black text-brand-dark mb-1">{t('sign_in')}</h2>
          <p className="text-xs text-slate-400 mb-6">{t('enter_credentials')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">{t('email')}</label>
              <div className="relative">
                <Icon name="email" className="absolute right-3 top-3 text-slate-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">{t('password')}</label>
              <div className="relative">
                <Icon name="lock" className="absolute right-3 top-3 text-slate-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl"
              >
                <Icon name="error_outline" className="text-base" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-black text-sm shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon name="autorenew" className="text-base animate-spin" />
                  {t('verifying')}
                </>
              ) : (
                <>
                  <Icon name="login" className="text-base" />
                  {t('login')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back */}
        <button
          onClick={onBack}
          className="mt-6 w-full text-slate-400 text-xs flex items-center justify-center gap-1 hover:text-white transition-colors"
        >
          <Icon name="arrow_forward" className="text-sm" />
          {t('back_to_home')}
        </button>
      </motion.div>
    </div>
  );
};

const WelcomeScreen = ({ onSelect }: { onSelect: (view: View) => void }) => {
  const { t } = useLang();
  const accountTypes = [
    { id: 'login', title: t('office_managers'), icon: 'corporate_fare', desc: t('office_managers_desc') },
    { id: 'owner_dashboard', title: t('owner_managers'), icon: 'real_estate_agent', desc: t('owner_managers_desc') },
    { id: 'tenant_dashboard', title: t('tenant_residents'), icon: 'person_pin_circle', desc: t('tenant_residents_desc') },
    { id: 'tech_portal', title: t('tech_portal'), icon: 'construction', desc: t('tech_portal_desc') },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center pt-16 pb-12 px-4 relative z-10"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Logo className="size-48" />
        </motion.div>
        <h1 className="text-white text-5xl font-black text-center mb-3 tracking-tight">
          رمز <span className="text-primary">الإبداع</span>
        </h1>
        <p className="text-slate-400 text-center max-w-xl font-medium text-xl tracking-wide">
          {t('welcome_subtitle')}
        </p>
        <div className="w-24 h-1 gold-gradient rounded-full mt-6"></div>
      </motion.header>

      <main className="flex-grow container mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {accountTypes.map((type, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(type.id as View)}
              className="group relative flex flex-col items-start p-8 bg-white/5 border border-white/10 hover:border-primary/50 rounded-3xl transition-all overflow-hidden text-right"
            >
              <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity -mr-16 -mt-16 rounded-full blur-2xl"></div>
              
              <div className="size-16 gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Icon name={type.icon} className="text-3xl text-brand-dark" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{type.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{type.desc}</p>
              
              <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <span className="text-xs font-bold uppercase tracking-widest">{t('enter_platform')}</span>
                <Icon name="arrow_back" className="text-sm" />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      <footer className="w-full py-12 px-4 relative z-10">
        <div className="container mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <Logo className="h-12 w-auto" />
          </div>
          <div className="flex gap-6 text-slate-500 text-sm font-bold">
            <a href="#" className="hover:text-primary transition-colors">عن الشركة</a>
            <a href="#" className="hover:text-primary transition-colors">خدماتنا</a>
            <a href="#" className="hover:text-primary transition-colors">اتصل بنا</a>
          </div>
          <p className="text-xs text-slate-600 font-medium">© 2024 شركة رمز الإبداع لادارة الاملاك. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

const ManagerDashboard = ({ onSelect, onSelectProperty }: { onSelect: (v: View) => void, onSelectProperty: (v: View, p: any) => void }) => {
  const { t, lang } = useLang();
  const { PROPERTIES, MAINTENANCE_REQUESTS, TENANTS, CONTRACTS } = useAppData();
  const chartData = [
    { name: 'يناير', value: 4000 },
    { name: 'فبراير', value: 3000 },
    { name: 'مارس', value: 2000 },
    { name: 'أبريل', value: 2780 },
    { name: 'مايو', value: 1890 },
    { name: 'يونيو', value: 2390 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="bg-white/10 p-1 rounded-xl backdrop-blur-md"
          >
            <Logo className="size-10" />
          </motion.div>
          <div>
            <h1 className="text-lg font-black leading-none text-white tracking-tight">رمز <span className="text-primary">الإبداع</span></h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Property Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button onClick={() => onSelect('ai_assistant')} className="relative p-2.5 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all" title="المساعد الذكي">
            <Icon name="auto_awesome" className="text-xl" />
          </button>
          <button onClick={() => onSelect('notifications')} className="relative p-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
            <Icon name="notifications" className="text-xl" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-brand-dark"></span>
          </button>
          <button onClick={() => onSelect('welcome')} className="p-1 rounded-xl border border-white/10 overflow-hidden">
            <div className="size-8 gold-gradient flex items-center justify-center rounded-lg">
              <Icon name="person" className="text-brand-dark text-xl" filled />
            </div>
          </button>
        </div>
      </header>

      <main className="p-5 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-black text-brand-dark tracking-tight">{t('dashboard_title')}</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">{t('dashboard_subtitle')}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
             <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">{t('today')}</button>
             <button className="px-4 py-1.5 text-slate-500 rounded-lg text-xs font-bold">{t('this_week')}</button>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-dark p-6 rounded-[2rem] shadow-2xl shadow-brand-dark/20 col-span-1 md:col-span-2 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">{t('total_collection')}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">١٤٥,٥٠٠ <span className="text-lg font-bold text-primary">ر.س</span></h3>
              </div>
              <div className="size-14 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Icon name="payments" className="text-brand-dark text-3xl" />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 relative z-10">
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black">
                <Icon name="trending_up" className="text-[12px]" />
                <span>+١٢.٥٪</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">{t('compare_last_month')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all"
          >
            <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all">
              <Icon name="apartment" className="text-2xl" filled />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t('total_properties')}</p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">{toArabicDigits(PROPERTIES.length, lang)}</h3>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all"
          >
            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary group-hover:gold-gradient group-hover:text-brand-dark transition-all">
              <Icon name="people" className="text-2xl" filled />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t('tenants')}</p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">٨٩</h3>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-brand-dark">{t('revenue_analysis')}</h3>
                  <p className="text-xs text-slate-400 font-medium">{t('monthly_growth')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold text-slate-500">{t('revenues')}</span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                      reversed
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                      labelStyle={{ fontWeight: '900', color: '#121212', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#C5A059" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#C5A059', strokeWidth: 3, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
               <h3 className="text-lg font-black text-brand-dark mb-6">{t('occupancy_distribution')}</h3>
              <div className="flex-grow flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-brand-dark">٩٢٪</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مشغول</span>
                </div>
                <ResponsiveContainer width="100%" height="200">
                  <PieChart>
                    <Pie
                      data={[
                        { name: t('occupied'), value: 92 },
                        { name: t('vacant_unit'), value: 8 }
                      ]}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#C5A059" />
                      <Cell fill="#F1F5F9" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <span className="text-xs font-bold text-slate-600">{t('rented_units')}</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">١٤٢</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-bold text-slate-600">{t('vacant_units')}</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">١٢</span>
                </div>
              </div>
           </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">{t('quick_actions')}</h3>
            <div className="h-px flex-grow mx-6 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('add_property'), icon: 'add_home', color: 'gold-gradient text-brand-dark', view: 'add_property' },
              { label: t('manage_contracts'), icon: 'history_edu', color: 'bg-brand-dark text-white', view: 'contracts' },
              { label: t('new_invoice'), icon: 'receipt_long', color: 'bg-white border-slate-100 text-slate-600', view: 'invoices' },
              { label: t('maintenance_request'), icon: 'build', color: 'bg-white border-slate-100 text-slate-600', view: 'new_maintenance' },
            ].map((action, i) => (
              <motion.button 
                key={i} 
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(action.view as View)} 
                className={cn("flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all", action.color)}
              >
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Icon name={action.icon} className="text-xl" />
                </div>
                <span className="text-xs font-black tracking-tight">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">{t('latest_properties')}</h3>
            <button onClick={() => onSelect('property_details')} className="text-primary text-xs font-black uppercase tracking-widest">{t('view_all')}</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
            {PROPERTIES.slice(0, 6).map((prop, i) => (
              <motion.div 
                key={prop.id}
                whileHover={{ y: -8 }}
                onClick={() => onSelectProperty('property_details', prop)}
                className="min-w-[280px] bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden cursor-pointer group"
              >
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${prop.id}/600/400`} 
                    alt={prop.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-primary text-brand-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {prop.type}
                  </div>
                  <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
                     <p className="text-white text-xs font-bold flex items-center gap-1">
                        <Icon name="location_on" className="text-sm text-primary" />
                        {prop.location}
                     </p>
                     <div className="flex gap-2">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           onSelectProperty('property_report', prop);
                         }}
                         className="size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-primary hover:text-brand-dark transition-all"
                         title="تقرير العقار"
                       >
                         <Icon name="description" className="text-lg" />
                       </button>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           // We need to set selected property and then print
                           // Since we are in ManagerDashboard, we can use a callback or global state
                           (window as any).selectProperty(prop);
                           setTimeout(() => window.print(), 500);
                         }}
                         className="size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-brand-yellow hover:text-brand-dark transition-all"
                         title="طباعة سريعة"
                       >
                         <Icon name="print" className="text-lg" />
                       </button>
                     </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-lg text-brand-dark mb-4">{prop.name}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <div className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                          <Icon name="door_front" className="text-lg" />
                       </div>
                       <span className="text-xs font-black text-slate-600">{toArabicDigits(prop.units, lang)} {t('unit_count')}</span>
                    </div>
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-brand-dark transition-all">
                       <Icon name="arrow_back" className="text-lg" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">{t('operations_management')}</h3>
            <div className="h-px flex-grow mx-6 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: t('tenants_label'), icon: 'group', bg: 'bg-blue-50', color: 'text-blue-600', badge: toArabicDigits(TENANTS.length, lang), view: 'tenants_management' },
              { label: t('owners_label'), icon: 'real_estate_agent', bg: 'bg-emerald-50', color: 'text-emerald-600', badge: toArabicDigits(OWNERS.length, lang), view: 'owners' },
              { label: t('contracts_label'), icon: 'history_edu', bg: 'bg-amber-50', color: 'text-amber-600', badge: toArabicDigits(CONTRACTS.length, lang), view: 'contracts' },
              { label: t('units_label'), icon: 'door_front', bg: 'bg-violet-50', color: 'text-violet-600', badge: toArabicDigits(UNITS.length, lang), view: 'units' },
              { label: t('vendors_label'), icon: 'engineering', bg: 'bg-orange-50', color: 'text-orange-600', badge: toArabicDigits(VENDORS.length, lang), view: 'vendors_management' },
              { label: t('assets_label'), icon: 'inventory', bg: 'bg-rose-50', color: 'text-rose-600', badge: '٤', view: 'asset_management' },
              { label: t('reports_label'), icon: 'bar_chart', bg: 'bg-sky-50', color: 'text-sky-600', badge: toArabicDigits(10, lang), view: 'reports' },
              { label: t('msg_templates_label'), icon: 'mark_email_unread', bg: 'bg-indigo-50', color: 'text-indigo-600', badge: toArabicDigits(MSG_TEMPLATES.length, lang), view: 'msg_templates' },
              { label: t('property_forms_label'), icon: 'description', bg: 'bg-pink-50', color: 'text-pink-600', badge: toArabicDigits(PROPERTY_FORMS.length, lang), view: 'property_forms' },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col gap-3 text-right hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={cn("size-11 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                    <Icon name={item.icon} className="text-xl" />
                  </div>
                  <span className="text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.badge}</span>
                </div>
                <p className="text-sm font-black text-brand-dark">{item.label}</p>
              </motion.button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const AccountingScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { INVOICES, TENANTS } = useAppData();
  const pieData = [
    { name: 'إيجارات', value: 70, color: '#C5A059' },
    { name: 'رسوم خدمات', value: 20, color: '#121212' },
    { name: 'أخرى', value: 10, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center bg-brand-dark px-6 py-5 justify-between sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-black text-white">المحاسبة والمالية</h2>
        <button className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="add" className="text-2xl" />
        </button>
      </header>

      <main className="p-6 space-y-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full rounded-[2.5rem] p-8 dark-gradient text-white shadow-2xl relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="account_balance_wallet" className="text-lg" filled />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">الرصيد المتاح</p>
            </div>
            <h3 className="text-5xl font-black tracking-tighter mt-2">50,000 <span className="text-xl font-bold text-primary/60">ر.س</span></h3>
            <div className="mt-6 flex items-center justify-between">
               <div className="flex gap-2 text-[10px] bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm font-bold text-slate-400">
                <span>آخر تحديث: اليوم، ٩:٣٠ ص</span>
              </div>
              <button className="text-xs font-black text-primary underline underline-offset-4">كشف حساب</button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex flex-col gap-4 rounded-[2rem] p-6 bg-white shadow-sm border border-slate-100 group"
          >
            <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Icon name="arrow_downward" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي الدخل</p>
              <p className="text-brand-dark text-2xl font-black tracking-tighter">12,000 <span className="text-xs font-bold text-slate-400">ر.س</span></p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex flex-col gap-4 rounded-[2rem] p-6 bg-white shadow-sm border border-slate-100 group"
          >
            <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <Icon name="arrow_upward" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">إجمالي المصروفات</p>
              <p className="text-brand-dark text-2xl font-black tracking-tighter">3,500 <span className="text-xs font-bold text-slate-400">ر.س</span></p>
            </div>
          </motion.div>
        </div>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-brand-dark mb-8">توزيع مصادر الدخل</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-full sm:w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-brand-dark">آخر المعاملات</h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest">فلترة</button>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {[
              { title: 'إيجار شقة ١٠٢', subtitle: 'محمد عبدالله • حوالة بنكية', amount: '+ 4,500 ر.س', time: '١٠:٣٠ ص', color: 'text-emerald-600', icon: 'home_work', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { title: 'صيانة تكييف', subtitle: 'شركة الصيانة السريعة • فيزا', amount: '- 350 ر.س', time: '٠٩:١٥ ص', color: 'text-rose-600', icon: 'build', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
              { title: 'رسوم خدمات برج بيان', subtitle: 'سداد نقدي • مكتب الاستقبال', amount: '+ 1,200 ر.س', time: 'أمس', color: 'text-emerald-600', icon: 'payments', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ bg: "#F8FAFC" }}
                className="flex items-center justify-between p-6 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                    <Icon name={item.icon} className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-black text-brand-dark">{item.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-base font-black ${item.color}`}>{item.amount}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav active="accounting" onSelect={onSelect} />
    </div>
  );
};

const InvoicesScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { INVOICES } = useAppData();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const filters = ['الكل', 'مدفوعة', 'غير مدفوعة', 'متأخرة'];

  const filteredInvoices = INVOICES.filter(inv =>
    activeFilter === 'الكل' || inv.status === activeFilter
  );

  const { totalCollected, totalPending } = INVOICES.reduce(
    (acc, inv) => {
      const val = Number(inv.amount.replace(',', ''));
      if (inv.status === 'مدفوعة') acc.totalCollected += val;
      else acc.totalPending += val;
      return acc;
    },
    { totalCollected: 0, totalPending: 0 }
  );

  const statusColor = (s: string) => {
    if (s === 'مدفوعة') return 'bg-emerald-100 text-emerald-700';
    if (s === 'متأخرة') return 'bg-rose-100 text-rose-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center justify-between px-6 py-5 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => onSelect('manager_dashboard')} className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
            <Icon name="arrow_forward" />
          </button>
          <h1 className="text-lg font-black text-white">الفواتير</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
            <Icon name="filter_list" />
          </button>
          <button className="flex items-center justify-center size-10 rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
            <Icon name="add" />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="size-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Icon name="account_balance_wallet" className="text-2xl" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+١٢٪</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">المحصل الكلي</p>
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">{toArabicDigits(totalCollected.toLocaleString())} <span className="text-sm font-bold text-slate-400">ر.س</span></h2>
            </div>
          </div>
          <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="size-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                <Icon name="pending_actions" className="text-2xl" />
              </div>
              <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">-٥٪</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">الرصيد المستحق</p>
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">{toArabicDigits(totalPending.toLocaleString())} <span className="text-sm font-bold text-slate-400">ر.س</span></h2>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm",
                activeFilter === f ? "bg-brand-dark text-white" : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-brand-dark">الفواتير {activeFilter !== 'الكل' ? `(${activeFilter})` : 'الحديثة'}</h3>
            <span className="text-primary text-xs font-black">{toArabicDigits(filteredInvoices.length)} فاتورة</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredInvoices.map((inv) => (
                <motion.div
                  key={inv.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-all">
                      <Icon name="receipt_long" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-brand-dark">{inv.tenant}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{inv.property} — {inv.unit} • {inv.id}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-brand-dark">{toArabicDigits(inv.amount)} ر.س</p>
                    <span className={cn("inline-block px-3 py-1 rounded-full text-[9px] font-black mt-1", statusColor(inv.status))}>
                      {inv.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredInvoices.length === 0 && (
              <div className="py-12 text-center">
                <Icon name="receipt_long" className="text-4xl text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">لا توجد فواتير بهذا الفلتر</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav active="invoices" onSelect={onSelect} />
    </div>
  );
};

const MaintenanceScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { t, lang } = useLang();
  const { MAINTENANCE_REQUESTS } = useAppData();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = [t('maintenance_new'), t('maintenance_in_progress'), t('maintenance_completed')];

  const filteredRequests = MAINTENANCE_REQUESTS.filter(req => {
    const matchesTab = 
      (activeTab === 0 && req.status === 'new') ||
      (activeTab === 1 && req.status === 'in_progress') ||
      (activeTab === 2 && req.status === 'completed');
    
    const matchesSearch = 
      req.property.includes(searchQuery) || 
      req.unit.includes(searchQuery) || 
      req.type.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center justify-between px-6 py-5 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => onSelect('manager_dashboard')} className="flex items-center justify-center size-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
            <Icon name="arrow_forward" />
          </button>
          <h1 className="text-lg font-black text-white">{t('maintenance_title')}</h1>
        </div>
        <button onClick={() => onSelect('new_maintenance')} className="flex items-center justify-center size-10 rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="add" />
        </button>
      </header>

      <div className="bg-brand-dark pb-6 px-6 shadow-xl">
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex-1 py-3 text-xs font-black transition-all rounded-xl",
                activeTab === i ? "gold-gradient text-brand-dark shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6 space-y-6">
        <div className="relative group">
          <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={t('search_maintenance')} 
            className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-4 pr-12 pl-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="size-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                <Icon name="warning" className="text-lg" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('urgent')}</p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">{MAINTENANCE_REQUESTS.filter(r => r.priority === 'high' && r.status !== 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Icon name="schedule" className="text-lg" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('avg_wait')}</p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">{toArabicDigits(2, lang)} {t('days')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-brand-dark text-base">{req.property} - {req.unit}</h3>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                          <Icon name="calendar_today" className="text-[12px]" />
                          {req.date}
                        </p>
                      </div>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm",
                        req.priority === 'high' ? "bg-rose-100 text-rose-700" : 
                        req.priority === 'medium' ? "bg-amber-100 text-amber-700" : 
                        "bg-blue-100 text-blue-700"
                      )}>
                        {req.priority === 'high' ? t('high_priority') : req.priority === 'medium' ? t('medium_priority') : t('low_priority')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-2xl">
                      <div className="size-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all">
                        <Icon name={req.type === 'تكييف' ? 'ac_unit' : req.type === 'سباكة' ? 'water_drop' : 'electrical_services'} className="text-xl" />
                      </div>
                      <p className="text-sm font-bold text-slate-600">{req.type}</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">{req.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/tech${req.id}/100/100`} alt="tech" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{req.technician}</span>
                      </div>
                      <button className="text-xs font-black text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('details')}
                        <Icon name="chevron_left" className="text-lg" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Icon name="search_off" className="text-3xl" />
                </div>
                <p className="text-slate-500 text-sm">{t('no_matching_requests')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav active="maintenance" onSelect={onSelect} />
    </div>
  );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img 
            src={images[currentIndex]} 
            alt={`Slide ${currentIndex}`} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`size-2 rounded-full transition-all ${currentIndex === i ? 'bg-primary w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Icon name="chevron_right" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Icon name="chevron_left" />
      </button>
    </div>
  );
};

const SupportScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => onSelect('manager_dashboard'), 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="send" className="text-4xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{t('message_sent_success')}</h2>
        <p className="text-slate-500">{t('support_team_contact')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <Icon name="arrow_forward" />
        </button>
        <h1 className="text-lg font-bold">{t('support_title')}</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-5 space-y-8">
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-black text-brand-dark">{t('how_can_we_help')}</h2>
          <p className="text-slate-500 text-sm">{t('we_are_here')}</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="call" />
            </div>
            <p className="text-xs font-bold">{t('direct_call')}</p>
            <p className="text-[10px] text-slate-400">٩٢٠٠٠١٢٣٤</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="chat" />
            </div>
            <p className="text-xs font-bold">{t('whatsapp')}</p>
            <p className="text-[10px] text-slate-400">٠٥٠١٢٣٤٥٦٧</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-6 shadow-xl border border-primary/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Icon name="mail" className="text-primary" />
            {t('send_us_message')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">{t('subject')}</label>
              <select required className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all">
                <option value="">{t('choose_inquiry_type')}</option>
                <option>{t('technical_issue')}</option>
                <option>{t('financial_inquiry')}</option>
                <option>{t('improvement_suggestion')}</option>
                <option>{t('other')}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">{t('message')}</label>
              <textarea 
                required 
                rows={4}
                placeholder={t('write_inquiry_details')}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 bg-primary text-brand-dark font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all",
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Icon name="sync" />
                </motion.div>
              ) : (
                <>
                  {t('send_message_btn')}
                  <Icon name="send" className="text-sm" />
                </>
              )}
            </button>
          </form>
        </section>
      </main>
      <BottomNav active="settings" onSelect={onSelect} />
    </div>
  );
};

const TenantSatisfactionReportScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { TENANTS } = useAppData();
  const satisfactionData = [
    { name: 'النظافة', value: 4.8 },
    { name: 'الصيانة', value: 4.2 },
    { name: 'الأمان', value: 4.9 },
    { name: 'المرافق', value: 4.5 },
    { name: 'التواصل', value: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">رضا المستأجرين</h2>
      </header>
      <main className="p-4 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">مؤشرات الرضا حسب الفئة</h3>
            <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
              متوسط ٤.٧/٥
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }}
                  width={60}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f2cc0d' : '#2d2d3a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">إجمالي التقييمات</p>
            <p className="text-2xl font-black text-brand-dark">١,٢٤٠</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">نسبة الاستجابة</p>
            <p className="text-2xl font-black text-emerald-500">٨٥٪</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">أحدث الملاحظات</h3>
          <div className="space-y-4">
            {[
              { user: 'محمد س.', comment: 'خدمة الصيانة سريعة جداً وممتازة.', rating: 5 },
              { user: 'سارة أ.', comment: 'المرافق نظيفة دائماً، شكراً لكم.', rating: 5 },
              { user: 'خالد م.', comment: 'نحتاج لزيادة عدد مواقف السيارات.', rating: 3 },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  {item.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold">{item.user}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, star) => (
                        <span key={star}>
                          <Icon 
                            name="star" 
                            className={cn("text-[10px]", star < item.rating ? "text-amber-400" : "text-slate-200")} 
                            filled={star < item.rating}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const PropertyDetailsScreen = ({ onSelect, property }: { onSelect: (v: View) => void, property: any }) => {
  const { TENANTS, MAINTENANCE_REQUESTS, UNITS } = useAppData();
  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <Icon name="arrow_forward" />
        </button>
        <h1 className="text-lg font-bold">تفاصيل العقار</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-400"
            title="طباعة سريعة"
          >
            <Icon name="print" />
          </button>
          <button 
            onClick={() => onSelect('property_report')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary"
            title="تقرير العقار"
          >
            <Icon name="description" />
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary">
            <Icon name="edit" />
          </button>
        </div>
      </header>

      <main className="space-y-6">
        <div className="px-5">
          <ImageCarousel images={[
            `https://picsum.photos/seed/${property.id}1/800/600`,
            `https://picsum.photos/seed/${property.id}2/800/600`,
            `https://picsum.photos/seed/${property.id}3/800/600`
          ]} />
        </div>

        <div className="px-5">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-primary/10 -mt-12 relative z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-black text-brand-dark mb-1">{property.name}</h2>
                <div className="flex items-center text-slate-500 text-sm">
                  <Icon name="location_on" className="text-primary text-[18px] ml-1" />
                  <span className="font-medium">{property.location}</span>
                </div>
              </div>
              <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 text-primary font-black text-xs uppercase tracking-wider">{property.type}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">إجمالي الوحدات</p>
                <p className="text-xl font-black text-brand-dark">{toArabicDigits(property.units)}</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الوحدات الشاغرة</p>
                <p className="text-xl font-black text-emerald-500">٤</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">العقود النشطة</p>
                <p className="text-xl font-black text-brand-dark">٤٤</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-5 grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ y: -2 }}
            className="col-span-2 bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-slate-500 text-xs font-medium mb-1">إجمالي الدخل الشهري</p>
              <p className="text-2xl font-bold">١٢٥,٠٠٠ <span className="text-sm font-medium text-primary">ر.س</span></p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Icon name="payments" /></div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28"
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-medium">إجمالي الوحدات</span>
              <Icon name="apartment" className="text-primary/60 text-lg" />
            </div>
            <p className="text-2xl font-bold">٢٤</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28"
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-medium">مشغولة</span>
              <span className="h-2 w-2 rounded-full bg-green-500 mt-1"></span>
            </div>
            <p className="text-2xl font-bold">٢٠</p>
            <p className="text-xs text-green-600 font-medium">٨٣٪ نسبة الإشغال</p>
          </motion.div>
        </div>

        <section className="px-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold">سجل الصيانة</h3>
            <button onClick={() => onSelect('maintenance')} className="text-xs text-primary font-bold">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {MAINTENANCE_REQUESTS.filter(r => r.property === 'برج بيان' || r.property === 'عمارة النخيل').slice(0, 2).map(req => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <Icon name={req.type === 'سباكة' ? 'faucet' : req.type === 'كهرباء' ? 'bolt' : req.type === 'تكييف' ? 'ac_unit' : 'format_paint'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{req.type} - {req.unit}</p>
                    <p className="text-[10px] text-slate-500">{req.date} • {req.technician}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold",
                  req.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                )}>
                  {req.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 space-y-3">
          <h3 className="text-base font-bold">الموقع على الخريطة</h3>
          <div className="h-48 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative z-0">
            <MapContainer center={[24.7136, 46.6753]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[24.7136, 46.6753]}>
                <Popup>
                  {property.name} <br /> {property.location}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      </main>

      <BottomNav active="property_details" onSelect={onSelect} />
    </div>
  );
};

const NewMaintenanceRequestScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { t } = useLang();
  const { PROPERTIES, UNITS, createMaintenanceRequest } = useAppData();

  // ── Controlled form state ────────────────────────────────────────────────
  const [selectedProperty, setSelectedProperty] = useState('');
  const [unit,             setUnit]             = useState('');
  const [category,         setCategory]         = useState('سباكة');
  const [priority,         setPriority]         = useState('متوسط');
  const [description,      setDescription]      = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [error,        setError]        = useState('');

  const priorityMap: Record<string, string> = { 'منخفض': 'low', 'متوسط': 'medium', 'عالي': 'high' };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedProperty) { setError(t('error_choose_building')); return; }
    if (!unit.trim())       { setError(t('error_enter_unit')); return; }
    if (!description.trim()){ setError(t('error_enter_description')); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await createMaintenanceRequest({
        property:    selectedProperty,
        unit:        unit.trim(),
        date:        new Date().toISOString().slice(0, 10),
        type:        category,
        description: description.trim(),
        priority:    priorityMap[priority] ?? 'medium',
      });
      setIsSuccess(true);
      setTimeout(() => onSelect('maintenance'), 1600);
    } catch {
      setError(t('error_sending'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="task_alt" className="text-6xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{t('request_submitted')}</h2>
        <p className="text-slate-500">{t('maintenance_team_review')}</p>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <button onClick={() => onSelect('maintenance')} className="flex size-12 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">{t('new_maintenance_title')}</h2>
      </header>

      <main className="p-4 space-y-6">
        {/* Property selector */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">{t('building_property')}</label>
            <select
              value={selectedProperty}
              onChange={e => setSelectedProperty(e.target.value)}
              className="w-full rounded-xl border-none bg-white py-3.5 pr-4 pl-10 focus:ring-2 focus:ring-primary shadow-sm text-base transition-all"
            >
              <option value="" disabled>{t('choose_building')}</option>
              {PROPERTIES.map(p => (
                <option key={p.id} value={p.name}>{p.name} — {p.location}</option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">{t('unit_number')}</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full rounded-xl border-none bg-white py-3.5 pr-4 pl-10 focus:ring-2 focus:ring-primary shadow-sm text-base transition-all"
            >
              <option value="" disabled>{t('choose_unit')}</option>
              {UNITS.filter(u => !selectedProperty || u.property === selectedProperty).map(u => (
                <option key={u.id} value={u.id}>{u.type} {u.id} — {u.property}</option>
              ))}
            </select>
            <input
              className="mt-1 w-full rounded-xl border-none bg-white py-3 px-4 focus:ring-2 focus:ring-primary shadow-sm transition-all text-sm"
              placeholder={t('enter_unit_manually')}
              value={unit}
              onChange={e => setUnit(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t('problem_category')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'سباكة',  icon: 'plumbing' },
              { label: 'كهرباء', icon: 'electrical_services' },
              { label: 'تكييف',  icon: 'ac_unit' },
              { label: 'مكافحة', icon: 'pest_control' },
              { label: 'دهان',   icon: 'format_paint' },
              { label: 'أخرى',   icon: 'more_horiz' },
            ].map((cat, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.label)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all border-2 ${category === cat.label ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-white text-slate-500'}`}
              >
                <Icon name={cat.icon} className="text-2xl" />
                <span className="text-xs font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">{t('priority_level')}</h3>
          <div className="flex w-full rounded-xl bg-slate-100 p-1">
            {['منخفض', 'متوسط', 'عالي'].map((p, i) => (
              <button
                key={i}
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${priority === p ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">{t('description')}</label>
          <textarea
            className="w-full min-h-[120px] rounded-xl border-none bg-white p-4 focus:ring-2 focus:ring-primary shadow-sm resize-none transition-all"
            placeholder={t('describe_problem')}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Photo placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">{t('attach_photos')}</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"
            >
              <Icon name="add_a_photo" className="text-3xl" />
              <span className="text-[10px] font-medium">{t('add_photo')}</span>
            </motion.button>
          </div>
        </div>

        {/* Validation error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold"
          >
            <Icon name="error" className="text-base" />
            {error}
          </motion.div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-4 text-white font-bold text-lg shadow-lg transition-all",
            isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-primary shadow-primary/20 hover:bg-primary-dark"
          )}
        >
          {isSubmitting
            ? <><span className="animate-spin text-xl">↻</span> {t('submitting')}</>
            : <><Icon name="send" /> {t('submit_request')}</>}
        </button>
      </main>
    </div>
  );
};
const TenantDashboard = ({ onSelect, onNavigateForms }: { onSelect: (v: View) => void; onNavigateForms?: (cat: string) => void }) => {
  const { TENANTS, CONTRACTS } = useAppData();
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Logo className="size-12" />
            </motion.div>
            <div>
              <h1 className="text-lg font-black text-brand-dark">أحمد سالم</h1>
              <p className="text-[10px] text-slate-400 font-bold">مستأجر لدى رمز الإبداع</p>
            </div>
          </div>
          <button onClick={() => onSelect('welcome')} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Icon name="logout" /></button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-dark text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border-2 border-primary/10"
        >
          <div className="relative z-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">الإيجار القادم</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black">4,500</span>
              <span className="text-sm font-bold text-slate-400">ريال سعودي</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <Icon name="calendar_month" className="text-primary text-sm" />
              <span className="font-bold">يستحق في: 01 يونيو 2024</span>
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 size-40 bg-primary rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="apartment" className="text-8xl" />
          </div>
        </motion.section>

        <section className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="size-1.5 bg-primary rounded-full"></span> إجراءات سريعة
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'دفع الإيجار', icon: 'payments', view: 'payment' },
              { label: 'طلب صيانة', icon: 'construction', view: 'new_maintenance' },
              { label: 'تواصل معنا', icon: 'support_agent', view: 'support' },
               { label: 'نماذج الإخلاء', icon: 'description', view: 'property_forms', formsCategory: 'عقارات' },
               { label: 'الشكاوى', icon: 'feedback', view: 'property_forms', formsCategory: 'خدمات' },
               { label: 'الإشعارات', icon: 'notifications', view: 'notifications', formsCategory: '' },
            ].map((act, i) => (
              <motion.button 
                key={i} 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (act.formsCategory && act.view === 'property_forms' && onNavigateForms) {
                    onNavigateForms(act.formsCategory);
                  } else if (act.view) {
                    onSelect(act.view as View);
                  }
                }}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-primary transition-colors shadow-sm"
              >
                <div className="size-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center"><Icon name={act.icon} /></div>
                <span className="text-[11px] font-bold">{act.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span className="size-1.5 bg-primary rounded-full"></span> حالة طلبات الصيانة
            </h2>
            <button onClick={() => onSelect('maintenance')} className="text-xs text-primary font-bold">عرض الكل</button>
          </div>
          <motion.div 
            whileHover={{ x: -4 }}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><Icon name="faucet" /></div>
              <div>
                <p className="text-sm font-bold">إصلاح صنبور المياه</p>
                <p className="text-[11px] text-slate-500">تم تقديمه: 24 مايو</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">قيد التنفيذ</span>
          </motion.div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 pb-6 z-50 flex justify-between items-center">
        <button onClick={() => onSelect('tenant_dashboard')} className="flex flex-col items-center gap-1 text-primary">
          <Icon name="home" className="filled" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button onClick={() => onSelect('payment')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <Icon name="payments" />
          <span className="text-[10px] font-medium">المدفوعات</span>
        </button>
        <div className="relative -top-6">
          <button onClick={() => onSelect('new_maintenance')} className="size-14 bg-primary text-slate-900 rounded-full shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-transform">
            <Icon name="add" className="text-2xl" />
          </button>
        </div>
        <button onClick={() => onSelect('maintenance')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <Icon name="handyman" />
          <span className="text-[10px] font-medium">الصيانة</span>
        </button>
        <button onClick={() => onSelect('settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <Icon name="person" />
          <span className="text-[10px] font-medium">الملف</span>
        </button>
      </nav>
    </div>
  );
};

const SettingsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">{t('settings_title')}</h2>
        <button className="text-primary font-bold text-sm px-2">{t('save')}</button>
      </header>

      <main className="p-4 space-y-6">
        <section className="flex flex-col items-center py-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1 bg-white shadow-sm overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPstPfUz-rsNQcTzy5hPNwvsl4rluDHwaVZWFbkw-FVVzEMDe5o_eV2NjL3rcKrXh-6TFewL5HGFRB4jm1FQf2w5nKffMsgJwY2dcYd1QuLjQiVKTHy5EtKlL7RDXjPhvPrPHScAT7yN5flaSp2DMrmfsMC_O0xaNiGvbAx_jJ8ycYE7_HuU2GWvwHlTxGozHX4yDX0AVPf0YGJyEvwY-W0ohnIcVlojAk8GLTMF_KFY3KMgPqzNmAPIBgVrrAt1R3t_oS3zx7DCg" 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <Icon name="edit" className="text-white text-sm" />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-bold">أحمد محمد عبد الله</h3>
          <p className="text-sm text-gray-500">{t('certified_property_manager')}</p>
          <p className="text-xs text-primary font-medium mt-1">ahmed.abdullah@estate-pro.sa</p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">هوية العلامة التجارية</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-black text-brand-dark">شعار المنشأة</p>
                <p className="text-[10px] text-gray-400">يظهر في التقارير والفواتير (PNG, SVG)</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-lg hover:bg-primary/20 transition-colors">تحديث الشعار</button>
                <div className="size-16 bg-brand-dark rounded-xl flex items-center justify-center border-2 border-primary/20 shadow-lg shadow-brand-dark/10 overflow-hidden">
                  <Logo className="size-12" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-sm font-black text-brand-dark mb-4">اللون الأساسي للنظام</p>
              <div className="flex items-center gap-4">
                {[
                  { hex: '#f2cc0d', name: 'رمز الإبداع' },
                  { hex: '#2563eb', name: 'أزرق كلاسيك' },
                  { hex: '#059669', name: 'أخضر ملكي' },
                  { hex: '#1e293b', name: 'رمادي ليلي' }
                ].map((color, i) => (
                  <button 
                    key={i} 
                    className={cn(
                      "group flex flex-col items-center gap-2",
                      i === 0 ? "opacity-100" : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-2xl border-2 shadow-sm",
                        i === 0 ? "border-primary scale-110" : "border-transparent"
                      )} 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-[9px] font-bold text-slate-400">{color.name}</span>
                  </button>
                ))}
                <button className="w-10 h-10 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-all">
                  <Icon name="colorize" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">التفضيلات</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="language" className="text-primary" />
                <span className="text-sm font-bold">اللغة</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-bold">
                <span>العربية</span>
                <Icon name="expand_more" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="payments" className="text-primary" />
                <span className="text-sm font-bold">العملة المفضلة</span>
              </div>
              <span className="text-primary text-sm font-bold">ريال سعودي (SAR)</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الأمان والخصوصية</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <button className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="lock" className="text-primary" />
                <span className="text-sm font-bold">تغيير كلمة المرور</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="verified_user" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">المصادقة الثنائية (2FA)</p>
                  <p className="text-[10px] text-gray-400">حماية إضافية لحسابك</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الإشعارات</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            {[
              { label: 'إشعارات البريد الإلكتروني', active: true },
              { label: 'تنبيهات العقود المنتهية', active: true },
              { label: 'رسائل المستأجرين', active: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-bold">{n.label}</span>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${n.active ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${n.active ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الدعم والمساعدة</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <button onClick={() => onSelect('support')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="support_agent" className="text-primary" />
                <span className="text-sm font-bold">تواصل مع الدعم الفني</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
            <button onClick={() => onSelect('docs')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="description" className="text-primary" />
                <span className="text-sm font-bold">دليل الاستخدام</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
          </div>
        </section>

        <button onClick={() => onSelect('welcome')} className="w-full py-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors">
          تسجيل الخروج
        </button>
      </main>

      <BottomNav active="settings" onSelect={onSelect} />
    </div>
  );
};

const ReportsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { TENANTS, CONTRACTS, MAINTENANCE_REQUESTS } = useAppData();
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">التقارير والتحليلات</h2>
      </header>
      <main className="p-4 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">التقارير المالية</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'تقرير الصك والوحدة العقارية', icon: 'description', view: 'property_report', color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'التقرير المالي السنوي', icon: 'payments', view: 'financial_report', color: 'text-brand-dark', bg: 'bg-brand-dark/5' },
              { title: 'إقرارات الزكاة والضريبة', icon: 'account_balance', view: 'zakat_tax', color: 'text-primary-dark', bg: 'bg-primary/10' },
            ].map((item, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">عرض وتحميل التقارير التفصيلية</p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">التشغيل والأداء</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'أداء الفنيين والموردين', icon: 'engineering', view: 'tech_performance', color: 'text-orange-600', bg: 'bg-orange-50' },
              { title: 'الأرشيف العقاري الذكي', icon: 'inventory_2', view: 'archive', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">متابعة مؤشرات الأداء والوثائق</p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">التجربة والرضا</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'مؤشر رضا المستأجرين', icon: 'sentiment_satisfied', view: 'tenant_satisfaction', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((item, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">تحليل استبيانات وملاحظات السكان</p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">التكاملات والإعدادات</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'ربط منصة إيجار', icon: 'sync_alt', view: 'ejar_integration', color: 'text-primary', bg: 'bg-primary/10' },
              { title: 'مركز المطورين (API)', icon: 'terminal', view: 'dev_center', color: 'text-slate-700', bg: 'bg-slate-100' },
              { title: 'نشر المشروع بالذكاء الاصطناعي', icon: 'rocket_launch', view: 'publish', color: 'text-violet-600', bg: 'bg-violet-50' },
              { title: 'المساعد الذكي (Gemini AI)', icon: 'auto_awesome', view: 'ai_assistant', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((item, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">إدارة الربط التقني والبيانات</p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">الإشعارات والنماذج</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'قوالب الرسائل الآلية', desc: 'رسائل العقود والمدفوعات والصيانة للملاك والمستأجرين', icon: 'mark_email_unread', view: 'msg_templates', color: 'text-sky-600', bg: 'bg-sky-50' },
              { title: 'نماذج وإشعارات العقارات', desc: 'استلام وتسليم، فحص دوري، إخلاء، وزيادة الإيجار', icon: 'description', view: 'property_forms', color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const AddPropertyScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { t } = useLang();
  const { PROPERTIES, addProperty } = useAppData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const exists = PROPERTIES.some(p => p.name === propertyName);
    if (exists) { setError(t('property_exists')); return; }
    setIsSubmitting(true);
    try {
      await addProperty({
        id: String(Date.now()),
        name: propertyName,
        location: '',
        units: 0,
        type: 'سكني',
      });
      setIsSuccess(true);
      setTimeout(() => onSelect('manager_dashboard'), 1500);
    } catch {
      setError(t('error_saving'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="check_circle" className="text-6xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{t('property_added_success')}</h2>
        <p className="text-slate-500">{t('redirecting_dashboard')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">{t('add_property_title')}</h2>
      </header>
      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold"
            >
              <Icon name="error" />
              {error}
            </motion.div>
          )}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">{t('property_name')}</label>
              <input 
                required 
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder={t('property_name_placeholder')} 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">{t('property_type')}</label>
              <select className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all">
                <option>{t('residential')}</option>
                <option>{t('commercial')}</option>
                <option>{t('mixed')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">{t('location')}</label>
              <div className="relative">
                <input required className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-10 pl-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder={t('location_placeholder')} type="text" />
                <Icon name="location_on" className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">{t('unit_count_label')}</label>
                <input required className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="0" type="number" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">{t('build_year')}</label>
                <input className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="2024" type="number" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">{t('property_photos')}</label>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Icon name="add_a_photo" className="text-3xl mb-1" />
              <span className="text-xs">{t('click_upload')}</span>
            </motion.div>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover-lift",
              isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-primary shadow-primary/20 hover:bg-primary-dark"
            )}
          >
            {isSubmitting ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Icon name="sync" />
              </motion.div>
            ) : t('save_property')}
          </button>
        </form>
      </main>
    </div>
  );
};

const OwnersManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  // Data from SQLite (via context)
  const { OWNERS } = useAppData();
  const [quickSendOwner, setQuickSendOwner] = useState<typeof OWNERS[0] | null>(null);
  const [ownerSendDone, setOwnerSendDone] = useState(false);
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">إدارة الملاك</h2>
        <button aria-label="فتح قوالب الرسائل" onClick={() => onSelect('msg_templates')} className="p-2 bg-primary/10 text-primary rounded-xl flex items-center gap-1 text-[10px] font-black hover:bg-primary/20 transition-colors">
          <Icon name="mail_outline" className="text-base" /> قوالب
        </button>
      </header>
      <main className="p-4 space-y-4">
        {/* Summary card */}
        <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70 mb-1">إجمالي الملاك</p>
              <h3 className="text-4xl font-black">{toArabicDigits(OWNERS.length)}</h3>
              <p className="text-[10px] text-primary mt-2 font-bold">
                {toArabicDigits(OWNERS.filter(o => o.status === 'نشط').length)} نشط •{' '}
                {toArabicDigits(OWNERS.filter(o => o.status !== 'نشط').length)} غير نشط
              </p>
            </div>
            <div className="size-16 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Icon name="real_estate_agent" className="text-brand-dark text-3xl" />
            </div>
          </div>
          <Icon name="business" className="absolute -bottom-4 -left-4 text-8xl opacity-10 rotate-12" />
        </div>

        {/* Owner list */}
        {OWNERS.map((owner) => (
          <motion.div
            key={owner.id}
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Icon name="person" className="text-2xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-brand-dark">{owner.name}</h4>
                <p className="text-xs text-gray-500">{toArabicDigits(owner.properties)} عقارات • {owner.phone}</p>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full",
                owner.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              )}>{owner.status}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Icon name="payments" className="text-[12px] text-primary" />
                <span className="font-bold">{owner.totalRevenue} ر.س/شهر</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Icon name="mail" className="text-[12px]" />
                <span>{owner.email}</span>
              </div>
            </div>
            <button
              onClick={() => { setQuickSendOwner(owner); setOwnerSendDone(false); }}
              className="mt-3 w-full text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Icon name="send" className="text-xs" /> إرسال تقرير للمالك
            </button>
          </motion.div>
        ))}
      </main>

      {/* Quick Send Modal */}
      <AnimatePresence>
        {quickSendOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!ownerSendDone) setQuickSendOwner(null); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {ownerSendDone ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Icon name="check_circle" className="text-4xl" />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark">تم الإرسال!</h3>
                  <p className="text-xs text-slate-400 mt-1">تم إرسال الرسالة إلى {quickSendOwner.name}</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Icon name="real_estate_agent" className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-black text-brand-dark">{quickSendOwner.name}</h3>
                      <p className="text-[10px] text-slate-400">{toArabicDigits(quickSendOwner.properties)} عقار • {quickSendOwner.email}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-3">اختر القالب المناسب للمالك:</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {MSG_TEMPLATES.filter(t => t.recipient === 'مالك').map(tmpl => (
                      <button
                        key={tmpl.id}
                        onClick={() => { setOwnerSendDone(true); setTimeout(() => setQuickSendOwner(null), 1600); }}
                        className={cn("w-full text-right p-3 rounded-xl border flex items-start gap-3 transition-all hover:border-emerald-300 hover:bg-emerald-50", tmpl.bg, "border-transparent")}
                      >
                        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60", tmpl.color)}>
                          <Icon name={tmpl.icon} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs font-black text-brand-dark">{tmpl.title}</p>
                            {tmpl.auto && <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">آلي</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold">{tmpl.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setQuickSendOwner(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const UnitsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { UNITS } = useAppData();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const filters = ['الكل', 'شاغرة', 'مؤجرة', 'تحت الصيانة'];

  const filteredUnits = UNITS.filter(unit => 
    activeFilter === 'الكل' || unit.status === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">إدارة الوحدات</h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <AnimatePresence mode="popLayout">
          {filteredUnits.map((unit, i) => (
            <motion.div 
              key={`${unit.property}-${unit.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name={unit.type === 'شقة' ? 'apartment' : unit.type === 'مكتب' ? 'corporate_fare' : 'home'} />
                </div>
                <div>
                  <h4 className="font-bold">وحدة {toArabicDigits(unit.id)} - {unit.type}</h4>
                  <p className="text-[10px] text-gray-500">{unit.property}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-primary">{toArabicDigits(unit.rent)} ر.س</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${unit.status === 'مؤجرة' ? 'bg-green-100 text-green-700' : unit.status === 'شاغرة' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{unit.status}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredUnits.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="search_off" className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">لا توجد وحدات بهذه الحالة</p>
          </div>
        )}
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const ContractsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { CONTRACTS, renewContract } = useAppData();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [quickSendContract, setQuickSendContract] = useState<typeof CONTRACTS[0] | null>(null);
  const [quickSendDone, setQuickSendDone] = useState(false);
  const filters = ['الكل', 'ساري', 'ينتهي قريباً', 'منتهي'];

  const filtered = CONTRACTS.filter(c =>
    activeFilter === 'الكل' || c.status === activeFilter
  );

  const statusStyle = (s: string) => {
    if (s === 'ساري') return 'bg-green-100 text-green-700';
    if (s === 'ينتهي قريباً') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">إدارة العقود</h2>
        <button aria-label="فتح قوالب الرسائل" onClick={() => onSelect('msg_templates')} className="p-2 bg-primary/10 text-primary rounded-xl flex items-center gap-1 text-[10px] font-black hover:bg-primary/20 transition-colors">
          <Icon name="mail_outline" className="text-base" /> قوالب
        </button>
      </header>
      <main className="p-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'سارية', value: toArabicDigits(CONTRACTS.filter(c => c.status === 'ساري').length), cls: 'bg-green-50 text-green-600' },
            { label: 'تنتهي قريباً', value: toArabicDigits(CONTRACTS.filter(c => c.status === 'ينتهي قريباً').length), cls: 'bg-amber-50 text-amber-600' },
            { label: 'منتهية', value: toArabicDigits(CONTRACTS.filter(c => c.status === 'منتهي').length), cls: 'bg-red-50 text-red-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className={cn("text-2xl font-black", s.cls.split(' ')[1])}>{s.value}</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeFilter === f
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Contract list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((contract) => (
            <motion.div
              key={contract.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 text-primary rounded-xl flex items-center justify-center">
                    <Icon name="history_edu" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{contract.tenant}</h4>
                    <p className="text-xs text-gray-500">{contract.property} — {contract.unit}</p>
                  </div>
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", statusStyle(contract.status))}>
                  {contract.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
                <div>
                  <p className="text-[9px] text-gray-400 mb-0.5">الإيجار الشهري</p>
                  <p className="text-xs font-black text-primary">{toArabicDigits(contract.rent)} ر.س</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 mb-0.5">بداية العقد</p>
                  <p className="text-xs font-bold text-brand-dark">{contract.start}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 mb-0.5">نهاية العقد</p>
                  <p className="text-xs font-bold text-brand-dark">{contract.end}</p>
                </div>
              </div>
              {contract.status !== 'منتهي' ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const newEnd = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
                      renewContract(contract.id, newEnd);
                    }}
                    className="text-primary text-xs font-bold flex items-center justify-center gap-1 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <Icon name="refresh" className="text-xs" /> تجديد العقد
                  </button>
                  <button
                    onClick={() => { setQuickSendContract(contract); setQuickSendDone(false); }}
                    className="text-sky-600 text-xs font-bold flex items-center justify-center gap-1 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors"
                  >
                    <Icon name="send" className="text-xs" /> إرسال رسالة
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setQuickSendContract(contract); setQuickSendDone(false); }}
                  className="mt-3 w-full text-slate-500 text-xs font-bold flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Icon name="send" className="text-xs" /> إرسال رسالة
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="search_off" className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">لا توجد عقود بهذه الحالة</p>
          </div>
        )}
      </main>

      {/* Quick Send Modal */}
      <AnimatePresence>
        {quickSendContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!quickSendDone) setQuickSendContract(null); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {quickSendDone ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Icon name="check_circle" className="text-4xl" />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark">تم الإرسال!</h3>
                  <p className="text-xs text-slate-400 mt-1">تم إرسال الرسالة إلى {quickSendContract.tenant}</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
                      <Icon name="send" className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-black text-brand-dark">إرسال رسالة</h3>
                      <p className="text-[10px] text-slate-400">{quickSendContract.tenant} • {quickSendContract.unit}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-3">اختر القالب المناسب:</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {MSG_TEMPLATES.filter(t => {
                      if (t.category !== 'عقود') return false;
                      // Show renewal/expiry templates for active/expiring; payment reminder for all active
                      if (quickSendContract.status === 'منتهي') return t.id === '5' || t.id === '6'; // owner reports only
                      if (quickSendContract.status === 'ينتهي قريباً') return ['2', '3', '4', '5'].includes(t.id);
                      return true; // ساري: show all contract templates
                    }).map(tmpl => (
                      <button
                        key={tmpl.id}
                        onClick={() => { setQuickSendDone(true); setTimeout(() => setQuickSendContract(null), 1600); }}
                        className={cn("w-full text-right p-3 rounded-xl border flex items-start gap-3 transition-all hover:border-primary hover:bg-primary/5", tmpl.bg, "border-transparent")}
                      >
                        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60", tmpl.color)}>
                          <Icon name={tmpl.icon} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-brand-dark">{tmpl.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{tmpl.preview.length > 60 ? `${tmpl.preview.slice(0, 60)}...` : tmpl.preview}</p>
                        </div>
                        {tmpl.auto && <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">آلي</span>}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setQuickSendContract(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const TechnicalDocsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">التوثيق التقني</h2>
      </header>
      <main className="p-4 space-y-6">
        <div className="text-center py-6">
          <h3 className="text-2xl font-bold mb-2">تحميل الوثائق التقنية</h3>
          <p className="text-sm text-gray-500">احصل على الدليل الشامل للمطورين والمهندسين</p>
        </div>
        <div className="space-y-3">
          {[
            { title: 'بنية النظام', icon: 'account_tree', desc: 'نظرة عامة على الهيكل المعماري' },
            { title: 'نقاط الـ API', icon: 'api', desc: 'توثيق كامل للطلبات والاستجابات' },
            { title: 'مخطط البيانات', icon: 'database', desc: 'جداول العلاقات والمفاتيح' },
            { title: 'بروتوكولات الأمان', icon: 'security', desc: 'معايير التشفير والوصول' },
          ].map((doc, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Icon name={doc.icon} /></div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{doc.title}</h4>
                <p className="text-[10px] text-gray-400">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
          <Icon name="download" /> تحميل الدليل التقني (PDF)
        </button>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const NotificationsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { CONTRACTS } = useAppData();
  const [filter, setFilter] = useState('الكل');

  // Generate smart notifications from data
  const notifications = [
    // Expiring contracts
    ...CONTRACTS.filter(c => c.status === 'ينتهي قريباً').map(c => ({
      id: `contract-${c.id}`,
      title: 'تذكير: عقد ينتهي قريباً',
      desc: `عقد المستأجر ${c.tenant} (${c.unit} - ${c.property}) ينتهي بتاريخ ${c.end}`,
      time: 'منذ ساعة',
      icon: 'event_busy',
      color: 'text-red-600',
      bg: 'bg-red-50',
      category: 'عقود',
    })),
    // Late tenants
    ...TENANTS.filter(t => !t.paid).map(t => ({
      id: `tenant-${t.id}`,
      title: 'تأخر في سداد الإيجار',
      desc: `${t.name} (${t.unit} - ${t.property}) لم يسدد إيجار هذا الشهر بقيمة ${t.rent} ر.س`,
      time: 'منذ يومين',
      icon: 'payments',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      category: 'مالية',
    })),
    // Active maintenance (high priority)
    ...MAINTENANCE_REQUESTS.filter(r => r.status !== 'completed' && r.priority === 'high').map(r => ({
      id: `maint-${r.id}`,
      title: 'طلب صيانة عاجل',
      desc: `${r.type}: ${r.description} — ${r.property} (${r.unit})`,
      time: 'منذ 3 ساعات',
      icon: 'build_circle',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      category: 'صيانة',
    })),
    // Completed maintenance
    ...MAINTENANCE_REQUESTS.filter(r => r.status === 'completed').slice(0, 2).map(r => ({
      id: `done-${r.id}`,
      title: 'طلب صيانة مكتمل',
      desc: `تم إغلاق بلاغ ${r.type} في ${r.property} (${r.unit}) بواسطة ${r.technician}`,
      time: 'أمس',
      icon: 'task_alt',
      color: 'text-green-600',
      bg: 'bg-green-50',
      category: 'صيانة',
    })),
    // System
    {
      id: 'sys-1',
      title: 'تنبيه أمان',
      desc: 'تم تسجيل دخول جديد لحسابك من جهاز غير معروف',
      time: 'منذ يوم',
      icon: 'security',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      category: 'نظام',
    },
  ];

  const categories = ['الكل', 'عقود', 'مالية', 'صيانة', 'نظام'];
  const filtered = filter === 'الكل' ? notifications : notifications.filter(n => n.category === filter);

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">
          مركز التنبيهات
          {notifications.length > 0 && (
            <span className="mr-2 text-xs font-black bg-red-500 text-white rounded-full px-1.5 py-0.5">{toArabicDigits(notifications.length)}</span>
          )}
        </h2>
      </header>
      <main className="p-4 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                filter === cat ? "bg-brand-dark text-white shadow-md" : "bg-white border border-gray-100 text-gray-500"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                <Icon name={notif.icon} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{notif.title}</h4>
                    <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full", notif.bg, notif.color)}>{notif.category}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 mr-2">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="notifications_off" className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">لا توجد تنبيهات</p>
          </div>
        )}
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const ReportLayout = ({ children, title, onBack }: { children: React.ReactNode, title: string, onBack: () => void }) => {
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error("Print failed", e);
      // Fallback for some environments
      const printContent = document.querySelector('main')?.innerHTML;
      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`<html><head><title>${title}</title></head><body>${printContent}</body></html>`);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] print:bg-white pb-24 print:pb-0">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm border-b border-primary/10 print:hidden">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            title="طباعة التقرير"
          >
            <Icon name="print" />
          </button>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block relative h-48 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center">
            <Logo className="size-28" />
            <h1 className="mt-4 text-2xl font-black text-brand-dark">شركة رمز الإبداع لإدارة الأملاك</h1>
          </div>
          {/* Decorative Arcs */}
          <div className="absolute -left-20 top-0 size-64 border-[16px] border-primary rounded-full opacity-20"></div>
          <div className="absolute -right-20 bottom-0 size-64 border-[16px] border-brand-dark rounded-full opacity-20"></div>
        </div>
      </div>

      <main className="p-4 print:p-0 space-y-6">
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-100 pb-4">
          <h2 className="text-xl font-black text-brand-dark inline-block px-8 py-2 bg-slate-50 rounded-lg">{title}</h2>
          <p className="text-xs text-slate-400 mt-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        {children}
      </main>

      {/* Print Footer */}
      <div className="hidden print:block fixed bottom-0 left-0 right-0 h-16 bg-brand-dark">
        <div className="absolute inset-y-0 left-0 w-32 bg-primary skew-x-[-30deg] -ml-16"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-primary skew-x-[30deg] -mr-16"></div>
        <div className="flex justify-center items-center h-full gap-8 text-[10px] font-bold text-white relative z-10">
          <div className="flex items-center gap-2">
            <Icon name="call" className="text-primary text-sm" />
            <span>920013517</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="mail" className="text-primary text-sm" />
            <span>info@ramzabdae.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="language" className="text-primary text-sm" />
            <span>www.ramzabdae.com</span>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 left-6 flex flex-col gap-3 print:hidden z-50">
        <button 
          onClick={handlePrint}
          className="bg-brand-dark text-primary p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all font-bold"
        >
          <Icon name="print" />
          <span className="hidden md:inline">طباعة التقرير</span>
        </button>
        <button 
          className="bg-primary text-brand-dark p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all font-bold"
        >
          <Icon name="share" />
          <span className="hidden md:inline">مشاركة</span>
        </button>
      </div>
    </div>
  );
};

const FinancialReportScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { TENANTS, INVOICES } = useAppData();
  return (
    <ReportLayout title="التقرير المالي السنوي" onBack={() => onSelect('reports')}>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:border-none print:shadow-none">
        <p className="text-xs text-gray-500 mb-1">إجمالي الأرباح لعام 2023</p>
        <h3 className="text-3xl font-extrabold text-brand-dark">1,245,000 <span className="text-sm font-normal">ر.س</span></h3>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden print:hidden">
          <div className="h-full bg-primary w-3/4"></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">تم تحصيل 75% من الهدف السنوي</p>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-bold text-brand-dark">ملخص الأرباع</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'الربع الأول', val: '310,000', trend: '+5%', color: 'text-emerald-500' },
            { label: 'الربع الثاني', val: '285,000', trend: '-2%', color: 'text-rose-500' },
            { label: 'الربع الثالث', val: '340,000', trend: '+8%', color: 'text-emerald-500' },
            { label: 'الربع الرابع', val: '310,000', trend: '+4%', color: 'text-emerald-500' },
          ].map((q, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between print:border-slate-200">
              <span className="text-sm font-bold">{q.label}</span>
              <div className="text-left">
                <p className="text-sm font-bold text-brand-dark">{q.val} ر.س</p>
                <span className={`text-[10px] font-bold ${q.color}`}>{q.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:border-slate-200">
        <h3 className="font-bold mb-4">توزيع الإيرادات</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'إيجارات سكنية', value: 65 },
                  { name: 'إيجارات تجارية', value: 25 },
                  { name: 'رسوم خدمات', value: 10 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#f2cc0d" />
                <Cell fill="#2d2d3a" />
                <Cell fill="#94a3b8" />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ReportLayout>
  );
};

const ZakatTaxScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <ReportLayout title="الزكاة والضريبة" onBack={() => onSelect('reports')}>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-dark">إقرار الربع الحالي</h3>
          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full print:border print:border-orange-200">بانتظار التقديم</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">ضريبة القيمة المضافة (15%)</span>
            <span className="text-sm font-bold text-brand-dark">45,200 ر.س</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">الزكاة التقديرية</span>
            <span className="text-sm font-bold text-brand-dark">12,800 ر.س</span>
          </div>
          <div className="pt-4 border-t border-gray-50 flex justify-between">
            <span className="font-bold text-brand-dark">الإجمالي المستحق</span>
            <span className="font-bold text-primary text-lg">58,000 ر.س</span>
          </div>
        </div>
      </div>
      <button className="w-full py-4 bg-primary text-brand-dark font-black rounded-2xl shadow-lg shadow-primary/20 print:hidden">تقديم الإقرار الضريبي</button>
    </ReportLayout>
  );
};

const EjarIntegrationScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <ReportLayout title="تكامل منصة إيجار" onBack={() => onSelect('reports')}>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center print:border-slate-200">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 print:border print:border-green-100">
          <Icon name="verified" className="text-green-600 text-4xl" />
        </div>
        <h3 className="text-lg font-bold text-brand-dark">حالة الربط: متصل</h3>
        <p className="text-xs text-gray-400 mt-1">آخر مزامنة: منذ ١٠ دقائق</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-brand-dark">إحصائيات المزامنة</h3>
        {[
          { label: 'العقود المزامنة', val: '145' },
          { label: 'بانتظار المزامنة', val: '3' },
          { label: 'أخطاء المزامنة', val: '0' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between print:border-slate-200">
            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
            <span className="font-bold text-brand-dark">{stat.val}</span>
          </div>
        ))}
      </div>
      <button className="w-full py-4 border-2 border-primary text-primary font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors print:hidden">
        <Icon name="sync" /> مزامنة البيانات الآن
      </button>
    </ReportLayout>
  );
};

const TechPerformanceScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { MAINTENANCE_REQUESTS } = useAppData();
  const completedRequests = MAINTENANCE_REQUESTS.filter(r => r.status === 'completed');
  const activeRequests = MAINTENANCE_REQUESTS.filter(r => r.status !== 'completed');

  // Build technician performance from MAINTENANCE_REQUESTS
  const techMap: Record<string, { name: string; completed: number; active: number }> = {};
  MAINTENANCE_REQUESTS.forEach(r => {
    if (!techMap[r.technician]) {
      techMap[r.technician] = { name: r.technician, completed: 0, active: 0 };
    }
    if (r.status === 'completed') techMap[r.technician].completed++;
    else techMap[r.technician].active++;
  });

  // Merge with static rating info for display
  const ratingMap: Record<string, number> = {
    'أحمد محمود': 4.8,
    'خالد علي': 4.5,
    'ياسين حسن': 4.9,
    'سعيد محمد': 4.2,
  };

  const techs = Object.values(techMap).map(t => ({
    ...t,
    rating: ratingMap[t.name] ?? 4.0,
    status: t.active > 0 ? 'مشغول' : 'متاح',
  })).sort((a, b) => b.completed - a.completed);

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">أداء الفنيين</h2>
      </header>
      <main className="p-4 space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'إجمالي الطلبات', value: toArabicDigits(MAINTENANCE_REQUESTS.length), icon: 'build', bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'مكتملة', value: toArabicDigits(completedRequests.length), icon: 'task_alt', bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'نشطة', value: toArabicDigits(activeRequests.length), icon: 'pending', bg: 'bg-amber-50', color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
              <div className={cn("size-9 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-lg" />
              </div>
              <p className="text-xl font-black text-brand-dark">{s.value}</p>
              <p className="text-[9px] font-bold text-slate-400 text-center">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Technician cards */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 px-1">تفاصيل الفنيين</h3>
          {techs.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Icon name="person" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-brand-dark">{tech.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Icon name="star" className="text-[10px] text-amber-400" filled />
                    <span className="text-[10px] font-bold text-slate-500">{tech.rating}</span>
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full",
                  tech.status === 'متاح' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {tech.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                <div className="bg-green-50 rounded-xl p-2 text-center">
                  <p className="text-lg font-black text-green-700">{toArabicDigits(tech.completed)}</p>
                  <p className="text-[9px] font-bold text-green-600">مكتملة</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 text-center">
                  <p className="text-lg font-black text-amber-700">{toArabicDigits(tech.active)}</p>
                  <p className="text-[9px] font-bold text-amber-600">نشطة</p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

// ---- AI Assistant Types ----
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
};

const AI_QUICK_PROMPTS = [
  { text: 'كم عدد الوحدات الشاغرة؟', icon: 'door_open' },
  { text: 'ما هي نسبة إشغال العقارات؟', icon: 'donut_large' },
  { text: 'كيف أُحسّن معدل التحصيل؟', icon: 'trending_up' },
  { text: 'عقود تنتهي قريباً', icon: 'event_busy' },
  { text: 'ملخص طلبات الصيانة', icon: 'build_circle' },
  { text: 'اقترح سعر إيجار مناسب لشقة في الرياض', icon: 'price_check' },
  { text: 'كيف أعدّل ألوان النظام؟', icon: 'palette' },
  { text: 'أضف ميزة جديدة للتطبيق', icon: 'extension' },
];

const PROPERTY_CONTEXT = (() => {
  const totalProps = PROPERTIES.length;
  const activeTenants = TENANTS.length;
  const rentedUnits = UNITS.filter(u => u.status === 'مؤجرة').length;
  const vacantUnits = UNITS.filter(u => u.status === 'شاغرة').length;
  const occupancyPct = (rentedUnits + vacantUnits) > 0 ? Math.round((rentedUnits / (rentedUnits + vacantUnits)) * 100) : 0;
  const activeMaintenanceRequests = MAINTENANCE_REQUESTS.filter(r => r.status !== 'completed').length;
  const highPriorityMaintenance = MAINTENANCE_REQUESTS.filter(r => r.priority === 'high' && r.status !== 'completed').length;
  const expiringContracts = CONTRACTS.filter(c => c.status === 'ينتهي قريباً').length;
  const cities = [...new Set(PROPERTIES.map(p => p.location.split('،')[0]))].join('، ');
  return `
أنت مساعد ذكاء اصطناعي متخصص لنظام إدارة الأملاك - منصة شركة رمز الإبداع.
البيانات الحالية في النظام:
- عدد العقارات: ${totalProps} عقار
- المستأجرين: ${activeTenants} مستأجر
- الوحدات المؤجرة: ${rentedUnits} | الوحدات الشاغرة: ${vacantUnits}
- نسبة الإشغال: ${occupancyPct}%
- طلبات الصيانة النشطة: ${activeMaintenanceRequests} (منها ${highPriorityMaintenance} عالية الأولوية)
- عقود تنتهي قريباً: ${expiringContracts}
- التقنيات المستخدمة: React 19، TypeScript، Vite، Tailwind CSS، Recharts، Gemini AI
- المدن: ${cities}

ملاحظة: الأرقام والإحصائيات المذكورة هنا تقريبية ولأغراض الشرح، وقد لا تتطابق دائماً مع بيانات الـ mock في الكود.

أجب باللغة العربية بأسلوب احترافي ومختصر. إذا سُئلت عن تطوير المشروع أو إضافة ميزات، قدّم اقتراحات عملية مع أمثلة كود عند الحاجة.
`;
})();

const AIAssistantScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { PROPERTIES, TENANTS, CONTRACTS, MAINTENANCE_REQUESTS } = useAppData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      text: 'مرحباً! أنا مساعدك الذكي لإدارة الأملاك 🏢\n\nأستطيع مساعدتك في:\n• تحليل بيانات عقاراتك ومستأجريك\n• الإجابة على استفسارات المحاسبة والصيانة\n• اقتراح تحسينات وتطوير للتطبيق\n• تقديم توصيات لزيادة الإيرادات\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(1).map(m => ({
        role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

      // Call secure backend endpoint that communicates with Gemini using server-side API key
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          prompt: text.trim(),
          systemInstruction: PROPERTY_CONTEXT,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || 'فشل طلب الدردشة إلى الخادم');
      }

      const data: { text?: string } = await response.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text ?? 'لم أتمكن من الحصول على إجابة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ ${errMsg}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#f8f8f5] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-10 shadow-lg">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Icon name="arrow_forward" className="text-2xl text-white" />
        </button>
        <div className="flex items-center gap-3 flex-1 justify-center pr-4">
          <div className="w-9 h-9 gold-gradient rounded-full flex items-center justify-center shadow-md">
            <Icon name="auto_awesome" className="text-brand-dark text-lg" filled />
          </div>
          <div>
            <h2 className="text-base font-black text-white leading-none">المساعد الذكي</h2>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5">مدعوم بـ Gemini AI • رمز الإبداع</p>
          </div>
        </div>
        <button
          onClick={() => setMessages(prev => [prev[0]])}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          title="مسح المحادثة"
        >
          <Icon name="delete_sweep" className="text-xl text-slate-400" />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === 'assistant'
                  ? "gold-gradient text-brand-dark shadow-sm"
                  : "bg-brand-dark text-white"
              )}>
                <Icon
                  name={msg.role === 'assistant' ? 'auto_awesome' : 'person'}
                  className="text-sm"
                  filled
                />
              </div>

              {/* Bubble */}
              <div className={cn(
                "max-w-[80%] space-y-1",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                  msg.role === 'assistant'
                    ? "bg-white border border-gray-100 text-slate-800 rounded-tr-none"
                    : "bg-brand-dark text-white rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <p className={cn(
                  "text-[9px] text-slate-400 px-1",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full gold-gradient text-brand-dark flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Icon name="auto_awesome" className="text-sm" filled />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Prompts + Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        {/* Quick Prompts strip */}
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-2 no-scrollbar">
          {AI_QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p.text)}
              disabled={isLoading}
              className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary disabled:opacity-40 transition-colors"
            >
              <Icon name={p.icon} className="text-[12px]" />
              {p.text}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="flex items-end gap-3 px-4 pt-1">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-end gap-2 focus-within:border-primary/50 focus-within:bg-white transition-colors">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
              placeholder="اكتب سؤالك هنا... (Enter للإرسال)"
              rows={1}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 resize-none outline-none bg-transparent max-h-28"
              style={{ overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={() => sendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-md",
              isLoading || !inputText.trim()
                ? "bg-slate-200 text-slate-400"
                : "gold-gradient text-brand-dark hover:shadow-primary/30"
            )}
          >
            {isLoading
              ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              : <Icon name="send" className="text-xl" filled />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

const PUBLISH_PLATFORMS = [
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

const PublishingScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    setAiError('');
    setAiResponse('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('فشل الطلب إلى خادم الذكاء الاصطناعي');
      }

      const data = await response.json();
      const text =
        (typeof data?.text === 'string' && data.text) ||
        (typeof data?.response === 'string' && data.response) ||
        '';

      setAiResponse(text || 'لا توجد استجابة');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setAiError(`تعذّر الاتصال بالذكاء الاصطناعي: ${msg}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const quickPrompts = [
    'كيف أضيف صفحة جديدة للمشروع؟',
    'كيف أعدّل الألوان والثيم الرئيسي؟',
    'اقترح تحسينات لشاشة لوحة التحكم',
    'كيف أربط قاعدة بيانات حقيقية؟',
    'أضف ميزة إشعارات الدفع للمشروع',
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">نشر المشروع بالذكاء الاصطناعي</h2>
      </header>

      <main className="p-4 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-bl from-violet-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name="rocket_launch" className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold">انشر مشروعك للعالم</h3>
              <p className="text-[11px] text-violet-200">اختر منصة النشر المناسبة واستخدم الذكاء الاصطناعي لتعديل المشروع</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-2">
            <Icon name="check_circle" className="text-green-300 text-sm" />
            <p className="text-[10px] text-violet-100">ملفات الإعداد: <code className="font-mono">vercel.json</code> و <code className="font-mono">netlify.toml</code> جاهزة في المشروع</p>
          </div>
        </div>

        {/* Platforms */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 px-1">منصات النشر المتاحة</h3>
          <div className="grid grid-cols-1 gap-3">
            {PUBLISH_PLATFORMS.map((platform, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlatform(selectedPlatform === i ? null : i)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${platform.bg} ${platform.color} flex items-center justify-center shrink-0`}>
                    <Icon name={platform.icon} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-sm">{platform.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${platform.badgeColor}`}>{platform.badge}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{platform.desc}</p>
                  </div>
                  <Icon name={selectedPlatform === i ? 'expand_less' : 'expand_more'} className="text-gray-300" />
                </div>
                <AnimatePresence>
                  {selectedPlatform === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                        <h5 className="text-[11px] font-bold text-gray-500">خطوات النشر:</h5>
                        <ol className="space-y-1.5">
                          {platform.steps.map((step, si) => (
                            <li key={si} className="flex items-start gap-2 text-[11px] text-gray-600">
                              <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{si + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:underline"
                        >
                          <Icon name="open_in_new" className="text-[13px]" />
                          افتح {platform.name}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Project Editor */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
              <Icon name="auto_awesome" className="text-violet-600 text-sm" />
            </div>
            <h3 className="text-sm font-bold">مساعد الذكاء الاصطناعي لتعديل المشروع</h3>
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setAiPrompt(prompt)}
                className="shrink-0 text-[10px] font-medium bg-white border border-violet-100 text-violet-700 px-3 py-1.5 rounded-full hover:bg-violet-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAiRequest(); }}
              placeholder="اكتب طلبك لتعديل أو تحسين المشروع... (Ctrl+Enter للإرسال)"
              rows={3}
              className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none border-none bg-transparent"
            />
            <div className="flex items-center justify-between border-t border-gray-50 pt-2">
              <p className="text-[9px] text-gray-300">مدعوم بـ Gemini AI</p>
              <button
                onClick={handleAiRequest}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="flex items-center gap-1.5 bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAiLoading
                  ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> جاري التحليل...</>
                  : <><Icon name="auto_awesome" className="text-sm" /> اسأل الذكاء الاصطناعي</>
                }
              </button>
            </div>
          </div>

          {/* AI Response */}
          {aiError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <Icon name="error_outline" className="text-red-500 text-sm mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{aiError}</p>
            </div>
          )}
          {aiResponse && (
            <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Icon name="auto_awesome" className="text-violet-600 text-xs" />
                </div>
                <p className="text-xs font-bold text-violet-700">اقتراح الذكاء الاصطناعي</p>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </section>
      </main>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const DeveloperCenterScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">مركز المطورين</h2>
      </header>
      <main className="p-4 space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-2">مفاتيح الـ API</h3>
          <p className="text-xs text-slate-400 mb-4">استخدم هذه المفاتيح لربط نظامك مع تطبيقات الطرف الثالث</p>
          <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between border border-slate-700">
            <code className="text-[10px] font-mono text-primary">sk_live_51Mz...982</code>
            <Icon name="content_copy" className="text-slate-500 text-sm cursor-pointer" />
          </div>
        </div>

        {/* تكامل الواتساب */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">تكامل الواتساب</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              متصل
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 mb-1">عنوان الاستدعاء (Callback URL)</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[10px] font-mono text-slate-600 truncate">https://api.example.com/webhooks/whatsapp</code>
                <Icon name="content_copy" className="text-slate-400 text-sm cursor-pointer shrink-0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">رقم الربط</p>
                <p className="text-xs font-bold text-slate-700">+966 50 123 4567</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">آخر مزامنة</p>
                <p className="text-xs font-bold text-slate-700">منذ دقيقتين</p>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
            إعدادات Webhooks
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h3 className="font-bold">سجل الطلبات (Webhooks)</h3>
          {[
            { method: 'POST', path: '/v1/invoices', status: 200, time: 'منذ دقيقة' },
            { method: 'GET', path: '/v1/properties', status: 200, time: 'منذ ٥ دقائق' },
            { method: 'POST', path: '/v1/maintenance', status: 400, time: 'منذ ساعة' },
          ].map((log, i) => (
            <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{log.method}</span>
                <span className="text-[10px] font-mono text-gray-600">{log.path}</span>
              </div>
              <div className="text-left">
                <span className={`text-[9px] font-bold ${log.status === 200 ? 'text-green-500' : 'text-red-500'}`}>{log.status}</span>
                <p className="text-[8px] text-gray-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const ArchiveScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { title: 'صكوك الملكية', count: 24, icon: 'description', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'عقود الإيجار', count: 158, icon: 'history_edu', color: 'text-primary-dark', bg: 'bg-primary/10' },
    { title: 'فواتير الصيانة', count: 89, icon: 'receipt_long', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'مخططات هندسية', count: 12, icon: 'architecture', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'تقارير المفتشين', count: 34, icon: 'fact_check', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'وثائق التأمين', count: 18, icon: 'verified_user', color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const recentFiles = [
    { name: 'صك ملكية - عمارة النخيل', date: '٢٠٢٤/٠٥/١٠', icon: 'description', size: '٢.٣ ميغابايت' },
    { name: 'عقد إيجار - محمد العتيبي', date: '٢٠٢٤/٠١/٠١', icon: 'history_edu', size: '١.١ ميغابايت' },
    { name: 'فاتورة صيانة التكييف - فيلا ١٢', date: '٢٠٢٤/٠٥/٢٢', icon: 'receipt_long', size: '٠.٤ ميغابايت' },
    { name: 'مخطط طابق ثالث - برج الياسمين', date: '٢٠٢٣/١١/١٥', icon: 'architecture', size: '٥.٧ ميغابايت' },
    { name: 'عقد إيجار - سارة العمري', date: '٢٠٢٤/٠١/٢٠', icon: 'history_edu', size: '١.٠ ميغابايت' },
    { name: 'فاتورة كهرباء - برج النخيل', date: '٢٠٢٤/٠٥/٢٦', icon: 'receipt_long', size: '٠.٢ ميغابايت' },
  ];

  const filteredFiles = searchQuery
    ? recentFiles.filter(f => f.name.includes(searchQuery) || f.date.includes(searchQuery))
    : recentFiles;

  const filteredCategories = searchQuery
    ? categories.filter(c => c.title.includes(searchQuery))
    : categories;

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">الأرشيف العقاري</h2>
        <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
          <Icon name="upload_file" />
        </button>
      </header>
      <main className="p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-3 text-gray-400" />
          <input
            className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm outline-none"
            placeholder="بحث في الوثائق المؤرشفة..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats */}
        {!searchQuery && (
          <div className="bg-brand-dark text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70 mb-1">إجمالي الملفات المؤرشفة</p>
                <h3 className="text-3xl font-black">
                  {toArabicDigits(categories.reduce((s, c) => s + c.count, 0))}
                </h3>
              </div>
              <div className="size-14 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Icon name="folder_open" className="text-brand-dark text-2xl" />
              </div>
            </div>
            <Icon name="inventory_2" className="absolute -bottom-4 -left-4 text-8xl opacity-10 rotate-12" />
          </div>
        )}

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 px-1">الفئات</h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredCategories.map((cat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", cat.bg, cat.color)}>
                    <Icon name={cat.icon} />
                  </div>
                  <h4 className="font-bold text-sm text-brand-dark">{cat.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{toArabicDigits(cat.count)} ملف</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Recent / Filtered Files */}
        {filteredFiles.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 px-1">
              {searchQuery ? 'نتائج البحث' : 'أحدث الملفات'}
            </h3>
            <div className="space-y-2">
              {filteredFiles.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-slate-50 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Icon name={file.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-brand-dark truncate">{file.name}</h4>
                    <p className="text-[10px] text-gray-400">{file.date} • {file.size}</p>
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors shrink-0">
                    <Icon name="download" className="text-sm" />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {searchQuery && filteredFiles.length === 0 && filteredCategories.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="search_off" className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">لا توجد نتائج مطابقة</p>
          </div>
        )}
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const TenantsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  // Data from SQLite (via context)
  const { TENANTS } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [quickSendTenant, setQuickSendTenant] = useState<typeof TENANTS[0] | null>(null);
  const [tenantSendDone, setTenantSendDone] = useState(false);

  const filtered = TENANTS.filter(t =>
    t.name.includes(searchQuery) ||
    t.unit.includes(searchQuery) ||
    t.property.includes(searchQuery)
  );

  const statusLabel = (s: string) => {
    if (s === 'active') return { label: 'نشط', cls: 'bg-green-100 text-green-700' };
    if (s === 'expiring') return { label: 'ينتهي قريباً', cls: 'bg-amber-100 text-amber-700' };
    return { label: 'متأخر', cls: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">إدارة المستأجرين</h2>
        <button aria-label="فتح قوالب الرسائل" onClick={() => onSelect('msg_templates')} className="p-2 bg-primary/10 text-primary rounded-xl flex items-center gap-1 text-[10px] font-black hover:bg-primary/20 transition-colors">
          <Icon name="mail_outline" className="text-base" /> قوالب
        </button>
      </header>
      <main className="p-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'الإجمالي', value: toArabicDigits(TENANTS.length), icon: 'group', bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'مدفوعون', value: toArabicDigits(TENANTS.filter(t => t.paid).length), icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'متأخرون', value: toArabicDigits(TENANTS.filter(t => !t.paid).length), icon: 'warning', bg: 'bg-red-50', color: 'text-red-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
              <div className={cn("size-9 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon name={stat.icon} className="text-lg" />
              </div>
              <p className="text-xl font-black text-brand-dark">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-3 text-gray-400" />
          <input
            className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm outline-none"
            placeholder="بحث عن مستأجر، وحدة، أو عقار..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Icon name="person_search" className="text-4xl text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">لا توجد نتائج مطابقة</p>
            </div>
          )}
          {filtered.map((tenant) => {
            const st = statusLabel(tenant.status);
            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-brand-dark font-black text-base shadow-sm">
                      {tenant.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-dark">{tenant.name}</h4>
                      <p className="text-[10px] text-gray-400">{tenant.property} — {tenant.unit}</p>
                    </div>
                  </div>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", st.cls)}>{st.label}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Icon name="payments" className="text-[12px] text-primary" />
                    <span className="font-bold">{toArabicDigits(tenant.rent)} ر.س/شهر</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Icon name="calendar_month" className="text-[12px] text-slate-400" />
                    <span>{tenant.contractEnd}</span>
                  </div>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", tenant.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {tenant.paid ? 'مدفوع' : 'متأخر'}
                  </span>
                </div>
                <button
                  onClick={() => { setQuickSendTenant(tenant); setTenantSendDone(false); }}
                  className="mt-3 w-full text-sky-600 text-xs font-bold flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <Icon name="send" className="text-xs" /> إرسال رسالة للمستأجر
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Quick Send Modal */}
      <AnimatePresence>
        {quickSendTenant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!tenantSendDone) setQuickSendTenant(null); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {tenantSendDone ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Icon name="check_circle" className="text-4xl" />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark">تم الإرسال!</h3>
                  <p className="text-xs text-slate-400 mt-1">تم إرسال الرسالة إلى {quickSendTenant.name}</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-brand-dark font-black text-base shadow-sm">
                      {quickSendTenant.name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-brand-dark">{quickSendTenant.name}</h3>
                      <p className="text-[10px] text-slate-400">{quickSendTenant.property} — {quickSendTenant.unit} • {quickSendTenant.phone}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-3">اختر القالب المناسب:</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {MSG_TEMPLATES.filter(t => t.recipient === 'مستأجر').map(tmpl => (
                      <button
                        key={tmpl.id}
                        onClick={() => { setTenantSendDone(true); setTimeout(() => setQuickSendTenant(null), 1600); }}
                        className={cn("w-full text-right p-3 rounded-xl border flex items-start gap-3 transition-all hover:border-sky-300 hover:bg-sky-50", tmpl.bg, "border-transparent")}
                      >
                        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60", tmpl.color)}>
                          <Icon name={tmpl.icon} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs font-black text-brand-dark">{tmpl.title}</p>
                            {tmpl.auto && <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">آلي</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold">{tmpl.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setQuickSendTenant(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const VendorsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { VENDORS } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل');
  const serviceTypes = ['الكل', ...Array.from(new Set(VENDORS.map(v => v.type)))];

  const filtered = VENDORS.filter(v => {
    const matchType = activeFilter === 'الكل' || v.type === activeFilter;
    const matchSearch = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.service.toLowerCase().includes(searchQuery.toLowerCase()) || v.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">الموردين والفنيين</h2>
        <button className="p-2 bg-primary/10 text-primary rounded-full">
          <Icon name="add_business" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'الإجمالي', value: toArabicDigits(VENDORS.length), icon: 'engineering', bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'متاح', value: toArabicDigits(VENDORS.filter(v => v.status === 'available').length), icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'مشغول', value: toArabicDigits(VENDORS.filter(v => v.status === 'busy').length), icon: 'schedule', bg: 'bg-amber-50', color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
              <div className={cn("size-9 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon name={stat.icon} className="text-lg" />
              </div>
              <p className="text-xl font-black text-brand-dark">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-3 text-gray-400" />
          <input
            className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm outline-none"
            placeholder="بحث عن مورد أو فني..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeFilter === type ? "bg-brand-dark text-white shadow-md" : "bg-white border border-gray-100 text-gray-500"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Vendor list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((vendor) => (
              <motion.div
                key={vendor.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="engineering" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-dark">{vendor.name}</h4>
                      <p className="text-[10px] text-gray-400">{vendor.service} • {vendor.city}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <Icon name="star" className="text-[10px] text-amber-400" filled />
                          <span className="text-[10px] font-bold">{vendor.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">• {toArabicDigits(vendor.jobs)} مهمة</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn("text-[9px] font-bold px-2 py-1 rounded-full", vendor.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                    {vendor.status === 'available' ? 'متاح' : 'مشغول'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                  <a
                    href={`https://wa.me/${vendor.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                  >
                    <Icon name="chat" className="text-sm" />
                    واتساب
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">
                    <Icon name="send" className="text-sm" />
                    طلب خدمة
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Icon name="search_off" className="text-4xl text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">لا توجد نتائج مطابقة</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const AssetManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">سجل الأصول والمرافق</h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm opacity-80 mb-1">إجمالي قيمة الأصول المسجلة</h3>
            <h2 className="text-3xl font-black">١,٢٥٠,٠٠٠ <span className="text-sm font-normal">ر.س</span></h2>
          </div>
          <Icon name="inventory" className="absolute -bottom-4 -left-4 text-8xl opacity-10 rotate-12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'أجهزة التكييف', count: 145, icon: 'ac_unit' },
            { title: 'المصاعد', count: 12, icon: 'elevator' },
            { title: 'أنظمة الحريق', count: 8, icon: 'fire_extinguisher' },
            { title: 'المولدات', count: 4, icon: 'electric_bolt' },
          ].map((asset, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Icon name={asset.icon} className="text-primary mb-2" />
              <h4 className="font-bold text-sm">{asset.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{asset.count} وحدة مسجلة</p>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const OfficialPrintScreen = ({ onSelect, property }: { onSelect: (v: View) => void, property: any }) => {
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 print:p-0 print:bg-white">
      <AnimatePresence>
        {showNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-brand-dark text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 print:hidden"
          >
            <div className="size-8 bg-brand-yellow text-brand-dark rounded-full flex items-center justify-center">
              <Icon name="info" />
            </div>
            <p className="text-sm font-bold">يمكنك حفظ التقرير كملف PDF عبر خيار الطباعة</p>
            <button onClick={() => setShowNotice(false)} className="text-white/50 hover:text-white">
              <Icon name="close" className="text-sm" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => onSelect('property_report')}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
        >
          <Icon name="arrow_forward" />
          <span>العودة للتقرير</span>
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-brand-dark/90 transition-all border border-white/10"
          >
            <Icon name="download" className="text-primary" />
            تصدير PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-brand-yellow text-brand-dark px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-brand-yellow/90 transition-all"
          >
            <Icon name="print" />
            طباعة التقرير
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:m-0 flex flex-col min-h-[297mm] relative overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-10 flex justify-between items-start border-b-4 border-brand-yellow">
          <div className="text-right space-y-1">
            <h1 className="text-3xl font-black text-brand-dark">تقرير عقاري رسمي</h1>
            <p className="text-slate-500 font-bold">شركة رمز الإبداع لإدارة الأملاك</p>
            <div className="mt-6 text-xs text-slate-400 space-y-1">
              <p>رقم المرجع: <span className="font-mono text-slate-700">REF-{property.id}-{new Date().getFullYear()}</span></p>
              <p>تاريخ الإصدار: <span className="text-slate-700">{new Date().toLocaleDateString('ar-SA')}</span></p>
            </div>
          </div>
          <div className="flex flex-col items-center">
             <div className="size-20 gold-gradient rounded-2xl flex items-center justify-center text-brand-dark mb-2">
                <Icon name="domain" className="text-4xl" />
             </div>
             <span className="text-xs font-black text-brand-dark">رمز الإبداع</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-12 py-10 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold bg-slate-50 p-3 rounded-lg border-r-4 border-brand-yellow flex items-center gap-2">
              <Icon name="info" className="text-brand-yellow" />
              بيانات العقار الأساسية
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">اسم العقار:</span>
                  <span className="font-bold">{property.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">المدينة / الحي:</span>
                  <span className="font-bold">{property.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">رقم الصك:</span>
                  <span className="font-bold font-mono">9203847561</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">المساحة الإجمالية:</span>
                  <span className="font-bold">١,٢٥٠ م٢</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold bg-slate-50 p-3 rounded-lg border-r-4 border-brand-yellow flex items-center gap-2">
              <Icon name="analytics" className="text-brand-yellow" />
              ملخص الحالة المالية والتشغيلية
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">نسبة الإشغال</p>
                <p className="text-xl font-black text-brand-dark">٩٢٪</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">الإيراد السنوي</p>
                <p className="text-xl font-black text-brand-dark">٨٥٠,٠٠٠</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">طلبات الصيانة</p>
                <p className="text-xl font-black text-brand-dark">١٤</p>
              </div>
            </div>
          </section>

          <div className="flex justify-between items-end pt-20">
            <div className="text-center space-y-6">
              <p className="text-sm font-bold text-slate-600">ختم الشركة</p>
              <div className="w-24 h-24 rounded-full border-4 border-brand-yellow/20 flex items-center justify-center opacity-30 rotate-12">
                <Icon name="verified_user" className="text-5xl text-brand-yellow" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-slate-600">توقيع مدير الأملاك</p>
              <div className="w-40 h-px bg-slate-300 mt-12"></div>
              <p className="text-xs text-slate-400">أ. محمد العتيبي</p>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-auto">
          <div className="bg-brand-dark p-8 flex justify-between items-center text-white">
            <div className="flex gap-8 text-[10px]">
              <div className="flex items-center gap-2">
                <Icon name="call" className="text-brand-yellow" />
                <span>920013517</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" className="text-brand-yellow" />
                <span>info@ramzabdae.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="language" className="text-brand-yellow" />
                <span>www.ramzabdae.com</span>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-8 bg-brand-yellow skew-x-[-20deg]"></div>
              <div className="w-3 h-8 bg-white/20 skew-x-[-20deg]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyReportScreen = ({ onSelect, property }: { onSelect: (v: View) => void, property: any }) => {
  const { TENANTS, MAINTENANCE_REQUESTS, CONTRACTS } = useAppData();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <ReportLayout title={`تقرير ${property.name}`} onBack={() => onSelect('property_details')}>
      {/* Property Selector - Hidden during print */}
      <div className="mb-6 print:hidden">
        <button 
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-primary transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="apartment" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">العقار المختار</p>
              <p className="text-sm font-black text-brand-dark">{property.name}</p>
            </div>
          </div>
          <Icon name={isSelectorOpen ? "expand_less" : "expand_more"} className="text-slate-400" />
        </button>

        <AnimatePresence>
          {isSelectorOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 bg-white rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="p-2 max-h-60 overflow-y-auto">
                {PROPERTIES.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => {
                      // We need a way to update the selected property in App state
                      // For now, we'll just use the onSelect with a custom view or handle it in App
                      // Actually, let's update App.tsx to handle this
                      (window as any).selectProperty(p);
                      setIsSelectorOpen(false);
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl text-right flex items-center justify-between hover:bg-slate-50 transition-colors",
                      p.id === property.id ? "bg-primary/5 text-primary" : "text-slate-600"
                    )}
                  >
                    <span className="text-sm font-bold">{p.name}</span>
                    {p.id === property.id && <Icon name="check" className="text-sm" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-24 left-6 z-50 print:hidden flex flex-col gap-3">
        <button 
          onClick={() => window.print()}
          className="size-14 bg-brand-dark text-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          title="طباعة سريعة"
        >
          <Icon name="print" className="text-2xl" />
        </button>
        <button 
          onClick={() => onSelect('official_print')}
          className="size-14 bg-brand-yellow text-brand-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          title="نسخة الطباعة الرسمية"
        >
          <Icon name="description" className="text-2xl" />
        </button>
      </div>
      <div className="space-y-8">
        {/* الغلاف (ورق رسمي) */}
        <div className="print:h-[297mm] flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-100 rounded-3xl print:border-none">
          <Logo className="size-48 mb-8" />
          <h1 className="text-4xl font-black text-brand-dark mb-4">تقرير {property.name}</h1>
          <p className="text-xl text-slate-500 mb-12">تجميع البيانات الرسمية والوحدات العقارية والمستأجرين والوسطاء العقاريين</p>
          <div className="w-32 h-1 gold-gradient rounded-full mb-12"></div>
          <p className="text-lg font-bold text-primary">{property.location}</p>
          <div className="mt-auto pt-12 hidden print:block">
            <p className="text-sm text-slate-400">تُترك هذه الصفحة فارغة لاحتواء الورق الرسمي المرسل</p>
          </div>
        </div>

        {/* بيانات الصك والسجل العيني */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="description" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات الصك والسجل العيني</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'رقم الصك', value: '١٢٣٤٥٦٧٨٩٠' },
              { label: 'تاريخ الإصدار', value: '١٤٤٥/٠٥/١٠ هـ' },
              { label: 'جهة الإصدار', value: 'كتابة العدل الأولى بالرياض' },
              { label: 'رقم المستند', value: '٩٨٧٦٥٤' },
              { label: 'رقم القطعة', value: '١٥' },
              { label: 'رقم المخطط', value: '٣٠٢٠' },
              { label: 'مساحة الصك', value: '٥٠٠ م٢' },
              { label: 'نوع الصك', value: 'إلكتروني' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-500">{item.label}:</span>
                <span className="text-sm font-black text-brand-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* بيانات العقار */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="apartment" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات العقار</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'المنطقة', value: 'الرياض' },
              { label: 'المدينة', value: 'الرياض' },
              { label: 'الحي', value: 'حي الصحافة' },
              { label: 'العنوان الوطني', value: '١٢٣٤ الرياض ٥٦٧٨' },
              { label: 'نوع المبنى', value: 'برج سكني تجاري' },
              { label: 'الغرض من الاستخدام', value: 'سكني وتجاري' },
              { label: 'عدد الطوابق', value: '١٢ طابق' },
              { label: 'عدد الوحدات', value: '٤٨ وحدة' },
              { label: 'عدد المصاعد', value: '٣ مصاعد' },
              { label: 'عدد المواقف', value: '٦٠ موقف' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-500">{item.label}:</span>
                <span className="text-sm font-black text-brand-dark">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">المرافق والخدمات</h4>
            <div className="flex flex-wrap gap-2">
              {['مسبح أولمبي', 'نادي رياضي متكامل', 'منطقة ألعاب أطفال', 'حراسة أمنية ٢٤/٧'].map((service, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
                  <Icon name="check_circle" className="text-sm" />
                  {service}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بيانات الوحدة العقارية */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="door_front" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات الوحدة العقارية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'نوع الوحدة', value: 'شقة سكنية' },
              { label: 'رقم الوحدة', value: '٥٠٢' },
              { label: 'رقم الطابق', value: 'الخامس' },
              { label: 'المساحة', value: '١٨٠ م٢' },
              { label: 'حالة التأثيث', value: 'غير مؤثث' },
              { label: 'خزائن مطبخ مركبة', value: 'نعم' },
              { label: 'عدد وحدات التكييف', value: 'عدد (١) مركزي + (٤) سبليت' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-500">{item.label}:</span>
                <span className="text-sm font-black text-brand-dark">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">تفاصيل الغرف</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'صالة', value: '١' },
                { label: 'مطبخ', value: '١' },
                { label: 'غرف نوم', value: '٣' },
                { label: 'عداد الكهرباء', value: 'مستقل' },
              ].map((room, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 mb-1">{room.label}</p>
                  <p className="text-lg font-black text-brand-dark">{room.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بيانات المالك واتحاد الملاك */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="person" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات المالك واتحاد الملاك</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-3">معلومات المالك</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'الاسم', value: 'عبد الرحمن السديري' },
                  { label: 'رقم الهوية', value: '١٠٢٣٤٥٦٧٨٩' },
                  { label: 'الجنسية', value: 'سعودي' },
                  { label: 'نسبة الملكية', value: '١٠٠٪' },
                  { label: 'مساحة الملكية', value: '٥٠٠ م٢' },
                  { label: 'نوع المالك', value: 'فرد' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                    <span className="text-xs font-black text-brand-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">بيانات اتحاد الملاك</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'اسم الجمعية', value: 'جمعية ملاك برج بيان' },
                  { label: 'رقم التسجيل', value: '٧٧٦٦٥٥' },
                  { label: 'الرقم الموحد', value: '٧٠٠١٢٣٤٥٦٧' },
                  { label: 'تاريخ السريان', value: '١٤٤٥/٠١/٠١ هـ' },
                  { label: 'تاريخ الانتهاء', value: '١٤٤٦/٠١/٠١ هـ' },
                  { label: 'حالة الجمعية', value: 'نشطة' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                    <span className="text-xs font-black text-brand-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">نتائج التصويت والرسوم</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'إجمالي الرسوم', value: '٢,٥٠٠ ر.س' },
                  { label: 'عدد المصوتين', value: '٤٠' },
                  { label: 'نسبة القبول', value: '٩٥٪' },
                  { label: 'غير المصوتين', value: '٨' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm font-black text-brand-dark">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* بيانات عقد الإيجار */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="history_edu" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات عقد الإيجار</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'رقم العقد', value: '٢٠٢٤-٩٩٨٨٧٧' },
              { label: 'نوع العقد', value: 'سكني موحد' },
              { label: 'تاريخ الإبرام', value: '٢٠٢٤/٠١/٠١' },
              { label: 'بداية الإيجار', value: '٢٠٢٤/٠١/٠١' },
              { label: 'نهاية الإيجار', value: '٢٠٢٤/١٢/٣١' },
              { label: 'مدة العقد', value: 'سنة واحدة' },
              { label: 'قيمة الإيجار السنوي', value: '٥٥,٠٠٠ ر.س' },
              { label: 'عدد الدفعات', value: '٤ دفعات' },
              { label: 'قنوات الدفع', value: 'مدى / سداد' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-500">{item.label}:</span>
                <span className="text-sm font-black text-brand-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* بيانات المستأجر والوسيط العقاري */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="badge" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">بيانات المستأجر والوسيط العقاري</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-3">معلومات المستأجر</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'الاسم', value: 'محمد العتيبي' },
                  { label: 'الجنسية', value: 'سعودي' },
                  { label: 'نوع الهوية', value: 'هوية وطنية' },
                  { label: 'رقم الهوية', value: '١٠٩٨٧٦٥٤٣٢' },
                  { label: 'رقم الجوال', value: '٠٥٠٩٩٨٨٧٧٦' },
                  { label: 'البريد الإلكتروني', value: 'm.otaibi@email.com' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                    <span className="text-xs font-black text-brand-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">بيانات الوسيط العقاري</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'اسم المنشأة', value: 'شركة رمز الإبداع لإدارة الأملاك' },
                  { label: 'السجل التجاري', value: '١٠١٠٩٩٨٨٧٧' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                    <span className="text-xs font-black text-brand-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ملاحظات إضافية */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="notes" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">ملاحظات إضافية</h3>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl min-h-[150px] text-sm text-slate-600 leading-relaxed">
            لا توجد ملاحظات إضافية على هذا العقار في الوقت الحالي. يتم تحديث هذا القسم دورياً بناءً على تقارير الفحص الميداني.
          </div>
        </section>
      </div>
    </ReportLayout>
  );
};

// --- Owner Dashboard ---

const OwnerDashboard = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { PROPERTIES, TENANTS, CONTRACTS, MAINTENANCE_REQUESTS, OWNERS } = useAppData();
  const owner = OWNERS[0]; // Logged-in owner (mock)
  // Owner's properties: first 3 from PROPERTIES
  const ownerProperties = PROPERTIES.slice(0, 3);

  const ownerTenants = TENANTS.filter(t =>
    ownerProperties.some(p => p.name === t.property)
  );
  const ownerContracts = CONTRACTS.filter(c =>
    ownerProperties.some(p => p.name === c.property)
  );
  const ownerMaintenance = MAINTENANCE_REQUESTS.filter(r =>
    ownerProperties.some(p => p.name === r.property)
  );

  const totalMonthlyRent = ownerTenants.reduce((s, t) => s + Number(t.rent.replace(',', '')), 0);
  const paidCount = ownerTenants.filter(t => t.paid).length;
  const expiringContracts = ownerContracts.filter(c => c.status === 'ينتهي قريباً');
  const openMaintenance = ownerMaintenance.filter(r => r.status !== 'completed');

  const monthlyData = [
    { name: 'يناير', value: 38000 },
    { name: 'فبراير', value: 41000 },
    { name: 'مارس', value: 39500 },
    { name: 'أبريل', value: 43000 },
    { name: 'مايو', value: totalMonthlyRent },
    { name: 'يونيو', value: 46000 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      {/* Header */}
      <header className="bg-brand-dark text-white p-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="size-10" />
            <div>
              <h1 className="text-base font-black">{owner.name}</h1>
              <p className="text-[10px] text-slate-400">مالك عقارات • {toArabicDigits(owner.properties)} عقار</p>
            </div>
          </div>
          <button onClick={() => onSelect('welcome')} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Revenue Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-dark text-white p-6 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">الإيراد الشهري الإجمالي</p>
            <h2 className="text-4xl font-black mb-4">{toArabicDigits(totalMonthlyRent.toLocaleString())} <span className="text-sm font-normal text-slate-400">ر.س</span></h2>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                <Icon name="check_circle" className="text-sm" />
                <span className="font-bold">{toArabicDigits(paidCount)} مدفوعون</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                <Icon name="pending" className="text-sm" />
                <span className="font-bold">{toArabicDigits(ownerTenants.length - paidCount)} معلقون</span>
              </div>
            </div>
          </div>
          <Icon name="real_estate_agent" className="absolute -bottom-4 -left-4 text-9xl opacity-5" />
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'العقارات', value: toArabicDigits(ownerProperties.length), icon: 'apartment', bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'المستأجرون', value: toArabicDigits(ownerTenants.length), icon: 'group', bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { label: 'صيانة مفتوحة', value: toArabicDigits(openMaintenance.length), icon: 'build', bg: 'bg-orange-50', color: 'text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
              <div className={cn("size-9 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon name={stat.icon} className="text-lg" />
              </div>
              <p className="text-xl font-black text-brand-dark">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
            <Icon name="trending_up" className="text-primary" />
            الإيرادات الشهرية
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ownerRevGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f2cc0d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f2cc0d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#f2cc0d" strokeWidth={2.5} fill="url(#ownerRevGradient)" dot={false} activeDot={{ r: 5, fill: '#f2cc0d' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Properties */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-brand-dark">عقاراتي</h3>
            <span className="text-[10px] font-bold text-primary">{toArabicDigits(ownerProperties.length)} عقار</span>
          </div>
          {ownerProperties.map(prop => {
            const propTenants = ownerTenants.filter(t => t.property === prop.name);
            const propRevenue = propTenants.reduce((s, t) => s + Number(t.rent.replace(',', '')), 0);
            const propMaintenance = openMaintenance.filter(r => r.property === prop.name);
            return (
              <motion.div
                key={prop.id}
                whileHover={{ x: -4 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="apartment" className="text-primary text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-dark">{prop.name}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Icon name="location_on" className="text-[10px]" />
                        {prop.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{prop.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-sm font-black text-primary">{toArabicDigits(propRevenue.toLocaleString())}</p>
                    <p className="text-[8px] text-slate-400">ر.س/شهر</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-brand-dark">{toArabicDigits(propTenants.length)}</p>
                    <p className="text-[8px] text-slate-400">مستأجر</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-sm font-black", propMaintenance.length > 0 ? 'text-orange-600' : 'text-emerald-600')}>
                      {toArabicDigits(propMaintenance.length)}
                    </p>
                    <p className="text-[8px] text-slate-400">صيانة</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Expiring Contracts Alert */}
        {expiringContracts.length > 0 && (
          <section className="space-y-2">
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              <Icon name="event_busy" className="text-amber-500" />
              عقود تنتهي قريباً
            </h3>
            {expiringContracts.map(c => (
              <div key={c.id} className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-brand-dark">{c.tenant}</p>
                  <p className="text-[10px] text-slate-500">{c.property} — {c.unit}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-amber-600 font-bold">{c.end}</p>
                  <p className="text-[9px] text-slate-400">{toArabicDigits(c.rent)} ر.س/شهر</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Open Maintenance */}
        {openMaintenance.length > 0 && (
          <section className="space-y-2">
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              <Icon name="build" className="text-orange-500" />
              بلاغات الصيانة المفتوحة
            </h3>
            {openMaintenance.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Icon name="build" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-dark">{r.type}: {r.description.slice(0, 25)}...</p>
                    <p className="text-[10px] text-slate-400">{r.property} — {r.unit}</p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-bold px-2 py-1 rounded-full", r.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>
                  {r.status === 'in_progress' ? 'قيد التنفيذ' : 'جديد'}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Quick Links */}
        <section className="space-y-3">
          <h3 className="font-bold text-brand-dark flex items-center gap-2">
            <Icon name="bolt" className="text-primary" />
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'قوالب الرسائل', icon: 'mark_email_unread', view: 'msg_templates', bg: 'bg-indigo-50', color: 'text-indigo-600', desc: 'راسل مستأجريك' },
              { label: 'نماذج العقارات', icon: 'description', view: 'property_forms', bg: 'bg-rose-50', color: 'text-rose-600', desc: 'استلام وإخلاء وفحص' },
              { label: 'مركز التنبيهات', icon: 'notifications', view: 'notifications', bg: 'bg-amber-50', color: 'text-amber-600', desc: 'تتبع التنبيهات' },
              { label: 'تقارير الأداء', icon: 'bar_chart', view: 'reports', bg: 'bg-sky-50', color: 'text-sky-600', desc: 'تقارير عقاراتك' },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 text-right hover:shadow-md transition-all"
              >
                <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                  <Icon name={item.icon} className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-dark">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-primary relative px-3 py-1 rounded-2xl">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
          <Icon name="home" className="text-2xl relative z-10" filled />
          <span className="text-[10px] font-black relative z-10">الرئيسية</span>
        </button>
        <button onClick={() => onSelect('contracts')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="history_edu" className="text-2xl" />
          <span className="text-[10px] font-black">العقود</span>
        </button>
        <button onClick={() => onSelect('accounting')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="account_balance_wallet" className="text-2xl" />
          <span className="text-[10px] font-black">المالية</span>
        </button>
        <button onClick={() => onSelect('maintenance')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="build" className="text-2xl" />
          <span className="text-[10px] font-black">الصيانة</span>
        </button>
        <button onClick={() => onSelect('msg_templates')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="mark_email_unread" className="text-2xl" />
          <span className="text-[10px] font-black">الرسائل</span>
        </button>
        <button onClick={() => onSelect('welcome')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 px-3 py-1">
          <Icon name="logout" className="text-2xl" />
          <span className="text-[10px] font-black">خروج</span>
        </button>
      </nav>
    </div>
  );
};

// --- Technician Portal ---

const TechPortal = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { MAINTENANCE_REQUESTS, updateMaintenanceStatus } = useAppData();
  const techName = 'أحمد محمود';
  const [activeTab, setActiveTab] = useState<'new' | 'in_progress' | 'completed'>('new');
  const [tasks, setTasks] = useState(MAINTENANCE_REQUESTS);
  // Sync tasks when context data loads from DB
  useEffect(() => { setTasks(MAINTENANCE_REQUESTS); }, [MAINTENANCE_REQUESTS]);

  const myTasks = tasks.filter(t => t.technician === techName);
  const tabCounts = {
    new: myTasks.filter(t => t.status === 'new').length,
    in_progress: myTasks.filter(t => t.status === 'in_progress').length,
    completed: myTasks.filter(t => t.status === 'completed').length,
  };
  const filteredTasks = myTasks.filter(t => t.status === activeTab);

  const priorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700';
    if (p === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-500';
  };
  const priorityLabel = (p: string) => p === 'high' ? 'عاجل' : p === 'medium' ? 'متوسط' : 'منخفض';
  const typeIcon = (t: string) => {
    const map: Record<string, string> = { 'سباكة': 'plumbing', 'كهرباء': 'electrical_services', 'تكييف': 'ac_unit', 'دهانات': 'format_paint', 'مكافحة': 'pest_control' };
    return map[t] || 'build';
  };

  const advanceStatus = (id: string) => {
    const next = tasks.find(t => t.id === id)?.status === 'new' ? 'in_progress' : 'completed';
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
    updateMaintenanceStatus(id, next); // persist to SQLite
  };

  const tabs: { key: 'new' | 'in_progress' | 'completed'; label: string }[] = [
    { key: 'new', label: 'جديد' },
    { key: 'in_progress', label: 'قيد التنفيذ' },
    { key: 'completed', label: 'مكتمل' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      {/* Header */}
      <header className="bg-brand-dark text-white p-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 gold-gradient rounded-full flex items-center justify-center text-brand-dark font-black text-xl shadow-lg">
              {techName[0]}
            </div>
            <div>
              <h1 className="text-base font-black">{techName}</h1>
              <p className="text-[10px] text-slate-400">فني صيانة • رمز الإبداع</p>
            </div>
          </div>
          <button onClick={() => onSelect('welcome')} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icon name="logout" />
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'جديد', count: tabCounts.new, icon: 'inbox', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'قيد التنفيذ', count: tabCounts.in_progress, icon: 'construction', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'مكتمل', count: tabCounts.completed, icon: 'task_alt', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon name={stat.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(stat.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 px-4 py-3 bg-white sticky top-[73px] z-40 border-b border-slate-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.key ? "bg-brand-dark text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            )}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={cn("mr-1 inline-block text-[9px] font-black px-1 rounded-full", activeTab === tab.key ? 'bg-white/20' : 'bg-slate-200')}>
                {toArabicDigits(tabCounts[tab.key])}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Icon name={typeIcon(task.type)} className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark">{task.type}</h4>
                    <p className="text-[10px] text-slate-400">{task.property} — {task.unit}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Icon name="calendar_today" className="text-[10px]" />
                      {task.date}
                    </p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0", priorityColor(task.priority))}>
                  {priorityLabel(task.priority)}
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-3 leading-relaxed">{task.description}</p>

              {task.status !== 'completed' && (
                <button
                  onClick={() => advanceStatus(task.id)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    task.status === 'new'
                      ? "bg-primary/10 text-primary hover:bg-primary hover:text-brand-dark"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                  )}
                >
                  <Icon name={task.status === 'new' ? 'play_circle' : 'check_circle'} className="text-sm" />
                  {task.status === 'new' ? 'بدء التنفيذ' : 'تحديد كمكتمل'}
                </button>
              )}
              {task.status === 'completed' && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold py-2 bg-emerald-50 rounded-xl">
                  <Icon name="task_alt" className="text-sm" />
                  تم الإنجاز
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center">
            <Icon name="check_circle" className="text-5xl text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold">لا توجد مهام في هذه الفئة</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-primary relative px-3 py-1 rounded-2xl">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
          <Icon name="home" className="text-2xl relative z-10" filled />
          <span className="text-[10px] font-black relative z-10">المهام</span>
        </button>
        <button onClick={() => onSelect('new_maintenance')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="add_circle" className="text-2xl" />
          <span className="text-[10px] font-black">طلب جديد</span>
        </button>
        <button onClick={() => onSelect('support')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="support_agent" className="text-2xl" />
          <span className="text-[10px] font-black">الدعم</span>
        </button>
        <button onClick={() => onSelect('welcome')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 px-3 py-1">
          <Icon name="logout" className="text-2xl" />
          <span className="text-[10px] font-black">خروج</span>
        </button>
      </nav>
    </div>
  );
};

// --- Payment Screen ---

const PaymentScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { TENANTS, recordPayment } = useAppData();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const paymentMethods = [
    { id: 'mada', label: 'مدى', icon: 'credit_card', desc: 'بطاقة مدى المصرفية' },
    { id: 'sadad', label: 'سداد', icon: 'account_balance', desc: 'خدمة سداد للمدفوعات' },
    { id: 'transfer', label: 'تحويل بنكي', icon: 'send_money', desc: 'تحويل مباشر للحساب' },
  ];

  const paymentHistory = [
    { date: '٢٠٢٤/٠٥/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٤/٠١', amount: '٤,٨٠٠', method: 'سداد', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٣/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center bg-brand-dark px-6 py-5 justify-between sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('tenant_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-black text-white">دفع الإيجار</h2>
        <div className="size-10" />
      </header>

      <main className="p-6 space-y-6">
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6 pt-12 text-center"
          >
            <div className="size-24 gold-gradient rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
              <Icon name="check_circle" className="text-5xl text-brand-dark" filled />
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">تم الدفع بنجاح!</h3>
              <p className="text-sm text-slate-500 font-bold">تم تحصيل دفعة الإيجار لشهر يونيو ٢٠٢٤</p>
            </div>
            <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-right space-y-3">
              {[
                { label: 'المبلغ', value: '٤,٨٠٠ ر.س' },
                { label: 'طريقة الدفع', value: paymentMethods.find(m => m.id === selectedMethod)?.label ?? '' },
                { label: 'التاريخ', value: '٢٠٢٤/٠٦/٠١' },
                { label: 'رقم العملية', value: '#TXN-٢٠٢٤٠٦٠١' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                  <span className="text-xs font-black text-brand-dark">{item.value}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect('tenant_dashboard')}
              className="w-full py-4 gold-gradient rounded-2xl text-brand-dark font-black text-base shadow-lg shadow-primary/20"
            >
              العودة للرئيسية
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* بطاقة تفاصيل الدفعة */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2.5rem] p-8 dark-gradient text-white shadow-2xl relative overflow-hidden border border-white/5"
            >
              <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="payments" className="text-lg" filled />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">الدفعة المستحقة</p>
                </div>
                <h3 className="text-5xl font-black tracking-tighter mt-1">٤,٨٠٠ <span className="text-xl font-bold text-primary/60">ر.س</span></h3>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[
                    { label: 'الوحدة', value: 'شقة ٤٠٢' },
                    { label: 'تاريخ الاستحقاق', value: '٢٠٢٤/٠٦/٠١' },
                    { label: 'العقار', value: 'برج الياسمين' },
                    { label: 'الشهر', value: 'يونيو ٢٠٢٤' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* طريقة الدفع */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> اختر طريقة الدفع
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right",
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "size-12 rounded-xl flex items-center justify-center transition-all",
                      selectedMethod === method.id ? "gold-gradient text-brand-dark" : "bg-slate-50 text-slate-400"
                    )}>
                      <Icon name={method.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-brand-dark">{method.label}</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="size-6 rounded-full gold-gradient flex items-center justify-center">
                        <Icon name="check" className="text-sm text-brand-dark" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* زر الدفع */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedMethod}
              onClick={() => { if (!selectedMethod) return; setSubmitted(true); recordPayment('1'); /* tenant id=1 is mock logged-in tenant */ }}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg",
                selectedMethod
                  ? "gold-gradient text-brand-dark shadow-primary/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              {selectedMethod ? `ادفع ٤,٨٠٠ ر.س عبر ${paymentMethods.find(m => m.id === selectedMethod)?.label}` : 'اختر طريقة الدفع أولاً'}
            </motion.button>

            {/* سجل المدفوعات */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> سجل المدفوعات
              </h3>
              <div className="space-y-3">
                {paymentHistory.map((payment, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Icon name="check_circle" className="text-lg" filled />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-dark">{payment.amount} ر.س</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{payment.date} • {payment.method}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">{payment.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

// --- Message Templates Screen ---

const MessageTemplatesScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [sendModal, setSendModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [previewModal, setPreviewModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('SMS');

  const categories = ['الكل', 'عقود', 'مالية', 'صيانة', 'عام'];
  const filtered = activeCategory === 'الكل' ? MSG_TEMPLATES : MSG_TEMPLATES.filter(t => t.category === activeCategory);

  const recipientBadge = (r: string) => {
    if (r === 'مستأجر') return 'bg-blue-50 text-blue-600';
    if (r === 'مالك') return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-100 text-slate-500';
  };

  const handleSend = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setSendModal(null);
      setSelectedRecipient('');
      setSelectedChannel('SMS');
    }, 1800);
  };

  const categoryCount = (cat: string) => cat === 'الكل'
    ? MSG_TEMPLATES.length
    : MSG_TEMPLATES.filter(t => t.category === cat).length;

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-black text-white">قوالب الرسائل الآلية</h2>
          <p className="text-[10px] text-primary font-bold">{toArabicDigits(MSG_TEMPLATES.length)} قالب جاهز</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="mail_outline" className="text-xl" />
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'العقود', count: MSG_TEMPLATES.filter(t => t.category === 'عقود').length, icon: 'history_edu', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'المالية', count: MSG_TEMPLATES.filter(t => t.category === 'مالية').length, icon: 'payments', color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'الصيانة', count: MSG_TEMPLATES.filter(t => t.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'عام', count: MSG_TEMPLATES.filter(t => t.category === 'عام').length, icon: 'campaign', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1.5">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(s.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Auto notice */}
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3">
          <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
            <Icon name="auto_mode" className="text-base" />
          </div>
          <p className="text-xs font-bold text-brand-dark">القوالب المميزة بـ <span className="text-primary">آلي</span> تُرسَل تلقائياً عند تحقق الشرط (انتهاء عقد، تأخر سداد، إلخ)</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                {toArabicDigits(categoryCount(cat))}
              </span>
            </button>
          ))}
        </div>

        {/* Templates list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((tmpl) => (
            <motion.div
              key={tmpl.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", tmpl.bg, tmpl.color)}>
                    <Icon name={tmpl.icon} className="text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-black text-sm text-brand-dark">{tmpl.title}</h4>
                      {tmpl.auto && (
                        <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Icon name="auto_mode" className="text-[10px]" /> آلي
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(tmpl.recipient))}>
                        {tmpl.recipient}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{tmpl.category}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded-lg">{tmpl.preview}</p>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => setPreviewModal(tmpl)}
                  className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Icon name="visibility" className="text-sm" /> معاينة كاملة
                </button>
                <button
                  onClick={() => setSendModal(tmpl)}
                  className={cn("py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors", tmpl.color, "hover:opacity-80")}
                >
                  <Icon name="send" className="text-sm" /> إرسال
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("size-12 rounded-xl flex items-center justify-center", previewModal.bg, previewModal.color)}>
                  <Icon name={previewModal.icon} className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-black text-brand-dark">{previewModal.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(previewModal.recipient))}>{previewModal.recipient}</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{previewModal.category}</span>
                    {previewModal.auto && <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">آلي</span>}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                <p className="text-sm text-slate-600 leading-loose font-medium">{previewModal.preview}</p>
              </div>
              <p className="text-[10px] text-slate-400 text-center mb-4">القيم داخل [الأقواس] ستُعوَّض تلقائياً بالبيانات الفعلية عند الإرسال</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPreviewModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إغلاق</button>
                <button onClick={() => { setPreviewModal(null); setSendModal(previewModal); }} className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg", "bg-brand-dark")}>
                  <Icon name="send" className="text-sm" /> إرسال الآن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Modal */}
      <AnimatePresence>
        {sendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!sendSuccess) setSendModal(null); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {sendSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Icon name="check_circle" className="text-5xl" />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark mb-1">تم الإرسال بنجاح!</h3>
                  <p className="text-sm text-slate-500">تم إرسال الرسالة إلى المستلمين المحددين</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-black text-brand-dark text-lg mb-1">إرسال الرسالة</h3>
                  <p className="text-xs text-slate-400 mb-5">{sendModal.title}</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">اختر المستلمين</label>
                      <div className="space-y-2">
                        {sendModal.recipient === 'الجميع' ? (
                          ['جميع المستأجرين', 'جميع الملاك', 'مستأجرو عقار محدد', 'مستأجر واحد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : sendModal.recipient === 'مستأجر' ? (
                          ['جميع المستأجرين', 'مستأجرو عقار محدد', 'مستأجر واحد محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : (
                          ['جميع الملاك', 'مالك محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">قناة الإرسال</label>
                      <div className="flex gap-2">
                        {[{ label: 'SMS', icon: 'sms' }, { label: 'بريد', icon: 'email' }, { label: 'إشعار', icon: 'notifications' }].map((ch) => (
                          <button key={ch.label} onClick={() => setSelectedChannel(ch.label)} className={cn("flex-1 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all", selectedChannel === ch.label ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5')}>
                            <Icon name={ch.icon} className="text-base" />
                            {ch.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button onClick={() => setSendModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                    <button
                      disabled={!selectedRecipient}
                      onClick={handleSend}
                      className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all", selectedRecipient ? "bg-brand-dark shadow-brand-dark/20 hover:opacity-90" : "bg-slate-300 cursor-not-allowed")}
                    >
                      <Icon name="send" className="text-sm" /> إرسال
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

// --- Property Forms Screen ---

const PropertyFormsScreen = ({ onSelect, initialCategory = 'الكل' }: { onSelect: (v: View) => void; initialCategory?: string }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openForm, setOpenForm] = useState<typeof PROPERTY_FORMS[0] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['الكل', 'عقارات', 'مالية', 'صيانة', 'خدمات'];
  const filtered = activeCategory === 'الكل' ? PROPERTY_FORMS : PROPERTY_FORMS.filter(f => f.category === activeCategory);

  const categoryBadgeStyle = (cat: string) => {
    if (cat === 'عقارات') return 'bg-blue-50 text-blue-600';
    if (cat === 'مالية') return 'bg-emerald-50 text-emerald-600';
    if (cat === 'صيانة') return 'bg-orange-50 text-orange-600';
    return 'bg-purple-50 text-purple-600';
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setOpenForm(null);
      setFormValues({});
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-black text-white">نماذج وإشعارات العقارات</h2>
          <p className="text-[10px] text-primary font-bold">{toArabicDigits(PROPERTY_FORMS.length)} نماذج جاهزة</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="description" className="text-xl" />
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'عقارات', count: PROPERTY_FORMS.filter(f => f.category === 'عقارات').length, icon: 'apartment', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'مالية', count: PROPERTY_FORMS.filter(f => f.category === 'مالية').length, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'صيانة', count: PROPERTY_FORMS.filter(f => f.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'خدمات', count: PROPERTY_FORMS.filter(f => f.category === 'خدمات').length, icon: 'star', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1.5">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(s.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Forms list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((form) => (
            <motion.div
              key={form.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0", form.bg, form.color)}>
                  <Icon name={form.icon} className="text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-black text-sm text-brand-dark leading-snug">{form.title}</h4>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full shrink-0", categoryBadgeStyle(form.category))}>{form.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mb-2">{form.desc}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] text-slate-400 font-bold">الحقول:</span>
                    {form.fields.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">{f.label}</span>
                    ))}
                    {form.fields.length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{form.fields.length - 3} أخرى</span>}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => { setOpenForm(form); setFormValues({}); setSubmitSuccess(false); }}
                  className="py-3 text-xs font-bold text-primary flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
                >
                  <Icon name="edit_document" className="text-sm" /> تعبئة النموذج
                </button>
                <button onClick={() => window.print()} className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
                  <Icon name="print" className="text-sm" /> طباعة فارغ
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Form Fill Modal */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => { if (!submitSuccess) setOpenForm(null); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {submitSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-16 text-center px-6">
                  <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Icon name="check_circle" className="text-6xl" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2">تم الحفظ!</h3>
                  <p className="text-sm text-slate-500">تم حفظ النموذج وإرساله بنجاح</p>
                </motion.div>
              ) : (
                <>
                  <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center", openForm.bg, openForm.color)}>
                      <Icon name={openForm.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-brand-dark text-sm">{openForm.title}</h3>
                      <p className="text-[10px] text-slate-400">{openForm.fields.length} حقول</p>
                    </div>
                    <button onClick={() => setOpenForm(null)} className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
                    {/* Property & unit selectors */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">العقار</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر العقار</option>
                          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">الوحدة</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر الوحدة</option>
                          {UNITS.map(u => <option key={u.id} value={u.id}>{u.id} - {u.type}</option>)}
                        </select>
                      </div>
                    </div>

                    {openForm.fields.map((field, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          >
                            <option value="">اختر...</option>
                            {(field.options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        ) : field.type === 'file' ? (
                          <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-slate-50 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Icon name="attach_file" className="text-2xl mb-1" />
                            <span className="text-xs font-bold">اضغط لإرفاق الملف</span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}

                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setOpenForm(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                      <button type="submit" className="py-3 rounded-xl bg-brand-dark text-white text-sm font-bold shadow-lg shadow-brand-dark/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Icon name="save" className="text-sm" /> حفظ وإرسال
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

// --- Main App ---

// --- App Data Provider ---

function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [properties,           setProperties]          = useState<typeof PROPERTIES>(PROPERTIES);
  const [maintenanceRequests,  setMaintenanceRequests] = useState<typeof MAINTENANCE_REQUESTS>(MAINTENANCE_REQUESTS);
  const [units,                setUnits]               = useState<typeof UNITS>(UNITS);
  const [tenants,              setTenants]             = useState<typeof TENANTS>(TENANTS);
  const [owners,               setOwners]              = useState<typeof OWNERS>(OWNERS);
  const [contracts,            setContracts]           = useState<typeof CONTRACTS>(CONTRACTS);
  const [vendors,              setVendors]             = useState<typeof VENDORS>(VENDORS);
  const [invoices,             setInvoices]            = useState<typeof INVOICES>(INVOICES);

  // Load all data from the SQLite API on mount (fallback to static seed if API unavailable)
  useEffect(() => {
    const load = async () => {
      try {
        const [props, maint, u, t, o, c, v, inv] = await Promise.all([
          apiGetProperties(),
          apiGetMaintenance(),
          apiGetUnits(),
          apiGetTenants(),
          apiGetOwners(),
          apiGetContracts(),
          apiGetVendors(),
          apiGetInvoices(),
        ]);
        if (props.length)  setProperties(props as typeof PROPERTIES);
        if (maint.length)  setMaintenanceRequests(maint as typeof MAINTENANCE_REQUESTS);
        if (u.length)      setUnits(u as typeof UNITS);
        if (t.length)      setTenants(t as typeof TENANTS);
        if (o.length)      setOwners(o as typeof OWNERS);
        if (c.length)      setContracts(c as typeof CONTRACTS);
        if (v.length)      setVendors(v as typeof VENDORS);
        if (inv.length)    setInvoices(inv as typeof INVOICES);
      } catch {
        // API not available — static seed data is already in state, no action needed
      }
    };
    load();
  }, []);

  // Mutations — call API then update local state optimistically
  const updateMaintenanceStatus = async (id: string, status: string) => {
    setMaintenanceRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
    try { await apiUpdateMaintenanceStatus(id, status); } catch {}
  };

  const createMaintenanceRequest = async (data: {
    property: string; unit: string; date: string; type: string;
    technician?: string; description?: string; priority?: string;
  }) => {
    const tempId = String(Date.now());
    const newReq = {
      id: tempId, status: 'new',
      property: data.property, unit: data.unit, date: data.date, type: data.type,
      technician: data.technician ?? '', description: data.description ?? '',
      priority: data.priority ?? 'medium',
    };
    setMaintenanceRequests(prev => [newReq as typeof MAINTENANCE_REQUESTS[0], ...prev]);
    try {
      const created = await apiCreateMaintenance(data);
      setMaintenanceRequests(prev => prev.map(r => r.id === tempId ? created as typeof r : r));
    } catch {}
  };

  const recordPayment = async (tenantId: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, paid: true } : t));
    setInvoices(prev => prev.map(inv =>
      inv.tenant === (tenants.find(t => t.id === tenantId)?.name ?? '')
        ? { ...inv, status: 'مدفوعة' } : inv
    ));
    try { await apiRecordPayment(tenantId); } catch {}
  };

  const addProperty = async (data: Property) => {
    setProperties(prev => [...prev, data as typeof PROPERTIES[0]]);
    try { await apiAddProperty(data); } catch {}
  };

  const renewContract = async (id: string, newEnd: string) => {
    setContracts(prev =>
      prev.map(c => c.id === id ? { ...c, end: newEnd, status: 'ساري' } : c)
    );
    try { await apiUpdateContract(id, { status: 'ساري', end: newEnd }); } catch {}
  };

  return (
    <AppDataContext.Provider value={{
      PROPERTIES: properties,
      MAINTENANCE_REQUESTS: maintenanceRequests,
      UNITS: units,
      TENANTS: tenants,
      OWNERS: owners,
      CONTRACTS: contracts,
      VENDORS: vendors,
      INVOICES: invoices,
      updateMaintenanceStatus,
      createMaintenanceRequest,
      recordPayment,
      addProperty,
      renewContract,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);
  const [propertyFormsCategory, setPropertyFormsCategory] = useState('الكل');
  // Restore admin session from sessionStorage on page load
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('admin_session');
      return stored ? (JSON.parse(stored) as AdminUser) : null;
    } catch {
      return null;
    }
  });

  const navigateToForms = (category: string) => {
    setPropertyFormsCategory(category);
    setCurrentView('property_forms');
  };

  const handleSelectProperty = (view: View, property: any) => {
    setSelectedProperty(property);
    setCurrentView(view);
  };

  // When navigating to manager screens, ensure admin is logged in
  const handleNavigate = (view: View) => {
    const managerViews: View[] = [
      'manager_dashboard', 'accounting', 'invoices', 'maintenance',
      'property_details', 'new_maintenance', 'settings', 'reports',
      'add_property', 'owners', 'units', 'contracts', 'notifications',
      'support', 'docs', 'financial_report', 'zakat_tax', 'ejar_integration',
      'tech_performance', 'dev_center', 'archive', 'tenant_satisfaction',
      'tenants_management', 'vendors_management', 'asset_management',
      'publish', 'ai_assistant', 'msg_templates', 'property_forms',
      'property_report', 'official_print',
    ];
    if (view === 'welcome') {
      try { sessionStorage.removeItem('admin_session'); } catch {}
      setLoggedInAdmin(null); // logout
    }
    if (managerViews.includes(view) && !loggedInAdmin) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  };

  useEffect(() => {
    (window as any).selectProperty = (p: any) => setSelectedProperty(p);
    return () => { delete (window as any).selectProperty; };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'welcome': return <WelcomeScreen onSelect={handleNavigate} />;
      case 'login': return (
        <LoginScreen
          onSuccess={(user) => {
            try { sessionStorage.setItem('admin_session', JSON.stringify(user)); } catch {}
            setLoggedInAdmin(user);
            setCurrentView('manager_dashboard');
          }}
          onBack={() => setCurrentView('welcome')}
        />
      );
      case 'manager_dashboard': return <ManagerDashboard onSelect={handleNavigate} onSelectProperty={handleSelectProperty} />;
      case 'accounting': return <AccountingScreen onSelect={handleNavigate} />;
      case 'invoices': return <InvoicesScreen onSelect={handleNavigate} />;
      case 'maintenance': return <MaintenanceScreen onSelect={handleNavigate} />;
      case 'property_details': return <PropertyDetailsScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'new_maintenance': return <NewMaintenanceRequestScreen onSelect={handleNavigate} />;
      case 'tenant_dashboard': return <TenantDashboard onSelect={setCurrentView} onNavigateForms={navigateToForms} />;
      case 'settings': return <SettingsScreen onSelect={handleNavigate} />;
      case 'reports': return <ReportsScreen onSelect={handleNavigate} />;
      case 'add_property': return <AddPropertyScreen onSelect={handleNavigate} />;
      case 'owners': return <OwnersManagementScreen onSelect={handleNavigate} />;
      case 'units': return <UnitsManagementScreen onSelect={handleNavigate} />;
      case 'contracts': return <ContractsManagementScreen onSelect={handleNavigate} />;
      case 'support': return <SupportScreen onSelect={handleNavigate} />;
      case 'docs': return <TechnicalDocsScreen onSelect={handleNavigate} />;
      case 'notifications': return <NotificationsScreen onSelect={handleNavigate} />;
      case 'financial_report': return <FinancialReportScreen onSelect={handleNavigate} />;
      case 'property_report': return <PropertyReportScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'official_print': return <OfficialPrintScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'zakat_tax': return <ZakatTaxScreen onSelect={handleNavigate} />;
      case 'ejar_integration': return <EjarIntegrationScreen onSelect={handleNavigate} />;
      case 'tech_performance': return <TechPerformanceScreen onSelect={handleNavigate} />;
      case 'dev_center': return <DeveloperCenterScreen onSelect={handleNavigate} />;
      case 'archive': return <ArchiveScreen onSelect={handleNavigate} />;
      case 'tenant_satisfaction': return <TenantSatisfactionReportScreen onSelect={handleNavigate} />;
      case 'tenants_management': return <TenantsManagementScreen onSelect={handleNavigate} />;
      case 'vendors_management': return <VendorsManagementScreen onSelect={handleNavigate} />;
      case 'asset_management': return <AssetManagementScreen onSelect={handleNavigate} />;
      case 'publish': return <PublishingScreen onSelect={handleNavigate} />;
      case 'ai_assistant': return <AIAssistantScreen onSelect={handleNavigate} />;
      case 'payment': return <PaymentScreen onSelect={setCurrentView} />;
      case 'owner_dashboard': return <OwnerDashboard onSelect={setCurrentView} />;
      case 'tech_portal': return <TechPortal onSelect={setCurrentView} />;
      case 'msg_templates': return <MessageTemplatesScreen onSelect={handleNavigate} />;
      case 'property_forms': return <PropertyFormsScreen onSelect={handleNavigate} initialCategory={propertyFormsCategory} />;
      default: return <WelcomeScreen onSelect={setCurrentView} />;
    }
  };

  return (
    <LanguageProvider>
      <AppDataProvider>
      <div className="min-h-screen font-sans">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppDataProvider>
    </LanguageProvider>
  );
};

// --- Technician Portal ---

const TechPortal = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { MAINTENANCE_REQUESTS, updateMaintenanceStatus } = useAppData();
  const techName = 'أحمد محمود';
  const [activeTab, setActiveTab] = useState<'new' | 'in_progress' | 'completed'>('new');
  const [tasks, setTasks] = useState(MAINTENANCE_REQUESTS);
  // Sync tasks when context data loads from DB
  useEffect(() => { setTasks(MAINTENANCE_REQUESTS); }, [MAINTENANCE_REQUESTS]);

  const myTasks = tasks.filter(t => t.technician === techName);
  const tabCounts = {
    new: myTasks.filter(t => t.status === 'new').length,
    in_progress: myTasks.filter(t => t.status === 'in_progress').length,
    completed: myTasks.filter(t => t.status === 'completed').length,
  };
  const filteredTasks = myTasks.filter(t => t.status === activeTab);

  const priorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700';
    if (p === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-500';
  };
  const priorityLabel = (p: string) => p === 'high' ? 'عاجل' : p === 'medium' ? 'متوسط' : 'منخفض';
  const typeIcon = (t: string) => {
    const map: Record<string, string> = { 'سباكة': 'plumbing', 'كهرباء': 'electrical_services', 'تكييف': 'ac_unit', 'دهانات': 'format_paint', 'مكافحة': 'pest_control' };
    return map[t] || 'build';
  };

  const advanceStatus = (id: string) => {
    const next = tasks.find(t => t.id === id)?.status === 'new' ? 'in_progress' : 'completed';
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
    updateMaintenanceStatus(id, next); // persist to SQLite
  };

  const tabs: { key: 'new' | 'in_progress' | 'completed'; label: string }[] = [
    { key: 'new', label: 'جديد' },
    { key: 'in_progress', label: 'قيد التنفيذ' },
    { key: 'completed', label: 'مكتمل' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      {/* Header */}
      <header className="bg-brand-dark text-white p-5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 gold-gradient rounded-full flex items-center justify-center text-brand-dark font-black text-xl shadow-lg">
              {techName[0]}
            </div>
            <div>
              <h1 className="text-base font-black">{techName}</h1>
              <p className="text-[10px] text-slate-400">فني صيانة • رمز الإبداع</p>
            </div>
          </div>
          <button onClick={() => onSelect('welcome')} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Icon name="logout" />
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'جديد', count: tabCounts.new, icon: 'inbox', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'قيد التنفيذ', count: tabCounts.in_progress, icon: 'construction', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'مكتمل', count: tabCounts.completed, icon: 'task_alt', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                <Icon name={stat.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(stat.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 px-4 py-3 bg-white sticky top-[73px] z-40 border-b border-slate-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.key ? "bg-brand-dark text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            )}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={cn("mr-1 inline-block text-[9px] font-black px-1 rounded-full", activeTab === tab.key ? 'bg-white/20' : 'bg-slate-200')}>
                {toArabicDigits(tabCounts[tab.key])}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Icon name={typeIcon(task.type)} className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark">{task.type}</h4>
                    <p className="text-[10px] text-slate-400">{task.property} — {task.unit}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Icon name="calendar_today" className="text-[10px]" />
                      {task.date}
                    </p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0", priorityColor(task.priority))}>
                  {priorityLabel(task.priority)}
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-3 leading-relaxed">{task.description}</p>

              {task.status !== 'completed' && (
                <button
                  onClick={() => advanceStatus(task.id)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    task.status === 'new'
                      ? "bg-primary/10 text-primary hover:bg-primary hover:text-brand-dark"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                  )}
                >
                  <Icon name={task.status === 'new' ? 'play_circle' : 'check_circle'} className="text-sm" />
                  {task.status === 'new' ? 'بدء التنفيذ' : 'تحديد كمكتمل'}
                </button>
              )}
              {task.status === 'completed' && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold py-2 bg-emerald-50 rounded-xl">
                  <Icon name="task_alt" className="text-sm" />
                  تم الإنجاز
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center">
            <Icon name="check_circle" className="text-5xl text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold">لا توجد مهام في هذه الفئة</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-primary relative px-3 py-1 rounded-2xl">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
          <Icon name="home" className="text-2xl relative z-10" filled />
          <span className="text-[10px] font-black relative z-10">المهام</span>
        </button>
        <button onClick={() => onSelect('new_maintenance')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="add_circle" className="text-2xl" />
          <span className="text-[10px] font-black">طلب جديد</span>
        </button>
        <button onClick={() => onSelect('support')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 px-3 py-1">
          <Icon name="support_agent" className="text-2xl" />
          <span className="text-[10px] font-black">الدعم</span>
        </button>
        <button onClick={() => onSelect('welcome')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 px-3 py-1">
          <Icon name="logout" className="text-2xl" />
          <span className="text-[10px] font-black">خروج</span>
        </button>
      </nav>
    </div>
  );
};

// --- Payment Screen ---

const PaymentScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const { TENANTS, recordPayment } = useAppData();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const paymentMethods = [
    { id: 'mada', label: 'مدى', icon: 'credit_card', desc: 'بطاقة مدى المصرفية' },
    { id: 'sadad', label: 'سداد', icon: 'account_balance', desc: 'خدمة سداد للمدفوعات' },
    { id: 'transfer', label: 'تحويل بنكي', icon: 'send_money', desc: 'تحويل مباشر للحساب' },
  ];

  const paymentHistory = [
    { date: '٢٠٢٤/٠٥/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٤/٠١', amount: '٤,٨٠٠', method: 'سداد', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٣/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="flex items-center bg-brand-dark px-6 py-5 justify-between sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('tenant_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-black text-white">دفع الإيجار</h2>
        <div className="size-10" />
      </header>

      <main className="p-6 space-y-6">
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6 pt-12 text-center"
          >
            <div className="size-24 gold-gradient rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
              <Icon name="check_circle" className="text-5xl text-brand-dark" filled />
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">تم الدفع بنجاح!</h3>
              <p className="text-sm text-slate-500 font-bold">تم تحصيل دفعة الإيجار لشهر يونيو ٢٠٢٤</p>
            </div>
            <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-right space-y-3">
              {[
                { label: 'المبلغ', value: '٤,٨٠٠ ر.س' },
                { label: 'طريقة الدفع', value: paymentMethods.find(m => m.id === selectedMethod)?.label ?? '' },
                { label: 'التاريخ', value: '٢٠٢٤/٠٦/٠١' },
                { label: 'رقم العملية', value: '#TXN-٢٠٢٤٠٦٠١' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                  <span className="text-xs font-black text-brand-dark">{item.value}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect('tenant_dashboard')}
              className="w-full py-4 gold-gradient rounded-2xl text-brand-dark font-black text-base shadow-lg shadow-primary/20"
            >
              العودة للرئيسية
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* بطاقة تفاصيل الدفعة */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2.5rem] p-8 dark-gradient text-white shadow-2xl relative overflow-hidden border border-white/5"
            >
              <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="payments" className="text-lg" filled />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">الدفعة المستحقة</p>
                </div>
                <h3 className="text-5xl font-black tracking-tighter mt-1">٤,٨٠٠ <span className="text-xl font-bold text-primary/60">ر.س</span></h3>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[
                    { label: 'الوحدة', value: 'شقة ٤٠٢' },
                    { label: 'تاريخ الاستحقاق', value: '٢٠٢٤/٠٦/٠١' },
                    { label: 'العقار', value: 'برج الياسمين' },
                    { label: 'الشهر', value: 'يونيو ٢٠٢٤' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* طريقة الدفع */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> اختر طريقة الدفع
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right",
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "size-12 rounded-xl flex items-center justify-center transition-all",
                      selectedMethod === method.id ? "gold-gradient text-brand-dark" : "bg-slate-50 text-slate-400"
                    )}>
                      <Icon name={method.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-brand-dark">{method.label}</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="size-6 rounded-full gold-gradient flex items-center justify-center">
                        <Icon name="check" className="text-sm text-brand-dark" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* زر الدفع */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedMethod}
              onClick={() => { if (!selectedMethod) return; setSubmitted(true); recordPayment('1'); /* tenant id=1 is mock logged-in tenant */ }}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg",
                selectedMethod
                  ? "gold-gradient text-brand-dark shadow-primary/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              {selectedMethod ? `ادفع ٤,٨٠٠ ر.س عبر ${paymentMethods.find(m => m.id === selectedMethod)?.label}` : 'اختر طريقة الدفع أولاً'}
            </motion.button>

            {/* سجل المدفوعات */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> سجل المدفوعات
              </h3>
              <div className="space-y-3">
                {paymentHistory.map((payment, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Icon name="check_circle" className="text-lg" filled />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-dark">{payment.amount} ر.س</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{payment.date} • {payment.method}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">{payment.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

// --- Message Templates Screen ---

const MessageTemplatesScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [sendModal, setSendModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [previewModal, setPreviewModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('SMS');

  const categories = ['الكل', 'عقود', 'مالية', 'صيانة', 'عام'];
  const filtered = activeCategory === 'الكل' ? MSG_TEMPLATES : MSG_TEMPLATES.filter(t => t.category === activeCategory);

  const recipientBadge = (r: string) => {
    if (r === 'مستأجر') return 'bg-blue-50 text-blue-600';
    if (r === 'مالك') return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-100 text-slate-500';
  };

  const handleSend = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setSendModal(null);
      setSelectedRecipient('');
      setSelectedChannel('SMS');
    }, 1800);
  };

  const categoryCount = (cat: string) => cat === 'الكل'
    ? MSG_TEMPLATES.length
    : MSG_TEMPLATES.filter(t => t.category === cat).length;

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-black text-white">قوالب الرسائل الآلية</h2>
          <p className="text-[10px] text-primary font-bold">{toArabicDigits(MSG_TEMPLATES.length)} قالب جاهز</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="mail_outline" className="text-xl" />
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'العقود', count: MSG_TEMPLATES.filter(t => t.category === 'عقود').length, icon: 'history_edu', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'المالية', count: MSG_TEMPLATES.filter(t => t.category === 'مالية').length, icon: 'payments', color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'الصيانة', count: MSG_TEMPLATES.filter(t => t.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'عام', count: MSG_TEMPLATES.filter(t => t.category === 'عام').length, icon: 'campaign', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1.5">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(s.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Auto notice */}
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3">
          <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
            <Icon name="auto_mode" className="text-base" />
          </div>
          <p className="text-xs font-bold text-brand-dark">القوالب المميزة بـ <span className="text-primary">آلي</span> تُرسَل تلقائياً عند تحقق الشرط (انتهاء عقد، تأخر سداد، إلخ)</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                {toArabicDigits(categoryCount(cat))}
              </span>
            </button>
          ))}
        </div>

        {/* Templates list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((tmpl) => (
            <motion.div
              key={tmpl.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", tmpl.bg, tmpl.color)}>
                    <Icon name={tmpl.icon} className="text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-black text-sm text-brand-dark">{tmpl.title}</h4>
                      {tmpl.auto && (
                        <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Icon name="auto_mode" className="text-[10px]" /> آلي
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(tmpl.recipient))}>
                        {tmpl.recipient}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{tmpl.category}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded-lg">{tmpl.preview}</p>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => setPreviewModal(tmpl)}
                  className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Icon name="visibility" className="text-sm" /> معاينة كاملة
                </button>
                <button
                  onClick={() => setSendModal(tmpl)}
                  className={cn("py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors", tmpl.color, "hover:opacity-80")}
                >
                  <Icon name="send" className="text-sm" /> إرسال
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("size-12 rounded-xl flex items-center justify-center", previewModal.bg, previewModal.color)}>
                  <Icon name={previewModal.icon} className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-black text-brand-dark">{previewModal.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(previewModal.recipient))}>{previewModal.recipient}</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{previewModal.category}</span>
                    {previewModal.auto && <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">آلي</span>}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                <p className="text-sm text-slate-600 leading-loose font-medium">{previewModal.preview}</p>
              </div>
              <p className="text-[10px] text-slate-400 text-center mb-4">القيم داخل [الأقواس] ستُعوَّض تلقائياً بالبيانات الفعلية عند الإرسال</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPreviewModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إغلاق</button>
                <button onClick={() => { setPreviewModal(null); setSendModal(previewModal); }} className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg", "bg-brand-dark")}>
                  <Icon name="send" className="text-sm" /> إرسال الآن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Modal */}
      <AnimatePresence>
        {sendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!sendSuccess) setSendModal(null); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {sendSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Icon name="check_circle" className="text-5xl" />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark mb-1">تم الإرسال بنجاح!</h3>
                  <p className="text-sm text-slate-500">تم إرسال الرسالة إلى المستلمين المحددين</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-black text-brand-dark text-lg mb-1">إرسال الرسالة</h3>
                  <p className="text-xs text-slate-400 mb-5">{sendModal.title}</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">اختر المستلمين</label>
                      <div className="space-y-2">
                        {sendModal.recipient === 'الجميع' ? (
                          ['جميع المستأجرين', 'جميع الملاك', 'مستأجرو عقار محدد', 'مستأجر واحد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : sendModal.recipient === 'مستأجر' ? (
                          ['جميع المستأجرين', 'مستأجرو عقار محدد', 'مستأجر واحد محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : (
                          ['جميع الملاك', 'مالك محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">قناة الإرسال</label>
                      <div className="flex gap-2">
                        {[{ label: 'SMS', icon: 'sms' }, { label: 'بريد', icon: 'email' }, { label: 'إشعار', icon: 'notifications' }].map((ch) => (
                          <button key={ch.label} onClick={() => setSelectedChannel(ch.label)} className={cn("flex-1 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all", selectedChannel === ch.label ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5')}>
                            <Icon name={ch.icon} className="text-base" />
                            {ch.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button onClick={() => setSendModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                    <button
                      disabled={!selectedRecipient}
                      onClick={handleSend}
                      className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all", selectedRecipient ? "bg-brand-dark shadow-brand-dark/20 hover:opacity-90" : "bg-slate-300 cursor-not-allowed")}
                    >
                      <Icon name="send" className="text-sm" /> إرسال
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

// --- Property Forms Screen ---

const PropertyFormsScreen = ({ onSelect, initialCategory = 'الكل' }: { onSelect: (v: View) => void; initialCategory?: string }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openForm, setOpenForm] = useState<typeof PROPERTY_FORMS[0] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['الكل', 'عقارات', 'مالية', 'صيانة', 'خدمات'];
  const filtered = activeCategory === 'الكل' ? PROPERTY_FORMS : PROPERTY_FORMS.filter(f => f.category === activeCategory);

  const categoryBadgeStyle = (cat: string) => {
    if (cat === 'عقارات') return 'bg-blue-50 text-blue-600';
    if (cat === 'مالية') return 'bg-emerald-50 text-emerald-600';
    if (cat === 'صيانة') return 'bg-orange-50 text-orange-600';
    return 'bg-purple-50 text-purple-600';
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setOpenForm(null);
      setFormValues({});
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-black text-white">نماذج وإشعارات العقارات</h2>
          <p className="text-[10px] text-primary font-bold">{toArabicDigits(PROPERTY_FORMS.length)} نماذج جاهزة</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="description" className="text-xl" />
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'عقارات', count: PROPERTY_FORMS.filter(f => f.category === 'عقارات').length, icon: 'apartment', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'مالية', count: PROPERTY_FORMS.filter(f => f.category === 'مالية').length, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'صيانة', count: PROPERTY_FORMS.filter(f => f.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'خدمات', count: PROPERTY_FORMS.filter(f => f.category === 'خدمات').length, icon: 'star', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1.5">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(s.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Forms list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((form) => (
            <motion.div
              key={form.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0", form.bg, form.color)}>
                  <Icon name={form.icon} className="text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-black text-sm text-brand-dark leading-snug">{form.title}</h4>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full shrink-0", categoryBadgeStyle(form.category))}>{form.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mb-2">{form.desc}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] text-slate-400 font-bold">الحقول:</span>
                    {form.fields.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">{f.label}</span>
                    ))}
                    {form.fields.length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{form.fields.length - 3} أخرى</span>}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => { setOpenForm(form); setFormValues({}); setSubmitSuccess(false); }}
                  className="py-3 text-xs font-bold text-primary flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
                >
                  <Icon name="edit_document" className="text-sm" /> تعبئة النموذج
                </button>
                <button onClick={() => window.print()} className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
                  <Icon name="print" className="text-sm" /> طباعة فارغ
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Form Fill Modal */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => { if (!submitSuccess) setOpenForm(null); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {submitSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-16 text-center px-6">
                  <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Icon name="check_circle" className="text-6xl" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2">تم الحفظ!</h3>
                  <p className="text-sm text-slate-500">تم حفظ النموذج وإرساله بنجاح</p>
                </motion.div>
              ) : (
                <>
                  <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center", openForm.bg, openForm.color)}>
                      <Icon name={openForm.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-brand-dark text-sm">{openForm.title}</h3>
                      <p className="text-[10px] text-slate-400">{openForm.fields.length} حقول</p>
                    </div>
                    <button onClick={() => setOpenForm(null)} className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
                    {/* Property & unit selectors */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">العقار</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر العقار</option>
                          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">الوحدة</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر الوحدة</option>
                          {UNITS.map(u => <option key={u.id} value={u.id}>{u.id} - {u.type}</option>)}
                        </select>
                      </div>
                    </div>

                    {openForm.fields.map((field, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          >
                            <option value="">اختر...</option>
                            {(field.options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        ) : field.type === 'file' ? (
                          <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-slate-50 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Icon name="attach_file" className="text-2xl mb-1" />
                            <span className="text-xs font-bold">اضغط لإرفاق الملف</span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}

                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setOpenForm(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                      <button type="submit" className="py-3 rounded-xl bg-brand-dark text-white text-sm font-bold shadow-lg shadow-brand-dark/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Icon name="save" className="text-sm" /> حفظ وإرسال
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

// --- Main App ---

// --- App Data Provider ---

function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [properties,           setProperties]          = useState<typeof PROPERTIES>(PROPERTIES);
  const [maintenanceRequests,  setMaintenanceRequests] = useState<typeof MAINTENANCE_REQUESTS>(MAINTENANCE_REQUESTS);
  const [units,                setUnits]               = useState<typeof UNITS>(UNITS);
  const [tenants,              setTenants]             = useState<typeof TENANTS>(TENANTS);
  const [owners,               setOwners]              = useState<typeof OWNERS>(OWNERS);
  const [contracts,            setContracts]           = useState<typeof CONTRACTS>(CONTRACTS);
  const [vendors,              setVendors]             = useState<typeof VENDORS>(VENDORS);
  const [invoices,             setInvoices]            = useState<typeof INVOICES>(INVOICES);

  // Load all data from the SQLite API on mount (fallback to static seed if API unavailable)
  useEffect(() => {
    const load = async () => {
      try {
        const [props, maint, u, t, o, c, v, inv] = await Promise.all([
          apiGetProperties(),
          apiGetMaintenance(),
          apiGetUnits(),
          apiGetTenants(),
          apiGetOwners(),
          apiGetContracts(),
          apiGetVendors(),
          apiGetInvoices(),
        ]);
        if (props.length)  setProperties(props as typeof PROPERTIES);
        if (maint.length)  setMaintenanceRequests(maint as typeof MAINTENANCE_REQUESTS);
        if (u.length)      setUnits(u as typeof UNITS);
        if (t.length)      setTenants(t as typeof TENANTS);
        if (o.length)      setOwners(o as typeof OWNERS);
        if (c.length)      setContracts(c as typeof CONTRACTS);
        if (v.length)      setVendors(v as typeof VENDORS);
        if (inv.length)    setInvoices(inv as typeof INVOICES);
      } catch {
        // API not available — static seed data is already in state, no action needed
      }
    };
    load();
  }, []);

  // Mutations — call API then update local state optimistically
  const updateMaintenanceStatus = async (id: string, status: string) => {
    setMaintenanceRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status } : r)
    );
    try { await apiUpdateMaintenanceStatus(id, status); } catch {}
  };

  const createMaintenanceRequest = async (data: {
    property: string; unit: string; date: string; type: string;
    technician?: string; description?: string; priority?: string;
  }) => {
    const tempId = String(Date.now());
    const newReq = {
      id: tempId, status: 'new',
      property: data.property, unit: data.unit, date: data.date, type: data.type,
      technician: data.technician ?? '', description: data.description ?? '',
      priority: data.priority ?? 'medium',
    };
    setMaintenanceRequests(prev => [newReq as typeof MAINTENANCE_REQUESTS[0], ...prev]);
    try {
      const created = await apiCreateMaintenance(data);
      setMaintenanceRequests(prev => prev.map(r => r.id === tempId ? created as typeof r : r));
    } catch {}
  };

  const recordPayment = async (tenantId: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, paid: true } : t));
    setInvoices(prev => prev.map(inv =>
      inv.tenant === (tenants.find(t => t.id === tenantId)?.name ?? '')
        ? { ...inv, status: 'مدفوعة' } : inv
    ));
    try { await apiRecordPayment(tenantId); } catch {}
  };

  const addProperty = async (data: Property) => {
    setProperties(prev => [...prev, data as typeof PROPERTIES[0]]);
    try { await apiAddProperty(data); } catch {}
  };

  const renewContract = async (id: string, newEnd: string) => {
    setContracts(prev =>
      prev.map(c => c.id === id ? { ...c, end: newEnd, status: 'ساري' } : c)
    );
    try { await apiUpdateContract(id, { status: 'ساري', end: newEnd }); } catch {}
  };

  return (
    <AppDataContext.Provider value={{
      PROPERTIES: properties,
      MAINTENANCE_REQUESTS: maintenanceRequests,
      UNITS: units,
      TENANTS: tenants,
      OWNERS: owners,
      CONTRACTS: contracts,
      VENDORS: vendors,
      INVOICES: invoices,
      updateMaintenanceStatus,
      createMaintenanceRequest,
      recordPayment,
      addProperty,
      renewContract,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);
  const [propertyFormsCategory, setPropertyFormsCategory] = useState('الكل');
  // Restore admin session from sessionStorage on page load
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('admin_session');
      return stored ? (JSON.parse(stored) as AdminUser) : null;
    } catch {
      return null;
    }
  });

  const navigateToForms = (category: string) => {
    setPropertyFormsCategory(category);
    setCurrentView('property_forms');
  };

  const handleSelectProperty = (view: View, property: any) => {
    setSelectedProperty(property);
    setCurrentView(view);
  };

  // When navigating to manager screens, ensure admin is logged in
  const handleNavigate = (view: View) => {
    const managerViews: View[] = [
      'manager_dashboard', 'accounting', 'invoices', 'maintenance',
      'property_details', 'new_maintenance', 'settings', 'reports',
      'add_property', 'owners', 'units', 'contracts', 'notifications',
      'support', 'docs', 'financial_report', 'zakat_tax', 'ejar_integration',
      'tech_performance', 'dev_center', 'archive', 'tenant_satisfaction',
      'tenants_management', 'vendors_management', 'asset_management',
      'publish', 'ai_assistant', 'msg_templates', 'property_forms',
      'property_report', 'official_print',
    ];
    if (view === 'welcome') {
      try { sessionStorage.removeItem('admin_session'); } catch {}
      setLoggedInAdmin(null); // logout
    }
    if (managerViews.includes(view) && !loggedInAdmin) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  };

  useEffect(() => {
    (window as any).selectProperty = (p: any) => setSelectedProperty(p);
    return () => { delete (window as any).selectProperty; };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'welcome': return <WelcomeScreen onSelect={handleNavigate} />;
      case 'login': return (
        <LoginScreen
          onSuccess={(user) => {
            try { sessionStorage.setItem('admin_session', JSON.stringify(user)); } catch {}
            setLoggedInAdmin(user);
            setCurrentView('manager_dashboard');
          }}
          onBack={() => setCurrentView('welcome')}
        />
      );
      case 'manager_dashboard': return <ManagerDashboard onSelect={handleNavigate} onSelectProperty={handleSelectProperty} />;
      case 'accounting': return <AccountingScreen onSelect={handleNavigate} />;
      case 'invoices': return <InvoicesScreen onSelect={handleNavigate} />;
      case 'maintenance': return <MaintenanceScreen onSelect={handleNavigate} />;
      case 'property_details': return <PropertyDetailsScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'new_maintenance': return <NewMaintenanceRequestScreen onSelect={handleNavigate} />;
      case 'tenant_dashboard': return <TenantDashboard onSelect={setCurrentView} onNavigateForms={navigateToForms} />;
      case 'settings': return <SettingsScreen onSelect={handleNavigate} />;
      case 'reports': return <ReportsScreen onSelect={handleNavigate} />;
      case 'add_property': return <AddPropertyScreen onSelect={handleNavigate} />;
      case 'owners': return <OwnersManagementScreen onSelect={handleNavigate} />;
      case 'units': return <UnitsManagementScreen onSelect={handleNavigate} />;
      case 'contracts': return <ContractsManagementScreen onSelect={handleNavigate} />;
      case 'support': return <SupportScreen onSelect={handleNavigate} />;
      case 'docs': return <TechnicalDocsScreen onSelect={handleNavigate} />;
      case 'notifications': return <NotificationsScreen onSelect={handleNavigate} />;
      case 'financial_report': return <FinancialReportScreen onSelect={handleNavigate} />;
      case 'property_report': return <PropertyReportScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'official_print': return <OfficialPrintScreen onSelect={handleNavigate} property={selectedProperty} />;
      case 'zakat_tax': return <ZakatTaxScreen onSelect={handleNavigate} />;
      case 'ejar_integration': return <EjarIntegrationScreen onSelect={handleNavigate} />;
      case 'tech_performance': return <TechPerformanceScreen onSelect={handleNavigate} />;
      case 'dev_center': return <DeveloperCenterScreen onSelect={handleNavigate} />;
      case 'archive': return <ArchiveScreen onSelect={handleNavigate} />;
      case 'tenant_satisfaction': return <TenantSatisfactionReportScreen onSelect={handleNavigate} />;
      case 'tenants_management': return <TenantsManagementScreen onSelect={handleNavigate} />;
      case 'vendors_management': return <VendorsManagementScreen onSelect={handleNavigate} />;
      case 'asset_management': return <AssetManagementScreen onSelect={handleNavigate} />;
      case 'publish': return <PublishingScreen onSelect={handleNavigate} />;
      case 'ai_assistant': return <AIAssistantScreen onSelect={handleNavigate} />;
      case 'payment': return <PaymentScreen onSelect={setCurrentView} />;
      case 'owner_dashboard': return <OwnerDashboard onSelect={setCurrentView} />;
      case 'tech_portal': return <TechPortal onSelect={setCurrentView} />;
      case 'msg_templates': return <MessageTemplatesScreen onSelect={handleNavigate} />;
      case 'property_forms': return <PropertyFormsScreen onSelect={handleNavigate} initialCategory={propertyFormsCategory} />;
      default: return <WelcomeScreen onSelect={setCurrentView} />;
    }
  };

  return (
    <LanguageProvider>
      <AppDataProvider>
      <div className="min-h-screen font-sans">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppDataProvider>
    </LanguageProvider>
  );
}
