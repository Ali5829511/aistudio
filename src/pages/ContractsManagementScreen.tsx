import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const ContractsManagementScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        {[
          {
            tenant: "محمد العتيبي",
            unit: "شقة ١٠٢",
            end: "٢٠٢٤/١٢/٣١",
            status: "ساري",
          },
          {
            tenant: "شركة الأفق",
            unit: "مكتب ٥",
            end: "٢٠٢٤/٠٦/١٥",
            status: "ينتهي قريباً",
          },
          {
            tenant: "سارة العمري",
            unit: "فيلا ١٢",
            end: "٢٠٢٥/٠١/٢٠",
            status: "ساري",
          },
        ].map((contract, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                  <Icon name="description" />
                </div>
                <div>
                  <h4 className="font-bold">{contract.tenant}</h4>
                  <p className="text-xs text-gray-500">{contract.unit}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${contract.status === "ساري" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {contract.status}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <p className="text-[10px] text-gray-400">
                تاريخ الانتهاء: {contract.end}
              </p>
              <button className="text-primary text-xs font-bold flex items-center gap-1">
                تجديد <Icon name="refresh" className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
  );
};
