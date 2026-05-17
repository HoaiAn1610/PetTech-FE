import { useState, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Scissors,
  Stethoscope,
  Syringe,
  Wind,
  CheckCircle2,
  GripVertical,
  Timer,
  Star,
  ChevronDown,
  Zap,
  PawPrint,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type ColumnId = "waiting" | "bathing" | "drying" | "completed";

interface TaskCard {
  id: string;
  petName: string;
  breed: string;
  ownerName: string;
  service: string;
  serviceIcon: string;
  serviceColor: string;
  avatarColor: string[]; // gradient stops
  status: string;
  statusColor: string;
  statusBg: string;
  priority: "normal" | "urgent" | "vip";
  assignedTo: string;
  assignedRole: "groomer" | "vet";
  scheduledTime: string;
  elapsedMin: number | null;
  notes?: string;
  column: ColumnId;
  weight?: string;
  age?: string;
}

// ── Column config ──────────────────────────────────────────────────────────────
const COLUMNS: {
  id: ColumnId;
  label: string;
  emoji: string;
  accent: string;
  accentLight: string;
  accentBg: string;
  description: string;
}[] = [
  {
    id: "waiting",
    label: "Chờ đợi",
    emoji: "⏳",
    accent: "#d97706",
    accentLight: "#fbbf24",
    accentBg: "rgba(217,119,6,0.07)",
    description: "Đã check-in, đang chờ dịch vụ",
  },
  {
    id: "bathing",
    label: "Tắm / Khám",
    emoji: "🛁",
    accent: "#2563EB",
    accentLight: "#60a5fa",
    accentBg: "rgba(37,99,235,0.07)",
    description: "Đang được điều trị",
  },
  {
    id: "drying",
    label: "Sấy / Theo dõi",
    emoji: "🌬️",
    accent: "#7c3aed",
    accentLight: "#a78bfa",
    accentBg: "rgba(124,58,237,0.07)",
    description: "Sau điều trị, đang quan sát",
  },
  {
    id: "completed",
    label: "Hoàn thành",
    emoji: "✅",
    accent: "#16a34a",
    accentLight: "#4ade80",
    accentBg: "rgba(22,163,74,0.07)",
    description: "Sẵn sàng ra về",
  },
];

// ── Initial card data ──────────────────────────────────────────────────────────
const INITIAL_CARDS: TaskCard[] = [
  // WAITING
  {
    id: "c1", petName: "Bella", breed: "Golden Retriever", ownerName: "Jessica Park",
    service: "Tắm chải toàn bộ", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#f59e0b", "#d97706"],
    status: "Đã check-in", statusColor: "#d97706", statusBg: "rgba(217,119,6,0.1)",
    priority: "urgent", assignedTo: "Sam W.", assignedRole: "groomer",
    scheduledTime: "09:00 SA", elapsedMin: null, age: "3 tuổi", weight: "29 kg",
    notes: "⚠️ Dị ứng thịt bò — kiểm tra bánh thưởng",
    column: "waiting",
  },
  {
    id: "c2", petName: "Oscar", breed: "Mèo Xiêm", ownerName: "Brian Lee",
    service: "Tiêm vaccine", serviceIcon: "💉", serviceColor: "#16a34a",
    avatarColor: ["#6366f1", "#4f46e5"],
    status: "Đã check-in", statusColor: "#d97706", statusBg: "rgba(217,119,6,0.1)",
    priority: "normal", assignedTo: "BS. Kim", assignedRole: "vet",
    scheduledTime: "09:30 SA", elapsedMin: null, age: "2 tuổi", weight: "4.5 kg",
    column: "waiting",
  },
  {
    id: "c3", petName: "Nala", breed: "Mèo Ragdoll", ownerName: "Priya Mehta",
    service: "Vệ sinh răng miệng", serviceIcon: "🦷", serviceColor: "#0891b2",
    avatarColor: ["#ec4899", "#db2777"],
    status: "Đã check-in", statusColor: "#d97706", statusBg: "rgba(217,119,6,0.1)",
    priority: "vip", assignedTo: "BS. Park", assignedRole: "vet",
    scheduledTime: "10:00 SA", elapsedMin: null, age: "4 tuổi", weight: "6.2 kg",
    column: "waiting",
  },
  {
    id: "c4", petName: "Rex", breed: "Chó Becgie", ownerName: "Carlos M.",
    service: "Khám tổng quát", serviceIcon: "🩺", serviceColor: "#2563EB",
    avatarColor: ["#14b8a6", "#0d9488"],
    status: "Đã check-in", statusColor: "#d97706", statusBg: "rgba(217,119,6,0.1)",
    priority: "normal", assignedTo: "BS. Torres", assignedRole: "vet",
    scheduledTime: "10:30 SA", elapsedMin: null, age: "5 tuổi", weight: "34 kg",
    column: "waiting",
  },

  // BATHING / EXAM
  {
    id: "c5", petName: "Max", breed: "Chó Poodle", ownerName: "David Kim",
    service: "Tắm & Tỉa lông", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#3b82f6", "#2563EB"],
    status: "Đang thực hiện", statusColor: "#2563EB", statusBg: "rgba(37,99,235,0.1)",
    priority: "normal", assignedTo: "Sam W.", assignedRole: "groomer",
    scheduledTime: "08:30 SA", elapsedMin: 42, age: "6 tuổi", weight: "8 kg",
    column: "bathing",
  },
  {
    id: "c6", petName: "Coco", breed: "Shih Tzu", ownerName: "Linda Chen",
    service: "Tắm chải toàn bộ", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#f97316", "#ea580c"],
    status: "Đang thực hiện", statusColor: "#2563EB", statusBg: "rgba(37,99,235,0.1)",
    priority: "vip", assignedTo: "Mia R.", assignedRole: "groomer",
    scheduledTime: "09:00 SA", elapsedMin: 28, age: "4 tuổi", weight: "5.5 kg",
    notes: "Khách yêu cầu tạo kiểu nơ",
    column: "bathing",
  },
  {
    id: "c7", petName: "Daisy", breed: "Beagle", ownerName: "Tom Brown",
    service: "X-Quang", serviceIcon: "📷", serviceColor: "#d97706",
    avatarColor: ["#22c55e", "#16a34a"],
    status: "Đang khám", statusColor: "#0891b2", statusBg: "rgba(8,145,178,0.1)",
    priority: "urgent", assignedTo: "BS. Kim", assignedRole: "vet",
    scheduledTime: "09:15 SA", elapsedMin: 18, age: "7 tuổi", weight: "11 kg",
    notes: "Đi khập khiễng chân phải từ thứ Hai",
    column: "bathing",
  },

  // DRYING / MONITORING
  {
    id: "c8", petName: "Milo", breed: "Maltese", ownerName: "Sue Wang",
    service: "Tắm & Tỉa lông", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#a78bfa", "#7c3aed"],
    status: "Đang sấy", statusColor: "#7c3aed", statusBg: "rgba(124,58,237,0.1)",
    priority: "normal", assignedTo: "Mia R.", assignedRole: "groomer",
    scheduledTime: "08:00 SA", elapsedMin: 75, age: "3 tuổi", weight: "3.2 kg",
    column: "drying",
  },
  {
    id: "c9", petName: "Luna", breed: "Mèo Ba Tư", ownerName: "Maria S.",
    service: "Theo dõi hậu phẫu", serviceIcon: "🔬", serviceColor: "#e11d48",
    avatarColor: ["#f43f5e", "#e11d48"],
    status: "Theo dõi", statusColor: "#7c3aed", statusBg: "rgba(124,58,237,0.1)",
    priority: "urgent", assignedTo: "BS. Torres", assignedRole: "vet",
    scheduledTime: "07:30 SA", elapsedMin: 110, age: "5 tuổi", weight: "4.8 kg",
    notes: "Hồi phục sau triệt sản — kiểm tra sinh hiệu mỗi 30 phút",
    column: "drying",
  },
  {
    id: "c10", petName: "Buddy", breed: "Labrador", ownerName: "Nick T.",
    service: "Chải lông rụng", serviceIcon: "🪮", serviceColor: "#F97316",
    avatarColor: ["#fb923c", "#F97316"],
    status: "Làm mát", statusColor: "#7c3aed", statusBg: "rgba(124,58,237,0.1)",
    priority: "normal", assignedTo: "Sam W.", assignedRole: "groomer",
    scheduledTime: "08:15 SA", elapsedMin: 58, age: "4 tuổi", weight: "32 kg",
    column: "drying",
  },

  // COMPLETED
  {
    id: "c11", petName: "Charlie", breed: "Cocker Spaniel", ownerName: "Emma D.",
    service: "Tắm chải toàn bộ", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#10b981", "#059669"],
    status: "Sẵn sàng ✓", statusColor: "#16a34a", statusBg: "rgba(22,163,74,0.1)",
    priority: "normal", assignedTo: "Mia R.", assignedRole: "groomer",
    scheduledTime: "07:00 SA", elapsedMin: 90, age: "2 tuổi", weight: "12 kg",
    column: "completed",
  },
  {
    id: "c12", petName: "Simba", breed: "Maine Coon", ownerName: "Greg C.",
    service: "Tiêm vaccine", serviceIcon: "💉", serviceColor: "#16a34a",
    avatarColor: ["#fbbf24", "#f59e0b"],
    status: "Sẵn sàng ✓", statusColor: "#16a34a", statusBg: "rgba(22,163,74,0.1)",
    priority: "vip", assignedTo: "BS. Kim", assignedRole: "vet",
    scheduledTime: "08:00 SA", elapsedMin: 15, age: "1 tuổi", weight: "7 kg",
    column: "completed",
  },
  {
    id: "c13", petName: "Pip", breed: "Chihuahua", ownerName: "Hannah L.",
    service: "Cắt móng", serviceIcon: "✂️", serviceColor: "#7c3aed",
    avatarColor: ["#67e8f9", "#0891b2"],
    status: "Sẵn sàng ✓", statusColor: "#16a34a", statusBg: "rgba(22,163,74,0.1)",
    priority: "normal", assignedTo: "Sam W.", assignedRole: "groomer",
    scheduledTime: "08:30 SA", elapsedMin: 20, age: "6 tuổi", weight: "2.1 kg",
    column: "completed",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const ITEM_TYPE = "TASK_CARD";

function formatElapsed(min: number): string {
  if (min < 60) return `${min}m`;
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

function PriorityBadge({ priority }: { priority: TaskCard["priority"] }) {
  if (priority === "normal") return null;
  if (priority === "urgent")
    return (
      <span
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
        style={{ background: "rgba(220,38,38,0.1)", fontSize: "0.6rem", fontWeight: 800, color: "#dc2626", letterSpacing: "0.04em" }}
      >
        <AlertTriangle className="w-2.5 h-2.5" />
        URGENT
      </span>
    );
  return (
    <span
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
      style={{ background: "rgba(217,119,6,0.12)", fontSize: "0.6rem", fontWeight: 800, color: "#b45309", letterSpacing: "0.04em" }}
    >
      <Star className="w-2.5 h-2.5" />
      VIP
    </span>
  );
}

function RoleIcon({ role }: { role: "groomer" | "vet" }) {
  return role === "groomer"
    ? <Scissors className="w-3 h-3" />
    : <Stethoscope className="w-3 h-3" />;
}

// ── Draggable Card ─────────────────────────────────────────────────────────────
function Card({ card, onMove }: { card: TaskCard; onMove: (id: string, col: ColumnId) => void }) {
  const col = COLUMNS.find((c) => c.id === card.column)!;
  const [expanded, setExpanded] = useState(false);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: card.id },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      ref={dragPreview as unknown as React.Ref<HTMLDivElement>}
      className="rounded-2xl overflow-hidden transition-all duration-200 select-none group"
      style={{
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: isDragging
          ? `0 20px 50px rgba(0,0,0,0.22), 0 0 0 2px ${col.accent}`
          : "0 2px 8px rgba(0,0,0,0.06)",
        opacity: isDragging ? 0.45 : 1,
        transform: isDragging ? "scale(1.03) rotate(1deg)" : "scale(1)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${col.accent}, ${col.accentLight})` }} />

      <div className="p-3.5">
        {/* Header row: avatar + name + drag handle */}
        <div className="flex items-start gap-3 mb-3">
          {/* Drag handle */}
          <div
            ref={drag as unknown as React.Ref<HTMLDivElement>}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm relative"
            style={{
              background: `linear-gradient(135deg, ${card.avatarColor[0]} 0%, ${card.avatarColor[1]} 100%)`,
              border: "2.5px solid white",
              boxShadow: `0 0 0 2px ${card.avatarColor[1]}40`,
            }}
          >
            <span className="text-white" style={{ fontSize: "1rem", fontWeight: 800 }}>
              {card.petName[0]}
            </span>
            {/* Role indicator dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2"
              style={{
                background: card.assignedRole === "vet" ? "#2563EB" : "#7c3aed",
                borderColor: "white",
              }}
            >
              {card.assignedRole === "vet"
                ? <Stethoscope className="w-2 h-2 text-white" />
                : <Scissors className="w-2 h-2 text-white" />
              }
            </span>
          </div>

          {/* Name + breed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-900" style={{ fontSize: "0.9rem", fontWeight: 800 }}>
                {card.petName}
              </span>
              <PriorityBadge priority={card.priority} />
            </div>
            <p className="truncate" style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
              {card.breed} · {card.ownerName}
            </p>
          </div>

          {/* More menu */}
          <button className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 flex-shrink-0">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Service chip */}
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{
              background: `${card.serviceColor}10`,
              border: `1px solid ${card.serviceColor}25`,
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{card.serviceIcon}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: card.serviceColor }}>
              {card.service}
            </span>
          </span>
        </div>

        {/* Meta row: time + elapsed */}
        <div className="flex items-center gap-3 mb-2.5">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" style={{ color: "#9ca3af" }} />
            <span style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 500 }}>
              {card.scheduledTime}
            </span>
          </div>
          {card.elapsedMin !== null && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{
                background: card.elapsedMin > 60 ? "rgba(220,38,38,0.08)" : "rgba(37,99,235,0.07)",
              }}
            >
              <Timer className="w-2.5 h-2.5" style={{ color: card.elapsedMin > 60 ? "#dc2626" : "#2563EB" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: card.elapsedMin > 60 ? "#dc2626" : "#2563EB" }}>
                {formatElapsed(card.elapsedMin)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            {card.age && <span style={{ fontSize: "0.65rem", color: "#d1d5db" }}>{card.age}</span>}
            {card.weight && <span style={{ fontSize: "0.65rem", color: "#d1d5db" }}>· {card.weight}</span>}
          </div>
        </div>

        {/* Status tag + assigned */}
        <div className="flex items-center justify-between">
          <span
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: card.statusBg,
              fontSize: "0.68rem",
              fontWeight: 700,
              color: card.statusColor,
              letterSpacing: "0.03em",
            }}
          >
            {card.status}
          </span>

          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <RoleIcon role={card.assignedRole} />
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#374151" }}>
              {card.assignedTo}
            </span>
          </div>
        </div>

        {/* Notes (expandable) */}
        {card.notes && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2.5 w-full"
              style={{ fontSize: "0.68rem", color: "#9ca3af" }}
            >
              <ChevronDown
                className="w-3 h-3 transition-transform duration-200"
                style={{ transform: expanded ? "rotate(180deg)" : "none" }}
              />
              {expanded ? "Ẩn ghi chú" : "Xem ghi chú"}
            </button>
            {expanded && (
              <div
                className="mt-1.5 px-2.5 py-2 rounded-lg"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <p style={{ fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.5 }}>
                  {card.notes}
                </p>
              </div>
            )}
          </>
        )}

        {/* Quick-move buttons (visible on hover) */}
        <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {COLUMNS.filter((c) => c.id !== card.column).map((c) => (
            <button
              key={c.id}
              onClick={() => onMove(card.id, c.id)}
              className="flex-1 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                background: c.accentBg,
                border: `1px solid ${c.accent}30`,
                fontSize: "0.6rem",
                fontWeight: 700,
                color: c.accent,
              }}
              title={`Move to ${c.label}`}
            >
              → {c.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Drop Column ────────────────────────────────────────────────────────────────
function Column({
  col,
  cards,
  onDrop,
  onMove,
}: {
  col: (typeof COLUMNS)[0];
  cards: TaskCard[];
  onDrop: (id: string, colId: ColumnId) => void;
  onMove: (id: string, col: ColumnId) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, col.id),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="flex flex-col rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-200"
      style={{
        width: "280px",
        background: isOver && canDrop ? col.accentBg : "#f1f5f9",
        border: `1.5px solid ${isOver && canDrop ? col.accent : "rgba(0,0,0,0.07)"}`,
        boxShadow: isOver && canDrop
          ? `0 0 0 3px ${col.accent}22, inset 0 0 32px ${col.accent}09`
          : "none",
        minHeight: "200px",
      }}
    >
      {/* Column header */}
      <div
        className="px-4 py-3.5 flex-shrink-0"
        style={{ borderBottom: `2px solid ${col.accent}20` }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: col.accent, boxShadow: `0 0 6px ${col.accent}80` }}
            />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {col.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: col.accent, fontSize: "0.72rem", fontWeight: 800, color: "white" }}
            >
              {cards.length}
            </span>
          </div>
        </div>
        <p style={{ fontSize: "0.65rem", color: "#9ca3af", paddingLeft: "1rem" }}>
          {col.description}
        </p>

        {/* Drop zone indicator strip */}
        {isOver && canDrop && (
          <div
            className="mt-2 py-1.5 rounded-xl flex items-center justify-center gap-1.5"
            style={{ background: col.accentBg, border: `1.5px dashed ${col.accent}` }}
          >
            <Zap className="w-3 h-3" style={{ color: col.accent }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: col.accent }}>
              Drop here
            </span>
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="flex flex-col gap-2.5 p-3 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {cards.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl"
            style={{ border: `1.5px dashed ${col.accent}30` }}
          >
            <span style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{col.emoji}</span>
            <span style={{ fontSize: "0.72rem", color: "#cbd5e1", fontWeight: 500 }}>
              Chưa có bệnh nhân
            </span>
          </div>
        )}
        {cards.map((card) => (
          <Card key={card.id} card={card} onMove={onMove} />
        ))}
      </div>
    </div>
  );
}

// ── Board inner ────────────────────────────────────────────────────────────────
function BoardInner() {
  const [cards, setCards] = useState<TaskCard[]>(INITIAL_CARDS);
  const [roleFilter, setRoleFilter] = useState<"all" | "groomer" | "vet">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "urgent" | "vip">("all");

  const handleDrop = useCallback((id: string, colId: ColumnId) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, column: colId } : c));
  }, []);

  const handleMove = useCallback((id: string, colId: ColumnId) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, column: colId } : c));
  }, []);

  const filtered = cards.filter((c) => {
    if (roleFilter !== "all" && c.assignedRole !== roleFilter) return false;
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
    return true;
  });

  const urgentCount = cards.filter((c) => c.priority === "urgent").length;
  const completedCount = cards.filter((c) => c.column === "completed").length;

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "Inter, sans-serif", background: "#f4f6fb" }}
    >
      {/* ── Sub-toolbar ── */}
      <div
        className="px-5 py-3 flex items-center gap-3 flex-shrink-0 border-b"
        style={{ background: "white", borderColor: "rgba(0,0,0,0.07)" }}
      >
        {/* Summary pills */}
        <div className="flex items-center gap-2 mr-2">
          {[
            { label: `${cards.length} Tổng`, color: "#2563EB", bg: "rgba(37,99,235,0.07)" },
            { label: `${urgentCount} Khẩn cấp`, color: "#dc2626", bg: "rgba(220,38,38,0.07)" },
            { label: `${completedCount} Xong`, color: "#16a34a", bg: "rgba(22,163,74,0.07)" },
          ].map((p) => (
            <span
              key={p.label}
              className="px-2.5 py-1 rounded-lg"
              style={{ background: p.bg, fontSize: "0.72rem", fontWeight: 700, color: p.color }}
            >
              {p.label}
            </span>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Role filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#f3f4f6" }}>
          {(["all", "groomer", "vet"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background: roleFilter === r ? "white" : "transparent",
                fontSize: "0.75rem",
                fontWeight: roleFilter === r ? 700 : 500,
                color: roleFilter === r ? "#111827" : "#9ca3af",
                boxShadow: roleFilter === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {r === "all" ? <PawPrint className="w-3 h-3" /> : r === "groomer" ? <Scissors className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
              {r === "all" ? "Tất cả" : r === "groomer" ? "Nhân viên tắm" : "Bác sĩ"}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#f3f4f6" }}>
          {(["all", "urgent", "vip"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className="px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                background: priorityFilter === p ? "white" : "transparent",
                fontSize: "0.75rem",
                fontWeight: priorityFilter === p ? 700 : 500,
                color: priorityFilter === p
                  ? p === "urgent" ? "#dc2626" : p === "vip" ? "#b45309" : "#111827"
                  : "#9ca3af",
                boxShadow: priorityFilter === p ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {p === "all" ? "Tất cả" : p === "urgent" ? "⚠ Khẩn cấp" : "★ VIP"}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Staff avatars */}
          <div className="flex items-center -space-x-2">
            {[
              { name: "SW", color: "#7c3aed" },
              { name: "MR", color: "#2563EB" },
              { name: "DK", color: "#16a34a" },
              { name: "DP", color: "#d97706" },
              { name: "DT", color: "#0891b2" },
            ].map((s) => (
              <div
                key={s.name}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                style={{ background: s.color, fontSize: "0.65rem", fontWeight: 700, color: "white" }}
                title={s.name}
              >
                {s.name}
              </div>
            ))}
          </div>
          <span style={{ fontSize: "0.72rem", color: "#9ca3af", marginLeft: "6px" }}>5 on duty</span>
        </div>
      </div>

      {/* ── Board (horizontal scroll) ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-5 h-full" style={{ minWidth: "max-content" }}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              cards={filtered.filter((c) => c.column === col.id)}
              onDrop={handleDrop}
              onMove={handleMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Public export ──────────────────────────────────────────────────────────────
export function KanbanBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardInner />
    </DndProvider>
  );
}