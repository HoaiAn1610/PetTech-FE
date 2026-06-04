import { useState, useMemo } from "react";
import {
  Users, Plus, Heart, TrendingUp, Activity,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { SegmentGrid } from "@/features/clinic/crm/SegmentGrid";
import { CampaignTable } from "@/features/clinic/crm/CampaignTable";
import { NewCampaignModal } from "@/features/clinic/crm/NewCampaignModal";
import { NewSegmentModal } from "@/features/clinic/crm/NewSegmentModal";
import { 
  useCampaigns, 
  useCreateCampaign, 
  useExecuteCampaign, 
  useSegments, 
  useCreateSegment, 
  useDeleteSegment, 
  useCrmCustomers 
} from "@/hooks/admin/useCrm";
import { toast } from "sonner";
import "@/styles/fonts.css";

// ─── DATA (Mock Fallbacks) ───────────────────────────────────────────────────
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
          const charCodeSum = String(client.name || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
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
  const [tab, setTab] = useState<"segments" | "campaigns">("segments");
  
  // Modal States
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewSegment, setShowNewSegment] = useState(false);
  const [preselectedSegmentId, setPreselectedSegmentId] = useState<string | undefined>(undefined);

  // Custom Popup Confirm Dialog State
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Xác nhận",
    onConfirm: () => {},
    destructive: false
  });

  // API Queries using React Query (PageSize / pageSize discrepancy casted to any)
  const { data: rawCustomers, isLoading: clientsLoading } = useCrmCustomers({ pageSize: 1000 } as any);
  const { data: rawSegments, isLoading: segmentsLoading } = useSegments();
  const { data: rawCampaigns, isLoading: campaignsLoading } = useCampaigns();

  // API Mutations
  const createSegmentMutation = useCreateSegment();
  const deleteSegmentMutation = useDeleteSegment();
  const executeCampaignMutation = useExecuteCampaign();
  const createCampaignMutation = useCreateCampaign();

  const loading = clientsLoading || segmentsLoading || campaignsLoading;

  // Clients mapping
  const clientsList = useMemo(() => {
    const items = rawCustomers?.items || [];
    const rawItems = Array.isArray(rawCustomers) ? rawCustomers : items;

    if (rawItems.length === 0) return CLIENTS;

    return rawItems.map((c: any) => {
      const name = c.fullName || c.name || "Khách hàng";
      const email = c.email || "";
      const ltv = c.totalSpent || c.ltv || 0;
      const visits = c.totalVisits || c.visitsCount || c.visits || 0;
      const score = c.healthScore || c.score || 80;
      
      let lastVisit = c.lastVisitDate || c.lastVisit || "Chưa khám";
      if (lastVisit && lastVisit !== "Chưa khám") {
        try {
          const date = new Date(lastVisit);
          if (!isNaN(date.getTime())) {
            lastVisit = `${date.getDate()}/${date.getMonth() + 1}`;
          }
        } catch (e) {
          // Keep original
        }
      }
      
      const churn = c.churnRiskLevel || c.churn || (score > 80 ? "Thấp" : score > 50 ? "Trung bình" : "Cao");
      const pet = c.pets?.map((p: any) => `${p.name} (${p.species === "Dog" ? "Chó" : "Mèo"})`).join(", ") || c.pet || "Không có pet";

      return {
        id: c.id,
        name,
        email,
        ltv,
        visits,
        score,
        lastVisit,
        churn,
        pet
      };
    });
  }, [rawCustomers]);

  // Segments mapping
  const segments = useMemo(() => {
    const items = rawSegments?.items || [];
    const allItems = Array.isArray(rawSegments) ? rawSegments : items;

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

    const merged = [...allItems];
    localSegments.forEach((ls: any) => {
      if (!merged.some(item => item.id === ls.id || item.name === ls.name)) {
        merged.push(ls);
      }
    });

    return merged.map((s: any, idx: number) => {
      let icon = "👥";
      if (s.name.toLowerCase().includes("vip") || s.name.toLowerCase().includes("giá trị")) icon = "⭐";
      else if (s.name.toLowerCase().includes("vaccine") || s.name.toLowerCase().includes("tiêm")) icon = "💉";
      else if (s.name.toLowerCase().includes("ngủ") || s.name.toLowerCase().includes("không hoạt động")) icon = "😴";
      else if (s.name.toLowerCase().includes("sinh nhật")) icon = "🎂";
      else if (s.name.toLowerCase().includes("mới")) icon = "🆕";
      
      let finalCount = s.customerCount || 0;
      if (s.filterRules) {
        finalCount = evaluateSegmentCount(s.filterRules, clientsList);
      } else {
        if (s.id === "s1" || s.name.includes("Vaccine")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "last_visit_days", operator: ">", value: 30 }] }, clientsList);
        else if (s.id === "s2" || s.name.includes("giá trị cao")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "total_spent", operator: ">", value: 700 }] }, clientsList);
        else if (s.id === "s3" || s.name.includes("Không hoạt động")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "last_visit_days", operator: ">", value: 45 }] }, clientsList);
        else if (s.id === "s4" || s.name.includes("mới")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "last_visit_days", operator: "<", value: 30 }] }, clientsList);
        else if (s.id === "s5" || s.name.includes("sau phẫu thuật")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "service_type", operator: "=", value: "Consultation" }] }, clientsList);
        else if (s.id === "s6" || s.name.includes("sinh nhật")) finalCount = evaluateSegmentCount({ logic: "AND", conditions: [{ field: "birthday_month", operator: "=", value: "3" }] }, clientsList);
        else finalCount = s.customerCount || (idx % 3 === 0 ? 14 : idx % 3 === 1 ? 12 : 8);
      }

      return {
        id: s.id,
        name: s.name,
        count: finalCount,
        color: idx % 6 === 0 ? "#f97316" : idx % 6 === 1 ? "#7c3aed" : idx % 6 === 2 ? "#dc2626" : idx % 6 === 3 ? "var(--primary-theme-color, #2563EB)" : idx % 6 === 4 ? "#0891b2" : "#16a34a",
        bg: idx % 6 === 0 ? "rgba(249,115,22,0.08)" : idx % 6 === 1 ? "rgba(124,58,237,0.08)" : idx % 6 === 2 ? "rgba(220,38,38,0.08)" : idx % 6 === 3 ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 8%, transparent)" : idx % 6 === 4 ? "rgba(8,145,178,0.08)" : "rgba(22,163,74,0.08)",
        icon: icon,
        desc: s.description || (s.isAuto ? "Tự động cập nhật" : "Phân khúc thủ công"),
        active: true,
        filterRules: s.filterRules
      };
    });
  }, [rawSegments, clientsList]);

  // Campaigns mapping
  const campaigns = useMemo(() => {
    const items = rawCampaigns?.items || [];
    const allItems = Array.isArray(rawCampaigns) ? rawCampaigns : items;

    return allItems.map((c: any) => ({
      id: c.id,
      name: c.name,
      segment: c.segmentName || "Khách hàng",
      channel: c.channel || "email",
      status: c.status?.toLowerCase() || "active",
      sent: c.sentCount || 0,
      openRate: c.openRate || 0,
      clickRate: c.clickRate || 0,
      lastRun: c.lastRunAt ? new Date(c.lastRunAt).toLocaleDateString("vi-VN") : "Chưa chạy"
    }));
  }, [rawCampaigns]);

  async function handleCreateSegment(segment: any) {
    try {
      const count = evaluateSegmentCount(segment.filterRules, clientsList);
      const newSegPayload = {
        ...segment,
        customerCount: count,
      };

      const result = await createSegmentMutation.mutateAsync(newSegPayload);

      // Save to localStorage list for client-side persistence fallback
      const localSegmentsStr = localStorage.getItem("local_segments");
      let localSegments: any[] = [];
      if (localSegmentsStr) {
        try {
          localSegments = JSON.parse(localSegmentsStr);
        } catch (e) {
          console.error(e);
        }
      }
      localSegments.push({ ...newSegPayload, id: result.id || `seg-${Date.now()}` });
      localStorage.setItem("local_segments", JSON.stringify(localSegments));

      toast.success(`Phân khúc "${segment.name}" đã được tạo thành công! 🎉`);
      setShowNewSegment(false);
    } catch (err) {
      console.error(err);
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
          await deleteSegmentMutation.mutateAsync(id);
          
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

          toast.success("Đã xóa phân khúc thành công!");
          setConfirmState(prev => ({ ...prev, open: false }));
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  async function handleExecuteCampaign(id: string) {
    try {
      toast.loading("Đang gửi email chiến dịch thực tế...", { id: "execute-crm" });
      await executeCampaignMutation.mutateAsync(id);
      toast.dismiss("execute-crm");
      toast.success("Gửi email chiến dịch thành công! 🎉");
    } catch (err) {
      toast.dismiss("execute-crm");
      console.error(err);
    }
  }

  async function addCampaign(payload: any) {
    try {
      await createCampaignMutation.mutateAsync(payload);
      toast.success(`Chiến dịch "${payload.name}" đã được kích hoạt thành công! 🚀`);
      setShowNewCampaign(false);
    } catch (err) {
      console.error(err);
    }
  }

  const HeaderActions = (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {tab === "segments" && (
        <button onClick={() => setShowNewSegment(true)}
          className="flex items-center justify-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 border-2 border-gray-200 text-xs sm:text-sm font-black w-full sm:w-auto"
          style={{ color: "#374151" }}>
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Tạo phân khúc
        </button>
      )}
      <button onClick={() => { setPreselectedSegmentId(undefined); setShowNewCampaign(true); }}
        className="flex items-center justify-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary/20 text-xs sm:text-sm font-black w-full sm:w-auto text-white"
        style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black))" }}>
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        Chiến dịch mới
      </button>
    </div>
  );

  return (
    <ClinicPageShell
      title="CRM & Marketing"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "CRM" }]}
      headerActions={HeaderActions}
    >
      <div className="flex flex-col gap-8">

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClinicStatCard label="Tổng khách hàng" value={clientsList.length} trend="+12 ca" trendPos icon={Users} color="var(--primary-theme-color, #2563EB)" description="tăng trưởng tháng này" />
          <ClinicStatCard label="Tỷ lệ giữ chân" value="87%" trend="+3%" trendPos icon={Heart} color="#16a34a" description="cao hơn trung bình ngành" />
          <ClinicStatCard label="LTV trung bình" value={clientsList.length > 0 ? `$${Math.round(clientsList.reduce((acc: number, c: any) => acc + c.ltv, 0) / clientsList.length)}` : "$0"} trend="+$48" trendPos icon={TrendingUp} color="#7c3aed" description="giá trị vòng đời khách hàng" />
          <ClinicStatCard label="Ca có rủi ro" value={clientsList.filter((c: any) => c.churn === "Cao" || c.churn === "High").length} trend="-5 ca" trendPos icon={Activity} color="#f97316" description="giảm so với tháng trước" />
        </div>

        {/* Tabs Control */}
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none max-w-full">
          <div className="flex gap-1.5 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 shadow-inner overflow-x-auto whitespace-nowrap scrollbar-none flex-shrink-0">
            {(["segments", "campaigns"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2.5 rounded-xl text-sm font-black transition-all flex-shrink-0"
                style={{
                  background: tab === t ? "white" : "transparent",
                  color: tab === t ? "var(--primary-theme-color, #2563EB)" : "#64748b",
                  boxShadow: tab === t ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
                }}>
                {t === "segments" ? "Phân khúc" : "Chiến dịch Email"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        {loading && segments.length === 0 ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {tab === "segments" && (
              <SegmentGrid 
                segments={segments} 
                onDeleteSegment={handleDeleteSegment} 
                onStartCampaign={(seg) => {
                  setPreselectedSegmentId(seg.id);
                  setShowNewCampaign(true);
                }} 
              />
            )}
            {tab === "campaigns" && (
              <CampaignTable campaigns={campaigns} onToggle={() => {}} onExecute={handleExecuteCampaign} />
            )}
          </div>
        )}
      </div>

      {showNewCampaign && (
        <NewCampaignModal 
          segments={segments} 
          onClose={() => setShowNewCampaign(false)} 
          onSave={addCampaign} 
          initialSegmentId={preselectedSegmentId}
        />
      )}

      {showNewSegment && (
        <NewSegmentModal 
          onClose={() => setShowNewSegment(false)} 
          onSave={handleCreateSegment} 
        />
      )}

      {/* Confirm Dialog Popup */}
      {confirmState.open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-900">{confirmState.title}</h3>
            <p className="text-sm font-medium text-gray-500">{confirmState.message}</p>
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={() => setConfirmState(p => ({ ...p, open: false }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
                Hủy
              </button>
              <button onClick={confirmState.onConfirm}
                className={`px-4 py-2 font-bold rounded-xl text-sm transition-colors text-white ${confirmState.destructive ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-hover"}`}>
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicPageShell>
  );
}
