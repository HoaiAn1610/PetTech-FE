import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PawPrint,
  Scissors,
  Clock,
  CreditCard,
  CalendarDays,
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  Info,
} from "lucide-react";

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Pet",       emoji: "🐾", shortLabel: "Pet"      },
  { id: 2, label: "Service",   emoji: "✂️", shortLabel: "Service"  },
  { id: 3, label: "Date/Time", emoji: "📅", shortLabel: "Date"     },
  { id: 4, label: "Checkout",  emoji: "💳", shortLabel: "Pay"      },
];
const ACTIVE_STEP = 3;

// ─── Calendar helpers ─────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ─── Time slots ───────────────────────────────────────────────────────────────
interface TimeSlot {
  id: string;
  time: string;
  period: string;
  available: boolean;
  popular?: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "t1",  time: "09:00", period: "AM", available: true  },
  { id: "t2",  time: "09:30", period: "AM", available: false },
  { id: "t3",  time: "10:00", period: "AM", available: true,  popular: true },
  { id: "t4",  time: "10:30", period: "AM", available: false },
  { id: "t5",  time: "11:00", period: "AM", available: true  },
  { id: "t6",  time: "11:30", period: "AM", available: false },
  { id: "t7",  time: "12:00", period: "PM", available: false },
  { id: "t8",  time: "12:30", period: "PM", available: true  },
  { id: "t9",  time: "01:00", period: "PM", available: true  },
  { id: "t10", time: "01:30", period: "PM", available: false },
  { id: "t11", time: "02:00", period: "PM", available: true,  popular: true },
  { id: "t12", time: "02:30", period: "PM", available: true  },
  { id: "t13", time: "03:00", period: "PM", available: false },
  { id: "t14", time: "03:30", period: "PM", available: true  },
  { id: "t15", time: "04:00", period: "PM", available: false },
  { id: "t16", time: "04:30", period: "PM", available: true  },
];

// Dates with some unavailability
const UNAVAILABLE_DAYS = new Set([3, 8, 15, 22, 28]);
const FULLY_BOOKED_DAYS = new Set([10, 17, 24]);

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator() {
  return (
    <div className="flex items-center px-4 py-4 bg-white border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      {STEPS.map((step, idx) => {
        const isDone   = step.id < ACTIVE_STEP;
        const isActive = step.id === ACTIVE_STEP;
        const isPending = step.id > ACTIVE_STEP;
        const isLast   = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="relative flex items-center justify-center transition-all duration-300"
                style={{
                  width: isActive ? "32px" : "26px",
                  height: isActive ? "32px" : "26px",
                  borderRadius: "50%",
                  background: isDone
                    ? "#2563EB"
                    : isActive
                    ? "linear-gradient(135deg, #F97316 0%, #ea580c 100%)"
                    : "rgba(0,0,0,0.06)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(249,115,22,0.18), 0 4px 12px rgba(249,115,22,0.4)"
                    : isDone
                    ? "0 2px 8px rgba(37,99,235,0.25)"
                    : "none",
                  border: isPending ? "1.5px solid rgba(0,0,0,0.1)" : "none",
                }}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                ) : isActive ? (
                  <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "white" }}>
                    {step.id}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#cbd5e1" }}>
                    {step.id}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: isActive ? 800 : isDone ? 600 : 500,
                  color: isActive ? "#F97316" : isDone ? "#2563EB" : "#9ca3af",
                  whiteSpace: "nowrap",
                }}
              >
                {step.shortLabel}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className="flex-1 mx-1.5 rounded-full overflow-hidden"
                style={{ height: "2px", background: "rgba(0,0,0,0.07)", marginBottom: "14px" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: isDone ? "100%" : isActive ? "50%" : "0%",
                    background: isDone
                      ? "#2563EB"
                      : "linear-gradient(90deg, #F97316, rgba(249,115,22,0.3))",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Calendar ────────────────────────────────────────────────────────────────
function Calendar({
  year,
  month,
  selected,
  onSelect,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selected: number | null;
  onSelect: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const today = new Date();
  const todayDay   = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear  = today.getFullYear();

  const days        = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const totalCells  = Math.ceil((firstDay + days) / 7) * 7;

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Month nav */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
      >
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "#f8fafc", border: "1.5px solid rgba(0,0,0,0.07)" }}
        >
          <ChevronLeft className="w-4 h-4" style={{ color: "#374151" }} />
        </button>

        <div className="flex flex-col items-center">
          <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
            {MONTHS[month]}
          </span>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af" }}>{year}</span>
        </div>

        <button
          onClick={onNextMonth}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "#f8fafc", border: "1.5px solid rgba(0,0,0,0.07)" }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: "#374151" }} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="flex justify-center">
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                color: d === "Su" || d === "Sa" ? "#f97316" : "#9ca3af",
                letterSpacing: "0.04em",
              }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
        {Array.from({ length: totalCells }).map((_, idx) => {
          const dayNum = idx - firstDay + 1;
          const isValid = dayNum >= 1 && dayNum <= days;

          if (!isValid) {
            return <div key={`empty-${idx}`} />;
          }

          const isPast       = year === todayYear && month === todayMonth && dayNum < todayDay;
          const isToday      = year === todayYear && month === todayMonth && dayNum === todayDay;
          const isSelected   = selected === dayNum;
          const isUnavail    = UNAVAILABLE_DAYS.has(dayNum);
          const isFullyBooked = FULLY_BOOKED_DAYS.has(dayNum);
          const disabled     = isPast || isUnavail || isFullyBooked;
          const isWeekend    = (idx % 7 === 0) || (idx % 7 === 6);

          return (
            <div key={dayNum} className="flex justify-center py-0.5">
              <button
                onClick={() => !disabled && onSelect(dayNum)}
                disabled={disabled}
                className="relative flex items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  width: "34px",
                  height: "34px",
                  background: isSelected
                    ? "linear-gradient(135deg, #F97316, #ea580c)"
                    : isToday
                    ? "rgba(37,99,235,0.08)"
                    : "transparent",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(249,115,22,0.45)"
                    : "none",
                  border: isToday && !isSelected
                    ? "1.5px solid rgba(37,99,235,0.3)"
                    : "none",
                  cursor: disabled ? "not-allowed" : "pointer",
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: isSelected || isToday ? 800 : isWeekend ? 600 : 500,
                    color: isSelected
                      ? "white"
                      : disabled
                      ? "#d1d5db"
                      : isToday
                      ? "#2563EB"
                      : isWeekend
                      ? "#F97316"
                      : "#374151",
                    textDecoration: isFullyBooked ? "line-through" : "none",
                  }}
                >
                  {dayNum}
                </span>

                {/* Today dot */}
                {isToday && !isSelected && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#2563EB" }}
                  />
                )}

                {/* Selected glow ripple */}
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-xl animate-ping"
                    style={{ background: "rgba(249,115,22,0.25)", animationDuration: "1.8s" }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 px-5 py-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.05)", background: "#fafafa" }}
      >
        {[
          { color: "#F97316", label: "Available" },
          { color: "#d1d5db", label: "Unavailable", strike: false },
          { color: "#2563EB", label: "Today", border: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                background: item.border ? "transparent" : item.color,
                border: item.border ? `2px solid ${item.color}` : "none",
              }}
            />
            <span style={{ fontSize: "0.58rem", color: "#9ca3af", fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Time Slot Grid ───────────────────────────────────────────────────────────
function TimeSlotGrid({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: "#F97316" }} />
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#111827" }}>
            Pick a Time
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "#16a34a" }} />
          <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "#9ca3af" }}>
            {TIME_SLOTS.filter((s) => s.available).length} slots open
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        {/* AM section */}
        <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>
          MORNING
        </p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {TIME_SLOTS.filter((s) => s.period === "AM").map((slot) => {
            const isSelected = selected === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => slot.available && onSelect(slot.id)}
                disabled={!slot.available}
                className="relative flex flex-col items-center py-2.5 rounded-2xl transition-all duration-150"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #F97316, #ea580c)"
                    : slot.available
                    ? "#f8fafc"
                    : "rgba(0,0,0,0.03)",
                  border: isSelected
                    ? "1.5px solid rgba(249,115,22,0.5)"
                    : slot.available
                    ? "1.5px solid rgba(0,0,0,0.08)"
                    : "1.5px dashed rgba(0,0,0,0.07)",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(249,115,22,0.4)"
                    : "none",
                  cursor: slot.available ? "pointer" : "not-allowed",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {slot.popular && slot.available && !isSelected && (
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "#2563EB",
                      fontSize: "0.45rem",
                      fontWeight: 800,
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ★ POP
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: isSelected ? "white" : slot.available ? "#111827" : "#d1d5db",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {slot.time}
                </span>
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    color: isSelected ? "rgba(255,255,255,0.75)" : slot.available ? "#9ca3af" : "#e5e7eb",
                  }}
                >
                  {slot.period}
                </span>
                {!slot.available && (
                  <span
                    style={{
                      fontSize: "0.45rem",
                      fontWeight: 700,
                      color: "#e5e7eb",
                      letterSpacing: "0.04em",
                    }}
                  >
                    FULL
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PM section */}
        <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>
          AFTERNOON
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.filter((s) => s.period === "PM").map((slot) => {
            const isSelected = selected === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => slot.available && onSelect(slot.id)}
                disabled={!slot.available}
                className="relative flex flex-col items-center py-2.5 rounded-2xl transition-all duration-150"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #F97316, #ea580c)"
                    : slot.available
                    ? "#f8fafc"
                    : "rgba(0,0,0,0.03)",
                  border: isSelected
                    ? "1.5px solid rgba(249,115,22,0.5)"
                    : slot.available
                    ? "1.5px solid rgba(0,0,0,0.08)"
                    : "1.5px dashed rgba(0,0,0,0.07)",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(249,115,22,0.4)"
                    : "none",
                  cursor: slot.available ? "pointer" : "not-allowed",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {slot.popular && slot.available && !isSelected && (
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "#2563EB",
                      fontSize: "0.45rem",
                      fontWeight: 800,
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ★ POP
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: isSelected ? "white" : slot.available ? "#111827" : "#d1d5db",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {slot.time}
                </span>
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    color: isSelected ? "rgba(255,255,255,0.75)" : slot.available ? "#9ca3af" : "#e5e7eb",
                  }}
                >
                  {slot.period}
                </span>
                {!slot.available && (
                  <span
                    style={{
                      fontSize: "0.45rem",
                      fontWeight: 700,
                      color: "#e5e7eb",
                      letterSpacing: "0.04em",
                    }}
                  >
                    FULL
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Summary Strip ────────────────────────────────────────────────────
function BookingSummaryStrip({
  selectedDate,
  selectedSlot,
  month,
  year,
}: {
  selectedDate: number | null;
  selectedSlot: string | null;
  month: number;
  year: number;
}) {
  const slot = TIME_SLOTS.find((s) => s.id === selectedSlot);
  const hasSelection = selectedDate && selectedSlot;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: hasSelection
          ? "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(234,88,12,0.04))"
          : "#f8fafc",
        border: hasSelection
          ? "1.5px solid rgba(249,115,22,0.2)"
          : "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: hasSelection ? "0 4px 16px rgba(249,115,22,0.08)" : "none",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Left: date + service */}
        <div
          className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
          style={{
            background: hasSelection
              ? "linear-gradient(135deg, #F97316, #ea580c)"
              : "rgba(0,0,0,0.06)",
            boxShadow: hasSelection ? "0 4px 10px rgba(249,115,22,0.35)" : "none",
          }}
        >
          {hasSelection ? (
            <>
              <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "rgba(255,255,255,0.8)", lineHeight: 1 }}>
                {MONTHS[month].slice(0, 3).toUpperCase()}
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
                {selectedDate}
              </span>
            </>
          ) : (
            <CalendarDays className="w-4 h-4" style={{ color: "#9ca3af" }} />
          )}
        </div>

        {/* Middle: text */}
        <div className="flex-1 min-w-0">
          {hasSelection ? (
            <>
              <p style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                {MONTHS[month]} {selectedDate}, {year}
              </p>
              <p style={{ fontSize: "0.68rem", color: "#F97316", fontWeight: 700, margin: 0 }}>
                {slot?.time} {slot?.period} · Full Groom · ~90 min
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", margin: 0 }}>
                No date & time selected
              </p>
              <p style={{ fontSize: "0.65rem", color: "#cbd5e1", margin: 0 }}>
                Pick a date and time slot above
              </p>
            </>
          )}
        </div>

        {/* Right: service info */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <Scissors className="w-2.5 h-2.5" style={{ color: "#7c3aed" }} />
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: "#7c3aed" }}>Full Groom</span>
          </div>
          <div className="flex items-center gap-1">
            <PawPrint className="w-2.5 h-2.5" style={{ color: "#9ca3af" }} />
            <span style={{ fontSize: "0.58rem", color: "#9ca3af", fontWeight: 600 }}>Bella</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export function BookingWizardScreen() {
  const today = new Date();
  const [year, setYear]             = useState(today.getFullYear());
  const [month, setMonth]           = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [btnPressed, setBtnPressed]     = useState(false);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  const canContinue = selectedDate !== null && selectedSlot !== null;

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "Inter, sans-serif", background: "#f8f6ff" }}
    >
      {/* Step indicator */}
      <StepIndicator />

      {/* Scrollable body */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}
      >
        <div className="flex flex-col gap-4 px-4 pt-4 pb-32">

          {/* Section heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em", margin: 0 }}>
                Choose Date & Time 📅
              </h2>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>
                Full Groom for <span style={{ fontWeight: 700, color: "#F97316" }}>Bella</span> · Paws & Claws Clinic
              </p>
            </div>
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
              style={{ background: "rgba(37,99,235,0.07)" }}
            >
              <MapPin className="w-3 h-3" style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#2563EB" }}>0.8 mi</span>
            </div>
          </div>

          {/* Booking summary strip (appears when selection is made) */}
          <BookingSummaryStrip
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            month={month}
            year={year}
          />

          {/* Calendar */}
          <Calendar
            year={year}
            month={month}
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d);
              setSelectedSlot(null);
            }}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />

          {/* Time slots — only show if date is selected */}
          {selectedDate ? (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#F97316" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#374151", letterSpacing: "0.04em" }}>
                  AVAILABLE TIMES · {MONTHS[month].slice(0, 3)} {selectedDate}
                </span>
              </div>
              <TimeSlotGrid selected={selectedSlot} onSelect={setSelectedSlot} />
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-8 rounded-3xl"
              style={{
                background: "white",
                border: "1.5px dashed rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ fontSize: "2rem", marginBottom: "8px" }}>👆</span>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af" }}>
                Select a date to see available times
              </p>
            </div>
          )}

          {/* Info row */}
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl"
            style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.1)" }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
            <p style={{ fontSize: "0.66rem", color: "#374151", lineHeight: 1.5 }}>
              Appointments can be cancelled or rescheduled up to <strong>2 hours before</strong> the booking time, free of charge.
            </p>
          </div>

          {/* Groomer preview */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "white",
              border: "1.5px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: "2px solid rgba(37,99,235,0.15)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1683126257862-cbe1540e77c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                alt="Mia Rodriguez"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                Mia Rodriguez
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-2.5 h-2.5" style={{ color: "#f59e0b", fill: i < 5 ? "#f59e0b" : "none" }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>4.9 · Your groomer</span>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-xl"
              style={{ background: "rgba(22,163,74,0.08)", fontSize: "0.6rem", fontWeight: 700, color: "#16a34a", border: "1px solid rgba(22,163,74,0.15)" }}
            >
              Available
            </span>
          </div>
        </div>
      </div>

      {/* ── Pinned CTA ── */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-4"
        style={{
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.07)",
        }}
      >
        {/* Price preview */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-baseline gap-1">
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>$65</span>
            <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>· Full Groom</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Free cancellation</span>
            <CheckCircle2 className="w-3 h-3" style={{ color: "#16a34a" }} />
          </div>
        </div>

        {/* CTA button */}
        <button
          onPointerDown={() => setBtnPressed(true)}
          onPointerUp={() => setBtnPressed(false)}
          onPointerLeave={() => setBtnPressed(false)}
          disabled={!canContinue}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl transition-all duration-150"
          style={{
            height: "54px",
            background: canContinue
              ? btnPressed
                ? "#1d4ed8"
                : "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)"
              : "rgba(0,0,0,0.08)",
            boxShadow: canContinue && !btnPressed
              ? "0 8px 24px rgba(37,99,235,0.4), 0 2px 8px rgba(37,99,235,0.2)"
              : "none",
            transform: btnPressed ? "scale(0.98)" : "scale(1)",
            cursor: canContinue ? "pointer" : "not-allowed",
          }}
        >
          <CreditCard
            className="w-5 h-5"
            style={{ color: canContinue ? "white" : "#9ca3af" }}
            strokeWidth={2.5}
          />
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 800,
              color: canContinue ? "white" : "#9ca3af",
              letterSpacing: "-0.01em",
            }}
          >
            {canContinue ? "Continue to Payment" : "Select Date & Time"}
          </span>
          {canContinue && (
            <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}
