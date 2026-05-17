import { useState } from "react";
import { X, Check } from "lucide-react";

export function AddPetModal({ onClose }: { onClose: () => void }) {
  const [name,    setName]    = useState("");
  const [species, setSpecies] = useState<"Dog" | "Cat">("Dog");
  const [breed,   setBreed]   = useState("");
  const [dob,     setDob]     = useState("");
  const [done,    setDone]    = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 flex flex-col items-center gap-5 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <div>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Đã thêm {name}! 🐾</p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
            Thú cưng của bạn đã được đăng ký. Phòng khám sẽ thêm lịch sử y tế của họ sớm thôi.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700 }}>
          Xong
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đăng ký thú cưng mới 🐾</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>
        <div className="px-6 py-6 flex flex-col gap-5">
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Loài</p>
            <div className="flex gap-3">
              {(["Dog", "Cat"] as const).map(s => (
                <button key={s} onClick={() => setSpecies(s)}
                  className="flex-1 py-4 rounded-xl flex flex-col items-center gap-2"
                  style={{ background: species === s ? "rgba(37,99,235,0.06)" : "#f8fafc", border: species === s ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                  <span className="text-3xl">{s === "Dog" ? "🐕" : "🐱"}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: species === s ? "#2563EB" : "#374151" }}>{s === "Dog" ? "Chó" : "Mèo"}</span>
                </button>
              ))}
            </div>
          </div>
          {[
            { label: "Tên thú cưng", placeholder: "vd. Buddy",          value: name,  onChange: setName  },
            { label: "Giống",        placeholder: "vd. Golden Retriever", value: breed, onChange: setBreed },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>{f.label}</p>
              <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          ))}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ngày sinh</p>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>
          <button onClick={() => { if (name && breed) setDone(true); }}
            className="w-full py-3.5 rounded-2xl"
            style={{ background: name && breed ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: name && breed ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
            Đăng ký thú cưng
          </button>
        </div>
      </div>
    </div>
  );
}
