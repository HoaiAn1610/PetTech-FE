import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft, PawPrint, Calendar, ShoppingCart, Activity, Users,
  Check, ArrowRight, X, ChevronRight, Bell, Search, Plus, Star,
  Clock, User, Phone, Mail, Package, TrendingUp, Zap, Shield,
  CheckCircle2,
} from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

// ─── Feature content database ─────────────────────────────────────────────────
const FEATURES: Record<string, {
  id: string;
  label: string;
  tag: string;
  color: string;
  bg: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  headline: string;
  subline: string;
  stat: { value: string; label: string }[];
  steps: { icon: string; title: string; desc: string }[];
  benefits: { icon: string; title: string; desc: string }[];
  mockupImage: string;
}> = {
  booking: {
    id: "booking",
    label: "Smart Booking",
    tag: "ĐẶT LỊCH HẸN",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.07)",
    gradient: "linear-gradient(135deg,#2563EB 0%,#1d4ed8 100%)",
    icon: Calendar,
    headline: "Lịch hẹn tự đặt mà không cần nhân viên",
    subline: "Lên lịch bằng AI giảm tỷ lệ bỏ lỡ 40% và cho phép chủ thú cưng đặt lịch 24/7 từ mọi thiết bị — để đội ngũ của bạn tập trung vào việc chăm sóc, không phải lịch hẹn.",
    stat: [
      { value: "40%", label: "Giảm tỷ lệ bỏ lỡ" },
      { value: "24/7", label: "Tự đặt lịch" },
      { value: "2 phút", label: "Thời gian đặt lịch" },
      { value: "98%", label: "Chủ thú cưng hài lòng" },
    ],
    steps: [
      { icon: "📲", title: "Chủ thú cưng mở cổng đặt lịch", desc: "Họ truy cập trang đặt lịch thương hiệu của phòng khám, thấy các khung giờ trống theo thời gian thực và chọn dịch vụ — không cần đăng nhập." },
      { icon: "🤖", title: "AI tối ưu hóa lịch trình", desc: "PetTech tự động phân công lịch hẹn cho bác sĩ phù hợp nhất dựa trên chuyên môn, phòng khám trống và khối lượng công việc hiện tại." },
      { icon: "📩", title: "Xác nhận và nhắc nhở tự động", desc: "Chủ thú cưng nhận ngay SMS + email xác nhận. Nhắc nhở được gửi trước 48 giờ, 24 giờ và 2 giờ — giảm đáng kể tỷ l��� bỏ lỡ." },
      { icon: "📋", title: "Đội ngũ mở hồ sơ đã chuẩn bị sẵn", desc: "Đến giờ hẹn, hồ sơ sức khỏe, lịch sử khám và ghi chú của bệnh nhân đã được tải sẵn — không cần chuẩn bị thêm." },
    ],
    benefits: [
      { icon: "🔗", title: "Đồng bộ Google & Outlook", desc: "Đồng bộ hai chiều để không bỏ sót bất kỳ lịch hẹn nào." },
      { icon: "🌐", title: "Đặt lịch đa kênh", desc: "Website, Facebook, mã QR và kiosk check-in — tất cả đồng bộ về một dashboard." },
      { icon: "📊", title: "Quản lý danh sách chờ", desc: "Danh sách chờ tự động lấp đầy khung giờ bị hủy trong vài phút." },
      { icon: "🔔", title: "Nhắc nhở thông minh", desc: "Nhắc nhở qua SMS, email và Zalo có thể tùy chỉnh mà chủ thú cưng thực sự đọc." },
    ],
    mockupImage: "https://images.unsplash.com/photo-1770836037793-95bdbf190f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  pos: {
    id: "pos",
    label: "Smart POS",
    tag: "THANH TOÁN",
    color: "#F97316",
    bg: "rgba(249,115,22,0.07)",
    gradient: "linear-gradient(135deg,#F97316 0%,#ea6c0a 100%)",
    icon: ShoppingCart,
    headline: "Từ ghi chú khám đến hóa đơn thanh toán chỉ một click",
    subline: "Hệ thống POS chuyên dụng thú y tự động tạo hóa đơn từ kế hoạch điều trị, chấp nhận mọi phương thức thanh toán và đồng bộ kho thuốc theo thời gian thực.",
    stat: [
      { value: "1-click", label: "Tạo hóa đơn" },
      { value: "2 giờ", label: "Tiết kiệm mỗi ngày" },
      { value: "99,9%", label: "Uptime thanh toán" },
      { value: "12+", label: "Phương thức thanh toán" },
    ],
    steps: [
      { icon: "📋", title: "Bác sĩ hoàn tất ghi chú khám", desc: "Sau tư vấn, bác sĩ ghi lại điều trị, thuốc và thủ thuật trực tiếp trong PetTech — không cần bước lập hóa đơn riêng." },
      { icon: "⚡", title: "Hóa đơn được tạo tự động", desc: "PetTech tức thì tạo hóa đơn chi tiết từ ghi chú khám, lấy giá thời gian thực, thuế suất và quy tắc bảo hiểm." },
      { icon: "💳", title: "Chủ thú cưng thanh toán trong vài giây", desc: "Thẻ, chạm để trả, mã QR, chuyển khoản ngân hàng hay trả góp — chủ thú cưng chọn; PetTech xử lý mọi thứ." },
      { icon: "📦", title: "Kho hàng tự động trừ", desc: "Thuốc được cấp phát sẽ tự động trừ khỏi kho, kích hoạt cảnh báo đặt lại trước khi hết hàng." },
    ],
    benefits: [
      { icon: "💊", title: "Tích hợp nhà thuốc", desc: "Đồng bộ kho trực tiếp với đặt lại tự động khi tồn kho thấp." },
      { icon: "🧾", title: "Chia hóa đơn", desc: "Chia hóa đơn giữa chủ sở hữu, công ty bảo hiểm hoặc kế hoạch trả góp." },
      { icon: "📈", title: "Phân tích doanh thu", desc: "Xem doanh thu theo bác sĩ, dịch vụ và khoảng thời gian với báo cáo một click." },
      { icon: "🔒", title: "An toàn & tuân thủ", desc: "Xử lý thanh toán tuân thủ PCI-DSS với mã hóa đầu cuối." },
    ],
    mockupImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  tracking: {
    id: "tracking",
    label: "Theo dõi thời gian thực",
    tag: "GIÁM SÁT",
    color: "#0891b2",
    bg: "rgba(8,145,178,0.07)",
    gradient: "linear-gradient(135deg,#0891b2 0%,#0e7490 100%)",
    icon: Activity,
    headline: "Sức khỏe mỗi bệnh nhân, trực tiếp trên một màn hình",
    subline: "Chỉ số sinh tồn theo thời gian thực, kết quả xét nghiệm và dữ liệu thiết bị đeo hội tụ trong một dashboard — với cảnh báo AI leo thang trường hợp khẩn cấp đến đúng người ngay lập tức.",
    stat: [
      { value: "Trực tiếp", label: "Giám sát chỉ số sinh tồn" },
      { value: "< 30 giây", label: "Thời gian phản hồi cảnh báo" },
      { value: "15+", label: "Tích hợp xét nghiệm" },
      { value: "100%", label: "Dữ liệu được mã hóa" },
    ],
    steps: [
      { icon: "📡", title: "Kết nối thiết bị đeo hoặc cảm biến phòng khám", desc: "PetFit, Whistle, Tractive và thiết bị giám sát trong phòng khám truyền chỉ số sinh tồn trực tiếp đến PetTech." },
      { icon: "🧬", title: "Kết quả xét nghiệm tự động nhập", desc: "Kết quả từ IDEXX, Zoetis và Heska tự động điền vào dòng thời gian sức khỏe bệnh nhân — không cần nhập thủ công." },
      { icon: "🚨", title: "Cảnh báo khẩn leo thang ngay lập tức", desc: "AI gắn cờ giá trị bất thường và định tuyến cảnh báo qua SMS và thông báo trong ứng dụng đến bác sĩ trực, với lịch quay vòng trực gọi tích hợp." },
      { icon: "📲", title: "Cập nhật chủ thú cưng theo thời gian thực", desc: "Chủ thú cưng nhận thông báo đẩy khi kết quả sẵn sàng và có thể xem tóm tắt trong ứng dụng PetTech." },
    ],
    benefits: [
      { icon: "📉", title: "Dòng thời gian sức khỏe", desc: "Dạng nhìn theo chiều dọc cho từng bệnh nhân hiển thị xu hướng qua nhiều tháng và năm." },
      { icon: "🔗", title: "Đồng bộ thiết bị đeo IoT", desc: "Nhập dữ liệu tự động từ 20+ thiết bị theo dõi sức khỏe thú cưng phổ biến." },
      { icon: "🌡️", title: "Dashboard chỉ số sinh tồn", desc: "Nhịp tim, nhiệt độ, SpO₂ và cân nặng — tất cả theo thời gian thực." },
      { icon: "🤖", title: "Phát hiện bất thường AI", desc: "Mô hình học máy gắn cờ dấu hiệu cảnh báo sớm trước khi trở thành tình trạng khẩn cấp." },
    ],
    mockupImage: "https://images.unsplash.com/photo-1698306642516-9841228dcff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  crm: {
    id: "crm",
    label: "CRM & Marketing",
    tag: "QUAN HỆ KHÁCH HÀNG",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    gradient: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)",
    icon: Users,
    headline: "Mỗi lần khám trở thành mối quan hệ suốt đời",
    subline: "Chiến dịch khách hàng tự động, chương trình tích điểm và dự đoán rời bỏ bằng AI — PetTech CRM biến khách thăm một lần thành người ủng hộ trung thành cho phòng khám của bạn.",
    stat: [
      { value: "3×", label: "Tỷ lệ giữ chân khách hàng" },
      { value: "68%", label: "Tỷ lệ đặt lịch lại" },
      { value: "5 phút", label: "Thiết lập chiến dịch" },
      { value: "1 triệu+", label: "Hồ sơ được huấn luyện" },
    ],
    steps: [
      { icon: "🎯", title: "Tự động phân khúc khách hàng", desc: "PetTech tự động nhóm khách hàng theo ngày vaccine, tần suất thăm khám, tuổi thú cưng và chi tiêu — sẵn sàng để tiếp cận đúng người." },
      { icon: "📧", title: "Khởi chạy chiến dịch trong vài phút", desc: "Chọn phân khúc, chọn mẫu (nhắc vaccine, chúc mừng sinh nhật, giành lại), tùy chỉnh tin nhắn và gửi — hoặc lên lịch." },
      { icon: "🔮", title: "AI xác định khách hàng có nguy cơ rời bỏ", desc: "Mô hình dự đoán rời bỏ — được huấn luyện trên 1 triệu+ hồ sơ phòng khám — gắn cờ khách hàng có khả năng rời bỏ để bạn có thể tái tiếp cận trước khi họ rời đi." },
      { icon: "⭐", title: "Chương trình tích điểm & giới thiệu", desc: "Thưởng điểm cho mỗi lần thăm khám, giới thiệu và đánh giá. Khách hàng theo dõi phần thưởng trong ứng dụng PetTech; đội ngũ của bạn thấy mọi thứ trong dashboard." },
    ],
    benefits: [
      { icon: "📊", title: "Theo dõi ROI chiến dịch", desc: "Tỷ lệ mở, nhấp qua và đặt lịch do mỗi chiến dịch tạo ra." },
      { icon: "📱", title: "Tiếp cận đa kênh", desc: "Email, SMS, Zalo và thông báo đẩy trong ứng dụng — từ một nơi." },
      { icon: "🏆", title: "Cấp độ tích điểm", desc: "Cấp độ Đồng, Bạc, Vàng với tự động mở khóa và phần thưởng." },
      { icon: "💬", title: "Theo dõi tự động", desc: "Tin nhắn sau khám, yêu cầu đánh giá và nhắc nhở sức khỏe tự động." },
    ],
    mockupImage: "https://images.unsplash.com/photo-1610398207451-7bf50e622c16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
};

// ─── Booking mockup UI ────────────────────────────────────────────────────────
function BookingMockup() {
  const [selected, setSelected] = useState(0);
  const appts = [
    { name: "Buddy (Golden Ret.)", owner: "Anh Tuấn", time: "9:00 SA", type: "Khám tổng quát", color: "#2563EB" },
    { name: "Luna (Mèo Ba Tư)",   owner: "Chị Lan",  time: "10:30 SA", type: "Tiêm phòng",    color: "#16a34a" },
    { name: "Max (Labrador)",      owner: "Anh Minh", time: "2:00 CH",  type: "Vệ sinh răng", color: "#F97316" },
  ];
  return (
    <div className="h-full flex flex-col gap-0 text-left overflow-hidden" style={{ fontSize: "0.72rem" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#f8faff" }}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "#2563EB" }} />
          <span style={{ fontWeight: 700, color: "#111827" }}>Lịch hôm nay</span>
          <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(37,99,235,0.1)", color: "#2563EB", fontWeight: 700, fontSize: "0.6rem" }}>6/3</span>
        </div>
        <button className="px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: "#2563EB", color: "white", fontWeight: 700, fontSize: "0.68rem" }}>
          <Plus className="w-3 h-3" /> Mới
        </button>
      </div>
      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar strip */}
        <div className="w-24 flex-shrink-0 p-3 flex flex-col gap-1.5" style={{ background: "#fafbff", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "4px" }}>GIỜ</p>
          {["8 SA", "9 SA", "10 SA", "11 SA", "12 CH", "1 CH", "2 CH", "3 CH", "4 CH"].map((t) => (
            <div key={t} className="flex items-center justify-end" style={{ height: "28px" }}>
              <span style={{ color: "#9ca3af", fontSize: "0.6rem" }}>{t}</span>
            </div>
          ))}
        </div>
        {/* Appointments */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
          {appts.map((a, i) => (
            <div key={i} className="rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: `${a.color}10`, border: `1.5px solid ${a.color}30` }}
              onClick={() => setSelected(i)}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontWeight: 700, color: a.color, fontSize: "0.7rem" }}>{a.time}</span>
                <span className="px-2 py-0.5 rounded-full" style={{ background: `${a.color}18`, color: a.color, fontSize: "0.58rem", fontWeight: 700 }}>{a.type}</span>
              </div>
              <p style={{ fontWeight: 700, color: "#111827", fontSize: "0.75rem" }}>{a.name}</p>
              <p style={{ color: "#6b7280", fontSize: "0.62rem" }}>Chủ: {a.owner}</p>
              {selected === i && (
                <div className="mt-2 pt-2 flex gap-2" style={{ borderTop: `1px solid ${a.color}20` }}>
                  <button className="flex-1 py-1 rounded-lg text-white" style={{ background: a.color, fontSize: "0.62rem", fontWeight: 700 }}>Mở hồ sơ</button>
                  <button className="flex-1 py-1 rounded-lg" style={{ border: `1px solid ${a.color}`, color: a.color, fontSize: "0.62rem", fontWeight: 600 }}>Đổi lịch</button>
                </div>
              )}
            </div>
          ))}
          {/* Available slot */}
          <div className="rounded-xl p-3 border-2 border-dashed flex items-center justify-center gap-2" style={{ borderColor: "#e5e7eb" }}>
            <Plus className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            <span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>1:00 CH — Khung giờ trống</span>
          </div>
        </div>
      </div>
      {/* Bottom status bar */}
      <div className="px-4 py-2 flex items-center gap-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "#f8faff" }}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#16a34a" }} />
          <span style={{ fontSize: "0.62rem", color: "#6b7280" }}>3 đã xác nhận · 1 trống</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Bell className="w-3 h-3" style={{ color: "#9ca3af" }} />
          <span style={{ fontSize: "0.62rem", color: "#6b7280" }}>Đã gửi nhắc nhở</span>
        </div>
      </div>
    </div>
  );
}

// ─── POS mockup UI ───────────────────────────────────────────────────────────
function POSMockup() {
  const [paid, setPaid] = useState(false);
  const items = [
    { name: "Khám sức khỏe tổng quát", qty: 1, price: 85.00 },
    { name: "Vaccine Dại",              qty: 1, price: 32.00 },
    { name: "Heartgard Plus (6 tháng)", qty: 1, price: 54.00 },
    { name: "Xét nghiệm máu cơ bản",   qty: 1, price: 48.00 },
  ];
  const total = items.reduce((s, i) => s + i.price, 0);
  return (
    <div className="h-full flex flex-col text-left overflow-hidden" style={{ fontSize: "0.72rem" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#f8faff" }}>
        <div>
          <p style={{ fontWeight: 700, color: "#111827" }}>Hóa đơn #INV-2841</p>
          <p style={{ color: "#9ca3af", fontSize: "0.62rem" }}>Max · Labrador · BS. Linh</p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: paid ? "rgba(22,163,74,0.1)" : "rgba(249,115,22,0.1)", color: paid ? "#16a34a" : "#F97316", fontWeight: 700, fontSize: "0.62rem" }}>
          {paid ? "✓ Đã thanh toán" : "Chờ thanh toán"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
                <Package className="w-3 h-3" style={{ color: "#F97316" }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#111827" }}>{item.name}</p>
                <p style={{ color: "#9ca3af", fontSize: "0.6rem" }}>SL: {item.qty}</p>
              </div>
            </div>
            <span style={{ fontWeight: 700, color: "#111827" }}>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2" style={{ borderTop: "2px solid rgba(0,0,0,0.08)" }}>
          <div className="flex justify-between items-center mb-1">
            <span style={{ color: "#6b7280" }}>Tạm tính</span>
            <span style={{ fontWeight: 600, color: "#374151" }}>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span style={{ color: "#6b7280" }}>Thuế (8%)</span>
            <span style={{ fontWeight: 600, color: "#374151" }}>${(total * 0.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <span style={{ fontWeight: 800, color: "#111827" }}>Tổng cộng</span>
            <span style={{ fontWeight: 900, color: "#F97316", fontSize: "1rem" }}>${(total * 1.08).toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {["💳 Thẻ", "📱 QR Pay", "💵 Tiền mặt"].map((m) => (
            <button key={m} onClick={() => setPaid(true)}
              className="py-2 rounded-xl text-center transition-all hover:-translate-y-0.5"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.65rem", fontWeight: 600, color: "#374151", background: "white" }}>
              {m}
            </button>
          ))}
        </div>
        {!paid ? (
          <button onClick={() => setPaid(true)}
            className="w-full py-2.5 rounded-xl mt-1 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#F97316,#ea6c0a)", color: "white", fontWeight: 700, fontSize: "0.78rem" }}>
            <Zap className="w-3.5 h-3.5" /> Thu tiền
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(22,163,74,0.08)", border: "1.5px solid rgba(22,163,74,0.2)" }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: "#16a34a" }} />
            <span style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.75rem" }}>Đã thanh toán! Đã gửi biên lai qua SMS.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tracking mockup UI ──────────────────────────────────────────────────────
function TrackingMockup() {
  const vitals = [
    { label: "Nhịp tim",    value: "82",   unit: "bpm", status: "normal", color: "#16a34a", icon: "❤️" },
    { label: "Nhiệt độ",   value: "38,6", unit: "°C",  status: "normal", color: "#16a34a", icon: "🌡️" },
    { label: "SpO₂",       value: "97",   unit: "%",   status: "normal", color: "#16a34a", icon: "💨" },
    { label: "Cân nặng",   value: "28,4", unit: "kg",  status: "check",  color: "#F97316", icon: "⚖️" },
  ];
  const alerts = [
    { time: "09:14", pet: "Bella (Corgi)",   msg: "SpO₂ giảm xuống 91% — phòng 3", severity: "high" },
    { time: "08:55", pet: "Charlie (Poodle)",msg: "Kết quả xét nghiệm sẵn sàng: xét nghiệm máu", severity: "info" },
    { time: "08:30", pet: "Kiwi (Vẹt)",     msg: "Cân nặng ổn định — tái khám OK", severity: "ok" },
  ];
  return (
    <div className="h-full flex flex-col text-left overflow-hidden" style={{ fontSize: "0.72rem" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#f8faff" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: "#0891b2" }} />
          <span style={{ fontWeight: 700, color: "#111827" }}>Theo dõi sức khỏe trực tiếp</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span style={{ color: "#16a34a", fontSize: "0.58rem", fontWeight: 700 }}>LIVE</span>
          </span>
        </div>
        <span style={{ color: "#9ca3af", fontSize: "0.6rem" }}>Max · Phòng 2 · BS. Linh</span>
      </div>
      <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
        {/* Vitals grid */}
        <div className="grid grid-cols-2 gap-2">
          {vitals.map((v) => (
            <div key={v.label} className="rounded-xl p-3" style={{ background: `${v.color}08`, border: `1.5px solid ${v.color}22` }}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "0.65rem", color: "#6b7280" }}>{v.label}</span>
                <span style={{ fontSize: "0.8rem" }}>{v.icon}</span>
              </div>
              <div className="flex items-end gap-1">
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: v.color, lineHeight: 1 }}>{v.value}</span>
                <span style={{ fontSize: "0.62rem", color: "#9ca3af", marginBottom: "2px" }}>{v.unit}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${v.color}15`, color: v.color, fontSize: "0.56rem", fontWeight: 700 }}>
                {v.status === "normal" ? "✓ Bình thường" : "⚠ Cần kiểm tra"}
              </span>
            </div>
          ))}
        </div>
        {/* Alerts */}
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "6px" }}>CẢNH BÁO TRỰC TIẾP</p>
          <div className="flex flex-col gap-1.5">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-xl"
                style={{ background: a.severity === "high" ? "rgba(220,38,38,0.06)" : a.severity === "info" ? "rgba(37,99,235,0.06)" : "rgba(22,163,74,0.06)", border: `1px solid ${a.severity === "high" ? "rgba(220,38,38,0.15)" : a.severity === "info" ? "rgba(37,99,235,0.12)" : "rgba(22,163,74,0.12)"}` }}>
                <span style={{ fontSize: "0.7rem", color: "#9ca3af", flexShrink: 0, marginTop: "1px" }}>{a.time}</span>
                <div>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.68rem" }}>{a.pet}</span>
                  <p style={{ color: "#6b7280", fontSize: "0.62rem" }}>{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CRM mockup UI ───────────────────────────────────────────────────────────
function CRMMockup() {
  const segments = [
    { label: "Cần tiêm vaccine", count: 142, color: "#F97316", icon: "💉" },
    { label: "Không hoạt động 60+ ngày", count: 87, color: "#dc2626", icon: "⏰" },
    { label: "Giá trị cao", count: 56, color: "#7c3aed", icon: "⭐" },
    { label: "Khách hàng mới", count: 34, color: "#16a34a", icon: "🆕" },
  ];
  const [activeSeg, setActiveSeg] = useState(0);
  const clients = [
    { name: "Nguyễn Thị Lan", pet: "Luna (Mèo)",  score: 92, last: "2 ngày trước",  tag: "Vàng" },
    { name: "Trần Văn Minh",  pet: "Buddy (Chó)", score: 78, last: "5 ngày trước",  tag: "Bạc" },
    { name: "Lê Thu Hà",      pet: "Nemo (Cá)",   score: 61, last: "12 ngày trước", tag: "Đồng" },
  ];
  return (
    <div className="h-full flex flex-col text-left overflow-hidden" style={{ fontSize: "0.72rem" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#f8faff" }}>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: "#7c3aed" }} />
          <span style={{ fontWeight: 700, color: "#111827" }}>Phân khúc khách hàng</span>
        </div>
        <button className="px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: "#7c3aed", color: "white", fontWeight: 700, fontSize: "0.65rem" }}>
          <Mail className="w-3 h-3" /> Gửi chiến dịch
        </button>
      </div>
      <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
        {/* Segments */}
        <div className="grid grid-cols-2 gap-2">
          {segments.map((s, i) => (
            <button key={s.label} onClick={() => setActiveSeg(i)}
              className="rounded-xl p-3 text-left transition-all"
              style={{ background: activeSeg === i ? `${s.color}10` : "white", border: `1.5px solid ${activeSeg === i ? s.color : "#e5e7eb"}` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span style={{ fontSize: "0.9rem" }}>{s.icon}</span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#6b7280" }}>{s.label}</span>
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}> khách</span>
            </button>
          ))}
        </div>
        {/* Client list */}
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "6px" }}>KHÁCH HÀNG TRONG PHÂN KHÚC</p>
          <div className="flex flex-col gap-1.5">
            {clients.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "white", border: "1px solid #e5e7eb" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.1)" }}>
                  <User className="w-3.5 h-3.5" style={{ color: "#7c3aed" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontWeight: 700, color: "#111827", fontSize: "0.7rem" }}>{c.name}</p>
                  <p style={{ color: "#9ca3af", fontSize: "0.6rem" }}>{c.pet}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-2.5 h-2.5" style={{ color: "#f59e0b" }} fill="#f59e0b" />
                    <span style={{ fontWeight: 700, color: "#374151", fontSize: "0.68rem" }}>{c.score}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", fontSize: "0.56rem", fontWeight: 700 }}>{c.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup map ───────────────────────────────────────────────────────────────
const MOCKUPS: Record<string, React.ComponentType> = {
  booking: BookingMockup,
  pos: POSMockup,
  tracking: TrackingMockup,
  crm: CRMMockup,
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FeatureDetailPage() {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  const feature = FEATURES[featureId ?? ""];
  const MockupComponent = featureId ? MOCKUPS[featureId] : null;

  if (!feature || !MockupComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>Không tìm thấy tính năng</p>
        <Link to="/" style={{ color: "#2563EB", fontWeight: 600 }}>← Quay về trang chủ</Link>
      </div>
    );
  }

  const Icon = feature.icon;

  function goBookDemo() {
    navigate("/?demo=1");
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif", background: "white" }}>
      {/* ── Sticky mini-nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: back + logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div className="h-5 w-px" style={{ background: "#e5e7eb" }} />
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
                <PawPrint className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>Pet<span style={{ color: "#2563EB" }}>Tech</span></span>
            </Link>
            <div className="flex items-center gap-1.5 ml-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: feature.color }}>{feature.label}</span>
            </div>
          </div>
          {/* Right: CTA */}
          <button
            onClick={goBookDemo}
            className="px-5 py-2.5 rounded-xl text-white hover:-translate-y-px transition-all"
            style={{ background: feature.gradient, fontWeight: 700, fontSize: "0.85rem", boxShadow: `0 4px 14px ${feature.color}33` }}
          >
            Đặt lịch Demo miễn phí →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="pt-16">
        <div
          className="py-20 lg:py-28"
          style={{ background: `linear-gradient(160deg, ${feature.bg} 0%, rgba(248,250,255,0.5) 60%, white 100%)` }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: feature.bg }}>
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{ background: feature.bg, border: `1px solid ${feature.color}22`, fontSize: "0.72rem", fontWeight: 800, color: feature.color, letterSpacing: "0.07em" }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h1
                  className="text-gray-900 mb-5"
                  style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15 }}
                >
                  {feature.headline}
                </h1>
                <p style={{ fontSize: "1.05rem", color: "#4b5563", lineHeight: 1.75, maxWidth: "520px" }}>
                  {feature.subline}
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={goBookDemo}
                    className="px-6 py-3.5 rounded-xl text-white flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                    style={{ background: feature.gradient, fontWeight: 700, fontSize: "0.92rem", boxShadow: `0 6px 20px ${feature.color}40` }}
                  >
                    Đặt lịch Demo miễn phí <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    to="/#features"
                    className="px-6 py-3.5 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontWeight: 600, fontSize: "0.92rem", color: "#374151", textDecoration: "none" }}
                  >
                    Tất cả tính năng
                  </Link>
                </div>
                {/* Stats strip */}
                <div className="grid grid-cols-4 gap-4 mt-10">
                  {feature.stat.map((s) => (
                    <div key={s.value}>
                      <p style={{ fontSize: "1.5rem", fontWeight: 900, color: feature.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "3px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: browser mockup with live UI */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
                  minHeight: "420px",
                }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "#1e293b" }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                  <div
                    className="ml-4 flex-1 max-w-xs px-3 py-1 rounded-md flex items-center gap-2"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <Shield className="w-3 h-3" style={{ color: "#22c55e" }} />
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.5)" }}>
                      app.pettech.io/{feature.id}
                    </span>
                  </div>
                </div>
                {/* Content area */}
                <div style={{ background: "#f8faff", minHeight: "380px" }}>
                  <MockupComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ background: feature.bg, border: `1px solid ${feature.color}22` }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: feature.color, letterSpacing: "0.06em" }}>CÁCH THỨC HOẠT ĐỘNG</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>
              Từ thiết lập đến kết quả chỉ trong vài phút
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {feature.steps.map((step, i) => (
              <div key={i} className="relative">
                {i < feature.steps.length - 1 && (
                  <div
                    className="absolute top-7 left-full w-full h-px hidden lg:block"
                    style={{ background: `linear-gradient(to right, ${feature.color}40, transparent)`, zIndex: 0 }}
                  />
                )}
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{ background: feature.bg, border: `1.5px solid ${feature.color}20` }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: feature.color, fontSize: "0.65rem", fontWeight: 800, color: "white" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20" style={{ background: "linear-gradient(180deg,#f8faff 0%,white 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: feature.bg, border: `1px solid ${feature.color}22` }}
              >
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: feature.color, letterSpacing: "0.06em" }}>LỢI ÍCH CHÍNH</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em", marginBottom: "20px" }}>
                Được xây dựng cho cách phòng khám<br />của bạn thực sự hoạt động
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {feature.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{b.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: "#111827", fontSize: "0.9rem", marginBottom: "4px" }}>{b.title}</p>
                      <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.6 }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo + trust badge */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.14)", aspectRatio: "4/3" }}
              >
                <ImageWithFallback
                  src={feature.mockupImage}
                  alt={feature.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${feature.color}33, transparent)` }} />
              </div>
              {/* Floating card */}
              <div
                className="absolute -bottom-6 -left-6 px-5 py-4 rounded-2xl"
                style={{ background: "white", boxShadow: "0 12px 40px rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.06)", minWidth: "200px" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: feature.bg }}>
                    <TrendingUp className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Phòng khám trung bình thấy</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 900, color: feature.color, letterSpacing: "-0.02em" }}>{feature.stat[0].value}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{feature.stat[0].label}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl px-8 py-14 relative overflow-hidden"
            style={{ background: feature.gradient, boxShadow: `0 24px 60px ${feature.color}40` }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="relative">
              <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.025em", marginBottom: "12px" }}>
                Xem {feature.label} trực tiếp trong 30 phút
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 28px" }}>
                Đặt lịch demo miễn phí, cá nhân hóa với đội ngũ của chúng tôi. Không cam kết, không cần thẻ tín dụng — chỉ là buổi giới thiệu trực tiếp được thiết kế riêng cho nhu cầu phòng khám của bạn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={goBookDemo}
                  className="px-8 py-4 rounded-xl flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                  style={{ background: "white", color: feature.color, fontWeight: 800, fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
                >
                  Đặt Demo miễn phí <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem" }}>
                  <Check className="w-4 h-4" />
                  Không cần thẻ tín dụng · Hủy bất kỳ lúc nào
                </div>
              </div>
              {/* Testimonial */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="rgba(255,255,255,0.9)" style={{ color: "rgba(255,255,255,0.9)" }} />
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontStyle: "italic" }}>
                  "Chuyển từ giấy tờ sang PetTech trong một tuần. Đội ngũ của chúng tôi rất thích." — BS. Lan, Phòng khám Thú Cưng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-lite */}
      <div className="py-8 border-t border-gray-100 text-center">
        <Link to="/" style={{ color: "#2563EB", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
          ← Quay về trang chủ PetTech
        </Link>
      </div>

      <ChatWidget />
    </div>
  );
}


