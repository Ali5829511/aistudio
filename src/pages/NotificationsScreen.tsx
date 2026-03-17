import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const NotificationsScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        {[
          {
            title: "تذكير: عقد ينتهي قريباً",
            desc: "عقد المستأجر محمد العتيبي ينتهي خلال 30 يوم",
            time: "منذ ساعة",
            icon: "event_busy",
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            title: "تم استلام دفعة جديدة",
            desc: "تم تحصيل إيجار شقة 102 بنجاح",
            time: "منذ 3 ساعات",
            icon: "payments",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "طلب صيانة مكتمل",
            desc: "تم إغلاق بلاغ صيانة المكيف في فيلا 7",
            time: "أمس",
            icon: "task_alt",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "تنبيه أمان",
            desc: "تم تسجيل دخول جديد لحسابك من جهاز غير معروف",
            time: "أمس",
            icon: "security",
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((notif, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
          >
            <div
              className={`w-10 h-10 rounded-full ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}
            >
              <Icon name={notif.icon} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm">{notif.title}</h4>
                <span className="text-[10px] text-gray-400">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {notif.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
  );
};
