import { ArrowRight, Stethoscope, Scissors, ShoppingBag, Check } from "lucide-react";
import { motion } from "motion/react";

interface BusinessTypesSectionProps {
  onRegister?: () => void;
}

const businessTypes = [
  {
    id: "clinic",
    icon: Stethoscope,
    emoji: "🏥",
    accentColor: "#2563EB",
    accentBg: "rgba(37,99,235,0.06)",
    glowColor: "rgba(37,99,235,0.08)",
    tag: "PHÒNG KHÁM THÚ Y",
    title: "Clinic Management",
    titleVi: "Quản lý phòng khám",
    description:
      "Tối ưu hóa toàn bộ hoạt động lâm sàng với hệ thống lưu bệnh án điện tử, đặt khám trực tuyến và kê đơn dược phẩm.",
    features: [
      "Hồ sơ bệnh án điện tử (EMR) chuẩn y khoa",
      "Kê đơn thuốc & quản lý kho dược tự động",
      "Theo dõi chỉ số sinh tồn & lịch nhắc hẹn khám",
    ],
    stat: "40%",
    statLabel: "Giảm tỷ lệ bỏ lỡ lịch hẹn",
  },
  {
    id: "spa",
    icon: Scissors,
    emoji: "✂️",
    accentColor: "#0D9488",
    accentBg: "rgba(13,148,136,0.06)",
    glowColor: "rgba(13,148,136,0.08)",
    tag: "PET SPA & GROOMING",
    title: "Spa Management",
    titleVi: "Quản lý Spa & Grooming",
    description:
      "Quản lý lịch tắm sấy, cắt tỉa chuyên nghiệp theo từng thợ (stylist), cập nhật hình ảnh trước/sau làm đẹp nhanh chóng.",
    features: [
      "Lịch grooming thông minh chia theo stylist",
      "Hồ sơ kiểu dáng & thư viện ảnh thú cưng trước/sau",
      "Tích điểm thành viên tự động sau mỗi buổi spa",
    ],
    stat: "3x",
    statLabel: "Tăng tần suất khách hàng quay lại",
  },
  {
    id: "shop",
    icon: ShoppingBag,
    emoji: "🛒",
    accentColor: "#7C3AED",
    accentBg: "rgba(124,58,237,0.06)",
    glowColor: "rgba(124,58,237,0.08)",
    tag: "PET SHOP & BÁN LẺ",
    title: "Retail Management",
    titleVi: "Quản lý Pet Shop & Bán lẻ",
    description:
      "Hệ thống quản lý hàng nghìn mã hàng (SKU), xuất nhập kho thông minh và tích hợp thanh toán quét QR tại quầy tiện lợi.",
    features: [
      "Quản lý tồn kho hàng hóa & cảnh báo hết hàng",
      "Giao diện bán hàng POS tại quầy cực kỳ mượt mà",
      "Báo cáo sản phẩm bán chạy & biên lợi nhuận",
    ],
    stat: "2h",
    statLabel: "Tiết kiệm thời gian đối soát mỗi ngày",
  },
];

export function BusinessTypesSection({ onRegister }: BusinessTypesSectionProps) {
  return (
    <section
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Light dot grid background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50"
          >
            <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">
              Giải Pháp Chuyên Biệt
            </span>
          </div>
          <h2
            className="text-slate-900 tracking-tight"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.15 }}
          >
            Một hệ thống quản trị, ba lĩnh vực
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              vận hành hoàn hảo
            </span>
          </h2>
          <p
            className="text-slate-500 max-w-xl mx-auto"
            style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.6 }}
          >
            Được thiết kế linh hoạt đáp ứng trọn vẹn đặc thù của từng mô hình kinh doanh dịch vụ thú cưng phổ biến nhất hiện nay.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Background glow for each card */}
                <div 
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                  style={{ background: type.glowColor }}
                />

                {/* Card Header */}
                <div className="p-7 border-b border-slate-50 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100"
                      style={{ background: "#ffffff" }}
                    >
                      {type.emoji}
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[0.62rem] font-bold tracking-wider"
                      style={{
                        background: type.accentBg,
                        color: type.accentColor,
                      }}
                    >
                      {type.tag}
                    </span>
                  </div>
                  <h3
                    className="text-slate-800 font-extrabold"
                    style={{ fontSize: "1.25rem", lineHeight: 1.3, marginBottom: "8px" }}
                  >
                    {type.titleVi}
                  </h3>
                  <p
                    className="text-slate-400 font-medium leading-relaxed"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {type.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="p-7 flex-1 flex flex-col justify-between relative z-10">
                  <ul className="flex flex-col gap-3">
                    {type.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500, lineHeight: 1.5 }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Stat Card */}
                  <div
                    className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl mt-6 border border-slate-100/50"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.8) 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)"
                    }}
                  >
                    <span
                      style={{ 
                        fontSize: "1.75rem", 
                        fontWeight: 900, 
                        color: type.accentColor, 
                        letterSpacing: "-0.03em", 
                        lineHeight: 1 
                      }}
                    >
                      {type.stat}
                    </span>
                    <span style={{ fontSize: "0.76rem", color: "#475569", fontWeight: 600, lineHeight: 1.3 }}>
                      {type.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-slate-400" style={{ fontSize: "0.88rem", fontWeight: 500 }}>
            Bạn vận hành nhiều loại hình cùng lúc? PetTech hỗ trợ đồng bộ dữ liệu đa chi nhánh.
          </p>
          <button
            onClick={onRegister}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/10 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
              color: "white",
              fontSize: "0.9rem",
            }}
          >
            Dùng thử miễn phí
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
