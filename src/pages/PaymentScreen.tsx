import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const PaymentScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const updateMaintenanceStatus = async (id: string, status: string) => { console.log('updateMaintenanceStatus', id, status); };
  const recordPayment = async (tenantId: string) => { console.log('recordPayment', tenantId); };
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const paymentMethods = [
    { id: 'mada', label: 'مدى', icon: 'credit_card', desc: 'بطاقة مدى المصرفية' },
    { id: 'sadad', label: 'سداد', icon: 'account_balance', desc: 'خدمة سداد للمدفوعات' },
    { id: 'transfer', label: 'تحويل بنكي', icon: 'send_money', desc: 'تحويل مباشر للحساب' },
  ];

  const paymentHistory = [
    { date: '٢٠٢٤/٠٥/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٤/٠١', amount: '٤,٨٠٠', method: 'سداد', status: 'مكتمل' },
    { date: '٢٠٢٤/٠٣/٠١', amount: '٤,٨٠٠', method: 'مدى', status: 'مكتمل' },
  ];

  return (


      <div className="p-4 md:p-6 space-y-6">
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-6 pt-12 text-center"
          >
            <div className="size-24 gold-gradient rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
              <Icon name="check_circle" className="text-5xl text-brand-dark" filled />
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">تم الدفع بنجاح!</h3>
              <p className="text-sm text-slate-500 font-bold">تم تحصيل دفعة الإيجار لشهر يونيو ٢٠٢٤</p>
            </div>
            <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-right space-y-3">
              {[
                { label: 'المبلغ', value: '٤,٨٠٠ ر.س' },
                { label: 'طريقة الدفع', value: paymentMethods.find(m => m.id === selectedMethod)?.label ?? '' },
                { label: 'التاريخ', value: '٢٠٢٤/٠٦/٠١' },
                { label: 'رقم العملية', value: '#TXN-٢٠٢٤٠٦٠١' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-500">{item.label}:</span>
                  <span className="text-xs font-black text-brand-dark">{item.value}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect('tenant_dashboard')}
              className="w-full py-4 gold-gradient rounded-2xl text-brand-dark font-black text-base shadow-lg shadow-primary/20"
            >
              العودة للرئيسية
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* بطاقة تفاصيل الدفعة */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2.5rem] p-8 dark-gradient text-white shadow-2xl relative overflow-hidden border border-white/5"
            >
              <div className="absolute top-0 right-0 w-48 h-48 gold-gradient opacity-10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="payments" className="text-lg" filled />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">الدفعة المستحقة</p>
                </div>
                <h3 className="text-5xl font-black tracking-tighter mt-1">٤,٨٠٠ <span className="text-xl font-bold text-primary/60">ر.س</span></h3>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[
                    { label: 'الوحدة', value: 'شقة ٤٠٢' },
                    { label: 'تاريخ الاستحقاق', value: '٢٠٢٤/٠٦/٠١' },
                    { label: 'العقار', value: 'برج الياسمين' },
                    { label: 'الشهر', value: 'يونيو ٢٠٢٤' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* طريقة الدفع */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> اختر طريقة الدفع
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right",
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "size-12 rounded-xl flex items-center justify-center transition-all",
                      selectedMethod === method.id ? "gold-gradient text-brand-dark" : "bg-slate-50 text-slate-400"
                    )}>
                      <Icon name={method.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-brand-dark">{method.label}</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="size-6 rounded-full gold-gradient flex items-center justify-center">
                        <Icon name="check" className="text-sm text-brand-dark" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* زر الدفع */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedMethod}
              onClick={() => { if (!selectedMethod) return; setSubmitted(true); recordPayment('1'); /* tenant id=1 is mock logged-in tenant */ }}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg",
                selectedMethod
                  ? "gold-gradient text-brand-dark shadow-primary/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              {selectedMethod ? `ادفع ٤,٨٠٠ ر.س عبر ${paymentMethods.find(m => m.id === selectedMethod)?.label}` : 'اختر طريقة الدفع أولاً'}
            </motion.button>

            {/* سجل المدفوعات */}
            <section className="space-y-4">
              <h3 className="text-base font-black text-brand-dark flex items-center gap-2">
                <span className="size-1.5 bg-primary rounded-full"></span> سجل المدفوعات
              </h3>
              <div className="space-y-3">
                {paymentHistory.map((payment, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Icon name="check_circle" className="text-lg" filled />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-dark">{payment.amount} ر.س</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{payment.date} • {payment.method}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">{payment.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
  );
};
