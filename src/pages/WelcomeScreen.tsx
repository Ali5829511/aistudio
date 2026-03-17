import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const WelcomeScreen = ({ onSelect }: { onSelect: (view: View) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === "aliayashi522@gmail.com") {
        onSelect("manager_dashboard");
      } else {
        setError("غير مصرح لك بالدخول كمدير نظام.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center pt-16 pb-12 px-4 relative z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Logo className="size-48" />
        </motion.div>
        <h1 className="text-white text-5xl font-black text-center mb-3 tracking-tight">
          رمز <span className="text-primary">الإبداع</span>
        </h1>
        <p className="text-slate-400 text-center max-w-xl font-medium text-xl tracking-wide">
          الريادة في إدارة الأملاك العقارية
        </p>
        <div className="w-24 h-1 gold-gradient rounded-full mt-6"></div>
      </motion.header>

      <main className="flex-grow container mx-auto px-6 py-8 relative z-10 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full group relative flex flex-col items-center p-8 bg-white/5 border border-white/10 hover:border-primary/50 rounded-3xl transition-all overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity -mr-16 -mt-16 rounded-full blur-2xl"></div>

            <div className="size-16 gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <Icon
                name="admin_panel_settings"
                className="text-3xl text-brand-dark"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
              {loading ? "جاري تسجيل الدخول..." : "تسجيل دخول مدير النظام"}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              تسجيل الدخول باستخدام حساب Google المعتمد
            </p>
          </motion.button>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
              >
                <Icon name="error" className="text-xl" />
                <p className="text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full py-12 px-4 relative z-10">
        <div className="container mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <Logo className="h-12 w-auto" />
          </div>
          <div className="flex gap-6 text-slate-500 text-sm font-bold">
            <a href="#" className="hover:text-primary transition-colors">
              عن الشركة
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              خدماتنا
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              اتصل بنا
            </a>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            © 2024 شركة رمز الإبداع لادارة الاملاك. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};
