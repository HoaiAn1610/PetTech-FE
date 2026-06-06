import { useEffect, useState } from "react";
import { DollarSign, CalendarCheck, UserX, TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

// ── Sparkline helper ──────────────────────────────────────────────────────────
function Sparkline({
  data,
  color,
  width = 88,
  height = 36,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  const formatted =
    prefix === "$"
      ? `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: 0 })}`
      : `${prefix}${value}${suffix}`;
  return <span>{formatted}</span>;
}

// ── KPI data mapper ────────────────────────────────────────────────────────────
const getKpis = (metrics: any) => [
  {
    id: "revenue",
    label: "Doanh thu tháng này",
    icon: DollarSign,
    value: metrics?.monthlyRevenue || 0,
    prefix: "$",
    suffix: "",
    change: 0,
    changeLabel: "",
    iconBg: "rgba(37,99,235,0.1)",
    iconColor: "#2563EB",
    accentColor: "#2563EB",
    sparkData: metrics?.revenueSpark || [1820, 2450, 2100, 2870, 2600, 3050, 2780, 3240],
    subStat: metrics?.loyaltyRedemptions !== undefined ? `${metrics.loyaltyRedemptions} lượt đổi thưởng` : "0 lượt đổi thưởng",
    subIcon: "🎁",
  },
  {
    id: "bookings",
    label: "Tổng lịch hẹn tháng này",
    icon: CalendarCheck,
    value: metrics?.totalBookings || 0,
    prefix: "",
    suffix: "",
    change: 0,
    changeLabel: "",
    iconBg: "rgba(8,145,178,0.1)",
    iconColor: "#0891b2",
    accentColor: "#0891b2",
    sparkData: metrics?.bookingsSpark || [29, 35, 31, 40, 37, 44, 39, 48],
    subStat: metrics?.bookingFillRate !== undefined ? `${metrics.bookingFillRate.toFixed(1)}% hoàn tất` : "0% hoàn tất",
    subIcon: "📊",
  },
  {
    id: "noshows",
    label: "Tổng khách hàng",
    icon: Users,
    value: metrics?.totalCustomers || 0,
    prefix: "",
    suffix: "",
    change: 0,
    changeLabel: "",
    iconBg: "rgba(249,115,22,0.1)",
    iconColor: "#F97316",
    accentColor: "#F97316",
    sparkData: metrics?.noshowsSpark || [9, 7, 11, 6, 8, 7, 5, 3],
    subStat: "Khách hàng đăng ký",
    subIcon: "👥",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function KPICards({ data, loading }: { data?: any; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />)}
      </div>
    );
  }
  
  const kpis = getKpis(data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isPositive = kpi.change > 0;
        const isNeutral = kpi.change === 0;
        const isGood = kpi.id === "noshows" ? !isPositive : isPositive;
        const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
        const trendColor = isGood ? "#16a34a" : "#dc2626";
        const trendBg = isGood ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)";

        return (
          <div
            key={kpi.id}
            className="relative rounded-2xl bg-white overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              border: "1.5px solid rgba(0,0,0,0.07)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            {/* Thin color bar at top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: kpi.accentColor }}
            />

            <div className="p-6 flex flex-col gap-4">
              {/* Row 1: icon + badge */}
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: kpi.iconBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: kpi.iconColor }} strokeWidth={2.5} />
                </div>
                {/* Live pulse */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.04em" }}>LIVE</span>
                </div>
              </div>

              {/* Row 2: label */}
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em" }}>
                  {kpi.label.toUpperCase()}
                </p>
              </div>

              {/* Row 3: value + sparkline */}
              <div className="flex items-end justify-between gap-4">
                <div
                  className="text-gray-900"
                  style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}
                >
                  <AnimatedNumber target={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="pb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={kpi.sparkData} color={kpi.accentColor} />
                </div>
              </div>

              {/* Row 4: trend + sub-stat */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {kpi.change !== undefined && kpi.change !== 0 ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: trendBg }}
                  >
                    <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} strokeWidth={2.5} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: trendColor }}>
                      {isPositive ? "+" : ""}{kpi.change}%
                    </span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100/50 text-[10px] font-bold text-gray-400">
                    {kpi.id === "noshows" ? "Tổng quan" : "Tháng này"}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "0.8rem" }}>{kpi.subIcon}</span>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500 }}>{kpi.subStat}</span>
                </div>
              </div>

              {/* sub-label */}
              {kpi.changeLabel && (
                <p style={{ fontSize: "0.7rem", color: "#d1d5db", marginTop: "-8px" }}>
                  {kpi.changeLabel}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}