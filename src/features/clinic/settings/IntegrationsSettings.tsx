import { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { shopSettingsService } from "@/api/services";

const INTEGRATIONS = [
  { id: "smtp", name: "SMTP Email", desc: "Gửi email chiến dịch bằng thương hiệu riêng", icon: "📧", connected: false, color: "#10b981" },
  { id: "payos", name: "PayOS", desc: "Cổng thanh toán mã QR tự động", icon: "📱", connected: false, color: "#000000" },
  { id: "google_cal", name: "Google Calendar", desc: "Đồng bộ lịch hẹn với Google Calendar", icon: "📅", connected: true, color: "#4285f4" },
  { id: "stripe", name: "Stripe Payments", desc: "Nhận thanh toán thẻ qua Stripe", icon: "💳", connected: true, color: "#635bff" },
  { id: "whatsapp", name: "WhatsApp Business", desc: "Gửi nhắc nhở và cập nhật qua WhatsApp", icon: "💬", connected: false, color: "#25d366" },
  { id: "idexx", name: "IDEXX Lab Connect", desc: "Tự động nhập kết quả xét nghiệm từ IDEXX", icon: "🔬", connected: true, color: "#cc0000" },
  { id: "zoom", name: "Zoom Telehealth", desc: "Khám thú cưng từ xa qua video call", icon: "📹", connected: false, color: "#2d8cff" },
  { id: "quickbooks", name: "QuickBooks", desc: "Đồng bộ dữ liệu thanh toán với QuickBooks", icon: "📊", connected: false, color: "#2ca01c" },
];

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [toast, setToast] = useState("");
  const [showPayOsModal, setShowPayOsModal] = useState(false);
  const [payOsData, setPayOsData] = useState({ clientId: "", apiKey: "", checksumKey: "" });

  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpData, setSmtpData] = useState({ smtpHost: "smtp.gmail.com", smtpPort: 587, smtpUser: "", smtpPass: "" });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await shopSettingsService.getShopProfile();
      const profile = res?.data || res;
      setIntegrations(prev => prev.map(i => {
        if (i.id === "smtp") {
          return { ...i, connected: profile.isSmtpConfigured ?? false };
        }
        if (i.id === "payos") {
          return { ...i, connected: profile.isPaymentConfigured ?? false };
        }
        return i;
      }));
    } catch (err) {
      console.error("Failed to load integrations status from shop profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  function toggle(id: string) {
    const item = integrations.find(i => i.id === id);
    if (id === "payos") {
      if (!item?.connected) {
        setShowPayOsModal(true);
      } else {
        if (window.confirm("Bạn có chắc chắn muốn ngắt kết nối cổng thanh toán PayOS không?")) {
          setIntegrations(p => p.map(i => i.id === "payos" ? { ...i, connected: false } : i));
          setToast("Đã ngắt kết nối PayOS");
          setTimeout(() => setToast(""), 2500);
        }
      }
      return;
    }
    if (id === "smtp") {
      if (!item?.connected) {
        setShowSmtpModal(true);
      } else {
        if (window.confirm("Bạn có chắc chắn muốn ngắt cấu hình SMTP riêng? Hệ thống sẽ quay về sử dụng email mặc định của nền tảng.")) {
          handleDisconnectSmtp();
        }
      }
      return;
    }
    
    setIntegrations(p => p.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    setToast(item?.connected ? `${item?.name} đã ngắt kết nối` : `${item?.name} đã kết nối! 🎉`);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleSaveSmtp() {
    if (!smtpData.smtpUser || !smtpData.smtpPass) {
      setToast("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu SMTP");
      setTimeout(() => setToast(""), 2500);
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
      setShowSmtpModal(false);
      setToast("Cấu hình SMTP thành công và đã kết nối! 🎉");
      setTimeout(() => setToast(""), 2500);
      fetchProfile();
    } catch (err) {
      console.error(err);
      setToast("Lỗi khi lưu cấu hình SMTP!");
      setTimeout(() => setToast(""), 2500);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnectSmtp() {
    try {
      await shopSettingsService.updateSmtpConfig({
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: ""
      });
      setToast("Đã ngắt kết nối SMTP riêng");
      setTimeout(() => setToast(""), 2500);
      fetchProfile();
    } catch (err) {
      console.error(err);
      setToast("Lỗi khi ngắt kết nối SMTP!");
      setTimeout(() => setToast(""), 2500);
    }
  }

  function handleSavePayOs() {
    setIntegrations(p => p.map(i => i.id === "payos" ? { ...i, connected: true } : i));
    setShowPayOsModal(false);
    setToast("PayOS đã được cấu hình và kết nối! 🎉");
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="flex flex-col gap-4 font-[Inter]">
      <div className="grid grid-cols-2 gap-4">
        {integrations.map(intg => (
          <div key={intg.id} className="bg-white rounded-2xl p-5 flex flex-col gap-4 transition-all"
            style={{ border: intg.connected ? `1.5px solid ${intg.color}30` : "1.5px solid rgba(0,0,0,0.07)", boxShadow: intg.connected ? `0 2px 12px ${intg.color}12` : "none" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: intg.connected ? `${intg.color}12` : "rgba(0,0,0,0.04)" }}>
                  {intg.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>{intg.name}</p>
                  <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "1px" }}>{intg.desc}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: intg.connected ? "rgba(22,163,74,0.08)" : "rgba(0,0,0,0.05)", fontSize: "0.65rem", fontWeight: 700, color: intg.connected ? "#16a34a" : "#9ca3af" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: intg.connected ? "#22c55e" : "#d1d5db" }} />
                {intg.connected ? "Đã kết nối" : "Chưa kết nối"}
              </span>
              <button onClick={() => toggle(intg.id)}
                className="px-3.5 py-1.5 rounded-xl transition-all hover:-translate-y-px active:scale-95"
                style={{
                  background: intg.connected ? "rgba(220,38,38,0.06)" : `${intg.color}15`,
                  color: intg.connected ? "#dc2626" : intg.color,
                  fontWeight: 700, fontSize: "0.72rem",
                  border: intg.connected ? "1.5px solid rgba(220,38,38,0.2)" : `1.5px solid ${intg.color}30`,
                }}>
                {intg.connected ? "Ngắt kết nối" : "Kết nối"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
          style={{ background: "#111827", color: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: "#4ade80" }} /> {toast}
        </div>
      )}

      {showPayOsModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Cấu hình PayOS</h3>
              <button onClick={() => setShowPayOsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Client ID</label>
                <input type="text" value={payOsData.clientId} onChange={e => setPayOsData({...payOsData, clientId: e.target.value})} 
                  placeholder="Nhập Client ID..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                <input type="text" value={payOsData.apiKey} onChange={e => setPayOsData({...payOsData, apiKey: e.target.value})} 
                  placeholder="Nhập API Key..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Checksum Key</label>
                <input type="text" value={payOsData.checksumKey} onChange={e => setPayOsData({...payOsData, checksumKey: e.target.value})} 
                  placeholder="Nhập Checksum Key..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowPayOsModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                Hủy
              </button>
              <button onClick={handleSavePayOs} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                Lưu & Kết nối
              </button>
            </div>
          </div>
        </div>
      )}

      {showSmtpModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-[Inter]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Cấu hình SMTP Email riêng</h3>
              <button onClick={() => setShowSmtpModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-gray-500 bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100/50 leading-relaxed">
                ℹ️ Cấu hình này cho phép phòng khám gửi email chiến dịch hoặc nhắc hẹn dưới tên thương hiệu riêng của bạn (ví dụ qua Gmail hoặc Outlook).
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">SMTP Host</label>
                <input type="text" value={smtpData.smtpHost} onChange={e => setSmtpData({...smtpData, smtpHost: e.target.value})} 
                  placeholder="Ví dụ: smtp.gmail.com"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cổng (Port)</label>
                  <input type="number" value={smtpData.smtpPort} onChange={e => setSmtpData({...smtpData, smtpPort: Number(e.target.value)})} 
                    placeholder="587"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Giao thức</label>
                  <select 
                    value={smtpData.smtpPort === 465 ? "ssl" : "tls"}
                    onChange={e => setSmtpData({...smtpData, smtpPort: e.target.value === "ssl" ? 465 : 587})}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors">
                    <option value="tls">STARTTLS (587)</option>
                    <option value="ssl">SSL (465)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tài khoản gửi (Username / Email)</label>
                <input type="email" value={smtpData.smtpUser} onChange={e => setSmtpData({...smtpData, smtpUser: e.target.value})} 
                  placeholder="Ví dụ: clinic@gmail.com"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu ứng dụng (App Password)</label>
                <input type="password" value={smtpData.smtpPass} onChange={e => setSmtpData({...smtpData, smtpPass: e.target.value})} 
                  placeholder="Mật khẩu ứng dụng 16 ký tự..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" />
                <p className="text-[10px] text-gray-400 mt-1">
                  * Đối với Gmail, hãy sử dụng Mật khẩu ứng dụng (App Password) thay cho mật khẩu chính tài khoản.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button disabled={loading} onClick={() => setShowSmtpModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                Hủy
              </button>
              <button disabled={loading} onClick={handleSaveSmtp} className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:bg-emerald-400 flex items-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : null}
                Lưu & Kết nối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
