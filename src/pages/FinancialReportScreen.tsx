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

export const FinancialReportScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (
    <ReportLayout
      title="التقرير المالي السنوي"
      onBack={() => onSelect("reports")}
    >
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:border-none print:shadow-none">
        <p className="text-xs text-gray-500 mb-1">إجمالي الأرباح لعام 2023</p>
        <h3 className="text-3xl font-extrabold text-brand-dark">
          1,245,000 <span className="text-sm font-normal">ر.س</span>
        </h3>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden print:hidden">
          <div className="h-full bg-primary w-3/4"></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          تم تحصيل 75% من الهدف السنوي
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-brand-dark">ملخص الأرباع</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              label: "الربع الأول",
              val: "310,000",
              trend: "+5%",
              color: "text-emerald-500",
            },
            {
              label: "الربع الثاني",
              val: "285,000",
              trend: "-2%",
              color: "text-rose-500",
            },
            {
              label: "الربع الثالث",
              val: "340,000",
              trend: "+8%",
              color: "text-emerald-500",
            },
            {
              label: "الربع الرابع",
              val: "310,000",
              trend: "+4%",
              color: "text-emerald-500",
            },
          ].map((q, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between print:border-slate-200"
            >
              <span className="text-sm font-bold">{q.label}</span>
              <div className="text-left">
                <p className="text-sm font-bold text-brand-dark">{q.val} ر.س</p>
                <span className={`text-[10px] font-bold ${q.color}`}>
                  {q.trend}
                </span>
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
                  { name: "إيجارات سكنية", value: 65 },
                  { name: "إيجارات تجارية", value: 25 },
                  { name: "رسوم خدمات", value: 10 },
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
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ReportLayout>
  );
};
