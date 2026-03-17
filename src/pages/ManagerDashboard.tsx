import React, { useState } from "react";
import { motion } from "motion/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  BarChart, Bar, Legend,
} from "recharts";
import { View } from "../types";
import { toArabicDigits } from "../utils";
import { Icon, PropertyCard } from "../components/shared";
import { MAINTENANCE_REQUESTS } from "../constants/data";

const REVENUE_DATA = [
  { name: "يناير", value: 120000, prev: 98000 },
  { name: "فبراير", value: 135000, prev: 105000 },
  { name: "مارس",  value: 118000, prev: 112000 },
  { name: "أبريل", value: 142000, prev: 120000 },
  { name: "مايو",  value: 155000, prev: 138000 },
  { name: "يونيو", value: 148000, prev: 145000 },
];

const KPI_CARDS = [
  {
    label: "إجمالي التحصيل",
    value: "١٤٥,٥٠٠",
    unit: "ر.س",
    icon: "payments",
    change: "+١٢.٥٪",
    up: true,
    color: "bg-primary",
    textColor: "text-white",
  },
  {
    label: "إجمالي العقارات",
    value: "١٥",
    unit: "عقار",
    icon: "apartment",
    change: "+٢",
    up: true,
    color: "bg-white",
    textColor: "text-slate-800",
  },
  {
    label: "الوحدات المؤجرة",
    value: "١٤٢",
    unit: "وحدة",
    icon: "door_front",
    change: "٩٢٪ إشغال",
    up: true,
    color: "bg-white",
    textColor: "text-slate-800",
  },
  {
    label: "المستأجرون",
    value: "٨٩",
    unit: "مستأجر",
    icon: "people",
    change: "+٤ جديد",
    up: true,
    color: "bg-white",
    textColor: "text-slate-800",
  },
  {
    label: "طلبات الصيانة",
    value: "٦",
    unit: "طلب",
    icon: "construction",
    change: "٢ عاجل",
    up: false,
    color: "bg-white",
    textColor: "text-slate-800",
  },
  {
    label: "المتأخرات",
    value: "١٨,٢٠٠",
    unit: "ر.س",
    icon: "warning",
    change: "-٣.١٪",
    up: true,
    color: "bg-white",
    textColor: "text-slate-800",
  },
];

const QUICK_ACTIONS = [
  { label: "إضافة عقار",    icon: "add_home",      view: "add_property"  as View, color: "brand-gradient text-white" },
  { label: "عقد إيجار",     icon: "history_edu",   view: "contracts"     as View, color: "bg-emerald-600 text-white" },
  { label: "فاتورة جديدة",  icon: "receipt_long",  view: "invoices"      as View, color: "bg-amber-500 text-white"  },
  { label: "طلب صيانة",     icon: "build",         view: "new_maintenance" as View, color: "bg-slate-700 text-white" },
  { label: "تقرير مالي",    icon: "bar_chart",     view: "financial_report" as View, color: "bg-purple-600 text-white" },
  { label: "المساعد الذكي", icon: "smart_toy",     view: "ai_assistant"  as View, color: "bg-sky-600 text-white"    },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  new:         { label: "جديد",        cls: "badge-info"    },
  in_progress: { label: "جاري",        cls: "badge-warning" },
  completed:   { label: "مكتمل",       cls: "badge-success" },
};

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

  const filteredProperties = properties.filter(
    (prop) =>
      prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`kpi-card flex flex-col gap-3 ${kpi.color === "bg-primary" ? "bg-primary text-white" : "bg-white"}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`size-10 rounded-xl flex items-center justify-center ${
                  kpi.color === "bg-primary"
                    ? "bg-white/20"
                    : "bg-primary-50"
                }`}
              >
                <Icon
                  name={kpi.icon}
                  className={`text-xl ${kpi.color === "bg-primary" ? "text-white" : "text-primary"}`}
                  filled
                />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  kpi.color === "bg-primary"
                    ? "bg-white/20 text-white"
                    : kpi.up
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {kpi.change}
              </span>
            </div>
            <div>
              <p
                className={`text-xs font-medium mb-1 ${
                  kpi.color === "bg-primary" ? "text-blue-200" : "text-slate-500"
                }`}
              >
                {kpi.label}
              </p>
              <p
                className={`text-2xl font-bold ${
                  kpi.color === "bg-primary" ? "text-white" : "text-slate-800"
                }`}
              >
                {kpi.value}{" "}
                <span className="text-sm font-medium opacity-70">{kpi.unit}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">تحليل الإيرادات</h3>
              <p className="text-xs text-slate-400 mt-0.5">مقارنة الأداء الشهري</p>
            </div>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary inline-block" />
                هذا العام
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-slate-300 inline-block" />
                العام الماضي
              </span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1d4ed8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} reversed />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,.12)", fontSize: "12px" }}
                  formatter={(val: number) => [`${val.toLocaleString()} ر.س`]}
                />
                <Area type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2.5} fill="url(#gradBlue)" dot={false} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="prev"  stroke="#94a3b8" strokeWidth={1.5} fill="url(#gradGray)" dot={false} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy donut */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 card-shadow flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">نسبة الإشغال</h3>
            <p className="text-xs text-slate-400 mt-0.5">توزيع الوحدات</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">٩٢٪</span>
              <span className="text-xs text-slate-400">مشغولة</span>
            </div>
            <ResponsiveContainer width="100%" height={160} minWidth={0}>
              <PieChart>
                <Pie
                  data={[{ value: 92 }, { value: 8 }]}
                  innerRadius={52} outerRadius={70}
                  paddingAngle={4} dataKey="value" stroke="none"
                >
                  <Cell fill="#1d4ed8" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {[
              { label: "وحدات مؤجرة", value: "١٤٢", color: "bg-primary" },
              { label: "وحدات شاغرة",  value: "١٢",  color: "bg-slate-200" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${row.color}`} />
                  <span className="text-slate-500">{row.label}</span>
                </div>
                <span className="font-bold text-slate-700">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">إجراءات سريعة</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(action.view)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium text-xs transition-all shadow-sm hover:shadow-md ${action.color}`}
            >
              <Icon name={action.icon} className="text-2xl" filled />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Maintenance + Properties ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Maintenance */}
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">آخر طلبات الصيانة</h3>
            <button
              onClick={() => onSelect("maintenance")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              عرض الكل
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {MAINTENANCE_REQUESTS.slice(0, 4).map((req) => {
              const s = STATUS_MAP[req.status] ?? { label: req.status, cls: "badge-neutral" };
              return (
                <div key={req.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="size-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="construction" className="text-slate-400 text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{req.property}</p>
                    <p className="text-xs text-slate-400 truncate">{req.unit} · {req.type}</p>
                  </div>
                  <span className={s.cls}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">العقارات</h3>
            <button
              onClick={() => onSelect("property_details")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              عرض الكل
            </button>
          </div>
          {/* Search */}
          <div className="px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <Icon name="search" className="text-slate-400 text-base" />
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400 text-slate-700"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {filteredProperties.length > 0 ? (
              filteredProperties.slice(0, 8).map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => onSelectProperty("property_details", prop)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50/40 transition-colors text-right"
                >
                  <div className="size-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="apartment" className="text-primary text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{prop.name}</p>
                    <p className="text-xs text-slate-400 truncate">{prop.location}</p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                    {toArabicDigits(prop.units ?? 0)} وحدة
                  </span>
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                لا توجد عقارات مطابقة
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
