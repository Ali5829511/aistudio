import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const AssetManagementScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm border-b border-primary/10">
        <button
          onClick={() => onSelect("manager_dashboard")}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">
          سجل الأصول والمرافق
        </h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm opacity-80 mb-1">
              إجمالي قيمة الأصول المسجلة
            </h3>
            <h2 className="text-3xl font-black">
              ١,٢٥٠,٠٠٠ <span className="text-sm font-normal">ر.س</span>
            </h2>
          </div>
          <Icon
            name="inventory"
            className="absolute -bottom-4 -left-4 text-8xl opacity-10 rotate-12"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "أجهزة التكييف", count: 145, icon: "ac_unit" },
            { title: "المصاعد", count: 12, icon: "elevator" },
            { title: "أنظمة الحريق", count: 8, icon: "fire_extinguisher" },
            { title: "المولدات", count: 4, icon: "electric_bolt" },
          ].map((asset, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              <Icon name={asset.icon} className="text-primary mb-2" />
              <h4 className="font-bold text-sm">{asset.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">
                {asset.count} وحدة مسجلة
              </p>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
