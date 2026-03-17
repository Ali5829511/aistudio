import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend, AreaChart, Area,
} from "recharts";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const OwnerDashboard = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const updateMaintenanceStatus = async (id: string, status: string) => { console.log('updateMaintenanceStatus', id, status); };
  const recordPayment = async (tenantId: string) => { console.log('recordPayment', tenantId); };
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
