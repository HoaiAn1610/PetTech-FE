import { useState } from "react";
import {
  ShieldCheck, Shield, Plus, X, Mail,
  CheckCircle2, AlertTriangle, Trash2, Lock, Users, Clock,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminTable, AdminStatusBadge, SkeletonTable, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useAdminUsers, useInviteAdmin, useDeleteAdmin } from "@/hooks/admin/useAdminUsers";
import type { AdminUserRole, InviteAdminRequest } from "@/types/admin";
import "@/styles/fonts.css";

const ROLE_LABEL: Record<AdminUserRole, string> = {
  SuperAdmin:    "Super Admin",
  PlatformStaff: "Nhân viên hỗ trợ",
};

const ROLE_PERMS: Record<AdminUserRole, { perms: string[]; locked: string[] }> = {
  SuperAdmin: {
    perms: [
      "Toàn quyền truy cập nền tảng",
      "Quản lý Tenant",
      "Doanh thu & thanh toán",
      "Quản lý người dùng admin",
      "Cài đặt hệ thống",
      "Phiếu hỗ trợ",
      "Thống kê",
      "Mạo danh tenant",
    ],
    locked: [],
  },
  PlatformStaff: {
    perms: ["Phiếu hỗ trợ", "Thống kê (chỉ xem)", "Danh sách tenant (chỉ đọc)"],
    locked: ["Doanh thu & thanh toán", "Quản lý người dùng admin", "Cài đặt hệ thống", "Mạo danh tenant"],
  },
};

const AVATAR_COLORS = ["#7c3aed", "#2563EB", "#16a34a", "#f97316", "#06b6d4", "#dc2626"];

function InviteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<InviteAdminRequest>({ name: "", email: "", role: "PlatformStaff" });
  const inviteMutation = useInviteAdmin();

  function handleSend() {
    if (!form.name || !form.email) return;
    inviteMutation.mutate(form, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Mời người dùng admin</h2>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>Họ sẽ nhận email để thiết lập tài khoản</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { label: "HỌ VÀ TÊN",       key: "name",  ph: "Nguyễn Văn A",     type: "text"  },
            { label: "EMAIL CÔNG VIỆC",   key: "email", ph: "nguyen@pettech.io", type: "email" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{f.label}</label>
              <input
                type={f.type}
                value={(form as unknown as Record<string, string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.ph}
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
                onFocus={e => (e.target.style.borderColor = "#2563EB")}
                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>VAI TRÒ</label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {(["SuperAdmin", "PlatformStaff"] as AdminUserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setForm(p => ({ ...p, role: r }))}
                  className="flex flex-col gap-2 px-4 py-3 rounded-xl text-left transition-all"
                  style={{ border: form.role === r ? "2px solid #2563EB" : "1.5px solid #e5e7eb", background: form.role === r ? "rgba(37,99,235,0.04)" : "white" }}
                >
                  <div className="flex items-center gap-2">
                    {r === "SuperAdmin"
                      ? <ShieldCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                      : <Shield className="w-4 h-4" style={{ color: "#2563EB" }} />}
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{ROLE_LABEL[r]}</span>
                  </div>
                  <p style={{ fontSize: "0.62rem", color: "#9ca3af", lineHeight: 1.5 }}>
                    {r === "SuperAdmin"
                      ? "Toàn quyền truy cập tất cả tính năng admin bao gồm thanh toán và cài đặt hệ thống"
                      : "Chỉ truy cập hỗ trợ và thống kê — không có thanh toán hay cài đặt hệ thống"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Permission preview */}
          <div className="px-4 py-3 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.1)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>QUYỀN ĐƯỢC CẤP</p>
            <div className="flex flex-col gap-1.5">
              {ROLE_PERMS[form.role].perms.map(p => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: "#16a34a" }} />
                  <span style={{ fontSize: "0.72rem", color: "#374151" }}>{p}</span>
                </div>
              ))}
              {ROLE_PERMS[form.role].locked.map(p => (
                <div key={p} className="flex items-center gap-2">
                  <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "#d1d5db" }} />
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={!form.name || !form.email || inviteMutation.isPending}
            onClick={handleSend}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-1"
            style={{
              background: form.name && form.email ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb",
              color: form.name && form.email ? "white" : "#9ca3af",
              fontWeight: 700, fontSize: "0.88rem",
              boxShadow: form.name && form.email ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
            }}
          >
            <Mail className="w-4 h-4" />
            {inviteMutation.isPending ? "Đang gửi…" : "Gửi lời mời"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersContent() {
  const [showInvite, setShowInvite] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: users = [], isLoading } = useAdminUsers();
  const deleteMutation = useDeleteAdmin("");

  const totalCount    = users.length;
  const activeCount   = users.filter(u => u.status === "Active").length;
  const inactiveCount = users.filter(u => u.status === "Inactive").length;
  const totalTickets  = users.reduce((s, u) => s + (u.ticketsHandled ?? 0), 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Người dùng Admin</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Quản lý người dùng nội bộ và vai trò của họ</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
        >
          <Plus className="w-3.5 h-3.5" /> Mời người dùng
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Tổng người dùng admin" value={String(totalCount)} sub={`${users.filter(u => u.role === "PlatformStaff").length} nhân viên · ${users.filter(u => u.role === "SuperAdmin").length} admin`} icon={Users} color="#2563EB" bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang hoạt động"        value={String(activeCount)}   sub="Đăng nhập trong 7 ngày"    icon={CheckCircle2}  color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="Phiếu hỗ trợ đã xử lý" value={String(totalTickets)}  sub="Tổng cộng mọi nhân viên"  icon={Clock}         color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <AdminKPICard label="Không hoạt động"       value={String(inactiveCount)} sub=">30 ngày không đăng nhập" icon={AlertTriangle}  color="#f97316" bg="rgba(249,115,22,0.08)" />
      </div>

      {/* User table */}
      <AdminCard>
        <AdminCardHeader title="Danh sách người dùng" subtitle="Tất cả tài khoản admin và nhân viên hỗ trợ" />
        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <AdminTable headers={["Người dùng", "Vai trò", "Trạng thái", "Phiếu hỗ trợ", "Đăng nhập cuối", "Tham gia", ""]}>
            {users.map((u, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 800, color }}>{initials}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{u.name}</p>
                        <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: u.role === "SuperAdmin" ? "rgba(124,58,237,0.08)" : "rgba(37,99,235,0.08)", display: "inline-flex" }}>
                      {u.role === "SuperAdmin"
                        ? <ShieldCheck className="w-3 h-3" style={{ color: "#7c3aed" }} />
                        : <Shield className="w-3 h-3" style={{ color: "#2563EB" }} />}
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: u.role === "SuperAdmin" ? "#7c3aed" : "#2563EB" }}>{ROLE_LABEL[u.role]}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <AdminStatusBadge status={u.status === "Active" ? "Hoạt động" : "Không hoạt động"} type={u.status === "Active" ? "success" : "neutral"} />
                  </td>
                  <td className="py-3 pr-4">
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>{u.ticketsHandled ?? 0}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{new Date(u.lastLoginAt).toLocaleString("vi-VN")}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Chưa có người dùng admin nào.
                </td>
              </tr>
            )}
          </AdminTable>
        )}
      </AdminCard>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa người dùng admin"
        description={`Bạn có chắc muốn xóa "${deleteTarget?.name ?? ""}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Người dùng" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Người dùng" }]}>
        <UsersContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
