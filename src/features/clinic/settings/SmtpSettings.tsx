import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Save, XCircle, Loader2 } from "lucide-react";
import { shopSettingsService } from "@/api/services";
import { toast } from "sonner";

export function SmtpSettings() {
  const [smtpData, setSmtpData] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [connected, setConnected] = useState(false);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await shopSettingsService.getShopProfile();
      const profile = res?.data || res;
      if (profile) {
        setConnected(profile.isSmtpConfigured ?? false);
        // If it was already configured, we can populate what we get, or at least username/host
        if (profile.smtpHost || profile.smtpUser) {
          setSmtpData({
            smtpHost: profile.smtpHost || "smtp.gmail.com",
            smtpPort: profile.smtpPort || 587,
            smtpUser: profile.smtpUser || "",
            smtpPass: "", // Password is write-only for security
          });
        }
      }
    } catch (err) {
      console.error("Failed to load SMTP integration status:", err);
      toast.error("Không thể tải trạng thái cấu hình SMTP");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleSaveSmtp() {
    if (!smtpData.smtpUser || !smtpData.smtpPass) {
      toast.error("Vui lòng điền đầy đủ tài khoản gửi và mật khẩu SMTP");
      return;
    }
    setLoading(true);
    try {
      await shopSettingsService.updateSmtpConfig({
        smtpHost: smtpData.smtpHost,
        smtpPort: Number(smtpData.smtpPort),
        smtpUser: smtpData.smtpUser,
        smtpPass: smtpData.smtpPass
      });
      toast.success("Cấu hình SMTP thành công và đã kết nối! 🎉");
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu cấu hình SMTP!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnectSmtp() {
    if (!window.confirm("Bạn có chắc chắn muốn ngắt cấu hình SMTP riêng? Hệ thống sẽ quay về sử dụng email mặc định của nền tảng.")) {
      return;
    }
    setLoading(true);
    try {
      await shopSettingsService.updateSmtpConfig({
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: ""
      });
      toast.success("Đã ngắt kết nối SMTP riêng");
      setSmtpData({
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi ngắt kết nối SMTP!");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ minHeight: "300px" }}>
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500 mt-4">Đang tải cấu hình SMTP...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-[Inter]">
      <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>SMTP Email riêng</h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Cấu hình gửi email tự động (lịch hẹn, hóa đơn...) bằng tài khoản của riêng bạn.</p>
          </div>
        </div>

        {connected ? (
          /* Connected State */
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-950">Đã kết nối SMTP Email riêng</p>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Tất cả email từ hệ thống gửi tới khách hàng sẽ sử dụng máy chủ email của bạn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">SMTP Host</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{smtpData.smtpHost}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Cổng (Port)</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{smtpData.smtpPort}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Tài khoản gửi (Email)</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{smtpData.smtpUser}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleDisconnectSmtp}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 font-bold text-xs transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Ngắt cấu hình SMTP riêng
              </button>
            </div>
          </div>
        ) : (
          /* Disconnected State (Form) */
          <div className="flex flex-col gap-5">
            <div className="text-xs text-blue-800 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 leading-relaxed">
              💡 Cấu hình này cho phép bạn gửi email chăm sóc khách hàng, đặt lịch hẹn dưới tên miền/thương hiệu của chính bạn (ví dụ qua Gmail, Outlook, Amazon SES...) để tăng độ uy tín thương hiệu.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>SMTP HOST</label>
                <input 
                  type="text" 
                  value={smtpData.smtpHost} 
                  onChange={e => setSmtpData({...smtpData, smtpHost: e.target.value})} 
                  placeholder="Ví dụ: smtp.gmail.com"
                  className="w-full px-4 py-2.5 mt-2 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>CỔNG (PORT)</label>
                  <input 
                    type="number" 
                    value={smtpData.smtpPort} 
                    onChange={e => setSmtpData({...smtpData, smtpPort: Number(e.target.value)})} 
                    placeholder="587"
                    className="w-full px-4 py-2.5 mt-2 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>GIAO THỨC BẢO MẬT</label>
                  <select 
                    value={smtpData.smtpPort === 465 ? "ssl" : "tls"}
                    onChange={e => setSmtpData({...smtpData, smtpPort: e.target.value === "ssl" ? 465 : 587})}
                    className="w-full px-4 py-2.5 mt-2 rounded-xl outline-none text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
                    style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                  >
                    <option value="tls">STARTTLS (587)</option>
                    <option value="ssl">SSL (465)</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>TÀI KHOẢN GỬI (EMAIL / USERNAME)</label>
                <input 
                  type="email" 
                  value={smtpData.smtpUser} 
                  onChange={e => setSmtpData({...smtpData, smtpUser: e.target.value})} 
                  placeholder="Ví dụ: help.pettech@gmail.com"
                  className="w-full px-4 py-2.5 mt-2 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
                />
              </div>

              <div className="md:col-span-2">
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", letterSpacing: "0.03em" }}>MẬT KHẨU ỨNG DỤNG (APP PASSWORD)</label>
                <input 
                  type="password" 
                  value={smtpData.smtpPass} 
                  onChange={e => setSmtpData({...smtpData, smtpPass: e.target.value})} 
                  placeholder="Mật khẩu ứng dụng 16 ký tự..."
                  className="w-full px-4 py-2.5 mt-2 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ border: "1.5px solid #e5e7eb", color: "#111827" }} 
                />
                <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                  * Đối với các dịch vụ công cộng như Gmail hay Outlook, vui lòng kích hoạt 2FA và tạo Mật khẩu ứng dụng (App Password) thay vì nhập mật khẩu chính tài khoản.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-5 border-t border-gray-100">
              <button 
                onClick={handleSaveSmtp} 
                disabled={loading}
                className="px-6 py-2.5 rounded-xl transition-all hover:-translate-y-px active:scale-95 text-white font-bold text-sm flex items-center gap-2"
                style={{ 
                  background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.25)" 
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Lưu & Kết nối
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
