import { useState } from "react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { QuickBookingSidebar } from "@/components/booking/QuickBookingSidebar";
import { WeeklyCalendar } from "@/components/booking/WeeklyCalendar";
import { MedicalAlertModal } from "@/components/booking/MedicalAlertModal";
import "@/styles/fonts.css";

export default function BookingPage() {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <ClinicPageShell
      title="Lịch hẹn thông minh"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Lịch hẹn" },
      ]}
      fullHeight
      noPadding
      hideHeader
      maxWidth="max-w-none"
    >
      <div className="flex flex-1 min-h-0">
        {/* Quick booking form sidebar */}
        <QuickBookingSidebar onTriggerAlert={() => setAlertOpen(true)} />

        {/* Main calendar */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <WeeklyCalendar onAlertClick={() => setAlertOpen(true)} />
        </div>
      </div>

      {/* ── Medical Alert Modal – overlaid on everything ── */}
      {alertOpen && (
        <MedicalAlertModal
          onClose={() => setAlertOpen(false)}
          onRemove={() => setAlertOpen(false)}
        />
      )}
    </ClinicPageShell>
  );
}

