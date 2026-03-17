import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const ReportsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">
            التقارير المالية
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                title: "تقرير الصك والوحدة العقارية",
                icon: "description",
                view: "property_report",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                title: "التقرير المالي السنوي",
                icon: "payments",
                view: "financial_report",
                color: "text-brand-dark",
                bg: "bg-brand-dark/5",
              },
              {
                title: "إقرارات الزكاة والضريبة",
                icon: "account_balance",
                view: "zakat_tax",
                color: "text-primary-dark",
                bg: "bg-primary/10",
              },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">
                    عرض وتحميل التقارير التفصيلية
                  </p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">
            التشغيل والأداء
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                title: "أداء الفنيين والموردين",
                icon: "engineering",
                view: "tech_performance",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                title: "الأرشيف العقاري الذكي",
                icon: "inventory_2",
                view: "archive",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">
                    متابعة مؤشرات الأداء والوثائق
                  </p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">
            التجربة والرضا
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                title: "مؤشر رضا المستأجرين",
                icon: "sentiment_satisfied",
                view: "tenant_satisfaction",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">
                    تحليل استبيانات وملاحظات السكان
                  </p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 px-1">
            التكاملات والإعدادات
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                title: "ربط منصة إيجار",
                icon: "sync_alt",
                view: "ejar_integration",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "مركز المطورين (API)",
                icon: "terminal",
                view: "dev_center",
                color: "text-slate-700",
                bg: "bg-slate-100",
              },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.view as View)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-right transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon name={item.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">
                    إدارة الربط التقني والبيانات
                  </p>
                </div>
                <Icon name="chevron_left" className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>
      </div>
  );
};
