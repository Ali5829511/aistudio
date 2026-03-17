import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend, AreaChart, Area,
} from "recharts";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const ManagerDashboard = ({
  onSelect,
  onSelectProperty,
  properties,
}: {
  onSelect: (v: View) => void;
  onSelectProperty: (v: View, p: any) => void;
  properties: any[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const chartData = [
    { name: "يناير", value: 4000 },
    { name: "فبراير", value: 3000 },
    { name: "مارس", value: 2000 },
    { name: "أبريل", value: 2780 },
    { name: "مايو", value: 1890 },
    { name: "يونيو", value: 2390 },
  ];

  const filteredProperties = properties.filter(
    (prop) =>
      prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <h1 className="text-lg font-black leading-none text-white tracking-tight">
              رمز <span className="text-primary">الإبداع</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
              Property Management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect("notifications")}
            className="relative p-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all"
          >
            <Icon name="notifications" className="text-xl" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-brand-dark"></span>
          </button>
          <button
            onClick={() => onSelect("welcome")}
            className="p-1 rounded-xl border border-white/10 overflow-hidden"
          >
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
            <h2 className="text-3xl font-black text-brand-dark tracking-tight">
              لوحة التحكم
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              نظرة عامة على أداء محفظتك العقارية
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">
              اليوم
            </button>
            <button className="px-4 py-1.5 text-slate-500 rounded-lg text-xs font-bold">
              الأسبوع
            </button>
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
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
                  إجمالي التحصيل المالي
                </p>
                <h3 className="text-4xl font-black text-white tracking-tighter">
                  ١٤٥,٥٠٠{" "}
                  <span className="text-lg font-bold text-primary">ر.س</span>
                </h3>
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
              <p className="text-[10px] text-slate-500 font-bold">
                مقارنة بالشهر الماضي
              </p>
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
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                إجمالي العقارات
              </p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">
                {toArabicDigits(properties.length)}
              </h3>
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
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                المستأجرين
              </p>
              <h3 className="text-3xl font-black text-brand-dark tracking-tighter">
                ٨٩
              </h3>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-brand-dark">
                  تحليل الإيرادات
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  معدل النمو الشهري للتحصيل
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-bold text-slate-500">
                    الإيرادات
                  </span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                    reversed
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      padding: "12px 20px",
                    }}
                    labelStyle={{
                      fontWeight: "900",
                      color: "#121212",
                      marginBottom: "4px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#C5A059"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      fill: "#C5A059",
                      strokeWidth: 3,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-black text-brand-dark mb-6">
              توزيع الإشغال
            </h3>
            <div className="flex-grow flex items-center justify-center relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-brand-dark">٩٢٪</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  مشغول
                </span>
              </div>
              <ResponsiveContainer width="100%" height="200" minWidth={0}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "مشغول", value: 92 },
                      { name: "شاغر", value: 8 },
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
                  <span className="text-xs font-bold text-slate-600">
                    وحدات مؤجرة
                  </span>
                </div>
                <span className="text-xs font-black text-brand-dark">١٤٢</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-slate-300"></div>
                  <span className="text-xs font-bold text-slate-600">
                    وحدات شاغرة
                  </span>
                </div>
                <span className="text-xs font-black text-brand-dark">١٢</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">
              إجراءات سريعة
            </h3>
            <div className="h-px flex-grow mx-6 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "إضافة عقار",
                icon: "add_home",
                color: "gold-gradient text-brand-dark",
                view: "add_property",
              },
              {
                label: "إدارة العقود",
                icon: "history_edu",
                color: "bg-brand-dark text-white",
                view: "contracts",
              },
              {
                label: "فاتورة جديدة",
                icon: "receipt_long",
                color: "bg-white border-slate-100 text-slate-600",
                view: "invoices",
              },
              {
                label: "طلب صيانة",
                icon: "build",
                color: "bg-white border-slate-100 text-slate-600",
                view: "new_maintenance",
              },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(action.view as View)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all",
                  action.color,
                )}
              >
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Icon name={action.icon} className="text-xl" />
                </div>
                <span className="text-xs font-black tracking-tight">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-dark">العقارات</h3>
            <button
              onClick={() => onSelect("property_details")}
              className="text-primary text-xs font-black uppercase tracking-widest"
            >
              عرض الكل
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icon
              name="search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
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
              filteredProperties
                .slice(0, 6)
                .map((prop) => (
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
