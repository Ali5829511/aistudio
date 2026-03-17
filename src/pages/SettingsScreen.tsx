import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, Logo } from "../components/shared";

export const SettingsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (


      <div className="p-4 md:p-6 space-y-6">
        <section className="flex flex-col items-center py-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1 bg-white shadow-sm overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPstPfUz-rsNQcTzy5hPNwvsl4rluDHwaVZWFbkw-FVVzEMDe5o_eV2NjL3rcKrXh-6TFewL5HGFRB4jm1FQf2w5nKffMsgJwY2dcYd1QuLjQiVKTHy5EtKlL7RDXjPhvPrPHScAT7yN5flaSp2DMrmfsMC_O0xaNiGvbAx_jJ8ycYE7_HuU2GWvwHlTxGozHX4yDX0AVPf0YGJyEvwY-W0ohnIcVlojAk8GLTMF_KFY3KMgPqzNmAPIBgVrrAt1R3t_oS3zx7DCg"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <Icon name="edit" className="text-white text-sm" />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-bold">أحمد محمد عبد الله</h3>
          <p className="text-sm text-gray-500">مدير عقارات معتمد</p>
          <p className="text-xs text-primary font-medium mt-1">
            ahmed.abdullah@estate-pro.sa
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">هوية العلامة التجارية</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-black text-brand-dark">
                  شعار المنشأة
                </p>
                <p className="text-[10px] text-gray-400">
                  يظهر في التقارير والفواتير (PNG, SVG)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-lg hover:bg-primary/20 transition-colors">
                  تحديث الشعار
                </button>
                <div className="size-16 bg-brand-dark rounded-xl flex items-center justify-center border-2 border-primary/20 shadow-lg shadow-brand-dark/10 overflow-hidden">
                  <Logo className="size-12" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-sm font-black text-brand-dark mb-4">
                اللون الأساسي للنظام
              </p>
              <div className="flex items-center gap-4">
                {[
                  { hex: "#f2cc0d", name: "رمز الإبداع" },
                  { hex: "#2563eb", name: "أزرق كلاسيك" },
                  { hex: "#059669", name: "أخضر ملكي" },
                  { hex: "#1e293b", name: "رمادي ليلي" },
                ].map((color, i) => (
                  <button
                    key={i}
                    className={cn(
                      "group flex flex-col items-center gap-2",
                      i === 0
                        ? "opacity-100"
                        : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl border-2 shadow-sm",
                        i === 0
                          ? "border-primary scale-110"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-[9px] font-bold text-slate-400">
                      {color.name}
                    </span>
                  </button>
                ))}
                <button className="w-10 h-10 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-all">
                  <Icon name="colorize" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">التفضيلات</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="language" className="text-primary" />
                <span className="text-sm font-bold">اللغة</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-bold">
                <span>العربية</span>
                <Icon name="expand_more" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="payments" className="text-primary" />
                <span className="text-sm font-bold">العملة المفضلة</span>
              </div>
              <span className="text-primary text-sm font-bold">
                ريال سعودي (SAR)
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الأمان والخصوصية</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <button className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="lock" className="text-primary" />
                <span className="text-sm font-bold">تغيير كلمة المرور</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="verified_user" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">المصادقة الثنائية (2FA)</p>
                  <p className="text-[10px] text-gray-400">
                    حماية إضافية لحسابك
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الإشعارات</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            {[
              { label: "إشعارات البريد الإلكتروني", active: true },
              { label: "تنبيهات العقود المنتهية", active: true },
              { label: "رسائل المستأجرين", active: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-bold">{n.label}</span>
                <div
                  className={`w-12 h-6 rounded-full relative transition-colors ${n.active ? "bg-primary" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${n.active ? "right-1" : "left-1"}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold">الدعم والمساعدة</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            <button
              onClick={() => onSelect("support")}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="support_agent" className="text-primary" />
                <span className="text-sm font-bold">تواصل مع الدعم الفني</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
            <button
              onClick={() => onSelect("docs")}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="description" className="text-primary" />
                <span className="text-sm font-bold">دليل الاستخدام</span>
              </div>
              <Icon name="chevron_left" className="text-gray-300" />
            </button>
          </div>
        </section>

        <button
          onClick={async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Error signing out", error);
            }
          }}
          className="w-full py-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
  );
};
