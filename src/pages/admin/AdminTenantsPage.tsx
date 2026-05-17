import { useState, useMemo } from "react";
import {
  Search, Plus, Filter, X, Users, CheckCircle2, Clock,
  AlertTriangle, MoreHorizontal, ChevronRight, Mail,
  Phone, Globe, Calendar, CreditCard, Edit3, Trash2,
  Eye, Shield, ArrowUpRight, RefreshCw, Ban,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminTable, AdminStatusBadge } from "@/components/admin/AdminWidgets";
import "@/styles/fonts.css";

type AdminRole = "admin" | "staff";

const PLAN_STYLES: Record<string, { bg: string; text: string }> = {
  "Starter":    { bg: "rgba(107,114,128,0.08)", text: "#6b7280" },
  "Growth":     { bg: "rgba(37,99,235,0.08)",   text: "#2563EB" },
  "Enterprise": { bg: "rgba(124,58,237,0.08)",  text: "#7c3aed" },
  "Trial":      { bg: "rgba(249,115,22,0.08)",  text: "#ea580c" },
};

const TENANTS = [
  { id: "T-00142", name: "Paws & Claws Clinic",          owner: "BS. Sarah Lee",    email: "sarah@pawsclaws.com",     phone: "+1 555-0142", plan: "Growth",     status: "Hoạt động", mrr: 300, joined: "14/1/2025",  lastLogin: "6/3/2026",  staff: 8,  bookings: 1240 },
  { id: "T-00198", name: "Happy Tails Animal Hospital",  owner: "BS. Tom Harris",   email: "tom@happytails.vet",      phone: "+1 555-0198", plan: "Trial",      status: "Dùng thử",  mrr: 0,   joined: "6/3/2026",   lastLogin: "6/3/2026",  staff: 3,  bookings: 12   },
  { id: "T-00089", name: "Furever Vet Clinic",           owner: "BS. Ana Torres",   email: "ana@furevervet.com",      phone: "+1 555-0089", plan: "Enterprise", status: "Hoạt động", mrr: 600, joined: "3/8/2024",   lastLogin: "5/3/2026",  staff: 22, bookings: 4320 },
  { id: "T-00156", name: "PetCare Express",              owner: "BS. James Kim",    email: "james@petcareexp.com",    phone: "+1 555-0156", plan: "Enterprise", status: "Hoạt động", mrr: 600, joined: "9/10/2024",  lastLogin: "6/3/2026",  staff: 18, bookings: 3870 },
  { id: "T-00201", name: "Gentle Paws Veterinary",       owner: "BS. Maria Santos", email: "maria@gentlepaws.vet",    phone: "+1 555-0201", plan: "Starter",    status: "Hoạt động", mrr: 50,  joined: "1/3/2026",   lastLogin: "4/3/2026",  staff: 2,  bookings: 45   },
  { id: "T-00063", name: "Urban Animal Clinic",          owner: "BS. Chris Park",   email: "chris@urbananimal.com",   phone: "+1 555-0063", plan: "Growth",     status: "Hoạt động", mrr: 300, joined: "22/5/2024",  lastLogin: "6/3/2026",  staff: 11, bookings: 2100 },
  { id: "T-00177", name: "Vet Harmony Clinic",           owner: "BS. Lisa Wong",    email: "lisa@vetharmony.com",     phone: "+1 555-0177", plan: "Growth",     status: "Tạm khóa",  mrr: 0,   joined: "11/11/2024", lastLogin: "20/2/2026", staff: 7,  bookings: 890  },
  { id: "T-00034", name: "All Creatures Vet Center",     owner: "BS. Ben Clark",    email: "ben@allcreatures.vet",    phone: "+1 555-0034", plan: "Starter",    status: "Hoạt động", mrr: 50,  joined: "3/3/2024",   lastLogin: "5/3/2026",  staff: 2,  bookings: 560  },
  { id: "T-00210", name: "NovaPet Animal Hospital",      owner: "BS. Emma Davis",   email: "emma@novapet.com",        phone: "+1 555-0210", plan: "Trial",      status: "Dùng thử",  mrr: 0,   joined: "4/3/2026",   lastLogin: "5/3/2026",  staff: 4,  bookings: 8    },
  { id: "T-00121", name: "Clearview Vet Group",          owner: "BS. Noah Martin",  email: "noah@clearviewvet.com",   phone: "+1 555-0121", plan: "Enterprise", status: "Hoạt động", mrr: 600, joined: "17/9/2024",  lastLogin: "6/3/2026",  staff: 31, bookings: 5610 },
  { id: "T-00008", name: "Sunrise Animal Clinic",        owner: "BS. Olivia Reed",  email: "olivia@sunrisevet.com",   phone: "+1 555-0008", plan: "Starter",    status: "Đã hủy",    mrr: 0,   joined: "8/1/2024",   lastLogin: "20/1/2026", staff: 1,  bookings: 210  },
  { id: "T-00188", name: "PetHealth Partners",           owner: "BS. Lucas White",  email: "lucas@pethealth.com",     phone: "+1 555-0188", plan: "Growth",     status: "Hoạt động", mrr: 300, joined: "5/12/2024",  lastLogin: "6/3/2026",  staff: 9,  bookings: 1780 },
];

function TenantModal({ tenant, onClose, adminRole }: { tenant: typeof TENANTS[0]; onClose: () => void; adminRole: AdminRole }) {
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
              <AdminStatusBadge 
                status={tenant.status} 
                type={tenant.status === "Hoạt động" ? "success" : tenant.status === "Dùng thử" ? "warning" : tenant.status === "Tạm khóa" ? "error" : "neutral"} 
              />
              <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, fontSize: "0.65rem", fontWeight: 700, color: p.text }}>{tenant.plan}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>ID: {tenant.id} · Tham gia {tenant.joined}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="w-4 h-4" style={{ color: "#6b7280" }} /></button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {/* Contact */}
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>LIÊN HỆ</p>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{tenant.owner}</p>
            {[{ icon: Mail, val: tenant.email }, { icon: Phone, val: tenant.phone }].map(r => {
              const Icon = r.icon;
              return <div key={r.val} className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} /><span style={{ fontSize: "0.75rem", color: "#374151" }}>{r.val}</span></div>;
            })}
          </div>
          {/* Billing */}
          <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>THANH TOÁN</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>${tenant.mrr}<span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#9ca3af" }}>/tháng</span></p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Gói {tenant.plan} · MRR</p>
          </div>
          {/* Usage */}
          {[
            { label: "TÀI KHOẢN NHÂN VIÊN", value: tenant.staff.toString() },
            { label: "TỔNG LỊCH HẸN",       value: tenant.bookings.toLocaleString() },
            { label: "ĐĂNG NHẬP LẦN CUỐI",  value: tenant.lastLogin },
            { label: "THÀNH VIÊN TỪ",        value: tenant.joined },
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
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1.5px solid #e5e7eb", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
              <Eye className="w-3.5 h-3.5" /> Mạo danh
            </button>
            {tenant.status === "Hoạt động" && (
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors ml-auto" style={{ border: "1.5px solid rgba(220,38,38,0.3)", fontSize: "0.8rem", fontWeight: 600, color: "#dc2626" }}>
                <Ban className="w-3.5 h-3.5" /> Tạm khóa
              </button>
            )}
            {tenant.status === "Tạm khóa" && (
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl ml-auto" style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: "0.8rem", fontWeight: 700 }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Kích hoạt lại
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTenantsPage() {
  const [search, setSearch]             = useState("");
  const [filterPlan, setFilterPlan]     = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [selected, setSelected]         = useState<typeof TENANTS[0] | null>(null);
  const pageRole = (sessionStorage.getItem("adminRole") as AdminRole) || "admin";

  const filtered = useMemo(() => TENANTS.filter(t => {
    const ms  = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.owner.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const mp  = filterPlan === "Tất cả" || t.plan === filterPlan;
    const mst = filterStatus === "Tất cả" || t.status === filterStatus;
    return ms && mp && mst;
  }), [search, filterPlan, filterStatus]);

  const stats = [
    { label: "Tổng Tenant",    value: TENANTS.length,                                   icon: Users,        color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
    { label: "Hoạt động",      value: TENANTS.filter(t => t.status === "Hoạt động").length, icon: CheckCircle2, color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
    { label: "Dùng thử",       value: TENANTS.filter(t => t.status === "Dùng thử").length,  icon: Clock,        color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { label: "Tạm khóa",       value: TENANTS.filter(t => t.status === "Tạm khóa").length,  icon: AlertTriangle,color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
  ];

  return (
    <AdminPageShell title="Qu\u1ea3n l\u00fd Tenant" breadcrumbs={[{ label: "C\u1ed5ng qu\u1ea3n tr\u1ecb", href: "/admin" }, { label: "Tenant" }]}>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Danh sách Tenant</h2>
                <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>{TENANTS.length} tenant · Hiển thị {filtered.length}</p>
              </div>
              {pageRole === "admin" && (
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                  <Plus className="w-4 h-4" /> Thêm Tenant
                </button>
              )}
            </div>

            {/* Stats */}
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

            {/* Filters */}
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên phòng khám, chủ sở hữu hoặc ID…" className="w-full pl-9 pr-4 py-2 rounded-xl outline-none" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }} />
              </div>
              {[
                { label: "Gói", value: filterPlan, set: setFilterPlan, opts: ["Tất cả", "Starter", "Growth", "Enterprise", "Trial"] },
                { label: "Trạng thái", value: filterStatus, set: setFilterStatus, opts: ["Tất cả", "Hoạt động", "Dùng thử", "Tạm khóa", "Đã hủy"] },
              ].map(f => (
                <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)} className="appearance-none px-3 py-2 rounded-xl outline-none cursor-pointer" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              {(search || filterPlan !== "Tất cả" || filterStatus !== "Tất cả") && (
                <button onClick={() => { setSearch(""); setFilterPlan("Tất cả"); setFilterStatus("Tất cả"); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626", border: "1.5px solid rgba(220,38,38,0.2)" }}>
                  <X className="w-3.5 h-3.5" /> Xóa lọc
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <AdminTable headers={["Tenant", "Gói", "Trạng thái", "MRR", "Nhân viên", "Lịch hẹn", "Đăng nhập cuối", ""]}>
              {filtered.map((t, i) => {
                const p = PLAN_STYLES[t.plan];
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                    onClick={() => setSelected(t)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                          <span style={{ fontSize: "0.85rem" }}>🏥</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                          <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{t.id} · {t.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-lg" style={{ background: p.bg, fontSize: "0.68rem", fontWeight: 700, color: p.text }}>{t.plan}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminStatusBadge 
                        status={t.status} 
                        type={t.status === "Hoạt động" ? "success" : t.status === "Dùng thử" ? "warning" : t.status === "Tạm khóa" ? "error" : "neutral"} 
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: t.mrr > 0 ? "#111827" : "#9ca3af" }}>{t.mrr > 0 ? `$${t.mrr}` : "—"}</span>
                    </td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", color: "#374151" }}>{t.staff}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", color: "#374151" }}>{t.bookings.toLocaleString()}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{t.lastLogin}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} /></button>
                        {pageRole === "admin" && <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"><MoreHorizontal className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy tenant phù hợp với bộ lọc.</p>
                </div>
              )}
            </div>
      {selected && <TenantModal tenant={selected} onClose={() => setSelected(null)} adminRole={pageRole} />}
    </AdminPageShell>
  );
}


