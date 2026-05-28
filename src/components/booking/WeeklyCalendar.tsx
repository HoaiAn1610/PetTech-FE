import { useState, useCallback, useEffect, useMemo } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Check,
  Trash2,
  Settings,
  Edit3,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { bookingService } from "@/api/bookingService";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { ClinicConfirmModal } from "@/components/clinic/ClinicConfirmModal";
import { AddBookingModal } from "@/components/booking/AddBookingModal";
import { useTenant, useServices } from "@/context/TenantContext";

// ── Constants ─────────────────────────────────────────────────────────────────
const HOUR_HEIGHT = 64; // px per hour
const START_HOUR  = 8;  // 8 AM
const END_HOUR    = 19; // 7 PM
const HOURS       = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const ITEM_TYPE   = "APPOINTMENT";

// ── Helper to calculate start of the week (Monday) ───────────────────────────
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const start = new Date(date.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

// ── Appointment colours per service ──────────────────────────────────────────
const SERVICE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "Tắm chải":       { bg: "#f5f3ff", border: "#7c3aed", text: "#5b21b6", dot: "#7c3aed" },
  "Khám tổng quát": { bg: "#eff6ff", border: "#2563EB", text: "#1d4ed8", dot: "#2563EB" },
  "Tiêm vaccine":   { bg: "#f0fdf4", border: "#16a34a", text: "#15803d", dot: "#16a34a" },
  "Vệ sinh răng":   { bg: "#ecfeff", border: "#0891b2", text: "#0e7490", dot: "#0891b2" },
  "X-Quang":        { bg: "#fffbeb", border: "#d97706", text: "#b45309", dot: "#d97706" },
  "Tiểu phẫu":      { bg: "#fff1f2", border: "#e11d48", text: "#be123c", dot: "#e11d48" },
  "Dinh dưỡng":     { bg: "#fff7ed", border: "#F97316", text: "#c2410c", dot: "#F97316" },
  "Tẩy giun sán":   { bg: "#f9fafb", border: "#6b7280", text: "#4b5563", dot: "#6b7280" },
};

interface Appointment {
  id: string;
  pet: string;
  owner: string;
  service: string;
  vet: string;
  dayIdx: number;      // 0-6
  startHour: number;   // e.g. 9.5 = 9:30
  duration: number;    // in hours
  status?: string;
  notes?: string;
  cancellationReason?: string;
  startTimeLabel?: string;
  hasAlert?: boolean;
}

// ── Draggable Appointment Block ───────────────────────────────────────────────
function AppointmentBlock({
  appt,
  onAlertClick,
  onClick,
  colors,
}: {
  appt: Appointment;
  onAlertClick: () => void;
  onClick: () => void;
  colors: { bg: string; border: string; text: string; dot: string };
}) {
  const topPx     = (appt.startHour - START_HOUR) * HOUR_HEIGHT;
  const heightPx  = Math.max(appt.duration * HOUR_HEIGHT - 4, 26);
  const isShort   = heightPx < 44;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: appt.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const startMin   = Math.round((appt.startHour % 1) * 60);
  const startStr   = `${Math.floor(appt.startHour)}:${startMin === 0 ? "00" : startMin} ${Math.floor(appt.startHour) < 12 ? "AM" : "PM"}`;
  const endHour    = appt.startHour + appt.duration;
  const endMin     = Math.round((endHour % 1) * 60);
  const endStr     = `${Math.floor(endHour)}:${endMin === 0 ? "00" : endMin} ${Math.floor(endHour) < 12 ? "AM" : "PM"}`;

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      onClick={onClick}
      className="absolute left-1 right-1 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 group"
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderLeft: `3.5px solid ${colors.border}`,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 50 : 10,
        boxShadow: isDragging
          ? `0 12px 32px rgba(0,0,0,0.25), 0 0 0 2px ${colors.border}`
          : "0 1px 4px rgba(0,0,0,0.07)",
        transform: isDragging ? "scale(1.03) rotate(1.5deg)" : "scale(1)",
      }}
    >
      {/* Alert / Status badge */}
      {appt.status === "Cancelled" && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 z-20" title="Đã hủy" />
      )}
      {appt.status === "Completed" && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 z-20" title="Hoàn thành" />
      )}
      {appt.hasAlert && appt.status !== "Cancelled" && (
        <button
          onClick={(e) => { e.stopPropagation(); onAlertClick(); }}
          className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center z-20 hover:scale-125 transition-transform"
          style={{ background: "#dc2626" }}
          title="Cảnh báo y tế"
        >
          <AlertTriangle className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </button>
      )}

      <div className="px-2 py-1.5 flex flex-col h-full overflow-hidden">
        {/* Dot + service */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
          <span
            className="truncate"
            style={{ fontSize: "0.62rem", fontWeight: 700, color: colors.text, letterSpacing: "0.02em" }}
          >
            {appt.service.toUpperCase()}
          </span>
        </div>

        {!isShort && (
          <>
            {/* Pet name */}
            <p
              className="truncate mt-0.5"
              style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}
            >
              {appt.pet}
            </p>
            {/* Owner + time */}
            <div className="flex items-center gap-1 mt-auto">
              <User className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
              <span className="truncate" style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{appt.owner}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
              <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{startStr} – {endStr}</span>
            </div>
          </>
        )}
        {isShort && (
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#374151" }} className="truncate">
            {appt.pet}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Drop Cell (day column × hour row) ────────────────────────────────────────
function DropCell({
  dayIdx,
  hour,
  onDrop,
}: {
  dayIdx: number;
  hour: number;
  onDrop: (id: string, dayIdx: number, hour: number) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, dayIdx, hour),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="border-b border-r transition-colors"
      style={{
        height: `${HOUR_HEIGHT}px`,
        borderColor: "rgba(0,0,0,0.05)",
        background: isOver && canDrop
          ? "rgba(37,99,235,0.07)"
          : hour % 2 === 0
          ? "transparent"
          : "rgba(0,0,0,0.015)",
      }}
    />
  );
}

// ── Day Column ────────────────────────────────────────────────────────────────
function DayColumn({
  day,
  appointments,
  onDrop,
  onAlertClick,
  onAppointmentClick,
  serviceColors,
}: {
  day: { label: string; date: string; dayIdx: number; isToday: boolean };
  appointments: Appointment[];
  onDrop: (id: string, dayIdx: number, hour: number) => void;
  onAlertClick: () => void;
  onAppointmentClick: (appt: Appointment) => void;
  serviceColors: Record<string, { bg: string; border: string; text: string; dot: string }>;
}) {
  return (
    <div className="flex-1 relative min-w-0 border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
      {/* Hour drop cells */}
      {HOURS.map((hour) => (
        <DropCell key={hour} dayIdx={day.dayIdx} hour={hour} onDrop={onDrop} />
      ))}

      {/* Appointment blocks – absolutely positioned */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {appointments.map((appt) => {
            const colors = serviceColors[appt.service] ?? serviceColors["Khám tổng quát"] ?? { bg: "#eff6ff", border: "#2563EB", text: "#1d4ed8", dot: "#2563EB" };
            return (
              <AppointmentBlock
                key={appt.id}
                appt={appt}
                onAlertClick={onAlertClick}
                onClick={() => onAppointmentClick(appt)}
                colors={colors}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Current-time indicator ────────────────────────────────────────────────────
function NowIndicator({ todayColIdx }: { todayColIdx: number }) {
  const now = new Date();
  const fractionalHour = now.getHours() + now.getMinutes() / 60;
  if (fractionalHour < START_HOUR || fractionalHour > END_HOUR) return null;
  const top = (fractionalHour - START_HOUR) * HOUR_HEIGHT;

  return (
    <div
      className="absolute pointer-events-none z-30 flex items-center"
      style={{ top: `${top}px`, left: 0, right: 0 }}
    >
      <div
        className="flex-shrink-0 w-2 h-2 rounded-full"
        style={{ background: "#dc2626", marginLeft: `calc(${todayColIdx === 0 ? "64px" : `64px + ${todayColIdx} * (100% - 64px) / 7`})`, boxShadow: "0 0 6px rgba(220,38,38,0.7)" }}
      />
      <div className="flex-1 h-px" style={{ background: "#dc2626", opacity: 0.5 }} />
    </div>
  );
}

// ── Manage Booking Modal Component ───────────────────────────────────────────
interface ManageBookingModalProps {
  appt: Appointment;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: string, cancellationReason?: string) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
}

function ManageBookingModal({ appt, onClose, onUpdateStatus, onDeleteBooking }: ManageBookingModalProps) {
  const [status, setStatus] = useState(appt.status || "Confirmed");
  const [reason, setReason] = useState(appt.cancellationReason || "");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await onUpdateStatus(appt.id, status, status === "Cancelled" ? reason : undefined);
      onClose();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onDeleteBooking(appt.id);
      onClose();
    } catch (err) {
      alert("Xóa lịch hẹn thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    Confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    CheckedIn: "bg-purple-50 text-purple-600 border-purple-200",
    InProgress: "bg-yellow-50 text-yellow-600 border-yellow-200",
    Completed: "bg-green-50 text-green-600 border-green-200",
    NoShow: "bg-gray-50 text-gray-600 border-gray-200",
    Cancelled: "bg-red-50 text-red-600 border-red-200"
  };

  const statusLabels: Record<string, string> = {
    Confirmed: "Đã xác nhận",
    CheckedIn: "Đã Check-in",
    InProgress: "Đang tiến hành",
    Completed: "Đã hoàn thành",
    NoShow: "Khách không đến",
    Cancelled: "Đã hủy bỏ"
  };

  const ModalFooter = (
    <div className="flex w-full justify-between items-center gap-3 flex-wrap">
      <button
        onClick={() => setShowConfirmDelete(true)}
        className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Xóa lịch hẹn
      </button>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Cập nhật
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ClinicModal
        title="Quản lý lịch hẹn chi tiết"
        subtitle={`Mã lịch hẹn: #${appt.id}`}
        onClose={onClose}
        footer={ModalFooter}
        maxWidth="max-w-md"
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-3.5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">
              🐾
            </div>
            <div>
              <p className="text-sm font-black text-gray-800 leading-tight">Thú cưng: {appt.pet}</p>
              <p className="text-xs text-gray-400 mt-1">Chủ sở hữu: {appt.owner}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DỊCH VỤ</span>
              <span className="text-xs font-bold text-gray-800">{appt.service}</span>
            </div>
            <div className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">NHÂN VIÊN</span>
              <span className="text-xs font-bold text-gray-800">{appt.vet}</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <div className="text-xs text-gray-700">
              <span className="font-black text-gray-800 block">Thời gian đặt lịch:</span>
              <span>Bắt đầu lúc {appt.startTimeLabel} ({appt.duration * 60} phút)</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
              TRẠNG THÁI CA KHÁM *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(statusLabels).map((key) => {
                const active = status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      active
                        ? `${statusColors[key]} ring-2 ring-blue-500/20 shadow-sm scale-[1.02]`
                        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block">{statusLabels[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {status === "Cancelled" && (
            <div className="mt-1 transition-all">
              <label className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1.5">
                LÝ DO HỦY LỊCH *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do khách hủy lịch hoặc cửa hàng hủy..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-red-200 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 text-xs transition-all resize-none"
              />
            </div>
          )}

          {appt.notes && (
            <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
              <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest block mb-1">GHI CHÚ TRIỆU CHỨNG</span>
              <p className="text-[11px] text-yellow-800 leading-relaxed font-medium">{appt.notes}</p>
            </div>
          )}
        </div>
      </ClinicModal>

      {showConfirmDelete && (
        <ClinicConfirmModal
          isOpen={showConfirmDelete}
          title="Xác nhận xóa lịch hẹn?"
          message="Hành động này sẽ xóa vĩnh viễn ca đặt lịch khỏi hệ thống và không thể phục hồi dữ liệu."
          confirmLabel="Có, xóa lịch hẹn"
          cancelLabel="Quay lại"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
          variant="danger"
        />
      )}
    </>
  );
}

// ── Calendar inner (needs DndProvider wrapping) ───────────────────────────────
function CalendarInner({ onAlertClick }: { onAlertClick: () => void }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [vets, setVets] = useState<string[]>(["Tất cả"]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [loading, setLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: true,
    message: ""
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffRes = await bookingService.getStaff();
        let parsedStaff: any[] = [];
        if (staffRes) {
          if (Array.isArray(staffRes)) parsedStaff = staffRes;
          else if (Array.isArray((staffRes as any).items)) parsedStaff = (staffRes as any).items;
          else if ((staffRes as any).value && Array.isArray((staffRes as any).value.items)) parsedStaff = (staffRes as any).value.items;
          else if ((staffRes as any).data && Array.isArray((staffRes as any).data.items)) parsedStaff = (staffRes as any).data.items;
        }
        const names = parsedStaff.map((s: any) => s.fullName).filter(Boolean);
        setVets(["Tất cả", ...Array.from(new Set(names))]);
      } catch (err) {
        console.error("Failed to load staff list for filtering:", err);
      }
    };
    fetchStaff();
  }, []);

  const { services } = useServices();
  const { settings } = useTenant();

  const dynamicServiceColors = useMemo(() => {
    const colorsMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
      ...SERVICE_COLORS
    };

    services.forEach((s: any, idx: number) => {
      const name = s.name || s.label || s.title;
      if (!name) return;
      
      const getColor = () => {
        if (s.color) return s.color;
        const lowercase = name.toLowerCase();
        if (lowercase.includes("khám") || lowercase.includes("thú y") || lowercase.includes("vet") || lowercase.includes("doctor")) return "#2563EB";
        if (lowercase.includes("tỉa") || lowercase.includes("cắt") || lowercase.includes("groom") || lowercase.includes("lông") || lowercase.includes("tắm")) return "#7c3aed";
        if (lowercase.includes("tiêm") || lowercase.includes("vaccine") || lowercase.includes("ngừa")) return "#16a34a";
        if (lowercase.includes("gửi") || lowercase.includes("board") || lowercase.includes("khách sạn")) return "#F97316";
        if (lowercase.includes("răng") || lowercase.includes("nha khoa") || lowercase.includes("dental")) return "#0891b2";
        if (lowercase.includes("quang") || lowercase.includes("ray")) return "#d97706";
        if (lowercase.includes("phẫu") || lowercase.includes("surg")) return "#e11d48";
        
        const list = ["#2563EB", "#7c3aed", "#16a34a", "#F97316", "#0891b2", "#d97706", "#e11d48"];
        return list[idx % list.length];
      };

      const color = getColor();
      colorsMap[name] = {
        bg: `${color}0d`,
        border: color,
        text: color,
        dot: color
      };
    });

    return colorsMap;
  }, [services]);

  // Generate weekDays list
  const weekDays = useMemo(() => {
    const days = [];
    const todayStr = new Date().toDateString();
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      const isToday = d.toDateString() === todayStr;
      const label = i === 6 ? "CN" : `T${i + 2}`;
      days.push({
        label,
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        fullDateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        dayIdx: i,
        isToday,
      });
    }
    return days;
  }, [currentWeekStart]);

  const weekRangeStr = useMemo(() => {
    if (weekDays.length === 0) return "";
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(start.getDate() + 6);
    return `${start.getDate()} – ${end.getDate()} Tháng ${start.getMonth() + 1}, ${start.getFullYear()}`;
  }, [currentWeekStart, weekDays]);

  // Load bookings only from live API - completely removing mock data fallback
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getBookings();
      let list: any[] = [];
      if (res && res.isSuccess) {
        const payload = res.value || res.data || res;
        if (Array.isArray(payload)) list = payload;
        else if (Array.isArray(payload.items)) list = payload.items;
      } else if (res) {
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res.items)) list = res.items;
      }

      // Map raw BookingDto to calendar Appointment interface
      const mappedReal = list.map((b: any) => {
        const bDateStr = b.bookingDate ? b.bookingDate.split("T")[0] : "";
        const matchedDay = weekDays.find(d => d.fullDateStr === bDateStr);
        const dayIdx = matchedDay ? matchedDay.dayIdx : -1;

        let startHour = 9;
        if (b.startTime) {
          const parts = b.startTime.split(":");
          if (parts.length >= 2) {
            startHour = parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
          }
        }

        let duration = 1;
        if (b.endTime && b.startTime) {
          const sParts = b.startTime.split(":");
          const eParts = b.endTime.split(":");
          if (sParts.length >= 2 && eParts.length >= 2) {
            const sh = parseInt(sParts[0], 10) + parseInt(sParts[1], 10) / 60;
            const eh = parseInt(eParts[0], 10) + parseInt(eParts[1], 10) / 60;
            duration = Math.max(eh - sh, 0.5);
          }
        }

        const startMin = Math.round((startHour % 1) * 60);
        const startHourInt = Math.floor(startHour);
        const startTimeLabel = `${startHourInt}:${startMin.toString().padStart(2, '0')}`;

        return {
          id: b.id,
          pet: b.petName || "",
          owner: b.ownerName || "",
          service: b.serviceName || "",
          vet: b.assignedStaffName || "",
          dayIdx,
          startHour,
          duration,
          status: b.status || "Confirmed",
          notes: b.notes || "",
          cancellationReason: b.cancellationReason || "",
          startTimeLabel,
          hasAlert: b.status === "Cancelled"
        };
      }).filter(a => a.dayIdx !== -1);

      // Only API data displayed, absolutely zero mocks loaded
      setAppointments(mappedReal);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleDrop = useCallback(
    (id: string, newDayIdx: number, newHour: number) => {
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, dayIdx: newDayIdx, startHour: newHour } : a)
      );
    },
    []
  );

  // Update Status API action
  const handleUpdateStatus = async (id: string, newStatus: string, cancellationReason?: string) => {
    try {
      await bookingService.updateBookingStatus(id, newStatus as any, cancellationReason);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to update status on backend:", err);
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus, cancellationReason: cancellationReason || "" } : a)
      );
    }
  };

  // Delete Booking API action
  const handleDeleteBooking = async (id: string) => {
    try {
      await bookingService.deleteBooking(id);
      await fetchBookings();
      setDeleteSuccessModal({
        show: true,
        success: true,
        message: "Lịch hẹn khám thú cưng đã được xóa vĩnh viễn khỏi hệ thống thành công!"
      });
    } catch (err) {
      console.error("Failed to delete booking on backend:", err);
      setDeleteSuccessModal({
        show: true,
        success: false,
        message: "Không thể xóa lịch hẹn lúc này. Vui lòng kiểm tra lại quyền truy cập hoặc kết nối mạng!"
      });
    }
  };

  const filtered = activeFilter === "Tất cả"
    ? appointments
    : appointments.filter((a) => a.vet === activeFilter);

  // Today indicator column Index finder
  const todayIdx = weekDays.findIndex(d => d.isToday);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Calendar toolbar ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", background: "white" }}
      >
        <div className="flex items-center gap-2">
          <button onClick={handlePrevWeek} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
              {weekRangeStr}
            </h3>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Tuần này · {appointments.length} lịch hẹn</p>
          </div>
          <button onClick={handleNextWeek} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Vet filter chips */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "#f3f4f6" }}>
            {vets.map((v) => (
              <button
                key={v}
                onClick={() => setActiveFilter(v)}
                className="px-3 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  background: activeFilter === v ? "white" : "transparent",
                  fontSize: "0.75rem",
                  fontWeight: activeFilter === v ? 700 : 500,
                  color: activeFilter === v ? "#2563EB" : "#6b7280",
                  boxShadow: activeFilter === v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ border: "1.5px solid rgba(0,0,0,0.09)", fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Filter className="w-3.5 h-3.5" />}
            Tải lại
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all duration-150 hover:-translate-y-px"
            style={{
              background: "#2563EB",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "white",
              boxShadow: "0 3px 10px rgba(37,99,235,0.35)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Đặt lịch mới
          </button>
        </div>
      </div>

      {/* ── Day headers ── */}
      <div
        className="flex border-b flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", background: "white" }}
      >
        {/* Time gutter */}
        <div className="flex-shrink-0" style={{ width: "64px" }} />
        {weekDays.map((day) => (
          <div
            key={day.dayIdx}
            className="flex-1 flex flex-col items-center py-2.5 border-r"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              background: day.isToday ? "rgba(37,99,235,0.04)" : "transparent",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: day.isToday ? "#2563EB" : "#9ca3af",
                letterSpacing: "0.08em",
              }}
            >
              {day.label.toUpperCase()}
            </span>
            <span
              className="w-8 h-8 flex items-center justify-center rounded-full mt-0.5"
              style={{
                fontSize: "0.9rem",
                fontWeight: 800,
                background: day.isToday ? "#2563EB" : "transparent",
                color: day.isToday ? "white" : "#374151",
              }}
            >
              {day.date.split("/")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Scrollable grid ── */}
      <div className="flex-1 overflow-y-auto relative" style={{ background: "#fafbfc" }}>
        <div className="flex relative" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
          {/* Time labels column */}
          <div className="flex-shrink-0 border-r" style={{ width: "64px", borderColor: "rgba(0,0,0,0.07)" }}>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2.5 border-b"
                style={{
                  height: `${HOUR_HEIGHT}px`,
                  borderColor: "rgba(0,0,0,0.05)",
                  paddingTop: "4px",
                }}
              >
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "#9ca3af" }}>
                  {hour === 12 ? "12 CH" : hour > 12 ? `${hour - 12} CH` : `${hour} SA`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => (
            <DayColumn
              key={day.dayIdx}
              day={day}
              appointments={filtered.filter((a) => a.dayIdx === day.dayIdx)}
              onDrop={handleDrop}
              onAlertClick={onAlertClick}
              onAppointmentClick={(appt) => setSelectedAppt(appt)}
              serviceColors={dynamicServiceColors}
            />
          ))}

          {/* Now indicator */}
          {todayIdx !== -1 && <NowIndicator todayColIdx={todayIdx} />}
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-4 px-5 py-2.5 border-t flex-shrink-0 flex-wrap"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "white" }}
      >
        {services.map((s: any, idx: number) => {
          const name = s.name || s.label || s.title;
          const c = dynamicServiceColors[name] || { dot: "#2563EB" };
          return (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c.dot }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "#6b7280" }}>{name}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#dc2626" }}>= Cảnh báo y tế</span>
        </div>
      </div>

      {/* ── Appointment details submodal ── */}
      {selectedAppt && (
        <ManageBookingModal
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {/* ── Add Booking Modal ── */}
      {showAddModal && (
        <AddBookingModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchBookings}
        />
      )}

      {/* ── Success/Failure Notification Modal ── */}
      {deleteSuccessModal.show && (
        <ClinicConfirmModal
          isOpen={deleteSuccessModal.show}
          title={deleteSuccessModal.success ? "Xóa lịch hẹn thành công!" : "Xóa lịch hẹn thất bại!"}
          message={deleteSuccessModal.message}
          confirmLabel="Đồng ý"
          cancelLabel=""
          variant={deleteSuccessModal.success ? "success" : "danger"}
          onConfirm={() => setDeleteSuccessModal({ show: false, success: true, message: "" })}
          onCancel={() => setDeleteSuccessModal({ show: false, success: true, message: "" })}
        />
      )}
    </div>
  );
}

// ── Public export (wraps with DndProvider) ────────────────────────────────────
export function WeeklyCalendar({ onAlertClick }: { onAlertClick: () => void }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CalendarInner onAlertClick={onAlertClick} />
    </DndProvider>
  );
}