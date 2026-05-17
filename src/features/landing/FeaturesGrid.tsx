import { useNavigate } from "react-router";
import { Calendar, ShoppingCart, Activity, Users } from "lucide-react";

interface FeaturesGridProps {
  onLearnMore?: (id: string) => void;
}

const features = [
  {
    id: "booking",
    icon: Calendar,
    accentColor: "#2563EB",
    accentBg: "rgba(37,99,235,0.08)",
    tag: "ĐẶT LỊCH HẸN",
    title: "Đặt lịch thông minh",
    description:
      "Hệ thống đặt lịch AI dành cho phòng khám, spa grooming và pet shop — tự động tối ưu khung giờ, chống đặt trùng và giảm 40% tỷ lệ bỏ lỡ lịch hẹn nhờ nhắc nhở đa kênh.",
    bullets: [
      "Cổng đặt lịch trực tuyến 24/7 cho khách hàng",
      "Quản lý lịch theo bác sĩ, stylist hoặc nhân viên",
      "Nhắc nhở tự động qua SMS, Email & Zalo",
    ],
    highlight: "Giảm 40% lỡ lịch hẹn",
    highlightColor: "#2563EB",
  },
  {
    id: "pos",
    icon: ShoppingCart,
    accentColor: "#F97316",
    accentBg: "rgba(249,115,22,0.08)",
    tag: "THANH TOÁN & BÁN HÀNG",
    title: "POS đa năng",
    description:
      "Hệ thống thanh toán và bán hàng toàn diện: xuất hóa đơn từ phiếu khám, tính tiền dịch vụ spa, bán lẻ sản phẩm tại quầy — hỗ trợ mọi hình thức thanh toán và quản lý kho hàng real-time.",
    bullets: [
      "Tạo hóa đơn 1 click từ phiếu khám / dịch vụ",
      "Cổng thanh toán tích hợp: thẻ, QR, ví điện tử",
      "Quản lý kho hàng, thuốc & sản phẩm thú cưng",
    ],
    highlight: "Tiết kiệm 2 giờ/ngày thanh toán",
    highlightColor: "#F97316",
  },
  {
    id: "tracking",
    icon: Activity,
    accentColor: "#0891b2",
    accentBg: "rgba(8,145,178,0.08)",
    tag: "THEO DÕI & HỒ SƠ",
    title: "Hồ sơ thú cưng thông minh",
    description:
      "Hồ sơ kỹ thuật số toàn diện cho mỗi thú cưng — lịch sử khám bệnh, ảnh grooming trước/sau, sở thích dịch vụ, lịch tiêm phòng và kết quả xét nghiệm cập nhật theo thời gian thực.",
    bullets: [
      "Hồ sơ sức khỏe & grooming đầy đủ cho từng thú cưng",
      "Tự động cảnh báo lịch tiêm vaccine, tẩy giun",
      "Chia sẻ hồ sơ với chủ thú cưng qua ứng dụng",
    ],
    highlight: "Hồ sơ thú cưng trọn đời",
    highlightColor: "#0891b2",
  },
  {
    id: "crm",
    icon: Users,
    accentColor: "#7c3aed",
    accentBg: "rgba(124,58,237,0.08)",
    tag: "KHÁCH HÀNG & MARKETING",
    title: "CRM & Giữ chân khách hàng",
    description:
      "Biến mỗi khách hàng thành khách hàng trung thành — phân khúc thông minh, chiến dịch marketing đa kênh, chương trình tích điểm và dự đoán rời bỏ phù hợp cho mọi loại hình dịch vụ.",
    bullets: [
      "Chiến dịch tự động: nhắc lịch, khuyến mãi, sinh nhật",
      "Chương trình tích điểm & thẻ thành viên",
      "Phân tích hành vi & dự đoán khách hàng rời bỏ",
    ],
    highlight: "Giữ chân khách hàng gấp 3×",
    highlightColor: "#7c3aed",
  },
];

export function FeaturesGrid({ onLearnMore }: FeaturesGridProps) {
  const navigate = useNavigate();

  function handleLearnMore(id: string) {
    navigate(`/features/${id}`);
  }

  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)" }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.06em" }}>
              CÁC PHÂN HỆ CHÍNH
            </span>
          </div>
          <h2
            className="text-gray-900"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            Tất cả những gì cơ sở cần,
            <br />
            <span style={{ color: "#2563EB" }}>trên một nền tảng duy nhất</span>
          </h2>
          <p
            className="mt-4 text-gray-500 max-w-xl mx-auto"
            style={{ fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.7 }}
          >
            Bốn phân hệ tích hợp sâu thay thế hơn 6 công cụ rời rạc — được tối ưu cho phòng khám thú y, pet spa và pet shop.
          </p>
          <p className="mt-2" style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
            Nhấn <strong style={{ color: "#2563EB" }}>"Xem thực tế"</strong> ở mỗi tính năng để xem giao diện thực tế mà đội ngũ bạn sẽ sử dụng.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
                  style={{ background: feature.accentColor, opacity: 0.4 }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feature.accentBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.accentColor }} strokeWidth={2} />
                </div>

                {/* Tag */}
                <div
                  className="text-xs mb-2"
                  style={{ fontWeight: 700, color: feature.accentColor, letterSpacing: "0.07em" }}
                >
                  {feature.tag}
                </div>

                {/* Title */}
                <h3
                  className="text-gray-900 mb-3"
                  style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-500 mb-5 flex-1"
                  style={{ fontSize: "0.875rem", lineHeight: 1.65 }}
                >
                  {feature.description}
                </p>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-2 mb-5">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: feature.accentBg }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: feature.accentColor }}
                        />
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#4b5563", lineHeight: 1.5 }}>
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Highlight Pill */}
                <div
                  className="mt-auto inline-flex self-start px-3 py-1.5 rounded-full"
                  style={{ background: feature.accentBg }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: feature.accentColor }}>
                    {feature.highlight}
                  </span>
                </div>

                {/* See it in action button */}
                <button
                  onClick={() => handleLearnMore(feature.id)}
                  className="mt-4 flex items-center gap-1.5 px-4 py-2.5 rounded-xl w-full justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: feature.accentBg,
                    border: `1px solid ${feature.accentColor}22`,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: feature.accentColor,
                  }}
                >
                  Xem thực tế →
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-14 text-center">
          <p className="text-gray-400 mb-4" style={{ fontSize: "0.875rem" }}>
            Được tin dùng bởi hơn 2.400 phòng khám, spa và pet shop tại Việt Nam & Đông Nam Á
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
            {["Paws Clinic Hà Nội", "Happy Pet Spa", "Thú Cưng Shop SG", "PetCare Network", "Four Paws Vietnam"].map((brand) => (
              <span
                key={brand}
                className="text-gray-500"
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
