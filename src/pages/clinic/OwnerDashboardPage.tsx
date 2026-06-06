import { useState, useMemo, useEffect } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { PeakHoursChart } from "@/components/dashboard/PeakHoursChart";
import { CRMAutomationBuilder } from "@/components/dashboard/CRMAutomationBuilder";
import { RefreshCw, CalendarDays } from "lucide-react";
import { useSearchParams } from "react-router";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { DemoWelcomeBanner } from "@/components/clinic/DemoWelcomeBanner";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { useKanbanSignalR } from "@/hooks/useKanbanSignalR";
import { useDashboardMetrics, useBookingHeatmap, debounce } from "@/hooks/clinic/useAnalyticsQueries";
import { useSegments, useCampaigns } from "@/hooks/admin/useCrm";
import { useQueryClient } from "@tanstack/react-query";
import { clinicKeys } from "@/lib/queryKeys";
import "@/styles/fonts.css";

export default function OwnerDashboardPage() {
  const { features } = useTenant();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  // API Queries using React Query
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: heatmap, isLoading: heatmapLoading } = useBookingHeatmap();

  // CRM Queries (Only enabled if tenant features allow it)
  const isCrmEnabled = !!features?.crmAutomation;
  const { data: rawSegments, isLoading: segmentsLoading } = useSegments(undefined);
  const { data: rawCampaigns, isLoading: campaignsLoading } = useCampaigns(undefined);

  const segments = useMemo(() => {
    const items = rawSegments?.items || [];
    const allItems = Array.isArray(rawSegments) ? rawSegments : items;
    return isCrmEnabled && Array.isArray(allItems) ? allItems : [];
  }, [rawSegments, isCrmEnabled]);

  const campaigns = useMemo(() => {
    const items = rawCampaigns?.items || [];
    const allItems = Array.isArray(rawCampaigns) ? rawCampaigns : items;
    return isCrmEnabled && Array.isArray(allItems) ? allItems : [];
  }, [rawCampaigns, isCrmEnabled]);

  const loading = metricsLoading || heatmapLoading || (isCrmEnabled && (segmentsLoading || campaignsLoading));

  // Debounced refresh for SignalR callback to prevent backend spamming (max once every 30s)
  const debouncedRefresh = useMemo(
    () => debounce(() => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: clinicKeys.heatmap() });
      setLastRefresh(new Date());
    }, 30_000),
    [queryClient]
  );

  // Setup SignalR Real-time Hub Connection using custom hook
  const { isConnected: signalrConnected } = useKanbanSignalR(debouncedRefresh);

  useEffect(() => {
    if (searchParams.get("from") === "demo") {
      setShowDemoBanner(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

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
    // Invalidate clinic analytics prefix completely for fresh load
    queryClient.invalidateQueries({ queryKey: clinicKeys.analytics() });
    
    setTimeout(() => {
      setLastRefresh(new Date());
      setRefreshing(false);
    }, 800);
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
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} style={{ color: "var(--primary-theme-color, #2563EB)" }} />
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

      {/* KPI Cards */}
      <KPICards data={metrics} loading={loading} />

      {/* Peak Hours Chart */}
      <PeakHoursChart data={heatmap} loading={loading} />

      {/* CRM Automation Builder (Temporarily hidden) */}
      {/* <CRMAutomationBuilder segmentsData={segments} campaignsData={campaigns} loading={loading} /> */}
    </ClinicPageShell>
  );
}
