import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const DeveloperCenterScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
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
          مركز المطورين
        </h2>
      </header>
      <main className="p-4 space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-2">مفاتيح الـ API</h3>
          <p className="text-xs text-slate-400 mb-4">
            استخدم هذه المفاتيح لربط نظامك مع تطبيقات الطرف الثالث
          </p>
          <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between border border-slate-700">
            <code className="text-[10px] font-mono text-primary">
              sk_live_51Mz...982
            </code>
            <Icon
              name="content_copy"
              className="text-slate-500 text-sm cursor-pointer"
            />
          </div>
        </div>

        {/* تكامل الواتساب */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">تكامل الواتساب</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              متصل
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 mb-1">
                عنوان الاستدعاء (Callback URL)
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[10px] font-mono text-slate-600 truncate">
                  https://api.example.com/webhooks/whatsapp
                </code>
                <Icon
                  name="content_copy"
                  className="text-slate-400 text-sm cursor-pointer shrink-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">رقم الربط</p>
                <p className="text-xs font-bold text-slate-700">
                  +966 50 123 4567
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 mb-1">آخر مزامنة</p>
                <p className="text-xs font-bold text-slate-700">منذ دقيقتين</p>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
            إعدادات Webhooks
          </button>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold">سجل الطلبات (Webhooks)</h3>
          {[
            {
              method: "POST",
              path: "/v1/invoices",
              status: 200,
              time: "منذ دقيقة",
            },
            {
              method: "GET",
              path: "/v1/properties",
              status: 200,
              time: "منذ ٥ دقائق",
            },
            {
              method: "POST",
              path: "/v1/maintenance",
              status: 400,
              time: "منذ ساعة",
            },
          ].map((log, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.method === "POST" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                >
                  {log.method}
                </span>
                <span className="text-[10px] font-mono text-gray-600">
                  {log.path}
                </span>
              </div>
              <div className="text-left">
                <span
                  className={`text-[9px] font-bold ${log.status === 200 ? "text-green-500" : "text-red-500"}`}
                >
                  {log.status}
                </span>
                <p className="text-[8px] text-gray-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
