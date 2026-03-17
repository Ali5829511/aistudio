import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon } from "../components/shared";

export const InvoicesScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (


      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="size-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Icon name="account_balance_wallet" className="text-2xl" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                +١٢٪
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">
                المحصل الكلي
              </p>
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">
                ٥٠,٠٠٠{" "}
                <span className="text-sm font-bold text-slate-400">ر.س</span>
              </h2>
            </div>
          </div>
          <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="size-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                <Icon name="pending_actions" className="text-2xl" />
              </div>
              <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                -٥٪
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">
                الرصيد المستحق
              </p>
              <h2 className="text-3xl font-black text-brand-dark tracking-tighter">
                ١٢,٥٠٠{" "}
                <span className="text-sm font-bold text-slate-400">ر.س</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {["الكل", "مدفوعة", "غير مدفوعة", "مدفوعة جزئياً"].map((f, i) => (
            <button
              key={i}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm",
                i === 0
                  ? "bg-brand-dark text-white"
                  : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-brand-dark">
              الفواتير الحديثة
            </h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest">
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "#INV-2024-001",
                tenant: "أحمد علي",
                property: "عمارة النخيل",
                amount: "4,500 ر.س",
                status: "مدفوعة",
                statusColor: "bg-emerald-100 text-emerald-700",
              },
              {
                id: "#INV-2024-002",
                tenant: "سارة محمد",
                property: "برج الياسمين",
                amount: "3,800 ر.س",
                status: "غير مدفوعة",
                statusColor: "bg-rose-100 text-rose-700",
              },
              {
                id: "#INV-2024-003",
                tenant: "خالد حسن",
                property: "مجمع الروضة",
                amount: "5,200 ر.س",
                status: "مدفوعة جزئياً",
                statusColor: "bg-amber-100 text-amber-700",
              },
            ].map((inv, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-all">
                    <Icon name="receipt_long" className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-brand-dark">
                      {inv.tenant}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {inv.property} • {inv.id}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-brand-dark">
                    {inv.amount}
                  </p>
                  <span
                    className={cn(
                      "inline-block px-3 py-1 rounded-full text-[9px] font-black mt-1",
                      inv.statusColor,
                    )}
                  >
                    {inv.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};
