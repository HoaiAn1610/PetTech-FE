import { useState } from "react";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  Scissors,
  User,
  CreditCard,
  Home,
  FileText,
  Sparkles,
  ChevronRight,
  Star,
  MapPin,
  Share2,
  Download,
  X,
  PawPrint,
  Zap,
  Gift,
} from "lucide-react";

// ─── Booking data ─────────────────────────────────────────────────────────────
const BOOKING = {
  date:       "Saturday, March 7, 2026",
  time:       "10:30 AM",
  service:    "Full Grooming Package",
  groomer:    "Jamie Reyes ⭐ 4.9",
  amount:     "$48.00",
  pointsEarned: 480,
  transactionId: "TXN-20260307-8821",
  clinic:     "Paws & Claws Clinic",
  duration:   "~90 mins",
  pet:        "Bella 🐾",
  payMethod:  "PetTech Wallet  ····  4291",
};

// ─── Confetti dots (static decorative layer) ──────────────────────────────────
const CONFETTI = [
  { x: "14%",  y: "7%",   size: 7,  color: "#22c55e",  delay: "0s",    shape: "circle"  },
  { x: "82%",  y: "5%",   size: 5,  color: "#2563EB",  delay: "0.3s",  shape: "circle"  },
  { x: "90%",  y: "18%",  size: 9,  color: "#F97316",  delay: "0.15s", shape: "square"  },
  { x: "6%",   y: "20%",  size: 6,  color: "#a855f7",  delay: "0.45s", shape: "square"  },
  { x: "75%",  y: "28%",  size: 5,  color: "#22c55e",  delay: "0.6s",  shape: "circle"  },
  { x: "22%",  y: "12%",  size: 8,  color: "#F97316",  delay: "0.1s",  shape: "circle"  },
  { x: "50%",  y: "3%",   size: 4,  color: "#2563EB",  delay: "0.5s",  shape: "square"  },
  { x: "60%",  y: "8%",   size: 6,  color: "#a855f7",  delay: "0.2s",  shape: "circle"  },
  { x: "38%",  y: "6%",   size: 5,  color: "#22c55e",  delay: "0.35s", shape: "square"  },
  { x: "93%",  y: "35%",  size: 4,  color: "#F97316",  delay: "0.7s",  shape: "circle"  },
  { x: "3%",   y: "35%",  size: 5,  color: "#2563EB",  delay: "0.25s", shape: "square"  },
];

// ─── Summary row ──────────────────────────────────────────────────────────────
function SummaryRow({
  icon: Icon,
  label,
  value,
  valueColor,
  accent,
  bold,
  last,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueColor?: string;
  accent?: string;
  bold?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 py-2.5"
      style={{ borderBottom: last ? "none" : "1px solid rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accent ? `${accent}12` : "rgba(0,0,0,0.05)" }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent ?? "#9ca3af" }} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>{label}</span>
      </div>
      <span
        style={{
          fontSize: bold ? "0.9rem" : "0.8rem",
          fontWeight: bold ? 900 : 700,
          color: valueColor ?? "#111827",
          textAlign: "right",
          maxWidth: "55%",
          lineHeight: 1.3,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Digital Receipt overlay ──────────────────────────────────────────────────
function ReceiptSheet({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-[32px] flex flex-col overflow-hidden"
        style={{
          background: "white",
          maxHeight: "88%",
          animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "#111827" }}>Digital Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Receipt body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {/* Receipt header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2563EB, #7c3aed)" }}
            >
              <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 900, color: "#111827" }}>Paws & Claws Clinic</p>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Issued by PetTech · Digital Record</p>
            </div>
          </div>

          {/* Dotted divider */}
          <div style={{ borderTop: "2px dashed rgba(0,0,0,0.08)", marginBottom: "14px" }} />

          {/* Line items */}
          <div className="flex flex-col gap-1 mb-3">
            {[
              { label: "Full Grooming Package",       amount: "$55.00" },
              { label: "Holiday Season Discount (–15%)", amount: "–$8.25" },
              { label: "Loyalty Points Applied",       amount: "–$0.00" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5">
                <span style={{ fontSize: "0.77rem", color: "#374151" }}>{item.label}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: item.amount.startsWith("–") ? "#16a34a" : "#111827",
                  }}
                >
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Dotted divider */}
          <div style={{ borderTop: "2px dashed rgba(0,0,0,0.08)", marginBottom: "12px" }} />

          {/* Total */}
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>Total Paid</span>
            <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "#16a34a" }}>$48.00</span>
          </div>

          {/* Meta rows */}
          <div
            className="rounded-2xl px-4 py-3 flex flex-col gap-2 mb-4"
            style={{ background: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            {[
              { label: "Transaction ID", value: "TXN-20260307-8821" },
              { label: "Payment Method", value: "PetTech Wallet ····4291" },
              { label: "Date & Time",    value: "Mar 7, 2026 · 10:31 AM" },
              { label: "Status",         value: "✓ Confirmed"           },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{r.label}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Points earned */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07), rgba(249,115,22,0.04))", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <Gift className="w-4 h-4" style={{ color: "#F97316" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e" }}>
              You earned <strong style={{ color: "#F97316" }}>+480 PetPoints</strong> from this visit!
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
              style={{ background: "rgba(37,99,235,0.07)", border: "1.5px solid rgba(37,99,235,0.15)" }}
            >
              <Download className="w-4 h-4" style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB" }}>Save PDF</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
              style={{ background: "rgba(0,0,0,0.04)", border: "1.5px solid rgba(0,0,0,0.08)" }}
            >
              <Share2 className="w-4 h-4" style={{ color: "#374151" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PaymentSuccessModal({ onHome }: { onHome?: () => void }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [addedCalendar, setAddedCalendar] = useState(false);

  return (
    <div
      className="absolute inset-0 flex items-end justify-center z-10"
      style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 100%)",
        backdropFilter: "blur(3px)",
      }}
    >
      {/* ── Confetti layer ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((dot, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: dot.x,
              top: dot.y,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              borderRadius: dot.shape === "circle" ? "50%" : "2px",
              background: dot.color,
              opacity: 0.75,
              animation: `confettiFall 2.4s ${dot.delay} ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Modal card – slides up from bottom ── */}
      <div
        className="relative w-full flex flex-col overflow-hidden"
        style={{
          background: "white",
          borderRadius: "32px 32px 0 0",
          maxHeight: "92%",
          animation: "slideUp 0.45s cubic-bezier(0.32,0.72,0,1) both",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.35), 0 -8px 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 flex flex-col" style={{ scrollbarWidth: "none" }}>

          {/* ── Top success section ── */}
          <div
            className="flex flex-col items-center pt-4 pb-6 px-5 flex-shrink-0 relative"
            style={{
              background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            {/* Sparkles top-right */}
            <Sparkles
              className="absolute top-5 right-6 w-5 h-5"
              style={{ color: "#F97316", opacity: 0.5, animation: "sparkle 2s ease-in-out infinite" }}
            />
            <Sparkles
              className="absolute top-8 left-7 w-3.5 h-3.5"
              style={{ color: "#a855f7", opacity: 0.4, animation: "sparkle 2.5s 0.5s ease-in-out infinite" }}
            />

            {/* Checkmark ring stack */}
            <div className="relative flex items-center justify-center mb-5" style={{ width: "96px", height: "96px" }}>
              {/* Outermost ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "96px",
                  height: "96px",
                  background: "rgba(34,197,94,0.08)",
                  animation: "ringPulse 2.2s 0.2s ease-out infinite",
                }}
              />
              {/* Middle ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "78px",
                  height: "78px",
                  background: "rgba(34,197,94,0.12)",
                  animation: "ringPulse 2.2s ease-out infinite",
                }}
              />
              {/* Inner circle */}
              <div
                className="relative z-10 flex items-center justify-center rounded-full"
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.45), 0 2px 8px rgba(34,197,94,0.3)",
                  animation: "checkBounce 0.5s 0.1s cubic-bezier(0.36,0.07,0.19,0.97) both",
                }}
              >
                {/* Checkmark SVG for crisp rendering */}
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M6 15.5L12 21.5L24 9"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: "drawCheck 0.4s 0.3s ease-out both", strokeDasharray: 30, strokeDashoffset: 0 }}
                  />
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.03em",
                textAlign: "center",
                lineHeight: 1.15,
              }}
            >
              Booking Confirmed! 🎉
            </h2>
            <p
              style={{
                fontSize: "0.78rem",
                color: "#16a34a",
                fontWeight: 700,
                marginTop: "4px",
                textAlign: "center",
              }}
            >
              Payment processed successfully
            </p>
            <p
              style={{
                fontSize: "0.68rem",
                color: "#9ca3af",
                marginTop: "3px",
                textAlign: "center",
              }}
            >
              A confirmation has been sent to your email
            </p>
          </div>

          {/* ── Summary box ── */}
          <div className="px-5 pb-3 flex-shrink-0">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                border: "1.5px solid rgba(0,0,0,0.07)",
                background: "#fafbff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              {/* Summary header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "rgba(37,99,235,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
                  >
                    <PawPrint className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#374151" }}>
                    Appointment Summary
                  </span>
                </div>
                <span
                  className="flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ background: "rgba(34,197,94,0.1)", fontSize: "0.6rem", fontWeight: 800, color: "#16a34a" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  CONFIRMED
                </span>
              </div>

              {/* Summary rows */}
              <div className="px-4 pt-1 pb-2">
                <SummaryRow
                  icon={CalendarDays}
                  label="Date"
                  value={BOOKING.date}
                  accent="#2563EB"
                />
                <SummaryRow
                  icon={Clock}
                  label="Time"
                  value={`${BOOKING.time} · ${BOOKING.duration}`}
                  accent="#7c3aed"
                />
                <SummaryRow
                  icon={Scissors}
                  label="Service"
                  value={BOOKING.service}
                  accent="#F97316"
                />
                <SummaryRow
                  icon={User}
                  label="Groomer"
                  value={BOOKING.groomer}
                  accent="#0891b2"
                />
                <SummaryRow
                  icon={MapPin}
                  label="Clinic"
                  value={BOOKING.clinic}
                  accent="#6b7280"
                />
                <SummaryRow
                  icon={PawPrint}
                  label="Pet"
                  value={BOOKING.pet}
                  accent="#F97316"
                />
              </div>

              {/* Amount row — special treatment */}
              <div
                className="mx-3 mb-3 rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid rgba(34,197,94,0.2)", background: "linear-gradient(135deg, rgba(34,197,94,0.07), rgba(34,197,94,0.04))" }}
              >
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(34,197,94,0.15)" }}
                    >
                      <CreditCard className="w-4 h-4" style={{ color: "#16a34a" }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>Amount Paid</p>
                      <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{BOOKING.payMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16a34a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {BOOKING.amount}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "#16a34a", fontWeight: 700, opacity: 0.7 }}>PAID IN FULL</p>
                  </div>
                </div>
              </div>

              {/* Points earned strip */}
              <div
                className="flex items-center gap-2.5 mx-3 mb-3 px-4 py-2.5 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.04))", border: "1px solid rgba(249,115,22,0.18)" }}
              >
                <Zap className="w-4 h-4 flex-shrink-0" style={{ color: "#F97316", fill: "#F97316" }} />
                <span style={{ fontSize: "0.72rem", color: "#92400e" }}>
                  <strong style={{ fontWeight: 800, color: "#F97316" }}>+{BOOKING.pointsEarned} PetPoints</strong> earned and added to your wallet
                </span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" style={{ color: "#F97316" }} />
              </div>

              {/* Add to calendar */}
              <button
                onClick={() => setAddedCalendar(true)}
                className="flex items-center justify-between w-full px-4 py-3 transition-all"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  background: addedCalendar ? "rgba(34,197,94,0.05)" : "transparent",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: addedCalendar ? "rgba(34,197,94,0.15)" : "rgba(37,99,235,0.08)" }}
                  >
                    <CalendarDays className="w-3.5 h-3.5" style={{ color: addedCalendar ? "#16a34a" : "#2563EB" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: addedCalendar ? "#16a34a" : "#374151" }}>
                    {addedCalendar ? "Added to Calendar ✓" : "Add to Calendar"}
                  </span>
                </div>
                {!addedCalendar && (
                  <ChevronRight className="w-4 h-4" style={{ color: "#d1d5db" }} />
                )}
              </button>
            </div>
          </div>

          {/* ── Groomer rating nudge ── */}
          <div className="px-5 pb-3 flex-shrink-0">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)" }}
            >
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5" style={{ color: "#fbbf24", fill: s <= 5 ? "#fbbf24" : "none" }} />
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "#78350f", flex: 1 }}>
                How was your <strong>last visit</strong>? Leave a review after your appointment!
              </p>
            </div>
          </div>

          {/* ── Transaction ID ── */}
          <div className="px-5 pb-2 flex-shrink-0">
            <p style={{ fontSize: "0.62rem", color: "#d1d5db", textAlign: "center", letterSpacing: "0.04em" }}>
              Transaction ID: {BOOKING.transactionId}
            </p>
          </div>
        </div>

        {/* ── CTA Buttons — pinned to bottom ── */}
        <div
          className="px-5 pt-3 pb-6 flex flex-col gap-2.5 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* PRIMARY: Back to Home */}
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 60%, #7c3aed 100%)",
              boxShadow: "0 8px 28px rgba(37,99,235,0.4), 0 2px 8px rgba(37,99,235,0.2)",
              fontSize: "0.95rem",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.01em",
            }}
          >
            <Home className="w-4.5 h-4.5" strokeWidth={2.5} />
            Back to Home
          </button>

          {/* SECONDARY: View Digital Receipt */}
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-all active:scale-[0.98] hover:bg-gray-50"
            style={{
              border: "2px solid rgba(37,99,235,0.22)",
              fontSize: "0.92rem",
              fontWeight: 800,
              color: "#2563EB",
              background: "rgba(37,99,235,0.03)",
              letterSpacing: "-0.01em",
            }}
          >
            <FileText className="w-4.5 h-4.5" strokeWidth={2.5} />
            View Digital Receipt
          </button>
        </div>
      </div>

      {/* Receipt sheet overlay */}
      {showReceipt && <ReceiptSheet onClose={() => setShowReceipt(false)} />}

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.1);  opacity: 0.2; }
          100% { transform: scale(0.85); opacity: 0.6; }
        }
        @keyframes checkBounce {
          0%   { transform: scale(0);   opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          80%  { transform: scale(0.9); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0.7; }
          100% { transform: translateY(12px) rotate(45deg); opacity: 0.3; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1)    rotate(0deg);  opacity: 0.5; }
          50%       { transform: scale(1.35) rotate(25deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}