import { useState, useCallback } from "react";
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
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const HOUR_HEIGHT = 64; // px per hour
const START_HOUR  = 8;  // 8 AM
const END_HOUR    = 19; // 7 PM
const HOURS       = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const ITEM_TYPE   = "APPOINTMENT";

// Week: March 2–8, 2026 (Thu = today = March 5)
const WEEK_DAYS = [
  { label: "T2", date: "2/3",  dayIdx: 0, isToday: false },
  { label: "T3", date: "3/3",  dayIdx: 1, isToday: false },
  { label: "T4", date: "4/3",  dayIdx: 2, isToday: false },
  { label: "T5", date: "5/3",  dayIdx: 3, isToday: true  },
  { label: "T6", date: "6/3",  dayIdx: 4, isToday: false },
  { label: "T7", date: "7/3",  dayIdx: 5, isToday: false },
  { label: "CN", date: "8/3",  dayIdx: 6, isToday: false },
];

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

// ── Appointment data ──────────────────────────────────────────────────────────
interface Appointment {
  id: string;
  pet: string;
  owner: string;
  service: string;
  vet: string;
  dayIdx: number;      // 0-6
  startHour: number;   // e.g. 9.5 = 9:30
  duration: number;    // in hours
  hasAlert?: boolean;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "a1",  pet: "Bella",   owner: "A. Tuấn",   service: "Tắm chải",        vet: "BS. Kim",    dayIdx: 0, startHour: 9,    duration: 1,    hasAlert: true  },
  { id: "a2",  pet: "Max",     owner: "D. Minh",   service: "Khám tổng quát",  vet: "BS. Park",   dayIdx: 0, startHour: 11,   duration: 0.5               },
  { id: "a3",  pet: "Luna",    owner: "C. Lan",    service: "Tiêm vaccine",    vet: "BS. Linh",   dayIdx: 1, startHour: 9,    duration: 0.5               },
  { id: "a4",  pet: "Coco",    owner: "T. Hoa",    service: "Vệ sinh răng",    vet: "BS. Kim",    dayIdx: 1, startHour: 10.5, duration: 0.75              },
  { id: "a5",  pet: "Rocky",   owner: "V. Hùng",   service: "Tiểu phẫu",       vet: "BS. Park",   dayIdx: 1, startHour: 13,   duration: 1.5               },
  { id: "a6",  pet: "Milo",    owner: "P. Nam",    service: "X-Quang",         vet: "BS. Linh",   dayIdx: 2, startHour: 9.5,  duration: 0.5               },
  { id: "a7",  pet: "Daisy",   owner: "N. Yến",    service: "Tắm chải",        vet: "BS. Kim",    dayIdx: 2, startHour: 11,   duration: 1                 },
  { id: "a8",  pet: "Charlie", owner: "B. Khoa",   service: "Khám tổng quát",  vet: "BS. Park",   dayIdx: 2, startHour: 14,   duration: 0.5               },
  { id: "a9",  pet: "Bella",   owner: "A. Tuấn",   service: "Dinh dưỡng",      vet: "BS. Linh",   dayIdx: 3, startHour: 9,    duration: 0.5, hasAlert: true },
  { id: "a10", pet: "Oscar",   owner: "M. Trang",  service: "Tiêm vaccine",    vet: "BS. Kim",    dayIdx: 3, startHour: 10,   duration: 0.5               },
  { id: "a11", pet: "Molly",   owner: "T. Phúc",   service: "Vệ sinh răng",    vet: "BS. Park",   dayIdx: 3, startHour: 11,   duration: 0.75              },
  { id: "a12", pet: "Buddy",   owner: "H. Long",   service: "Tắm chải",        vet: "BS. Kim",    dayIdx: 3, startHour: 13,   duration: 1                 },
  { id: "a13", pet: "Cleo",    owner: "Q. Linh",   service: "Tiểu phẫu",       vet: "BS. Linh",   dayIdx: 3, startHour: 15,   duration: 1.5               },
  { id: "a14", pet: "Rex",     owner: "S. Duy",    service: "Tẩy giun sán",    vet: "BS. Park",   dayIdx: 4, startHour: 9,    duration: 0.25              },
  { id: "a15", pet: "Nala",    owner: "L. Mai",    service: "Khám tổng quát",  vet: "BS. Kim",    dayIdx: 4, startHour: 10,   duration: 0.5               },
  { id: "a16", pet: "Simba",   owner: "K. Bảo",    service: "X-Quang",         vet: "BS. Linh",   dayIdx: 4, startHour: 14,   duration: 0.5               },
  { id: "a17", pet: "Pip",     owner: "G. Thảo",   service: "Tắm chải",        vet: "BS. Kim",    dayIdx: 5, startHour: 10,   duration: 1                 },
  { id: "a18", pet: "Zuzu",    owner: "R. Hưng",   service: "Tiêm vaccine",    vet: "BS. Park",   dayIdx: 5, startHour: 12,   duration: 0.5               },
  { id: "a19", pet: "Biscuit", owner: "F. Châu",   service: "Dinh dưỡng",      vet: "BS. Linh",   dayIdx: 6, startHour: 11,   duration: 0.5               },
];

// ── Draggable Appointment Block ───────────────────────────────────────────────
function AppointmentBlock({
  appt,
  onAlertClick,
}: {
  appt: Appointment;
  onAlertClick: () => void;
}) {
  const colors = SERVICE_COLORS[appt.service] ?? SERVICE_COLORS["Check-up"];
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
      {/* Alert badge */}
      {appt.hasAlert && (
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
}: {
  day: (typeof WEEK_DAYS)[0];
  appointments: Appointment[];
  onDrop: (id: string, dayIdx: number, hour: number) => void;
  onAlertClick: () => void;
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
          {appointments.map((appt) => (
            <AppointmentBlock key={appt.id} appt={appt} onAlertClick={onAlertClick} />
          ))}
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

  // Position over the today column (1 time-label column + todayColIdx * flex columns)
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

// ── Calendar inner (needs DndProvider wrapping) ───────────────────────────────
function CalendarInner({ onAlertClick }: { onAlertClick: () => void }) {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");

  const handleDrop = useCallback(
    (id: string, newDayIdx: number, newHour: number) => {
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, dayIdx: newDayIdx, startHour: newHour } : a)
      );
    },
    []
  );

  const vets = ["Tất cả", "BS. Kim", "BS. Park", "BS. Linh"];
  const filtered = activeFilter === "Tất cả"
    ? appointments
    : appointments.filter((a) => a.vet === activeFilter);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Calendar toolbar ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", background: "white" }}
      >
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
              2 – 8 Tháng 3, 2026
            </h3>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Tuần này · {appointments.length} lịch hẹn</p>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ border: "1.5px solid rgba(0,0,0,0.09)", fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}
          >
            <Filter className="w-3.5 h-3.5" />
            Lọc
          </button>

          <button
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
        {WEEK_DAYS.map((day) => (
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
          {WEEK_DAYS.map((day) => (
            <DayColumn
              key={day.dayIdx}
              day={day}
              appointments={filtered.filter((a) => a.dayIdx === day.dayIdx)}
              onDrop={handleDrop}
              onAlertClick={onAlertClick}
            />
          ))}

          {/* Now indicator */}
          <NowIndicator todayColIdx={3} />
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-4 px-5 py-2.5 border-t flex-shrink-0 flex-wrap"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "white" }}
      >
        {Object.entries(SERVICE_COLORS).map(([service, c]) => (
          <div key={service} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c.dot }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "#6b7280" }}>{service}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#dc2626" }}>= Cảnh báo y tế</span>
        </div>
      </div>
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