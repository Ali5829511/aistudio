import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const ZakatTaxScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (
    <ReportLayout title="الزكاة والضريبة" onBack={() => onSelect("reports")}>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-dark">إقرار الربع الحالي</h3>
          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full print:border print:border-orange-200">
            بانتظار التقديم
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">
              ضريبة القيمة المضافة (15%)
            </span>
            <span className="text-sm font-bold text-brand-dark">
              45,200 ر.س
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">الزكاة التقديرية</span>
            <span className="text-sm font-bold text-brand-dark">
              12,800 ر.س
            </span>
          </div>
          <div className="pt-4 border-t border-gray-50 flex justify-between">
            <span className="font-bold text-brand-dark">الإجمالي المستحق</span>
            <span className="font-bold text-primary text-lg">58,000 ر.س</span>
          </div>
        </div>
      </div>
      <button className="w-full py-4 bg-primary text-brand-dark font-black rounded-2xl shadow-lg shadow-primary/20 print:hidden">
        تقديم الإقرار الضريبي
      </button>
    </ReportLayout>
  );
};
