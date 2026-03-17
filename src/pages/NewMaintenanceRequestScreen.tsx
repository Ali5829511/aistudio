import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const NewMaintenanceRequestScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => onSelect("maintenance"), 1500);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="task_alt" className="text-6xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">تم إرسال الطلب!</h2>
        <p className="text-slate-500">
          سيقوم فريق الصيانة بمراجعة طلبك قريباً.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">الممتلكات</label>
            <select className="w-full rounded-xl border-none bg-white py-3.5 pr-4 pl-10 focus:ring-2 focus:ring-primary shadow-sm text-base transition-all">
              <option disabled selected>
                اختر المبنى
              </option>
              <option>أبراج النخيل - الرياض</option>
              <option>فيلا السعادة - جدة</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">رقم الوحدة</label>
            <input
              className="w-full rounded-xl border-none bg-white py-3.5 px-4 focus:ring-2 focus:ring-primary shadow-sm transition-all"
              placeholder="أدخل رقم الشقة أو الوحدة"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">فئة المشكلة</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "سباكة", icon: "plumbing", active: true },
              { label: "كهرباء", icon: "electrical_services" },
              { label: "تكييف", icon: "ac_unit" },
              { label: "مكافحة", icon: "pest_control" },
              { label: "دهان", icon: "format_paint" },
              { label: "أخرى", icon: "more_horiz" },
            ].map((cat, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all border-2 ${cat.active ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-white text-slate-500"}`}
              >
                <Icon name={cat.icon} className="text-2xl" />
                <span className="text-xs font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">مستوى الأولوية</h3>
          <div className="flex w-full rounded-xl bg-slate-100 p-1">
            {["منخفض", "متوسط", "عالي"].map((p, i) => (
              <button
                key={i}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${i === 1 ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">الوصف</label>
          <textarea
            className="w-full min-h-[120px] rounded-xl border-none bg-white p-4 focus:ring-2 focus:ring-primary shadow-sm resize-none transition-all"
            placeholder="اشرح المشكلة بالتفصيل..."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">إرفاق صور (اختياري)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"
            >
              <Icon name="add_a_photo" className="text-3xl" />
              <span className="text-[10px] font-medium">أضف صورة</span>
            </motion.button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-4 text-white font-bold text-lg shadow-lg transition-all",
            isSubmitting
              ? "bg-slate-400"
              : "bg-primary shadow-primary/20 hover:bg-primary-dark",
          )}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
          {!isSubmitting && <Icon name="send" />}
        </button>
      </div>
  );
};
