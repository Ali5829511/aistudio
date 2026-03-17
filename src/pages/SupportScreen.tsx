import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const SupportScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => onSelect("manager_dashboard"), 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="send" className="text-4xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">تم إرسال رسالتك!</h2>
        <p className="text-slate-500">
          سيتواصل معك فريق الدعم الفني في أقرب وقت ممكن.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] pb-24">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => onSelect("manager_dashboard")}
          className="p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <Icon name="arrow_forward" />
        </button>
        <h1 className="text-lg font-bold">الدعم الفني</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-5 space-y-8">
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-black text-brand-dark">
            كيف يمكننا مساعدتك؟
          </h2>
          <p className="text-slate-500 text-sm">
            نحن هنا للإجابة على استفساراتك وحل مشكلاتك
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="call" />
            </div>
            <p className="text-xs font-bold">اتصال مباشر</p>
            <p className="text-[10px] text-slate-400">٩٢٠٠٠١٢٣٤</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
            <div className="size-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="chat" />
            </div>
            <p className="text-xs font-bold">واتساب</p>
            <p className="text-[10px] text-slate-400">٠٥٠١٢٣٤٥٦٧</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-6 shadow-xl border border-primary/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Icon name="mail" className="text-primary" />
            أرسل لنا رسالة
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">
                الموضوع
              </label>
              <select
                required
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">اختر نوع الاستفسار</option>
                <option>مشكلة تقنية</option>
                <option>استفسار مالي</option>
                <option>اقتراح تحسين</option>
                <option>أخرى</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-2">
                الرسالة
              </label>
              <textarea
                required
                rows={4}
                placeholder="اكتب تفاصيل استفسارك هنا..."
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 bg-primary text-brand-dark font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all",
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Icon name="sync" />
                </motion.div>
              ) : (
                <>
                  إرسال الرسالة
                  <Icon name="send" className="text-sm" />
                </>
              )}
            </button>
          </form>
        </section>
      </main>
      <BottomNav active="settings" onSelect={onSelect} />
    </div>
  );
};
