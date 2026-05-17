import { useNavigate, Link } from "react-router";
import { X, Home, Sparkles, CheckCircle2 } from "lucide-react";

interface DemoWelcomeBannerProps {
  onClose: () => void;
}

export function DemoWelcomeBanner({ onClose }: DemoWelcomeBannerProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 50%,#1d4ed8 100%)",
        boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
      }}
    >
      {/* Background sparkle pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 50%, white 1px, transparent 1px), radial-gradient(circle at 90% 20%, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.07em",
                }}
              >
                ĐẶT LỊCH DEMO THÀNH CÔNG
              </span>
            </div>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.3,
              }}
            >
              Chào mừng đến PetTech! 🐾 Bạn đang xem trước Dashboard chủ phòng
              khám.
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.7)",
                marginTop: "2px",
                lineHeight: 1.5,
              }}
            >
              Đây chính xác là những gì phòng khám của bạn sẽ thấy khi đi live.
              Hãy khám phá thoải mái — tất cả đều là demo với dữ liệu mẫu.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      {/* Bottom tip strip */}
      <div
        className="px-6 py-2.5 flex items-center gap-4 flex-wrap"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.12)",
        }}
      >
        <Sparkles
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: "#fbbf24" }}
        />
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>
          Thử sidebar:
        </span>
        {[
          { label: "📅 Lịch hẹn", to: "/dashboard/appointments" },
          { label: "💳 POS & Thanh toán", to: "/dashboard/pos" },
          { label: "🐾 Bệnh nhân", to: "/dashboard/patients" },
          { label: "📊 Báo cáo", to: "/dashboard/reports" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="px-2.5 py-1 rounded-lg hover:bg-white/20 transition-colors"
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "white",
              background: "rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
