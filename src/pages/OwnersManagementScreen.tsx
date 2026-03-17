import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const OwnersManagementScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
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
      </div>
  );
};
