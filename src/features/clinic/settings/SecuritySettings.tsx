import { useState } from "react";
import { AlertCircle, CheckCircle2, Lock, Shield } from "lucide-react";

export function SecuritySettings() {
  const [showPass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Password */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>Đổi mật khẩu</h3>
        <div className="flex flex-col gap-4 max-w-sm">
          {[
            { label: "MẬT KHẨU HIỆN TẠI", key: "currentPass", val: currentPass, set: setCurrentPass },
            { label: "MẬT KHẨU MỚI", key: "newPass", val: newPass, set: setNewPass },
            { label: "XÁC NHẬN MẬT KHẨU MỚI", key: "confirmPass", val: confirmPass, set: setConfirmPass },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{f.label}</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                <input type={showPass ? "text" : "password"} value={f.val} onChange={e => f.set(e.target.value)} placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}
                  onFocus={e => (e.target.style.borderColor = "#2563EB")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
              </div>
            </div>
          ))}
          {newPass && confirmPass && newPass !== confirmPass && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)" }}>
              <AlertCircle className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
              <span style={{ fontSize: "0.72rem", color: "#dc2626" }}>Mật khẩu không khớp</span>
            </div>
          )}
          <button onClick={handleSave} disabled={!currentPass || !newPass || newPass !== confirmPass}
            className="px-5 py-2.5 rounded-xl w-fit flex items-center gap-2 transition-all active:scale-95"
            style={{ background: saved ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem" }}>
            {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật!</> : <><Lock className="w-3.5 h-3.5" /> Đổi mật khẩu</>}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: twoFA ? "rgba(22,163,74,0.1)" : "rgba(0,0,0,0.05)" }}>
              <Shield className="w-5 h-5" style={{ color: twoFA ? "#16a34a" : "#9ca3af" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Xác thực hai yếu tố</h3>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px", maxWidth: "340px" }}>
                Thêm một lớp bảo mật. Yêu cầu mã xác minh khi đăng nhập.
              </p>
              {twoFA && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(22,163,74,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#16a34a" }}>
                  <CheckCircle2 className="w-3 h-3" /> Đã bật — Ứng dụng xác thực
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setTwoFA(v => !v)}
            className="w-12 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
            style={{ background: twoFA ? "#2563EB" : "#e5e7eb", width: "46px", height: "24px" }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ width: "20px", height: "20px", transform: twoFA ? "translateX(24px)" : "translateX(2px)" }} />
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Phiên đang hoạt động</h3>
        {[
          { device: "MacBook Pro 16-inch", location: "TP. Hồ Chí Minh", time: "Vừa xong", current: true },
          { device: "iPhone 16 Pro", location: "TP. Hồ Chí Minh", time: "2 giờ trước", current: false },
          { device: "iPad Air", location: "Hà Nội", time: "Hôm qua", current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>{s.device}
                {s.current && <span className="ml-2 px-1.5 py-0.5 rounded-md" style={{ background: "rgba(22,163,74,0.1)", fontSize: "0.6rem", fontWeight: 700, color: "#16a34a" }}>Hiện tại</span>}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{s.location} · {s.time}</p>
            </div>
            {!s.current && (
              <button className="px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                style={{ fontSize: "0.72rem", fontWeight: 600, color: "#dc2626", border: "1px solid rgba(220,38,38,0.2)" }}>
                Thu hồi
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
