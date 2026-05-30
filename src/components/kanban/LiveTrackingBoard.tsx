import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useFeature } from "@/hooks/useFeature";
import { useTenant } from "@/context/TenantContext";
import axiosInstance from "@/api/axiosInstance";
import { bookingService } from "@/api/bookingService";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  Loader2, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  X
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
  const base = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
  try {
    if (!base) return "/hubs/tracking";
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
  const [activeBookingIds, setActiveBookingIds] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<TrackingStepDto | null>(null);

  // 1. Fetch data initially
  const fetchSteps = async () => {
    setLoading(true);
    try {
      if (bookingId) {
        const data: any = await axiosInstance.get(`/api/shop/Tracking/bookings/${bookingId}`);
        setSteps(Array.isArray(data) ? data : (data?.items || []));
      } else {
        // 1. Fetch all tracking steps using the new optimized endpoint
        const trackingData: any = await axiosInstance.get("/api/shop/Tracking/bookings");
        const allSteps = Array.isArray(trackingData) ? trackingData : (trackingData?.items || []);
        setSteps(allSteps);

        // 2. Fetch active bookings just to extract their IDs so we can join their SignalR rooms
        const bookingsData = await bookingService.getBookings();
        const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.items || []);
        
        const activeBookings = bookings.filter((b: any) => 
          ["CheckedIn", "InProgress", "Confirmed"].includes(b.status)
        );
        
        setActiveBookingIds(activeBookings.map((b: any) => b.id));
      }
    } catch (error) {
      console.error("Failed to fetch tracking steps from API:", error);
      setSteps([]); // Leave empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, [bookingId]);

  // 2. Setup SignalR Real-time Hub Connection
  useEffect(() => {
    if (!hasLiveTracking) return;

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

        // Join tracking group room. If bookingId exists, join specific, else join for all active bookings
        if (bookingId) {
          await connection.invoke("JoinTracking", bookingId).catch(console.warn);
        } else if (activeBookingIds.length > 0) {
          for (const id of activeBookingIds) {
            await connection.invoke("JoinTracking", id).catch(console.warn);
          }
        }

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
  }, [bookingId, hasLiveTracking, JSON.stringify(activeBookingIds)]);

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
      // Patch update payload: { state: newState } to REST API
      await axiosInstance.patch(`/api/shop/Tracking/${draggableId}`, { state: newState });
    } catch (err: any) {
      console.error("Failed to update step state", err);
      // Rollback to original state on failure
      setSteps(previousSteps);
      alert("Không thể lưu thay đổi trạng thái, đang khôi phục lại bảng...");
    }
  };

  if (tenantLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h4 className="text-lg font-black text-gray-800">Đang tải bảng theo dõi...</h4>
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
                                  onClick={() => setSelectedStep(step)}
                                  className={`p-4 rounded-xl border bg-white select-none transition-shadow ${
                                    dragSnapshot.isDragging
                                      ? "shadow-2xl border-indigo-500 ring-2 ring-indigo-500/10 cursor-grabbing"
                                      : "shadow-sm border-gray-100 hover:shadow-md cursor-grab"
                                  }`}
                                >
                                  {step.sublabel && (
                                    <h4 className="text-sm font-black text-indigo-650 tracking-tight leading-snug mb-1">
                                      {step.sublabel.replace('Dịch vụ: ', '')}
                                    </h4>
                                  )}
                                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                                    {step.label}
                                  </p>
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

      {/* Modal Detail */}
      {selectedStep && (
        <div
          onClick={() => setSelectedStep(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Chi tiết tiến trình
                </h3>
              </div>
              <button
                onClick={() => setSelectedStep(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Dịch vụ</p>
                <p className="text-base font-black text-indigo-650">{selectedStep.sublabel || 'Không có'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Khách hàng & Thú cưng</p>
                <p className="text-sm font-semibold text-gray-800">{selectedStep.label}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Trạng thái</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700">
                    {selectedStep.state === 'Pending' ? 'Chờ xử lý' : selectedStep.state === 'Active' ? 'Đang thực hiện' : 'Hoàn tất'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Cập nhật lúc</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-gray-800">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedStep.updatedAt ? new Date(selectedStep.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedStep(null)} 
                className="px-5 py-2.5 rounded-xl text-gray-700 font-bold text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingBoard;
