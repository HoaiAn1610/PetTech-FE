import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle2, ArrowRight } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { cn } from "@/components/ui/utils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function VideoModal({ isOpen, onClose, onRegister }: VideoModalProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { 
            setPlaying(false); 
            clearInterval(intervalRef.current!); 
            return 100; 
          }
          return p + (100 / (120 * 10)); // 2 min = 120s
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const elapsed = Math.round(progress * 1.2);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const highlights = [
    { t: "0:00", label: "Luồng đặt lịch thông minh", icon: "📅" },
    { t: "0:28", label: "Theo dõi sức khỏe real-time", icon: "📡" },
    { t: "0:52", label: "POS & Thanh toán 1-click", icon: "💳" },
    { t: "1:18", label: "Tự động hóa CRM & Marketing", icon: "🎯" },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="PetTech trong 2 phút"
      subtitle="Xem nhanh cách chúng tôi vận hành cơ sở của bạn"
      maxWidth="lg"
    >
      <div className="px-8 py-8 space-y-8 bg-white">
        {/* Video Player Mock */}
        <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900 group shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1559190394-df5a28aab5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
            alt="Demo video thumbnail"
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              playing ? "opacity-60 scale-105" : "opacity-80 scale-100"
            )}
          />
          
          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!playing && progress < 100 && (
              <button 
                onClick={() => setPlaying(true)}
                className="w-24 h-24 rounded-full bg-blue-600/95 flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all"
              >
                <Play className="w-10 h-10 ml-2" fill="currentColor" />
              </button>
            )}
            {playing && (
              <button 
                onClick={() => setPlaying(false)}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pause className="w-8 h-8" fill="currentColor" />
              </button>
            )}
            {progress >= 100 && (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in-90 duration-500">
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-white font-black text-xl tracking-tight">Cảm ơn bạn đã xem!</p>
              </div>
            )}
          </div>

          {/* Indicators */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm shadow-lg">
            <div className={cn("w-2 h-2 rounded-full bg-white", playing && "animate-pulse")} />
            <span className="text-[0.65rem] font-black text-white tracking-widest uppercase">
              {playing ? "ĐANG PHÁT" : "VIDEO DEMO"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-white/70 text-[0.7rem] font-bold">
                <span>{fmt(elapsed)} / 2:00</span>
                <span>CHẾ ĐỘ 4K • PETTECH CLOUD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          <p className="text-[0.7rem] font-black text-gray-400 tracking-widest uppercase">
            CÁC PHẦN TRONG VIDEO
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <button 
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group"
              >
                <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                  {h.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8rem] font-black text-gray-900 leading-tight">{h.label}</p>
                  <p className="text-[0.65rem] font-bold text-blue-600 mt-1">{h.t}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => { onClose(); onRegister(); }}
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg shadow-xl active:scale-[0.98] transition-all"
        >
          Dùng thử miễn phí ngay <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </BaseModal>
  );
}

