import { 
  User, Mail, Phone, Building2, 
} from "lucide-react";

export const ROLES = [
  { value: "petowner", label: "Chủ thú cưng", sub: "Đặt lịch, mua hàng & quản lý thú cưng", icon: "🐾", dest: "/petowner" },
  { value: "owner", label: "Chủ / Quản lý phòng khám", sub: "Truy cập bảng điều khiển PetTech", icon: "🏥", dest: "/dashboard" },
  { value: "staff", label: "Nhân viên phòng khám", sub: "Bảng điều khiển — chế độ nhân viên", icon: "👤", dest: "/dashboard" },
  { value: "admin", label: "Quản trị viên nền tảng", sub: "Cổng admin PetTech — toàn quyền", icon: "🛡️", dest: "/admin" },
  { value: "support", label: "Nhân viên hỗ trợ nền tảng", sub: "Cổng admin PetTech — quyền hỗ trợ", icon: "🎧", dest: "/admin" },
] as const;

export const DEMO_TIMES = ["9:00 SA", "9:30 SA", "10:00 SA", "10:30 SA", "11:00 SA", "2:00 CH", "2:30 CH", "3:00 CH", "3:30 CH", "4:00 CH"];

export const CLINIC_SIZES = [
  "Phòng khám nhỏ (1 bác sĩ)",
  "Phòng khám vừa (2–5 nhân viên)",
  "Phòng khám trung bình (6–15 nhân viên)",
  "Phòng khám lớn / chuỗi (15+)"
];

export const CURRENT_SYSTEMS = [
  "Giấy tờ / bảng tính",
  "ezyVet",
  "Cornerstone (IDEXX)",
  "Vetspire",
  "AVImark",
  "Khác / hệ thống riêng"
];

export const FEATURE_DETAILS: Record<string, { 
  title: string; 
  tag: string; 
  color: string; 
  bg: string; 
  desc: string; 
  bullets: { icon: string; text: string }[]; 
  stat: string; 
  statLabel: string; 
  screenshot: string 
}> = {
  "feature-booking": {
    title: "Đặt lịch thông minh", tag: "ĐẶT LỊCH HẸN", color: "#2563EB", bg: "rgba(37,99,235,0.07)",
    desc: "Lên lịch bằng AI giúp loại bỏ đặt trùng, giảm 40% tỷ lệ bỏ lỡ và cho phép chủ thú cưng đặt lịch 24/7 từ mọi thiết bị.",
    bullets: [
      { icon: "🤖", text: "Tối ưu khung giờ bằng AI dựa trên lịch sử phòng khám" },
      { icon: "📱", text: "Nhắc nhở tự động qua SMS, email & Zalo theo khoảng thời gian tùy chỉnh" },
      { icon: "🔗", text: "Đồng bộ hai chiều với Google Calendar & Outlook" },
      { icon: "🌐", text: "Cổng đặt lịch trực tuyến thương hiệu riêng cho chủ thú cưng" },
      { icon: "📊", text: "Phân tích bỏ lỡ lịch hẹn và quản lý danh sách chờ tự động" },
    ],
    stat: "40%", statLabel: "tỷ lệ bỏ lỡ lịch hẹn giảm bình quân",
    screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  "feature-pos": {
    title: "POS thông minh", tag: "THANH TOÁN", color: "#F97316", bg: "rgba(249,115,22,0.07)",
    desc: "Hệ thống POS chuyên dụng thú y biến một lần khám thành hóa đơn thanh toán chỉ bằng một click — tích hợp nhà thuốc, xét nghiệm và các cổng thanh toán phổ biến.",
    bullets: [
      { icon: "⚡", text: "Tự động tạo hóa đơn từ ghi chú khám và kế hoạch điều trị" },
      { icon: "💳", text: "Chấp nhận thẻ, quét QR (PayOS), ví điện tử và Stripe" },
      { icon: "💊", text: "Đồng bộ kho thuốc thời gian thực với cảnh báo đặt lại tự động" },
      { icon: "🧾", text: "Chia hóa đơn, trả góp và thu đặt cọc" },
      { icon: "📈", text: "Báo cáo doanh thu theo bác sĩ, dịch vụ và khoảng thời gian" },
    ],
    stat: "2h", statLabel: "tiết kiệm mỗi ngày trong thanh toán",
    screenshot: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  "feature-tracking": {
    title: "Theo dõi thời gian thực", tag: "THEO DÕI", color: "#0891b2", bg: "rgba(8,145,178,0.07)",
    desc: "Bảng điều khiển trực tiếp kết nối với chỉ số sinh tồn, thiết bị đeo thú cưng và kết quả xét nghiệm — tự động leo thang cảnh báo khẩn cấp đúng người.",
    bullets: [
      { icon: "📡", text: "Tích hợp thiết bị đeo IoT (PetFit, Whistle, Tractive)" },
      { icon: "🚨", text: "Leo thang cảnh báo khẩn với lịch trực gọi quay vòng" },
      { icon: "🧬", text: "Tự động nhập kết quả xét nghiệm từ IDEXX" },
      { icon: "📉", text: "Lịch sử sức khỏe dọc trục thời gian với phát hiện xu hướng" },
      { icon: "📲", text: "Thông báo đẩy cho chủ thú cưng khi kết quả sẵn sàng" },
    ],
    stat: "Trực tiếp", statLabel: "bảng điều khiển sức khỏe cập nhật theo thời gian thực",
    screenshot: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  "feature-crm": {
    title: "CRM & Marketing", tag: "QUAN HỆ KHÁCH HÀNG", color: "#7c3aed", bg: "rgba(124,58,237,0.07)",
    desc: "Biến mỗi lần khám thành mối quan hệ khách hàng trọn đời bằng chiến dịch tự động, chỉ số sức khỏe khách hàng và chương trình tích điểm.",
    bullets: [
      { icon: "🎯", text: "Phân khúc khách hàng thông minh (nhắc vaccine, không hoạt động, giá trị cao)" },
      { icon: "📧", text: "Chiến dịch đa kênh: email, SMS, Zalo" },
      { icon: "⭐", text: "Tích điểm thưởng, theo dõi giới thiệu và cấp bậc phần thưởng" },
      { icon: "🔮", text: "Mô hình dự đoán rời bỏ được huấn luyện trên hơn 1 triệu hồ sơ phòng khám" },
      { icon: "📊", text: "Theo dõi ROI chiến dịch và phân tích mở/nhấp" },
    ],
    stat: "3×", statLabel: "cải thiện tỷ lệ giữ chân khách hàng",
    screenshot: "https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
};
