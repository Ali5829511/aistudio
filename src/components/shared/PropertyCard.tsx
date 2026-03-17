import React from "react";
import { motion } from "motion/react";
import { View } from "../../types";
import { cn, toArabicDigits } from "../../utils";
import { Icon } from "./Icon";

export const PropertyCard: React.FC<{
  property: any;
  onSelectProperty: (view: View, prop: any) => void;
}> = ({ property, onSelectProperty }) => {
  // Determine status color and label
  let statusColor = "bg-green-100 text-green-700";
  let statusLabel = "متاح";
  if (property.status === "نشط") {
    statusColor = "bg-blue-100 text-blue-700";
    statusLabel = "مؤجر بالكامل";
  } else if (property.status === "صيانة") {
    statusColor = "bg-amber-100 text-amber-700";
    statusLabel = "تحت الصيانة";
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelectProperty("property_details", property)}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group flex flex-col"
    >
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${property.id}/600/400`}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>

        {/* Status Indicator */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${statusColor}`}
        >
          {statusLabel}
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
          {property.type}
        </div>

        <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
          <div className="space-y-1">
            <h4 className="font-black text-lg text-white drop-shadow-md">
              {property.name}
            </h4>
            <p className="text-white/90 text-xs font-bold flex items-center gap-1">
              <Icon name="location_on" className="text-sm text-primary" />
              {property.location}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty("property_report", property);
              }}
              className="size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-primary hover:text-brand-dark transition-all"
              title="تقرير العقار"
            >
              <Icon name="description" className="text-lg" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                (window as any).selectProperty(property);
                setTimeout(() => window.print(), 500);
              }}
              className="size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-brand-yellow hover:text-brand-dark transition-all"
              title="طباعة سريعة"
            >
              <Icon name="print" className="text-lg" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
              <Icon name="door_front" className="text-lg" />
            </div>
            <span className="text-xs font-black text-slate-600">
              {toArabicDigits(property.units)} وحدة
            </span>
          </div>
          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-brand-dark transition-all">
            <Icon name="arrow_back" className="text-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
