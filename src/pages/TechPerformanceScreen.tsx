import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const TechPerformanceScreen = ({
  onSelect,
}: {
  onSelect: (v: View) => void;
}) => {
  return (

      <div className="p-4 md:p-6 space-y-6">
        {[
          { name: "أحمد الكهربائي", tasks: 24, rating: 4.8, status: "متاح" },
          {
            name: "شركة السباكة الذهبية",
            tasks: 18,
            rating: 4.5,
            status: "مشغول",
          },
          { name: "فني تكييف النخبة", tasks: 32, rating: 4.9, status: "متاح" },
        ].map((tech, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <Icon name="person" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{tech.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400">
                  {tech.tasks} مهمة مكتملة
                </span>
                <span className="text-[10px] text-yellow-500 flex items-center gap-0.5">
                  <Icon name="star" className="text-[12px] filled" />{" "}
                  {tech.rating}
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full ${tech.status === "متاح" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
            >
              {tech.status}
            </span>
          </div>
        ))}
      </div>
  );
};
