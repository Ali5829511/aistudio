import React from "react";
import { motion } from "motion/react";
import { View } from "../../types";
import { cn } from "../../utils";
import { Icon } from "./Icon";

export const BottomNav = ({
  active,
  onSelect,
}: {
  active: View;
  onSelect: (v: View) => void;
}) => {
  const items = [
    { id: "manager_dashboard", label: "الرئيسية", icon: "grid_view" },
    { id: "property_details", label: "العقارات", icon: "apartment" },
    { id: "accounting", label: "المالية", icon: "account_balance_wallet" },
    { id: "settings", label: "الإعدادات", icon: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 pb-6 px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id as View)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative px-4 py-1 rounded-2xl",
            active === item.id
              ? "text-primary"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          {active === item.id && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 bg-primary/5 rounded-2xl"
            />
          )}
          <Icon
            name={item.icon}
            className="text-2xl relative z-10"
            filled={active === item.id}
          />
          <span className="text-[10px] font-black relative z-10">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
