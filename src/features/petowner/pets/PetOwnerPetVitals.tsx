import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PetProfile } from "@/data/petProfiles";

// ─── Body Condition Score Visual ──────────────────────────────────────────────
export function BCSGauge({ score }: { score: number; species: string }) {
  const labels = [
    { range: "1–2", label: "Gầy kiệt",  color: "#dc2626" },
    { range: "3",   label: "Thiếu cân", color: "#ea580c" },
    { range: "4–5", label: "Lý tưởng",  color: "#16a34a" },
    { range: "6–7", label: "Thừa cân",  color: "#ea580c" },
    { range: "8–9", label: "Béo phì",   color: "#dc2626" },
  ];
  const colors = ["#dc2626","#dc2626","#ea580c","#16a34a","#16a34a","#ea580c","#ea580c","#dc2626","#dc2626"];
  const desc = score <= 2 ? "Gầy kiệt" : score === 3 ? "Thiếu cân" : score <= 5 ? "Cân nặng lý tưởng" : score <= 7 ? "Thừa cân" : "Béo phì";
  const descColor = score <= 2 || score >= 8 ? "#dc2626" : score === 3 || score >= 6 ? "#ea580c" : "#16a34a";

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
          <div key={n} className="flex-1 rounded-md transition-all"
            style={{
              height: "28px",
              background: n === score ? colors[n - 1] : `${colors[n - 1]}25`,
              border: n === score ? `2px solid ${colors[n - 1]}` : `1px solid ${colors[n - 1]}40`,
              transform: n === score ? "scaleY(1.15)" : "scaleY(1)",
            }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>1 — Gầy kiệt</span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: descColor }}>{desc}</span>
          <span className="px-2 py-0.5 rounded-md"
            style={{ background: `${descColor}15`, fontSize: "0.72rem", fontWeight: 700, color: descColor }}>
            BCS {score}/9
          </span>
        </div>
        <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>9 — Béo phì</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {labels.map(l => (
          <span key={l.range} className="px-2 py-0.5 rounded-md"
            style={{ background: `${l.color}10`, fontSize: "0.6rem", fontWeight: 600, color: l.color, border: `1px solid ${l.color}25` }}>
            {l.range}: {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Weight Chart ─────────────────────────────────────────────────────────────
export function WeightChart({ history, species }: { history: PetProfile["weightHistory"]; species: string }) {
  const first  = history[0].weight;
  const last   = history[history.length - 1].weight;
  const delta  = last - first;
  const min    = Math.floor(Math.min(...history.map(h => h.weight)) - 0.5);
  const max    = Math.ceil(Math.max(...history.map(h => h.weight)) + 0.5);

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          {delta > 0
            ? <TrendingUp className="w-4 h-4" style={{ color: species === "Dog" ? "#ea580c" : "#16a34a" }} />
            : <TrendingDown className="w-4 h-4" style={{ color: species === "Dog" ? "#16a34a" : "#ea580c" }} />}
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: delta > 0 ? "#ea580c" : "#16a34a" }}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)} kg trong 6 tháng
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Hiện tại: <strong style={{ color: "#111827" }}>{last} kg</strong></span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={history} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis domain={[min, max]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <Tooltip
            contentStyle={{ fontFamily: "Inter,sans-serif", fontSize: "0.78rem", borderRadius: "10px", border: "1px solid #e5e7eb" }}
            formatter={(v: number) => [`${v} kg`, "Cân nặng"]}
          />
          <Line type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5}
            dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 6, fill: "#2563EB" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
