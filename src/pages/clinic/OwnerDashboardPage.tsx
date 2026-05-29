import { useState, useEffect } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { PeakHoursChart } from "@/components/dashboard/PeakHoursChart";
import { CRMAutomationBuilder } from "@/components/dashboard/CRMAutomationBuilder";
import { RefreshCw, CalendarDays } from "lucide-react";
import { useSearchParams } from "react-router";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { DemoWelcomeBanner } from "@/components/clinic/DemoWelcomeBanner";
import { analyticsService, crmService } from "@/api/services";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { useKanbanSignalR } from "@/hooks/useKanbanSignalR";
import "@/styles/fonts.css";

export default function OwnerDashboardPage() {
  const { tenant, features } = useTenant();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [metricsRes, heatmapRes] = await Promise.all([
        analyticsService.getDashboardMetrics().catch(() => ({ data: null })),
        analyticsService.getBookingHeatmap().catch(() => ({ data: [] }))
      ]);
      setMetrics(metricsRes?.data);
      setHeatmap(heatmapRes?.data || []);

      if (features?.crmAutomation) {
        const [segRes, campRes] = await Promise.all([
          crmService.getSegments().catch(() => ({ data: { items: [] } })),
          crmService.getCampaigns().catch(() => ({ data: { items: [] } }))
        ]);
        setSegments(segRes?.data?.items || []);
        setCampaigns(campRes?.data?.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, [features?.crmAutomation]);

  useEffect(() => {
    if (searchParams.get("from") === "demo") {
      setShowDemoBanner(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  // Setup SignalR Real-time Hub Connection using our custom hook
  const { isConnected: signalrConnected } = useKanbanSignalR(fetchAllData);

  const now = lastRefresh;
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const hours = now.getHours();
  let greetingPrefix = "Chào buổi sáng";
  if (hours >= 12 && hours < 18) {
    greetingPrefix = "Chào buổi chiều";
  } else if (hours >= 18) {
    greetingPrefix = "Chào buổi tối";
  }
  const userName = user?.name || "Chủ cửa hàng";
  const titleGreeting = `${greetingPrefix}, ${userName} 👋`;

  function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    fetchAllData();
  }

  const HeaderActions = (
    <>
      {/* Live SignalR badge */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl animate-in fade-in duration-300"
        style={{
          background: signalrConnected ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: signalrConnected ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)"
        }}
      >
        <span className={`w-2 h-2 rounded-full ${signalrConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: signalrConnected ? "#16a34a" : "#dc2626" }}>
          {signalrConnected ? "Thời gian thực (SignalR Connected)" : "Chế độ REST (Mất kết nối)"}
        </span>
      </div>
      {/* Refresh */}
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-sm"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.08)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} style={{ color: "#2563EB" }} />
        {refreshing ? "Đang làm mới…" : "Làm mới"}
      </button>
    </>
  );

  return (
    <ClinicPageShell
      title={titleGreeting}
      breadcrumbs={[
        { label: "PetTech", href: "/" },
        { label: "Tổng quan" },
      ]}
      headerActions={HeaderActions}
    >
      {/* Subtitle with date/time */}
      <div className="-mt-4 flex items-center gap-2">
        <CalendarDays className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          {dateStr} · {timeStr}
        </p>
      </div>

      {/* Demo welcome banner */}
      {showDemoBanner && (
        <DemoWelcomeBanner onClose={() => setShowDemoBanner(false)} />
      )}

      {/* ── KPI Cards ── */}
      <KPICards data={metrics} loading={loading} />

      {/* ── Peak Hours Chart ── */}
      <PeakHoursChart data={heatmap} loading={loading} />

      {/* ── CRM Automation Builder ── */}
      <CRMAutomationBuilder segmentsData={segments} campaignsData={campaigns} loading={loading} />
    </ClinicPageShell>
  );
}
