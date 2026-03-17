import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const VendorsManagementScreen = ({
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
          الموردين والفنيين
        </h2>
        <button className="p-2 bg-primary/10 text-primary rounded-full">
          <Icon name="add_business" />
        </button>
      </header>
      <main className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              name: "شركة التكييف المتقدمة",
              service: "صيانة تكييف",
              rating: 4.8,
              status: "available",
              phone: "966500000001",
            },
            {
              name: "الكهربائي المتميز",
              service: "أعمال كهرباء",
              rating: 4.5,
              status: "busy",
              phone: "966500000002",
            },
            {
              name: "سباكة الخليج",
              service: "سباكة وعزل",
              rating: 4.2,
              status: "available",
              phone: "966500000003",
            },
          ].map((vendor, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="engineering" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{vendor.name}</h4>
                  <p className="text-[10px] text-gray-400">{vendor.service}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon
                      name="star"
                      className="text-[10px] text-amber-400"
                      filled
                    />
                    <span className="text-[10px] font-bold">
                      {vendor.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${vendor.status === "available" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {vendor.status === "available" ? "متاح" : "مشغول"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${vendor.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="تواصل عبر واتساب"
                  >
                    <Icon name="chat" className="text-sm" />
                  </a>
                  <button className="text-[10px] text-primary font-bold px-3 py-1.5 bg-primary/5 rounded-lg">
                    طلب خدمة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
