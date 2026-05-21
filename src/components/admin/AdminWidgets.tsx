import React from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { Skeleton } from "@mui/material";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/** Reusable card used across all admin pages for KPI/stat display */
export function AdminKPICard({
  label, value, sub,
  icon: Icon, color, bg,
  trend, trendUp,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div
      className="bg-white rounded-2xl px-5 py-5 flex flex-col gap-3"
      style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: trendUp === false ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)",
              fontSize: "0.68rem", fontWeight: 700,
              color: trendUp === false ? "#dc2626" : "#16a34a",
            }}
          >
            {trendUp === false
              ? <TrendingDown className="w-3 h-3" />
              : <TrendingUp className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: "1.6rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af", marginTop: "4px" }}>{label}</p>
        {sub && <p style={{ fontSize: "0.65rem", color: "#d1d5db", marginTop: "2px" }}>{sub}</p>}
      </div>
    </div>
  );
}

/** White card panel with consistent border + shadow, used for chart/table wrappers */
export function AdminCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", ...style }}
    >
      {children}
    </div>
  );
}

/** Card header row with title + optional action slot */
export function AdminCardHeader({
  title, subtitle, action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>{title}</h3>
        {subtitle && (
          <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "1px" }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Standardized status badge with dot and background */
export function AdminStatusBadge({
  status,
  type = "neutral",
  customColor,
  customBg,
}: {
  status: string;
  type?: "success" | "warning" | "error" | "info" | "neutral";
  customColor?: string;
  customBg?: string;
}) {
  const themes = {
    success: { bg: "rgba(22,163,74,0.08)",  text: "#16a34a", dot: "#22c55e" },
    warning: { bg: "rgba(249,115,22,0.08)", text: "#ea580c", dot: "#f97316" },
    error:   { bg: "rgba(220,38,38,0.08)",  text: "#dc2626", dot: "#ef4444" },
    info:    { bg: "rgba(37,99,235,0.08)",  text: "#2563EB", dot: "#60a5fa" },
    neutral: { bg: "rgba(107,114,128,0.08)",text: "#6b7280", dot: "#9ca3af" },
  };

  const theme = themes[type];
  
  return (
    <span 
      className="px-2.5 py-1 rounded-full flex items-center gap-1.5" 
      style={{ background: customBg || theme.bg, display: "inline-flex" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: customColor || theme.dot }} />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: customColor || theme.text }}>{status}</span>
    </span>
  );
}

/** Standardized table for admin data lists */
export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <tr>
            {headers.map((h, i) => (
              <th 
                key={i} 
                className="px-5 py-3 text-left whitespace-nowrap" 
                style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}
              >
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}


// ─── SkeletonCard ──────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={className} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      {lines > 2 && <Skeleton variant="text" width="30%" height={16} />}
    </div>
  );
}

// ─── SkeletonTable ──────────────────────────────────────────────────────────
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={44} sx={{ borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ─── ConfirmDialog ──────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = 'Xác nhận', cancelLabel = 'Hủy',
  destructive = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 500 }} />
        <AlertDialog.Content style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
          maxWidth: 440, width: '90vw', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          zIndex: 501, fontFamily: 'Inter, sans-serif',
        }}>
          <AlertDialog.Title style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 24 }}>
            {description}
          </AlertDialog.Description>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <AlertDialog.Cancel asChild>
              <button onClick={onCancel} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, color: '#374151' }}>
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={onConfirm} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: destructive ? '#dc2626' : '#6366f1', color: '#fff', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
