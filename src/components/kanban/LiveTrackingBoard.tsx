import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useFeature } from "@/hooks/useFeature";
import { useTenant } from "@/context/TenantContext";
import axiosInstance from "@/api/axiosInstance";
import { UpsellBanner } from "@/components/shared/UpsellBanner";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  Loader2, 
  HelpCircle,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface TrackingStepDto {
  id: string;
  label: string;
  sublabel?: string;
  state: "Pending" | "Active" | "Completed";
  updatedAt?: string;
}

interface LiveTrackingBoardProps {
  bookingId?: string;
}

// ── Column Configuration ──────────────────────────────────────────────────────
const COLUMNS = [
  {
    id: "Pending" as const,
    label: "Chờ xử lý",
    bgClass: "bg-amber-50/50",
    borderClass: "border-amber-200/60",
    textClass: "text-amber-700",
    dotClass: "bg-amber-500",
    badgeBg: "bg-amber-100",
    icon: Clock,
  },
  {
    id: "Active" as const,
    label: "Đang thực hiện",
    bgClass: "bg-blue-50/50",
    borderClass: "border-blue-200/60",
    textClass: "text-blue-700",
    dotClass: "bg-blue-500",
    badgeBg: "bg-blue-100",
    icon: Play,
  },
  {
    id: "Completed" as const,
    label: "Hoàn tất",
    bgClass: "bg-emerald-50/50",
    borderClass: "border-emerald-200/60",
    textClass: "text-emerald-700",
    dotClass: "bg-emerald-500",
    badgeBg: "bg-emerald-100",
    icon: CheckCircle,
  },
];

// ── Helper to resolve Hub URL ──────────────────────────────────────────────────
const getHubUrl = () => {
  const base = import.meta.env.VITE_API_URL || "https://api.pettech.io/v1";
  try {
    const url = new URL(base);
    return `${url.origin}/hubs/tracking`;
  } catch (e) {
    return "/hubs/tracking";
  }
};

export const LiveTrackingBoard: React.FC<LiveTrackingBoardProps> = ({ bookingId }) => {
  const { hasLiveTracking } = useFeature();
  const { loading: tenantLoading } = useTenant();
  
  const [steps, setSteps] = useState<TrackingStepDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [signalrConnected, setSignalrConnected] = useState(false);

  // 1. Fetch data initially
  const fetchSteps = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      // response.data.data is automatically unwrapped to 'res' by axios interceptor
      const data = await axiosInstance.get(`/api/shop/tracking?bookingId=${bookingId}`);
      setSteps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tracking steps", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, [bookingId]);

  // 2. Setup SignalR Real-time Hub Connection
  useEffect(() => {
    if (!bookingId || !hasLiveTracking) return;

    let connection: HubConnection | null = null;

    const startHub = async () => {
      const hubUrl = getHubUrl();
      connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => localStorage.getItem("token") || "",
        })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        setSignalrConnected(true);
        console.log("SignalR: Connected to tracking hub");

        // Join tracking group room for specific booking
        await connection.invoke("JoinTracking", bookingId);

        // Listen for remote updates
        connection.on("StepUpdated", (updatedStep: TrackingStepDto) => {
          setSteps((prev) => {
            const index = prev.findIndex((s) => s.id === updatedStep.id);
            if (index !== -1) {
              const copy = [...prev];
              copy[index] = updatedStep;
              return copy;
            }
            return [...prev, updatedStep];
          });
        });
      } catch (err) {
        console.error("SignalR: Connection failed", err);
      }
    };

    startHub();

    return () => {
      if (connection) {
        connection.stop();
        setSignalrConnected(false);
        console.log("SignalR: Disconnected from tracking hub");
      }
    };
  }, [bookingId, hasLiveTracking]);

  // 3. Handle Drag & Drop with Optimistic Updates
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid drop target
    if (!destination) return;

    // Dropped in the same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newState = destination.droppableId as "Pending" | "Active" | "Completed";
    const previousSteps = [...steps];

    // Optimistic UI state update
    const updated = steps.map((step) => {
      if (step.id === draggableId) {
        return { ...step, state: newState };
      }
      return step;
    });
    setSteps(updated);

    try {
      // Put update payload: { state: newState } to REST API
      await axiosInstance.put(`/api/shop/tracking/${draggableId}`, { state: newState });
    } catch (err) {
      console.error("Failed to update step state", err);
      // Rollback to original state on failure
      setSteps(previousSteps);
      alert("Không thể lưu thay đổi trạng thái, đang khôi phục lại bảng...");
    }
  };

  // Render Premium Feature Lock Upsell
  if (!tenantLoading && !hasLiveTracking) {
    return <UpsellBanner featureName="Live Tracking" />;
  }

  if (tenantLoading || loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-20 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-bold">Đang tải bảng theo dõi công việc...</p>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl max-w-xl mx-auto my-12">
        <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h4 className="text-lg font-black text-gray-800">Không tìm thấy mã lịch hẹn</h4>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Vui lòng truyền bookingId hợp lệ làm prop cho component để bắt đầu theo dõi Live Tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-55 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Theo Dõi Tiến Trình Grooming & Khám Bệnh</h2>
            <p className="text-xs text-gray-400 font-medium">Đồng bộ hai chiều thời gian thực</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <span className={`w-2.5 h-2.5 rounded-full ${signalrConnected ? "bg-green-500 animate-pulse" : "bg-rose-500"}`} />
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
            {signalrConnected ? "Real-time Connected" : "REST Only Mode"}
          </span>
        </div>
      </div>

      {/* Drag & Drop Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start min-w-[900px] max-w-7xl mx-auto">
            {COLUMNS.map((col) => {
              const colSteps = steps.filter((step) => step.state === col.id);
              const ColIcon = col.icon;

              return (
                <div key={col.id} className="flex-1 flex flex-col min-w-[280px]">
                  {/* Column Header */}
                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl ${col.bgClass} border ${col.borderClass} mb-4`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-white shadow-sm ${col.textClass}`}>
                        <ColIcon className="w-4 h-4" />
                      </div>
                      <span className="font-black text-sm text-gray-800">{col.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${col.textClass} ${col.badgeBg}`}>
                      {colSteps.length}
                    </span>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col gap-3 p-3 rounded-2xl min-h-[450px] transition-colors duration-200 border ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-50/20 border-indigo-200 border-dashed"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        {colSteps.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                            <AlertCircle className="w-8 h-8 stroke-1 text-gray-300 mb-2" />
                            <span className="text-xs font-medium">Trống</span>
                          </div>
                        ) : (
                          colSteps.map((step, index) => (
                            <Draggable key={step.id} draggableId={step.id} index={index}>
                              {(provided, dragSnapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                  className={`p-4 rounded-xl border bg-white select-none transition-shadow ${
                                    dragSnapshot.isDragging
                                      ? "shadow-2xl border-indigo-500 ring-2 ring-indigo-500/10 cursor-grabbing"
                                      : "shadow-sm border-gray-100 hover:shadow-md cursor-grab"
                                  }`}
                                >
                                  <h4 className="text-sm font-black text-gray-800 tracking-tight leading-snug">
                                    {step.label}
                                  </h4>
                                  {step.sublabel && (
                                    <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed">
                                      {step.sublabel}
                                    </p>
                                  )}
                                  {step.updatedAt && (
                                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-gray-400">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Cập nhật: {new Date(step.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default LiveTrackingBoard;
