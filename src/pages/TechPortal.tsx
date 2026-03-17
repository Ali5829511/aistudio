import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const TechPortal = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const updateMaintenanceStatus = async (id: string, status: string) => { console.log('updateMaintenanceStatus', id, status); };
  const recordPayment = async (tenantId: string) => { console.log('recordPayment', tenantId); };
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
