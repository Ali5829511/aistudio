import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const PropertyReportScreen = ({
  onSelect,
  property,
  properties,
}: {
  onSelect: (v: View) => void;
  property: any;
  properties: any[];
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

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
    <ReportLayout
      title={`تقرير ${property.name}`}
      onBack={() => onSelect("property_details")}
    >
      {/* Property Selector - Hidden during print */}
      <div className="mb-6 print:hidden">
        <button
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-primary transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="apartment" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                العقار المختار
              </p>
              <p className="text-sm font-black text-brand-dark">
                {property.name}
              </p>
            </div>
          </div>
          <Icon
            name={isSelectorOpen ? "expand_less" : "expand_more"}
            className="text-slate-400"
          />
        </button>

        <AnimatePresence>
          {isSelectorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 bg-white rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="p-2 max-h-60 overflow-y-auto">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      (window as any).selectProperty(p);
                      setIsSelectorOpen(false);
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl text-right flex items-center justify-between hover:bg-slate-50 transition-colors",
                      p.id === property.id
                        ? "bg-primary/5 text-primary"
                        : "text-slate-600",
                    )}
                  >
                    <span className="text-sm font-bold">{p.name}</span>
                    {p.id === property.id && (
                      <Icon name="check" className="text-sm" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-24 left-6 z-50 print:hidden flex flex-col gap-3">
        <button
          onClick={() => window.print()}
          className="size-14 bg-brand-dark text-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          title="طباعة سريعة"
        >
          <Icon name="print" className="text-2xl" />
        </button>
        <button
          onClick={() => onSelect("official_print")}
          className="size-14 bg-brand-yellow text-brand-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          title="نسخة الطباعة الرسمية"
        >
          <Icon name="description" className="text-2xl" />
        </button>
      </div>
      <div className="space-y-8">
        {/* الغلاف (ورق رسمي) */}
        <div className="print:h-[297mm] flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-100 rounded-3xl print:border-none">
          <Logo className="size-48 mb-8" />
          <h1 className="text-4xl font-black text-brand-dark mb-4">
            تقرير {property.name}
          </h1>
          <p className="text-xl text-slate-500 mb-12">
            تجميع البيانات الرسمية والوحدات العقارية والمستأجرين والوسطاء
            العقاريين
          </p>
          <div className="w-32 h-1 gold-gradient rounded-full mb-12"></div>
          <p className="text-lg font-bold text-primary">{property.location}</p>
          <div className="mt-auto pt-12 hidden print:block">
            <p className="text-sm text-slate-400">
              تُترك هذه الصفحة فارغة لاحتواء الورق الرسمي المرسل
            </p>
          </div>
        </div>

        {/* بيانات الصك والسجل العيني */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="description" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات الصك والسجل العيني
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "رقم الصك", value: property.deedNumber || "غير متوفر" },
              {
                label: "تاريخ الإصدار",
                value: property.deedDate || "غير متوفر",
              },
              {
                label: "جهة الإصدار",
                value: property.deedIssuer || "غير متوفر",
              },
              {
                label: "رقم المستند",
                value: property.documentNumber || "غير متوفر",
              },
              {
                label: "رقم القطعة",
                value: property.plotNumber || "غير متوفر",
              },
              {
                label: "رقم المخطط",
                value: property.planNumber || "غير متوفر",
              },
              { label: "مساحة الصك", value: property.deedArea || "غير متوفر" },
              { label: "نوع الصك", value: property.deedType || "غير متوفر" },
              {
                label: "رقم تسجيل العيني",
                value: property.cadastralNumber || "غير متوفر",
              },
              {
                label: "تاريخ التسجيل",
                value: property.cadastralDate || "غير متوفر",
              },
              {
                label: "حالة تسجيل العيني",
                value: property.cadastralStatus || "غير متوفر",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-sm font-bold text-slate-500">
                  {item.label}:
                </span>
                <span className="text-sm font-black text-brand-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* بيانات العقار */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="apartment" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات العقار
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "المنطقة", value: property.region || "غير متوفر" },
              {
                label: "المدينة",
                value:
                  property.city ||
                  property.location.split(" - ")[0] ||
                  "غير متوفر",
              },
              {
                label: "الحي",
                value:
                  property.district ||
                  property.location.split(" - ")[1] ||
                  "غير متوفر",
              },
              {
                label: "العنوان الوطني",
                value: property.nationalAddress || "غير متوفر",
              },
              {
                label: "نوع المبنى",
                value: property.buildingType || property.type || "غير متوفر",
              },
              {
                label: "الغرض من الاستخدام",
                value: property.usagePurpose || "غير متوفر",
              },
              {
                label: "عدد الطوابق",
                value: property.floorsCount || "غير متوفر",
              },
              {
                label: "عدد الوحدات",
                value: property.units ? property.units + " وحدة" : "غير متوفر",
              },
              {
                label: "عدد المصاعد",
                value: property.elevatorsCount || "غير متوفر",
              },
              {
                label: "عدد المواقف",
                value: property.parkingCount || "غير متوفر",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-sm font-bold text-slate-500">
                  {item.label}:
                </span>
                <span className="text-sm font-black text-brand-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">
              المرافق والخدمات
            </h4>
            <div className="flex flex-wrap gap-2">
              {(
                property.facilities || [
                  "مسبح أولمبي",
                  "نادي رياضي متكامل",
                  "منطقة ألعاب أطفال",
                  "حراسة أمنية ٢٤/٧",
                ]
              ).map((service: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10"
                >
                  <Icon name="check_circle" className="text-sm" />
                  {service}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بيانات الوحدة العقارية */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="door_front" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات الوحدة العقارية
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "نوع الوحدة", value: "شقة سكنية" },
              { label: "رقم الوحدة", value: "٥٠٢" },
              { label: "رقم الطابق", value: "الخامس" },
              { label: "المساحة", value: "١٨٠ م٢" },
              { label: "حالة التأثيث", value: "غير مؤثث" },
              { label: "خزائن مطبخ مركبة", value: "نعم" },
              {
                label: "عدد وحدات التكييف",
                value: "عدد (١) مركزي + (٤) سبليت",
              },
              { label: "عداد مياه", value: "مشترك" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-sm font-bold text-slate-500">
                  {item.label}:
                </span>
                <span className="text-sm font-black text-brand-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">
              تفاصيل الغرف
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "صالة", value: "١" },
                { label: "مطبخ", value: "١" },
                { label: "غرف نوم", value: "٣" },
                { label: "دورات مياه", value: "٣" },
              ].map((room, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 rounded-2xl text-center"
                >
                  <p className="text-[10px] font-bold text-slate-400 mb-1">
                    {room.label}
                  </p>
                  <p className="text-lg font-black text-brand-dark">
                    {room.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">
              أرقام عدادات الكهرباء
            </h4>
            <div className="flex flex-wrap gap-2">
              {["١٠٢٩٣٨٤٧٥٦", "٥٦٤٧٣٨٢٩١٠", "٩٨٧٦٥٤٣٢١٠"].map((meter, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-xs font-bold border border-slate-200"
                >
                  <Icon name="bolt" className="text-sm text-amber-500" />
                  {meter}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بيانات المالك واتحاد الملاك */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="person" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات المالك واتحاد الملاك
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-3">
                معلومات المالك
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "الاسم",
                    value: property.ownerName || "عبد الرحمن السديري",
                  },
                  {
                    label: "رقم الهوية",
                    value: property.ownerId || "١٠٢٣٤٥٦٧٨٩",
                  },
                  {
                    label: "رقم الجوال",
                    value: property.ownerPhone || "٠٥٠٠٠٠٠٠٠٠",
                  },
                  {
                    label: "البريد الإلكتروني",
                    value: property.ownerEmail || "info@example.com",
                  },
                  { label: "الجنسية", value: "سعودي" },
                  { label: "نسبة الملكية", value: "١٠٠٪" },
                  {
                    label: "مساحة الملكية",
                    value: property.deedArea || "٥٠٠ م٢",
                  },
                  { label: "نوع المالك", value: "فرد" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-xs font-bold text-slate-500">
                      {item.label}:
                    </span>
                    <span className="text-xs font-black text-brand-dark">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">
                بيانات اتحاد الملاك
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "اسم الجمعية", value: "جمعية ملاك برج بيان" },
                  { label: "رقم التسجيل", value: "٧٧٦٦٥٥" },
                  { label: "الرقم الموحد", value: "٧٠٠١٢٣٤٥٦٧" },
                  { label: "تاريخ السريان", value: "١٤٤٥/٠١/٠١ هـ" },
                  { label: "تاريخ الانتهاء", value: "١٤٤٦/٠١/٠١ هـ" },
                  { label: "حالة الجمعية", value: "نشطة" },
                  { label: "اسم رئيس الجمعية", value: "خالد العبدالله" },
                  { label: "رقم جوال رئيس الجمعية", value: "٠٥٠١١٢٢٣٣٤" },
                  { label: "اسم مدير العقار", value: "سعد القحطاني" },
                  { label: "رقم جوال مدير العقار", value: "٠٥٥٤٤٣٣٢٢١" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-xs font-bold text-slate-500">
                      {item.label}:
                    </span>
                    <span className="text-xs font-black text-brand-dark">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">
                نتائج التصويت والرسوم
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الرسوم", value: "٢,٥٠٠ ر.س" },
                  { label: "عدد المصوتين", value: "٤٠" },
                  { label: "نسبة القبول", value: "٩٥٪" },
                  { label: "غير المصوتين", value: "٨" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100"
                  >
                    <p className="text-[10px] font-bold text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-brand-dark">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* بيانات عقد الإيجار */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="history_edu" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات عقد الإيجار
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "رقم العقد", value: "٢٠٢٤-٩٩٨٨٧٧" },
              { label: "نوع العقد", value: "سكني موحد" },
              { label: "تاريخ الإبرام", value: "٢٠٢٤/٠١/٠١" },
              { label: "بداية الإيجار", value: "٢٠٢٤/٠١/٠١" },
              { label: "نهاية الإيجار", value: "٢٠٢٤/١٢/٣١" },
              { label: "مدة العقد", value: "سنة واحدة" },
              { label: "قيمة الإيجار السنوي", value: "٥٥,٠٠٠ ر.س" },
              { label: "عدد الدفعات", value: "٤ دفعات" },
              { label: "قنوات الدفع", value: "مدى / سداد" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-sm font-bold text-slate-500">
                  {item.label}:
                </span>
                <span className="text-sm font-black text-brand-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* بيانات المستأجر والوسيط العقاري */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="badge" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              بيانات المستأجر والوسيط العقاري
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-primary mb-3">
                معلومات المستأجر
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "الاسم", value: "محمد العتيبي" },
                  { label: "الجنسية", value: "سعودي" },
                  { label: "نوع الهوية", value: "هوية وطنية" },
                  { label: "رقم الهوية", value: "١٠٩٨٧٦٥٤٣٢" },
                  { label: "رقم الجوال", value: "٠٥٠٩٩٨٨٧٧٦" },
                  { label: "البريد الإلكتروني", value: "m.otaibi@email.com" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-xs font-bold text-slate-500">
                      {item.label}:
                    </span>
                    <span className="text-xs font-black text-brand-dark">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <h4 className="text-sm font-bold text-primary mb-3">
                بيانات الوسيط العقاري
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "اسم المنشأة",
                    value: "شركة رمز الإبداع لإدارة الأملاك",
                  },
                  { label: "السجل التجاري", value: "١٠١٠٩٩٨٨٧٧" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-xs font-bold text-slate-500">
                      {item.label}:
                    </span>
                    <span className="text-xs font-black text-brand-dark">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ملاحظات إضافية */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="size-10 gold-gradient rounded-xl flex items-center justify-center text-brand-dark">
              <Icon name="notes" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">
              ملاحظات إضافية
            </h3>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl min-h-[150px] text-sm text-slate-600 leading-relaxed">
            لا توجد ملاحظات إضافية على هذا العقار في الوقت الحالي. يتم تحديث هذا
            القسم دورياً بناءً على تقارير الفحص الميداني.
          </div>
        </section>
      </div>
    </ReportLayout>
  );
};
