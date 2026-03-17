import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend, AreaChart, Area,
} from "recharts";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const AccountingScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const pieData = [
    { name: "إيجارات", value: 70, color: "#C5A059" },
    { name: "رسوم خدمات", value: 20, color: "#121212" },
    { name: "أخرى", value: 10, color: "#94a3b8" },
  ];

  return (


      <div className="p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full rounded-[2.5rem] p-8 dark-gradient text-white shadow-2xl relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon
                  name="account_balance_wallet"
                  className="text-lg"
                  filled
                />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">
                الرصيد المتاح
              </p>
            </div>
            <h3 className="text-5xl font-black tracking-tighter mt-2">
              50,000{" "}
              <span className="text-xl font-bold text-primary/60">ر.س</span>
            </h3>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2 text-[10px] bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm font-bold text-slate-400">
                <span>آخر تحديث: اليوم، ٩:٣٠ ص</span>
              </div>
              <button className="text-xs font-black text-primary underline underline-offset-4">
                كشف حساب
              </button>
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
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                إجمالي الدخل
              </p>
              <p className="text-brand-dark text-2xl font-black tracking-tighter">
                12,000{" "}
                <span className="text-xs font-bold text-slate-400">ر.س</span>
              </p>
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
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                إجمالي المصروفات
              </p>
              <p className="text-brand-dark text-2xl font-black tracking-tighter">
                3,500{" "}
                <span className="text-xs font-bold text-slate-400">ر.س</span>
              </p>
            </div>
          </motion.div>
        </div>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-brand-dark mb-8">
            توزيع مصادر الدخل
          </h3>
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
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs font-bold text-slate-600">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-brand-dark">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-brand-dark">
              آخر المعاملات
            </h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest">
              فلترة
            </button>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {[
              {
                title: "إيجار شقة ١٠٢",
                subtitle: "محمد عبدالله • حوالة بنكية",
                amount: "+ 4,500 ر.س",
                time: "١٠:٣٠ ص",
                color: "text-emerald-600",
                icon: "home_work",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                title: "صيانة تكييف",
                subtitle: "شركة الصيانة السريعة • فيزا",
                amount: "- 350 ر.س",
                time: "٠٩:١٥ ص",
                color: "text-rose-600",
                icon: "build",
                iconBg: "bg-rose-50",
                iconColor: "text-rose-600",
              },
              {
                title: "رسوم خدمات برج بيان",
                subtitle: "سداد نقدي • مكتب الاستقبال",
                amount: "+ 1,200 ر.س",
                time: "أمس",
                color: "text-emerald-600",
                icon: "payments",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ bg: "#F8FAFC" }}
                className="flex items-center justify-between p-6 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`size-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}
                  >
                    <Icon name={item.icon} className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-black text-brand-dark">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-base font-black ${item.color}`}>
                    {item.amount}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};
