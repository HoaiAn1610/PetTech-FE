import { useState } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Stethoscope, Scissors, Syringe, Home, Check, CalendarDays,
  PawPrint, Star, Clock,
} from "lucide-react";
import { StepBar, BookingSuccess } from "@/features/petowner/booking/BookingComponents";
import { useTenant, useServices } from "@/context/TenantContext";

const SERVICES = [
  { id: "vet",      label: "Khám thú y",        desc: "Kiểm tra sức khỏe, chẩn đoán, điều trị",  price: 85,  duration: "30–45 phút",   icon: Stethoscope, color: "#2563EB", bg: "rgba(37,99,235,0.08)",   emoji: "🩺" },
  { id: "groom",    label: "Cắt tỉa lông toàn bộ", desc: "Tắm, cắt, cắt móng, vệ sinh tai",       price: 65,  duration: "1,5–2 tiếng",  icon: Scissors,    color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  emoji: "✂️" },
  { id: "vaccine",  label: "Tiêm phòng",         desc: "Vaccine cơ bản & không bắt buộc",         price: 45,  duration: "15–20 phút",   icon: Syringe,     color: "#16a34a", bg: "rgba(22,163,74,0.08)",   emoji: "💉" },
  { id: "boarding", label: "Gửi thú cưng",       desc: "Chăm sóc qua đêm an toàn cho thú cưng",  price: 55,  duration: "Mỗi đêm",      icon: Home,        color: "#F97316", bg: "rgba(249,115,22,0.08)",  emoji: "🏠" },
  { id: "dental",   label: "Vệ sinh răng",        desc: "Cạo vôi răng & đánh bóng chuyên nghiệp", price: 120, duration: "45–60 phút",   icon: PawPrint,    color: "#0891b2", bg: "rgba(8,145,178,0.08)",   emoji: "🦷" },
  { id: "nailonly", label: "Chỉ cắt móng",       desc: "Cắt móng nhanh",                          price: 20,  duration: "10 phút",      icon: Scissors,    color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  emoji: "💅" },
];

const MY_PETS = [
  { id: "buddy",    name: "Buddy",    species: "Dog", breed: "Golden Retriever", emoji: "🐕" },
  { id: "whiskers", name: "Whiskers", species: "Cat", breed: "Persian",          emoji: "🐱" },
];

const VETS = [
  { id: "dr-lee",  name: "Bs. Sarah Lee",  role: "Trưởng phòng thú y",    rating: 4.9, reviews: 312, emoji: "👩‍⚕️" },
  { id: "dr-park", name: "Bs. James Park", role: "Bác sĩ thú y & Phẫu thuật", rating: 4.8, reviews: 187, emoji: "👨‍⚕️" },
  { id: "ms-ngo",  name: "Cô Lan Ngô",    role: "Chuyên gia cắt tỉa lông", rating: 4.9, reviews: 224, emoji: "💇‍♀️" },
  { id: "any",     name: "Bất kỳ nhân viên nào", role: "Tự động phân công", rating: null, reviews: null, emoji: "⚡" },
];

const TIMES = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",
];

const BUSY_SLOTS = ["9:30 AM","11:00 AM","3:00 PM"];

function parseSlotToMinutes(slot: string): number {
  const clean = slot.trim().toUpperCase();
  const parts = clean.split(" ");
  const timePart = parts[0];
  const ampm = parts[1] || "";
  
  let [hoursStr, minutesStr] = timePart.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10) || 0;
  
  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

function parseSettingsTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

function getCalendarDays() {
  const days = [];
  const today = new Date(2026, 2, 6);
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        full: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      });
    }
  }
  return days;
}

const DAYS = getCalendarDays();

export default function PetOwnerBookingPage() {
  const { settings }          = useTenant();
  const { services, loading: servicesLoading } = useServices();
  const [step,    setStep]    = useState(1);
  const [service, setService] = useState<any | null>(null);
  const [pet,     setPet]     = useState<typeof MY_PETS[0] | null>(null);
  const [day,     setDay]     = useState<typeof DAYS[0] | null>(null);
  const [time,    setTime]    = useState<string | null>(null);
  const [vet,     setVet]     = useState<typeof VETS[0] | null>(null);
  const [notes,   setNotes]   = useState("");
  const [done,    setDone]    = useState(false);

  function reset() {
    setStep(1); setService(null); setPet(null); setDay(null);
    setTime(null); setVet(null); setNotes(""); setDone(false);
  }

  // Mapped dynamic services with elegant design fallbacks for emoji, color and bg
  const mappedServices = services.map((s: any, index: number) => {
    const label = s.name || s.label || s.title || "Dịch vụ";
    const desc = s.description || s.desc || "Chi tiết dịch vụ";
    const price = s.price || 0;
    const duration = s.duration || s.durationMinutes || "30 phút";
    
    const getEmoji = () => {
      if (s.emoji) return s.emoji;
      const lowercase = label.toLowerCase();
      if (lowercase.includes("khám") || lowercase.includes("thú y") || lowercase.includes("vet") || lowercase.includes("doctor")) return "🩺";
      if (lowercase.includes("tỉa") || lowercase.includes("cắt") || lowercase.includes("groom") || lowercase.includes("lông")) return "✂️";
      if (lowercase.includes("tiêm") || lowercase.includes("vaccine") || lowercase.includes("ngừa")) return "💉";
      if (lowercase.includes("gửi") || lowercase.includes("board") || lowercase.includes("khách sạn")) return "🏠";
      if (lowercase.includes("răng") || lowercase.includes("nha khoa") || lowercase.includes("dental")) return "🦷";
      if (lowercase.includes("móng") || lowercase.includes("nail")) return "💅";
      const emojies = ["🐱", "🐕", "🦜", "🐇", "🐾"];
      return emojies[index % emojies.length];
    };

    const getColor = () => {
      if (s.color) return s.color;
      const lowercase = label.toLowerCase();
      if (lowercase.includes("khám") || lowercase.includes("thú y") || lowercase.includes("vet") || lowercase.includes("doctor")) return "#2563EB";
      if (lowercase.includes("tỉa") || lowercase.includes("cắt") || lowercase.includes("groom") || lowercase.includes("lông")) return "#7c3aed";
      if (lowercase.includes("tiêm") || lowercase.includes("vaccine") || lowercase.includes("ngừa")) return "#16a34a";
      if (lowercase.includes("gửi") || lowercase.includes("board") || lowercase.includes("khách sạn")) return "#F97316";
      if (lowercase.includes("răng") || lowercase.includes("nha khoa") || lowercase.includes("dental")) return "#0891b2";
      const colors = ["#2563EB", "#7c3aed", "#16a34a", "#F97316", "#0891b2"];
      return colors[index % colors.length];
    };

    const color = getColor();
    return {
      id: s.id || s.serviceId || `service-${index}`,
      label,
      desc,
      price,
      duration: typeof duration === "number" ? `${duration} phút` : duration,
      color,
      bg: s.bg || `${color}14`,
      emoji: getEmoji()
    };
  });

  const displayServices = mappedServices.length > 0 ? mappedServices : SERVICES;

  return (
    <PetOwnerShell pageTitle="Đặt lịch hẹn">
      <div className="max-w-5xl mx-auto">
        {done ? (
          <BookingSuccess onReset={reset} />
        ) : (
          <div>
            <StepBar step={step} total={4} />

            <div className="grid gap-6" style={{ gridTemplateColumns: step === 4 ? "1fr 360px" : "1fr" }}>

              {/* ── Step 1: Service ── */}
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>Chọn dịch vụ</h3>
                    <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "4px" }}>Chọn loại lịch hẹn bạn cần</p>
                  </div>
                  {servicesLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 w-full col-span-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderColor: settings.primaryColor }}></div>
                      <span className="ml-3 text-sm text-gray-500 mt-2">Đang tải danh sách dịch vụ...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {displayServices.map(s => {
                        const selected = service?.id === s.id;
                        return (
                          <button key={s.id} onClick={() => setService(s)}
                            className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:-translate-y-0.5"
                            style={{
                              background: selected ? `${s.color}0a` : "white",
                              border: selected ? `2px solid ${s.color}` : "1.5px solid #e5e7eb",
                              boxShadow: selected ? `0 0 0 4px ${s.color}14` : "0 2px 8px rgba(0,0,0,0.04)",
                            }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: s.bg }}>
                              {s.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>{s.label}</p>
                              <p style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "2px" }}>{s.desc}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: s.color }}>${s.price}</span>
                                <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>· {s.duration}</span>
                              </div>
                            </div>
                            {selected && (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.color }}>
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button disabled={!service} onClick={() => setStep(2)}
                    className="px-8 py-3.5 rounded-2xl transition-all"
                    style={{ background: service ? `linear-gradient(135deg, ${service.color}, ${service.color}dd)` : "#f3f4f6", color: service ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
                    Tiếp theo: Chọn thú cưng →
                  </button>
                </div>
              )}

              {/* ── Step 2: Pet + Vet ── */}
              {step === 2 && (
                <div>
                  <div className="mb-6">
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>Thú cưng nào?</h3>
                    <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "4px" }}>Chọn thú cưng và nhân viên bạn muốn</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
                    {MY_PETS.map(p => {
                      const selected = pet?.id === p.id;
                      return (
                        <button key={p.id} onClick={() => setPet(p)}
                          className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-all"
                          style={{ background: selected ? "rgba(37,99,235,0.04)" : "white", border: selected ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                          <span className="text-5xl">{p.emoji}</span>
                          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>{p.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{p.breed}</p>
                          {selected && <span className="px-3 py-1 rounded-full" style={{ background: "#2563EB", fontSize: "0.65rem", fontWeight: 700, color: "white" }}>Đã chọn ✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-8">
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>Nhân viên ưu tiên</h3>
                    <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "14px" }}>Tùy chọn — chúng tôi sẽ cố gắng đáp ứng sở thích của bạn</p>
                    <div className="grid grid-cols-2 gap-3 max-w-2xl">
                      {VETS.map(v => {
                        const selected = vet?.id === v.id;
                        return (
                          <button key={v.id} onClick={() => setVet(v)}
                            className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                            style={{ background: selected ? "rgba(37,99,235,0.04)" : "white", border: selected ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                            <span className="text-3xl flex-shrink-0">{v.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{v.name}</p>
                              <p style={{ fontSize: "0.7rem", color: "#6b7280" }}>{v.role}</p>
                              {v.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{v.rating}</span>
                                  <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>({v.reviews})</span>
                                </div>
                              )}
                            </div>
                            {selected && <Check className="w-5 h-5 flex-shrink-0" style={{ color: "#2563EB" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-6 py-3 rounded-2xl transition-all" style={{ background: "white", border: "1.5px solid #e5e7eb", color: "#374151", fontWeight: 700 }}>← Quay lại</button>
                    <button disabled={!pet} onClick={() => setStep(3)}
                      className="px-8 py-3 rounded-2xl transition-all"
                      style={{ background: pet ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: pet ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
                      Tiếp theo: Ngày & Giờ →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Date & Time ── */}
              {step === 3 && (
                <div>
                  <div className="mb-6">
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>Chọn ngày & giờ</h3>
                    <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "4px" }}>Chọn thời gian bạn muốn đến</p>
                  </div>

                  {/* Date calendar */}
                  <div className="mb-6">
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "12px" }}>NGÀY</p>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((d, i) => {
                        const sel = day?.date === d.date;
                        return (
                          <button key={i} onClick={() => setDay(d)}
                            className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl transition-all"
                            style={{
                              background: sel ? "#2563EB" : "white",
                              border: sel ? "2px solid #2563EB" : "1.5px solid #e5e7eb",
                              minWidth: "60px",
                            }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: sel ? "rgba(255,255,255,0.8)" : "#9ca3af" }}>{d.label}</span>
                            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: sel ? "white" : "#111827" }}>{d.date}</span>
                            <span style={{ fontSize: "0.6rem", color: sel ? "rgba(255,255,255,0.7)" : "#9ca3af" }}>{d.month}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time grid */}
                  <div className="mb-8">
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "12px" }}>GIỜ TRỐNG</p>
                    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}>
                      {TIMES.map(t => {
                        const sel = time === t;
                        const busy = BUSY_SLOTS.includes(t);
                        const slotMinutes = parseSlotToMinutes(t);
                        const startLimit = parseSettingsTimeToMinutes(settings.businessHoursStart);
                        const endLimit = parseSettingsTimeToMinutes(settings.businessHoursEnd);
                        const isOutOfHours = slotMinutes < startLimit || slotMinutes > endLimit;
                        const disabled = busy || isOutOfHours;
                        return (
                          <button key={t} onClick={() => !disabled && setTime(t)} disabled={disabled}
                            className="py-3 rounded-xl text-center transition-all relative group"
                            style={{
                              background: sel ? "#2563EB" : disabled ? "#f9fafb" : "white",
                              border: sel ? "2px solid #2563EB" : disabled ? "1px solid #f3f4f6" : "1.5px solid #e5e7eb",
                              fontSize: "0.82rem", fontWeight: 700,
                              color: sel ? "white" : disabled ? "#d1d5db" : "#374151",
                            }}
                            title={isOutOfHours ? "Ngoài giờ làm việc của phòng khám" : busy ? "Khung giờ đã bận" : undefined}>
                            {busy ? <s>{t}</s> : isOutOfHours ? <span className="opacity-50 text-[11px] block line-through">{t}</span> : t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="px-6 py-3 rounded-2xl transition-all" style={{ background: "white", border: "1.5px solid #e5e7eb", color: "#374151", fontWeight: 700 }}>← Quay lại</button>
                    <button disabled={!day || !time} onClick={() => setStep(4)}
                      className="px-8 py-3 rounded-2xl transition-all"
                      style={{ background: day && time ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: day && time ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
                      Tiếp theo: Xem lại →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 4: Review ── */}
              {step === 4 && (
                <>
                  <div>
                    <div className="mb-6">
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827" }}>Xem lại & Xác nhận</h3>
                      <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "4px" }}>Kiểm tra lại thông tin lịch hẹn trước khi xác nhận</p>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Ghi chú thêm (Tùy chọn)</p>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Bất kỳ hướng dẫn đặc biệt, lo ngại, hoặc yêu cầu nào cho bác sĩ hay chuyên gia cắt lông…"
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl outline-none resize-none transition-all focus:border-blue-300"
                        style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151", background: "white" }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(3)} className="px-6 py-3.5 rounded-2xl transition-all" style={{ background: "white", border: "1.5px solid #e5e7eb", color: "#374151", fontWeight: 700 }}>← Quay lại</button>
                      <button onClick={() => setDone(true)}
                        className="px-8 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
                        style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
                        ✅ Xác nhận lịch hẹn
                      </button>
                    </div>
                  </div>

                  {/* Summary sidebar */}
                  <div className="rounded-2xl overflow-hidden self-start transition-all hover:shadow-xl" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
                    <div className="px-6 py-4" style={{ borderBottom: "1px solid #f3f4f6", background: "#f8fafc" }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em" }}>TÓM TẮT LỊCH HẸN</p>
                    </div>
                    <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6" }}>
                      {[
                        { label: "Dịch vụ",    value: service?.label,                        emoji: service?.emoji },
                        { label: "Thú cưng",   value: `${pet?.name} (${pet?.breed})`,        emoji: pet?.emoji },
                        { label: "Nhân viên",  value: vet?.name ?? "Bất kỳ ai trống",        emoji: vet?.emoji ?? "⚡" },
                        { label: "Ngày",       value: day?.full,                             emoji: "📅" },
                        { label: "Giờ",        value: time,                                  emoji: "🕐" },
                        { label: "Giá",        value: `$${service?.price}`,                  emoji: "💳" },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 px-6 py-4">
                          <span className="w-8 text-center text-lg flex-shrink-0">{row.emoji}</span>
                          <div>
                            <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{row.label}</p>
                            <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4" style={{ background: "rgba(37,99,235,0.04)", borderTop: "1px solid rgba(37,99,235,0.1)" }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: "#2563EB" }} />
                        <p style={{ fontSize: "0.75rem", color: "#2563EB", fontWeight: 600 }}>Phòng khám Paws & Claws · Thứ 2–Thứ 7 8:00–18:00</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </PetOwnerShell>
  );
}
