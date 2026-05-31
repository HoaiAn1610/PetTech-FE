import { useState } from "react";
import { Plus, X, Mail, Users, Send, Calendar, Zap } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, AdminKPICard, AdminStatusBadge, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useCampaigns, useCreateCampaign, useSegments } from "@/hooks/admin/useCrm";
import type { CampaignStatus, CampaignTrigger, CampaignChannel, CreateCampaignRequest } from "@/types/admin";
import "@/styles/fonts.css";

const STATUS_LABEL: Record<CampaignStatus, string> = {
  Active:    "Đang chạy",
  Draft:     "Nháp",
  Scheduled: "Đã lên lịch",
};

const STATUS_TYPE: Record<CampaignStatus, "success" | "neutral" | "info"> = {
  Active:    "success",
  Draft:     "neutral",
  Scheduled: "info",
};

const TRIGGER_LABEL: Record<CampaignTrigger, string> = {
  manual:    "Thủ công",
  scheduled: "Định kỳ",
};

const TRIGGER_ICON: Record<CampaignTrigger, typeof Zap> = {
  manual:    Send,
  scheduled: Calendar,
};

function CreateCampaignModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateCampaign();
  const [scheduledAt, setScheduledAt] = useState("");
  const [form, setForm] = useState<CreateCampaignRequest>({
    name:        "",
    type:        "Custom",
    triggerType: "manual",
    channel:     "email",
  });

  function handleCreate() {
    if (!form.name.trim()) return;
    createMutation.mutate(form, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Tạo chiến dịch mới</h2>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>Tiếp cận tenant qua Email</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>TÊN CHIẾN DỊCH</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Vd: Thông báo tính năng mới tháng 5"
              className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
              onFocus={e => (e.target.style.borderColor = "#2563EB")}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Trigger type */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>LOẠI KÍCH HOẠT</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {(["manual", "scheduled"] as CampaignTrigger[]).map(t => {
                const Icon = TRIGGER_ICON[t];
                return (
                  <button
                    key={t}
                    onClick={() => setForm(p => ({ ...p, triggerType: t }))}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl transition-all"
                    style={{ border: form.triggerType === t ? "2px solid #2563EB" : "1.5px solid #e5e7eb", background: form.triggerType === t ? "rgba(37,99,235,0.04)" : "white" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: form.triggerType === t ? "#2563EB" : "#9ca3af" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: form.triggerType === t ? "#2563EB" : "#6b7280" }}>{TRIGGER_LABEL[t]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>KÊNH GỬI</label>
            <select
              value={form.channel ?? "email"}
              onChange={e => setForm(p => ({ ...p, channel: e.target.value as CampaignChannel }))}
              className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
            >
              <option value="email">Email</option>
            </select>
          </div>

          {/* Scheduled at */}
          {form.triggerType === "scheduled" && (
            <div>
              <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>THỜI ĐIỂM GỬI</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl outline-none mt-1.5"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#111827" }}
              />
            </div>
          )}

          <button
            disabled={!form.name.trim() || createMutation.isPending}
            onClick={handleCreate}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-1"
            style={{
              background: form.name.trim() ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb",
              color: form.name.trim() ? "white" : "#9ca3af",
              fontWeight: 700, fontSize: "0.88rem",
              boxShadow: form.name.trim() ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
            }}
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? "Đang tạo…" : "Tạo chiến dịch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CrmContent() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns();
  const { data: segmentsData, isLoading: segmentsLoading } = useSegments();

  const campaigns = campaignsData?.items ?? [];
  const segments  = segmentsData?.items ?? [];

  const activeCount    = campaigns.filter(c => c.status === "Active").length;
  const scheduledCount = campaigns.filter(c => c.status === "Scheduled").length;
  const totalRecipients = campaigns.reduce((s, c) => s + (c.stats?.totalSent ?? 0), 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>CRM & Chiến dịch</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Quản lý chiến dịch email và phân khúc khách hàng</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
        >
          <Plus className="w-3.5 h-3.5" /> Chiến dịch mới
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Chiến dịch đang chạy" value={String(activeCount)}     sub="Đang gửi"          icon={Send}  color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="Đã lên lịch"          value={String(scheduledCount)}  sub="Chờ gửi"           icon={Calendar} color="#2563EB" bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Tổng người nhận"      value={totalRecipients.toLocaleString()} sub="Từ tất cả chiến dịch" icon={Users} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
        <AdminKPICard label="Phân khúc"            value={String(segments.length)} sub="Nhóm khách hàng"    icon={Mail}  color="#f97316" bg="rgba(249,115,22,0.08)" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Campaigns list */}
        <div className="col-span-2">
          <AdminCard>
            <AdminCardHeader title="Danh sách chiến dịch" />
            {campaignsLoading ? (
              <SkeletonCard lines={5} />
            ) : campaigns.length === 0 ? (
              <div className="py-10 text-center">
                <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
                <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Chưa có chiến dịch nào.</p>
                <button onClick={() => setShowCreate(true)} className="mt-3 px-4 py-2 rounded-xl" style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", border: "1px solid rgba(37,99,235,0.15)" }}>
                  Tạo chiến dịch đầu tiên
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {campaigns.map(campaign => {
                  const Icon = campaign.triggerType ? TRIGGER_ICON[campaign.triggerType] : Send;
                  return (
                    <div key={campaign.id} className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                        <Mail className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{campaign.name}</p>
                          {campaign.status && <AdminStatusBadge status={STATUS_LABEL[campaign.status]} type={STATUS_TYPE[campaign.status]} />}
                        </div>
                        <div className="flex items-center gap-3">
                          {campaign.triggerType && (
                            <div className="flex items-center gap-1">
                              <Icon className="w-3 h-3" style={{ color: "#9ca3af" }} />
                              <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{TRIGGER_LABEL[campaign.triggerType]}</span>
                            </div>
                          )}
                          <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>·</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" style={{ color: "#9ca3af" }} />
                            <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{(campaign.stats?.totalSent ?? 0).toLocaleString()} đã gửi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Segments */}
        <AdminCard>
          <AdminCardHeader title="Phân khúc khách hàng" />
          {segmentsLoading ? (
            <SkeletonCard lines={4} />
          ) : segments.length === 0 ? (
            <div className="py-8 text-center">
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có phân khúc nào.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {segments.map(seg => {
                const maxCount = Math.max(...segments.map(s => s.customerCount), 1);
                const pct = Math.round(seg.customerCount / maxCount * 100);
                return (
                  <div key={seg.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{seg.name}</p>
                        <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{seg.customerCount} khách hàng{seg.isAuto ? " · Tự động" : ""}</p>
                      </div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#374151" }}>{seg.customerCount}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "#2563EB" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>
      </div>

      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} />}
    </>
  );
}

export default function AdminCrmPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="CRM" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "CRM" }]}>
        <CrmContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
