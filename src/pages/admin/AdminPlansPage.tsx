import { useState } from "react";
import { Edit3, Users, CreditCard, X, Check } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, AdminKPICard, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { usePlans, useUpdatePlan } from "@/hooks/admin/usePlans";
import type { SubscriptionPlan, UpdatePlanRequest } from "@/types/admin";
import "@/styles/fonts.css";

const PLAN_COLORS: Record<string, string> = {
  Enterprise: "#7c3aed",
  Growth:     "#2563EB",
  Starter:    "#9ca3af",
  Trial:      "#f97316",
};

function EditPlanModal({ plan, onClose }: { plan: SubscriptionPlan; onClose: () => void }) {
  const updateMutation = useUpdatePlan();
  const [form, setForm] = useState<UpdatePlanRequest>({
    price:    plan.price,
    maxStaff: plan.maxStaff,
    features: [...(plan.features ?? [])],
  });
  const [newFeature, setNewFeature] = useState("");

  function addFeature() {
    const f = newFeature.trim();
    if (!f) return;
    setForm(p => ({ ...p, features: [...(p.features ?? []), f] }));
    setNewFeature("");
  }

  function removeFeature(idx: number) {
    setForm(p => ({ ...p, features: (p.features ?? []).filter((_, i) => i !== idx) }));
  }

  function handleSave() {
    updateMutation.mutate({ id: plan.id, data: form }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white z-10" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Chỉnh sửa gói {plan.name}</h2>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>{plan.tenantCount} tenant đang dùng gói này</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Price */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>GIÁ / THÁNG ($)</label>
            <input
              type="number"
              min={0}
              value={form.price ?? ""}
              onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
              onFocus={e => (e.target.style.borderColor = "#2563EB")}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Max Staff */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>SỐ NHÂN VIÊN TỐI ĐA</label>
            <input
              type="number"
              min={1}
              value={form.maxStaff ?? ""}
              onChange={e => setForm(p => ({ ...p, maxStaff: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
              onFocus={e => (e.target.style.borderColor = "#2563EB")}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Features */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>TÍNH NĂNG</label>
            <div className="mt-2 flex flex-col gap-1.5">
              {(form.features ?? []).map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16a34a" }} />
                  <span className="flex-1" style={{ fontSize: "0.78rem", color: "#374151" }}>{f}</span>
                  <button onClick={() => removeFeature(i)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50">
                    <X className="w-3 h-3" style={{ color: "#9ca3af" }} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                placeholder="Thêm tính năng mới…"
                className="flex-1 px-3 py-2 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.78rem", color: "#111827" }}
              />
              <button onClick={addFeature} className="px-3 py-2 rounded-xl" style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.72rem", fontWeight: 700, color: "#2563EB", border: "1px solid rgba(37,99,235,0.15)" }}>
                Thêm
              </button>
            </div>
          </div>

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

function PlansContent() {
  const { data: plans = [], isLoading } = usePlans();
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);

  const totalTenants = plans.reduce((s, p) => s + p.tenantCount, 0);
  const totalMrr     = plans.reduce((s, p) => s + p.mrr, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Gói đăng ký</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Quản lý giá cả và tính năng cho từng gói</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Tổng Tenant" value={String(totalTenants)} sub="Đang sử dụng tất cả gói" icon={Users}      color="#2563EB" bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Tổng MRR"   value={`$${(totalMrr / 1000).toFixed(1)}k`} sub="Từ tất cả gói" icon={CreditCard} color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="Gói phổ biến" value={plans.sort((a, b) => b.tenantCount - a.tenantCount)[0]?.name ?? "—"} sub="Số tenant nhiều nhất" icon={Users} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <AdminKPICard label="Gói doanh thu cao" value={plans.sort((a, b) => b.mrr - a.mrr)[0]?.name ?? "—"} sub="MRR cao nhất" icon={CreditCard} color="#f97316" bg="rgba(249,115,22,0.08)" />
      </div>

      {/* Plan cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={5} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {plans.map(plan => {
            const color = PLAN_COLORS[plan.name] ?? "#9ca3af";
            const pct = totalTenants > 0 ? Math.round(plan.tenantCount / totalTenants * 100) : 0;
            return (
              <AdminCard key={plan.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <CreditCard className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>{plan.name}</h3>
                      <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{plan.tenantCount} tenant · {pct}% tổng số</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: "1.4rem", fontWeight: 900, color, letterSpacing: "-0.03em" }}>${plan.price}</p>
                    <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>/ tháng</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="px-3 py-2.5 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                    <p style={{ fontSize: "0.6rem", color: "#9ca3af", fontWeight: 600 }}>MRR</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>${plan.mrr.toLocaleString()}</p>
                  </div>
                  <div className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <p style={{ fontSize: "0.6rem", color: "#9ca3af", fontWeight: 600 }}>Nhân viên tối đa</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>{plan.maxStaff}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-1.5 mb-4">
                  {(plan.features ?? []).slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                      <span style={{ fontSize: "0.75rem", color: "#374151" }}>{f}</span>
                    </div>
                  ))}
                  {(plan.features ?? []).length > 5 && (
                    <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>+{plan.features.length - 5} tính năng khác</span>
                  )}
                </div>

                <button
                  onClick={() => setEditing(plan)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa gói
                </button>
              </AdminCard>
            );
          })}
          {plans.length === 0 && (
            <div className="col-span-2 py-12 text-center bg-white rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Chưa có gói đăng ký nào.</p>
            </div>
          )}
        </div>
      )}

      {editing && <EditPlanModal plan={editing} onClose={() => setEditing(null)} />}
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
