import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";

export function NotificationSettings() {
  const [settings, setSettings] = useState([
    { id: "n1", label: "Đặt lịch hẹn mới", email: true, sms: true, push: true },
    { id: "n2", label: "Hủy lịch hẹn", email: true, sms: false, push: true },
    { id: "n3", label: "Thanh toán thành công", email: true, sms: false, push: false },
    { id: "n4", label: "Cảnh báo tồn kho thấp", email: true, sms: true, push: true },
    { id: "n5", label: "Kết quả xét nghiệm sẵn sàng", email: true, sms: true, push: true },
    { id: "n6", label: "Đánh dấu không đến", email: false, sms: true, push: true },
    { id: "n7", label: "Báo cáo tổng hợp hàng tuần", email: true, sms: false, push: false },
    { id: "n8", label: "Cảnh báo bệnh nhân nguy kịch", email: true, sms: true, push: true },
  ]);
  const [saved, setSaved] = useState(false);

  function toggle(id: string, channel: "email" | "sms" | "push") {
    setSettings(p => p.map(s => s.id === id ? { ...s, [channel]: !s[channel] } : s));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Tuỳ chọn thông báo</h3>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95"
          style={{ background: saved ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem" }}>
          {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu!</> : <><Save className="w-3.5 h-3.5" /> Lưu tuỳ chọn</>}
        </button>
      </div>
      <div>
        <div className="grid grid-cols-4 px-6 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: "#fafbff" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em" }}>THÔNG BÁO</span>
          {["EMAIL", "SMS", "PUSH"].map(c => (
            <span key={c} className="text-center" style={{ fontSize: "0.65rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.06em" }}>{c}</span>
          ))}
        </div>
        {settings.map((s, i) => (
          <div key={s.id} className="grid grid-cols-4 items-center px-6 py-3.5 hover:bg-gray-50 transition-colors"
            style={{ borderBottom: i < settings.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <span style={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500 }}>{s.label}</span>
            {(["email", "sms", "push"] as const).map(ch => (
              <div key={ch} className="flex justify-center">
                <button onClick={() => toggle(s.id, ch)}
                  className="w-10 h-5.5 rounded-full relative transition-colors duration-200 flex-shrink-0"
                  style={{ background: s[ch] ? "#2563EB" : "#e5e7eb", width: "40px", height: "22px" }}>
                  <span className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200"
                    style={{ width: "18px", height: "18px", transform: s[ch] ? "translateX(20px)" : "translateX(2px)" }} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
