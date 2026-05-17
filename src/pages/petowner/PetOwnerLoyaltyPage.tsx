import { useState } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Star, Zap, Gift, Check, Crown,
  Share2, TrendingUp, Sparkles, BadgeCheck, Copy
} from "lucide-react";
import { RedeemModal } from "@/features/petowner/loyalty/LoyaltyComponents";

const USER_POINTS = 450;

const TIERS = [
  { id: "bronze", label: "Đồng",   icon: "🥉", min: 0,    max: 199,       color: "#92400e", bg: "rgba(146,64,14,0.08)",   benefits: ["Giảm 5% cắt lông", "Quà tặng sinh nhật thú cưng", "Bản tin hàng tháng"] },
  { id: "silver", label: "Bạc",    icon: "🥈", min: 200,  max: 499,       color: "#6b7280", bg: "rgba(107,114,128,0.08)", benefits: ["Giảm 10% tất cả dịch vụ", "Ưu tiên đặt lịch", "Cắt móng miễn phí (hàng quý)", "Ưu đãi thành viên độc quyền"] },
  { id: "gold",   label: "Vàng",   icon: "🥇", min: 500,  max: 999,       color: "#d97706", bg: "rgba(217,119,6,0.08)",   benefits: ["Giảm 15% tất cả dịch vụ", "Cắt lông miễn phí hàng năm", "Ưu tiên bác sĩ cấp cứu", "Đường dây đặt lịch VIP", "Hộp quà tặng hàng tháng"] },
  { id: "plat",   label: "Bạch kim", icon: "💎", min: 1000, max: Infinity,  color: "#7c3aed", bg: "rgba(124,58,237,0.08)", benefits: ["Giảm 20% tất cả dịch vụ", "Khám sức khỏe miễn phí hàng năm", "Đường dây bác sĩ 24/7", "Quản lý chăm sóc riêng", "Cắt lông miễn phí hàng tháng", "Giỏ quà tặng hàng năm"] },
];

const CURRENT_TIER  = TIERS[1];
const NEXT_TIER_DATA = TIERS[2];

const POINTS_HISTORY = [
  { id: "h1", type: "earn",   desc: "Kiểm tra sức khỏe định kỳ — Buddy",        pts: +85,  date: "25 tháng 2, 2026" },
  { id: "h2", type: "earn",   desc: "Mua tại cửa hàng — Royal Canin 15kg",       pts: +48,  date: "1 tháng 3, 2026"  },
  { id: "h3", type: "earn",   desc: "Cắt lông toàn bộ — Whiskers",               pts: +65,  date: "12 tháng 2, 2026" },
  { id: "h4", type: "earn",   desc: "Tiêm phòng — DHPP + Leptospira",            pts: +55,  date: "25 tháng 2, 2026" },
  { id: "h5", type: "earn",   desc: "Giới thiệu bạn bè — James K.",              pts: +100, date: "20 tháng 1, 2026" },
  { id: "h6", type: "redeem", desc: "Đã đổi: Giảm 10% cắt lông",                pts: -100, date: "12 tháng 1, 2026" },
  { id: "h7", type: "earn",   desc: "Tiêm phòng — Feline FVRCP + Dại",          pts: +60,  date: "10 tháng 1, 2026" },
];

const REWARDS = [
  { id: "r1", title: "Giảm 10% bất kỳ dịch vụ",   cost: 100, category: "Dịch vụ",    emoji: "🏥", desc: "Áp dụng cho một dịch vụ tại phòng khám"      },
  { id: "r2", title: "Cắt móng miễn phí",          cost: 150, category: "Cắt lông",   emoji: "✂️", desc: "Cho bất kỳ thú cưng nào, trong giờ mở cửa"   },
  { id: "r3", title: "Voucher cửa hàng $10",        cost: 200, category: "Mua sắm",    emoji: "🛍️", desc: "Sử dụng khi thanh toán tại cửa hàng thú cưng" },
  { id: "r4", title: "Hộp quà bánh thưởng miễn phí",cost: 250, category: "Quà tặng",  emoji: "🎁", desc: "Hộp bánh thưởng cao cấp được tuyển chọn (trị giá $25+)" },
  { id: "r5", title: "Cắt lông cơ bản miễn phí",   cost: 400, category: "Cắt lông",   emoji: "🛁", desc: "Tắm, sấy khô và cắt cơ bản"                  },
  { id: "r6", title: "Khám sức khỏe miễn phí",     cost: 500, category: "Y tế",       emoji: "🩺", desc: "Khám định kỳ cho một thú cưng"                },
];

const HOW_TO_EARN = [
  { emoji: "🩺", title: "Khám tại phòng khám",   sub: "1 điểm / $1 cho dịch vụ",        pts: "+50–120 điểm" },
  { emoji: "🛍️", title: "Mua hàng tại cửa hàng", sub: "1 điểm / $1 tại cửa hàng",       pts: "+10–200 điểm" },
  { emoji: "👥", title: "Giới thiệu bạn bè",      sub: "Họ tham gia & đặt lịch đầu tiên", pts: "+100 điểm"    },
  { emoji: "📅", title: "Đặt lịch trước",          sub: "Đặt trước 7+ ngày",              pts: "+10 điểm"     },
  { emoji: "⭐", title: "Để lại đánh giá",         sub: "Đánh giá lần khám trong app",    pts: "+25 điểm"     },
  { emoji: "🎂", title: "Tháng sinh nhật thú cưng",sub: "Điểm đôi cả tháng",              pts: "×2 thưởng"    },
];

export default function PetOwnerLoyaltyPage() {
  const [tab,           setTab]           = useState<"rewards" | "history" | "tiers">("rewards");
  const [redeemTarget,  setRedeemTarget]  = useState<typeof REWARDS[0] | null>(null);
  const [referCopied,   setReferCopied]   = useState(false);

  const progress = Math.min(((USER_POINTS - CURRENT_TIER.min) / (NEXT_TIER_DATA.min - CURRENT_TIER.min)) * 100, 100);

  function handleCopyReferral() {
    navigator.clipboard.writeText("https://pettech.app/join?ref=MARIA2024").catch(() => {});
    setReferCopied(true);
    setTimeout(() => setReferCopied(false), 2500);
  }

  return (
    <PetOwnerShell pageTitle="Thành viên & Ưu đãi">
      <div className="max-w-7xl mx-auto flex flex-col gap-8" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Top: Tier Hero + Stats ── */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
          <div className="col-span-2 rounded-[2rem] px-10 py-8 flex flex-col justify-between overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#78350f 0%,#d97706 60%,#f59e0b 100%)", minHeight: "220px", boxShadow: "0 20px 50px rgba(217,119,6,0.3)" }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                <span className="text-xl">{CURRENT_TIER.icon}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hạng {CURRENT_TIER.label}</span>
              </div>
              <Crown className="w-8 h-8 text-yellow-200 drop-shadow-lg" />
            </div>
            <div className="relative z-10">
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: "0.1em" }}>ĐIỂM TÍCH LŨY HIỆN TẠI</p>
              <div className="flex items-baseline gap-3">
                <p style={{ fontSize: "4rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>{USER_POINTS}</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>PTS</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white" }}>🥈 Bạc</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white" }}>🥇 Vàng ({NEXT_TIER_DATA.min} pts)</span>
              </div>
              <div className="h-4 rounded-full bg-black/10 backdrop-blur-sm p-1">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#fff,#fde68a)", boxShadow: "0 0 15px rgba(255,255,255,0.5)" }} />
              </div>
              <p className="mt-3 text-center" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                Bạn đã hoàn thành {Math.round(progress)}% — còn {NEXT_TIER_DATA.min - USER_POINTS} điểm nữa để nâng cấp! 🚀
              </p>
            </div>
          </div>

          {[
            { label: "Đã tích lũy",    value: "660",  sub: "Tổng lịch sử",   color: "#2563EB", bg: "rgba(37,99,235,0.06)",  emoji: "📈" },
            { label: "Đã sử dụng",    value: "100",  sub: "Tổng đổi quà",     color: "#F97316", bg: "rgba(249,115,22,0.06)", emoji: "🎁" },
            { label: "Quà tặng",     value: "1",    sub: "Đã nhận",        color: "#7c3aed", bg: "rgba(124,58,237,0.06)", emoji: "🏆" },
            { label: "Bạn bè",       value: "3",    sub: "Đã giới thiệu",      color: "#16a34a", bg: "rgba(22,163,74,0.06)",  emoji: "👥" },
          ].map(s => (
            <div key={s.label} className="rounded-[1.5rem] p-6 flex flex-col gap-4 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: "white", border: "1.5px solid #f1f5f9" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ background: s.bg }}>
                {s.emoji}
              </div>
              <div>
                <p style={{ fontSize: "2.2rem", fontWeight: 900, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</p>
                <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>{s.label}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─ Tabs ── */}
        <div className="flex gap-2 p-2 rounded-2xl self-start bg-gray-100/50 border border-gray-200">
          {[
            { id: "rewards", label: "🎁 Danh mục đổi quà" },
            { id: "history", label: "📄 Lịch sử điểm"         },
            { id: "tiers",   label: "👑 Đặc quyền hạng" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="px-6 py-3 rounded-xl transition-all font-bold text-sm"
              style={{
                background: tab === t.id ? "white" : "transparent",
                boxShadow: tab === t.id ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                color: tab === t.id ? "#111827" : "#64748b",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── REWARDS TAB ── */}
        {tab === "rewards" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 px-6 py-5 rounded-3xl animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ background: "rgba(249,115,22,0.06)", border: "1.5px solid rgba(249,115,22,0.18)" }}>
              <Sparkles className="w-6 h-6 flex-shrink-0 text-orange-500" />
              <p style={{ fontSize: "0.95rem", color: "#92400e", fontWeight: 600 }}>
                Bạn có <span className="text-orange-600 font-black">{USER_POINTS} điểm</span> khả dụng. Đừng để chúng hết hạn, hãy đổi ngay những món quà hấp dẫn!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {REWARDS.map(r => {
                const canAfford = USER_POINTS >= r.cost;
                return (
                  <div key={r.id} className="rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    style={{ background: "white", border: `2px solid ${canAfford ? "#f1f5f9" : "#f8fafc"}` }}>
                    <div className="px-8 py-7 flex items-start gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                        style={{ background: canAfford ? "rgba(249,115,22,0.06)" : "#f8fafc", boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)" }}>
                        <span className={canAfford ? "" : "grayscale"}>{r.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider bg-gray-50 text-gray-400">
                          {r.category}
                        </span>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: canAfford ? "#1e293b" : "#cbd5e1", marginTop: "6px" }}>
                          {r.title}
                        </h4>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5, fontWeight: 500 }}>{r.desc}</p>
                        <div className="flex items-center gap-2 mt-4">
                          <Zap className="w-4 h-4 text-orange-500" fill="currentColor" />
                          <span style={{ fontSize: "1rem", fontWeight: 900, color: canAfford ? "#ea580c" : "#cbd5e1" }}>
                            {r.cost} <span className="text-[0.7rem] font-bold">PTS</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 pb-7">
                      <button onClick={() => setRedeemTarget(r)}
                        className="w-full py-3.5 rounded-2xl transition-all font-black text-sm uppercase tracking-widest"
                        style={{
                          background: canAfford ? "linear-gradient(135deg,#F97316,#ea580c)" : "#f1f5f9",
                          color: canAfford ? "white" : "#cbd5e1",
                          boxShadow: canAfford ? "0 4px 15px rgba(234,88,12,0.2)" : "none",
                        }}>
                        {canAfford ? "Đổi ngay" : "Chưa đủ điểm"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="flex flex-col gap-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {POINTS_HISTORY.map(h => (
              <div key={h.id} className="flex items-center gap-5 px-8 py-5 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: h.type === "earn" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
                  {h.type === "earn"
                    ? <TrendingUp className="w-5 h-5 text-emerald-600" />
                    : <Gift className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>{h.desc}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>{h.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: h.type === "earn" ? "#10b981" : "#ef4444" }}>
                    {h.pts > 0 ? "+" : ""}{h.pts}
                  </span>
                  <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>PTS</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TIERS TAB ── */}
        {tab === "tiers" && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {TIERS.map(tier => {
              const isCurrent  = tier.id === CURRENT_TIER.id;
              const isAchieved = USER_POINTS >= tier.min;
              return (
                <div key={tier.id} className="rounded-[2rem] overflow-hidden group transition-all duration-300"
                  style={{
                    background: "white",
                    border: isCurrent ? `3px solid ${tier.color}` : "2px solid #f1f5f9",
                    boxShadow: isCurrent ? `0 15px 40px ${tier.color}20` : "0 4px 12px rgba(0,0,0,0.02)",
                  }}>
                  <div className="flex items-center gap-6 px-8 py-7" style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {tier.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1e293b", letterSpacing: "-0.02em" }}>{tier.label}</p>
                        {isCurrent && (
                          <span className="px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-widest animate-pulse"
                            style={{ background: tier.bg, color: tier.color }}>
                            Hiện tại
                          </span>
                        )}
                        {isAchieved && !isCurrent && <BadgeCheck className="w-6 h-6 text-emerald-500" />}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>
                        {tier.max === Infinity ? `${tier.min}+ điểm` : `${tier.min} – ${tier.max} điểm`}
                      </p>
                    </div>
                  </div>
                  <div className="px-8 py-7">
                    <p style={{ fontSize: "0.7rem", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "15px" }}>Đặc quyền hạng</p>
                    <div className="flex flex-col gap-3.5">
                      {tier.benefits.map(b => (
                        <div key={b} className="flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: isAchieved ? tier.bg : "#f8fafc" }}>
                            <Check className="w-3.5 h-3.5" style={{ color: isAchieved ? tier.color : "#e2e8f0" }} strokeWidth={4} />
                          </div>
                          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: isAchieved ? "#334155" : "#cbd5e1" }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom: How to Earn + Referral ── */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* How to earn */}
          <div className="rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
            <div className="px-10 py-7" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#111827" }}>Làm sao để tích điểm?</h3>
            </div>
            <div className="p-8 grid grid-cols-2 gap-4">
              {HOW_TO_EARN.map(h => (
                <div key={h.title} className="flex flex-col gap-3 p-5 rounded-3xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-lg">
                  <span className="text-3xl">{h.emoji}</span>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>{h.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px", fontWeight: 500, lineHeight: 1.4 }}>{h.sub}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-100/50">
                      <Zap className="w-3 h-3 text-orange-500" fill="currentColor" />
                      <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#ea580c" }}>{h.pts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral */}
          <div className="rounded-[2.5rem] overflow-hidden relative group"
            style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)", boxShadow: "0 20px 40px rgba(37,99,235,0.25)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
            <div className="px-10 py-10 flex flex-col gap-8 h-full relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                  <Share2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>Lan tỏa yêu thương</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, marginTop: "2px" }}>Nhận ngay 100 điểm cho mỗi người bạn mới!</p>
                </div>
              </div>

              <div className="flex items-center justify-around py-4">
                <div className="text-center">
                  <p style={{ fontSize: "2.4rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>3</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase" }}>Đã mời</p>
                </div>
                <div className="w-px h-14 bg-white/10" />
                <div className="text-center">
                  <p style={{ fontSize: "2.4rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>300</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase" }}>Pts nhận</p>
                </div>
                <div className="w-px h-14 bg-white/10" />
                <div className="text-center">
                  <p style={{ fontSize: "2.4rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>∞</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase" }}>Vô hạn</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4.5 rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 transition-all hover:bg-white/15">
                <span className="flex-1 truncate font-mono text-sm text-blue-100/90 font-medium tracking-tight">
                  pettech.app/join?ref=MARIA2024
                </span>
                <button onClick={handleCopyReferral}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
                  style={{ background: referCopied ? "#10b981" : "white", color: referCopied ? "white" : "#2563EB", fontSize: "0.85rem", fontWeight: 900 }}>
                  {referCopied ? <Check className="w-4 h-4" strokeWidth={3} /> : <Copy className="w-4 h-4" strokeWidth={3} />}
                  {referCopied ? "Xong!" : "Sao chép"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {redeemTarget && (
        <RedeemModal
          reward={redeemTarget}
          points={USER_POINTS}
          onClose={() => setRedeemTarget(null)}
        />
      )}
    </PetOwnerShell>
  );
}
