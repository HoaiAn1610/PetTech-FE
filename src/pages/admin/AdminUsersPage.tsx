import { useState } from "react";
import {
  ShieldCheck, Shield, Plus, X, Mail, Clock,
  CheckCircle2, AlertTriangle, Edit3, Trash2,
  Lock, Eye, EyeOff, Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminTable, AdminStatusBadge } from "@/components/admin/AdminWidgets";
import "@/styles/fonts.css";

const ADMIN_USERS = [
  { id: "u1", name: "System Admin", email: "admin@pettech.io",  role: "admin", status: "Hoạt động",      lastLogin: "6/3/2026 · 9:00 SA",   tickets: 12, joined: "1/1/2024",   avatar: "SA", color: "#7c3aed" },
  { id: "u2", name: "Sarah Chen",   email: "sarah@pettech.io",  role: "staff", status: "Hoạt động",      lastLogin: "6/3/2026 · 8:35 SA",   tickets: 34, joined: "15/3/2025", avatar: "SC", color: "#2563EB" },
  { id: "u3", name: "Mike Torres",  email: "mike@pettech.io",   role: "staff", status: "Hoạt động",      lastLogin: "5/3/2026 · 5:12 CH",   tickets: 28, joined: "22/5/2025", avatar: "MT", color: "#16a34a" },
  { id: "u4", name: "Priya Nair",   email: "priya@pettech.io",  role: "staff", status: "Không hoạt động",lastLogin: "10/2/2026 · 3:00 CH",  tickets: 9,  joined: "3/8/2025",  avatar: "PN", color: "#f97316" },
  { id: "u5", name: "James Liu",    email: "james@pettech.io",  role: "admin", status: "Hoạt động",      lastLogin: "6/3/2026 · 7:50 SA",   tickets: 5,  joined: "1/10/2025", avatar: "JL", color: "#7c3aed" },
];

const ROLE_PERMS: Record<string, { label: string; perms: string[]; locked: string[] }> = {
  admin: {
    label: "Super Admin",
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
  staff: {
    label: "Nhân viên hỗ trợ",
    perms: [
      "Phiếu hỗ trợ",
      "Thống kê (chỉ xem)",
      "Danh sách tenant (chỉ đọc)",
    ],
    locked: [
      "Doanh thu & thanh toán",
      "Quản lý người dùng admin",
      "Cài đặt hệ thống",
      "Mạo danh tenant",
    ],
  },
};

function InviteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden p-8 flex flex-col items-center gap-5 text-center" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(22,163,74,0.1)" }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Đã gửi lời mời!</h2>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "6px" }}>Đã gửi email mời đến <strong>{form.email}</strong> với vai trò <strong>{ROLE_PERMS[form.role].label}</strong>.</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700 }}>Xong</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Mời người dùng admin</h2>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>Họ sẽ nhận email để thiết lập tài khoản</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="w-4 h-4" style={{ color: "#6b7280" }} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { label: "HỌ VÀ TÊN", key: "name", ph: "Nguyễn Văn A", type: "text" },
            { label: "EMAIL CÔNG VIỆC", key: "email", ph: "nguyen@pettech.io", type: "email" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{f.label}</label>
              <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5" style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
                onFocus={e => (e.target.style.borderColor = "#2563EB")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
          ))}

          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>VAI TRÒ</label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {(["admin", "staff"] as const).map(r => (
                <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))} className="flex flex-col gap-2 px-4 py-3 rounded-xl text-left transition-all" style={{ border: form.role === r ? "2px solid #2563EB" : "1.5px solid #e5e7eb", background: form.role === r ? "rgba(37,99,235,0.04)" : "white" }}>
                  <div className="flex items-center gap-2">
                    {r === "admin" ? <ShieldCheck className="w-4 h-4" style={{ color: "#7c3aed" }} /> : <Shield className="w-4 h-4" style={{ color: "#2563EB" }} />}
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{ROLE_PERMS[r].label}</span>
                  </div>
                  <p style={{ fontSize: "0.62rem", color: "#9ca3af", lineHeight: 1.5 }}>
                    {r === "admin" ? "Toàn quyền truy cập tất cả tính năng admin bao gồm thanh toán và cài đặt hệ thống" : "Chỉ truy cập hỗ trợ và thống kê — không có thanh toán hay cài đặt hệ thống"}
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
                <div key={p} className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: "#16a34a" }} /><span style={{ fontSize: "0.72rem", color: "#374151" }}>{p}</span></div>
              ))}
              {ROLE_PERMS[form.role].locked.map(p => (
                <div key={p} className="flex items-center gap-2"><Lock className="w-3 h-3 flex-shrink-0" style={{ color: "#d1d5db" }} /><span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{p}</span></div>
              ))}
            </div>
          </div>

          <button disabled={!form.name || !form.email} onClick={() => setSent(true)} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-1" style={{ background: form.name && form.email ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb", color: form.name && form.email ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.88rem", boxShadow: form.name && form.email ? "0 4px 14px rgba(37,99,235,0.3)" : "none" }}>
            <Mail className="w-4 h-4" /> Gửi lời mời
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <AdminPageShell title="Người dùng" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Người dùng" }]}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Người dùng Admin</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Quản lý người dùng nội bộ và vai trò của họ</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
          <Plus className="w-3.5 h-3.5" /> Mời người dùng
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Tổng người dùng admin" value="5"  sub="3 nhân viên · 2 admin" icon={Users}      color="#2563EB" bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang hoạt động"        value="4"  sub="Đăng nhập trong 7 ngày"  icon={CheckCircle2} color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="Phiếu hỗ trợ đã xử lý" value="88" sub="Tổng cộng mọi nhân viên" icon={Clock}     color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <AdminKPICard label="Không hoạt động"       value="1"  sub=">30 ngày không đăng nhập" icon={AlertTriangle} color="#f97316" bg="rgba(249,115,22,0.08)" />
      </div>

      {/* User table */}
      <AdminCard>
        <AdminCardHeader title="Danh sách người dùng" subtitle="Tất cả tài khoản admin và nhân viên hỗ trợ" />
        <AdminTable headers={["Người dùng", "Vai trò", "Trạng thái", "Phiếu hỗ trợ", "Đăng nhập cuối", "Tham gia", ""]}>
          {ADMIN_USERS.map((u, i) => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: i < ADMIN_USERS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${u.color}15` }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: u.color }}>{u.avatar}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{u.name}</p>
                    <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: u.role === "admin" ? "rgba(124,58,237,0.08)" : "rgba(37,99,235,0.08)", display: "inline-flex" }}>
                  {u.role === "admin" ? <ShieldCheck className="w-3 h-3" style={{ color: "#7c3aed" }} /> : <Shield className="w-3 h-3" style={{ color: "#2563EB" }} />}
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: u.role === "admin" ? "#7c3aed" : "#2563EB" }}>{ROLE_PERMS[u.role].label}</span>
                </span>
              </td>
              <td className="py-3 pr-4">
                <AdminStatusBadge 
                  status={u.status} 
                  type={u.status === "Hoạt động" ? "success" : "neutral"} 
                />
              </td>
              <td className="py-3 pr-4">
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>{u.tickets}</span>
              </td>
              <td className="py-3 pr-4">
                <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{u.lastLogin}</span>
              </td>
              <td className="py-3 pr-4">
                <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{u.joined}</span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" disabled={u.role === "admin" && u.id === "u1"}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: u.role === "admin" && u.id === "u1" ? "#d1d5db" : "#6b7280" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </AdminPageShell>
  );
}
