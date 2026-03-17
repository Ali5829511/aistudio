import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTY_CONTEXT, AI_QUICK_PROMPTS, PUBLISH_PLATFORMS } from "../constants/config";
import { Icon } from "../components/shared";

export const PublishingScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    setAiError('');
    setAiResponse('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('فشل الطلب إلى خادم الذكاء الاصطناعي');
      }

      const data = await response.json();
      const text =
        (typeof data?.text === 'string' && data.text) ||
        (typeof data?.response === 'string' && data.response) ||
        '';

      setAiResponse(text || 'لا توجد استجابة');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setAiError(`تعذّر الاتصال بالذكاء الاصطناعي: ${msg}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const quickPrompts = [
    'كيف أضيف صفحة جديدة للمشروع؟',
    'كيف أعدّل الألوان والثيم الرئيسي؟',
    'اقترح تحسينات لشاشة لوحة التحكم',
    'كيف أربط قاعدة بيانات حقيقية؟',
    'أضف ميزة إشعارات الدفع للمشروع',
  ];

  return (


      <div className="p-4 md:p-6 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-bl from-violet-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name="rocket_launch" className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold">انشر مشروعك للعالم</h3>
              <p className="text-[11px] text-violet-200">اختر منصة النشر المناسبة واستخدم الذكاء الاصطناعي لتعديل المشروع</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-2">
            <Icon name="check_circle" className="text-green-300 text-sm" />
            <p className="text-[10px] text-violet-100">ملفات الإعداد: <code className="font-mono">vercel.json</code> و <code className="font-mono">netlify.toml</code> جاهزة في المشروع</p>
          </div>
        </div>

        {/* Platforms */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 px-1">منصات النشر المتاحة</h3>
          <div className="grid grid-cols-1 gap-3">
            {PUBLISH_PLATFORMS.map((platform, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlatform(selectedPlatform === i ? null : i)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${platform.bg} ${platform.color} flex items-center justify-center shrink-0`}>
                    <Icon name={platform.icon} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-sm">{platform.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${platform.badgeColor}`}>{platform.badge}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{platform.desc}</p>
                  </div>
                  <Icon name={selectedPlatform === i ? 'expand_less' : 'expand_more'} className="text-gray-300" />
                </div>
                <AnimatePresence>
                  {selectedPlatform === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                        <h5 className="text-[11px] font-bold text-gray-500">خطوات النشر:</h5>
                        <ol className="space-y-1.5">
                          {platform.steps.map((step, si) => (
                            <li key={si} className="flex items-start gap-2 text-[11px] text-gray-600">
                              <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{si + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:underline"
                        >
                          <Icon name="open_in_new" className="text-[13px]" />
                          افتح {platform.name}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Project Editor */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
              <Icon name="auto_awesome" className="text-violet-600 text-sm" />
            </div>
            <h3 className="text-sm font-bold">مساعد الذكاء الاصطناعي لتعديل المشروع</h3>
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setAiPrompt(prompt)}
                className="shrink-0 text-[10px] font-medium bg-white border border-violet-100 text-violet-700 px-3 py-1.5 rounded-full hover:bg-violet-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAiRequest(); }}
              placeholder="اكتب طلبك لتعديل أو تحسين المشروع... (Ctrl+Enter للإرسال)"
              rows={3}
              className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none border-none bg-transparent"
            />
            <div className="flex items-center justify-between border-t border-gray-50 pt-2">
              <p className="text-[9px] text-gray-300">مدعوم بـ Gemini AI</p>
              <button
                onClick={handleAiRequest}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="flex items-center gap-1.5 bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAiLoading
                  ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> جاري التحليل...</>
                  : <><Icon name="auto_awesome" className="text-sm" /> اسأل الذكاء الاصطناعي</>
                }
              </button>
            </div>
          </div>

          {/* AI Response */}
          {aiError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <Icon name="error_outline" className="text-red-500 text-sm mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{aiError}</p>
            </div>
          )}
          {aiResponse && (
            <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Icon name="auto_awesome" className="text-violet-600 text-xs" />
                </div>
                <p className="text-xs font-bold text-violet-700">اقتراح الذكاء الاصطناعي</p>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </section>
      </div>
  );
};
