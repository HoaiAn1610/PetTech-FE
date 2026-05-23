import { useSearchParams } from "react-router";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { LiveTrackingBoard } from "@/components/kanban/LiveTrackingBoard";
import "@/styles/fonts.css";

export default function KanbanPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";

  return (
    <ClinicPageShell
      title="Bảng công việc"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Bảng công việc" },
      ]}
      fullHeight
      noPadding
      hideHeader
      maxWidth="max-w-none"
    >
      <LiveTrackingBoard bookingId={bookingId} />
    </ClinicPageShell>
  );
}


