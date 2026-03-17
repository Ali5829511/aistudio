import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon, ImageCarousel } from "../components/shared";

export const PropertyDetailsScreen = ({
  onSelect,
  property,
}: {
  onSelect: (v: View) => void;
  property: any;
}) => {
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
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
    <div className="p-4 md:p-6 space-y-6">
        <div className="px-5">
          <ImageCarousel
            images={[
              `https://picsum.photos/seed/${property.id}1/800/600`,
              `https://picsum.photos/seed/${property.id}2/800/600`,
              `https://picsum.photos/seed/${property.id}3/800/600`,
            ]}
          />
        </div>

        <div className="px-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-primary/10 -mt-12 relative z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-black text-brand-dark mb-1">
                  {property.name}
                </h2>
                <div className="flex items-center text-slate-500 text-sm">
                  <Icon
                    name="location_on"
                    className="text-primary text-[18px] ml-1"
                  />
                  <span className="font-medium">{property.location}</span>
                </div>
              </div>
              <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 text-primary font-black text-xs uppercase tracking-wider">
                {property.type}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  إجمالي الوحدات
                </p>
                <p className="text-xl font-black text-brand-dark">
                  {toArabicDigits(property.units)}
                </p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  الوحدات الشاغرة
                </p>
                <p className="text-xl font-black text-emerald-500">٤</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  العقود النشطة
                </p>
                <p className="text-xl font-black text-brand-dark">٤٤</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-5 grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="col-span-2 bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-slate-500 text-xs font-medium mb-1">
                إجمالي الدخل الشهري
              </p>
              <p className="text-2xl font-bold">
                ١٢٥,٠٠٠{" "}
                <span className="text-sm font-medium text-primary">ر.س</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Icon name="payments" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28"
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-medium">
                إجمالي الوحدات
              </span>
              <Icon name="apartment" className="text-primary/60 text-lg" />
            </div>
            <p className="text-2xl font-bold">٢٤</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28"
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-medium">مشغولة</span>
              <span className="h-2 w-2 rounded-full bg-green-500 mt-1"></span>
            </div>
            <p className="text-2xl font-bold">٢٠</p>
            <p className="text-xs text-green-600 font-medium">
              ٨٣٪ نسبة الإشغال
            </p>
          </motion.div>
        </div>

        <section className="px-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold">سجل الصيانة</h3>
            <button
              onClick={() => onSelect("maintenance")}
              className="text-xs text-primary font-bold"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {MAINTENANCE_REQUESTS.filter(
              (r) => r.property === "برج بيان" || r.property === "عمارة النخيل",
            )
              .slice(0, 2)
              .map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                      <Icon
                        name={
                          req.type === "سباكة"
                            ? "faucet"
                            : req.type === "كهرباء"
                              ? "bolt"
                              : req.type === "تكييف"
                                ? "ac_unit"
                                : "format_paint"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {req.type} - {req.unit}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {req.date} • {req.technician}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold",
                      req.status === "completed"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600",
                    )}
                  >
                    {req.status === "completed" ? "مكتمل" : "قيد التنفيذ"}
                  </span>
                </div>
              ))}
          </div>
        </section>

        <section className="px-5 space-y-3">
          <h3 className="text-base font-bold">الموقع على الخريطة</h3>
          <div className="h-48 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative z-0">
            <MapContainer
              center={[24.7136, 46.6753]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[24.7136, 46.6753]}>
                <Popup>
                  {property.name} <br /> {property.location}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>

        <section className="px-5 space-y-3">
          <h3 className="text-base font-bold">سجل المشاهدات والتفاعلات</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {[
              {
                user: "أحمد محمد",
                action: "عرض تفاصيل العقار",
                date: "٢٠٢٤/٠٣/١٥ ١٠:٣٠ ص",
                type: "view",
              },
              {
                user: "سارة خالد",
                action: "تحميل تقرير العقار",
                date: "٢٠٢٤/٠٣/١٤ ٠٢:١٥ م",
                type: "download",
              },
              {
                user: "مدير النظام",
                action: "تحديث بيانات الصك",
                date: "٢٠٢٤/٠٣/١٠ ٠٩:٠٠ ص",
                type: "edit",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="p-4 border-b border-slate-50 last:border-0 flex items-start gap-3"
              >
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0",
                    log.type === "view"
                      ? "bg-blue-50 text-blue-500"
                      : log.type === "download"
                        ? "bg-emerald-50 text-emerald-500"
                        : "bg-amber-50 text-amber-500",
                  )}
                >
                  <Icon
                    name={
                      log.type === "view"
                        ? "visibility"
                        : log.type === "download"
                          ? "download"
                          : "edit"
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">
                    {log.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span className="font-bold">{log.user}</span>
                    <span>•</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
  );
};
