import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { View } from "../../types";
import { cn } from "../../utils";
import { Icon } from "./Icon";
import { SideNav } from "./SideNav";

export const AppLayout = ({
  children,
  activeView,
  onSelect,
  title,
  subtitle,
  headerActions,
  showBottomNav = false,
}: {
  children: React.ReactNode;
  activeView: View;
  onSelect: (v: View) => void;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  showBottomNav?: boolean;
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {}
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SideNav
          active={activeView}
          onSelect={(v) => {
            onSelect(v);
            setMobileMenuOpen(false);
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full z-40 lg:hidden"
            >
              <SideNav
                active={activeView}
                onSelect={(v) => {
                  onSelect(v);
                  setMobileMenuOpen(false);
                }}
                collapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
                onSignOut={handleSignOut}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginRight: `${sidebarWidth}px` }}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            {/* Left side: Mobile menu + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center size-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <Icon name="menu" className="text-xl" />
              </button>
              {title && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-slate-800 truncate">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-slate-500 truncate">{subtitle}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 text-slate-400">
                <Icon name="search" className="text-lg" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="bg-transparent text-sm outline-none w-40 placeholder:text-slate-400 text-slate-700"
                />
              </div>

              {/* Notifications */}
              <button
                onClick={() => onSelect("notifications")}
                className="relative flex items-center justify-center size-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <Icon name="notifications" className="text-xl" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* Custom Actions */}
              {headerActions}

              {/* User */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <div className="size-7 brand-gradient rounded-lg flex items-center justify-center">
                  <Icon name="person" className="text-white text-sm" filled />
                </div>
                <span className="hidden md:block text-xs font-semibold text-slate-600">المدير</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
