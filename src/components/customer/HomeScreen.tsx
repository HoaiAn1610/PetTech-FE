import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CalendarPlus,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Heart,
  MapPin,
  Star,
  Pill,
  Syringe,
  Activity,
  PawPrint,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ─── Data ────────────────────────────────────────────────────────────────────

const PETS = [
  {
    id: "p1",
    name: "Bella",
    breed: "Golden Retriever",
    age: "3y",
    photo: "https://images.unsplash.com/photo-1608262941082-65cfdb51c571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwdXBweSUyMGN1dGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI3MjYxMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
    accent: "#f97316",
    emoji: "🐶",
    nextAppt: "Apr 12",
    status: "Healthy",
  },
  {
    id: "p2",
    name: "Mochi",
    breed: "Orange Tabby",
    age: "2y",
    photo: "https://images.unsplash.com/photo-1768467485628-aa824803377b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjB0YWJieSUyMGNhdCUyMGN1dGUlMjBmYWNlfGVufDF8fHx8MTc3MjcyNjEzMHww&ixlib=rb-4.1.0&q=80&w=400",
    accent: "#d97706",
    emoji: "🐱",
    nextAppt: "May 3",
    status: "Vaccine Due",
  },
  {
    id: "p3",
    name: "Snowball",
    breed: "Dutch Rabbit",
    age: "1y",
    photo: "https://images.unsplash.com/photo-1643212263657-505473e76c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGZsdWZmeSUyMHJhYmJpdCUyMHBldHxlbnwxfHx8fDE3NzI3MjYxMzB8MA&ixlib=rb-4.1.0&q=80&w=400",
    accent: "#7c3aed",
    emoji: "🐰",
    nextAppt: "Jun 18",
    status: "Healthy",
  },
  {
    id: "p4",
    name: "Pugsley",
    breed: "Pug",
    age: "5y",
    photo: "https://images.unsplash.com/photo-1611062033267-22362ab37585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWclMjBkb2clMjBmdW5ueSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjcyNjEzMHww&ixlib=rb-4.1.0&q=80&w=400",
    accent: "#2563eb",
    emoji: "🐾",
    nextAppt: "Apr 28",
    status: "Monitoring",
  },
];

const VACCINE_RECORDS = [
  { id: "v1", name: "Rabies", date: "Mar 2023", status: "done", icon: "🛡️" },
  { id: "v2", name: "DHPP Combo", date: "Jan 2023", status: "done", icon: "💉" },
  { id: "v3", name: "Bordetella", date: "Dec 2022", status: "done", icon: "🫁" },
  { id: "v4", name: "Leptospirosis", date: "Due Apr 15, 2026", status: "upcoming", icon: "⚠️" },
  { id: "v5", name: "Rabies Booster", date: "Due Jun 2, 2026", status: "upcoming", icon: "🔴" },
];

const WEIGHT_DATA = [
  { month: "Oct", weight: 27.2 },
  { month: "Nov", weight: 27.8 },
  { month: "Dec", weight: 28.5 },
  { month: "Jan", weight: 28.1 },
  { month: "Feb", weight: 28.9 },
  { month: "Mar", weight: 29.2 },
];

const QUICK_ACTIONS = [
  { icon: CalendarPlus, label: "Book", color: "#2563EB", bg: "rgba(37,99,235,0.09)" },
  { icon: Pill, label: "Meds", color: "#16a34a", bg: "rgba(22,163,74,0.09)" },
  { icon: Activity, label: "Records", color: "#7c3aed", bg: "rgba(124,58,237,0.09)" },
  { icon: MapPin, label: "Find Vet", color: "#F97316", bg: "rgba(249,115,22,0.09)" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    "Healthy": { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    "Vaccine Due": { color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    "Monitoring": { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  };
  const style = map[status] || { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span
      className="px-2 py-0.5 rounded-full"
      style={{ background: style.bg, fontSize: "0.58rem", fontWeight: 700, color: style.color, letterSpacing: "0.02em" }}
    >
      {status}
    </span>
  );
}

function WeightTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl shadow-lg"
      style={{ background: "#1e293b", border: "none" }}
    >
      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "white" }}>
        {payload[0].value} kg
      </span>
    </div>
  );
}

// ─── Main HomeScreen ─────────────────────────────────────────────────────────

interface HomeScreenProps {
  onBookAppointment?: () => void;
}

export function HomeScreen({ onBookAppointment }: HomeScreenProps) {
  const [activePet, setActivePet] = useState(PETS[0]);
  const [fabPressed, setFabPressed] = useState(false);

  const lastWeight = WEIGHT_DATA[WEIGHT_DATA.length - 1].weight;
  const prevWeight = WEIGHT_DATA[WEIGHT_DATA.length - 2].weight;
  const weightDiff = (lastWeight - prevWeight).toFixed(1);
  const isGain = lastWeight > prevWeight;

  return (
    <div
      className="relative flex flex-col overflow-y-auto overflow-x-hidden"
      style={{
        background: "#f8f6ff",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* ── Header ── */}
      <div
        className="relative px-5 pt-5 pb-4 flex-shrink-0"
        style={{
          background: "linear-gradient(160deg, #2563EB 0%, #1d4ed8 60%, #7c3aed 100%)",
          borderBottomLeftRadius: "28px",
          borderBottomRightRadius: "28px",
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <PawPrint className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
              Pet<span style={{ color: "#fbbf24" }}>OS</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Bell className="w-4.5 h-4.5 text-white" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#F97316", border: "1.5px solid transparent" }}
              />
            </button>
            <div
              className="w-9 h-9 rounded-2xl overflow-hidden"
              style={{ border: "2px solid rgba(255,255,255,0.4)" }}
            >
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica&backgroundColor=b6e3f4"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-5">
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginBottom: "2px" }}>
            Good morning 🌤️
          </p>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Hi, Jessica! 🐾
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
            {activePet.name} has an appointment on{" "}
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>{activePet.nextAppt}</span>
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex gap-2 mb-5">
          {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(4px)" }}
            >
              <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Pet Cards (horizontal scroll) ── */}
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.07em", marginBottom: "10px" }}>
            MY PETS
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {PETS.map((pet) => {
              const isActive = pet.id === activePet.id;
              return (
                <button
                  key={pet.id}
                  onClick={() => setActivePet(pet)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-95"
                >
                  {/* Avatar ring */}
                  <div
                    className="relative"
                    style={{
                      padding: "3px",
                      borderRadius: "50%",
                      background: isActive
                        ? `linear-gradient(135deg, ${pet.accent}, #fbbf24)`
                        : "rgba(255,255,255,0.2)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full overflow-hidden"
                      style={{
                        border: "2.5px solid",
                        borderColor: isActive ? "transparent" : "transparent",
                        boxShadow: isActive ? `0 4px 18px ${pet.accent}60` : "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <ImageWithFallback
                        src={pet.photo}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Status dot */}
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        background: pet.status === "Healthy" ? "#22c55e" : pet.status === "Vaccine Due" ? "#f59e0b" : "#a78bfa",
                        border: "2px solid #2563EB",
                        fontSize: "0.45rem",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "white" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {pet.name}
                  </span>
                  {isActive && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "#fbbf24" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex flex-col gap-4 px-4 pt-5 pb-28">

        {/* Active pet info strip */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: `0 3px 12px ${activePet.accent}40` }}
            >
              <ImageWithFallback src={activePet.photo} alt={activePet.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>{activePet.name}</span>
                <span style={{ fontSize: "0.75rem" }}>{activePet.emoji}</span>
              </div>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{activePet.breed} · {activePet.age}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusChip status={activePet.status} />
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
              <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Paws & Claws Clinic</span>
            </div>
          </div>
        </div>

        {/* ── Digital Vaccine Book ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Card header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              borderBottom: "1.5px solid rgba(22,163,74,0.1)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(22,163,74,0.12)" }}
              >
                <Shield className="w-4.5 h-4.5" style={{ color: "#16a34a" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                  Vaccine Passport
                </h2>
                <p style={{ fontSize: "0.68rem", color: "#6b7280" }}>
                  {activePet.name} · {activePet.breed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>
                {VACCINE_RECORDS.filter((v) => v.status === "done").length}/{VACCINE_RECORDS.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-5 pt-3.5 pb-1">
            <div className="flex justify-between mb-1.5">
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af" }}>COMPLETION</span>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a" }}>
                {Math.round((VACCINE_RECORDS.filter((v) => v.status === "done").length / VACCINE_RECORDS.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((VACCINE_RECORDS.filter((v) => v.status === "done").length / VACCINE_RECORDS.length) * 100)}%`,
                  background: "linear-gradient(90deg, #16a34a, #4ade80)",
                }}
              />
            </div>
          </div>

          {/* Vaccine list */}
          <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
            {VACCINE_RECORDS.map((vaccine, idx) => {
              const isDone = vaccine.status === "done";
              return (
                <div
                  key={vaccine.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl"
                  style={{
                    background: isDone ? "#f0fdf4" : "rgba(239,68,68,0.04)",
                    border: `1.5px solid ${isDone ? "rgba(22,163,74,0.12)" : "rgba(239,68,68,0.18)"}`,
                    animation: `fadeSlideUp 0.3s ease ${idx * 0.05}s both`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDone ? "rgba(22,163,74,0.12)" : "rgba(239,68,68,0.08)",
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: "#16a34a" }} />
                    ) : (
                      <AlertCircle className="w-4 h-4" style={{ color: "#ef4444" }} />
                    )}
                  </div>

                  {/* Label + date */}
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: isDone ? 600 : 800,
                        color: isDone ? "#374151" : "#dc2626",
                        margin: 0,
                      }}
                    >
                      {vaccine.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: isDone ? "#9ca3af" : "#ef4444",
                        fontWeight: isDone ? 400 : 700,
                        margin: 0,
                      }}
                    >
                      {isDone ? "✓ Administered " : "⏰ "}{vaccine.date}
                    </p>
                  </div>

                  {/* Done checkmark / Due badge */}
                  {isDone ? (
                    <span
                      className="flex-shrink-0 px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(22,163,74,0.1)", fontSize: "0.6rem", fontWeight: 700, color: "#16a34a" }}
                    >
                      Done
                    </span>
                  ) : (
                    <button
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl active:scale-95 transition-transform"
                      style={{ background: "#ef4444", fontSize: "0.62rem", fontWeight: 700, color: "white" }}
                    >
                      Book
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weight History Chart ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Chart header */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.09)" }}
              >
                <Activity className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                  Weight History
                </h2>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Last 6 months</p>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: isGain ? "rgba(239,68,68,0.07)" : "rgba(22,163,74,0.07)",
              }}
            >
              {isGain ? (
                <TrendingUp className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
              )}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: isGain ? "#ef4444" : "#16a34a",
                }}
              >
                {isGain ? "+" : ""}{weightDiff} kg
              </span>
            </div>
          </div>

          {/* Current weight pill */}
          <div className="px-5 mb-3">
            <div className="flex items-baseline gap-1">
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.04em" }}>
                {lastWeight}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#9ca3af" }}>kg</span>
              <span style={{ fontSize: "0.72rem", color: "#d1d5db", marginLeft: "4px" }}>
                · Ideal: 27–30 kg
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="px-2 pb-4" style={{ height: "140px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEIGHT_DATA} margin={{ top: 8, right: 12, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[25, 31]}
                  tick={{ fontSize: 9, fill: "#cbd5e1" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReferenceLine y={27} stroke="#16a34a" strokeDasharray="4 3" strokeOpacity={0.35} />
                <ReferenceLine y={30} stroke="#16a34a" strokeDasharray="4 3" strokeOpacity={0.35} />
                <Tooltip content={<WeightTooltip />} cursor={{ stroke: "#2563EB", strokeWidth: 1.5, strokeDasharray: "4 3" }} />
                <Area
                  type="monotoneX"
                  dataKey="weight"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#weightGrad)"
                  dot={(props) => {
                    const isLast = props.index === WEIGHT_DATA.length - 1;
                    return (
                      <circle
                        key={props.index}
                        cx={props.cx}
                        cy={props.cy}
                        r={isLast ? 5 : 3}
                        fill={isLast ? "#2563EB" : "white"}
                        stroke="#2563EB"
                        strokeWidth={isLast ? 0 : 2}
                      />
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Ideal range legend */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 rounded-full" style={{ background: "#16a34a", opacity: 0.4, borderTop: "1.5px dashed #16a34a" }} />
              <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>Ideal range</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#2563EB" }} />
              <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>Weight (kg)</span>
            </div>
          </div>
        </div>

        {/* ── Upcoming appointment preview ── */}
        <div
          className="flex items-center justify-between px-4 py-4 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
            border: "1.5px solid rgba(249,115,22,0.18)",
            boxShadow: "0 4px 20px rgba(249,115,22,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,0.14)" }}
            >
              <CalendarPlus className="w-5 h-5" style={{ color: "#F97316" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                Next Appointment
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-2.5 h-2.5" style={{ color: "#F97316" }} />
                <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                  {activePet.nextAppt} · 10:00 AM · Dr. Kim
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: "#F97316" }} />
        </div>

        {/* Heart health tip */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)",
            border: "1.5px solid rgba(168,85,247,0.15)",
          }}
        >
          <Heart className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#a855f7", fill: "#a855f7" }} />
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7e22ce", margin: 0 }}>
              Tip for Bella 🐶
            </p>
            <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px", lineHeight: 1.5 }}>
              Golden Retrievers gain weight easily in winter. Consider a light walk every day and reduce treat portions by 10%.
            </p>
          </div>
        </div>
      </div>

      {/* ── Floating Action Button ── */}
      <div
        className="absolute bottom-6 left-0 right-0 flex justify-center"
        style={{ pointerEvents: "none" }}
      >
        <button
          onPointerDown={() => setFabPressed(true)}
          onPointerUp={() => setFabPressed(false)}
          onPointerLeave={() => setFabPressed(false)}
          onClick={onBookAppointment}
          className="flex items-center gap-2.5 px-7 py-4 rounded-full transition-all duration-150"
          style={{
            pointerEvents: "all",
            background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
            boxShadow: fabPressed
              ? "0 4px 16px rgba(249,115,22,0.5)"
              : "0 8px 28px rgba(249,115,22,0.55), 0 2px 8px rgba(0,0,0,0.12)",
            transform: fabPressed ? "scale(0.96)" : "scale(1)",
          }}
        >
          <CalendarPlus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>
            Book Appointment
          </span>
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
