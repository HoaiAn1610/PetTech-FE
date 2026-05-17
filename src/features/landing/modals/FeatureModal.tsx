import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { FEATURE_DETAILS } from "@/data/landingData";
import { cn } from "@/components/ui/utils";

interface FeatureModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onBookDemo: () => void;
}

export function FeatureModal({ type, isOpen, onClose, onBookDemo }: FeatureModalProps) {
  const f = FEATURE_DETAILS[type];
  if (!f) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={f.title}
      subtitle={f.tag}
      maxWidth="4xl"
    >
      <div className="flex flex-col lg:flex-row bg-white">
        {/* Left: Info */}
        <div className="flex-1 p-8 lg:p-12 space-y-10">
          <div className="space-y-4">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest"
              style={{ color: f.color, background: f.bg }}
            >
              {f.tag}
            </div>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              {f.desc}
            </p>
          </div>

          <div className="grid gap-4">
            {f.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                  {b.icon}
                </span>
                <span className="text-[0.95rem] font-medium text-gray-700 leading-normal pt-1">
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          <div 
            className="flex items-center gap-6 p-8 rounded-[2.5rem] relative overflow-hidden"
            style={{ background: f.bg }}
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)`, transform: "translate(20%, -20%)" }}
            />
            <p 
              className="text-6xl font-black tracking-tighter"
              style={{ color: f.color }}
            >
              {f.stat}
            </p>
            <p className="text-sm font-bold text-gray-900 max-w-[140px] leading-snug">
              {f.statLabel}
            </p>
          </div>

          <Button 
            onClick={() => { onClose(); onBookDemo(); }}
            className="w-full h-14 rounded-2xl text-lg font-black text-white shadow-xl active:scale-[0.98] transition-all"
            style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`, boxShadow: `0 10px 25px ${f.color}30` }}
          >
            Xem thực tế trong Demo <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-gray-50/50 p-4 lg:p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${f.color} 0%, transparent 70%)` }} />
          
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/10 rounded px-4 py-1 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[0.6rem] font-bold text-white/50 tracking-widest uppercase">
                    app.pettech.io/live
                  </span>
                </div>
              </div>
            </div>
            <ImageWithFallback 
              src={f.screenshot} 
              alt={f.title}
              className="w-full aspect-[4/5] object-cover" 
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

