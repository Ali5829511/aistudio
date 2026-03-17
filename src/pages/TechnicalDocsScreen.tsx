import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const TechnicalDocsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center py-6">
          <h3 className="text-2xl font-bold mb-2">تحميل الوثائق التقنية</h3>
          <p className="text-sm text-gray-500">
            احصل على الدليل الشامل للمطورين والمهندسين
          </p>
        </div>
        <div className="space-y-3">
          {[
            {
              title: "بنية النظام",
              icon: "account_tree",
              desc: "نظرة عامة على الهيكل المعماري",
            },
            {
              title: "نقاط الـ API",
              icon: "api",
              desc: "توثيق كامل للطلبات والاستجابات",
            },
            {
              title: "مخطط البيانات",
              icon: "database",
              desc: "جداول العلاقات والمفاتيح",
            },
            {
              title: "بروتوكولات الأمان",
              icon: "security",
              desc: "معايير التشفير والوصول",
            },
          ].map((doc, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Icon name={doc.icon} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{doc.title}</h4>
                <p className="text-[10px] text-gray-400">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
          <Icon name="download" /> تحميل الدليل التقني (PDF)
        </button>
      </div>
  );
};
