import { useState, useEffect } from "react";
import {
  Users, Plus, CheckCircle2, TrendingUp, Activity, Heart, AlertTriangle,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { SegmentGrid } from "@/features/clinic/crm/SegmentGrid";
import { CampaignTable } from "@/features/clinic/crm/CampaignTable";
import { ClientTable } from "@/features/clinic/crm/ClientTable";
import { NewCampaignModal } from "@/features/clinic/crm/NewCampaignModal";
import { NewSegmentModal } from "@/features/clinic/crm/NewSegmentModal";
import { crmService } from "@/api/services";
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

// ─── SEGMENT RULE EVALUATOR ───────────────────────────────────────────────────
export function evaluateSegmentCount(filterRules: any, clients: any[]): number {
  if (!filterRules || !filterRules.conditions || filterRules.conditions.length === 0) {
    return clients.length;
  }

  const { logic, conditions } = filterRules;

  const matches = clients.filter(client => {
    const conditionResults = conditions.map((cond: any) => {
      const { field, operator, value } = cond;
      const numValue = parseFloat(value) || 0;

      switch (field) {
        case "total_spent": {
          const clientSpent = client.ltv || 0;
          if (operator === ">") return clientSpent > numValue;
          if (operator === "<") return clientSpent < numValue;
          return clientSpent === numValue;
        }
        case "last_visit_days": {
          const lastVisitStr = client.lastVisit || "";
          let days = 30; // fallback
          if (lastVisitStr.includes("/")) {
            const [d, m] = lastVisitStr.split("/").map(Number);
            const visitDate = new Date(2026, m - 1, d);
            const now = new Date(2026, 2, 15); // Assume current date is mid March 2026
            const diffTime = Math.abs(now.getTime() - visitDate.getTime());
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          if (operator === ">") return days > numValue;
          if (operator === "<") return days < numValue;
          return days === numValue;
        }
        case "pet_species": {
          const petStr = (client.pet || "").toLowerCase();
          const isDog = petStr.includes("chó") || petStr.includes("dog");
          const isCat = petStr.includes("mèo") || petStr.includes("cat");
          const isOther = !isDog && !isCat;

          const target = String(value).toLowerCase();
          let match = false;
          if (target === "dog" || target === "chó") match = isDog;
          else if (target === "cat" || target === "mèo") match = isCat;
          else if (target === "other" || target === "khác") match = isOther;

          return operator === "=" ? match : !match;
        }
        case "birthday_month": {
          const charCodeSum = String(client.name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const birthMonth = (charCodeSum % 12) + 1;
          const targetMonth = parseInt(String(value)) || 1;
          return operator === "=" ? birthMonth === targetMonth : birthMonth !== targetMonth;
        }
        case "cart_status": {
          let status = "Completed";
          if (client.score < 50) status = "Abandoned";
          else if (client.score <= 80) status = "Active";

          const target = String(value);
          return operator === "=" ? status === target : status !== target;
        }
        case "service_type": {
          let service = "Spa";
          if (client.visits > 12) service = "Consultation";
          else if (client.visits < 6) service = "Hotel";

          const target = String(value);
          return operator === "=" ? service === target : service !== target;
        }
        default:
          return true;
      }
    });

    if (logic === "OR") {
      return conditionResults.some((r: boolean) => r);
    } else {
      return conditionResults.every((r: boolean) => r);
    }
  });

  return matches.length;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [tab, setTab] = useState<"segments" | "campaigns" | "clients">("segments");
  
  // Data States
  const [segments, setSegments] = useState<any[]>([]); // use empty array initially
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [toast, setToast] = useState("");

  // Custom Popup Confirm Dialog State
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Xác nhận",
    onConfirm: () => {},
    destructive: false
  });

  const fetchSegments = async () => {
    setLoading(true);
    try {
      const res = await crmService.getSegments();
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      
      // Load locally created segments from localStorage
      const localSegmentsStr = localStorage.getItem("local_segments");
      let localSegments: any[] = [];
      if (localSegmentsStr) {
        try {
          localSegments = JSON.parse(localSegmentsStr);
        } catch (e) {
          console.error("Lỗi đọc local_segments từ localStorage:", e);
        }
      }

      // Merge backend segments and local segments
      const allItems = [...items];
      localSegments.forEach((ls: any) => {
        if (!allItems.some(item => item.id === ls.id || item.name === ls.name)) {
          allItems.push(ls);
        }
      });

      // Map DTO to UI format
      const mapped = allItems.map((s: any, idx: number) => {
        let icon = "👥";
        if (s.name.toLowerCase().includes("vip") || s.name.toLowerCase().includes("giá trị")) icon = "⭐";
        else if (s.name.toLowerCase().includes("vaccine") || s.name.toLowerCase().includes("tiêm")) icon = "💉";
        else if (s.name.toLowerCase().includes("ngủ") || s.name.toLowerCase().includes("không hoạt động")) icon = "😴";
        else if (s.name.toLowerCase().includes("sinh nhật")) icon = "🎂";
        else if (s.name.toLowerCase().includes("mới")) icon = "🆕";
        
        // Dynamic evaluation
        let finalCount = s.customerCount || 0;
        if (s.filterRules) {
          finalCount = evaluateSegmentCount(s.filterRules, CLIENTS);
        } else {
          // If no filterRules, assign default mockup count based on default segments list
          if (s.id === "s1" || s.name.includes("Vaccine")) finalCount = 48;
          else if (s.id === "s2" || s.name.includes("giá trị cao")) finalCount = 31;
          else if (s.id === "s3" || s.name.includes("Không hoạt động")) finalCount = 22;
          else if (s.id === "s4" || s.name.includes("mới")) finalCount = 17;
          else if (s.id === "s5" || s.name.includes("sau phẫu thuật")) finalCount = 9;
          else if (s.id === "s6" || s.name.includes("sinh nhật")) finalCount = 14;
          else finalCount = s.customerCount || (idx % 3 === 0 ? 14 : idx % 3 === 1 ? 12 : 8);
        }

        return {
          id: s.id,
          name: s.name,
          count: finalCount,
          color: idx % 6 === 0 ? "#f97316" : idx % 6 === 1 ? "#7c3aed" : idx % 6 === 2 ? "#dc2626" : idx % 6 === 3 ? "#2563EB" : idx % 6 === 4 ? "#0891b2" : "#16a34a",
          bg: idx % 6 === 0 ? "rgba(249,115,22,0.08)" : idx % 6 === 1 ? "rgba(124,58,237,0.08)" : idx % 6 === 2 ? "rgba(220,38,38,0.08)" : idx % 6 === 3 ? "rgba(37,99,235,0.08)" : idx % 6 === 4 ? "rgba(8,145,178,0.08)" : "rgba(22,163,74,0.08)",
          icon: icon,
          desc: s.description || (s.isAuto ? "Tự động cập nhật" : "Phân khúc thủ công"),
          active: true,
          filterRules: s.filterRules
        };
      });
      setSegments(mapped);
    } catch (err) {
      console.error("Failed to fetch segments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await crmService.getCampaigns();
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      const mapped = items.map((c: any) => ({
        id: c.id,
        name: c.name,
        segment: c.segmentName || "Khách hàng",
        channel: c.channel || "zalo",
        status: c.status?.toLowerCase() || "active",
        sent: c.sentCount || 0,
        openRate: c.openRate || 0,
        clickRate: c.clickRate || 0,
        lastRun: c.lastRunAt ? new Date(c.lastRunAt).toLocaleDateString("vi-VN") : "Chưa chạy"
      }));
      setCampaigns(mapped);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    }
  };

  useEffect(() => {
    fetchSegments();
    fetchCampaigns();
  }, []);

  async function handleCreateSegment(segment: any) {
    try {
      // Calculate dynamic count
      const count = evaluateSegmentCount(segment.filterRules, CLIENTS);
      
      const newSeg = {
        ...segment,
        id: `seg-${Date.now()}`,
        customerCount: count,
      };

      // Call API
      await crmService.createSegment(newSeg);

      // Save to localStorage list for client-side persistence
      const localSegmentsStr = localStorage.getItem("local_segments");
      let localSegments: any[] = [];
      if (localSegmentsStr) {
        try {
          localSegments = JSON.parse(localSegmentsStr);
        } catch (e) {
          console.error(e);
        }
      }
      localSegments.push(newSeg);
      localStorage.setItem("local_segments", JSON.stringify(localSegments));

      showToast(`Phân khúc "${segment.name}" đã được tạo thành công! 🎉`);
      fetchSegments();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi tạo phân khúc!");
    }
  }

  async function handleDeleteSegment(id: string) {
    const segment = segments.find(s => s.id === id);
    setConfirmState({
      open: true,
      title: "Xóa phân khúc",
      message: `Bạn có chắc chắn muốn xóa phân khúc "${segment?.name || 'này'}" không? Hành động này sẽ không thể khôi phục.`,
      confirmLabel: "Xác nhận xóa",
      destructive: true,
      onConfirm: async () => {
        try {
          await crmService.deleteSegment(id);
          
          // Delete from localStorage too
          const localSegmentsStr = localStorage.getItem("local_segments");
          if (localSegmentsStr) {
            try {
              let localSegments = JSON.parse(localSegmentsStr);
              localSegments = localSegments.filter((ls: any) => ls.id !== id);
              localStorage.setItem("local_segments", JSON.stringify(localSegments));
            } catch (e) {
              console.error(e);
            }
          }

          showToast("Đã xóa phân khúc thành công!");
          fetchSegments();
        } catch (err) {
          console.error(err);
          showToast("Lỗi khi xóa phân khúc!");
        }
      }
    });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function toggleCampaign(id: string) {
    // In the future: call API to toggle status, then refresh
    // For now update locally
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c));
  }

  async function handleExecuteCampaign(id: string) {
    showToast("Đang gửi email chiến dịch thực tế...");
    try {
      await crmService.executeCampaign(id);
      showToast("Gửi email chiến dịch thành công! 🎉");
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi gửi chiến dịch email!");
    }
  }

  async function addCampaign(payload: any) {
    try {
      await crmService.createCampaign(payload);
      showToast(`Chiến dịch "${payload.name}" đã được kích hoạt thành công! 🚀`);
      setShowNewCampaign(false);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi tạo chiến dịch. Vui lòng thử lại!");
    }
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
          <div className="flex gap-3">
            {tab === "segments" && (
              <button onClick={() => setShowNewSegment(true)}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 border-2 border-gray-200"
                style={{ color: "#374151", fontWeight: 900, fontSize: "0.9rem" }}>
                <Plus className="w-5 h-5" />
                Tạo phân khúc
              </button>
            )}
            <button onClick={() => setShowNewCampaign(true)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-200"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 900, fontSize: "0.9rem" }}>
              <Plus className="w-5 h-5" />
              Chiến dịch mới
            </button>
          </div>
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
            loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <SegmentGrid 
                segments={segments} 
                onStartCampaign={() => setShowNewCampaign(true)} 
                onDeleteSegment={handleDeleteSegment}
              />
            )
          )}
          {tab === "campaigns" && (
            <CampaignTable campaigns={campaigns} onToggle={toggleCampaign} onExecute={handleExecuteCampaign} />
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

      {showNewSegment && (
        <NewSegmentModal onClose={() => setShowNewSegment(false)} onSave={handleCreateSegment} />
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

      {confirmState.open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setConfirmState(prev => ({ ...prev, open: false }))}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.05)", fontFamily: "Inter, sans-serif" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${confirmState.destructive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-900 tracking-tight">{confirmState.title}</h3>
            </div>
            
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">{confirmState.message}</p>
            
            <div className="flex justify-end gap-3 mt-2 border-t pt-4 border-gray-100">
              <button 
                onClick={() => setConfirmState(prev => ({ ...prev, open: false }))}
                className="px-4.5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  confirmState.onConfirm();
                  setConfirmState(prev => ({ ...prev, open: false }));
                }}
                className={`px-5 py-2.5 rounded-xl text-white font-black text-xs transition-all active:scale-95 shadow-md ${confirmState.destructive ? "bg-red-600 hover:bg-red-700 shadow-red-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicPageShell>
  );
}

