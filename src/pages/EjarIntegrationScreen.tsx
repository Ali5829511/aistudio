import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const EjarIntegrationScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (
    <ReportLayout title="تكامل منصة إيجار" onBack={() => onSelect("reports")}>
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
          { label: "العقود المزامنة", val: "145" },
          { label: "بانتظار المزامنة", val: "3" },
          { label: "أخطاء المزامنة", val: "0" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between print:border-slate-200"
          >
            <span className="text-sm font-medium text-slate-600">
              {stat.label}
            </span>
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
