import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface ClinicStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg?: string;
  description?: string;
  trend?: string;
  trendPos?: boolean;
}

export function ClinicStatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  description,
  trend,
  trendPos,
}: ClinicStatCardProps) {
  const finalBg = bg || `${color}15`;

  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-3xl bg-white transition-all hover:shadow-xl group"
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ background: finalBg }}
        >
          <Icon className="w-6 h-6" style={{ color: color }} />
        </div>
        
        {trend && (
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[0.65rem] font-black uppercase tracking-wider ${
              trendPos ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {trendPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p
          className="text-gray-900"
          style={{
            fontSize: "1.8rem",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          className="text-gray-400 mt-1"
          style={{
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </p>
        
        {description && (
          <p className="text-gray-400 mt-2 text-[0.7rem] font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

