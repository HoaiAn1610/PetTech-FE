import { Check, CalendarDays } from "lucide-react";

export function StepBar({ step, total }: { step: number; total: number }) {
  const LABELS = ["Dịch vụ", "Thú cưng & Nhân viên", "Ngày & Giờ", "Xác nhận"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((s, idx) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: s < step ? "#22c55e" : s === step ? "#2563EB" : "white",
                border: s > step ? "2px solid #e5e7eb" : "none",
                fontSize: "0.8rem", fontWeight: 800,
                color: s <= step ? "white" : "#9ca3af",
              }}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span style={{ fontSize: "0.65rem", fontWeight: s === step ? 700 : 500, color: s === step ? "#2563EB" : "#9ca3af", whiteSpace: "nowrap" }}>
              {LABELS[idx]}
            </span>
          </div>
          {idx < total - 1 && (
            <div className="mx-3 h-0.5 flex-shrink-0" style={{ width: "80px", background: s < step ? "#22c55e" : "#e5e7eb", marginBottom: "18px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export function BookingSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 gap-6 text-center max-w-lg mx-auto">
      <div className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
        <Check className="w-11 h-11" style={{ color: "#16a34a" }} strokeWidth={3} />
      </div>
      <div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#111827" }}>Đặt lịch thành công! 🎉</h2>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "10px", lineHeight: 1.7 }}>
          Bạn sẽ nhận được SMS và email xác nhận ngay sau đây.<br />
          Hẹn gặp bạn tại Phòng khám Paws & Claws!
        </p>
      </div>
      <div className="w-full p-6 rounded-2xl text-left" style={{ background: "rgba(37,99,235,0.04)", border: "1.5px solid rgba(37,99,235,0.12)" }}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5" style={{ color: "#2563EB" }} />
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>Chi tiết lịch hẹn</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Ngày",         value: "10 tháng 3, 2026 (Thứ 3)" },
            { label: "Giờ",          value: "10:00 SA"                  },
            { label: "Phòng khám",   value: "Phòng khám Paws & Claws"  },
            { label: "Lịch",         value: "📅 Thêm vào Google / Apple" },
          ].map(r => (
            <div key={r.label} className="flex flex-col gap-1">
              <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{r.label}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onReset}
        className="px-8 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
        Đặt lịch hẹn khác
      </button>
    </div>
  );
}
