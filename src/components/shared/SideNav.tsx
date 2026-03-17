import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../../types";
import { cn } from "../../utils";
import { Icon } from "./Icon";

interface NavGroup {
  label: string;
  items: NavItem[];
}
interface NavItem {
  id: View;
  label: string;
  icon: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "الرئيسية",
    items: [
      { id: "manager_dashboard", label: "لوحة التحكم", icon: "dashboard" },
      { id: "notifications",     label: "الإشعارات",   icon: "notifications" },
    ],
  },
  {
    label: "إدارة الأملاك",
    items: [
      { id: "property_details",    label: "العقارات",    icon: "apartment" },
      { id: "units",               label: "الوحدات",     icon: "door_front" },
      { id: "add_property",        label: "إضافة عقار",  icon: "add_home" },
      { id: "asset_management",    label: "الأصول",      icon: "inventory_2" },
      { id: "owners",              label: "الملاك",      icon: "badge" },
    ],
  },
  {
    label: "المستأجرون",
    items: [
      { id: "tenants_management",  label: "المستأجرون",  icon: "people" },
      { id: "contracts",           label: "العقود",      icon: "description" },
      { id: "ejar_integration",    label: "إيجار",       icon: "verified_user" },
    ],
  },
  {
    label: "العمليات",
    items: [
      { id: "maintenance",         label: "الصيانة",     icon: "construction" },
      { id: "vendors_management",  label: "المقاولون",   icon: "engineering" },
      { id: "payment",             label: "المدفوعات",   icon: "payments" },
    ],
  },
  {
    label: "المالية",
    items: [
      { id: "accounting",          label: "المحاسبة",    icon: "account_balance" },
      { id: "invoices",            label: "الفواتير",    icon: "receipt_long" },
      { id: "financial_report",    label: "التقارير المالية", icon: "bar_chart" },
      { id: "zakat_tax",           label: "الزكاة والضريبة", icon: "calculate" },
    ],
  },
  {
    label: "التقارير",
    items: [
      { id: "reports",             label: "التقارير",    icon: "analytics" },
      { id: "property_report",     label: "تقرير العقار", icon: "summarize" },
      { id: "official_print",      label: "الطباعة الرسمية", icon: "print" },
      { id: "archive",             label: "الأرشيف",    icon: "archive" },
    ],
  },
  {
    label: "الأدوات",
    items: [
      { id: "ai_assistant",        label: "المساعد الذكي", icon: "smart_toy" },
      { id: "msg_templates",       label: "قوالب الرسائل", icon: "chat_bubble" },
      { id: "property_forms",      label: "نماذج العقارات", icon: "folder_open" },
      { id: "publish",             label: "النشر",        icon: "cloud_upload" },
    ],
  },
  {
    label: "الإعدادات",
    items: [
      { id: "settings",            label: "الإعدادات",   icon: "settings" },
      { id: "support",             label: "الدعم الفني", icon: "help_center" },
      { id: "docs",                label: "التوثيق",     icon: "menu_book" },
      { id: "dev_center",          label: "مركز التطوير", icon: "code" },
    ],
  },
];

export const SideNav = ({
  active,
  onSelect,
  collapsed,
  onToggle,
  onSignOut,
}: {
  active: View;
  onSelect: (v: View) => void;
  collapsed: boolean;
  onToggle: () => void;
  onSignOut?: () => void;
}) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Find which group the active view belongs to and auto-expand it
  React.useEffect(() => {
    for (const group of NAV_GROUPS) {
      if (group.items.some((item) => item.id === active)) {
        setExpandedGroup(group.label);
        break;
      }
    }
  }, [active]);

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-screen z-40 flex flex-col transition-all duration-300",
        "bg-brand-dark border-l border-white/5 shadow-2xl",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 brand-gradient rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Icon name="home_work" className="text-white text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">رمز الإبداع</p>
              <p className="text-slate-500 text-[10px] font-medium">إدارة الأملاك</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="size-9 brand-gradient rounded-xl flex items-center justify-center mx-auto shrink-0 shadow-lg">
            <Icon name="home_work" className="text-white text-xl" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          >
            <Icon name="chevron_right" className="text-lg" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-0.5">
        {NAV_GROUPS.map((group) => {
          const isExpanded = !collapsed && expandedGroup === group.label;
          const hasActive = group.items.some((item) => item.id === active);

          return (
            <div key={group.label}>
              {/* Group header */}
              {!collapsed && (
                <button
                  onClick={() =>
                    setExpandedGroup(
                      expandedGroup === group.label ? null : group.label,
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors mt-1",
                    hasActive
                      ? "text-primary-light"
                      : "text-slate-600 hover:text-slate-400",
                  )}
                >
                  <span>{group.label}</span>
                  <Icon
                    name={isExpanded ? "expand_less" : "expand_more"}
                    className="text-base"
                  />
                </button>
              )}

              {/* Group items */}
              <AnimatePresence initial={false}>
                {(collapsed || isExpanded) && (
                  <motion.div
                    initial={collapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const isActive = active === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => onSelect(item.id)}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all my-0.5",
                            isActive
                              ? "bg-primary text-white shadow-md shadow-primary/30"
                              : "text-slate-400 hover:bg-white/8 hover:text-white",
                            collapsed && "justify-center",
                          )}
                        >
                          <Icon
                            name={item.icon}
                            className="text-xl shrink-0"
                            filled={isActive}
                          />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                          {!collapsed && isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white mr-auto shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 p-2 space-y-1 shrink-0">
        {collapsed && (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            title="توسيع القائمة"
          >
            <Icon name="chevron_left" className="text-xl" />
          </button>
        )}
        {onSignOut && (
          <button
            onClick={onSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
              collapsed && "justify-center",
            )}
            title={collapsed ? "تسجيل الخروج" : undefined}
          >
            <Icon name="logout" className="text-xl shrink-0" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
