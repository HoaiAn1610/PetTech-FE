import { useState, useEffect } from "react";
import { Loader2, Check, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import { bookingService } from "@/api/bookingService";
import { useMyPets } from "@/hooks/petowner/useMyPets";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { getSpeciesEmoji } from "@/features/petowner/pets/AddPetModal";

// ── Time slots (same as AddBookingModal) ──────────────────────────────────────
const TIME_SLOTS = [
  "09:00 SA", "09:30 SA", "10:00 SA", "10:30 SA",
  "11:00 SA", "11:30 SA", "02:00 CH", "02:30 CH",
  "03:00 CH", "03:30 CH", "04:00 CH", "04:30 CH",
];

const mapTimeSlotToTimeSpan = (slot: string): string => {
  const [time, period] = slot.split(" ");
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (period === "CH" && hours < 12) hours += 12;
  else if (period === "SA" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutesStr}:00`;
};

function parseSlotToMinutes(slot: string): number {
  const [time, period = ""] = slot.trim().toUpperCase().split(" ");
  let [h, m] = time.split(":").map(Number);
  if ((period === "CH" || period === "PM") && h < 12) h += 12;
  else if ((period === "SA" || period === "AM") && h === 12) h = 0;
  return h * 60 + (m || 0);
}

function parseSettingsTimeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

// ── Notification Banner (inline, no modal) ────────────────────────────────────
function NotificationBanner({
  success,
  message,
  onClose,
}: {
  success: boolean;
  message: string;
  onClose: () => void;
}) {
  const color = success ? "#16a34a" : "#dc2626";
  const bg    = success ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)";
  const border= success ? "rgba(22,163,74,0.2)"  : "rgba(220,38,38,0.2)";
  const Icon  = success ? CheckCircle2 : AlertTriangle;
  return (
    <div className="flex items-start gap-3 px-5 py-4 rounded-2xl mb-6"
      style={{ background: bg, border: `1.5px solid ${border}` }}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
      <div className="flex-1">
        <p style={{ fontSize: "0.88rem", fontWeight: 700, color }}>{success ? "Đặt lịch thành công!" : "Đặt lịch thất bại!"}</p>
        <p style={{ fontSize: "0.78rem", color: "#374151", marginTop: "2px" }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af" }}>✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function PetOwnerBookingPage() {
  const { settings } = useTenant();
  const { user }     = useAuth();
  const { data: myPets = [], isLoading: petsLoading } = useMyPets();

  // ── Remote data (same load pattern as AddBookingModal) ────────────────────
  const [services,  setServices]  = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [svcRes, staffRes] = await Promise.all([
          bookingService.getServices(),
          bookingService.getStaff(),
        ]);

        const parsedSvcs: any[] = Array.isArray(svcRes)
          ? svcRes
          : Array.isArray(svcRes?.items) ? svcRes.items : [];
        setServices(parsedSvcs);
        if (parsedSvcs.length > 0) setSelectedServiceId(parsedSvcs[0].id);

        const parsedStaff: any[] = Array.isArray(staffRes)
          ? staffRes
          : Array.isArray(staffRes?.items) ? staffRes.items : [];
        setStaffList(parsedStaff);
        if (parsedStaff.length > 0) setSelectedStaffId(parsedStaff[0].id);
      } catch (err) {
        console.error("Failed to load booking form data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Form state ────────────────────────────────────────────────────────────
  const [selectedPet,       setSelectedPet]       = useState<any | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedStaffId,   setSelectedStaffId]   = useState("");
  const [timeSlot,          setTimeSlot]          = useState("10:00 SA");
  const [notes,             setNotes]             = useState("");
  const [submitting,        setSubmitting]        = useState(false);
  const [notification,      setNotification]      = useState<{ show: boolean; success: boolean; message: string } | null>(null);

  const [bookingDate, setBookingDate] = useState(() => {
    const d  = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  });

  const canSave = selectedPet && selectedServiceId && selectedStaffId && bookingDate && timeSlot;

  // ── Submit (same payload as AddBookingModal) ──────────────────────────────
  async function handleCreate() {
    if (!canSave) return;
    setSubmitting(true);
    setNotification(null);
    try {
      const payload = {
        petId:           selectedPet.id,
        ownerId:         user?.id ?? selectedPet.ownerId ?? "",
        serviceId:       selectedServiceId,
        assignedStaffId: selectedStaffId || null,
        bookingDate:     `${bookingDate}T00:00:00Z`,
        startTime:       mapTimeSlotToTimeSpan(timeSlot),
        notes:           notes || "",
      };
      const res = await bookingService.createBooking(payload);
      if (res && res.isSuccess !== false) {
        setNotification({
          show: true, success: true,
          message: `Lịch hẹn đã được thiết lập thành công cho bé ${selectedPet.name} vào ngày ${bookingDate} lúc ${timeSlot}.`,
        });
        // Reset form
        setSelectedPet(null); setNotes(""); setTimeSlot("10:00 SA");
      } else {
        setNotification({
          show: true, success: false,
          message: res?.message || "Không thể tạo lịch hẹn. Vui lòng kiểm tra lại khung giờ hoặc bác sĩ phụ trách!",
        });
      }
    } catch {
      setNotification({
        show: true, success: false,
        message: "Đã xảy ra lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền và thử lại sau!",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PetOwnerShell pageTitle="Đặt lịch hẹn">
      <div className="max-w-2xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* Page header */}
        <div className="mb-6">
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827" }}>Đặt lịch khám thú cưng</h2>
          <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "4px" }}>Thiết lập ca khám, dịch vụ spa & phân công bác sĩ</p>
        </div>

        {/* Notification */}
        {notification?.show && (
          <NotificationBanner
            success={notification.success}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {loading || petsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>Đang kết nối cơ sở dữ liệu…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* ── Pet Selector ────────────────────────────────────────────── */}
            <div>
              <label className="block mb-2" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                THÚ CƯNG CỦA BẠN *
              </label>

              {myPets.length === 0 ? (
                <div className="py-8 rounded-2xl text-center" style={{ border: "1.5px dashed #e5e7eb" }}>
                  <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Bạn chưa có thú cưng nào. Hãy thêm thú cưng trước.</p>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}>
                  {myPets.map(p => {
                    const selected = selectedPet?.id === p.id;
                    const emoji    = p.emoji || getSpeciesEmoji(p.species);
                    return (
                      <button key={p.id} onClick={() => setSelectedPet(selected ? null : p)}
                        className="flex flex-col items-center gap-2 py-5 rounded-2xl transition-all hover:-translate-y-0.5"
                        style={{
                          background: selected ? "rgba(37,99,235,0.05)" : "white",
                          border:     selected ? "2px solid #2563EB" : "1.5px solid #e5e7eb",
                          boxShadow:  selected ? "0 0 0 4px rgba(37,99,235,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                        <span style={{ fontSize: "2.4rem" }}>{emoji}</span>
                        <div className="text-center">
                          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{p.name}</p>
                          <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "1px" }}>{p.breed || p.species}</p>
                        </div>
                        {selected && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#2563EB" }}>
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Service & Staff ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  DỊCH VỤ Y TẾ / SPA *
                </label>
                <select value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-white"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter", color: "#374151" }}>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.durationMinutes ? `(${s.durationMinutes}m)` : ""}
                    </option>
                  ))}
                  {services.length === 0 && <option disabled>Không có dịch vụ</option>}
                </select>
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  BÁC SĨ PHỤ TRÁCH *
                </label>
                <select value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-white"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter", color: "#374151" }}>
                  {staffList.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullName || "Bác sĩ trực"}
                    </option>
                  ))}
                  {staffList.length === 0 && <option disabled>Không có nhân viên</option>}
                </select>
              </div>
            </div>

            {/* ── Date & Time ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  NGÀY HẸN KHÁM *
                </label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-white"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter", color: "#374151" }} />
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  KHUNG GIỜ KHÁM *
                </label>
                <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-white"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter", color: "#374151" }}>
                  {TIME_SLOTS.map(t => {
                    const slotMin  = parseSlotToMinutes(t);
                    const startMin = parseSettingsTimeToMinutes(settings.businessHoursStart);
                    const endMin   = parseSettingsTimeToMinutes(settings.businessHoursEnd);
                    const outOfHours = startMin > 0 && endMin > 0 && (slotMin < startMin || slotMin > endMin);
                    return (
                      <option key={t} value={t} disabled={outOfHours}>
                        {t}{outOfHours ? " (Ngoài giờ làm việc)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* ── Notes ───────────────────────────────────────────────────── */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: "0.65rem", fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                TRIỆU CHỨNG LÂM SÀNG / LƯU Ý
              </label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Nhập triệu chứng của thú cưng hoặc yêu cầu khác…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter", color: "#374151" }} />
            </div>

            {/* ── Policy note (same as AddBookingModal) ───────────────────── */}
            <div className="flex gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)" }}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
              <p style={{ fontSize: "0.72rem", fontWeight: 500, color: "#1d4ed8", lineHeight: 1.5 }}>
                <strong>Lưu ý:</strong> Lịch hẹn sau khi tạo sẽ được xác nhận và bác sĩ phụ trách sẽ liên hệ với bạn nếu cần điều chỉnh.
              </p>
            </div>

            {/* ── Submit ──────────────────────────────────────────────────── */}
            <button disabled={!canSave || submitting} onClick={handleCreate}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
              style={{
                background: canSave ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb",
                color:      canSave ? "white" : "#9ca3af",
                fontWeight: 800, fontSize: "0.95rem",
                boxShadow:  canSave ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
              }}>
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý…</>
                : "Đặt lịch hẹn ngay"}
            </button>

          </div>
        )}
      </div>
    </PetOwnerShell>
  );
}
