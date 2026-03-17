import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { PROPERTY_CONTEXT, AI_QUICK_PROMPTS, PUBLISH_PLATFORMS } from "../constants/config";
import { Icon } from "../components/shared";

export const AIAssistantScreen = ({ onSelect }: { onSelect: (v: View) => void }) => {
  const updateMaintenanceStatus = async (id: string, status: string) => { console.log('updateMaintenanceStatus', id, status); };
  const recordPayment = async (tenantId: string) => { console.log('recordPayment', tenantId); };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      sender: 'assistant',
      text: 'مرحباً! أنا مساعدك الذكي لإدارة الأملاك 🏢\n\nأستطيع مساعدتك في:\n• تحليل بيانات عقاراتك ومستأجريك\n• الإجابة على استفسارات المحاسبة والصيانة\n• اقتراح تحسينات وتطوير للتطبيق\n• تقديم توصيات لزيادة الإيرادات\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(1).map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

      // Call secure backend endpoint that communicates with Gemini using server-side API key
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          prompt: text.trim(),
          systemInstruction: PROPERTY_CONTEXT,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || 'فشل طلب الدردشة إلى الخادم');
      }

      const data: { text?: string } = await response.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text ?? 'لم أتمكن من الحصول على إجابة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `⚠️ ${errMsg}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col">
      {/* Header */}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex gap-3", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.sender === 'assistant'
                  ? "gold-gradient text-brand-dark shadow-sm"
                  : "bg-brand-dark text-white"
              )}>
                <Icon
                  name={msg.sender === 'assistant' ? 'auto_awesome' : 'person'}
                  className="text-sm"
                  filled
                />
              </div>

              {/* Bubble */}
              <div className={cn(
                "max-w-[80%] space-y-1",
                msg.sender === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                  msg.sender === 'assistant'
                    ? "bg-white border border-gray-100 text-slate-800 rounded-tr-none"
                    : "bg-brand-dark text-white rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <p className={cn(
                  "text-[9px] text-slate-400 px-1",
                  msg.sender === 'user' ? "text-right" : "text-left"
                )}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full gold-gradient text-brand-dark flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Icon name="auto_awesome" className="text-sm" filled />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Prompts + Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        {/* Quick Prompts strip */}
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-2 no-scrollbar">
          {AI_QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p.text)}
              disabled={isLoading}
              className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary disabled:opacity-40 transition-colors"
            >
              <Icon name={p.icon} className="text-[12px]" />
              {p.text}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="flex items-end gap-3 px-4 pt-1">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-end gap-2 focus-within:border-primary/50 focus-within:bg-white transition-colors">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
              placeholder="اكتب سؤالك هنا... (Enter للإرسال)"
              rows={1}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 resize-none outline-none bg-transparent max-h-28"
              style={{ overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={() => sendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-md",
              isLoading || !inputText.trim()
                ? "bg-slate-200 text-slate-400"
                : "gold-gradient text-brand-dark hover:shadow-primary/30"
            )}
          >
            {isLoading
              ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              : <Icon name="send" className="text-xl" filled />
            }
          </button>
        </div>
      </div>
    </div>
  );
};
