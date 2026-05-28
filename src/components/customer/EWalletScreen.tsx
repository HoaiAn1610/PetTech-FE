import { useState } from "react";
import {
  Star,
  Wallet,
  Gift,
  ChevronRight,
  Zap,
  TrendingUp,
  Crown,
  Scissors,
  Syringe,
  Bath,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  PawPrint,
  CheckCircle2,
  Send,
} from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceRecord {
  id: string;
  date: string;
  dateShort: string;
  service: string;
  pet: string;
  price: number;
  points: number;
  beforeImg: string;
  afterImg: string;
  icon: React.ElementType;
  iconColor: string;
  reviewed: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PAST_SERVICES: ServiceRecord[] = [
  {
    id: "s1",
    date: "March 1, 2026",
    dateShort: "Mar 1",
    service: "Full Grooming",
    pet: "Bella",
    price: 65,
    points: 130,
    beforeImg: "https://images.unsplash.com/photo-1624292263729-ff041fe40a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    afterImg:  "https://images.unsplash.com/photo-1608138498905-05b5cd816a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    icon: Scissors,
    iconColor: "#7c3aed",
    reviewed: false,
  },
  {
    id: "s2",
    date: "February 14, 2026",
    dateShort: "Feb 14",
    service: "Spa & Bath",
    pet: "Bella",
    price: 38,
    points: 76,
    beforeImg: "https://images.unsplash.com/photo-1749290053346-9261bfa294e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    afterImg:  "https://images.unsplash.com/photo-1598129113250-318964934885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    icon: Bath,
    iconColor: "#0891b2",
    reviewed: false,
  },
  {
    id: "s3",
    date: "January 22, 2026",
    dateShort: "Jan 22",
    service: "Haircut & Trim",
    pet: "Mochi",
    price: 45,
    points: 90,
    beforeImg: "https://images.unsplash.com/photo-1703368786305-4e1dcfcfd0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    afterImg:  "https://images.unsplash.com/photo-1715894850283-6eea029bdec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    icon: Scissors,
    iconColor: "#F97316",
    reviewed: true,
  },
  {
    id: "s4",
    date: "January 5, 2026",
    dateShort: "Jan 5",
    service: "Vaccination",
    pet: "Bella",
    price: 80,
    points: 160,
    beforeImg: "https://images.unsplash.com/photo-1624292263729-ff041fe40a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    afterImg:  "https://images.unsplash.com/photo-1598129113250-318964934885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    icon: Syringe,
    iconColor: "#16a34a",
    reviewed: true,
  },
];

const TRANSACTIONS = [
  { id: "tx1", label: "Full Grooming – Bella",  amount: -65,  type: "debit",  date: "Mar 1"  },
  { id: "tx2", label: "Points redeemed (200pt)", amount: +20,  type: "credit", date: "Feb 20" },
  { id: "tx3", label: "Spa & Bath – Bella",      amount: -38,  type: "debit",  date: "Feb 14" },
  { id: "tx4", label: "Top-up via Apple Pay",    amount: +100, type: "credit", date: "Feb 10" },
];

// ─── Star Rating Input ────────────────────────────────────────────────────────
function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= (hovered || value);
        return (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className="transition-all duration-100 active:scale-90"
            style={{ transform: filled ? "scale(1.15)" : "scale(1)" }}
          >
            <Star
              className="w-5 h-5 transition-all duration-100"
              style={{
                color: filled ? "#f59e0b" : "#d1d5db",
                fill:  filled ? "#f59e0b" : "none",
                filter: filled ? "drop-shadow(0 0 4px rgba(245,158,11,0.5))" : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Review Panel ─────────────────────────────────────────────────────────────
function ReviewPanel({
  serviceId,
  serviceName,
  onSubmit,
}: {
  serviceId: string;
  serviceName: string;
  onSubmit: (id: string) => void;
}) {
  const [rating, setRating]     = useState(0);
  const [text, setText]         = useState("");
  const [submitted, setSubmit]  = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle2 className="w-8 h-8" style={{ color: "#16a34a" }} />
        <p style={{ fontSize: "0.78rem", fontWeight: 800, color: "#16a34a" }}>Review submitted!</p>
        <p style={{ fontSize: "0.66rem", color: "#9ca3af" }}>Thank you for your feedback 🐾</p>
      </div>
    );
  }

  return (
    <div
      className="mt-3 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fafafa, #f8f6ff)",
        border: "1.5px solid rgba(124,58,237,0.12)",
      }}
    >
      <div
        className="px-4 py-2 flex items-center gap-1.5"
        style={{ background: "rgba(124,58,237,0.06)", borderBottom: "1px solid rgba(124,58,237,0.08)" }}
      >
        <Sparkles className="w-3 h-3" style={{ color: "#7c3aed" }} />
        <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.06em" }}>
          RATE YOUR EXPERIENCE
        </span>
      </div>
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "0.72rem", color: "#374151", fontWeight: 600 }}>
            How was <strong>{serviceName}</strong>?
          </p>
          <StarInput value={rating} onChange={setRating} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell us what you loved… (optional)"
          rows={2}
          className="w-full resize-none outline-none rounded-xl px-3 py-2.5 transition-all"
          style={{
            fontSize: "0.72rem",
            color: "#374151",
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.08)",
            lineHeight: 1.5,
          }}
        />

        <button
          disabled={rating === 0}
          onClick={() => { setSubmit(true); setTimeout(() => onSubmit(serviceId), 600); }}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-150 active:scale-95"
          style={{
            background: rating > 0
              ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
              : "rgba(0,0,0,0.06)",
            boxShadow: rating > 0 ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
            cursor: rating > 0 ? "pointer" : "not-allowed",
          }}
        >
          <Send className="w-3.5 h-3.5" style={{ color: rating > 0 ? "white" : "#9ca3af" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: rating > 0 ? "white" : "#9ca3af" }}>
            Submit Review
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ record }: { record: ServiceRecord }) {
  const [expanded, setExpanded]     = useState(false);
  const [reviewed, setReviewed]     = useState(record.reviewed);
  const [imgExpanded, setImgExpand] = useState<"before" | "after" | null>(null);
  const Icon = record.icon;

  return (
    <div
      className="rounded-3xl overflow-hidden transition-all duration-300"
      style={{
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${record.iconColor}14`, border: `1.5px solid ${record.iconColor}22` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color: record.iconColor }} strokeWidth={2.5} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>
                {record.service}
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: `${record.iconColor}12`,
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: record.iconColor,
                  border: `1px solid ${record.iconColor}25`,
                }}
              >
                {record.pet}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{record.date}</span>
              <span style={{ fontSize: "0.6rem", color: "#d1d5db" }}>·</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#111827" }}>
                ${record.price}
              </span>
              <span style={{ fontSize: "0.6rem", color: "#d1d5db" }}>·</span>
              <span
                className="flex items-center gap-0.5"
                style={{ fontSize: "0.66rem", fontWeight: 700, color: "#f59e0b" }}
              >
                <Zap className="w-2.5 h-2.5" style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                +{record.points} pts
              </span>
            </div>
          </div>

          {/* Price badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {reviewed ? (
              <span
                className="flex items-center gap-1 px-2 py-1 rounded-xl"
                style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.15)" }}
              >
                <CheckCircle2 className="w-3 h-3" style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#16a34a" }}>Reviewed</span>
              </span>
            ) : (
              <span
                className="px-2 py-1 rounded-xl"
                style={{ background: "rgba(249,115,22,0.08)", fontSize: "0.6rem", fontWeight: 700, color: "#F97316", border: "1px solid rgba(249,115,22,0.15)" }}
              >
                Pending ★
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Before / After thumbnails ── */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {(["before", "after"] as const).map((type) => {
            const isExpanded = imgExpanded === type;
            return (
              <button
                key={type}
                onClick={() => setImgExpand(isExpanded ? null : type)}
                className="flex-1 relative rounded-2xl overflow-hidden transition-all duration-200 active:scale-95"
                style={{
                  height: isExpanded ? "140px" : "90px",
                  border: type === "after"
                    ? "2px solid rgba(22,163,74,0.3)"
                    : "2px solid rgba(0,0,0,0.08)",
                  boxShadow: type === "after"
                    ? "0 4px 12px rgba(22,163,74,0.12)"
                    : "none",
                }}
              >
                <ImageWithFallback
                  src={type === "before" ? record.beforeImg : record.afterImg}
                  alt={type}
                  className="w-full h-full object-cover"
                />
                {/* Label pill */}
                <div
                  className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    background: type === "after"
                      ? "rgba(22,163,74,0.85)"
                      : "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {type === "after" && <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "white", letterSpacing: "0.04em" }}>
                    {type === "before" ? "BEFORE" : "AFTER ✨"}
                  </span>
                </div>
                {/* Tap hint */}
                <div
                  className="absolute inset-0 flex items-start justify-end p-1.5 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span
                    className="px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.45)", fontSize: "0.5rem", color: "white" }}
                  >
                    {isExpanded ? "↑" : "↓"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Review section ── */}
      <div
        className="px-4 pb-4"
        style={{ borderTop: reviewed ? "none" : "1px solid rgba(0,0,0,0.05)" }}
      >
        {!reviewed && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between py-3 transition-all active:opacity-70"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{ color: "#d1d5db", fill: "none" }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>
                  Leave a Review
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: expanded ? "rgba(124,58,237,0.1)" : "rgba(0,0,0,0.05)",
                  border: expanded ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
                }}
              >
                <Sparkles className="w-3 h-3" style={{ color: expanded ? "#7c3aed" : "#9ca3af" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: expanded ? "#7c3aed" : "#9ca3af" }}>
                  {expanded ? "Close" : "Rate"}
                </span>
              </div>
            </button>

            {expanded && (
              <ReviewPanel
                serviceId={record.id}
                serviceName={record.service}
                onSubmit={() => {
                  setTimeout(() => setReviewed(true), 700);
                  setExpanded(false);
                }}
              />
            )}
          </>
        )}

        {reviewed && (
          <div className="flex items-center gap-2 pt-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5"
                  style={{ color: "#f59e0b", fill: i < 5 ? "#f59e0b" : "none" }}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.66rem", color: "#9ca3af" }}>
              You rated this service
            </span>
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VIP Membership Card ──────────────────────────────────────────────────────
function MembershipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative mx-auto cursor-pointer select-none"
      style={{ width: "100%", maxWidth: "340px", height: "200px", perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-all duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #b45309 0%, #d97706 30%, #f59e0b 55%, #fbbf24 72%, #d97706 88%, #92400e 100%)",
            boxShadow: "0 20px 60px rgba(180,83,9,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          {/* Glossy overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 40%, transparent 60%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Holographic shimmer arc */}
          <div
            className="absolute"
            style={{
              top: "-60px", right: "-40px",
              width: "200px", height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)",
              animation: "shimmerRotate 4s linear infinite",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)" }}
                >
                  <PawPrint className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em" }}>
                    PETTECH
                  </p>
                  <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.5)", marginTop: "-1px" }}>
                    Rewards
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4" style={{ color: "#fef3c7", filter: "drop-shadow(0 0 6px rgba(255,237,213,0.8))" }} />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      color: "white",
                      letterSpacing: "0.04em",
                      textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    GOLD
                  </span>
                </div>
                <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
                  MEMBER
                </span>
              </div>
            </div>

            {/* Middle: Points */}
            <div className="flex flex-col gap-0.5">
              <p style={{ fontSize: "0.58rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em" }}>
                LOYALTY POINTS
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    textShadow: "0 2px 12px rgba(0,0,0,0.25)",
                  }}
                >
                  4,820
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                  pts
                </span>
              </div>
              {/* Progress to Platinum */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)" }}>
                    1,180 pts to Platinum
                  </span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)" }}>6,000</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.25)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "80.3%",
                      background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.9))",
                      boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
              <div>
                <p style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>MEMBER SINCE</p>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  March 2024
                </p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>MEMBER ID</p>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>
                  PTS-3821-AX
                </p>
              </div>
            </div>
          </div>

          {/* Tap hint */}
          <div
            className="absolute top-2 right-2 px-2 py-1 rounded-full opacity-60"
            style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}
          >
            <span style={{ fontSize: "0.5rem", color: "white", fontWeight: 600 }}>tap to flip</span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col justify-between p-5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)",
            boxShadow: "0 20px 60px rgba(180,83,9,0.5), 0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }}
          />
          {/* Magnetic stripe */}
          <div
            className="absolute"
            style={{ top: "36px", left: 0, right: 0, height: "40px", background: "rgba(0,0,0,0.5)" }}
          />
          <div className="relative z-10 flex flex-col justify-end h-full gap-3">
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", marginBottom: "4px" }}>
                WALLET BALANCE
              </p>
              <p style={{ fontSize: "1.6rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
                $124.00
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Services",    value: "14"     },
                { label: "Redeemed",    value: "600 pt" },
                { label: "Saved",       value: "$28"    },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center py-2 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "white" }}>{stat.value}</span>
                  <span style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick action buttons ─────────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { icon: Wallet,    label: "Top Up",   color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
    { icon: Gift,      label: "Redeem",   color: "#F97316", bg: "rgba(249,115,22,0.08)" },
    { icon: Send,      label: "Transfer", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
    { icon: TrendingUp,label: "History",  color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ icon: Icon, label, color, bg }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90"
          style={{ background: bg, border: `1px solid ${color}20` }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#374151" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Mini transactions ────────────────────────────────────────────────────────
function TransactionRow({ tx }: { tx: typeof TRANSACTIONS[number] }) {
  const isCredit = tx.type === "credit";
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: isCredit ? "rgba(22,163,74,0.08)" : "rgba(239,68,68,0.07)",
        }}
      >
        {isCredit
          ? <ArrowDownLeft className="w-4 h-4" style={{ color: "#16a34a" }} />
          : <ArrowUpRight  className="w-4 h-4" style={{ color: "#ef4444" }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {tx.label}
        </p>
        <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{tx.date}</p>
      </div>
      <span
        style={{
          fontSize: "0.82rem",
          fontWeight: 800,
          color: isCredit ? "#16a34a" : "#ef4444",
          flexShrink: 0,
        }}
      >
        {isCredit ? "+" : ""}${Math.abs(tx.amount)}
      </span>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export function EWalletScreen() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto overflow-x-hidden"
      style={{
        background: "#f4f4f8",
        fontFamily: "Inter, sans-serif",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
      }}
    >
      {/* ── Hero header ── */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-6"
        style={{
          background: "linear-gradient(160deg, #1e1b4b 0%, #2563EB 70%, #3b82f6 100%)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>
              GOOD MORNING
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
              Sarah's Wallet 🐾
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Crown className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "white" }}>Gold</span>
          </div>
        </div>

        {/* Membership card */}
        <MembershipCard />

        {/* Quick actions */}
        <div className="mt-5">
          <QuickActions />
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-6">

        {/* Recent Transactions */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#111827" }}>Transactions</span>
            </div>
            <button className="flex items-center gap-0.5">
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2563EB" }}>See all</span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
            </button>
          </div>
          <div className="px-5 py-3 flex flex-col gap-3.5">
            {TRANSACTIONS.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

        {/* ── Past Services heading ── */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5" style={{ color: "#F97316" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#374151", letterSpacing: "0.05em" }}>
              PAST SERVICES
            </span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>
            {PAST_SERVICES.length} visits
          </span>
        </div>

        {/* ── Service cards ── */}
        {PAST_SERVICES.map((record) => (
          <ServiceCard key={record.id} record={record} />
        ))}

        {/* Loyalty perks banner */}
        <div
          className="rounded-3xl px-5 py-4 flex items-center gap-4 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10"
            style={{ background: "radial-gradient(circle at 80% 50%, white 0%, transparent 70%)" }}
          />
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "0.82rem", fontWeight: 900, color: "white" }}>
              1,180 pts to Platinum! 🏆
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
              Book 2 more services to unlock exclusive Platinum perks
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-white opacity-70 flex-shrink-0" />
        </div>

        <div style={{ height: "8px" }} />
      </div>

      <style>{`
        @keyframes shimmerRotate {
          0%   { transform: rotate(0deg) scale(1); opacity: 0.6; }
          50%  { transform: rotate(180deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}