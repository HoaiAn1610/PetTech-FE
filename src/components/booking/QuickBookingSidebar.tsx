import { useState } from "react";
import {
  Phone,
  PawPrint,
  Stethoscope,
  ChevronDown,
  Search,
  Clock,
  CalendarPlus,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const SERVICES = [
  { value: "grooming",    label: "Tắm chải",            emoji: "✂️",  duration: "60 phút", color: "#7c3aed" },
  { value: "checkup",     label: "Khám tổng quát",       emoji: "🩺",  duration: "30 phút", color: "#2563EB" },
  { value: "vaccination", label: "Tiêm vaccine",         emoji: "💉",  duration: "15 phút", color: "#16a34a" },
  { value: "dental",      label: "Vệ sinh răng miệng",   emoji: "🦷",  duration: "45 phút", color: "#0891b2" },
  { value: "xray",        label: "X-Quang & Chẩn đoán", emoji: "📷",  duration: "30 phút", color: "#d97706" },
  { value: "surgery",     label: "Tiểu phẫu",            emoji: "🔬",  duration: "90 phút", color: "#dc2626" },
  { value: "nutrition",   label: "Tư vấn dinh dưỡng",   emoji: "🥗",  duration: "20 phút", color: "#F97316" },
  { value: "deworming",   label: "Tẩy giun sán",         emoji: "💊",  duration: "10 phút", color: "#6b7280" },
];

const TIME_SLOTS = [
  "09:00 SA", "09:30 SA", "10:00 SA", "10:30 SA",
  "11:00 SA", "11:30 SA", "02:00 CH", "02:30 CH",
  "03:00 CH", "03:30 CH", "04:00 CH", "04:30 CH",
];

const RECENT_PATIENTS = [
  { phone: "+84 901 234 567", name: "Bella", pet: "Golden Retriever", owner: "Nguyễn Anh Tuấn", flag: "allergy" },
  { phone: "+84 912 345 678", name: "Max",   pet: "Chó Berger",       owner: "Trần Đức Minh",   flag: null },
  { phone: "+84 923 456 789", name: "Luna",  pet: "Mèo Xiêm",        owner: "Lê Thị Lan",      flag: null },
];

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; emoji: string; duration: string; color: string }[];
  placeholder: string;
}

function ServiceSelect({ value, onChange, options, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        style={{
          background: open ? "white" : "#f8fafc",
          border: `1.5px solid ${open ? "#2563EB" : "rgba(0,0,0,0.1)"}`,
          boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
        }}
      >
        {sel ? (
          <>
            <span style={{ fontSize: "1.1rem" }}>{sel.emoji}</span>
            <span className="flex-1 text-left" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
              {sel.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: `${sel.color}15`, fontSize: "0.68rem", fontWeight: 700, color: sel.color }}
            >
              {sel.duration}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left" style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{placeholder}</span>
        )}
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200 flex-shrink-0"
          style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 rounded-xl z-30 overflow-hidden py-1"
          style={{
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.09)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-blue-50"
              style={{ background: opt.value === value ? "rgba(37,99,235,0.05)" : "transparent" }}
            >
              <span style={{ fontSize: "1rem" }}>{opt.emoji}</span>
              <span className="flex-1 text-left" style={{ fontSize: "0.83rem", fontWeight: opt.value === value ? 600 : 400, color: opt.value === value ? "#2563EB" : "#374151" }}>
                {opt.label}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{opt.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuickBookingSidebar({ onTriggerAlert }: { onTriggerAlert: () => void }) {
  const [phone, setPhone] = useState("+84 901 234 567");
  const [petName, setPetName] = useState("Bella");
  const [service, setService] = useState("grooming");
  const [timeSlot, setTimeSlot] = useState("10:00 SA");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const selectedService = SERVICES.find((s) => s.value === service);
  const hasAllergyFlag = petName.toLowerCase() === "bella";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAllergyFlag) { onTriggerAlert(); return; }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto flex-shrink-0"
      style={{
        width: "300px",
        background: "white",
        borderRight: "1.5px solid rgba(0,0,0,0.08)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(0,0,0,0.07)",
          background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#2563EB" }}
          >
            <CalendarPlus className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
            Đặt lịch nhanh
          </h2>
        </div>
        <p style={{ fontSize: "0.73rem", color: "#6b7280" }}>
          Đặt lịch hẹn mới trong vài giây
        </p>
      </div>

      {/* Recent patients */}
      <div className="px-5 pt-4 pb-2">
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "8px" }}>
          BỆNH NHÂN GẦN ĐÂY
        </p>
        <div className="flex flex-col gap-1.5">
          {RECENT_PATIENTS.map((p) => (
            <button
              key={p.phone}
              type="button"
              onClick={() => { setPhone(p.phone); setPetName(p.name); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-blue-50 text-left group"
              style={{
                border: `1.5px solid ${phone === p.phone ? "#2563EB" : "rgba(0,0,0,0.06)"}`,
                background: phone === p.phone ? "rgba(37,99,235,0.05)" : "#fafafa",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ background: phone === p.phone ? "#2563EB" : "#e5e7eb", fontSize: "0.85rem", fontWeight: 700, color: phone === p.phone ? "white" : "#9ca3af" }}
              >
                {p.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>{p.name}</span>
                  {p.flag === "allergy" && (
                    <span
                      className="px-1.5 py-0.5 rounded-md flex items-center gap-1"
                      style={{ background: "rgba(220,38,38,0.1)", fontSize: "0.6rem", fontWeight: 700, color: "#dc2626" }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      DỊ ỨNG
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{p.pet} · {p.owner}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 my-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 pb-5 flex flex-col gap-4 flex-1">
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em" }}>
          CHI TIẾT ĐẶT LỊCH
        </p>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Điện thoại chủ nuôi
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9ca3af" }}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="+84 901 000 000"
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
              }}
            />
            {showSuggestions && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                style={{ background: "white", border: "1.5px solid rgba(0,0,0,0.09)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              >
                {RECENT_PATIENTS.map((p) => (
                  <button
                    key={p.phone}
                    type="button"
                    onMouseDown={() => { setPhone(p.phone); setPetName(p.name); setShowSuggestions(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-blue-50"
                  >
                    <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: "0.8rem", color: "#374151" }}>{p.phone}</span>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginLeft: "auto" }}>{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pet Name */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Tên thú cưng
          </label>
          <div className="relative">
            <PawPrint
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9ca3af" }}
            />
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="VD: Bella"
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: "#f8fafc",
                border: `1.5px solid ${hasAllergyFlag ? "#fca5a5" : "rgba(0,0,0,0.09)"}`,
                fontSize: "0.85rem",
                color: "#111827",
                boxShadow: hasAllergyFlag ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
              }}
            />
          </div>
          {hasAllergyFlag && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#dc2626" }} />
              <span style={{ fontSize: "0.71rem", fontWeight: 600, color: "#b91c1c" }}>
                ⚠ Bella có dị ứng nghiêm trọng với thịt bò trong hồ sơ
              </span>
            </div>
          )}
        </div>

        {/* Service */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Dịch vụ
          </label>
          <ServiceSelect
            value={service}
            onChange={setService}
            options={SERVICES}
            placeholder="Chọn dịch vụ…"
          />
        </div>

        {/* Time slot */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Khung giờ
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: "#9ca3af" }}
            />
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none appearance-none"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
                cursor: "pointer",
              }}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#9ca3af" }}
            />
          </div>
        </div>

        {/* Assigned vet */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Bác sĩ phụ trách
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9ca3af" }}
            />
            <select
              className="w-full pl-9 pr-4 py-3 rounded-xl outline-none appearance-none"
              style={{
                background: "#f8fafc",
                border: "1.5px solid rgba(0,0,0,0.09)",
                fontSize: "0.85rem",
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <option>BS. Nguyễn Thị Lan</option>
              <option>BS. Trần Văn Minh</option>
              <option>BS. Phạm Thu Linh</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9ca3af" }} />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
            Ghi chú <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tùy chọn)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="VD: Khách yêu cầu nhân viên tắm chải cụ thể…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl outline-none resize-none"
            style={{
              background: "#f8fafc",
              border: "1.5px solid rgba(0,0,0,0.09)",
              fontSize: "0.83rem",
              color: "#111827",
            }}
          />
        </div>

        {/* Summary */}
        {service && (
          <div
            className="rounded-xl p-3.5 flex flex-col gap-1"
            style={{ background: selectedService ? `${selectedService.color}0d` : "#f9fafb", border: `1px solid ${selectedService ? selectedService.color + "30" : "rgba(0,0,0,0.06)"}` }}
          >
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em" }}>TÓM TẮT LỊCH HẸN</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
              {selectedService?.emoji} {selectedService?.label} — {timeSlot}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {petName || "—"} · {selectedService?.duration} · BS. Nguyễn Thị Lan
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mt-auto"
          style={{
            background: submitted
              ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
              : "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 700,
            boxShadow: submitted
              ? "0 6px 20px rgba(22,163,74,0.4)"
              : "0 6px 20px rgba(37,99,235,0.35)",
            transition: "all 0.3s",
          }}
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              Đã đặt lịch!
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              Xác nhận đặt lịch
            </>
          )}
        </button>
      </form>
    </aside>
  );
}