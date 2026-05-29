import { useEffect, useState, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useTenant } from "@/context/TenantContext";

const getHubUrl = () => {
  const base = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
  try {
    if (!base) return "/hubs/kanban";
    const url = new URL(base);
    return `${url.origin}/hubs/kanban`;
  } catch (e) {
    return `${base}/hubs/kanban`;
  }
};

/**
 * Custom Hook for real-time synchronization of clinic dashboards and boards using SignalR.
 * 
 * @param onUpdate Callback function to invoke when a data update event is received from the backend.
 */
export function useKanbanSignalR(onUpdate: () => void) {
  const { tenant } = useTenant();
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep callback ref updated to avoid restarting the Hub when callback changes
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const tenantId = tenant?.id;
    if (!tenantId) {
      console.warn("SignalR (useKanbanSignalR): tenantId is missing, deferring hub connection.");
      return;
    }

    const hubUrl = getHubUrl();
    console.log(`SignalR (useKanbanSignalR): Connecting to hub: ${hubUrl}`);

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startHub = async () => {
      try {
        await connection.start();
        setIsConnected(true);
        console.log("SignalR (useKanbanSignalR): Connection established successfully!");

        // Join specific room for the current Tenant
        await connection.invoke("JoinBoard", tenantId);
        console.log(`SignalR (useKanbanSignalR): Joined Kanban room for Tenant: ${tenantId}`);

        const triggerUpdate = () => {
          console.log("SignalR (useKanbanSignalR): Received broadcast event, triggering refetch callback...");
          onUpdateRef.current();
        };

        // Listen for core backend broadcast events
        connection.on("BoardUpdated", triggerUpdate);
        connection.on("BookingCreated", triggerUpdate);
        connection.on("BookingUpdated", triggerUpdate);
        connection.on("KanbanUpdated", triggerUpdate);
      } catch (err) {
        console.error("SignalR (useKanbanSignalR): Failed to connect to Kanban Hub", err);
      }
    };

    startHub();

    // Cleanup: stop connection and unregister handlers to prevent memory leaks
    return () => {
      if (connection) {
        connection.off("BoardUpdated");
        connection.off("BookingCreated");
        connection.off("BookingUpdated");
        connection.off("KanbanUpdated");
        connection.stop().then(() => {
          console.log("SignalR (useKanbanSignalR): Connection closed and resources freed.");
        }).catch((err) => {
          console.warn("SignalR (useKanbanSignalR): Error during connection stop", err);
        });
        setIsConnected(false);
      }
    };
  }, [tenant?.id]);

  return {
    connection: connectionRef.current,
    isConnected,
  };
}
