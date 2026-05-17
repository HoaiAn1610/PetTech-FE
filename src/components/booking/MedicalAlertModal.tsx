import { useState } from "react";
import {
  AlertTriangle,
  X,
  ShieldAlert,
  Trash2,
  FileText,
  ChevronRight,
} from "lucide-react";

interface MedicalAlertModalProps {
  onClose: () => void;
  onRemove: () => void;
}

export function MedicalAlertModal({ onClose, onRemove }: MedicalAlertModalProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      onRemove();
    }, 600);
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(10, 5, 5, 0.72)", backdropFilter: "blur(4px)" }}
    >
      {/* ── Modal shell ── */}
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "white",
          boxShadow: "0 0 0 1px rgba(220,38,38,0.25), 0 32px 80px rgba(220,38,38,0.35), 0 8px 32px rgba(0,0,0,0.4)",
          animation: "modalPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <style>{`
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.88) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.12); opacity: 0.6; }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
        `}</style>

        {/* ── Red gradient header ── */}
        <div
          className="relative px-7 pt-8 pb-7 flex flex-col items-center text-center overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #7f1d1d 0%, #991b1b 35%, #dc2626 100%)",
          }}
        >
          {/* Subtle shimmer bar */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
              backgroundSize: "400px 100%",
              animation: "shimmer 2.4s infinite linear",
            }}
          />

          {/* Decorative background circles */}
          <div
            className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-14 -left-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: "white" }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Pulsing icon ring */}
          <div className="relative mb-4 z-10">
            {/* Outer pulse ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(255,255,255,0.15)",
                transform: "scale(1.5)",
                animation: "pulseRing 1.8s ease-in-out infinite",
              }}
            />
            {/* Middle ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                transform: "scale(1.25)",
                animation: "pulseRing 1.8s ease-in-out infinite 0.3s",
              }}
            />
            {/* Icon container */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "2.5px solid rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              <ShieldAlert className="w-10 h-10 text-white" strokeWidth={1.8} />
            </div>
          </div>

          {/* Alert label */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 z-10"
            style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-200" strokeWidth={2.5} />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.12em",
              }}
            >
              CẢNH BÁO Y TẾ
            </span>
          </div>

          <h2
            className="text-white z-10"
            style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.25 }}
          >
            Phát hiện dị ứng nghiêm trọng
          </h2>
          <p
            className="mt-1.5 z-10"
            style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}
          >
            Cần thực hiện hành động trước khi tiếp tục lịch hẹn
          </p>
        </div>

        {/* ── Alert body ── */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Main alert message */}
          <div
            className="rounded-2xl p-5 flex gap-4"
            style={{
              background: "#fff5f5",
              border: "2px solid #fecaca",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(220,38,38,0.1)" }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: "#dc2626" }} strokeWidth={2.5} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#7f1d1d",
                  lineHeight: 1.45,
                }}
              >
                Thú cưng được chọn bị dị ứng nghiêm trọng với{" "}
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{ background: "#dc2626", color: "white", fontWeight: 800 }}
                >
                  Beef (Thịt bò)
                </span>
                .
              </p>
              <p
                className="mt-2"
                style={{ fontSize: "0.82rem", color: "#b91c1c", lineHeight: 1.55 }}
              >
                Mục này đã bị gắn cờ trong hồ sơ của{" "}
                <strong>Bella</strong>. Sử dụng hoặc đề xuất sản phẩm này có thể gây sốc phản vệ nghiêm trọng.
              </p>
            </div>
          </div>

          {/* Pet + Item detail pills */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bệnh nhân", value: "Bella (Golden Retriever)", icon: "🐶", color: "#2563EB", bg: "rgba(37,99,235,0.06)" },
              { label: "Mục bị cảnh báo", value: "Royal Canin Beef — 400g", icon: "🥩", color: "#dc2626", bg: "rgba(220,38,38,0.06)" },
              { label: "Mức độ dị ứng", value: "NGUY HIỂM — Nguy cơ sốc phản vệ", icon: "⚠️", color: "#d97706", bg: "rgba(217,119,6,0.06)" },
              { label: "Ghi nhận bởi", value: "BS. Nguyễn Thị Lan · 12 Th1 2026", icon: "👩‍⚕️", color: "#16a34a", bg: "rgba(22,163,74,0.06)" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3.5"
                style={{ background: item.bg, border: `1px solid ${item.color}22` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>
                  <span
                    style={{ fontSize: "0.65rem", fontWeight: 700, color: item.color, letterSpacing: "0.06em" }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#111827" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleRemove}
              disabled={removing}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: removing
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                color: "white",
                fontSize: "0.95rem",
                fontWeight: 700,
                boxShadow: removing ? "none" : "0 6px 20px rgba(220,38,38,0.45)",
                letterSpacing: "-0.01em",
              }}
            >
              {removing ? (
                <>
                  <div
                    className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: "white", borderTopColor: "transparent" }}
                  />
                  Đang xóa…
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                  Xóa khỏi giỏ hàng
                </>
              )}
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-150 hover:bg-gray-100"
                style={{
                  background: "#f9fafb",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                <X className="w-4 h-4" />
                Đóng
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-150 hover:bg-blue-50"
                style={{
                  background: "rgba(37,99,235,0.06)",
                  border: "1.5px solid rgba(37,99,235,0.2)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#2563EB",
                }}
              >
                <FileText className="w-4 h-4" />
                Xem hồ sơ y tế
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div
          className="px-7 py-3 flex items-center gap-2 border-t"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fff9f9" }}
        >
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#dc2626" }} />
          <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
            Cảnh báo này được kích hoạt tự động bởi hệ thống phát hiện dị ứng sinh học PetTech.
            Tất cả cảnh báo đều được lưu vào hồ sơ bệnh nhân.
          </p>
        </div>
      </div>
    </div>
  );
}