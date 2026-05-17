import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ClinicPageShellProps {
  title: string;
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
  breadcrumbs,
  children,
  headerActions,
  footer,
  maxWidth = "max-w-7xl",
  fullHeight = false,
  noPadding = false,
  hideHeader = false,
}: ClinicPageShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#f4f6fb" }}
    >
      <DashboardSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopbar title={title} breadcrumbs={breadcrumbs} />

        <main 
          className={`flex-1 ${fullHeight ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`} 
          style={{ scrollbarWidth: "thin" }}
        >
          <div className={`
            ${maxWidth} mx-auto 
            ${noPadding ? "p-0" : "px-8 py-7"} 
            ${fullHeight ? "flex-1 flex flex-col min-h-0" : "flex flex-col gap-6"}
          `}>
            {/* Header Area */}
            {!hideHeader && !noPadding && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: "#111827",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {title}
                  </h2>
                </div>
                {headerActions && (
                  <div className="flex items-center gap-3">{headerActions}</div>
                )}
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

