import { useState, useRef } from "react";
import {
  Search, Plus, X, Users, CheckCircle2,
  Mail, Trash2, ShieldCheck, ChevronLeft, ChevronRight, Ban, ShieldAlert,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminStatusBadge, SkeletonTable, ConfirmDialog } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useAdminUsers, useInviteAdmin, useUpdateAdminUser, useDeleteAdmin } from "@/hooks/admin/useAdminUsers";
import type { AdminUser, InviteAdminUserRequest } from "@/types/admin";
import "@/styles/fonts.css";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  staff: "Platform Staff",
};

const ROLE_COLOR: Record<string, string> = {
  super_admin: "#ea580c",
  staff: "#2563EB",
};

const ROLE_BG: Record<string, string> = {
  super_admin: "rgba(249,115,22,0.08)",
  staff: "rgba(37,99,235,0.08)",
};

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

function InviteAdminModal({ onClose }: { onClose: () => void }) {
  const inviteMutation = useInviteAdmin();
  const [form, setForm] = useState<InviteAdminUserRequest>({
    email: "",
    displayName: "",
    role: "staff",
    password: "",
  });

  const set = (k: keyof InviteAdminUserRequest) => (v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    inviteMutation.mutate(form, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
              <ShieldCheck className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Mời quản trị viên</h3>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Cấp quyền truy cập hệ thống PetTech</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3.5">
          <FieldInput label="Tên hiển thị" value={form.displayName} onChange={set("displayName")}
            placeholder="Nguyễn Văn Support" required />
          
          <FieldInput label="Email đăng nhập" value={form.email} onChange={set("email")}
            placeholder="staff@pettech.io" required type="email" />
          
          <FieldInput label="Mật khẩu khởi tạo" value={form.password || ""} onChange={set("password")}
            placeholder="Mật khẩu bảo mật" required type="password"
            hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số" />

          {/* Role selector */}
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>Vai trò hệ thống</label>
            <select value={form.role} onChange={e => set("role")(e.target.value)}
              className="px-3 py-2 rounded-xl outline-none cursor-pointer"
              style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151" }}>
              <option value="staff">Platform Staff (Nhân viên hỗ trợ)</option>
              <option value="super_admin">Super Admin (Quản trị toàn quyền)</option>
            </select>
          </div>

          <button type="submit" disabled={inviteMutation.isPending}
            className="mt-1 w-full py-2.5 rounded-xl font-bold disabled:opacity-60 transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
            {inviteMutation.isPending ? "Đang gửi lời mời…" : "Mời nhân viên"}
          </button>
        </form>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

function UsersContent() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput]   = useState("");
  const [filterRole, setFilterRole]     = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; type: "deactivate" | "activate" | "delete"; user: AdminUser | null;
  }>({ open: false, type: "deactivate", user: null });

  const { data: usersData, isLoading } = useAdminUsers({
    pageNumber, pageSize: PAGE_SIZE,
    searchTerm: searchInput || undefined,
    role: filterRole || undefined,
  });

  const users = usersData?.items ?? [];

  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdmin();

  const handleConfirmAction = () => {
    if (!confirmDialog.user) return;
    const { type, user } = confirmDialog;
    if (type === "delete") {
      deleteMutation.mutate(user.id);
    } else {
      const activeState = type === "activate";
      updateMutation.mutate({ id: user.id, data: { isActive: activeState } });
    }
    setConfirmDialog({ open: false, type: "deactivate", user: null });
  };

  const hasFilters = filterRole !== "" || !!searchInput;

  function clearFilters() {
    setSearchInput("");
    setFilterRole("");
    setPageNumber(1);
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Người dùng Admin</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {usersData ? `Tổng số ${usersData.totalCount} tài khoản vận hành` : "Đang tải…"}
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
          <Plus className="w-4 h-4" /> Mời Admin / Staff
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 rounded-2xl"
        style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            ref={searchRef}
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setPageNumber(1); }}
            placeholder="Tìm theo tên hiển thị, email…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>

        <select
          value={filterRole}
          onChange={e => { setFilterRole(e.target.value); setPageNumber(1); }}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
          <option value="">Tất cả vai trò</option>
          <option value="super_admin">Super Admin</option>
          <option value="staff">Platform Staff</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>
            <X className="w-3.5 h-3.5" /> Xóa lọc
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}>
                {["Tên & Email", "Vai trò", "Trạng thái", "Ngày gia nhập", "Đăng nhập cuối", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left"
                    style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50/20 transition-colors"
                    style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(37,99,235,0.08)" }}>
                          <Users className="w-4 h-4" style={{ color: "#2563EB" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{u.displayName || "Chưa thiết lập"}</p>
                          <p style={{ fontSize: "0.68rem", color: "#9ca3af" }} className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-lg"
                        style={{
                          background: ROLE_BG[u.role] ?? "rgba(0,0,0,0.05)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: ROLE_COLOR[u.role] ?? "#6b7280",
                        }}>
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminStatusBadge
                        status={u.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                        type={u.isActive ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("vi-VN") : "Chưa đăng nhập"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        {u.isActive ? (
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-orange-50 transition-colors"
                            onClick={() => setConfirmDialog({ open: true, type: "deactivate", user: u })}
                            title="Vô hiệu hóa">
                            <Ban className="w-3.5 h-3.5" style={{ color: "#ea580c" }} />
                          </button>
                        ) : (
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50 transition-colors"
                            onClick={() => setConfirmDialog({ open: true, type: "activate", user: u })}
                            title="Kích hoạt lại">
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                          </button>
                        )}
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                          onClick={() => setConfirmDialog({ open: true, type: "delete", user: u })}
                          title="Xóa tài khoản">
                          <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && users.length === 0 && (
          <div className="px-5 py-12 text-center">
            <ShieldAlert className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
            <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy nhân sự quản trị nào.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(usersData?.totalCount ?? 0) > PAGE_SIZE && (
        <div className="flex items-center justify-between px-1">
          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
            Trang {usersData?.pageNumber} / {usersData?.totalPages} · {usersData?.totalCount} nhân sự
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => p - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              <ChevronLeft className="w-3.5 h-3.5" /> Trước
            </button>
            <button
              disabled={pageNumber >= (usersData?.totalPages ?? 1)}
              onClick={() => setPageNumber(p => p + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              Tiếp <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <InviteAdminModal onClose={() => setShowInvite(false)} />
      )}

      {/* Confirmation dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.type === "deactivate" ? `Vô hiệu hóa "${confirmDialog.user?.displayName || confirmDialog.user?.email}"?` :
          confirmDialog.type === "activate" ? `Kích hoạt lại "${confirmDialog.user?.displayName || confirmDialog.user?.email}"?` :
                                                 `Xóa vĩnh viễn tài khoản "${confirmDialog.user?.displayName || confirmDialog.user?.email}"?`
        }
        description={
          confirmDialog.type === "deactivate" ? "Tài khoản sẽ không thể đăng nhập vào hệ thống Super Admin cho đến khi kích hoạt lại." :
          confirmDialog.type === "activate" ? "Cấp lại toàn bộ quyền vận hành hỗ trợ và cho phép đăng nhập trở lại." :
                                                 "Hành động này hoàn toàn không thể khôi phục. Toàn bộ lịch sử hành vi liên quan có thể bị ảnh hưởng."
        }
        confirmLabel={confirmDialog.type === "delete" ? "Xóa vĩnh viễn" : "Xác nhận"}
        destructive={confirmDialog.type === "delete"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, type: "deactivate", user: null })}
      />
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell
        title="Quản lý Người dùng"
        breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Người dùng" }]}>
        <UsersContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
