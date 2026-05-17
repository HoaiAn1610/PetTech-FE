import { Link } from "react-router";
import {
  Zap,
  ArrowRight,
  Users,
  Stethoscope,
  HardDrive,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const usageLimits = [
  {
    id: "staff",
    label: "Nhân viên",
    icon: Users,
    used: 4,
    total: 10,
    unit: "người",
    color: "#2563EB",
    trackColor: "rgba(37,99,235,0.12)",
    warnAt: 0.7,
    tip: "Còn 6 chỗ cho nhân viên trên gói Growth",
  },
  {
    id: "patients",
    label: "Bệnh nhân hoạt động",
    icon: Stethoscope,
    used: 2340,
    total: 5000,
    unit: "bệnh nhân",
    color: "#F97316",
    trackColor: "rgba(249,115,22,0.12)",
    warnAt: 0.75,
    tip: "Bạn đang phát triển nhanh — cân nhắc nâng cấp sớm",
  },
  {
    id: "storage",
    label: "Dung lượng lưu trữ",
    icon: HardDrive,
    used: 18,
    total: 50,
    unit: "GB",
    color: "#0891b2",
    trackColor: "rgba(8,145,178,0.12)",
    warnAt: 0.8,
    tip: "Bao gồm hồ sơ, X-quang và tài liệu xét nghiệm",
  },
  {
    id: "locations",
    label: "Chi nhánh phòng khám",
    icon: MapPin,
    used: 1,
    total: 3,
    unit: "chi nhánh",
    color: "#7c3aed",
    trackColor: "rgba(124,58,237,0.12)",
    warnAt: 0.9,
    tip: "Mở rộng tới 3 chi nhánh trên gói Growth",
  },
];

const planFeatures = [
  "Đặt lịch thông minh & Cổng online",
  "POS + Quản lý kho dược",
  "Theo dõi sức khoẻ thời gian thực",
  "CRM & Tự động hoá marketing",
  "Hỗ trợ Email & Chat ưu tiên",
  "Di chuyển dữ liệu chuyên nghiệp",
];

function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      className="h-full rounded-full transition-all duration-700 ease-out"
      style={{ width: `${width}%`, background: color }}
    />
  );
}

export function PlanUsageSection() {
  const nextBilling = "April 4, 2026";
  const daysLeft = 31;

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Plan Header Card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        {/* Blue top band */}
        <div
          className="px-8 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563EB 60%, #3b82f6 100%)" }}
        >
          <div className="flex items-center gap-4">
            {/* Plan badge */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}
            >
              <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>
                GÓI HIỆN TẠI
              </p>
              <h2
                className="text-white flex items-center gap-3"
                style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2 }}
              >
                Growth
                <span
                  className="px-3 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.18)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em" }}
                >
                  KHAI THÁC HIỆN TẠI
                </span>
              </h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>
                $149 / tháng · Thanh toán hàng tháng
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Days left */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)" }}
            >
              <Clock className="w-4 h-4 text-blue-200" />
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                  THANH TOÁN TIẾP THEO
                </p>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>
                  {nextBilling} &nbsp;·&nbsp; còn {daysLeft} ngày
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/billing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "white",
                textDecoration: "none",
              }}
            >
              Quản lý gói dịch vụ
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/dashboard/billing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #ea6c0a 100%)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
              }}
            >
              <TrendingUp className="w-4 h-4" />
              Nâng cấp lên Scale
            </Link>
          </div>
        </div>

        {/* Included features strip */}
        <div
          className="px-8 py-3.5 flex flex-wrap gap-x-6 gap-y-1.5"
          style={{ background: "#f8faff", borderTop: "1px solid rgba(37,99,235,0.1)" }}
        >
          {planFeatures.map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Usage Limits ── */}
      <div
        className="rounded-2xl bg-white p-8"
        style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              Sử dụng tài nguyên
            </h3>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.8rem" }}>
              Cập nhật theo thời gian thực · Làm mới vào ngày 4/4/2026
            </p>
          </div>
          <Link
            to="/dashboard/billing"
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            style={{ fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}
          >
            Xem tất cả giới hạn <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {usageLimits.map((item) => {
            const Icon = item.icon;
            const pct = Math.round((item.used / item.total) * 100);
            const isWarning = pct / 100 >= item.warnAt;

            return (
              <div key={item.id} className="flex flex-col gap-3">
                {/* Label row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: item.trackColor }}
                    >
                      <Icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isWarning && (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(249,115,22,0.1)", fontSize: "0.65rem", fontWeight: 700, color: "#ea580c", letterSpacing: "0.04em" }}
                      >
                        HIGH
                      </span>
                    )}
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>
                      {item.used.toLocaleString()}
                      <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                        {" "}/ {item.total.toLocaleString()} {item.unit}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Track */}
                <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: item.trackColor }}>
                  <AnimatedBar pct={pct} color={isWarning && item.id !== "staff" ? "#F97316" : item.color} />
                </div>

                {/* Subtext */}
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{item.tip}</p>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: isWarning && item.id !== "staff" ? "#ea580c" : item.color,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}