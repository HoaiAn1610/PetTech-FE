import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Clock, TrendingUp, Users, CalendarDays } from "lucide-react";

const hourlyData = [
  { hour: "8 AM",  today: 5,  yesterday: 3,  label: "08:00" },
  { hour: "9 AM",  today: 12, yesterday: 9,  label: "09:00" },
  { hour: "10 AM", today: 18, yesterday: 14, label: "10:00" },
  { hour: "11 AM", today: 22, yesterday: 20, label: "11:00" },
  { hour: "12 PM", today: 15, yesterday: 17, label: "12:00" },
  { hour: "1 PM",  today: 8,  yesterday: 7,  label: "13:00" },
  { hour: "2 PM",  today: 14, yesterday: 11, label: "14:00" },
  { hour: "3 PM",  today: 20, yesterday: 16, label: "15:00" },
  { hour: "4 PM",  today: 25, yesterday: 19, label: "16:00" },
  { hour: "5 PM",  today: 19, yesterday: 22, label: "17:00" },
  { hour: "6 PM",  today: 10, yesterday: 8,  label: "18:00" },
  { hour: "7 PM",  today: 4,  yesterday: 5,  label: "19:00" },
];

const PEAK_HOUR = "4 PM";
const AVG_APPTS = Math.round(
  hourlyData.reduce((a, b) => a + b.today, 0) / hourlyData.length
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const today = payload.find((p) => p.dataKey === "today")?.value ?? 0;
  const yesterday = payload.find((p) => p.dataKey === "yesterday")?.value ?? 0;
  const diff = today - yesterday;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl"
      style={{
        background: "#1e293b",
        border: "1px solid rgba(255,255,255,0.1)",
        minWidth: "160px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
        {label}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2563EB" }} />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>Hôm nay</span>
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{today} ca</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(37,99,235,0.3)" }} />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>Hôm qua</span>
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{yesterday} ca</span>
        </div>
        <div
          className="mt-1 pt-2 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Δ so với hôm qua</span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: diff >= 0 ? "#4ade80" : "#f87171",
            }}
          >
            {diff >= 0 ? "+" : ""}{diff}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Legend dot ────────────────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
      <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>{label}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PeakHoursChart({ data, loading }: { data?: any[]; loading?: boolean }) {
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  if (loading) {
    return <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  const chartData = data && data.length > 0 ? data : hourlyData;
  const currentAvg = Math.round(chartData.reduce((a, b) => a + (b.today || 0), 0) / chartData.length);
  const currentTotal = chartData.reduce((a, b) => a + (b.today || 0), 0);

  const insightCards = [
    {
      icon: Clock,
      color: "#F97316",
      bg: "rgba(249,115,22,0.08)",
      label: "Giờ cao điểm",
      value: PEAK_HOUR,
      sub: "25 lịch hẹn",
    },
    {
      icon: TrendingUp,
      color: "#2563EB",
      bg: "rgba(37,99,235,0.08)",
      label: "Khung giờ bận nhất",
      value: "10 SA – 4 CH",
      sub: "67% lịch hẹn trong ngày",
    },
    {
      icon: Users,
      color: "#0891b2",
      bg: "rgba(8,145,178,0.08)",
      label: "TB / Giờ",
      value: `${currentAvg} ca`,
      sub: "trong giờ làm việc",
    },
    {
      icon: CalendarDays,
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.08)",
      label: "Tổng hôm nay",
      value: `${currentTotal}`,
      sub: "lịch hẹn đã đặt",
    },
  ];

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.08)" }}>
              <Clock className="w-5 h-5" style={{ color: "#2563EB" }} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                Giờ cao điểm
              </h3>
              <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                Lượng lịch hẹn theo giờ · Hôm nay so với hôm qua
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <LegendDot color="#2563EB" label="Hôm nay" />
          <LegendDot color="rgba(37,99,235,0.25)" label="Hôm qua" />
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <span style={{ fontSize: "0.7rem" }}>🔥</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#ea580c" }}>Cao điểm: 16:00</span>
          </div>
        </div>
      </div>

      {/* Insight cards strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {insightCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="px-6 py-4 flex items-center gap-3"
              style={{
                borderRight: i < insightCards.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: card.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.04em" }}>
                  {card.label.toUpperCase()}
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="px-4 py-6">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            barCategoryGap="28%"
            barGap={3}
            onMouseLeave={() => setHoveredHour(null)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0,0,0,0.05)"
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600, fontFamily: "Inter" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Inter" }}
              width={28}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(37,99,235,0.04)", radius: 6 }}
            />
            <ReferenceLine
              y={currentAvg}
              stroke="#F97316"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Avg: ${currentAvg}`,
                position: "insideTopRight",
                fontSize: 10,
                fill: "#F97316",
                fontWeight: 700,
                fontFamily: "Inter",
              }}
            />
            {/* Yesterday bars (background) */}
            <Bar
              dataKey="yesterday"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(d) => setHoveredHour(d.hour)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`yesterday-${entry.hour}`}
                  fill={
                    entry.hour === hoveredHour
                      ? "rgba(37,99,235,0.35)"
                      : "rgba(37,99,235,0.18)"
                  }
                />
              ))}
            </Bar>
            {/* Today bars (foreground) */}
            <Bar
              dataKey="today"
              radius={[5, 5, 0, 0]}
              onMouseEnter={(d) => setHoveredHour(d.hour)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`today-${entry.hour}`}
                  fill={
                    entry.hour === PEAK_HOUR
                      ? "#F97316"
                      : entry.hour === hoveredHour
                      ? "#3b82f6"
                      : "#2563EB"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Footer annotation */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span style={{ fontSize: "0.72rem", color: "#d1d5db" }}>
            🟠 Cột cam = giờ cao điểm &nbsp;·&nbsp; Đường đứt = trung bình ngày
          </span>
        </div>
      </div>
    </div>
  );
}