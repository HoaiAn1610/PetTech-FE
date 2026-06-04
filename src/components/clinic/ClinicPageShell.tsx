import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ClinicPageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  fullHeight?: boolean;
  noPadding?: boolean;
  hideHeader?: boolean;
}

export function ClinicPageShell({
  title,
  subtitle,
  breadcrumbs,
  children,
  headerActions,
  footer,
  maxWidth = "max-w-7xl",
  fullHeight = false,
  noPadding = false,
  hideHeader = false,
}: ClinicPageShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#f4f6fb" }}
    >
      <DashboardSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopbar 
          title={title} 
          breadcrumbs={breadcrumbs} 
          showTitle={true} 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <main 
          className={`flex-1 ${fullHeight ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`} 
          style={{ scrollbarWidth: "thin" }}
        >
          <div className={`
            w-full ${maxWidth} mx-auto 
            ${noPadding ? "p-0" : "px-4 py-4 md:px-8 md:py-7"} 
            ${fullHeight ? "flex-1 flex flex-col min-h-0" : "flex flex-col gap-4 md:gap-6"}
          `}>
            {/* Header Area */}
            {!hideHeader && !noPadding && headerActions && (
              <div className="flex flex-row items-center justify-end gap-4">
                <div className="flex items-center gap-3">{headerActions}</div>
              </div>
            )}

            {/* Content Area */}
            {children}
            
            {/* Bottom Spacer */}
            {!fullHeight && <div className="h-4 flex-shrink-0" />}
          </div>
        </main>

        {footer}
      </div>
    </div>
  );
}

