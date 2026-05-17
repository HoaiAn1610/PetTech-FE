import { useState } from "react";
import {
  CalendarPlus,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  Star,
  Activity,
  Sparkles,
  Pill,
  Syringe,
  ArrowRight,
  Zap,
  Shield,
  CalendarDays,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PETS = [
  {
    id: "p1", name: "Bella",    breed: "Golden Retriever", age: "3y",
    photo: "https://images.unsplash.com/photo-1608262941082-65cfdb51c571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    accent: "#F97316", status: "Healthy",      emoji: "🐶", nextAppt: "Apr 12",
  },
  {
    id: "p2", name: "Mochi",    breed: "Orange Tabby",     age: "2y",
    photo: "https://images.unsplash.com/photo-1768467485628-aa824803377b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    accent: "#d97706", status: "Vaccine Due", emoji: "🐱", nextAppt: "May 3",
  },
  {
    id: "p3", name: "Snowball", breed: "Dutch Rabbit",     age: "1y",
    photo: "https://images.unsplash.com/photo-1643212263657-505473e76c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    accent: "#7c3aed", status: "Healthy",      emoji: "🐰", nextAppt: "Jun 18",
  },
];

const VACCINES = [
  { name: "Rabies",         due: "Mar 2023",      status: "done"    },
  { name: "DHPP Combo",     due: "Jan 2023",      status: "done"    },
  { name: "Bordetella",     due: "Dec 2022",      status: "done"    },
  { name: "Leptospirosis",  due: "Due Apr 15",    status: "upcoming"},
  { name: "Rabies Booster", due: "Due Jun 2",     status: "overdue" },
];

const WEIGHT_DATA = [
  { month: "Oct", weight: 13.2 },
  { month: "Nov", weight: 13.5 },
  { month: "Dec", weight: 13.8 },
  { month: "Jan", weight: 14.0 },
  { month: "Feb", weight: 14.1 },
  { month: "Mar", weight: 14.2 },
];

const QUICK_ACTIONS = [
  { icon: CalendarPlus, label: "Book",    color: "#2563EB", bg: "rgba(37,99,235,0.09)"  },
  { icon: Pill,         label: "Meds",    color: "#16a34a", bg: "rgba(22,163,74,0.09)"  },
  { icon: Activity,     label: "Records", color: "#7c3aed", bg: "rgba(124,58,237,0.09)" },
  { icon: MapPin,       label: "Find Vet",color: "#F97316", bg: "rgba(249,115,22,0.09)" },
];

// ─── Status chip ──────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; dot: string }> = {
    "Healthy":     { color: "#16a34a", bg: "rgba(22,163,74,0.1)",   dot: "#16a34a" },
    "Vaccine Due": { color: "#d97706", bg: "rgba(217,119,6,0.1)",   dot: "#f59e0b" },
    "Monitoring":  { color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  dot: "#7c3aed" },
  };
  const cfg = map[status] ?? { color: "#6b7280", bg: "rgba(107,114,128,0.1)", dot: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
      style={{ background: cfg.bg, fontSize: "0.6rem", fontWeight: 800, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function WeightTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-2.5 py-1.5 rounded-xl" style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{label}</p>
      <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#2563EB" }}>{payload[0].value} kg</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PWAHomeScreen() {
  const [activePet, setActivePet] = useState(0);
  const pet = PETS[activePet];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" :
    now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "#f4f6fb", scrollbarWidth: "none" }}
    >
      {/* ── Hero greeting banner ── */}
      <div
        className="relative px-5 pt-5 pb-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 70%, #2563EB 100%)" }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginTop: "2px" }}>
                {greeting}, Sarah 👋
              </h1>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)" }}
            >
              <Zap className="w-3 h-3" style={{ color: "#fed7aa", fill: "#fed7aa" }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#fed7aa" }}>2,840 pts</span>
            </div>
          </div>

          {/* Summary stat pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {[
              { label: "3 Pets", color: "rgba(255,255,255,0.15)" },
              { label: "Next: Apr 12", color: "rgba(249,115,22,0.25)", textColor: "#fed7aa" },
              { label: "1 Vaccine Due", color: "rgba(220,38,38,0.25)", textColor: "#fca5a5" },
            ].map((s) => (
              <span
                key={s.label}
                className="px-3 py-1 rounded-full"
                style={{ background: s.color, fontSize: "0.68rem", fontWeight: 700, color: s.textColor ?? "rgba(255,255,255,0.8)" }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-6">

        {/* ── Your Pets ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>Your Pets</h2>
            <button className="flex items-center gap-1" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB" }}>
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pet tab switcher */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {PETS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePet(i)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl flex-shrink-0 transition-all"
                style={{
                  background: activePet === i ? `${p.accent}15` : "white",
                  border: activePet === i ? `1.5px solid ${p.accent}40` : "1.5px solid rgba(0,0,0,0.07)",
                  boxShadow: activePet === i ? `0 4px 14px ${p.accent}22` : "none",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{p.emoji}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: activePet === i ? 800 : 600, color: activePet === i ? p.accent : "#6b7280" }}>
                  {p.name}
                </span>
                {p.status === "Vaccine Due" && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                )}
              </button>
            ))}
          </div>

          {/* Active pet card */}
          <div
            className="rounded-3xl overflow-hidden transition-all duration-300"
            style={{
              background: "white",
              border: "1.5px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
            }}
          >
            <div className="flex items-stretch">
              {/* Pet photo */}
              <div className="flex-shrink-0 relative" style={{ width: "110px" }}>
                <ImageWithFallback
                  src={pet.photo}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "120px" }}
                />
                <div
                  className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                >
                  <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "white" }}>{pet.age}</span>
                </div>
              </div>

              {/* Pet info */}
              <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
                        {pet.name}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "1px" }}>{pet.breed}</p>
                    </div>
                    <StatusChip status={pet.status} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                      Next visit: <strong style={{ color: "#111827" }}>{pet.nextAppt}</strong>
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-1.5 mt-1"
                    style={{ fontSize: "0.72rem", fontWeight: 700, color: pet.accent }}
                  >
                    View full profile <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Next Appointment card ── */}
        <section>
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(37,99,235,0.03))",
              border: "1.5px solid rgba(37,99,235,0.18)",
              boxShadow: "0 4px 20px rgba(37,99,235,0.1)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: "#2563EB" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827" }}>Upcoming Appointment</span>
              </div>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(22,163,74,0.12)", fontSize: "0.6rem", fontWeight: 800, color: "#16a34a" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Confirmed
              </span>
            </div>
            <div className="px-4 py-3.5 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 900, color: "white", lineHeight: 1 }}>12</span>
                <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>APR</span>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>Full Grooming Package</p>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>
                  10:30 AM · Jamie Reyes ⭐ 4.9
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3 h-3" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Paws &amp; Claws Clinic · 1.2 km</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Health at a glance ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>Health at a Glance</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Weight",    value: "14.2 kg", icon: TrendingUp,   color: "#2563EB", bg: "rgba(37,99,235,0.07)",   sub: "Ideal range" },
              { label: "Vaccines",  value: "3 / 5",   icon: Shield,       color: "#16a34a", bg: "rgba(22,163,74,0.07)",   sub: "2 upcoming"  },
              { label: "Last Visit",value: "12 days", icon: Clock,        color: "#7c3aed", bg: "rgba(124,58,237,0.07)",  sub: "Mar 7, 2026" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 px-3.5 py-3.5 rounded-2xl"
                style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.01em" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "#9ca3af", marginTop: "1px" }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: "0.55rem", color: "#d1d5db", marginTop: "1px" }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_ACTIONS.map(({ icon: Icon, label, color, bg }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl transition-all active:scale-95"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#374151" }}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Weight Trend ── */}
        <section>
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "#2563EB" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827" }}>Weight History</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" style={{ color: "#dc2626", fill: "#dc2626" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af" }}>6 months</span>
              </div>
            </div>
            <div className="px-2 pt-3 pb-2">
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={WEIGHT_DATA} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pwaWeightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[12, 15]} />
                  <Tooltip content={<WeightTooltip />} />
                  <ReferenceLine y={14.5} stroke="#16a34a" strokeDasharray="3 3" strokeWidth={1} />
                  <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2} fill="url(#pwaWeightGrad)" dot={{ r: 2.5, fill: "#2563EB", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div
              className="flex items-center justify-center gap-4 px-4 py-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "#fafafa" }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#2563EB" }} />
                <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>Weight (kg)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-px border-t-2 border-dashed" style={{ borderColor: "#16a34a" }} />
                <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>Ideal upper range</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Vaccine Passport ── */}
        <section>
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(37,99,235,0.01))" }}
            >
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4" style={{ color: "#2563EB" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827" }}>Vaccine Passport</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(22,163,74,0.1)", fontSize: "0.6rem", fontWeight: 800, color: "#16a34a" }}
                >
                  3 / 5 Done
                </span>
              </div>
            </div>
            <div className="px-4 py-1">
              {VACCINES.map((v, i) => (
                <div
                  key={v.name}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: i < VACCINES.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                >
                  {v.status === "done" ? (
                    <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "#16a34a" }} />
                  ) : v.status === "overdue" ? (
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "#dc2626" }} />
                  ) : (
                    <Clock className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "#d97706" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{v.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: v.status === "done" ? "#9ca3af" : v.status === "overdue" ? "#dc2626" : "#d97706",
                    }}
                  >
                    {v.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Offer banner ── */}
        <div
          className="flex items-center gap-3 px-4 py-4 rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #F97316, #ea580c)",
            boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
          />
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "0.82rem", fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>
              Spring Grooming 15% Off!
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.75)", marginTop: "1px" }}>
              Valid through April 30 · Use code SPRING15
            </p>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)", fontSize: "0.68rem", fontWeight: 800, color: "white" }}
          >
            Grab <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
