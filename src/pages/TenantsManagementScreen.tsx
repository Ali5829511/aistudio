import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const TenantsManagementScreen = ({
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
          إدارة المستأجرين
        </h2>
        <button className="p-2 bg-primary/10 text-primary rounded-full">
          <Icon name="person_add" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        <div className="relative">
          <Icon
            name="search"
            className="absolute right-3 top-3 text-gray-400"
          />
          <input
            className="w-full rounded-xl border-none bg-white py-3 pr-10 pl-4 shadow-sm text-sm"
            placeholder="بحث عن مستأجر..."
            type="text"
          />
        </div>
        <div className="space-y-3">
          {[
            {
              name: "محمد العتيبي",
              unit: "شقة ٤٠٢",
              property: "برج الياسمين",
              status: "active",
              paid: true,
            },
            {
              name: "سارة القحطاني",
              unit: "فيلا ٧",
              property: "حي النرجس",
              status: "active",
              paid: false,
            },
            {
              name: "عبدالله الشمري",
              unit: "مكتب ١٠١",
              property: "برج النخيل",
              status: "expiring",
              paid: true,
            },
          ].map((tenant, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  {tenant.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tenant.name}</h4>
                  <p className="text-[10px] text-gray-400">
                    {tenant.property} - {tenant.unit}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tenant.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {tenant.paid ? "مدفوع" : "متأخر"}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">عرض الملف</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
