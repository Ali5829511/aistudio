import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const ArchiveScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        <div className="relative">
          <Icon
            name="search"
            className="absolute right-3 top-3 text-gray-400"
          />
          <input
            className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm"
            placeholder="بحث في الوثائق المؤرشفة..."
            type="text"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "صكوك الملكية", count: 24, icon: "description" },
            { title: "عقود الإيجار", count: 158, icon: "history_edu" },
            { title: "فواتير الصيانة", count: 89, icon: "receipt_long" },
            { title: "مخططات هندسية", count: 12, icon: "architecture" },
          ].map((cat, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                <Icon name={cat.icon} />
              </div>
              <h4 className="font-bold text-sm">{cat.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{cat.count} ملف</p>
            </div>
          ))}
        </div>
      </div>
  );
};
