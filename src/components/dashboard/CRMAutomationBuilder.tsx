import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Trash2,
  ChevronDown,
  Zap,
  Users,
  Mail,
  MessageSquare,
  Gift,
  Bell,
  Tag,
  ArrowRight,
  Play,
  Pause,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  UserPlus,
  CalendarX,
  X,
  Filter,
} from "lucide-react";

// ── Types & data ──────────────────────────────────────────────────────────────
type ConditionKey =
  | "visit_7d"
  | "no_appt_30d"
  | "vaccine_due_14d"
  | "invoice_unpaid"
  | "birthday_month"
  | "inactive_90d"
  | "new_registration"
  | "high_value_client";

type ActionKey =
  | "send_sms"
  | "send_email"
  | "whatsapp_msg"
  | "add_loyalty"
  | "notify_staff"
  | "apply_discount"
  | "create_task";

const CONDITIONS: { value: ConditionKey; label: string; icon: string }[] = [
  { value: "visit_7d",         label: "Đã khám trong 7+ ngày qua",      icon: "📅" },
  { value: "no_appt_30d",      label: "Không có lịch hẹn trong 30 ngày", icon: "🚫" },
  { value: "vaccine_due_14d",  label: "Vaccine đến hạn trong ≤ 14 ngày", icon: "💉" },
  { value: "invoice_unpaid",   label: "Hoá đơn chưa thanh toán > 3 ngày",icon: "💰" },
  { value: "birthday_month",   label: "Sinh nhật thú cưng tháng này",    icon: "🎂" },
  { value: "inactive_90d",     label: "Không hoạt động 90+ ngày",        icon: "😴" },
  { value: "new_registration", label: "Đăng ký trong 7 ngày qua",        icon: "🐾" },
  { value: "high_value_client","label": "Chi tiêu trọn đời > $500",      icon: "⭐" },
];

const ACTIONS: { value: ActionKey; label: string; icon: React.ElementType; color: string }[] = [
  { value: "send_sms",      label: "Gửi SMS nhắc nhở",          icon: MessageSquare, color: "#2563EB" },
  { value: "send_email",    label: "Gửi chiến dịch email",       icon: Mail,          color: "#0891b2" },
  { value: "whatsapp_msg",  label: "Gửi tin nhắn WhatsApp",      icon: MessageSquare, color: "#16a34a" },
  { value: "add_loyalty",   label: "Thêm điểm tích lũy",         icon: Gift,          color: "#7c3aed" },
  { value: "notify_staff",  label: "Thông báo nhân viên",         icon: Bell,          color: "#F97316" },
  { value: "apply_discount","label": "Áp dụng ưu đãi giảm giá", icon: Tag,           color: "#dc2626" },
  { value: "create_task",   label: "Tạo nhiệm vụ theo dõi",      icon: CheckCircle2,  color: "#d97706" },
];

interface AutomationRule {
  id: string;
  condition: ConditionKey;
  action: ActionKey;
  active: boolean;
  sent: number;
  opened: number;
  converted: number;
}

const INITIAL_RULES: AutomationRule[] = [
  { id: "r1", condition: "visit_7d",        action: "send_sms",     active: true,  sent: 342, opened: 289, converted: 114 },
  { id: "r2", condition: "vaccine_due_14d", action: "send_email",   active: true,  sent: 218, opened: 176, converted: 97  },
  { id: "r3", condition: "birthday_month",  action: "add_loyalty",  active: true,  sent: 93,  opened: 88,  converted: 61  },
  { id: "r4", condition: "inactive_90d",    action: "apply_discount",active: false, sent: 157, opened: 82,  converted: 31  },
];

// ── Segment data ──────────────────────────────────────────────────────────────
const segments = [
  {
    id: "seg1",
    icon: Clock,
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
    name: "Theo dõi sau khám",
    description: "Đã khám trong 7 ngày qua, chưa có lịch hẹn tiếp theo",
    count: 187,
    trend: +14,
    openRate: 82,
    status: "active" as const,
    lastTriggered: "2 phút trước",
    automations: 1,
  },
  {
    id: "seg2",
    icon: AlertTriangle,
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    name: "Vaccine quá hạn",
    description: "Thú cưng có vaccine quá hạn hoặc sắp đến hạn",
    count: 342,
    trend: +28,
    openRate: 79,
    status: "active" as const,
    lastTriggered: "47 phút trước",
    automations: 1,
  },
  {
    id: "seg3",
    icon: Star,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    name: "Khách hàng giá trị cao",
    description: "Chi tiêu trọn đời > $500 · Hạng VIP",
    count: 94,
    trend: +5,
    openRate: 91,
    status: "active" as const,
    lastTriggered: "3 giờ trước",
    automations: 2,
  },
  {
    id: "seg4",
    icon: CalendarX,
    color: "#dc2626",
    bg: "rgba(220,38,38,0.07)",
    name: "Không hoạt động 90+ ngày",
    description: "Không khám hoặc liên lạc trong hơn 90 ngày",
    count: 231,
    trend: -8,
    openRate: 52,
    status: "paused" as const,
    lastTriggered: "Hôm qua",
    automations: 1,
  },
  {
    id: "seg5",
    icon: UserPlus,
    color: "#0891b2",
    bg: "rgba(8,145,178,0.08)",
    name: "Đăng ký mới",
    description: "Đăng ký trong 7 ngày qua — luồng onboarding",
    count: 28,
    trend: +100,
    openRate: 96,
    status: "active" as const,
    lastTriggered: "Vừa xong",
    automations: 2,
  },
];

// ── New Segment Modal ────────────────────────────────────────────────────────
function NewSegmentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("visit_7d");
  const [done, setDone] = useState(false);

  const condOpts = [
    { value: "visit_7d",          label: "Đã khám trong 7+ ngày qua"        },
    { value: "no_appt_30d",       label: "Không có lịch hẹn trong 30 ngày"  },
    { value: "vaccine_due_14d",   label: "Vaccine đến hạn trong ≤ 14 ngày"  },
    { value: "invoice_unpaid",    label: "Hoá đơn chưa thanh toán > 3 ngày" },
    { value: "birthday_month",    label: "Sinh nhật thú cưng tháng này"      },
    { value: "inactive_90d",      label: "Không hoạt động 90+ ngày"          },
    { value: "new_registration",  label: "Đăng ký trong 7 ngày qua"          },
    { value: "high_value_client", label: "Chi tiêu trọn đời > $500"          },
  ];

  if (done) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 flex flex-col items-center gap-4 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đã tạo phân khúc!</h2>
        <p style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>
          "<strong>{name}</strong>" đã hoạt động và tự động cập nhật.
        </p>
        <button onClick={onClose} className="px-8 py-3 rounded-xl w-full"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.85rem", fontWeight: 700 }}>
          Xong
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Phân khúc khách hàng mới</h2>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>Danh sách thông minh · tự động cập nhật thời gian thực</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>TÊN PHÂN KHÚC</p>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="VD: Nhắc nhở trước lịch hẹn"
              className="w-full px-4 py-2.5 rounded-xl outline-none"
              style={{ fontSize: "0.85rem", color: "#374151", background: "#f9fafb", border: "1.5px solid #e5e7eb", fontFamily: "Inter, sans-serif" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>ĐIỀU KIỆN LỌC</p>
            <select value={condition} onChange={e => setCondition(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl outline-none appearance-none"
              style={{ fontSize: "0.85rem", color: "#374151", background: "#f9fafb", border: "1.5px solid #e5e7eb", fontFamily: "Inter, sans-serif" }}>
              {condOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)" }}>
            <Filter className="w-4 h-4 flex-shrink-0" style={{ color: "#2563EB" }} />
            <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.5 }}>
              Phân khúc này sẽ tự động cập nhật dựa trên dữ liệu bệnh nhân thời gian thực.
            </p>
          </div>
          <button disabled={!name.trim()}
            onClick={() => { onAdd(name); setDone(true); }}
            className="w-full py-3.5 rounded-xl mt-1"
            style={{ background: name.trim() ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb", color: name.trim() ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.88rem", boxShadow: name.trim() ? "0 4px 14px rgba(37,99,235,0.3)" : "none" }}>
            Tạo phân khúc
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────
function StyledSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  accentColor = "#2563EB",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: string; iconEl?: React.ElementType; iconColor?: string }[];
  placeholder?: string;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-150 hover:shadow-sm w-full"
        style={{
          background: "white",
          border: `1.5px solid ${open ? accentColor : "rgba(0,0,0,0.1)"}`,
          fontSize: "0.83rem",
          fontWeight: 500,
          color: selected ? "#111827" : "#9ca3af",
          minWidth: "220px",
          boxShadow: open ? `0 0 0 3px ${accentColor}18` : "none",
        }}
      >
        {selected?.icon && <span>{selected.icon}</span>}
        {selected?.iconEl && (() => { const I = selected.iconEl!; return <I className="w-4 h-4" style={{ color: selected.iconColor }} />; })()}
        <span className="flex-1 text-left truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ color: "#9ca3af", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 rounded-xl z-20 overflow-hidden"
          style={{
            minWidth: "100%",
            background: "white",
            border: "1.5px solid rgba(0,0,0,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const IconEl = opt.iconEl;
            return (
              <button
                key={opt.value}
                className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left transition-colors hover:bg-blue-50"
                style={{
                  background: isSelected ? "rgba(37,99,235,0.06)" : "transparent",
                  fontSize: "0.83rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "#2563EB" : "#374151",
                }}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.icon && <span>{opt.icon}</span>}
                {IconEl && <IconEl className="w-4 h-4 flex-shrink-0" style={{ color: opt.iconColor }} />}
                {opt.label}
                {isSelected && <CheckCircle2 className="ml-auto w-4 h-4" style={{ color: "#2563EB" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RuleRow({ rule, onToggle, onDelete, onUpdate }: {
  rule: AutomationRule;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<AutomationRule>) => void;
}) {
  const condOpts = CONDITIONS.map((c) => ({ value: c.value, label: c.label, icon: c.icon }));
  const actOpts  = ACTIONS.map((a) => ({ value: a.value, label: a.label, iconEl: a.icon, iconColor: a.color }));
  const convRate = rule.sent > 0 ? Math.round((rule.converted / rule.sent) * 100) : 0;

  return (
    <div
      className="rounded-xl transition-all duration-200 hover:shadow-sm"
      style={{
        background: rule.active ? "white" : "#fafafa",
        border: `1.5px solid ${rule.active ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)"}`,
        opacity: rule.active ? 1 : 0.7,
      }}
    >
      {/* Main row */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 px-5 py-4">
        {/* IF block */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{ background: "rgba(37,99,235,0.08)" }}
        >
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563EB", letterSpacing: "0.06em" }}>IF</span>
        </div>

        <StyledSelect<ConditionKey>
          value={rule.condition}
          onChange={(v) => onUpdate(rule.id, { condition: v })}
          options={condOpts}
          placeholder="Chọn điều kiện…"
          accentColor="#2563EB"
        />

        {/* Arrow */}
        <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "#d1d5db" }} />

        {/* THEN block */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{ background: "rgba(249,115,22,0.1)" }}
        >
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#F97316", letterSpacing: "0.06em" }}>THEN</span>
        </div>

        <StyledSelect<ActionKey>
          value={rule.action}
          onChange={(v) => onUpdate(rule.id, { action: v })}
          options={actOpts}
          placeholder="Chọn hành động…"
          accentColor="#F97316"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats pills */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-2.5 py-1 rounded-full hidden xl:inline-flex"
            style={{ background: "rgba(37,99,235,0.07)", fontSize: "0.72rem", fontWeight: 600, color: "#2563EB" }}
          >
            {rule.sent.toLocaleString()} đã gửi
          </span>
          <span
            className="px-2.5 py-1 rounded-full hidden xl:inline-flex"
            style={{ background: "rgba(34,197,94,0.08)", fontSize: "0.72rem", fontWeight: 600, color: "#16a34a" }}
          >
            {convRate}% chuyển đổi
          </span>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggle(rule.id)}
          className="flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 relative"
          style={{ background: rule.active ? "#2563EB" : "#d1d5db" }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: rule.active ? "translateX(18px)" : "translateX(2px)" }}
          />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(rule.id)}
          className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-red-50 group"
        >
          <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Stats bar */}
      {rule.active && (
        <div
          className="px-5 py-2.5 flex items-center gap-6 border-t"
          style={{ borderColor: "rgba(0,0,0,0.05)", background: "#f9fafb" }}
        >
          {[
            { label: "Đã gửi", val: rule.sent, color: "#6b7280" },
            { label: "Đã mở", val: rule.opened, color: "#2563EB" },
            { label: "Chuyển đổi", val: rule.converted, color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>{s.label}:</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color }}>{s.val.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.05)", maxWidth: "160px" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round((rule.opened / rule.sent) * 100)}%`,
                background: "linear-gradient(90deg, #2563EB, #3b82f6)",
              }}
            />
          </div>
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
            {Math.round((rule.opened / rule.sent) * 100)}% tỷ lệ mở
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CRMAutomationBuilder() {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [extraSegments, setExtraSegments] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleRule = (id: string) =>
    setRules((r) => r.map((rule) => rule.id === id ? { ...rule, active: !rule.active } : rule));

  const deleteRule = (id: string) =>
    setRules((r) => r.filter((rule) => rule.id !== id));

  const updateRule = (id: string, patch: Partial<AutomationRule>) =>
    setRules((r) => r.map((rule) => rule.id === id ? { ...rule, ...patch } : rule));

  const addRule = () => {
    const newRule: AutomationRule = {
      id: `r${Date.now()}`,
      condition: "visit_7d",
      action: "send_sms",
      active: false,
      sent: 0,
      opened: 0,
      converted: 0,
    };
    setRules((r) => [...r, newRule]);
  };

  const activeCount = rules.filter((r) => r.active).length;
  const allSegments = [...segments, ...extraSegments.map((name, i) => ({
    id: `extra-${i}`,
    icon: UserPlus,
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
    name,
    description: "Phân khúc tuỳ chỉnh · Tự động cập nhật",
    count: Math.floor(Math.random() * 100) + 10,
    trend: +5,
    openRate: 72,
    status: "active" as const,
    lastTriggered: "Vừa xong",
    automations: 0,
  }))];

  return (
    <>
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{
        border: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(249,115,22,0.1)" }}
          >
            <Zap className="w-5 h-5" style={{ color: "#F97316" }} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              Công cụ tự động hoá CRM
            </h3>
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
              {activeCount} / {rules.length} quy tắc đang hoạt động · Luồng IF → THEN trực quan
            </p>
          </div>
        </div>
        <button
          onClick={addRule}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "white",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm quy tắc
        </button>
      </div>

      {/* ── Rules ── */}
      <div className="px-7 py-5 flex flex-col gap-3">
        {/* Column labels */}
        <div className="hidden lg:flex items-center gap-3 px-5 mb-1">
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", minWidth: "52px" }}>ĐIỀU KIỆN</span>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginLeft: "8px", minWidth: "220px" }}>NẾU</span>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginLeft: "48px", minWidth: "52px" }}>HÀNH ĐỘNG</span>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginLeft: "8px" }}>KẾT QUẢ</span>
        </div>

        {rules.map((rule) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            onToggle={toggleRule}
            onDelete={deleteRule}
            onUpdate={updateRule}
          />
        ))}

        {rules.length === 0 && (
          <div className="text-center py-10">
            <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: "#e5e7eb" }} />
            <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>Chưa có quy tắc tự động hoá</p>
            <button
              onClick={addRule}
              className="mt-3 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              style={{ fontSize: "0.83rem", fontWeight: 600 }}
            >
              + Tạo quy tắc đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* ── Customer Segments ── */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="px-7 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f9fafb" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(37,99,235,0.08)" }}
            >
              <Users className="w-4 h-4" style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h4 className="text-gray-900" style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                Phân khúc khách hàng
              </h4>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>
                Danh sách thông minh tự cập nhật · {allSegments.reduce((a, s) => a + s.count, 0).toLocaleString()} tổng liên hệ
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewSegment(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors hover:bg-blue-50"
            style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2563EB", border: "1px solid rgba(37,99,235,0.2)" }}
          >
            <Plus className="w-3.5 h-3.5" />
             Phân khúc mới
          </button>
        </div>

        {/* Segment rows */}
        <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          {allSegments.map((seg) => {
            const Icon = seg.icon;
            const isUp = seg.trend >= 0;

            return (
              <div
                key={seg.id}
                className="px-7 py-4 flex flex-wrap lg:flex-nowrap items-center gap-4 transition-colors hover:bg-gray-50/80 cursor-pointer group"
              >
                {/* Icon + info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: seg.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: seg.color }} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {seg.name}
                    </p>
                    <p className="text-gray-400 truncate" style={{ fontSize: "0.75rem" }}>
                      {seg.description}
                    </p>
                  </div>
                </div>

                {/* Count */}
                <div className="flex-shrink-0 text-center hidden sm:block" style={{ minWidth: "70px" }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>
                    {seg.count.toLocaleString()}
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>liên hệ</p>
                </div>

                {/* Trend */}
                <div className="flex-shrink-0 hidden md:flex items-center gap-1.5" style={{ minWidth: "80px" }}>
                  <span
                    className="px-2 py-1 rounded-full"
                    style={{
                      background: isUp ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: isUp ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {isUp ? "↑" : "↓"} {Math.abs(seg.trend)}%
                  </span>
                </div>

                {/* Open rate bar */}
                <div className="flex-shrink-0 hidden lg:flex flex-col gap-1" style={{ minWidth: "120px" }}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Tỷ lệ mở</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{seg.openRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${seg.openRate}%`,
                        background: seg.color,
                      }}
                    />
                  </div>
                </div>

                {/* Automations badge */}
                <div className="flex-shrink-0 hidden xl:flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {seg.automations} quy tắc
                  </span>
                </div>

                {/* Last triggered */}
                <div className="flex-shrink-0 hidden xl:block" style={{ minWidth: "100px" }}>
                  <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Kích hoạt lần cuối</p>
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{seg.lastTriggered}</p>
                </div>

                {/* Status toggle */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    style={{
                      background: seg.status === "active" ? "rgba(22,163,74,0.1)" : "rgba(0,0,0,0.05)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: seg.status === "active" ? "#16a34a" : "#9ca3af",
                    }}
                  >
                    {seg.status === "active" ? (
                      <><Play className="w-2.5 h-2.5" /> Đang hoạt động</>
                    ) : (
                      <><Pause className="w-2.5 h-2.5" /> Tạm dừng</>
                    )}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#9ca3af" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-7 py-4 flex items-center justify-between"
          style={{ background: "#f9fafb", borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" style={{ color: "#22c55e" }} />
            Tất cả phân khúc làm mới mỗi 15 phút · Dữ liệu từ PetTech CRM
          </p>
          <button
            onClick={() => navigate("/dashboard/crm")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors hover:bg-white"
            style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}
          >
            Xem toàn bộ CRM <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    {showNewSegment && (
      <NewSegmentModal
        onClose={() => setShowNewSegment(false)}
        onAdd={(name) => setExtraSegments(prev => [...prev, name])}
      />
    )}
    </>
  );
}