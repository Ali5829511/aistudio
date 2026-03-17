import React from "react";
import { View } from "../../types";
import { Icon } from "./Icon";

export const PageHeader = ({
  title,
  subtitle,
  onBack,
  backView,
  onSelect,
  actions,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backView?: View;
  onSelect?: (v: View) => void;
  actions?: React.ReactNode;
}) => {
  const handleBack = () => {
    if (onBack) return onBack();
    if (onSelect && backView) onSelect(backView);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {(onBack || backView) && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center size-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            <Icon name="arrow_forward_ios" className="text-sm" />
          </button>
        )}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
