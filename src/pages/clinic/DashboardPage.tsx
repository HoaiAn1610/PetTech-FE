import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { PlanUsageSection } from "@/components/dashboard/PlanUsageSection";
import { BillingHistory } from "@/components/dashboard/BillingHistory";
import "@/styles/fonts.css";

export default function DashboardPage() {
  return (
    <ClinicPageShell
      title="Thanh toán & Gói dịch vụ"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Thanh toán" },
      ]}
      maxWidth="max-w-6xl"
    >
      <div className="flex flex-col gap-7">
        <PlanUsageSection />
        <BillingHistory />
      </div>
    </ClinicPageShell>
  );
}

