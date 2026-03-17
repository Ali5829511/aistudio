import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const TenantDashboard = ({ onSelect }: { onSelect: (v: View) => void }) => {
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
              <p className="text-[10px] text-slate-400 font-bold">
                مستأجر لدى رمز الإبداع
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelect("welcome")}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-dark text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border-2 border-primary/10"
        >
          <div className="relative z-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
              الإيجار القادم
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black">4,500</span>
              <span className="text-sm font-bold text-slate-400">
                ريال سعودي
              </span>
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
            <span className="size-1.5 bg-primary rounded-full"></span> إجراءات
            سريعة
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "دفع الإيجار", icon: "payments" },
              {
                label: "طلب صيانة",
                icon: "construction",
                view: "new_maintenance",
              },
              { label: "تواصل معنا", icon: "support_agent", view: "support" },
            ].map((act, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => act.view && onSelect(act.view as View)}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 hover:border-primary transition-colors shadow-sm"
              >
                <div className="size-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                  <Icon name={act.icon} />
                </div>
                <span className="text-[11px] font-bold">{act.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span className="size-1.5 bg-primary rounded-full"></span> حالة
              طلبات الصيانة
            </h2>
            <button
              onClick={() => onSelect("maintenance")}
              className="text-xs text-primary font-bold"
            >
              عرض الكل
            </button>
          </div>
          <motion.div
            whileHover={{ x: -4 }}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <Icon name="faucet" />
              </div>
              <div>
                <p className="text-sm font-bold">إصلاح صنبور المياه</p>
                <p className="text-[11px] text-slate-500">تم تقديمه: 24 مايو</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
              قيد التنفيذ
            </span>
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
