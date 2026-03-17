import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTIES, MAINTENANCE_REQUESTS, UNITS, TENANTS, OWNERS, CONTRACTS, INVOICES, VENDORS, MSG_TEMPLATES, PROPERTY_FORMS } from "../constants/data";
import { Icon } from "../components/shared";

export const PropertyFormsScreen = ({ onSelect, initialCategory = 'الكل' }: { onSelect: (v: View) => void; initialCategory?: string }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openForm, setOpenForm] = useState<typeof PROPERTY_FORMS[0] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['الكل', 'عقارات', 'مالية', 'صيانة', 'خدمات'];
  const filtered = activeCategory === 'الكل' ? PROPERTY_FORMS : PROPERTY_FORMS.filter(f => f.category === activeCategory);

  const categoryBadgeStyle = (cat: string) => {
    if (cat === 'عقارات') return 'bg-blue-50 text-blue-600';
    if (cat === 'مالية') return 'bg-emerald-50 text-emerald-600';
    if (cat === 'صيانة') return 'bg-orange-50 text-orange-600';
    return 'bg-purple-50 text-purple-600';
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setOpenForm(null);
      setFormValues({});
    }, 1800);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'عقارات', count: PROPERTY_FORMS.filter(f => f.category === 'عقارات').length, icon: 'apartment', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'مالية', count: PROPERTY_FORMS.filter(f => f.category === 'مالية').length, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'صيانة', count: PROPERTY_FORMS.filter(f => f.category === 'صيانة').length, icon: 'build', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'خدمات', count: PROPERTY_FORMS.filter(f => f.category === 'خدمات').length, icon: 'star', color: 'text-purple-600', bg: 'bg-purple-50' },
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

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeCategory === cat
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Forms list */}
        <AnimatePresence mode="popLayout">
          {filtered.map((form) => (
            <motion.div
              key={form.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0", form.bg, form.color)}>
                  <Icon name={form.icon} className="text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-black text-sm text-brand-dark leading-snug">{form.title}</h4>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full shrink-0", categoryBadgeStyle(form.category))}>{form.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mb-2">{form.desc}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] text-slate-400 font-bold">الحقول:</span>
                    {form.fields.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">{f.label}</span>
                    ))}
                    {form.fields.length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{form.fields.length - 3} أخرى</span>}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <button
                  onClick={() => { setOpenForm(form); setFormValues({}); setSubmitSuccess(false); }}
                  className="py-3 text-xs font-bold text-primary flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-colors"
                >
                  <Icon name="edit_document" className="text-sm" /> تعبئة النموذج
                </button>
                <button onClick={() => window.print()} className="py-3 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
                  <Icon name="print" className="text-sm" /> طباعة فارغ
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form Fill Modal */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => { if (!submitSuccess) setOpenForm(null); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {submitSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-16 text-center px-6">
                  <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Icon name="check_circle" className="text-6xl" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2">تم الحفظ!</h3>
                  <p className="text-sm text-slate-500">تم حفظ النموذج وإرساله بنجاح</p>
                </motion.div>
              ) : (
                <>
                  <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center", openForm.bg, openForm.color)}>
                      <Icon name={openForm.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-brand-dark text-sm">{openForm.title}</h3>
                      <p className="text-[10px] text-slate-400">{openForm.fields.length} حقول</p>
                    </div>
                    <button onClick={() => setOpenForm(null)} className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
                    {/* Property & unit selectors */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">العقار</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر العقار</option>
                          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">الوحدة</label>
                        <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="">اختر الوحدة</option>
                          {UNITS.map(u => <option key={u.id} value={u.id}>{u.id} - {u.type}</option>)}
                        </select>
                      </div>
                    </div>

                    {openForm.fields.map((field, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          >
                            <option value="">اختر...</option>
                            {(field.options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        ) : field.type === 'file' ? (
                          <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-slate-50 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Icon name="attach_file" className="text-2xl mb-1" />
                            <span className="text-xs font-bold">اضغط لإرفاق الملف</span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={`أدخل ${field.label}...`}
                            value={formValues[field.label] || ''}
                            onChange={e => setFormValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}

                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setOpenForm(null)} className="py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">إلغاء</button>
                      <button type="submit" className="py-3 rounded-xl bg-brand-dark text-white text-sm font-bold shadow-lg shadow-brand-dark/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Icon name="save" className="text-sm" /> حفظ وإرسال
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
