import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon } from "../components/shared";

export const UnitsManagementScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState("الكل");

  const filters = ["الكل", "شاغرة", "مؤجرة", "تحت الصيانة"];
  const properties = [
    "الكل",
    ...Array.from(new Set(UNITS.map((u) => u.property))),
  ];
  const types = ["الكل", ...Array.from(new Set(UNITS.map((u) => u.type)))];

  const filteredUnits = UNITS.filter((unit) => {
    const matchesStatus =
      activeFilter === "الكل" || unit.status === activeFilter;
    const matchesProperty =
      propertyFilter === "الكل" || unit.property === propertyFilter;
    const matchesType = typeFilter === "الكل" || unit.type === typeFilter;
    const matchesSearch =
      unit.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.id.toString().includes(searchQuery) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProperty && matchesType && matchesSearch;
  });

  return (

      <div className="p-4 md:p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Icon
            name="search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="ابحث عن وحدة برقمها، نوعها أو اسم العقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option disabled value="الكل">
              العقار
            </option>
            {properties.map((p) => (
              <option key={p} value={p}>
                {p === "الكل" ? "كل العقارات" : p}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option disabled value="الكل">
              النوع
            </option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "الكل" ? "كل الأنواع" : t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-gray-100 text-gray-500 hover:bg-slate-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <AnimatePresence mode="popLayout">
          {filteredUnits.map((unit, i) => (
            <motion.div
              key={`${unit.property}-${unit.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icon
                    name={
                      unit.type === "شقة"
                        ? "apartment"
                        : unit.type === "مكتب"
                          ? "corporate_fare"
                          : "home"
                    }
                  />
                </div>
                <div>
                  <h4 className="font-bold">
                    وحدة {toArabicDigits(unit.id)} - {unit.type}
                  </h4>
                  <p className="text-[10px] text-gray-500">{unit.property}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-primary">
                  {toArabicDigits(unit.rent)} ر.س
                </p>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${unit.status === "مؤجرة" ? "bg-green-100 text-green-700" : unit.status === "شاغرة" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {unit.status}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredUnits.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="search_off" className="text-4xl text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">لا توجد وحدات بهذه الحالة</p>
          </div>
        )}
      </div>
  );
};
