import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon } from "../components/shared";

export const MaintenanceScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["جديد", "قيد التنفيذ", "مكتمل"];

  const filteredRequests = MAINTENANCE_REQUESTS.filter((req) => {
    const matchesTab =
      (activeTab === 0 && req.status === "new") ||
      (activeTab === 1 && req.status === "in_progress") ||
      (activeTab === 2 && req.status === "completed");

    const matchesSearch =
      req.property.includes(searchQuery) ||
      req.unit.includes(searchQuery) ||
      req.type.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-brand-dark pb-6 px-6 shadow-xl -mx-4 md:-mx-6 -mt-4 md:-mt-6">
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex-1 py-3 text-xs font-black transition-all rounded-xl",
                activeTab === i
                  ? "gold-gradient text-brand-dark shadow-lg"
                  : "text-slate-400 hover:text-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
          <Icon
            name="search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="البحث عن عقار، وحدة، أو نوع المشكلة..."
            className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-4 pr-12 pl-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="size-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                <Icon name="warning" className="text-lg" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                عاجل
              </p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">
              {
                MAINTENANCE_REQUESTS.filter(
                  (r) => r.priority === "high" && r.status !== "completed",
                ).length
              }
            </p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Icon name="schedule" className="text-lg" />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                متوسط الانتظار
              </p>
            </div>
            <p className="text-3xl font-black text-brand-dark relative z-10">
              2 يوم
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-brand-dark text-base">
                          {req.property} - {req.unit}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                          <Icon name="calendar_today" className="text-[12px]" />
                          {req.date}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm",
                          req.priority === "high"
                            ? "bg-rose-100 text-rose-700"
                            : req.priority === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700",
                        )}
                      >
                        {req.priority === "high"
                          ? "عالي الأهمية"
                          : req.priority === "medium"
                            ? "متوسط"
                            : "منخفض"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-2xl">
                      <div className="size-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all">
                        <Icon
                          name={
                            req.type === "تكييف"
                              ? "ac_unit"
                              : req.type === "سباكة"
                                ? "water_drop"
                                : "electrical_services"
                          }
                          className="text-xl"
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-600">
                        {req.type}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                      {req.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img
                            src={`https://picsum.photos/seed/tech${req.id}/100/100`}
                            alt="tech"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">
                          {req.technician}
                        </span>
                      </div>
                      <button className="text-xs font-black text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        التفاصيل
                        <Icon name="chevron_left" className="text-lg" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Icon name="search_off" className="text-3xl" />
                </div>
                <p className="text-slate-500 text-sm">
                  لا توجد طلبات صيانة مطابقة
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};
