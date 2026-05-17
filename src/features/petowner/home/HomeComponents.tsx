import { Link } from "react-router";
import { 
  CalendarDays, Clock, ArrowRight, Star, ChevronRight 
} from "lucide-react";

// ─── Home Stats Card ──────────────────────────────────────────────────────────
export function HomeStatsCard({ points }: { points: number }) {
  const progress = Math.min((points / 500) * 100, 100);
  return (
    <Link to="/petowner/loyalty" className="block group">
      <div
        className="rounded-[2rem] px-8 py-8 flex flex-col gap-6 h-full transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#f59e0b,#F97316)", boxShadow: "0 15px 35px rgba(249,115,22,0.3)" }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
        <div className="flex items-center justify-between relative z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
            <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hạng Bạc</span>
          </div>
        </div>
        <div className="relative z-10">
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: "0.05em" }}>ĐIỂM TÍCH LŨY</p>
          <div className="flex items-baseline gap-2">
            <p style={{ fontSize: "3rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>{points}</p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>PTS</p>
          </div>
        </div>
        <div className="relative z-10 mt-auto">
          <div className="h-3 rounded-full bg-black/10 backdrop-blur-sm p-0.5 mb-3">
            <div className="h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%`, background: "white", boxShadow: "0 0 10px rgba(255,255,255,0.5)" }} />
          </div>
          <div className="flex items-center justify-between">
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
              {500 - points} điểm nữa lên Vàng 🥇
            </p>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Upcoming Appointment Card ────────────────────────────────────────────────
export function UpcomingApptCard({ appt }: { appt: any }) {
  return (
    <div className="rounded-[2rem] bg-white p-8 flex flex-col gap-5 border border-gray-100 shadow-sm transition-all hover:shadow-xl group"
      style={{ minHeight: "180px" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase" }}>Sắp diễn ra</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <CalendarDays className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" 
          style={{ background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.15)" }}>
          ✂️
        </div>
        <div className="min-w-0">
          <h4 className="truncate" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>{appt.service}</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Cho {appt.pet} · {appt.vet}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
          <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>{appt.date}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>{appt.time}</span>
        </div>
      </div>
      <button
        className="w-full py-3.5 rounded-2xl mt-auto transition-all hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-100"
        style={{ background: "#fef2f2", fontSize: "0.85rem", fontWeight: 800, color: "#ef4444" }}
      >
        Hủy hoặc dời lịch
      </button>
    </div>
  );
}

// ─── Home Activity List ───────────────────────────────────────────────────────
export function HomeActivityList({ activities }: { activities: any[] }) {
  return (
    <div className="rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
        <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Hoạt động gần đây</h4>
        <Link to="/petowner/history" className="text-[0.75rem] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Xem tất cả →</Link>
      </div>
      <div className="flex flex-col divide-y divide-gray-50">
        {activities.map(a => (
          <div key={a.id} className="flex items-center gap-4 px-8 py-4.5 hover:bg-gray-50/50 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>{a.title}</p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{a.sub}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#cbd5e1" }}>{a.date}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider"
                style={{
                  background: a.type === "visit" ? "rgba(37,99,235,0.08)" : "rgba(249,115,22,0.08)",
                  color: a.type === "visit" ? "#2563EB" : "#F97316",
                }}>
                {a.type === "visit" ? "Clinic" : "Shop"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
