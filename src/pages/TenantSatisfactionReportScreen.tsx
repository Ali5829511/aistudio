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

export const TenantSatisfactionReportScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  const satisfactionData = [
    { name: "النظافة", value: 4.8 },
    { name: "الصيانة", value: 4.2 },
    { name: "الأمان", value: 4.9 },
    { name: "المرافق", value: 4.5 },
    { name: "التواصل", value: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button
          onClick={() => onSelect("reports")}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">
          رضا المستأجرين
        </h2>
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
              <BarChart
                data={satisfactionData}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: "bold", fill: "#64748b" }}
                  width={60}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {satisfactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#f2cc0d" : "#2d2d3a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              إجمالي التقييمات
            </p>
            <p className="text-2xl font-black text-brand-dark">١,٢٤٠</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              نسبة الاستجابة
            </p>
            <p className="text-2xl font-black text-emerald-500">٨٥٪</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">أحدث الملاحظات</h3>
          <div className="space-y-4">
            {[
              {
                user: "محمد س.",
                comment: "خدمة الصيانة سريعة جداً وممتازة.",
                rating: 5,
              },
              {
                user: "سارة أ.",
                comment: "المرافق نظيفة دائماً، شكراً لكم.",
                rating: 5,
              },
              {
                user: "خالد م.",
                comment: "نحتاج لزيادة عدد مواقف السيارات.",
                rating: 3,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0"
              >
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
                            className={cn(
                              "text-[10px]",
                              star < item.rating
                                ? "text-amber-400"
                                : "text-slate-200",
                            )}
                            filled={star < item.rating}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.comment}
                  </p>
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
