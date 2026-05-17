import { X, AlertTriangle, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import type { AllergenConflict } from "../../data/petProfiles";

interface AllergenWarningModalProps {
  productName: string;
  productEmoji: string;
  conflicts: AllergenConflict[];
  onAddAnyway: () => void;
  onCancel: () => void;
}

const SEVERITY_CONFIG = {
  mild: {
    label: "Nhẹ",
    bg: "rgba(249,115,22,0.07)",
    border: "rgba(249,115,22,0.25)",
    color: "#ea580c",
    badgeBg: "rgba(249,115,22,0.12)",
    icon: Info,
    dot: "#f97316",
  },
  moderate: {
    label: "Trung bình",
    bg: "rgba(220,38,38,0.06)",
    border: "rgba(220,38,38,0.2)",
    color: "#dc2626",
    badgeBg: "rgba(220,38,38,0.1)",
    icon: AlertTriangle,
    dot: "#dc2626",
  },
  severe: {
    label: "NGHIÊM TRỌNG",
    bg: "rgba(124,58,237,0.06)",
    border: "rgba(124,58,237,0.25)",
    color: "#7c3aed",
    badgeBg: "rgba(124,58,237,0.12)",
    icon: ShieldAlert,
    dot: "#7c3aed",
  },
} as const;

export function AllergenWarningModal({
  productName,
  productEmoji,
  conflicts,
  onAddAnyway,
  onCancel,
}: AllergenWarningModalProps) {
  const hasSevere = conflicts.some(c => c.severity === "severe");

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="px-6 py-5 flex items-start gap-4"
          style={{
            background: hasSevere
              ? "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(220,38,38,0.06))"
              : "linear-gradient(135deg, rgba(220,38,38,0.07), rgba(249,115,22,0.05))",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: hasSevere ? "rgba(124,58,237,0.12)" : "rgba(220,38,38,0.1)" }}
          >
            <ShieldAlert className="w-6 h-6" style={{ color: hasSevere ? "#7c3aed" : "#dc2626" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>
              ⚠️ Phát Hiện Cảnh Báo Dị Ứng
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "4px", lineHeight: 1.5 }}>
              Sản phẩm này có thể chứa thành phần xung đột với hồ sơ y tế của thú cưng bạn.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* ── Product Summary ── */}
        <div className="px-6 pt-5 pb-3">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "#f8fafc", border: "1.5px solid #e5e7eb" }}
          >
            <span className="text-3xl">{productEmoji}</span>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em" }}>
                SẢN PHẨM CẦN XEM XÉT
              </p>
              <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>{productName}</p>
            </div>
          </div>
        </div>

        {/* ── Conflict List ── */}
        <div className="px-6 pb-4 flex flex-col gap-3">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em" }}>
            XUNG ĐỘT PHÁT HIỆN ({conflicts.length})
          </p>

          {conflicts.map((c, i) => {
            const cfg = SEVERITY_CONFIG[c.severity];
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${cfg.border}`, background: cfg.bg }}
              >
                {/* Pet + allergen header */}
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.petEmoji}</span>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{c.petName}</p>
                      <p style={{ fontSize: "0.7rem", fontWeight: 600, color: cfg.color }}>
                        Dị ứng: {c.allergenLabel}
                      </p>
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{ background: cfg.badgeBg, fontSize: "0.65rem", fontWeight: 800, color: cfg.color }}
                  >
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                {/* Reaction description */}
                <div className="px-4 py-2.5">
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", marginBottom: "3px" }}>
                    PHẢN ỨNG ĐÃ BIẾT
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.55 }}>{c.reaction}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Disclaimer ── */}
        {hasSevere && (
          <div
            className="mx-6 mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#7c3aed" }} />
            <p style={{ fontSize: "0.72rem", color: "#5b21b6", lineHeight: 1.55 }}>
              <strong>Dị ứng nghiêm trọng đã ghi nhận.</strong> Tiếp xúc với thành phần này có thể gây ra tình trạng khẩn cấp y tế nghiêm trọng. Chúng tôi khuyến nghị mạnh mẽ nên xóa sản phẩm này.
            </p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
              color: "white",
              fontSize: "0.88rem",
              fontWeight: 700,
            }}
          >
            <ShieldCheck className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Bảo vệ thú cưng — Xóa khỏi giỏ
          </button>
          <button
            onClick={onAddAnyway}
            className="px-4 py-3 rounded-xl transition-all hover:bg-gray-100"
            style={{
              background: "#f4f6fb",
              color: "#9ca3af",
              fontSize: "0.82rem",
              fontWeight: 600,
              border: "1.5px solid #e5e7eb",
            }}
          >
            Vẫn thêm vào
          </button>
        </div>
      </div>
    </div>
  );
}