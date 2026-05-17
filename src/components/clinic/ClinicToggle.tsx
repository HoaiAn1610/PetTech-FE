import { CheckCircle2 } from "lucide-react";

interface ClinicToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  sublabel?: string;
  accent?: string;
}

export function ClinicToggle({
  checked,
  onChange,
  label,
  sublabel,
  accent = "#2563EB",
}: ClinicToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 w-full text-left"
    >
      <div
        className="relative flex-shrink-0 rounded-full transition-all duration-300"
        style={{
          width: "48px",
          height: "26px",
          background: checked
            ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
            : "rgba(0,0,0,0.12)",
          boxShadow: checked ? `0 0 0 3px ${accent}22` : "none",
          border: checked ? `2px solid ${accent}55` : "2px solid rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="absolute top-0.5 rounded-full transition-all duration-300 flex items-center justify-center"
          style={{
            width: "18px",
            height: "18px",
            background: "white",
            left: checked ? "22px" : "2px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {checked && (
            <CheckCircle2 className="w-2.5 h-2.5" style={{ color: accent }} />
          )}
        </div>
      </div>
      {label && (
        <div className="min-w-0">
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: checked ? accent : "#374151",
            }}
          >
            {label}
          </p>
          {sublabel && (
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", lineHeight: 1.4 }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </button>
  );
}
