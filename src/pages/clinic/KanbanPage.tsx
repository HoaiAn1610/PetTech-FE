import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import "@/styles/fonts.css";

export default function KanbanPage() {
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
      <KanbanBoard />
    </ClinicPageShell>
  );
}


