import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const INTEGRATIONS = [
  { id: "payos", name: "PayOS", desc: "Cổng thanh toán mã QR tự động", icon: "📱", connected: true, color: "#000000" },
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

  function toggle(id: string) {
    const item = integrations.find(i => i.id === id);
    if (id === "payos" && !item?.connected) {
      setShowPayOsModal(true);
      return;
    }
    
    setIntegrations(p => p.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    setToast(item?.connected ? `${item?.name} đã ngắt kết nối` : `${item?.name} đã kết nối! 🎉`);
    setTimeout(() => setToast(""), 2500);
  }

  function handleSavePayOs() {
    // In real app, call API to save settings here
    setIntegrations(p => p.map(i => i.id === "payos" ? { ...i, connected: true } : i));
    setShowPayOsModal(false);
    setToast("PayOS đã được cấu hình và kết nối! 🎉");
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
