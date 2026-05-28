import { useState, useEffect } from "react";
import {
  MessageCircle,
  Phone,
  Star,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  MapPin,
  Share2,
  Bell,
  Heart,
} from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ─── Step data ────────────────────────────────────────────────────────────────
type StepState = "done" | "active" | "pending";

interface Step {
  id: string;
  label: string;
  sublabel: string;
  emoji: string;
  state: StepState;
  time?: string;
}

const STEPS: Step[] = [
  {
    id: "waiting",
    label: "Checked In",
    sublabel: "Bella arrived & checked in",
    emoji: "🏠",
    state: "done",
    time: "9:00 AM",
  },
  {
    id: "bathing",
    label: "Bathing",
    sublabel: "Currently being pampered!",
    emoji: "🛁",
    state: "active",
    time: "9:28 AM",
  },
  {
    id: "drying",
    label: "Drying & Styling",
    sublabel: "Blow-dry & finishing touches",
    emoji: "🌬️",
    state: "pending",
    time: "~10:05 AM",
  },
  {
    id: "ready",
    label: "Ready for Pickup",
    sublabel: "We'll notify you when done!",
    emoji: "🎀",
    state: "pending",
    time: "~10:30 AM",
  },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Pulsing ring component ───────────────────────────────────────────────────
function PulseRing({ color }: { color: string }) {
  return (
    <>
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: color, opacity: 0.25, animationDuration: "1.4s" }}
      />
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: color, opacity: 0.12, animationDuration: "1.4s", animationDelay: "0.4s" }}
      />
    </>
  );
}

// ─── Step node ────────────────────────────────────────────────────────────────
function StepNode({ step, isLast }: { step: Step; isLast: boolean }) {
  const isDone = step.state === "done";
  const isActive = step.state === "active";
  const isPending = step.state === "pending";

  return (
    <div className="flex items-stretch gap-4">
      {/* Left: connector + node */}
      <div className="flex flex-col items-center" style={{ width: "44px", flexShrink: 0 }}>
        {/* Node circle */}
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: "44px", height: "44px" }}>
          {isActive && <PulseRing color="#F97316" />}

          <div
            className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              background: isDone
                ? "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)"
                : isActive
                ? "linear-gradient(135deg, #F97316 0%, #ea580c 100%)"
                : "rgba(0,0,0,0.05)",
              border: isDone
                ? "2.5px solid rgba(37,99,235,0.3)"
                : isActive
                ? "2.5px solid rgba(249,115,22,0.5)"
                : "2px solid rgba(0,0,0,0.1)",
              boxShadow: isActive
                ? "0 0 0 6px rgba(249,115,22,0.12), 0 4px 20px rgba(249,115,22,0.45)"
                : isDone
                ? "0 4px 12px rgba(37,99,235,0.3)"
                : "none",
            }}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            ) : isActive ? (
              <span style={{ fontSize: "1.1rem" }}>{step.emoji}</span>
            ) : (
              <span style={{ fontSize: "1rem", opacity: 0.35 }}>{step.emoji}</span>
            )}
          </div>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className="flex-1 w-0.5 mt-1 rounded-full overflow-hidden"
            style={{ minHeight: "40px", background: "rgba(0,0,0,0.07)" }}
          >
            {isDone && (
              <div
                className="w-full rounded-full"
                style={{
                  height: "100%",
                  background: "linear-gradient(180deg, #2563EB 0%, #60a5fa 100%)",
                }}
              />
            )}
            {isActive && (
              <div
                className="w-full rounded-full"
                style={{
                  height: "50%",
                  background: "linear-gradient(180deg, #F97316 0%, rgba(249,115,22,0.3) 100%)",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Right: label content */}
      <div
        className="flex-1 pb-8"
        style={{ paddingTop: "10px" }}
      >
        <div
          className="rounded-2xl px-4 py-3 transition-all duration-300"
          style={{
            background: isActive
              ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
              : isDone
              ? "rgba(37,99,235,0.04)"
              : "rgba(0,0,0,0.025)",
            border: isActive
              ? "1.5px solid rgba(249,115,22,0.25)"
              : isDone
              ? "1.5px solid rgba(37,99,235,0.1)"
              : "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: isActive ? "0 4px 16px rgba(249,115,22,0.1)" : "none",
          }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: isActive ? 800 : isDone ? 700 : 600,
                color: isActive ? "#c2410c" : isDone ? "#1d4ed8" : "#9ca3af",
              }}
            >
              {step.label}
            </span>
            {step.time && (
              <span
                className="flex items-center gap-1"
                style={{ fontSize: "0.62rem", fontWeight: 600, color: isActive ? "#F97316" : "#9ca3af" }}
              >
                <Clock className="w-2.5 h-2.5" />
                {step.time}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: "0.68rem",
              color: isActive ? "#9a3412" : isDone ? "#6b7280" : "#cbd5e1",
              fontWeight: isActive ? 600 : 400,
              lineHeight: 1.4,
            }}
          >
            {step.sublabel}
          </p>

          {/* Active step extras */}
          {isActive && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(249,115,22,0.15)", fontSize: "0.6rem", fontWeight: 800, color: "#F97316" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: "#F97316", animation: "liveBlink 1s ease-in-out infinite" }}
                />
                LIVE
              </span>
              <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
                Mia is working on Bella right now
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export function LiveTrackingScreen() {
  const [chatPressed, setChatPressed] = useState(false);
  const [heartActive, setHeartActive] = useState(false);
  const countdown = useCountdown(25 * 60 + 17); // 25:17

  return (
    <div
      className="relative flex flex-col overflow-y-auto overflow-x-hidden h-full"
      style={{
        background: "#fafaf9",
        fontFamily: "Inter, sans-serif",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* ── Hero: Pet photo banner ── */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #fff7ed 0%, #fafaf9 100%)",
          paddingTop: "20px",
          paddingBottom: "0px",
        }}
      >
        {/* Back + Share row */}
        <div className="flex items-center justify-between px-5 mb-4">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#374151" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeartActive(!heartActive)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: heartActive ? "rgba(239,68,68,0.1)" : "rgba(0,0,0,0.06)" }}
            >
              <Heart
                className="w-4 h-4 transition-all"
                style={{
                  color: heartActive ? "#ef4444" : "#9ca3af",
                  fill: heartActive ? "#ef4444" : "none",
                  transform: heartActive ? "scale(1.2)" : "scale(1)",
                }}
              />
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.06)" }}
            >
              <Share2 className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            </button>
          </div>
        </div>

        {/* Large circular pet photo */}
        <div className="flex flex-col items-center pb-6">
          {/* Outer glow rings */}
          <div className="relative flex items-center justify-center" style={{ width: "148px", height: "148px" }}>
            {/* Outermost subtle ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "transparent",
                border: "2px solid rgba(249,115,22,0.12)",
                animation: "slowPulse 3s ease-in-out infinite",
              }}
            />
            {/* Middle ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "8px",
                background: "transparent",
                border: "2px solid rgba(249,115,22,0.22)",
                animation: "slowPulse 3s ease-in-out infinite 0.5s",
              }}
            />
            {/* Inner glowing ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "16px",
                background: "transparent",
                border: "3px solid #F97316",
                boxShadow: "0 0 18px rgba(249,115,22,0.55), inset 0 0 12px rgba(249,115,22,0.08)",
              }}
            />
            {/* Photo */}
            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                inset: "20px",
                boxShadow: "0 8px 28px rgba(249,115,22,0.35)",
              }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1597603413826-cd1c06b05222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXQlMjBnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2clMjBiYXRoJTIwdHViJTIwY3V0ZXxlbnwxfHx8fDE3NzI3MjY0NjF8MA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Bella"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bathing badge */}
            <div
              className="absolute z-10 flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                bottom: "-4px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #F97316, #ea580c)",
                boxShadow: "0 4px 14px rgba(249,115,22,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "0.65rem" }}>🛁</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "white" }}>Bathing now</span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "white", animation: "liveBlink 1s ease-in-out infinite" }}
              />
            </div>
          </div>

          {/* Pet name + breed */}
          <div className="flex flex-col items-center mt-5">
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Bella 🐾
            </h2>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>
              Golden Retriever · Full Groom Service
            </p>
          </div>

          {/* ETA countdown card */}
          <div
            className="flex items-center gap-3 mt-4 px-5 py-3.5 rounded-2xl"
            style={{
              background: "white",
              border: "1.5px solid rgba(249,115,22,0.18)",
              boxShadow: "0 4px 16px rgba(249,115,22,0.1)",
              minWidth: "240px",
            }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,0.1)" }}
            >
              <Clock className="w-5 h-5" style={{ color: "#F97316" }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: "0.62rem", fontWeight: 600, color: "#9ca3af", margin: 0 }}>
                ESTIMATED READY IN
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: "#F97316",
                    letterSpacing: "-0.04em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {countdown}
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af" }}>min</span>
              </div>
            </div>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90"
              style={{ background: "rgba(37,99,235,0.07)" }}
            >
              <Bell className="w-4 h-4" style={{ color: "#2563EB" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col gap-4 px-5 pt-2 pb-6">

        {/* Section label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#F97316" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#374151", letterSpacing: "0.06em" }}>
              LIVE PROGRESS
            </span>
          </div>
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.08)", fontSize: "0.6rem", fontWeight: 700, color: "#F97316" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#F97316", animation: "liveBlink 1s ease-in-out infinite" }}
            />
            UPDATING LIVE
          </span>
        </div>

        {/* ── Vertical Progress Stepper ── */}
        <div
          className="rounded-3xl overflow-hidden px-4 pt-5 pb-1"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {STEPS.map((step, idx) => (
            <StepNode key={step.id} step={step} isLast={idx === STEPS.length - 1} />
          ))}
        </div>

        {/* ── Overall progress bar ── */}
        <div
          className="px-4 py-4 rounded-2xl"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>Overall Progress</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#F97316" }}>40%</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: "40%",
                background: "linear-gradient(90deg, #2563EB 0%, #F97316 100%)",
                transition: "width 1s ease",
              }}
            >
              {/* Shimmer sweep */}
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            {["Check-in", "Bath", "Dry", "Ready"].map((label, idx) => (
              <span
                key={label}
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 600,
                  color: idx < 2 ? "#2563EB" : idx === 2 ? "#F97316" : "#cbd5e1",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Groomer profile card ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header strip */}
          <div
            className="px-4 py-2 flex items-center gap-1.5"
            style={{
              background: "linear-gradient(90deg, rgba(37,99,235,0.05), rgba(124,58,237,0.05))",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Award className="w-3 h-3" style={{ color: "#2563EB" }} />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.06em" }}>
              YOUR GROOMER TODAY
            </span>
          </div>

          <div className="px-4 py-4">
            {/* Avatar + info */}
            <div className="flex items-center gap-3 mb-4">
              {/* Groomer avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden"
                  style={{
                    border: "2.5px solid rgba(37,99,235,0.15)",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.18)",
                  }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1683126257862-cbe1540e77c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzaW9uYWwlMjBncm9vbWVyJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjcyNjQ1OHww&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Mia Rodriguez"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online dot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#22c55e", border: "2px solid white" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                    Mia Rodriguez
                  </span>
                  <span
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.58rem", fontWeight: 700, color: "#2563EB" }}
                  >
                    <Shield className="w-2.5 h-2.5" />
                    Certified
                  </span>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>
                  Senior Groomer · 6 yrs exp.
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        style={{
                          color: i <= 4 ? "#f59e0b" : "#e5e7eb",
                          fill: i <= 4 ? "#f59e0b" : "none",
                        }}
                      />
                    ))}
                    {/* Half star visual */}
                    <div className="relative w-3 h-3 overflow-hidden">
                      <Star className="absolute w-3 h-3" style={{ color: "#e5e7eb", fill: "none" }} />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: "55%" }}>
                        <Star className="w-3 h-3" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#111827" }}>4.9</span>
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>(312 reviews)</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["Full Groom", "Doodles", "Long Coats", "Sensitive Skin"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid rgba(0,0,0,0.08)",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-xl" style={{ background: "#f8fafc" }}>
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#9ca3af" }} />
              <span style={{ fontSize: "0.68rem", color: "#6b7280" }}>
                Grooming Suite B · Paws & Claws Clinic, 2nd Floor
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2.5">
              {/* Primary: Chat */}
              <button
                onPointerDown={() => setChatPressed(true)}
                onPointerUp={() => setChatPressed(false)}
                onPointerLeave={() => setChatPressed(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all duration-150"
                style={{
                  background: chatPressed
                    ? "#1d4ed8"
                    : "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  boxShadow: chatPressed
                    ? "0 2px 8px rgba(37,99,235,0.35)"
                    : "0 6px 18px rgba(37,99,235,0.38)",
                  transform: chatPressed ? "scale(0.97)" : "scale(1)",
                }}
              >
                <MessageCircle className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "white" }}>
                  Chat with Mia
                </span>
              </button>

              {/* Secondary: Call */}
              <button
                className="flex items-center justify-center w-13 h-13 rounded-2xl transition-all active:scale-95"
                style={{
                  width: "52px",
                  height: "52px",
                  background: "rgba(22,163,74,0.09)",
                  border: "1.5px solid rgba(22,163,74,0.2)",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.12)",
                  flexShrink: 0,
                }}
              >
                <Phone className="w-5 h-5" style={{ color: "#16a34a" }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Activity log ── */}
        <div
          className="rounded-3xl px-4 py-4"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#374151", letterSpacing: "0.06em" }}>
              TODAY'S UPDATES
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { time: "9:28 AM", msg: "Bathing session started 🛁", color: "#F97316", dot: "#F97316" },
              { time: "9:15 AM", msg: "Coat assessment done, no knots found ✨", color: "#2563EB", dot: "#2563EB" },
              { time: "9:02 AM", msg: "Bella checked in successfully 🐾", color: "#16a34a", dot: "#16a34a" },
            ].map((item) => (
              <div key={item.time} className="flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ background: item.dot }}
                />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "0.72rem", color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>
                    {item.msg}
                  </p>
                </div>
                <span style={{ fontSize: "0.62rem", color: "#9ca3af", flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding for safe area */}
        <div style={{ height: "8px" }} />
      </div>

      <style>{`
        @keyframes slowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
