import { ArrowRight, Stethoscope, Scissors, ShoppingBag } from "lucide-react";

interface BusinessTypesSectionProps {
  onRegister?: () => void;
}

const businessTypes = [
  {
    id: "clinic",
    icon: Stethoscope,
    emoji: "🏥",
    accentColor: "#2563EB",
    accentBg: "rgba(37,99,235,0.07)",
    gradientFrom: "#eff6ff",
    gradientTo: "#dbeafe",
    tag: "PHÒNG KHÁM THÚ Y",
    title: "Clinic Management",
    titleVi: "Quản lý phòng khám",
    description:
      "Giải pháp toàn diện cho phòng khám thú y hiện đại — từ hồ sơ bệnh án điện tử, quản lý lịch khám, đến kê đơn thuốc và theo dõi sức khỏe thú cưng theo thời gian thực.",
    features: [
      { icon: "📋", text: "Hồ sơ bệnh án điện tử (EMR)" },
      { icon: "💊", text: "Kê đơn thuốc & quản lý kho dược" },
      { icon: "🔬", text: "Tích hợp kết quả xét nghiệm tự động IDEXX" },
      { icon: "📡", text: "Theo dõi chỉ số sinh tồn & cảnh báo" },
      { icon: "🧾", text: "Thanh toán POS & xuất hóa đơn tự động" },
    ],
    stat: "40%",
    statLabel: "giảm tỷ lệ bỏ lỡ lịch hẹn",
    highlight: "Phù hợp cho phòng khám đơn lẻ & chuỗi",
  },
  {
    id: "spa",
    icon: Scissors,
    emoji: "✂️",
    accentColor: "#F97316",
    accentBg: "rgba(249,115,22,0.07)",
    gradientFrom: "#fff7ed",
    gradientTo: "#fed7aa",
    tag: "PET SPA & GROOMING",
    title: "Spa Management",
    titleVi: "Quản lý Spa & Grooming",
    description:
      "Nền tảng chuyên biệt cho tiệm grooming và pet spa — quản lý stylist, lịch tắm cắt lông, hồ sơ kiểu dáng thú cưng và chương trình thành viên trung thành hiệu quả.",
    features: [
      { icon: "📅", text: "Lịch grooming thông minh theo stylist" },
      { icon: "🐩", text: "Hồ sơ kiểu dáng & sở thích thú cưng" },
      { icon: "⏱️", text: "Quản lý thời gian dịch vụ & check-in/out" },
      { icon: "📸", text: "Lưu ảnh trước/sau mỗi lần grooming" },
      { icon: "🎁", text: "Chương trình thành viên & tích điểm loyalty" },
    ],
    stat: "3x",
    statLabel: "tăng tỷ lệ khách hàng quay lại",
    highlight: "Phù hợp cho tiệm grooming & pet hotel",
  },
  {
    id: "shop",
    icon: ShoppingBag,
    emoji: "🛒",
    accentColor: "#16a34a",
    accentBg: "rgba(22,163,74,0.07)",
    gradientFrom: "#f0fdf4",
    gradientTo: "#bbf7d0",
    tag: "PET SHOP & CỬA HÀNG",
    title: "Retail Management",
    titleVi: "Quản lý cửa hàng",
    description:
      "Hệ thống bán lẻ đa kênh dành riêng cho pet shop — từ quản lý hàng nghìn SKU sản phẩm, POS bán hàng tại quầy đến thương mại điện tử và quản lý đơn hàng online.",
    features: [
      { icon: "📦", text: "Quản lý kho hàng & danh mục sản phẩm (SKU)" },
      { icon: "🏪", text: "POS bán hàng tại quầy nhanh chóng" },
      { icon: "🌐", text: "Bán hàng online & tích hợp giao hàng" },
      { icon: "🔔", text: "Theo dõi định mức & cảnh báo tồn kho" },
      { icon: "📊", text: "Báo cáo doanh thu & sản phẩm bán chạy" },
    ],
    stat: "2h",
    statLabel: "tiết kiệm mỗi ngày so với thủ công",
    highlight: "Phù hợp cho cửa hàng lẻ & chuỗi",
  },
];

export function BusinessTypesSection({ onRegister }: BusinessTypesSectionProps) {
  return (
    <section
      className="py-24 lg:py-32"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(180deg, white 0%, #f8faff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.06em" }}>
              DÀNH CHO AI?
            </span>
          </div>
          <h2
            className="text-gray-900"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            Một nền tảng, ba loại hình
            <br />
            <span style={{ color: "#F97316" }}>kinh doanh thú cưng</span>
          </h2>
          <p
            className="mt-4 text-gray-500 max-w-2xl mx-auto"
            style={{ fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.7 }}
          >
            PetTech được thiết kế linh hoạt để phục vụ toàn bộ hệ sinh thái dịch vụ thú cưng — mỗi loại hình kinh doanh có bộ tính năng được tối ưu hóa riêng, nhưng vẫn dùng chung một nền tảng dữ liệu thống nhất.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid lg:grid-cols-3 gap-7">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Gradient header band */}
                <div
                  className="px-7 pt-8 pb-6"
                  style={{
                    background: `linear-gradient(135deg, ${type.gradientFrom} 0%, ${type.gradientTo} 100%)`,
                  }}
                >
                  {/* Icon + Tag row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: "white" }}
                    >
                      <span style={{ fontSize: "1.6rem" }}>{type.emoji}</span>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full"
                      style={{
                        background: type.accentBg,
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        color: type.accentColor,
                        letterSpacing: "0.07em",
                      }}
                    >
                      {type.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-gray-900"
                    style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.25, marginBottom: "8px" }}
                  >
                    {type.titleVi}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-600"
                    style={{ fontSize: "0.875rem", lineHeight: 1.65 }}
                  >
                    {type.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="px-7 py-5 flex-1 flex flex-col gap-4">
                  <ul className="flex flex-col gap-2.5">
                    {type.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-base flex-shrink-0 mt-0.5">{f.icon}</span>
                        <span style={{ fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.5 }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stat pill */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mt-2"
                    style={{ background: type.accentBg, border: `1.5px solid ${type.accentColor}22` }}
                  >
                    <span
                      style={{ fontSize: "1.8rem", fontWeight: 900, color: type.accentColor, letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                      {type.stat}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.4 }}>
                      {type.statLabel}
                    </span>
                  </div>

                  {/* Fit note */}
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "auto" }}>
                    ✦ {type.highlight}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p className="text-gray-400 mb-3" style={{ fontSize: "0.875rem" }}>
            Sở hữu nhiều loại hình? PetTech hỗ trợ vận hành đa cơ sở từ một dashboard duy nhất.
          </p>
          <button
            onClick={onRegister}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.88rem",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}
          >
            Dùng thử miễn phí
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

