import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const INTEGRATIONS = [
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

  function toggle(id: string) {
    const item = integrations.find(i => i.id === id);
    setIntegrations(p => p.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    setToast(item?.connected ? `${item?.name} đã ngắt kết nối` : `${item?.name} đã kết nối! 🎉`);
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
    </div>
  );
}
