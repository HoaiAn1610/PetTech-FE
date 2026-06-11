import { useState } from "react";
import { 
  Check, X, Lock, Eye, EyeOff, User, Phone, MapPin, Mail, Save, ToggleRight, ToggleLeft, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/api/authService";


export function ToggleRow({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-5 group transition-all" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="flex-1 pr-4">
        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>{label}</p>
        {sub && <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px", fontWeight: 500 }}>{sub}</p>}
      </div>
      <button onClick={() => onChange(!value)} className="flex-shrink-0 transition-transform hover:scale-110">
        {value
          ? <ToggleRight className="w-10 h-10" style={{ color: "#2563EB" }} />
          : <ToggleLeft className="w-10 h-10" style={{ color: "#cbd5e1" }} />}
      </button>
    </div>
  );
}

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next,    setNext]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [showN,   setShowN]   = useState(false);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = current.length >= 6 && next.length >= 8 && next === confirm;

  const handleUpdate = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      setDone(true);
      toast.success("Đổi mật khẩu thành công!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-10 flex flex-col items-center gap-6 text-center animate-in zoom-in duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-9 h-9" style={{ color: "#16a34a" }} strokeWidth={4} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#111827" }}>Mật khẩu đã đổi!</h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "8px" }}>Tài khoản của bạn hiện đã được bảo mật bằng mật khẩu mới.</p>
        </div>
        <button onClick={onClose} className="w-full py-4 rounded-2xl shadow-lg shadow-blue-100"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 800 }}>Hoàn tất</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-[2rem] bg-white overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>Bảo mật tài khoản</p>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: "#f8fafc" }}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-6">
          {[
            { label: "Mật khẩu hiện tại",       val: current, set: setCurrent, show: false },
            { label: "Mật khẩu mới (8+ ký tự)", val: next,    set: setNext,    show: showN },
            { label: "Xác nhận mật khẩu mới",   val: confirm, set: setConfirm, show: showN },
          ].map((f, i) => (
            <div key={i}>
              <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", marginBottom: "8px" }}>{f.label}</p>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type={f.show ? "text" : "password"}
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl outline-none border-2 border-gray-100 focus:border-blue-200 transition-all"
                  style={{ fontSize: "0.95rem" }}
                />
                {i > 0 && (
                  <button onClick={() => setShowN(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                    {showN ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {next && confirm && next !== confirm && (
            <div className="px-4 py-2 rounded-lg bg-red-50 border border-red-100">
              <p style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 700 }}>⚠️ Mật khẩu xác nhận không trùng khớp.</p>
            </div>
          )}
          <button onClick={handleUpdate} disabled={!valid || loading}
            className="w-full py-4.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            style={{ background: valid ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f1f5f9", color: valid ? "white" : "#94a3b8", fontWeight: 800, fontSize: "1rem" }}>
            {loading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
            Cập nhật mật khẩu mới
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const [name,    setName]    = useState(profile.name);
  const [phone,   setPhone]   = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [saved,   setSaved]   = useState(false);

  if (saved) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-10 flex flex-col items-center gap-6 text-center animate-in zoom-in duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-9 h-9" style={{ color: "#16a34a" }} strokeWidth={4} />
        </div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#111827" }}>Đã cập nhật hồ sơ!</h3>
        <button onClick={onClose} className="w-full py-4 rounded-2xl shadow-lg shadow-blue-100"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 800 }}>Hoàn tất</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-[2rem] bg-white overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>Chỉnh sửa hồ sơ cá nhân</p>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100" style={{ background: "#f8fafc" }}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-6">
          {[
            { label: "Họ và tên",      icon: User,   value: name,    onChange: setName,    placeholder: "Tên của bạn"  },
            { label: "Số điện thoại",  icon: Phone,  value: phone,   onChange: setPhone,   placeholder: "+84 9xx xxx"  },
            { label: "Địa chỉ",        icon: MapPin, value: address, onChange: setAddress, placeholder: "Địa chỉ của bạn" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label}>
                <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", marginBottom: "8px" }}>{f.label}</p>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none border-2 border-gray-100 focus:border-blue-200 transition-all"
                    style={{ fontSize: "0.95rem" }} />
                </div>
              </div>
            );
          })}
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#475569", marginBottom: "8px" }}>Địa chỉ Email (Cố định)</p>
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
              <Mail className="w-5 h-5 text-gray-400" />
              <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: 600 }}>{profile.email}</span>
              <div className="ml-auto px-3 py-1 rounded-full bg-green-100 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#059669", textTransform: "uppercase" }}>Verified</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSaved(true)} className="w-full py-4.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100 mt-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 800, fontSize: "1rem" }}>
            <Save className="w-5 h-5 inline mr-2" /> Lưu mọi thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
