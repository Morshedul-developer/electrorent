import React from "react";
import { motion } from "motion/react";
import { Star, MapPin, Layers, ArrowRight } from "lucide-react";
import { Gadget } from "../types";

interface GadgetCardProps {
  gadget: Gadget;
  onInspect: (id: string) => void;
}

export const GadgetCard: React.FC<GadgetCardProps> = ({
  gadget,
  onInspect,
}) => {
  // Status colors mapping
  const statusConfig = {
    Available: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    "Low Stock": {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
    "Rented Out": {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      dot: "bg-rose-400",
    },
  };

  const currentStatus = statusConfig[gadget.status] || statusConfig.Available;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-surface-card rounded-xl border border-border-main hover:border-brand-accent/50 transition-all duration-300 flex flex-col h-[460px] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,82,255,0.06)]"
      id={`gadget-card-${gadget.id}`}
    >
      {/* Visual Image Banner with Status Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-[#151515]">
        <img
          src={gadget.imageUrl}
          alt={gadget.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-bg-dark/80 backdrop-blur-md px-2.5 py-1 rounded border border-border-main text-[10px] font-mono uppercase tracking-wider text-brand-secondary">
          {gadget.category}
        </div>

        {/* Status Dot Pill */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} text-[10px] font-semibold`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`}
          />
          {gadget.status}
        </div>
      </div>

      {/* Card Metadata Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-2.5">
          {/* Rating and Location Header */}
          <div className="flex items-center justify-between text-[11px] text-text-dim">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-text-main">
                {gadget.rating.toFixed(2)}
              </span>
            </div>
            <div
              className="flex items-center gap-1 truncate max-w-[150px]"
              title={gadget.location}
            >
              <MapPin className="w-3 h-3 text-brand-accent" />
              <span className="truncate">{gadget.location.split(",")[0]}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-bold text-text-main group-hover:text-brand-secondary transition-colors line-clamp-2 leading-snug">
            {gadget.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
            {gadget.shortDescription}
          </p>
        </div>

        {/* Pricing, Specifications Snapshot & CTA Footer */}
        <div className="pt-4 border-t border-border-main/60 space-y-3.5">
          {/* Serial Number Snapshot */}
          <div className="flex justify-between items-center text-[10px] font-mono text-text-dim">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Serial Identification:
            </span>
            <span className="text-brand-accent tracking-wide">
              {gadget.serialNumber}
            </span>
          </div>

          {/* Pricing Info & Button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div>
              <div className="text-[10px] uppercase text-text-dim tracking-wider font-mono">
                Day Rate
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-display font-extrabold text-text-main">
                  ${gadget.pricePerDay}
                </span>
                <span className="text-xs text-text-dim ml-0.5">/day</span>
              </div>
            </div>

            <button
              onClick={() => onInspect(gadget.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-primary/15 border border-brand-primary/30 text-brand-accent hover:bg-brand-primary hover:text-text-main hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 transition-all cursor-pointer"
              id={`inspect-btn-${gadget.id}`}
            >
              Configure
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
