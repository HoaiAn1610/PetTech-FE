import { Star, FileText, Printer, Weight, Thermometer, Heart, Activity, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { ClinicVitalBadge } from "@/components/clinic/ClinicVitalBadge";

interface PatientHeaderProps {
  dateStr: string;
  timeStr: string;
}

export function PatientHeader({ dateStr, timeStr }: PatientHeaderProps) {
  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
    >
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      
      <div className="relative z-10 px-10 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Patient Avatar & Status */}
          <div className="relative flex-shrink-0 group">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1668329581616-c5687628749f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Bella"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-green-500 border-4 border-[#0f172a] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-5xl font-black text-white tracking-tighter">Bella</h2>
                  <div className="px-4 py-1.5 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-200 text-[0.7rem] font-black uppercase tracking-widest shadow-lg shadow-orange-500/10">
                    🏅 Gold Member
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-[0.7rem] font-black uppercase tracking-widest">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    Bệnh nhân thân thiết
                  </div>
                </div>
                <p className="text-blue-100/60 font-medium mt-3 text-lg">
                  Golden Retriever · Cái · Đã triệt sản · 3 tuổi 4 tháng
                </p>
                
                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  {[
                    { label: "ID: PET-00382", color: "bg-white/10 text-white/80" },
                    { label: "Chủ: Sarah Lee", color: "bg-white/10 text-white/80" },
                    { label: "BS: BS. Sarah Lee", color: "bg-blue-500/20 text-blue-200 border border-blue-500/30" }
                  ].map((c) => (
                    <span key={c.label} className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight ${c.color}`}>
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[0.7rem] font-black text-green-300 uppercase tracking-widest">Đang khám</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-[0.75rem] font-bold">
                    Lần khám #14 · {timeStr}
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-blue-900 font-black text-[0.8rem] hover:bg-blue-50 transition-colors shadow-xl">
                    <Printer className="w-4 h-4" />
                    In đơn
                  </button>
                </div>
                <span className="text-[0.65rem] font-bold text-white/20 uppercase tracking-widest mt-2">{dateStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12">
          <ClinicVitalBadge icon={Weight}      label="CÂN NẶNG"   value="14.2" unit="kg"   color="#a78bfa" bg="rgba(167,139,250,0.15)" />
          <ClinicVitalBadge icon={Thermometer} label="NHIỆT ĐỘ"   value="38.5" unit="°C"   color="#fb923c" bg="rgba(251,146,60,0.15)"  />
          <ClinicVitalBadge icon={Heart}        label="NHỊP TIM"   value="88"   unit="bpm"  color="#f87171" bg="rgba(248,113,113,0.15)" />
          <ClinicVitalBadge icon={Activity}    label="NHỊP THỞ"   value="22"   unit="/ph"  color="#4ade80" bg="rgba(74,222,128,0.15)"  />
          <div className="col-span-2 lg:col-span-1 flex items-center gap-4 px-6 py-4 rounded-[1.5rem] bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-black text-green-300 tracking-tight">CHỈ SỐ BÌNH THƯỜNG</p>
              <p className="text-[0.65rem] font-bold text-green-300/50 mt-0.5">BCS 5/9 · Cân nặng lý tưởng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
