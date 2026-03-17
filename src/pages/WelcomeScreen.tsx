import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { View } from "../types";
import { Icon } from "../components/shared";

const FEATURES = [
  { icon: "apartment",        text: "إدارة شاملة للعقارات والوحدات" },
  { icon: "people",           text: "متابعة المستأجرين والعقود" },
  { icon: "construction",     text: "نظام صيانة متكامل" },
  { icon: "account_balance",  text: "محاسبة متوافقة مع هيئة الزكاة" },
  { icon: "analytics",        text: "تقارير فورية ولوحات بيانات دقيقة" },
  { icon: "verified_user",    text: "تكامل مع منصة إيجار الحكومية" },
];

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
        setError("غير مصرح لك بالدخول. يرجى استخدام الحساب المعتمد.");
        await signOut(auth);
      }
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ── Left Panel: Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[55%] brand-gradient relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 size-[500px] bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 size-[400px] bg-white rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative z-10">
          {/* Logo area */}
          <div className="flex items-center gap-4 mb-16">
            <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Icon name="home_work" className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">رمز الإبداع</h1>
              <p className="text-blue-200 text-sm">برنامج إدارة الأملاك العقارية</p>
            </div>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-white text-4xl font-bold leading-snug mb-4">
              الحل الشامل لإدارة
              <br />
              <span className="text-blue-200">الأملاك العقارية</span>
            </h2>
            <p className="text-blue-100 text-base leading-relaxed max-w-sm">
              منصة متكاملة تجمع بين إدارة العقارات، التحصيل المالي، الصيانة،
              والتقارير الفورية — في مكان واحد.
            </p>
          </motion.div>
        </div>

        {/* Features list */}
        <div className="relative z-10 space-y-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div className="size-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Icon name={f.icon} className="text-white text-base" filled />
              </div>
              <span className="text-blue-100 text-sm font-medium">{f.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-8">
          <p className="text-blue-200/60 text-xs">
            © {new Date().getFullYear()} شركة رمز الإبداع. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* ── Right Panel: Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="size-12 brand-gradient rounded-2xl flex items-center justify-center">
            <Icon name="home_work" className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">رمز الإبداع</h1>
            <p className="text-xs text-slate-500">برنامج إدارة الأملاك</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              تسجيل الدخول
            </h2>
            <p className="text-slate-500 text-sm">
              مرحباً بك — يرجى تسجيل الدخول للمتابعة
            </p>
          </div>

          {/* Stats badges */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { value: "٦٠+", label: "تقريراً" },
              { value: "١٣", label: "طبقة أمان" },
              { value: "٩٩.٩٪", label: "وقت تشغيل" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100"
              >
                <p className="text-lg font-bold text-primary">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 brand-gradient text-white rounded-2xl font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <Icon name="admin_panel_settings" className="text-2xl" />
                <span>دخول المدير بحساب Google</span>
              </>
            )}
          </motion.button>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700"
              >
                <Icon name="error" className="text-lg shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portals */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-4 font-medium">بوابات أخرى</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "بوابة المستأجر", icon: "person", view: "tenant_dashboard" as View },
                { label: "بوابة المالك",  icon: "business_center", view: "owner_dashboard" as View },
              ].map((portal) => (
                <button
                  key={portal.view}
                  onClick={() => onSelect(portal.view)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary-50 transition-all text-sm font-medium"
                >
                  <Icon name={portal.icon} className="text-base" />
                  <span>{portal.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

