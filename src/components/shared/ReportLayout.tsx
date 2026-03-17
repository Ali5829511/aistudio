import React from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export const ReportLayout = ({
  children,
  title,
  onBack,
}: {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}) => {
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error("Print failed", e);
      // Fallback for some environments
      const printContent = document.querySelector("main")?.innerHTML;
      if (printContent) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(
            `<html><head><title>${title}</title></head><body>${printContent}</body></html>`,
          );
          printWindow.document.close();
          printWindow.print();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] print:bg-white pb-24 print:pb-0">
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-30 shadow-sm border-b border-primary/10 print:hidden">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Icon name="arrow_forward" className="text-2xl" />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            title="طباعة التقرير"
          >
            <Icon name="print" />
          </button>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block relative h-48 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center">
            <Logo className="size-28" />
            <h1 className="mt-4 text-2xl font-black text-brand-dark">
              شركة رمز الإبداع لإدارة الأملاك
            </h1>
          </div>
          {/* Decorative Arcs */}
          <div className="absolute -left-20 top-0 size-64 border-[16px] border-primary rounded-full opacity-20"></div>
          <div className="absolute -right-20 bottom-0 size-64 border-[16px] border-brand-dark rounded-full opacity-20"></div>
        </div>
      </div>

      <main className="p-4 print:p-0 space-y-6">
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-100 pb-4">
          <h2 className="text-xl font-black text-brand-dark inline-block px-8 py-2 bg-slate-50 rounded-lg">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            تاريخ التقرير: {new Date().toLocaleDateString("ar-SA")}
          </p>
        </div>
        {children}
      </main>

      {/* Print Footer */}
      <div className="hidden print:block fixed bottom-0 left-0 right-0 h-16 bg-brand-dark">
        <div className="absolute inset-y-0 left-0 w-32 bg-primary skew-x-[-30deg] -ml-16"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-primary skew-x-[30deg] -mr-16"></div>
        <div className="flex justify-center items-center h-full gap-8 text-[10px] font-bold text-white relative z-10">
          <div className="flex items-center gap-2">
            <Icon name="call" className="text-primary text-sm" />
            <span>920013517</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="mail" className="text-primary text-sm" />
            <span>info@ramzabdae.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="language" className="text-primary text-sm" />
            <span>www.ramzabdae.com</span>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 left-6 flex flex-col gap-3 print:hidden z-50">
        <button
          onClick={handlePrint}
          className="bg-brand-dark text-primary p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all font-bold"
        >
          <Icon name="print" />
          <span className="hidden md:inline">طباعة التقرير</span>
        </button>
        <button className="bg-primary text-brand-dark p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all font-bold">
          <Icon name="share" />
          <span className="hidden md:inline">مشاركة</span>
        </button>
      </div>
    </div>
  );
};
