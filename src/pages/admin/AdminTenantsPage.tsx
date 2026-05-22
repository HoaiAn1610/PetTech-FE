import { useState, useRef } from "react";
import {
  Search, Plus, X, Users, CheckCircle2, Clock,
  AlertTriangle, Mail, Phone, Edit3, Trash2,
  Eye, Ban, Building2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminStatusBadge, SkeletonTable, ConfirmDialog, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import {
  useTenants, useCreateTenant, useUpdateTenant,
  useSuspendTenant, useReactivateTenant, useDeleteTenant,
} from "@/hooks/admin/useTenants";
import { usePlans } from "@/hooks/admin/usePlans";
import type { Tenant, TenantStatus, CreateTenantRequest, UpdateTenantRequest } from "@/types/admin";
import "@/styles/fonts.css";

// TenantStatus enum (matches backend integer values)
const TENANT_STATUS_INT: Record<TenantStatus, number> = {
  Trial: 0, Active: 1, Suspended: 2, Cancelled: 3,
};

const STATUS_LABEL: Record<TenantStatus, string> = {
  Active: "Hoạt động", Trial: "Dùng thử", Suspended: "Tạm khóa", Cancelled: "Đã hủy",
};
const STATUS_TYPE: Record<TenantStatus, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", Trial: "warning", Suspended: "error", Cancelled: "neutral",
};

function vnd(n: number) { return n > 0 ? n.toLocaleString("vi-VN") + " ₫" : "—"; }

function Field({ label, value, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; required?: boolean; type?: string }) {
  return null; // placeholder — replaced by FieldInput below
}

function FieldInput({
  label, value, onChange, placeholder, required, type = "text", hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 rounded-xl outline-none"
        style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#111827" }}
      />
      {hint && <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{hint}</p>}
    </div>
  );
}

// ─── Create Tenant Modal ───────────────────────────────────────────────────────

function CreateTenantModal({ onClose, planMap }: { onClose: () => void; planMap: Record<string, string> }) {
  const mutation = useCreateTenant();
  const [form, setForm] = useState<CreateTenantRequest>({
    code: "", name: "", ownerName: "", email: "", phone: "",
    planId: "", durationMonths: undefined, defaultAdminPassword: "",
  });

  const set = (k: keyof CreateTenantRequest) => (v: string) =>
    setForm(f => ({ ...f, [k]: v || undefined }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateTenantRequest = {
      ...form,
      code: form.code.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      defaultAdminPassword: form.defaultAdminPassword,
      ownerName: form.ownerName?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      planId: form.planId?.trim() || undefined,
      durationMonths: form.durationMonths ? Number(form.durationMonths) : undefined,
    };
    mutation.mutate(payload, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
              <Building2 className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Thêm Tenant mới</h3>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Tạo cửa hàng / phòng khám trên nền tảng</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <FieldInput label="Mã tenant (code)" value={form.code} onChange={set("code")}
              placeholder="petshop-saigon" required hint="Chữ thường, số, dấu gạch ngang" />
            <FieldInput label="Tên cửa hàng" value={form.name} onChange={set("name")}
              placeholder="PetShop Sài Gòn" required />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <FieldInput label="Chủ sở hữu" value={form.ownerName ?? ""} onChange={set("ownerName")}
              placeholder="Nguyễn Văn An" />
            <FieldInput label="Số điện thoại" value={form.phone ?? ""} onChange={set("phone")}
              placeholder="0901234567" type="tel" />
          </div>
          <FieldInput label="Email đăng nhập" value={form.email} onChange={set("email")}
            placeholder="owner@example.com" required type="email" />
          <FieldInput label="Mật khẩu quản trị mặc định" value={form.defaultAdminPassword}
            onChange={v => setForm(f => ({ ...f, defaultAdminPassword: v }))}
            placeholder="Admin@123456" required type="password"
            hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số" />

          <div className="grid grid-cols-2 gap-3.5">
            {/* Plan selector */}
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>Gói đăng ký</label>
              <select value={form.planId ?? ""} onChange={e => setForm(f => ({ ...f, planId: e.target.value || undefined }))}
                className="px-3 py-2 rounded-xl outline-none cursor-pointer"
                style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151" }}>
                <option value="">Không có (Trial)</option>
                {Object.entries(planMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <FieldInput label="Thời hạn (tháng)" value={form.durationMonths?.toString() ?? ""}
              onChange={v => setForm(f => ({ ...f, durationMonths: v ? Number(v) : undefined }))}
              placeholder="12" type="number" />
          </div>

          <button type="submit" disabled={mutation.isPending}
            className="mt-1 w-full py-2.5 rounded-xl font-bold disabled:opacity-60 transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
            {mutation.isPending ? "Đang tạo…" : "Tạo Tenant"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Tenant Modal ─────────────────────────────────────────────────────────

function EditTenantModal({ tenant, onClose, planMap }: { tenant: Tenant; onClose: () => void; planMap: Record<string, string> }) {
  const mutation = useUpdateTenant();
  const [form, setForm] = useState<UpdateTenantRequest>({
    name: tenant.name,
    ownerName: tenant.ownerName ?? "",
    email: tenant.email ?? "",
    phone: tenant.phone ?? "",
    status: tenant.status ?? "Active",
    planId: tenant.planId ?? "",
    adminAction: "Override",
    durationMonths: undefined,
  });

  const set = (k: keyof UpdateTenantRequest) => (v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: UpdateTenantRequest = {
      name: form.name,
      ownerName: form.ownerName?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      status: form.status,
      planId: form.planId?.trim() || undefined,
      adminAction: form.planId !== tenant.planId ? form.adminAction : undefined,
      durationMonths: form.durationMonths ? Number(form.durationMonths) : undefined,
    };
    mutation.mutate({ id: tenant.id, data: payload }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Chỉnh sửa: {tenant.name}</h3>
            <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Cập nhật thông tin và gói đăng ký</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3.5">
          <FieldInput label="Tên cửa hàng" value={form.name} onChange={set("name")} required />
          <div className="grid grid-cols-2 gap-3.5">
            <FieldInput label="Chủ sở hữu" value={form.ownerName ?? ""} onChange={set("ownerName")} />
            <FieldInput label="Số điện thoại" value={form.phone ?? ""} onChange={set("phone")} type="tel" />
          </div>
          <FieldInput label="Email" value={form.email ?? ""} onChange={set("email")} type="email" />

          <div className="grid grid-cols-2 gap-3.5">
            {/* Status */}
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>Trạng thái</label>
              <select value={form.status ?? ""} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 rounded-xl outline-none cursor-pointer"
                style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151" }}>
                {(["Active", "Trial", "Suspended", "Cancelled"] as TenantStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            {/* Plan */}
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>Gói đăng ký</label>
              <select value={form.planId ?? ""} onChange={e => setForm(f => ({ ...f, planId: e.target.value || undefined }))}
                className="px-3 py-2 rounded-xl outline-none cursor-pointer"
                style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151" }}>
                <option value="">Không có</option>
                {Object.entries(planMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AdminAction — only show when plan changed */}
          {form.planId !== (tenant.planId ?? "") && (
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>Kiểu thay đổi gói</label>
              <select value={form.adminAction ?? "Override"} onChange={e => setForm(f => ({ ...f, adminAction: e.target.value as UpdateTenantRequest["adminAction"] }))}
                className="px-3 py-2 rounded-xl outline-none cursor-pointer"
                style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151" }}>
                <option value="Override">Override (không xuất hóa đơn)</option>
                <option value="UpgradeWithInvoice">Nâng gói + xuất hóa đơn</option>
                <option value="DowngradeWithRefund">Hạ gói + hoàn tiền</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={mutation.isPending}
            className="mt-1 w-full py-2.5 rounded-xl font-bold disabled:opacity-60 transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
            {mutation.isPending ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Tenant Detail Modal ───────────────────────────────────────────────────────

function TenantDetailModal({ tenant, onClose, onEdit, onSuspend, onReactivate, onDelete, planMap }: {
  tenant: Tenant;
  onClose: () => void;
  onEdit: () => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onDelete: (id: string) => void;
  planMap: Record<string, string>;
}) {
  const planName = tenant.planId ? (planMap[tenant.planId] ?? tenant.planId.slice(0, 8)) : "—";
  const statusKey = (tenant.status ?? "Active") as TenantStatus;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.1)" }}>
            <Building2 className="w-5 h-5" style={{ color: "#2563EB" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>{tenant.name}</h2>
              <AdminStatusBadge status={STATUS_LABEL[statusKey]} type={STATUS_TYPE[statusKey]} />
            </div>
            <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>
              Mã: <span style={{ fontWeight: 600 }}>{tenant.code}</span> · Tham gia {new Date(tenant.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Info grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>LIÊN HỆ</p>
            <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{tenant.ownerName ?? "—"}</p>
            {[{ icon: Mail, val: tenant.email ?? "—" }, { icon: Phone, val: tenant.phone ?? "—" }].map(r => {
              const Icon = r.icon;
              return (
                <div key={r.val} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.75rem", color: "#374151" }}>{r.val}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>THANH TOÁN</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>
              {tenant.mrr > 0 ? vnd(tenant.mrr) : <span style={{ color: "#9ca3af", fontSize: "0.82rem" }}>Chưa có</span>}
              {tenant.mrr > 0 && <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#9ca3af" }}>/tháng</span>}
            </p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Gói {planName} · MRR</p>
          </div>
          {[
            { label: "ID TENANT", value: tenant.id.slice(0, 18) + "…" },
            { label: "MÃ TENANT", value: tenant.code },
          ].map(i => (
            <div key={i.label} className="px-4 py-3 rounded-xl" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{i.label}</p>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", marginTop: "2px", wordBreak: "break-all" }}>{i.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5 px-6 pb-6 pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <button onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ border: "1.5px solid #e5e7eb", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
            <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
          </button>
          {tenant.status === "Active" && (
            <button onClick={() => { onSuspend(tenant.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors ml-auto"
              style={{ border: "1.5px solid rgba(220,38,38,0.3)", fontSize: "0.8rem", fontWeight: 600, color: "#dc2626" }}>
              <Ban className="w-3.5 h-3.5" /> Tạm khóa
            </button>
          )}
          {tenant.status === "Suspended" && (
            <button onClick={() => { onReactivate(tenant.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl ml-auto"
              style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: "0.8rem", fontWeight: 700, border: "none" }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Kích hoạt lại
            </button>
          )}
          <button onClick={() => { onDelete(tenant.id); onClose(); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50"
            style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.8rem", color: "#dc2626" }}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function TenantsContent() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput]   = useState("");
  const [filterStatus, setFilterStatus] = useState<number | "">("");
  const [filterPlanId, setFilterPlanId] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected]   = useState<Tenant | null>(null);
  const [editing, setEditing]     = useState<Tenant | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; type: "suspend" | "reactivate" | "delete"; id: string; name: string;
  }>({ open: false, type: "suspend", id: "", name: "" });

  const { data: tenantsData, isLoading } = useTenants({
    pageNumber, pageSize: PAGE_SIZE,
    searchTerm: searchInput || undefined,
    status: filterStatus === "" ? undefined : filterStatus,
    planId: filterPlanId || undefined,
  });
  const { data: plansData } = usePlans({ pageSize: 100 });

  const tenants = tenantsData?.items ?? [];

  // planId → planName lookup
  const planMap: Record<string, string> = {};
  plansData?.items.forEach(p => { planMap[p.id] = p.name; });

  const suspendMutation    = useSuspendTenant();
  const reactivateMutation = useReactivateTenant();
  const deleteMutation     = useDeleteTenant();

  const openConfirm = (type: "suspend" | "reactivate" | "delete", id: string, name: string) => {
    setSelected(null);
    setConfirmDialog({ open: true, type, id, name });
  };

  const handleConfirm = () => {
    const { type, id } = confirmDialog;
    if (type === "suspend")         suspendMutation.mutate(id);
    else if (type === "reactivate") reactivateMutation.mutate(id);
    else                            deleteMutation.mutate(id);
    setConfirmDialog(d => ({ ...d, open: false }));
  };

  const hasFilters = filterStatus !== "" || !!filterPlanId || !!searchInput;

  function clearFilters() {
    setSearchInput("");
    setFilterStatus("");
    setFilterPlanId("");
    setPageNumber(1);
  }

  const stats = [
    { label: "Tổng Tenant",  value: tenantsData?.totalCount ?? "…",                                  icon: Users,         color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
    { label: "Hoạt động",    value: tenants.filter(t => t.status === "Active").length,                icon: CheckCircle2,  color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
    { label: "Dùng thử",     value: tenants.filter(t => t.status === "Trial").length,                 icon: Clock,         color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { label: "Tạm khóa",     value: tenants.filter(t => t.status === "Suspended").length,             icon: AlertTriangle, color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
  ];

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Danh sách Tenant</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {tenantsData ? `${tenantsData.totalCount} tenant` : "Đang tải…"}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
          <Plus className="w-4 h-4" /> Thêm Tenant
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white"
              style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
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

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 rounded-2xl"
        style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            ref={searchRef}
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setPageNumber(1); }}
            placeholder="Tìm theo tên cửa hàng, chủ sở hữu…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>

        {/* Status filter — sends integer */}
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value === "" ? "" : Number(e.target.value)); setPageNumber(1); }}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Dùng thử</option>
          <option value="2">Tạm khóa</option>
          <option value="3">Đã hủy</option>
        </select>

        {/* Plan filter */}
        <select
          value={filterPlanId}
          onChange={e => { setFilterPlanId(e.target.value); setPageNumber(1); }}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
          <option value="">Tất cả gói</option>
          {Object.entries(planMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>
            <X className="w-3.5 h-3.5" /> Xóa lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={8} /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                {["Tenant", "Gói", "Trạng thái", "MRR/tháng", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left"
                    style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t, i) => {
                const planName = t.planId ? (planMap[t.planId] ?? t.planId.slice(0, 8) + "…") : null;
                const statusKey = (t.status ?? "Active") as TenantStatus;
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    style={{ borderBottom: i < tenants.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                    onClick={() => setSelected(t)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(37,99,235,0.08)" }}>
                          <Building2 className="w-4 h-4" style={{ color: "#2563EB" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                          <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{t.code} · {t.ownerName ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {planName ? (
                        <span className="px-2 py-0.5 rounded-lg"
                          style={{ background: "rgba(37,99,235,0.07)", fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>
                          {planName}
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminStatusBadge status={STATUS_LABEL[statusKey]} type={STATUS_TYPE[statusKey]} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: t.mrr > 0 ? "#111827" : "#d1d5db" }}>
                        {vnd(t.mrr)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                          onClick={e => { e.stopPropagation(); setSelected(t); }}
                          title="Xem chi tiết">
                          <Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                          onClick={e => { e.stopPropagation(); setEditing(t); }}
                          title="Chỉnh sửa">
                          <Edit3 className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                        </button>
                        {t.status === "Active" && (
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                            onClick={e => { e.stopPropagation(); openConfirm("suspend", t.id, t.name); }}
                            title="Tạm khóa">
                            <Ban className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                          </button>
                        )}
                        {t.status === "Suspended" && (
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50"
                            onClick={e => { e.stopPropagation(); openConfirm("reactivate", t.id, t.name); }}
                            title="Kích hoạt lại">
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && tenants.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
            <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy tenant phù hợp.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(tenantsData?.totalCount ?? 0) > PAGE_SIZE && (
        <div className="flex items-center justify-between px-1">
          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
            Trang {tenantsData?.pageNumber} / {tenantsData?.totalPages} · {tenantsData?.totalCount} tenant
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={!tenantsData?.hasPreviousPage}
              onClick={() => setPageNumber(p => p - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              <ChevronLeft className="w-3.5 h-3.5" /> Trước
            </button>
            <button
              disabled={!tenantsData?.hasNextPage}
              onClick={() => setPageNumber(p => p + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              Tiếp <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateTenantModal onClose={() => setShowCreate(false)} planMap={planMap} />
      )}

      {editing && (
        <EditTenantModal
          tenant={editing}
          onClose={() => setEditing(null)}
          planMap={planMap}
        />
      )}

      {selected && !editing && (
        <TenantDetailModal
          tenant={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); }}
          onSuspend={(id) => openConfirm("suspend", id, selected.name)}
          onReactivate={(id) => openConfirm("reactivate", id, selected.name)}
          onDelete={(id) => openConfirm("delete", id, selected.name)}
          planMap={planMap}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.type === "suspend"    ? `Tạm khóa "${confirmDialog.name}"?` :
          confirmDialog.type === "reactivate" ? `Kích hoạt lại "${confirmDialog.name}"?` :
                                                `Xóa vĩnh viễn "${confirmDialog.name}"?`
        }
        description={
          confirmDialog.type === "suspend"    ? "Tenant sẽ không thể truy cập hệ thống cho đến khi được kích hoạt lại." :
          confirmDialog.type === "reactivate" ? "Tenant sẽ có thể đăng nhập và sử dụng dịch vụ bình thường." :
                                                "Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn."
        }
        confirmLabel={confirmDialog.type === "delete" ? "Xóa vĩnh viễn" : "Xác nhận"}
        destructive={confirmDialog.type === "delete"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog(d => ({ ...d, open: false }))}
      />
    </>
  );
}

export default function AdminTenantsPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell
        title="Quản lý Tenant"
        breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Tenant" }]}>
        <TenantsContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
