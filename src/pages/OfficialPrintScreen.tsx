import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const OfficialPrintScreen = ({
  onSelect,
  property,
}: {
  onSelect: (v: View) => void;
  property: any;
}) => {
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex flex-col items-center justify-center p-4">
        <Icon name="error_outline" className="text-4xl text-slate-400 mb-4" />
        <p className="text-slate-500 mb-4">لم يتم تحديد عقار</p>
        <button
          onClick={() => onSelect("manager_dashboard")}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 print:p-0 print:bg-white">
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-brand-dark text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 print:hidden"
          >
            <div className="size-8 bg-brand-yellow text-brand-dark rounded-full flex items-center justify-center">
              <Icon name="info" />
            </div>
            <p className="text-sm font-bold">
              يمكنك حفظ التقرير كملف PDF عبر خيار الطباعة
            </p>
            <button
              onClick={() => setShowNotice(false)}
              className="text-white/50 hover:text-white"
            >
              <Icon name="close" className="text-sm" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => onSelect("property_report")}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
        >
          <Icon name="arrow_forward" />
          <span>العودة للتقرير</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-brand-dark/90 transition-all border border-white/10"
          >
            <Icon name="download" className="text-primary" />
            تصدير PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-brand-yellow text-brand-dark px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-brand-yellow/90 transition-all"
          >
            <Icon name="print" />
            طباعة التقرير
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:m-0 flex flex-col min-h-[297mm] relative overflow-hidden">
        {/* Header Branding */}
        <div className="p-10 flex justify-between items-start border-b-4 border-brand-yellow">
          <div className="text-right space-y-1">
            <h1 className="text-3xl font-black text-brand-dark">
              تقرير عقاري رسمي
            </h1>
            <p className="text-slate-500 font-bold">
              شركة رمز الإبداع لإدارة الأملاك
            </p>
            <div className="mt-6 text-xs text-slate-400 space-y-1">
              <p>
                رقم المرجع:{" "}
                <span className="font-mono text-slate-700">
                  REF-{property.id}-{new Date().getFullYear()}
                </span>
              </p>
              <p>
                تاريخ الإصدار:{" "}
                <span className="text-slate-700">
                  {new Date().toLocaleDateString("ar-SA")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="size-20 gold-gradient rounded-2xl flex items-center justify-center text-brand-dark mb-2">
              <Icon name="domain" className="text-4xl" />
            </div>
            <span className="text-xs font-black text-brand-dark">
              رمز الإبداع
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-12 py-10 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold bg-slate-50 p-3 rounded-lg border-r-4 border-brand-yellow flex items-center gap-2">
              <Icon name="info" className="text-brand-yellow" />
              بيانات العقار الأساسية
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">اسم العقار:</span>
                  <span className="font-bold">{property.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">المدينة / الحي:</span>
                  <span className="font-bold">{property.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">رقم الصك:</span>
                  <span className="font-bold font-mono">
                    {property.deedNumber || "غير متوفر"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">المساحة الإجمالية:</span>
                  <span className="font-bold">
                    {property.deedArea || "غير متوفر"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold bg-slate-50 p-3 rounded-lg border-r-4 border-brand-yellow flex items-center gap-2">
              <Icon name="analytics" className="text-brand-yellow" />
              ملخص الحالة المالية والتشغيلية
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  نسبة الإشغال
                </p>
                <p className="text-xl font-black text-brand-dark">٩٢٪</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  الإيراد السنوي
                </p>
                <p className="text-xl font-black text-brand-dark">٨٥٠,٠٠٠</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 text-center space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  طلبات الصيانة
                </p>
                <p className="text-xl font-black text-brand-dark">١٤</p>
              </div>
            </div>
          </section>

          <div className="flex justify-between items-end pt-20">
            <div className="text-center space-y-6">
              <p className="text-sm font-bold text-slate-600">ختم الشركة</p>
              <div className="w-24 h-24 rounded-full border-4 border-brand-yellow/20 flex items-center justify-center opacity-30 rotate-12">
                <Icon
                  name="verified_user"
                  className="text-5xl text-brand-yellow"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-slate-600">
                توقيع مدير الأملاك
              </p>
              <div className="w-40 h-px bg-slate-300 mt-12"></div>
              <p className="text-xs text-slate-400">أ. محمد العتيبي</p>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-auto">
          <div className="bg-brand-dark p-8 flex justify-between items-center text-white">
            <div className="flex gap-8 text-[10px]">
              <div className="flex items-center gap-2">
                <Icon name="call" className="text-brand-yellow" />
                <span>920013517</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" className="text-brand-yellow" />
                <span>info@ramzabdae.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="language" className="text-brand-yellow" />
                <span>www.ramzabdae.com</span>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-8 bg-brand-yellow skew-x-[-20deg]"></div>
              <div className="w-3 h-8 bg-white/20 skew-x-[-20deg]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
