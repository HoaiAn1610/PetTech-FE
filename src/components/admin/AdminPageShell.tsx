import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import "@/styles/fonts.css";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminPageShellProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
  /** Optional extra content to render after the topbar (e.g. secondary nav) */
  header?: React.ReactNode;
}

/**
 * Shared layout wrapper for every admin page.
 * Renders: AdminSidebar | flex-col (AdminTopbar + main scrollable area)
 */
export function AdminPageShell({ title, breadcrumbs, children, header }: AdminPageShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#f4f6fb" }}
    >
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar
          title={title}
          breadcrumbs={breadcrumbs ?? [{ label: "Cổng quản trị", href: "/admin" }, { label: title }]}
        />
        {header}
        <main className="flex-1 overflow-y-auto px-7 py-6" style={{ scrollbarWidth: "thin" }}>
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
