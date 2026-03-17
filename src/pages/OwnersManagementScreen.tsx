import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const OwnersManagementScreen = ({
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
          إدارة الملاك
        </h2>
      </header>
      <main className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">إجمالي الملاك</p>
            <h3 className="text-xl font-bold">١٥ مالك</h3>
          </div>
          <button className="bg-primary text-white p-2 rounded-xl">
            <Icon name="person_add" />
          </button>
        </div>
        {[
          {
            name: "عبد الرحمن السديري",
            properties: 5,
            phone: "٠٥٠١٢٣٤٥٦٧",
            status: "نشط",
          },
          {
            name: "شركة نجد للاستثمار",
            properties: 12,
            phone: "٠١١٤٥٦٧٨٩٠",
            status: "نشط",
          },
          {
            name: "فهد بن سلطان",
            properties: 3,
            phone: "٠٥٥٩٨٧٦٥٤٣",
            status: "غير نشط",
          },
        ].map((owner, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Icon name="person" className="text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">{owner.name}</h4>
              <p className="text-xs text-gray-500">
                {owner.properties} عقارات • {owner.phone}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full ${owner.status === "نشط" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {owner.status}
            </span>
          </div>
        ))}
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
