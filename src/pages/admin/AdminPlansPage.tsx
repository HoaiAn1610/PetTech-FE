import { useState } from "react";
import { Plus, Edit3, Trash2, CreditCard, Users, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminKPICard, SkeletonCard, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan, useUpdatePlanStatus } from "@/hooks/admin/usePlans";
import type { SubscriptionPlan, CreatePlanRequest, UpdatePlanRequest } from "@/types/admin";
import "@/styles/fonts.css";

function getPlanColor(name: string): string {
  if (name.toLowerCase().includes("pro") || name.toLowerCase().includes("enterprise")) return "#7c3aed";
  if (name.toLowerCase().includes("growth") || name.toLowerCase().includes("chuyên")) return "#2563EB";
  if (name.toLowerCase().includes("trial")) return "#f97316";
  return "#9ca3af";
}

const FEATURE_LABELS: Record<string, string> = {
  aiAllergy:      "AI Dị ứng",
  crmAutomation:  "CRM tự động",
  liveTracking:   "Live Tracking",
  customDomain:   "Domain tùy chỉnh",
  apiAccess:      "Truy cập API",
};
const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as Array<keyof typeof FEATURE_LABELS>;

function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function FieldInput({ label, value, onChange, type = "text", min }: {
  label: string; value: string | number; type?: string; min?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{label}</label>
      <input
        type={type}
        min={min}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
        style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
        onFocus={e => (e.target.style.borderColor = "#2563EB")}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );
}

function FeaturesToggle({ features, onChange }: {
  features: Record<string, boolean>;
  onChange: (key: string, val: boolean) => void;
}) {
  return (
    <div>
      <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>TÍNH NĂNG</label>
      <div className="mt-2 flex flex-col gap-1.5">
        {FEATURE_KEYS.map(key => {
          const enabled = !!features[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key, !enabled)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-left"
              style={{ background: enabled ? "rgba(37,99,235,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${enabled ? "rgba(37,99,235,0.1)" : "rgba(0,0,0,0.06)"}` }}
            >
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: enabled ? "#16a34a" : "#d1d5db" }} />
              <span className="flex-1" style={{ fontSize: "0.78rem", color: enabled ? "#374151" : "#9ca3af" }}>
                {FEATURE_LABELS[key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Create Plan Modal ────────────────────────────────────────────────────────

function CreatePlanModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreatePlan();
  const [form, setForm] = useState<CreatePlanRequest>({
    name: "",
    priceMonthly: 0,
    maxStaff: 5,
    maxProducts: 100,
    maxBookingsMo: 500,
    features: { aiAllergy: false, crmAutomation: false, liveTracking: false, customDomain: false, apiAccess: false },
  });

  function setNum(field: keyof CreatePlanRequest, raw: string) {
    setForm(p => ({ ...p, [field]: Number(raw) }));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    createMutation.mutate(form, { onSuccess: onClose });
  }

  const features = (form.features ?? {}) as Record<string, boolean>;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Tạo gói cước mới</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          {/* Name + Price in 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="TÊN GÓI" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
            <FieldInput label="GIÁ / THÁNG (₫)" value={form.priceMonthly} type="number" min={0} onChange={v => setNum("priceMonthly", v)} />
          </div>

          {/* Limits in 3 cols */}
          <div className="grid grid-cols-3 gap-2">
            <FieldInput label="NHÂN VIÊN" value={form.maxStaff} type="number" min={1} onChange={v => setNum("maxStaff", v)} />
            <FieldInput label="SẢN PHẨM" value={form.maxProducts} type="number" min={1} onChange={v => setNum("maxProducts", v)} />
            <FieldInput label="LỊCH/THÁNG" value={form.maxBookingsMo} type="number" min={1} onChange={v => setNum("maxBookingsMo", v)} />
          </div>

          {/* Features — compact 2-col checkbox grid */}
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", marginBottom: "6px" }}>TÍNH NĂNG</p>
            <div className="grid grid-cols-2 gap-1.5">
              {FEATURE_KEYS.map(key => {
                const on = !!features[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, features: { ...(p.features ?? {}), [key]: !on } }))}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left"
                    style={{ background: on ? "rgba(37,99,235,0.05)" : "rgba(0,0,0,0.02)", border: `1px solid ${on ? "rgba(37,99,235,0.15)" : "rgba(0,0,0,0.06)"}` }}
                  >
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color: on ? "#16a34a" : "#d1d5db" }} />
                    <span style={{ fontSize: "0.72rem", color: on ? "#374151" : "#9ca3af" }}>{FEATURE_LABELS[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={createMutation.isPending || !form.name.trim()}
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 700, fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(22,163,74,0.25)", opacity: form.name.trim() ? 1 : 0.5 }}
          >
            <Plus className="w-3.5 h-3.5" />
            {createMutation.isPending ? "Đang tạo…" : "Tạo gói cước"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Plan Modal ──────────────────────────────────────────────────────────

function EditPlanModal({ plan, onClose }: { plan: SubscriptionPlan; onClose: () => void }) {
  const updateMutation = useUpdatePlan();
  const [form, setForm] = useState<UpdatePlanRequest>({
    name:          plan.name,
    priceMonthly:  plan.priceMonthly,
    maxStaff:      plan.maxStaff,
    maxProducts:   plan.maxProducts,
    maxBookingsMo: plan.maxBookingsMo,
    isActive:      plan.isActive,
    features:      plan.features ? { ...plan.features } : undefined,
  });

  function setNum(field: keyof UpdatePlanRequest, raw: string) {
    setForm(p => ({ ...p, [field]: Number(raw) }));
  }

  function handleSave() {
    updateMutation.mutate({ id: plan.id, data: form }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white z-10"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Chỉnh sửa gói</h2>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>ID: {plan.id.slice(0, 8)}…</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <FieldInput label="TÊN GÓI" value={form.name ?? ""} onChange={v => setForm(p => ({ ...p, name: v }))} />
          <FieldInput label="GIÁ / THÁNG (₫)" value={form.priceMonthly ?? ""} type="number" min={0} onChange={v => setNum("priceMonthly", v)} />
          <div className="grid grid-cols-3 gap-3">
            <FieldInput label="NHÂN VIÊN TỐI ĐA" value={form.maxStaff ?? ""} type="number" min={1} onChange={v => setNum("maxStaff", v)} />
            <FieldInput label="SẢN PHẨM TỐI ĐA" value={form.maxProducts ?? ""} type="number" min={1} onChange={v => setNum("maxProducts", v)} />
            <FieldInput label="LỊCH HẸN / THÁNG" value={form.maxBookingsMo ?? ""} type="number" min={1} onChange={v => setNum("maxBookingsMo", v)} />
          </div>

          {/* isActive toggle */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>TRẠNG THÁI</label>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className="mt-1.5 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl"
              style={{ background: form.isActive ? "rgba(22,163,74,0.05)" : "rgba(107,114,128,0.05)", border: `1.5px solid ${form.isActive ? "rgba(22,163,74,0.2)" : "rgba(107,114,128,0.2)"}` }}
            >
              {form.isActive
                ? <ToggleRight className="w-5 h-5 flex-shrink-0" style={{ color: "#16a34a" }} />
                : <ToggleLeft className="w-5 h-5 flex-shrink-0" style={{ color: "#9ca3af" }} />
              }
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: form.isActive ? "#16a34a" : "#6b7280" }}>
                {form.isActive ? "Đang kích hoạt" : "Không hoạt động"}
              </span>
            </button>
          </div>

          <FeaturesToggle
            features={(form.features ?? {}) as Record<string, boolean>}
            onChange={(key, val) => setForm(p => ({ ...p, features: { ...(p.features ?? {}), [key]: val } }))}
          />

          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-1"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
          >
            {updateMutation.isPending ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Plans Content ────────────────────────────────────────────────────────────

function PlansContent() {
  const { data: plansData, isLoading } = usePlans();
  const deleteMutation = useDeletePlan();
  const statusMutation = useUpdatePlanStatus();
  const plans = plansData?.items ?? [];

  const [creating, setCreating] = useState(false);
  const [editing,  setEditing]  = useState<SubscriptionPlan | null>(null);
  const [deleting, setDeleting] = useState<SubscriptionPlan | null>(null);

  const activePlans = plans.filter(p => p.isActive).length;
  const prices      = plans.map(p => p.priceMonthly);
  const minPrice    = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice    = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Gói đăng ký</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Quản lý giá cả và tính năng cho từng gói</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all"
          style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}
        >
          <Plus className="w-4 h-4" /> Tạo gói mới
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Tổng gói" value={String(plans.length)} sub="Tất cả gói" icon={Users} color="#2563EB" bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang kích hoạt" value={String(activePlans)} sub="Gói đang hoạt động" icon={CreditCard} color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="Giá thấp nhất" value={plans.length > 0 ? formatVnd(minPrice) : "—"} sub="/ tháng" icon={Users} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <AdminKPICard label="Giá cao nhất" value={plans.length > 0 ? formatVnd(maxPrice) : "—"} sub="/ tháng" icon={CreditCard} color="#f97316" bg="rgba(249,115,22,0.08)" />
      </div>

      {/* Plan cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} lines={6} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {plans.map(plan => {
            const color = getPlanColor(plan.name);
            return (
              <AdminCard key={plan.id}>
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <CreditCard className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{plan.name}</h3>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: "0.55rem", fontWeight: 700, background: plan.isActive ? "rgba(22,163,74,0.1)" : "rgba(107,114,128,0.1)", color: plan.isActive ? "#16a34a" : "#6b7280" }}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                        {plan.maxStaff} nhân viên · {plan.maxBookingsMo.toLocaleString("vi-VN")} lịch/tháng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: "1.15rem", fontWeight: 900, color, letterSpacing: "-0.03em" }}>
                      {formatVnd(plan.priceMonthly)}
                    </p>
                    <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>/ tháng</p>
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Sản phẩm", value: plan.maxProducts.toLocaleString("vi-VN") },
                    { label: "Nhân viên", value: String(plan.maxStaff) },
                    { label: "Lịch/tháng", value: plan.maxBookingsMo.toLocaleString("vi-VN") },
                  ].map(s => (
                    <div key={s.label} className="px-3 py-2.5 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                      <p style={{ fontSize: "0.58rem", color: "#9ca3af", fontWeight: 600 }}>{s.label}</p>
                      <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                {plan.features && (
                  <div className="flex flex-col gap-1 mb-4">
                    {FEATURE_KEYS.map(key => {
                      const enabled = !!(plan.features as unknown as Record<string, boolean>)?.[key];
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: enabled ? color : "#d1d5db" }} />
                          <span style={{ fontSize: "0.73rem", color: enabled ? "#374151" : "#9ca3af" }}>{FEATURE_LABELS[key]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => statusMutation.mutate({ id: plan.id, isActive: !plan.isActive })}
                    disabled={statusMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.73rem", fontWeight: 600, color: plan.isActive ? "#6b7280" : "#16a34a" }}
                  >
                    {plan.isActive ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                    {plan.isActive ? "Tắt hoạt động" : "Bật hoạt động"}
                  </button>
                  <button
                    onClick={() => setEditing(plan)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                    style={{ border: "1.5px solid rgba(37,99,235,0.15)", fontSize: "0.73rem", fontWeight: 600, color: "#2563EB" }}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setDeleting(plan)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                    style={{ border: "1.5px solid rgba(220,38,38,0.15)" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                  </button>
                </div>
              </AdminCard>
            );
          })}

          {plans.length === 0 && (
            <div className="col-span-2 py-16 text-center bg-white rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
              <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
              <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Chưa có gói đăng ký nào.</p>
              <button
                onClick={() => setCreating(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "rgba(22,163,74,0.08)", fontSize: "0.78rem", fontWeight: 600, color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Tạo gói đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {creating && <CreatePlanModal onClose={() => setCreating(false)} />}
      {editing  && <EditPlanModal plan={editing} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        title={`Xóa gói "${deleting?.name}"?`}
        description="Hành động này không thể hoàn tác. Các tenant đang dùng gói này có thể bị ảnh hưởng."
        confirmLabel="Xóa gói"
        destructive
        onConfirm={() => {
          if (deleting) deleteMutation.mutate(deleting.id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}

export default function AdminPlansPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Gói đăng ký" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Gói đăng ký" }]}>
        <PlansContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
