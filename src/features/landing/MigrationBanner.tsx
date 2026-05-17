import { ArrowRight, ShieldCheck, Clock, Database, HeartHandshake, Sparkles } from "lucide-react";

interface MigrationBannerProps {
  onClaim?: () => void;
  onGuide?: () => void;
}

const migrationPerks = [
  {
    icon: Database,
    title: "Chuyển dữ liệu toàn bộ",
    desc: "Mọi hồ sơ bệnh nhân, hóa đơn và lịch sử được chuyển với độ chính xác tuyệt đối.",
  },
  {
    icon: Clock,
    title: "Không gián đoạn hoạt động",
    desc: "Chúng tôi di chuyển dữ liệu ngầm. Phòng khám của bạn không bao giờ bị dừng lại.",
  },
  {
    icon: ShieldCheck,
    title: "Mã hóa & bảo mật",
    desc: "Mã hóa AES-256 cấp quân sự xuyên suốt toàn bộ quá trình.",
  },
  {
    icon: HeartHandshake,
    title: "Chuyên viên hỗ trợ riêng",
    desc: "Một kỹ sư di chuyển được chỉ định riêng cho phòng khám của bạn trong 90 ngày.",
  },
];

export function MigrationBanner({ onClaim, onGuide }: MigrationBannerProps) {
  return (
    <section
      id="migration"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 35%, #2563EB 65%, #1e40af 100%)",
        }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F97316 0%, transparent 70%)",
          transform: "translate(20%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(249,115,22,0.2)",
              border: "1.5px solid rgba(249,115,22,0.5)",
            }}
          >
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fed7aa", letterSpacing: "0.05em" }}>
              DỊCH VỤ CHĂM SÓC TOÀN DIỆN • MIỄN PHÍ KHI ĐĂNG KÝ GÓI NĂM
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center mb-14">
          <h2
            className="text-white mb-5"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Di chuyển dữ liệu
            <br />
            <span style={{ color: "#fb923c" }}>chuyên nghiệp, trọn gói</span>
          </h2>
          <p
            className="text-blue-100 max-w-2xl mx-auto"
            style={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1.7 }}
          >
            Đang dùng ezyVet, Cornerstone, Vetspire hay hệ thống khác? Đội ngũ chuyên gia của chúng tôi xử lý
            mọi thứ — từ đầu đến cuối — để nhân viên của bạn không phải lo lắng gì.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {migrationPerks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-2xl p-6 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(249,115,22,0.2)" }}
                >
                  <Icon className="w-5 h-5 text-orange-300" strokeWidth={2} />
                </div>
                <div>
                  <h3
                    className="text-white mb-1.5"
                    style={{ fontSize: "0.95rem", fontWeight: 700 }}
                  >
                    {perk.title}
                  </h3>
                  <p className="text-blue-200" style={{ fontSize: "0.83rem", lineHeight: 1.6 }}>
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline graphic */}
        <div
          className="rounded-2xl p-8 mb-14"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p
            className="text-center text-blue-200 mb-8"
            style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em" }}
          >
            LỘ TRÌNH DI CHUYỂN — PHÒNG KHÁM THƯỜNG ĐI VÀO HOẠT ĐỘNG TRONG 5 NGÀY
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {[
              { day: "Ngày 1",   label: "Cuộc gọi khảo sát",  color: "#60a5fa" },
              { day: "Ngày 2–3", label: "Trích xuất dữ liệu",  color: "#93c5fd" },
              { day: "Ngày 3–4", label: "Kiểm tra & xác nhận", color: "#fb923c" },
              { day: "Ngày 4–5", label: "Chuyển sang hệ thống mới", color: "#F97316" },
              { day: "Ngày 5+",  label: "Hỗ trợ 90 ngày",     color: "#22c55e" },
            ].map((step, i, arr) => (
              <div key={step.day} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: step.color, boxShadow: `0 0 16px ${step.color}60` }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "white" }}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: step.color }}>
                      {step.day}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                      {step.label}
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="hidden sm:block h-px flex-1 min-w-8"
                    style={{ background: "rgba(255,255,255,0.15)", minWidth: "40px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onClaim}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #ea6c0a 100%)",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(249,115,22,0.5)",
            }}
          >
            Nhận gói di chuyển miễn phí
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onGuide}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.15]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "white",
            }}
          >
            Đọc hướng dẫn di chuyển
          </button>
        </div>

        {/* Small print */}
        <p
          className="text-center mt-6 text-blue-300"
          style={{ fontSize: "0.78rem" }}
        >
          Tương thích với hơn 40 hệ thống thú y • Đánh giá trung bình di chuyển: 4,8/5 ★ từ hơn 900 phòng khám
        </p>
      </div>
    </section>
  );
}

