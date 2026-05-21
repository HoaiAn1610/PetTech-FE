import { useState } from "react";
import {
  Search, Plus, X, Users, CheckCircle2, Clock,
  AlertTriangle, MoreHorizontal, Mail,
  Phone, CreditCard, Edit3, Trash2,
  Eye, Ban,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminTable, AdminStatusBadge, SkeletonTable, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useTenants, useSuspendTenant, useReactivateTenant, useDeleteTenant } from "@/hooks/admin/useTenants";
import type { Tenant, TenantPlan, TenantStatus } from "@/types/admin";
import "@/styles/fonts.css";

type AdminRole = "admin" | "staff";

const PLAN_STYLES: Record<string, { bg: string; text: string }> = {
  Starter:    { bg: "rgba(107,114,128,0.08)", text: "#6b7280" },
  Growth:     { bg: "rgba(37,99,235,0.08)",   text: "#2563EB" },
  Enterprise: { bg: "rgba(124,58,237,0.08)",  text: "#7c3aed" },
  Trial:      { bg: "rgba(249,115,22,0.08)",  text: "#ea580c" },
};

const STATUS_LABEL: Record<TenantStatus, string> = {
  Active: "Hoạt động", Trial: "Dùng thử", Suspended: "Tạm khóa", Cancelled: "Đã hủy",
};
const STATUS_TYPE: Record<TenantStatus, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", Trial: "warning", Suspended: "error", Cancelled: "neutral",
};

function TenantModal({ tenant, onClose, adminRole, onSuspend, onReactivate, onDelete }: {
  tenant: Tenant;
  onClose: () => void;
  adminRole: AdminRole;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const p = PLAN_STYLES[tenant.plan];
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4 px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.1)" }}>
            <span style={{ fontSize: "1.1rem" }}>🏥</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>{tenant.name}</h2>
              <AdminStatusBadge status={STATUS_LABEL[tenant.status]} type={STATUS_TYPE[tenant.status]} />
              <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, fontSize: "0.65rem", fontWeight: 700, color: p.text }}>{tenant.plan}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>
              ID: {tenant.id} · Tham gia {new Date(tenant.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="w-4 h-4" style={{ color: "#6b7280" }} /></button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>LIÊN HỆ</p>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{tenant.ownerName}</p>
            {[{ icon: Mail, val: tenant.ownerEmail }, { icon: Phone, val: tenant.ownerPhone ?? "—" }].map(r => {
              const Icon = r.icon;
              return <div key={r.val} className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} /><span style={{ fontSize: "0.75rem", color: "#374151" }}>{r.val}</span></div>;
            })}
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>THANH TOÁN</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>${tenant.mrr}<span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#9ca3af" }}>/tháng</span></p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Gói {tenant.plan} · MRR</p>
          </div>
          {[
            { label: "TÀI KHOẢN NHÂN VIÊN", value: tenant.staffCount.toString() },
            { label: "TỔNG LỊCH HẸN",       value: tenant.totalBookings.toLocaleString() },
            { label: "ĐĂNG NHẬP LẦN CUỐI",  value: new Date(tenant.lastLoginAt).toLocaleDateString("vi-VN") },
            { label: "THÀNH VIÊN TỪ",        value: new Date(tenant.createdAt).toLocaleDateString("vi-VN") },
          ].map(i => (
            <div key={i.label} className="px-4 py-3 rounded-xl" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{i.label}</p>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827", marginTop: "2px" }}>{i.value}</p>
            </div>
          ))}
        </div>

        {adminRole === "admin" && (
          <div className="flex gap-2.5 px-6 pb-6 pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1.5px solid #e5e7eb", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
              <Edit3 className="w-3.5 h-3.5" /> Sửa gói
            </button>
            {tenant.status === "Active" && (
              <button onClick={() => { onSuspend(tenant.id); onClose(); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors ml-auto" style={{ border: "1.5px solid rgba(220,38,38,0.3)", fontSize: "0.8rem", fontWeight: 600, color: "#dc2626" }}>
                <Ban className="w-3.5 h-3.5" /> Tạm khóa
              </button>
            )}
            {tenant.status === "Suspended" && (
              <button onClick={() => { onReactivate(tenant.id); onClose(); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl ml-auto" style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Kích hoạt lại
              </button>
            )}
            <button onClick={() => { onDelete(tenant.id); onClose(); }} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50" style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.8rem", color: "#dc2626", cursor: "pointer" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTenantsPage() {
  const [search, setSearch]             = useState("");
  const [filterPlan, setFilterPlan]     = useState<TenantPlan | "">("");
  const [filterStatus, setFilterStatus] = useState<TenantStatus | "">("");
  const [selected, setSelected]         = useState<Tenant | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: "suspend" | "reactivate" | "delete"; id: string; name: string }>({ open: false, type: "suspend", id: "", name: "" });
  const pageRole = (sessionStorage.getItem("adminRole") as AdminRole) || "admin";

  const { data: tenantsData, isLoading } = useTenants({
    search: search || undefined,
    plan: filterPlan || undefined,
    status: filterStatus || undefined,
    page: 1, pageSize: 50,
  });
  const tenants = tenantsData?.items ?? [];

  const suspendMutation    = useSuspendTenant();
  const reactivateMutation = useReactivateTenant();
  const deleteMutation     = useDeleteTenant();

  const openConfirm = (type: "suspend" | "reactivate" | "delete", id: string, name: string) =>
    setConfirmDialog({ open: true, type, id, name });

  const handleConfirm = () => {
    const { type, id } = confirmDialog;
    if (type === "suspend")    suspendMutation.mutate(id);
    else if (type === "reactivate") reactivateMutation.mutate(id);
    else deleteMutation.mutate(id);
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const stats = [
    { label: "Tổng Tenant", value: tenantsData?.total ?? tenants.length, icon: Users,        color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
    { label: "Hoạt động",   value: tenants.filter(t => t.status === "Active").length,     icon: CheckCircle2, color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
    { label: "Dùng thử",    value: tenants.filter(t => t.status === "Trial").length,      icon: Clock,        color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { label: "Tạm khóa",    value: tenants.filter(t => t.status === "Suspended").length,  icon: AlertTriangle,color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
  ];

  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Quản lý Tenant" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Tenant" }]}>

        <div className="flex items-start justify-between">
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Danh sách Tenant</h2>
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>{tenantsData?.total ?? "..."} tenant</p>
          </div>
          {pageRole === "admin" && (
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
              <Plus className="w-4 h-4" /> Thêm Tenant
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white" style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", marginTop: "2px" }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên phòng khám, chủ sở hữu hoặc ID…" className="w-full pl-9 pr-4 py-2 rounded-xl outline-none" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }} />
          </div>
          <select value={filterPlan} onChange={e => setFilterPlan(e.target.value as TenantPlan | "")} className="appearance-none px-3 py-2 rounded-xl outline-none cursor-pointer" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
            <option value="">Tất cả gói</option>
            {(["Starter", "Growth", "Enterprise", "Trial"] as TenantPlan[]).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as TenantStatus | "")} className="appearance-none px-3 py-2 rounded-xl outline-none cursor-pointer" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
            <option value="">Tất cả trạng thái</option>
            {(["Active", "Trial", "Suspended", "Cancelled"] as TenantStatus[]).map(o => <option key={o} value={o}>{STATUS_LABEL[o]}</option>)}
          </select>
          {(search || filterPlan || filterStatus) && (
            <button onClick={() => { setSearch(""); setFilterPlan(""); setFilterStatus(""); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626", border: "1.5px solid rgba(220,38,38,0.2)" }}>
              <X className="w-3.5 h-3.5" /> Xóa lọc
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          {isLoading ? (
            <div className="p-4"><SkeletonTable rows={8} /></div>
          ) : (
            <AdminTable headers={["Tenant", "Gói", "Trạng thái", "MRR", "Nhân viên", "Lịch hẹn", "Đăng nhập cuối", ""]}>
              {tenants.map((t, i) => {
                const p = PLAN_STYLES[t.plan];
                return (
                  <tr key={t.id} className="hover:bg-blue-50/40 transition-colors cursor-pointer" style={{ borderBottom: i < tenants.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }} onClick={() => setSelected(t)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}><span style={{ fontSize: "0.85rem" }}>🏥</span></div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                          <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{t.id} · {t.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="px-2 py-0.5 rounded-lg" style={{ background: p.bg, fontSize: "0.68rem", fontWeight: 700, color: p.text }}>{t.plan}</span></td>
                    <td className="px-5 py-3.5"><AdminStatusBadge status={STATUS_LABEL[t.status]} type={STATUS_TYPE[t.status]} /></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.82rem", fontWeight: 700, color: t.mrr > 0 ? "#111827" : "#9ca3af" }}>{t.mrr > 0 ? `$${t.mrr}` : "—"}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", color: "#374151" }}>{t.staffCount}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", color: "#374151" }}>{t.totalBookings.toLocaleString()}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{new Date(t.lastLoginAt).toLocaleDateString("vi-VN")}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors" onClick={e => { e.stopPropagation(); setSelected(t); }}><Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} /></button>
                        {pageRole === "admin" && (
                          <>
                            {t.status === "Active" && <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50" onClick={e => { e.stopPropagation(); openConfirm("suspend", t.id, t.name); }}><Ban className="w-3.5 h-3.5" style={{ color: "#dc2626" }} /></button>}
                            {t.status === "Suspended" && <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50" onClick={e => { e.stopPropagation(); openConfirm("reactivate", t.id, t.name); }}><CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16a34a" }} /></button>}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
          {!isLoading && tenants.length === 0 && (
            <div className="px-5 py-12 text-center"><p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy tenant phù hợp với bộ lọc.</p></div>
          )}
        </div>

        {selected && (
          <TenantModal
            tenant={selected}
            onClose={() => setSelected(null)}
            adminRole={pageRole}
            onSuspend={(id) => openConfirm("suspend", id, selected.name)}
            onReactivate={(id) => openConfirm("reactivate", id, selected.name)}
            onDelete={(id) => openConfirm("delete", id, selected.name)}
          />
        )}

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.type === "suspend" ? `Tạm khóa "${confirmDialog.name}"?` : confirmDialog.type === "reactivate" ? `Kích hoạt lại "${confirmDialog.name}"?` : `Xóa vĩnh viễn "${confirmDialog.name}"?`}
          description={confirmDialog.type === "suspend" ? "Tenant sẽ không thể truy cập hệ thống cho đến khi được kích hoạt lại." : confirmDialog.type === "reactivate" ? "Tenant sẽ có thể đăng nhập và sử dụng dịch vụ bình thường." : "Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ bị xóa."}
          confirmLabel={confirmDialog.type === "delete" ? "Xóa vĩnh viễn" : "Xác nhận"}
          destructive={confirmDialog.type === "delete"}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
