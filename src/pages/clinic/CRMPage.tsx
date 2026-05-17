import { useState } from "react";
import {
  Users, Plus, CheckCircle2, TrendingUp, Activity, Heart,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { SegmentGrid } from "@/features/clinic/crm/SegmentGrid";
import { CampaignTable } from "@/features/clinic/crm/CampaignTable";
import { ClientTable } from "@/features/clinic/crm/ClientTable";
import { NewCampaignModal } from "@/features/clinic/crm/NewCampaignModal";
import "@/styles/fonts.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SEGMENTS = [
  { id: "s1", name: "Vaccine sắp đến hạn",       count: 48, color: "#f97316", bg: "rgba(249,115,22,0.08)",  icon: "💉", desc: "Thú cưng quá hạn hoặc đến hạn trong 30 ngày",   churnRisk: 0.34, active: true  },
  { id: "s2", name: "Khách hàng giá trị cao",    count: 31, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", icon: "⭐", desc: "Khách hàng có LTV > $800",                         churnRisk: 0.08, active: true  },
  { id: "s3", name: "Không hoạt động 45+ ngày",  count: 22, color: "#dc2626", bg: "rgba(220,38,38,0.08)",  icon: "😴", desc: "Chưa khám trong 45 ngày qua",                    churnRisk: 0.62, active: true  },
  { id: "s4", name: "Khách mới (30 ngày)",        count: 17, color: "#2563EB", bg: "rgba(37,99,235,0.08)",  icon: "🆕", desc: "Lần khám đầu tiên trong tháng qua",               churnRisk: 0.21, active: true  },
  { id: "s5", name: "Theo dõi sau phẫu thuật",   count: 9,  color: "#0891b2", bg: "rgba(8,145,178,0.08)",  icon: "🏥", desc: "Thú cưng đang hồi phục cần kiểm tra",            churnRisk: 0.11, active: false },
  { id: "s6", name: "Tháng sinh nhật 🎂",          count: 14, color: "#16a34a", bg: "rgba(22,163,74,0.08)",  icon: "🎂", desc: "Thú cưng có sinh nhật trong tháng này",         churnRisk: 0.05, active: true  },
];

const CAMPAIGNS = [
  { id: "c1", name: "Nhắc nhở Vaccine hàng loạt", segment: "Vaccine sắp đến hạn",     channel: "email+sms", status: "active" as const, sent: 218, openRate: 79, clickRate: 34, lastRun: "6 Th3, 2026"  },
  { id: "c2", name: "Thu hút lại: KH không hoạt động", segment: "Không hoạt động 45+ ngày", channel: "email", status: "active" as const, sent: 64, openRate: 42, clickRate: 18, lastRun: "4 Th3, 2026"  },
  { id: "c3", name: "Chuỗi chào mừng: Khách mới",      segment: "Khách mới (30 ngày)",       channel: "email", status: "active" as const, sent: 51, openRate: 88, clickRate: 61, lastRun: "5 Th3, 2026"  },
  { id: "c4", name: "Ưu đãi khách VIP",                 segment: "Khách hàng giá trị cao",    channel: "email+sms", status: "paused" as const, sent: 93, openRate: 71, clickRate: 45, lastRun: "28 Th2, 2026" },
  { id: "c5", name: "Chúc mừng sinh nhật 🎂",           segment: "Tháng sinh nhật 🎂",         channel: "sms",   status: "active" as const, sent: 14, openRate: 0,  clickRate: 0,  lastRun: "1 Th3, 2026"  },
];

const CLIENTS = [
  { id: "cl1", name: "Maria Santos", email: "maria@email.com", ltv: 1240, visits: 18, score: 94, lastVisit: "7/3", churn: "Thấp", pet: "Bella (Chó)" },
  { id: "cl2", name: "Lisa Park", email: "lisa@email.com", ltv: 980, visits: 14, score: 88, lastVisit: "5/3", churn: "Thấp", pet: "Coco (Chó)" },
  { id: "cl3", name: "Alex Wong", email: "alex@email.com", ltv: 760, visits: 11, score: 82, lastVisit: "4/3", churn: "Thấp", pet: "Luna (Mèo)" },
  { id: "cl4", name: "James Kim", email: "james@email.com", ltv: 540, visits: 7, score: 68, lastVisit: "14/2", churn: "Trung bình", pet: "Mochi (Mèo)" },
  { id: "cl5", name: "Emma Davis", email: "emma@email.com", ltv: 310, visits: 4, score: 41, lastVisit: "20/1", churn: "Cao", pet: "Charlie (Chó)" },
  { id: "cl6", name: "Carlos Reyes", email: "carlos@email.com", ltv: 620, visits: 9, score: 75, lastVisit: "6/3", churn: "Thấp", pet: "Kiwi (Chim)" },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [tab, setTab] = useState<"segments" | "campaigns" | "clients">("segments");
  const [segments] = useState(SEGMENTS);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function toggleCampaign(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c));
  }

  function addCampaign(name: string) {
    const newC = {
      id: `c${Date.now()}`, name, segment: segments[0].name,
      channel: "email", status: "active" as const,
      sent: 0, openRate: 0, clickRate: 0, lastRun: "Vừa xong",
    };
    setCampaigns(prev => [newC, ...prev]);
    showToast(`"${name}" đã được kích hoạt thành công! 🚀`);
  }

  return (
    <ClinicPageShell
      title="CRM & Marketing"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "CRM" }]}
    >
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trung tâm CRM & Marketing</h2>
            <p className="text-gray-500 font-medium mt-1">Tự động hóa chăm sóc khách hàng & Tăng tỷ lệ giữ chân</p>
          </div>
          <button onClick={() => setShowNewCampaign(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-200"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 900, fontSize: "0.9rem" }}>
            <Plus className="w-5 h-5" />
            Chiến dịch mới
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-4 gap-4">
          <ClinicStatCard label="Tổng khách hàng" value="284" trend="+12 ca" trendPos icon={Users} color="#2563EB" description="tăng trưởng tháng này" />
          <ClinicStatCard label="Tỷ lệ giữ chân" value="87%" trend="+3%" trendPos icon={Heart} color="#16a34a" description="cao hơn trung bình ngành" />
          <ClinicStatCard label="LTV trung bình" value="$742" trend="+$48" trendPos icon={TrendingUp} color="#7c3aed" description="giá trị vòng đời khách hàng" />
          <ClinicStatCard label="Ca có rủi ro" value="22" trend="-5 ca" trendPos icon={Activity} color="#f97316" description="giảm so với tháng trước" />
        </div>

        {/* Tabs Control */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
            {(["segments", "campaigns", "clients"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={"px-6 py-2.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest " + 
                  (tab === t ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600")}>
                {t === "segments" ? "Phân khúc" : t === "campaigns" ? "Chiến dịch" : "Khách hàng"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Đang đồng bộ dữ liệu thực tế
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {tab === "segments" && (
            <SegmentGrid segments={segments} onStartCampaign={() => setShowNewCampaign(true)} />
          )}
          {tab === "campaigns" && (
            <CampaignTable campaigns={campaigns} onToggle={toggleCampaign} />
          )}
          {tab === "clients" && (
            <ClientTable clients={CLIENTS} />
          )}
        </div>
        
        <div className="h-8" />
      </div>

      {showNewCampaign && (
        <NewCampaignModal segments={segments} onClose={() => setShowNewCampaign(false)} onSave={addCampaign} />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-6 py-4 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ background: "#0f172a", color: "white", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)", fontFamily: "Inter, sans-serif" }}>
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-sm font-black tracking-tight">{toast}</span>
        </div>
      )}
    </ClinicPageShell>
  );
}

