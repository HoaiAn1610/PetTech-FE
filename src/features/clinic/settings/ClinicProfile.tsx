import { useState } from "react";
import { Building2, Camera, CheckCircle2, Clock, Globe, Mail, MapPin, Phone, RefreshCw, Save } from "lucide-react";

export function ClinicProfile() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Paws & Claws Clinic",
    email: "hello@pawsclaws.com",
    phone: "+1 (555) 012-3456",
    address: "142 Maple Street, San Francisco, CA 94102",
    website: "https://pawsclaws.com",
    timezone: "America/Los_Angeles",
    hours: "Mon–Fri 8am–7pm, Sat 9am–5pm",
  });

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1200);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>Logo phòng khám</h3>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)" }}>
            <span style={{ fontSize: "1.5rem" }}>🐾</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>
              <Camera className="w-3.5 h-3.5" /> Tải logo mới lên
            </button>
            <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>PNG, JPG hoặc SVG · Tối đa 2MB · Khuyến nghị 512×512px</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>Thông tin phòng khám</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "TÊN PHÒNG KHÁM", key: "name", icon: Building2, type: "text" },
            { label: "ĐỊA CHỈ EMAIL", key: "email", icon: Mail, type: "email" },
            { label: "SỐ ĐIỆN THOẠI", key: "phone", icon: Phone, type: "tel" },
            { label: "WEBSITE", key: "website", icon: Globe, type: "url" },
            { label: "MÚI GIỜ", key: "timezone", icon: Clock, type: "text" },
            { label: "GIỜ LÀM VIỆC", key: "hours", icon: Clock, type: "text" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{f.label}</label>
                <div className="relative mt-1.5">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                  <input type={f.type} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl outline-none transition-all"
                    style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "#2563EB")}
                    onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                </div>
              </div>
            );
          })}
          <div className="col-span-2">
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>ĐỊA CHỈ</label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl outline-none transition-all"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
                onFocus={e => (e.target.style.borderColor = "#2563EB")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:-translate-y-px active:scale-95"
            style={{ background: saved ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.85rem", boxShadow: saved ? "0 4px 14px rgba(22,163,74,0.25)" : "0 4px 14px rgba(37,99,235,0.28)" }}>
            {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang lưu…</>
              : saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu!</>
                : <><Save className="w-3.5 h-3.5" /> Lưu thay đổi</>}
          </button>
        </div>
      </div>
    </div>
  );
}
