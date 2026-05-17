import { useState } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  User, Phone, MapPin, Edit2, Shield,
  Lock, Smartphone, ChevronRight, AlertTriangle, Trash2,
  LogOut, Camera, CreditCard, Star,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router";
import { 
  ToggleRow, ChangePasswordModal, EditProfileModal 
} from "@/features/petowner/profile/ProfileComponents";

const PROFILE = {
  name: "Maria Johnson",
  email: "maria.johnson@email.com",
  phone: "+84 901 234 567",
  address: "45 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  memberSince: "Tháng 1, 2024",
  initials: "MJ",
  tier: "Bạc",
  points: 450,
};

const PAYMENT_METHODS = [
  { id: "pm1", type: "visa",       last4: "4242", expiry: "08/27", primary: true  },
  { id: "pm2", type: "mastercard", last4: "8891", expiry: "03/26", primary: false },
];

export default function PetOwnerProfilePage() {
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState({
    emailAppt: true, emailPromo: false,
    smsAppt: true, smsReminder: true,
    pushAll: true, pushVaccine: true, pushOrder: true,
  });
  const [privacy, setPrivacy] = useState({ shareAnonymized: true, marketing: false });

  const [showEdit,        setShowEdit]        = useState(false);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showDelete,      setShowDelete]      = useState(false);
  const [deleteConfirm,   setDeleteConfirm]   = useState("");

  const toggle  = (k: keyof typeof notifs)  => setNotifs(v => ({ ...v, [k]: !v[k] }));
  const toggleP = (k: keyof typeof privacy) => setPrivacy(v => ({ ...v, [k]: !v[k] }));

  return (
    <PetOwnerShell pageTitle="Tài khoản & Cài đặt">
      <div className="max-w-7xl mx-auto flex flex-col gap-8" style={{ fontFamily: "Inter, sans-serif" }}>

        <div className="grid gap-8" style={{ gridTemplateColumns: "300px 1fr 1fr" }}>

          {/* ── Column 1: Profile Overview ── */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="px-8 py-10 flex flex-col items-center gap-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", fontSize: "2rem", fontWeight: 900, boxShadow: "0 10px 25px rgba(249,115,22,0.4)" }}>
                    {PROFILE.initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-xl hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="text-center relative z-10">
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "white" }}>{PROFILE.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{PROFILE.email}</p>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white", textTransform: "uppercase" }}>Hạng {PROFILE.tier}</span>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 flex flex-col gap-4">
                {[
                  { icon: User,   label: "Thành viên từ",   value: PROFILE.memberSince },
                  { icon: Phone,  label: "Số điện thoại",   value: PROFILE.phone       },
                  { icon: MapPin, label: "Địa chỉ liên hệ",  value: PROFILE.address, small: true },
                ].map(r => {
                  const Icon = r.icon;
                  return (
                    <div key={r.label} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300" />
                      <div className="min-w-0">
                        <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</p>
                        <p style={{ fontSize: r.small ? "0.85rem" : "0.9rem", fontWeight: 700, color: "#1e293b", marginTop: "2px", lineHeight: 1.5 }}>{r.value}</p>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => setShowEdit(true)}
                  className="w-full py-3.5 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent hover:border-blue-100"
                  style={{ background: "rgba(37,99,235,0.06)", fontSize: "0.9rem", fontWeight: 800, color: "#2563EB" }}>
                  <Edit2 className="w-4 h-4" /> Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="px-8 py-5 border-b border-gray-50">
                <p style={{ fontSize: "0.9rem", fontWeight: 900, color: "#1e293b" }}>Thanh toán</p>
              </div>
              <div className="px-8 py-4 flex flex-col gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-12 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: pm.type === "visa" ? "#1a1f71" : "#eb001b", fontSize: "0.6rem", fontWeight: 900, color: "white" }}>
                      {pm.type === "visa" ? "VISA" : "MC"}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>•••• {pm.last4}</p>
                      <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>Exp: {pm.expiry}</p>
                    </div>
                    {pm.primary && <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[0.6rem] font-black text-blue-600 uppercase">Chính</span>}
                  </div>
                ))}
                <button className="flex items-center gap-2 mt-2 font-black text-[0.75rem] text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                   <CreditCard className="w-4 h-4" /> Thêm thẻ mới
                </button>
              </div>
            </div>
          </div>

          {/* ── Column 2: Notifications & Preferences ── */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="px-8 py-6 border-b border-gray-100">
                <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Cài đặt thông báo</h4>
              </div>
              <div className="px-8">
                <p className="mt-6 mb-2 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">📧 Email thông báo</p>
                <ToggleRow label="Nhắc nhở lịch hẹn" sub="Nhận email trước 24 giờ diễn ra lịch hẹn" value={notifs.emailAppt} onChange={() => toggle("emailAppt")} />
                <ToggleRow label="Tin tức & Ưu đãi" sub="Cập nhật khuyến mãi độc quyền hàng tuần" value={notifs.emailPromo} onChange={() => toggle("emailPromo")} />
                
                <p className="mt-8 mb-2 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">💬 Tin nhắn SMS</p>
                <ToggleRow label="Xác nhận giao dịch" value={notifs.smsAppt} onChange={() => toggle("smsAppt")} />
                <ToggleRow label="Cảnh báo sức khỏe" value={notifs.smsReminder} onChange={() => toggle("smsReminder")} />
                
                <p className="mt-8 mb-2 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">🔔 Thông báo ứng dụng</p>
                <ToggleRow label="Tất cả thông báo đẩy" value={notifs.pushAll} onChange={() => toggle("pushAll")} />
                <ToggleRow label="Theo dõi đơn hàng" value={notifs.pushOrder} onChange={() => toggle("pushOrder")} />
                <div className="h-8" />
              </div>
            </div>

            <div className="rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="px-8 py-6 border-b border-gray-100">
                <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Quyền riêng tư</h4>
              </div>
              <div className="px-8 py-2">
                <ToggleRow label="Chia sẻ dữ liệu ẩn danh" sub="Giúp cải thiện trải nghiệm dịch vụ" value={privacy.shareAnonymized} onChange={() => toggleP("shareAnonymized")} />
                <ToggleRow label="Marketing cá nhân hóa" sub="Gợi ý sản phẩm phù hợp với thú cưng" value={privacy.marketing} onChange={() => toggleP("marketing")} />
                <div className="h-6" />
              </div>
            </div>
          </div>

          {/* ── Column 3: Security & Danger Zone ── */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <div className="px-8 py-6 border-b border-gray-100">
                <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Bảo mật tài khoản</h4>
              </div>
              <div className="flex flex-col">
                {[
                  { icon: Lock,       label: "Đổi mật khẩu",     sub: "Cập nhật lần cuối 90 ngày trước",   onClick: () => setShowPassword(true), color: "#2563EB" },
                  { icon: Shield,     label: "Xác thực 2 lớp",    sub: "Tăng cường bảo mật đăng nhập",      onClick: () => {},                    color: "#10b981" },
                  { icon: Smartphone, label: "Thiết bị đã đăng nhập", sub: "Quản lý các phiên truy cập hiện tại", onClick: () => {},                    color: "#7c3aed" },
                  { icon: RefreshCw,  label: "Sao lưu dữ liệu",   sub: "Xuất dữ liệu cá nhân (JSON/PDF)",    onClick: () => {},                    color: "#0891b2" },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} onClick={item.onClick}
                      className="flex items-center gap-5 px-8 py-5 text-left transition-all hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}10` }}>
                        <Icon className="w-5.5 h-5.5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b" }}>{item.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>{item.sub}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] p-8 bg-gray-50 border border-gray-200">
              <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#475569", marginBottom: "8px" }}>Phiên bản ứng dụng</p>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6, fontWeight: 500 }}>
                PetTech Pro v2.4.1 (Stable)<br />
                Đã được mã hóa đầu cuối 🔒
              </p>
            </div>

            <div className="rounded-[2rem] overflow-hidden bg-white border border-red-100 shadow-sm">
              <div className="px-8 py-4 bg-red-50/50 border-b border-red-50">
                <p style={{ fontSize: "0.75rem", fontWeight: 900, color: "#dc2626", letterSpacing: "0.1em" }}>VÙNG NGUY HIỂM</p>
              </div>
              <button onClick={() => navigate("/")}
                className="flex items-center gap-5 px-8 py-5 w-full text-left transition-all hover:bg-red-50/30 border-b border-red-50">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-red-100">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: "1rem", fontWeight: 900, color: "#dc2626" }}>Đăng xuất</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>Thoát khỏi phiên làm việc hiện tại</p>
                </div>
              </button>
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-5 px-8 py-5 w-full text-left transition-all hover:bg-red-50">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-red-600 text-white shadow-lg shadow-red-200">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: "1rem", fontWeight: 900, color: "#dc2626" }}>Xóa tài khoản</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>Dữ liệu của bạn sẽ bị xóa vĩnh viễn</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEdit     && <EditProfileModal profile={PROFILE} onClose={() => setShowEdit(false)} />}
      {showPassword && <ChangePasswordModal onClose={() => setShowPassword(false)} />}

      {showDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", fontFamily: "Inter, sans-serif" }}
          onClick={() => setShowDelete(false)}>
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 flex flex-col gap-6 shadow-2xl animate-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-red-50">
              <AlertTriangle className="w-10 h-10 text-red-600" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1e293b" }}>Xác nhận xóa tài khoản?</h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "8px", lineHeight: 1.6, fontWeight: 500 }}>
                Hành động này <strong className="text-red-600">không thể hoàn tác</strong>. Toàn bộ hồ sơ thú cưng, lịch sử khám và điểm thưởng sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", marginBottom: "10px", textAlign: "center" }}>Gõ <span className="text-red-600 font-black">DELETE</span> để tiếp tục</p>
              <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Nhập mã xác nhận..."
                className="w-full px-6 py-4 rounded-2xl outline-none border-2 border-red-100 focus:border-red-500 transition-all text-center font-black tracking-widest text-red-600"
                style={{ fontSize: "1rem", background: "#fef2f2" }} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-4 rounded-2xl bg-gray-100 font-black text-gray-500 transition-all hover:bg-gray-200 uppercase tracking-widest text-xs">Hủy bỏ</button>
              <button disabled={deleteConfirm !== "DELETE"} className="flex-1 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs shadow-lg shadow-red-100"
                style={{ background: deleteConfirm === "DELETE" ? "#dc2626" : "#f1f5f9", color: deleteConfirm === "DELETE" ? "white" : "#cbd5e1" }}>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </PetOwnerShell>
  );
}
