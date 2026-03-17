import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const toArabicDigits = (num: number | string) => {
  const id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => id[+w]);
};

// --- Types ---
type View = 
  | 'welcome' 
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
  | 'official_print';

// --- Constants & Mock Data ---

const MAINTENANCE_REQUESTS = [
  {
    id: '1',
    property: 'برج الياسمين',
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
    property: 'مجمع النخيل',
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
    property: 'فلل الروضة',
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
    property: 'برج الياسمين',
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
    property: 'عمارة السعادة',
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
    property: 'برج الأعمال',
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
  { id: '101', type: 'شقة', property: 'عمارة النور', rent: '4,500', status: 'مؤجرة' },
  { id: '402', type: 'مكتب', property: 'مجمع الأعمال', rent: '12,000', status: 'شاغرة' },
  { id: '7', type: 'فيلا', property: 'فلل قرطبة', rent: '8,000', status: 'تحت الصيانة' },
  { id: '205', type: 'شقة', property: 'عمارة السلام', rent: '3,800', status: 'مؤجرة' },
  { id: '301', type: 'مكتب', property: 'برج الأعمال', rent: '15,000', status: 'شاغرة' },
  { id: '15', type: 'فيلا', property: 'مجمع الفيلات', rent: '9,500', status: 'مؤجرة' },
  { id: '502', type: 'شقة', property: 'برج الياسمين', rent: '5,200', status: 'شاغرة' },
  { id: '104', type: 'شقة', property: 'مجمع النخيل', rent: '4,800', status: 'مؤجرة' },
];

// --- Shared Components ---

const Icon = ({ name, className = "", filled = false }: { name: string, className?: string, filled?: boolean }) => (
  <span className={cn("material-symbols-outlined", filled && "filled", className)}>{name}</span>
);

const BottomNav = ({ active, onSelect }: { active: View, onSelect: (v: View) => void }) => {
  const items = [
    { id: 'manager_dashboard', label: 'الرئيسية', icon: 'grid_view' },
    { id: 'property_details', label: 'العقارات', icon: 'apartment' },
    { id: 'accounting', label: 'المالية', icon: 'account_balance_wallet' },
    { id: 'settings', label: 'الإعدادات', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id as View)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative px-4 py-1 rounded-2xl",
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
      ))}
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

const WelcomeScreen = ({ onSelect }: { onSelect: (view: View) => void }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === 'aliayashi522@gmail.com') {
        onSelect('manager_dashboard');
      } else {
        alert('غير مصرح لك بالدخول كمدير نظام.');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

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
          الريادة في إدارة الأملاك العقارية
        </p>
        <div className="w-24 h-1 gold-gradient rounded-full mt-6"></div>
      </motion.header>

      <main className="flex-grow container mx-auto px-6 py-8 relative z-10 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full group relative flex flex-col items-center p-8 bg-white/5 border border-white/10 hover:border-primary/50 rounded-3xl transition-all overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity -mr-16 -mt-16 rounded-full blur-2xl"></div>
            
            <div className="size-16 gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <Icon name="admin_panel_settings" className="text-3xl text-brand-dark" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل دخول مدير النظام'}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              تسجيل الدخول باستخدام حساب Google المعتمد
            </p>
          </motion.button>
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

const ManagerDashboard = ({ onSelect, onSelectProperty, properties }: { onSelect: (v: View) => void, onSelectProperty: (v: View, p: any) => void, properties: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const chartData = [
    { name: 'يناير', value: 4000 },
    { name: 'فبراير', value: 3000 },
    { name: 'مارس', value: 2000 },
    { name: 'أبريل', value: 2780 },
    { name: 'مايو', value: 1890 },
    { name: 'يونيو', value: 2390 },
  ];

  const filteredProperties = properties.filter(prop => 
    prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    prop.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h2 className="text-3xl font-black text-brand-dark tracking-tight">لوحة التحكم</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">نظرة عامة على أداء محفظتك العقارية</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
             <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">اليوم</button>
             <button className="px-4 py-1.5 text-slate-500 rounded-lg text-xs font-bold">الأسبوع</button>
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
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">إجمالي التحصيل المالي</p>
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
              <p className="text-[10px] text-slate-500 font-bold">مقارنة بالشهر الماضي</p>
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
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">إجمالي العقارات</p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">{toArabicDigits(properties.length)}</h3>
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
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">المستأجرين</p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">٨٩</h3>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-brand-dark">تحليل الإيرادات</h3>
                  <p className="text-xs text-slate-400 font-medium">معدل النمو الشهري للتحصيل</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold text-slate-500">الإيرادات</span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
              <h3 className="text-lg font-black text-brand-dark mb-6">توزيع الإشغال</h3>
              <div className="flex-grow flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-brand-dark">٩٢٪</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مشغول</span>
                </div>
                <ResponsiveContainer width="100%" height="200" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'مشغول', value: 92 },
                        { name: 'شاغر', value: 8 }
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
                    <span className="text-xs font-bold text-slate-600">وحدات مؤجرة</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">١٤٢</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-bold text-slate-600">وحدات شاغرة</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">١٢</span>
                </div>
              </div>
           </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">إجراءات سريعة</h3>
            <div className="h-px flex-grow mx-6 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'إضافة عقار', icon: 'add_home', color: 'gold-gradient text-brand-dark', view: 'add_property' },
              { label: 'إدارة العقود', icon: 'history_edu', color: 'bg-brand-dark text-white', view: 'contracts' },
              { label: 'فاتورة جديدة', icon: 'receipt_long', color: 'bg-white border-slate-100 text-slate-600', view: 'invoices' },
              { label: 'طلب صيانة', icon: 'build', color: 'bg-white border-slate-100 text-slate-600', view: 'new_maintenance' },
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
            <h3 className="text-xl font-black text-brand-dark">العقارات</h3>
            <button onClick={() => onSelect('property_details')} className="text-primary text-xs font-black uppercase tracking-widest">عرض الكل</button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن عقار بالاسم أو العنوان..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          {/* Property List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.length > 0 ? (
              filteredProperties.slice(0, 6).map((prop) => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  onSelectProperty={onSelectProperty} 
                />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                لا توجد عقارات مطابقة للبحث
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const PropertyCard: React.FC<{ property: any, onSelectProperty: (view: View, prop: any) => void }> = ({ property, onSelectProperty }) => {
  // Determine status color and label
  let statusColor = 'bg-green-100 text-green-700';
  let statusLabel = 'متاح';
  if (property.status === 'نشط') {
    statusColor = 'bg-blue-100 text-blue-700';
    statusLabel = 'مؤجر بالكامل';
  } else if (property.status === 'صيانة') {
    statusColor = 'bg-amber-100 text-amber-700';
    statusLabel = 'تحت الصيانة';
  }

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelectProperty('property_details', property)}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group flex flex-col"
    >
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${property.id}/600/400`} 
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
        
        {/* Status Indicator */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${statusColor}`}>
          {statusLabel}
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
          {property.type}
        </div>

        <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
           <div className="space-y-1">
             <h4 className="font-black text-lg text-white drop-shadow-md">{property.name}</h4>
             <p className="text-white/90 text-xs font-bold flex items-center gap-1">
                <Icon name="location_on" className="text-sm text-primary" />
                {property.location}
             </p>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onSelectProperty('property_report', property);
               }}
               className="size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-primary hover:text-brand-dark transition-all"
               title="تقرير العقار"
             >
               <Icon name="description" className="text-lg" />
             </button>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 (window as any).selectProperty(property);
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
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
             <div className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <Icon name="door_front" className="text-lg" />
             </div>
             <span className="text-xs font-black text-slate-600">{toArabicDigits(property.units)} وحدة</span>
          </div>
          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-brand-dark transition-all">
             <Icon name="arrow_back" className="text-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AccountingScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
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
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">٥٠,٠٠٠ <span className="text-sm font-bold text-slate-400">ر.س</span></h2>
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
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">١٢,٥٠٠ <span className="text-sm font-bold text-slate-400">ر.س</span></h2>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {['الكل', 'مدفوعة', 'غير مدفوعة', 'مدفوعة جزئياً'].map((f, i) => (
            <button key={i} className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm",
              i === 0 ? "bg-brand-dark text-white" : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
            )}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-brand-dark">الفواتير الحديثة</h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {[
              { id: '#INV-2024-001', tenant: 'أحمد علي', property: 'عمارة النخيل', amount: '4,500 ر.س', status: 'مدفوعة', statusColor: 'bg-emerald-100 text-emerald-700' },
              { id: '#INV-2024-002', tenant: 'سارة محمد', property: 'برج الياسمين', amount: '3,800 ر.س', status: 'غير مدفوعة', statusColor: 'bg-rose-100 text-rose-700' },
              { id: '#INV-2024-003', tenant: 'خالد حسن', property: 'مجمع الروضة', amount: '5,200 ر.س', status: 'مدفوعة جزئياً', statusColor: 'bg-amber-100 text-amber-700' },
            ].map((inv, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-all">
                    <Icon name="receipt_long" className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-brand-dark">{inv.tenant}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{inv.property} • {inv.id}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-brand-dark">{inv.amount}</p>
                  <span className={cn("inline-block px-3 py-1 rounded-full text-[9px] font-black mt-1", inv.statusColor)}>
                    {inv.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav active="invoices" onSelect={onSelect} />
    </div>
  );
};

const MaintenanceScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = ['جديد', 'قيد التنفيذ', 'مكتمل'];

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
          <h1 className="text-lg font-black text-white">الصيانة</h1>
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
            placeholder="البحث عن عقار، وحدة، أو نوع المشكلة..." 
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
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">عاجل</p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">{MAINTENANCE_REQUESTS.filter(r => r.priority === 'high' && r.status !== 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Icon name="schedule" className="text-lg" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">متوسط الانتظار</p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">2 يوم</p>
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
                        {req.priority === 'high' ? 'عالي الأهمية' : req.priority === 'medium' ? 'متوسط' : 'منخفض'}
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
                        التفاصيل
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
                <p className="text-slate-500 text-sm">لا توجد طلبات صيانة مطابقة</p>
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
        <h2 className="text-2xl font-bold mb-2">تم إرسال رسالتك!</h2>
        <p className="text-slate-500">سيتواصل معك فريق الدعم الفني في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <Icon name="arrow_forward" />
        </button>
        <h1 className="text-lg font-bold">الدعم الفني</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-5 space-y-8">
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-black text-brand-dark">كيف يمكننا مساعدتك؟</h2>
          <p className="text-slate-500 text-sm">نحن هنا للإجابة على استفساراتك وحل مشكلاتك</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="call" />
            </div>
            <p className="text-xs font-bold">اتصال مباشر</p>
            <p className="text-[10px] text-slate-400">٩٢٠٠٠١٢٣٤</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="chat" />
            </div>
            <p className="text-xs font-bold">واتساب</p>
            <p className="text-[10px] text-slate-400">٠٥٠١٢٣٤٥٦٧</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-6 shadow-xl border border-primary/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Icon name="mail" className="text-primary" />
            أرسل لنا رسالة
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">الموضوع</label>
              <select required className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all">
                <option value="">اختر نوع الاستفسار</option>
                <option>مشكلة تقنية</option>
                <option>استفسار مالي</option>
                <option>اقتراح تحسين</option>
                <option>أخرى</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">الرسالة</label>
              <textarea 
                required 
                rows={4}
                placeholder="اكتب تفاصيل استفسارك هنا..."
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
                  إرسال الرسالة
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
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center p-4">
        <Icon name="error_outline" className="text-4xl text-slate-400 mb-4" />
        <p className="text-slate-500 mb-4">لم يتم تحديد عقار</p>
        <button onClick={() => onSelect('manager_dashboard')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

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

        <section className="px-5 space-y-3">
          <h3 className="text-base font-bold">سجل المشاهدات والتفاعلات</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {[
              { user: 'أحمد محمد', action: 'عرض تفاصيل العقار', date: '٢٠٢٤/٠٣/١٥ ١٠:٣٠ ص', type: 'view' },
              { user: 'سارة خالد', action: 'تحميل تقرير العقار', date: '٢٠٢٤/٠٣/١٤ ٠٢:١٥ م', type: 'download' },
              { user: 'مدير النظام', action: 'تحديث بيانات الصك', date: '٢٠٢٤/٠٣/١٠ ٠٩:٠٠ ص', type: 'edit' },
            ].map((log, i) => (
              <div key={i} className="p-4 border-b border-slate-50 last:border-0 flex items-start gap-3">
                <div className={cn(
                  "size-8 rounded-full flex items-center justify-center shrink-0",
                  log.type === 'view' ? 'bg-blue-50 text-blue-500' : 
                  log.type === 'download' ? 'bg-emerald-50 text-emerald-500' : 
                  'bg-amber-50 text-amber-500'
                )}>
                  <Icon name={log.type === 'view' ? 'visibility' : log.type === 'download' ? 'download' : 'edit'} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">{log.action}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span className="font-bold">{log.user}</span>
                    <span>•</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="property_details" onSelect={onSelect} />
    </div>
  );
};

const NewMaintenanceRequestScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => onSelect('maintenance'), 1500);
    }, 1000);
  };

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
        <h2 className="text-2xl font-bold mb-2">تم إرسال الطلب!</h2>
        <p className="text-slate-500">سيقوم فريق الصيانة بمراجعة طلبك قريباً.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <button onClick={() => onSelect('maintenance')} className="flex size-12 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">طلب صيانة جديد</h2>
      </header>

      <main className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">الممتلكات</label>
            <select className="w-full rounded-xl border-none bg-white py-3.5 pr-4 pl-10 focus:ring-2 focus:ring-primary shadow-sm text-base transition-all">
              <option disabled selected>اختر المبنى</option>
              <option>أبراج النخيل - الرياض</option>
              <option>فيلا السعادة - جدة</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">رقم الوحدة</label>
            <input className="w-full rounded-xl border-none bg-white py-3.5 px-4 focus:ring-2 focus:ring-primary shadow-sm transition-all" placeholder="أدخل رقم الشقة أو الوحدة" type="text"/>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">فئة المشكلة</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'سباكة', icon: 'plumbing', active: true },
              { label: 'كهرباء', icon: 'electrical_services' },
              { label: 'تكييف', icon: 'ac_unit' },
              { label: 'مكافحة', icon: 'pest_control' },
              { label: 'دهان', icon: 'format_paint' },
              { label: 'أخرى', icon: 'more_horiz' },
            ].map((cat, i) => (
              <motion.button 
                key={i} 
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all border-2 ${cat.active ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-white text-slate-500'}`}
              >
                <Icon name={cat.icon} className="text-2xl" />
                <span className="text-xs font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">مستوى الأولوية</h3>
          <div className="flex w-full rounded-xl bg-slate-100 p-1">
            {['منخفض', 'متوسط', 'عالي'].map((p, i) => (
              <button key={i} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${i === 1 ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">الوصف</label>
          <textarea className="w-full min-h-[120px] rounded-xl border-none bg-white p-4 focus:ring-2 focus:ring-primary shadow-sm resize-none transition-all" placeholder="اشرح المشكلة بالتفصيل..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">إرفاق صور (اختياري)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"
            >
              <Icon name="add_a_photo" className="text-3xl" />
              <span className="text-[10px] font-medium">أضف صورة</span>
            </motion.button>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-4 text-white font-bold text-lg shadow-lg transition-all",
            isSubmitting ? "bg-slate-400" : "bg-primary shadow-primary/20 hover:bg-primary-dark"
          )}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
          {!isSubmitting && <Icon name="send" />}
        </button>
      </main>
    </div>
  );
};

const TenantDashboard = ({ onSelect }: { onSelect: (v: View) => void }) => {
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
              { label: 'دفع الإيجار', icon: 'payments' },
              { label: 'طلب صيانة', icon: 'construction', view: 'new_maintenance' },
              { label: 'تواصل معنا', icon: 'support_agent', view: 'support' },
            ].map((act, i) => (
              <motion.button 
                key={i} 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => act.view && onSelect(act.view as View)}
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
        <button className="flex flex-col items-center gap-1 text-primary">
          <Icon name="home" className="filled" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Icon name="payments" />
          <span className="text-[10px] font-medium">المدفوعات</span>
        </button>
        <div className="relative -top-6">
          <button className="size-14 bg-primary text-slate-900 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
            <Icon name="add" className="text-2xl" />
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Icon name="handyman" />
          <span className="text-[10px] font-medium">الصيانة</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Icon name="person" />
          <span className="text-[10px] font-medium">الملف</span>
        </button>
      </nav>
    </div>
  );
};

const SettingsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">إعدادات الحساب والهوية</h2>
        <button className="text-primary font-bold text-sm px-2">حفظ</button>
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
          <p className="text-sm text-gray-500">مدير عقارات معتمد</p>
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

        <button 
          onClick={async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Error signing out", error);
            }
          }} 
          className="w-full py-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors"
        >
          تسجيل الخروج
        </button>
      </main>

      <BottomNav active="settings" onSelect={onSelect} />
    </div>
  );
};

const ReportsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
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
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

import { addDoc } from 'firebase/firestore';

const AddPropertyScreen = ({ onSelect, properties }: { onSelect: (v: View) => void, properties: any[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [propertyName, setPropertyName] = useState('');
  const [location, setLocation] = useState('');
  const [units, setUnits] = useState('');
  const [type, setType] = useState('سكني');
  const [status, setStatus] = useState('متاح');
  const [deedNumber, setDeedNumber] = useState('');
  const [deedDate, setDeedDate] = useState('');
  const [deedIssuer, setDeedIssuer] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [planNumber, setPlanNumber] = useState('');
  const [deedArea, setDeedArea] = useState('');
  const [deedType, setDeedType] = useState('إلكتروني');
  const [cadastralNumber, setCadastralNumber] = useState('');
  const [cadastralDate, setCadastralDate] = useState('');
  const [cadastralStatus, setCadastralStatus] = useState('مسجل');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [nationalAddress, setNationalAddress] = useState('');
  const [buildingType, setBuildingType] = useState('سكني');
  const [usagePurpose, setUsagePurpose] = useState('سكني وتجاري');
  const [floorsCount, setFloorsCount] = useState('');
  const [elevatorsCount, setElevatorsCount] = useState('');
  const [parkingCount, setParkingCount] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check for duplicates
    const exists = properties.some(p => p.name === propertyName);
    if (exists) {
      setError('هذا العقار موجود بالفعل في النظام (تكرار)');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'properties'), {
        name: propertyName,
        location,
        units: Number(units) || 0,
        type,
        status,
        deedNumber,
        deedDate,
        deedIssuer,
        documentNumber,
        plotNumber,
        planNumber,
        deedArea,
        deedType,
        cadastralNumber,
        cadastralDate,
        cadastralStatus,
        region,
        city,
        district,
        nationalAddress,
        buildingType,
        usagePurpose,
        floorsCount,
        elevatorsCount,
        parkingCount,
        facilities,
        ownerName,
        ownerId,
        ownerPhone,
        ownerEmail
      });
      setIsSuccess(true);
      setTimeout(() => onSelect('manager_dashboard'), 1500);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'properties');
      setError('حدث خطأ أثناء إضافة العقار. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
        <h2 className="text-2xl font-bold mb-2">تمت الإضافة بنجاح!</h2>
        <p className="text-slate-500">جاري توجيهك إلى لوحة التحكم...</p>
      </div>
    );
  }

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 print:shadow-none print:border-slate-200 print:break-inside-avoid">
      <h3 className="text-lg font-black text-brand-dark border-b border-slate-100 pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, type = "text", placeholder = "", required = false, value, onChange }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input 
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:border-none print:bg-transparent print:p-0 print:font-bold" 
      />
    </div>
  );

  const SelectField = ({ label, options }: { label: string, options: string[] }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:appearance-none print:border-none print:bg-transparent print:p-0 print:font-bold">
        {options.map((opt, i) => <option key={i}>{opt}</option>)}
      </select>
    </div>
  );

  const TextAreaField = ({ label, rows = 3 }: { label: string, rows?: number }) => (
    <div className="flex flex-col gap-1 md:col-span-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <textarea 
        rows={rows}
        className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:border-none print:bg-transparent print:p-0 print:font-bold" 
      ></textarea>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24 print:bg-white print:pb-0">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm border-b border-primary/10 print:hidden">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">إضافة عقار جديد / تقرير مفصل</h2>
        <button onClick={handlePrint} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-primary" title="طباعة البيانات">
          <Icon name="print" className="text-2xl" />
        </button>
      </header>
      
      <div className="hidden print:block text-center pt-8 pb-4">
        <h1 className="text-3xl font-black text-brand-dark mb-2">تقرير تفصيلي للعقار</h1>
        <p className="text-slate-500">{new Date().toLocaleDateString('ar-SA')}</p>
      </div>

      <main className="p-4 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold print:hidden"
            >
              <Icon name="error" />
              {error}
            </motion.div>
          )}

          <Section title="البيانات العامة">
            <InputField label="اسم العقار" required value={propertyName} onChange={(e: any) => setPropertyName(e.target.value)} />
            <InputField label="الموقع / العنوان" value={location} onChange={(e: any) => setLocation(e.target.value)} />
            <InputField label="عدد الوحدات" type="number" value={units} onChange={(e: any) => setUnits(e.target.value)} />
            <InputField label="المدينة" value={city} onChange={(e: any) => setCity(e.target.value)} />
            <InputField label="الحي" value={district} onChange={(e: any) => setDistrict(e.target.value)} />
          </Section>

          <Section title="بيانات الصك والسجل العيني">
            <InputField label="رقم الصك" value={deedNumber} onChange={(e: any) => setDeedNumber(e.target.value)} />
            <InputField label="تاريخ الإصدار" type="date" value={deedDate} onChange={(e: any) => setDeedDate(e.target.value)} />
            <InputField label="جهة الإصدار" value={deedIssuer} onChange={(e: any) => setDeedIssuer(e.target.value)} />
            <InputField label="رقم المستند" value={documentNumber} onChange={(e: any) => setDocumentNumber(e.target.value)} />
            <InputField label="رقم القطعة" value={plotNumber} onChange={(e: any) => setPlotNumber(e.target.value)} />
            <InputField label="رقم المخطط" value={planNumber} onChange={(e: any) => setPlanNumber(e.target.value)} />
            <InputField label="مساحة الصك" type="number" value={deedArea} onChange={(e: any) => setDeedArea(e.target.value)} />
            <InputField label="نوع الصك" value={deedType} onChange={(e: any) => setDeedType(e.target.value)} />
            <InputField label="رقم تسجيل العيني" value={cadastralNumber} onChange={(e: any) => setCadastralNumber(e.target.value)} />
            <InputField label="تاريخ التسجيل" type="date" value={cadastralDate} onChange={(e: any) => setCadastralDate(e.target.value)} />
            <InputField label="حالة تسجيل العيني" />
          </Section>

          <Section title="بيانات العقار">
            <InputField label="المنطقة" />
            <InputField label="المدينة" />
            <InputField label="الحي" />
            <InputField label="العنوان الوطني" />
            <SelectField label="نوع المبنى" options={['سكني', 'تجاري', 'مختلط', 'أخرى']} />
            <InputField label="الغرض من الاستخدام" />
            <InputField label="عدد الطوابق" type="number" />
            <InputField label="الوحدات" type="number" />
            <InputField label="المصاعد" type="number" />
            <InputField label="المواقف" type="number" />
          </Section>

          <Section title="المرافق">
            <InputField label="مرفق 1" />
            <InputField label="مرفق 2" />
            <InputField label="مرفق 3" />
            <InputField label="مرفق 4" />
          </Section>

          <Section title="بيانات الوحدة">
            <SelectField label="نوع الوحدة" options={['شقة', 'فيلا', 'مكتب', 'معرض', 'مستودع']} />
            <InputField label="رقم الوحدة" />
            <InputField label="رقم الطابق" />
            <InputField label="المساحة" type="number" />
            <SelectField label="حالة التأثيث" options={['غير مؤثث', 'مؤثث جزئياً', 'مؤثث بالكامل']} />
            <SelectField label="خزائن مطبخ" options={['نعم', 'لا']} />
            <InputField label="عدد وحدات التكييف" type="number" />
            <TextAreaField label="تفاصيل الغرف" rows={2} />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="عداد الكهرباء 1" />
              <InputField label="عداد الكهرباء 2" />
              <InputField label="عداد الكهرباء 3" />
              <InputField label="عداد مياه" />
            </div>
          </Section>

          <Section title="بيانات المالك">
            <InputField label="اسم المالك" />
            <InputField label="رقم الهوية" />
            <InputField label="الجنسية" />
            <InputField label="نسبة الملكية" />
            <InputField label="مساحة الملكية" />
            <SelectField label="نوع المالك" options={['فرد', 'شركة', 'جهة حكومية', 'أخرى']} />
          </Section>

          <Section title="اتحاد الملاك">
            <InputField label="اسم الجمعية" />
            <InputField label="رقم التسجيل" />
            <InputField label="الرقم الموحد" />
            <InputField label="تاريخ السريان والانتهاء" />
            <SelectField label="حالة الجمعية" options={['نشطة', 'غير نشطة', 'تحت التأسيس']} />
            <InputField label="اسم رئيس الجمعية" />
            <InputField label="رقم جوال رئيس الجمعية" type="tel" />
            <InputField label="اسم مدير العقار" />
            <InputField label="رقم جوال مدير العقار" type="tel" />
          </Section>

          <Section title="نتائج التصويت والرسوم">
            <InputField label="إجمالي الرسوم" type="number" />
            <InputField label="عدد المصوتين" type="number" />
            <InputField label="نسبة القبول" />
            <InputField label="غير المصوتين" type="number" />
          </Section>

          <Section title="عقد الإيجار">
            <InputField label="رقم العقد" />
            <SelectField label="نوع العقد" options={['سكني موحد', 'تجاري موحد', 'أخرى']} />
            <InputField label="تاريخ الإبرام" type="date" />
            <InputField label="بداية ونهاية الإيجار" />
            <InputField label="مدة العقد" />
            <InputField label="قيمة الإيجار السنوي" type="number" />
            <InputField label="عدد الدفعات" type="number" />
            <InputField label="قنوات الدفع" />
          </Section>

          <Section title="بيانات المستأجر">
            <InputField label="اسم المستأجر" />
            <InputField label="الجنسية" />
            <SelectField label="نوع الهوية" options={['هوية وطنية', 'إقامة', 'جواز سفر', 'سجل تجاري']} />
            <InputField label="رقم الهوية" />
            <InputField label="الجوال" type="tel" />
            <InputField label="البريد الإلكتروني" type="email" />
          </Section>

          <Section title="الوسيط العقاري">
            <InputField label="اسم المنشأة" />
            <InputField label="السجل التجاري" />
          </Section>

          <Section title="ملاحظات">
            <TextAreaField label="ملاحظات إضافية" rows={4} />
          </Section>

          <Section title="المرافق">
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['مسبح', 'نادي رياضي', 'منطقة ألعاب أطفال', 'كاميرات مراقبة', 'حراسة أمنية', 'مواقف سيارات', 'مصعد', 'حديقة'].map(facility => (
                <label key={facility} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={facilities.includes(facility)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFacilities([...facilities, facility]);
                      } else {
                        setFacilities(facilities.filter(f => f !== facility));
                      }
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700">{facility}</span>
                </label>
              ))}
            </div>
          </Section>

          <div className="space-y-4 print:hidden">
            <label className="text-sm font-bold text-slate-700 block">صور العقار</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Icon name="delete" className="text-sm" />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-primary transition-colors">
                <Icon name="add_a_photo" className="text-3xl mb-2" />
                <span className="text-xs font-medium">اضغط لرفع الصور</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover-lift print:hidden",
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
            ) : "حفظ بيانات العقار"}
          </button>
        </form>
      </main>
    </div>
  );
};

const OwnersManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">إدارة الملاك</h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">إجمالي الملاك</p>
            <h3 className="text-xl font-bold">١٥ مالك</h3>
          </div>
          <button className="bg-primary text-white p-2 rounded-xl"><Icon name="person_add" /></button>
        </div>
        {[
          { name: 'عبد الرحمن السديري', properties: 5, phone: '٠٥٠١٢٣٤٥٦٧', status: 'نشط' },
          { name: 'شركة نجد للاستثمار', properties: 12, phone: '٠١١٤٥٦٧٨٩٠', status: 'نشط' },
          { name: 'فهد بن سلطان', properties: 3, phone: '٠٥٥٩٨٧٦٥٤٣', status: 'غير نشط' },
        ].map((owner, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Icon name="person" className="text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">{owner.name}</h4>
              <p className="text-xs text-gray-500">{owner.properties} عقارات • {owner.phone}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${owner.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{owner.status}</span>
          </div>
        ))}
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const UnitsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('الكل');
  const [typeFilter, setTypeFilter] = useState('الكل');

  const filters = ['الكل', 'شاغرة', 'مؤجرة', 'تحت الصيانة'];
  const properties = ['الكل', ...Array.from(new Set(UNITS.map(u => u.property)))];
  const types = ['الكل', ...Array.from(new Set(UNITS.map(u => u.type)))];

  const filteredUnits = UNITS.filter(unit => {
    const matchesStatus = activeFilter === 'الكل' || unit.status === activeFilter;
    const matchesProperty = propertyFilter === 'الكل' || unit.property === propertyFilter;
    const matchesType = typeFilter === 'الكل' || unit.type === typeFilter;
    const matchesSearch = unit.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          unit.id.toString().includes(searchQuery) ||
                          unit.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProperty && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">إدارة الوحدات</h2>
      </header>
      <main className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="ابحث عن وحدة برقمها، نوعها أو اسم العقار..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <select 
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option disabled value="الكل">العقار</option>
            {properties.map(p => <option key={p} value={p}>{p === 'الكل' ? 'كل العقارات' : p}</option>)}
          </select>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option disabled value="الكل">النوع</option>
            {types.map(t => <option key={t} value={t}>{t === 'الكل' ? 'كل الأنواع' : t}</option>)}
          </select>
        </div>

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
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">إدارة العقود</h2>
      </header>
      <main className="p-4 space-y-4">
        {[
          { tenant: 'محمد العتيبي', unit: 'شقة ١٠٢', end: '٢٠٢٤/١٢/٣١', status: 'ساري' },
          { tenant: 'شركة الأفق', unit: 'مكتب ٥', end: '٢٠٢٤/٠٦/١٥', status: 'ينتهي قريباً' },
          { tenant: 'سارة العمري', unit: 'فيلا ١٢', end: '٢٠٢٥/٠١/٢٠', status: 'ساري' },
        ].map((contract, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><Icon name="description" /></div>
                <div>
                  <h4 className="font-bold">{contract.tenant}</h4>
                  <p className="text-xs text-gray-500">{contract.unit}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${contract.status === 'ساري' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{contract.status}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <p className="text-[10px] text-gray-400">تاريخ الانتهاء: {contract.end}</p>
              <button className="text-primary text-xs font-bold flex items-center gap-1">تجديد <Icon name="refresh" className="text-xs" /></button>
            </div>
          </div>
        ))}
      </main>
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
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">مركز التنبيهات</h2>
      </header>
      <main className="p-4 space-y-3">
        {[
          { title: 'تذكير: عقد ينتهي قريباً', desc: 'عقد المستأجر محمد العتيبي ينتهي خلال 30 يوم', time: 'منذ ساعة', icon: 'event_busy', color: 'text-red-600', bg: 'bg-red-50' },
          { title: 'تم استلام دفعة جديدة', desc: 'تم تحصيل إيجار شقة 102 بنجاح', time: 'منذ 3 ساعات', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'طلب صيانة مكتمل', desc: 'تم إغلاق بلاغ صيانة المكيف في فيلا 7', time: 'أمس', icon: 'task_alt', color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'تنبيه أمان', desc: 'تم تسجيل دخول جديد لحسابك من جهاز غير معروف', time: 'أمس', icon: 'security', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((notif, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
              <Icon name={notif.icon} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm">{notif.title}</h4>
                <span className="text-[10px] text-gray-400">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
            </div>
          </div>
        ))}
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
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">أداء الفنيين</h2>
      </header>
      <main className="p-4 space-y-4">
        {[
          { name: 'أحمد الكهربائي', tasks: 24, rating: 4.8, status: 'متاح' },
          { name: 'شركة السباكة الذهبية', tasks: 18, rating: 4.5, status: 'مشغول' },
          { name: 'فني تكييف النخبة', tasks: 32, rating: 4.9, status: 'متاح' },
        ].map((tech, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Icon name="person" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{tech.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400">{tech.tasks} مهمة مكتملة</span>
                <span className="text-[10px] text-yellow-500 flex items-center gap-0.5"><Icon name="star" className="text-[12px] filled" /> {tech.rating}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tech.status === 'متاح' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{tech.status}</span>
          </div>
        ))}
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
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('reports')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">الأرشيف العقاري</h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-3 text-gray-400" />
          <input className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm" placeholder="بحث في الوثائق المؤرشفة..." type="text" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'صكوك الملكية', count: 24, icon: 'description' },
            { title: 'عقود الإيجار', count: 158, icon: 'history_edu' },
            { title: 'فواتير الصيانة', count: 89, icon: 'receipt_long' },
            { title: 'مخططات هندسية', count: 12, icon: 'architecture' },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3"><Icon name={cat.icon} /></div>
              <h4 className="font-bold text-sm">{cat.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{cat.count} ملف</p>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const TenantsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button onClick={() => onSelect('manager_dashboard')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">إدارة المستأجرين</h2>
        <button className="p-2 bg-primary/10 text-primary rounded-full">
          <Icon name="person_add" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-3 text-gray-400" />
          <input className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm" placeholder="بحث عن مستأجر..." type="text" />
        </div>
        <div className="space-y-3">
          {[
            { name: 'محمد العتيبي', unit: 'شقة ٤٠٢', property: 'برج الياسمين', status: 'active', paid: true },
            { name: 'سارة القحطاني', unit: 'فيلا ٧', property: 'حي النرجس', status: 'active', paid: false },
            { name: 'عبدالله الشمري', unit: 'مكتب ١٠١', property: 'برج النخيل', status: 'expiring', paid: true },
          ].map((tenant, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  {tenant.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tenant.name}</h4>
                  <p className="text-[10px] text-gray-400">{tenant.property} - {tenant.unit}</p>
                </div>
              </div>
              <div className="text-left">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tenant.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {tenant.paid ? 'مدفوع' : 'متأخر'}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">عرض الملف</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};

const VendorsManagementScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
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
        <div className="grid grid-cols-1 gap-3">
          {[
            { name: 'شركة التكييف المتقدمة', service: 'صيانة تكييف', rating: 4.8, status: 'available', phone: '966500000001' },
            { name: 'الكهربائي المتميز', service: 'أعمال كهرباء', rating: 4.5, status: 'busy', phone: '966500000002' },
            { name: 'سباكة الخليج', service: 'سباكة وعزل', rating: 4.2, status: 'available', phone: '966500000003' },
          ].map((vendor, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="engineering" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{vendor.name}</h4>
                  <p className="text-[10px] text-gray-400">{vendor.service}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="star" className="text-[10px] text-amber-400" filled />
                    <span className="text-[10px] font-bold">{vendor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${vendor.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {vendor.status === 'available' ? 'متاح' : 'مشغول'}
                </span>
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://wa.me/${vendor.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="تواصل عبر واتساب"
                  >
                    <Icon name="chat" className="text-sm" />
                  </a>
                  <button className="text-[10px] text-primary font-bold px-3 py-1.5 bg-primary/5 rounded-lg">طلب خدمة</button>
                </div>
              </div>
            </div>
          ))}
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

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center p-4">
        <Icon name="error_outline" className="text-4xl text-slate-400 mb-4" />
        <p className="text-slate-500 mb-4">لم يتم تحديد عقار</p>
        <button onClick={() => onSelect('manager_dashboard')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

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
                  <span className="font-bold font-mono">{property.deedNumber || 'غير متوفر'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">المساحة الإجمالية:</span>
                  <span className="font-bold">{property.deedArea || 'غير متوفر'}</span>
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

const PropertyReportScreen = ({ onSelect, property, properties }: { onSelect: (v: View) => void, property: any, properties: any[] }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center p-4">
        <Icon name="error_outline" className="text-4xl text-slate-400 mb-4" />
        <p className="text-slate-500 mb-4">لم يتم تحديد عقار</p>
        <button onClick={() => onSelect('manager_dashboard')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

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
                {properties.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => {
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
              { label: 'رقم الصك', value: property.deedNumber || 'غير متوفر' },
              { label: 'تاريخ الإصدار', value: property.deedDate || 'غير متوفر' },
              { label: 'جهة الإصدار', value: property.deedIssuer || 'غير متوفر' },
              { label: 'رقم المستند', value: property.documentNumber || 'غير متوفر' },
              { label: 'رقم القطعة', value: property.plotNumber || 'غير متوفر' },
              { label: 'رقم المخطط', value: property.planNumber || 'غير متوفر' },
              { label: 'مساحة الصك', value: property.deedArea || 'غير متوفر' },
              { label: 'نوع الصك', value: property.deedType || 'غير متوفر' },
              { label: 'رقم تسجيل العيني', value: property.cadastralNumber || 'غير متوفر' },
              { label: 'تاريخ التسجيل', value: property.cadastralDate || 'غير متوفر' },
              { label: 'حالة تسجيل العيني', value: property.cadastralStatus || 'غير متوفر' },
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
              { label: 'المنطقة', value: property.region || 'غير متوفر' },
              { label: 'المدينة', value: property.city || property.location.split(' - ')[0] || 'غير متوفر' },
              { label: 'الحي', value: property.district || property.location.split(' - ')[1] || 'غير متوفر' },
              { label: 'العنوان الوطني', value: property.nationalAddress || 'غير متوفر' },
              { label: 'نوع المبنى', value: property.buildingType || property.type || 'غير متوفر' },
              { label: 'الغرض من الاستخدام', value: property.usagePurpose || 'غير متوفر' },
              { label: 'عدد الطوابق', value: property.floorsCount || 'غير متوفر' },
              { label: 'عدد الوحدات', value: property.units ? property.units + ' وحدة' : 'غير متوفر' },
              { label: 'عدد المصاعد', value: property.elevatorsCount || 'غير متوفر' },
              { label: 'عدد المواقف', value: property.parkingCount || 'غير متوفر' },
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
              {(property.facilities || ['مسبح أولمبي', 'نادي رياضي متكامل', 'منطقة ألعاب أطفال', 'حراسة أمنية ٢٤/٧']).map((service: string, i: number) => (
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
              { label: 'عداد مياه', value: 'مشترك' },
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
                { label: 'دورات مياه', value: '٣' },
              ].map((room, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 mb-1">{room.label}</p>
                  <p className="text-lg font-black text-brand-dark">{room.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">أرقام عدادات الكهرباء</h4>
            <div className="flex flex-wrap gap-2">
              {['١٠٢٩٣٨٤٧٥٦', '٥٦٤٧٣٨٢٩١٠', '٩٨٧٦٥٤٣٢١٠'].map((meter, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
                  <Icon name="bolt" className="text-sm text-amber-500" />
                  {meter}
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
                  { label: 'الاسم', value: property.ownerName || 'عبد الرحمن السديري' },
                  { label: 'رقم الهوية', value: property.ownerId || '١٠٢٣٤٥٦٧٨٩' },
                  { label: 'رقم الجوال', value: property.ownerPhone || '٠٥٠٠٠٠٠٠٠٠' },
                  { label: 'البريد الإلكتروني', value: property.ownerEmail || 'info@example.com' },
                  { label: 'الجنسية', value: 'سعودي' },
                  { label: 'نسبة الملكية', value: '١٠٠٪' },
                  { label: 'مساحة الملكية', value: property.deedArea || '٥٠٠ م٢' },
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
                  { label: 'اسم رئيس الجمعية', value: 'خالد العبدالله' },
                  { label: 'رقم جوال رئيس الجمعية', value: '٠٥٠١١٢٢٣٣٤' },
                  { label: 'اسم مدير العقار', value: 'سعد القحطاني' },
                  { label: 'رقم جوال مدير العقار', value: '٠٥٥٤٤٣٣٢٢١' },
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

// --- Main App ---

import { collection, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (window as any).selectProperty = setSelectedProperty;
    return () => {
      delete (window as any).selectProperty;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser?.email === 'aliayashi522@gmail.com') {
        setCurrentView('manager_dashboard');
      } else {
        setCurrentView('welcome');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email === 'aliayashi522@gmail.com') {
      const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
        const propsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propsData);
        if (propsData.length > 0 && !selectedProperty) {
          setSelectedProperty(propsData[0]);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'properties');
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleSelectProperty = (view: View, property: any) => {
    setSelectedProperty(property);
    setCurrentView(view);
  };

  useEffect(() => {
    (window as any).selectProperty = (p: any) => setSelectedProperty(p);
    return () => { delete (window as any).selectProperty; };
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'welcome': return <WelcomeScreen onSelect={setCurrentView} />;
      case 'manager_dashboard': return <ManagerDashboard onSelect={setCurrentView} onSelectProperty={handleSelectProperty} properties={properties} />;
      case 'accounting': return <AccountingScreen onSelect={setCurrentView} />;
      case 'invoices': return <InvoicesScreen onSelect={setCurrentView} />;
      case 'maintenance': return <MaintenanceScreen onSelect={setCurrentView} />;
      case 'property_details': return <PropertyDetailsScreen onSelect={setCurrentView} property={selectedProperty} />;
      case 'new_maintenance': return <NewMaintenanceRequestScreen onSelect={setCurrentView} />;
      case 'tenant_dashboard': return <TenantDashboard onSelect={setCurrentView} />;
      case 'settings': return <SettingsScreen onSelect={setCurrentView} />;
      case 'reports': return <ReportsScreen onSelect={setCurrentView} />;
      case 'add_property': return <AddPropertyScreen onSelect={setCurrentView} properties={properties} />;
      case 'owners': return <OwnersManagementScreen onSelect={setCurrentView} />;
      case 'units': return <UnitsManagementScreen onSelect={setCurrentView} />;
      case 'contracts': return <ContractsManagementScreen onSelect={setCurrentView} />;
      case 'support': return <SupportScreen onSelect={setCurrentView} />;
      case 'docs': return <TechnicalDocsScreen onSelect={setCurrentView} />;
      case 'notifications': return <NotificationsScreen onSelect={setCurrentView} />;
      case 'financial_report': return <FinancialReportScreen onSelect={setCurrentView} />;
      case 'property_report': return <PropertyReportScreen onSelect={setCurrentView} property={selectedProperty} properties={properties} />;
      case 'official_print': return <OfficialPrintScreen onSelect={setCurrentView} property={selectedProperty} />;
      case 'zakat_tax': return <ZakatTaxScreen onSelect={setCurrentView} />;
      case 'ejar_integration': return <EjarIntegrationScreen onSelect={setCurrentView} />;
      case 'tech_performance': return <TechPerformanceScreen onSelect={setCurrentView} />;
      case 'dev_center': return <DeveloperCenterScreen onSelect={setCurrentView} />;
      case 'archive': return <ArchiveScreen onSelect={setCurrentView} />;
      case 'tenant_satisfaction': return <TenantSatisfactionReportScreen onSelect={setCurrentView} />;
      case 'tenants_management': return <TenantsManagementScreen onSelect={setCurrentView} />;
      case 'vendors_management': return <VendorsManagementScreen onSelect={setCurrentView} />;
      case 'asset_management': return <AssetManagementScreen onSelect={setCurrentView} />;
      default: return <WelcomeScreen onSelect={setCurrentView} />;
    }
  };

  return (
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
  );
}
