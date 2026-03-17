import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon, BottomNav, Logo, ImageCarousel, ReportLayout, PropertyCard } from "../components/shared";

export const MessageTemplatesScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [sendModal, setSendModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [previewModal, setPreviewModal] = useState<typeof MSG_TEMPLATES[0] | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('SMS');

  const categories = ['الكل', 'عقود', 'مالية', 'صيانة', 'عام'];
  const filtered = activeCategory === 'الكل' ? MSG_TEMPLATES : MSG_TEMPLATES.filter(t => t.category === activeCategory);

  const recipientBadge = (r: string) => {
    if (r === 'مستأجر') return 'bg-blue-50 text-blue-600';
    if (r === 'مالك') return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-100 text-slate-500';
  };

  const handleSend = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setSendModal(null);
      setSelectedRecipient('');
      setSelectedChannel('SMS');
    }, 1800);
  };

  const categoryCount = (cat: string) => cat === 'الكل'
    ? MSG_TEMPLATES.length
    : MSG_TEMPLATES.filter(t => t.category === cat).length;

  return (
    <div className="min-h-screen bg-[#f8f8f5] pb-24">
      <header className="flex items-center justify-between p-4 bg-brand-dark sticky top-0 z-30 shadow-xl">
        <button onClick={() => onSelect('manager_dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all">
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-black text-white">قوالب الرسائل الآلية</h2>
          <p className="text-[10px] text-primary font-bold">{toArabicDigits(MSG_TEMPLATES.length)} قالب جاهز</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl gold-gradient text-brand-dark shadow-lg shadow-primary/20">
          <Icon name="mail_outline" className="text-xl" />
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'العقود', count: MSG_TEMPLATES.filter(t => t.category === 'عقود').length, icon: 'history_edu', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'المالية', count: MSG_TEMPLATES.filter(t => t.category === 'مالية').length, icon: 'payments', color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'الصيانة', count: MSG_TEMPLATES.filter(t => t.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'عام', count: MSG_TEMPLATES.filter(t => t.category === 'عام').length, icon: 'campaign', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-1.5">
              <div className={cn("size-8 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                <Icon name={s.icon} className="text-base" />
              </div>
              <p className="text-lg font-black text-brand-dark">{toArabicDigits(s.count)}</p>
              <p className="text-[9px] font-bold text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Auto notice */}
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3">
          <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0 text-primary">
            <Icon name="auto_mode" className="text-base" />
          </div>
          <p className="text-xs font-bold text-brand-dark">القوالب المميزة بـ <span className="text-primary">آلي</span> تُرسَل تلقائياً عند تحقق الشرط (انتهاء عقد، تأخر سداد، إلخ)</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                {toArabicDigits(categoryCount(cat))}
              </span>
            </button>
          ))}
        </div>

        {/* Templates list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((tmpl) => (
            <motion.div
              key={tmpl.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", tmpl.bg, tmpl.color)}>
                    <Icon name={tmpl.icon} className="text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-black text-sm text-brand-dark">{tmpl.title}</h4>
                      {tmpl.auto && (
                        <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Icon name="auto_mode" className="text-[10px]" /> آلي
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(tmpl.recipient))}>
                        {tmpl.recipient}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{tmpl.category}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded-lg">{tmpl.preview}</p>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => setPreviewModal(tmpl)}
                  className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Icon name="visibility" className="text-sm" /> معاينة كاملة
                </button>
                <button
                  onClick={() => setSendModal(tmpl)}
                  className={cn("py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors", tmpl.color, "hover:opacity-80")}
                >
                  <Icon name="send" className="text-sm" /> إرسال
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("size-12 rounded-xl flex items-center justify-center", previewModal.bg, previewModal.color)}>
                  <Icon name={previewModal.icon} className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-black text-brand-dark">{previewModal.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", recipientBadge(previewModal.recipient))}>{previewModal.recipient}</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{previewModal.category}</span>
                    {previewModal.auto && <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">آلي</span>}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                <p className="text-sm text-slate-600 leading-loose font-medium">{previewModal.preview}</p>
              </div>
              <p className="text-[10px] text-slate-400 text-center mb-4">القيم داخل [الأقواس] ستُعوَّض تلقائياً بالبيانات الفعلية عند الإرسال</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPreviewModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إغلاق</button>
                <button onClick={() => { setPreviewModal(null); setSendModal(previewModal); }} className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg", "bg-brand-dark")}>
                  <Icon name="send" className="text-sm" /> إرسال الآن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Modal */}
      <AnimatePresence>
        {sendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            onClick={() => { if (!sendSuccess) setSendModal(null); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            >
              {sendSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-6 text-center">
                  <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Icon name="check_circle" className="text-5xl" />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark mb-1">تم الإرسال بنجاح!</h3>
                  <p className="text-sm text-slate-500">تم إرسال الرسالة إلى المستلمين المحددين</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-black text-brand-dark text-lg mb-1">إرسال الرسالة</h3>
                  <p className="text-xs text-slate-400 mb-5">{sendModal.title}</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">اختر المستلمين</label>
                      <div className="space-y-2">
                        {sendModal.recipient === 'الجميع' ? (
                          ['جميع المستأجرين', 'جميع الملاك', 'مستأجرو عقار محدد', 'مستأجر واحد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : sendModal.recipient === 'مستأجر' ? (
                          ['جميع المستأجرين', 'مستأجرو عقار محدد', 'مستأجر واحد محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        ) : (
                          ['جميع الملاك', 'مالك محدد'].map((opt) => (
                            <button key={opt} onClick={() => setSelectedRecipient(opt)} className={cn("w-full p-3 rounded-xl border text-sm font-bold text-right transition-all", selectedRecipient === opt ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:bg-slate-50')}>
                              {opt}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">قناة الإرسال</label>
                      <div className="flex gap-2">
                        {[{ label: 'SMS', icon: 'sms' }, { label: 'بريد', icon: 'email' }, { label: 'إشعار', icon: 'notifications' }].map((ch) => (
                          <button key={ch.label} onClick={() => setSelectedChannel(ch.label)} className={cn("flex-1 py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all", selectedChannel === ch.label ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5')}>
                            <Icon name={ch.icon} className="text-base" />
                            {ch.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button onClick={() => setSendModal(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                    <button
                      disabled={!selectedRecipient}
                      onClick={handleSend}
                      className={cn("py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all", selectedRecipient ? "bg-brand-dark shadow-brand-dark/20 hover:opacity-90" : "bg-slate-300 cursor-not-allowed")}
                    >
                      <Icon name="send" className="text-sm" /> إرسال
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="manager_dashboard" onSelect={onSelect} />
    </div>
  );
};
