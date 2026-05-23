import { ShieldAlert, AlertTriangle } from "lucide-react";

export interface AllergyDto {
  id?: string;
  name: string;
  severity: "NHẸ" | "TRUNG BÌNH" | "NẶNG" | string;
  reaction: string;
  color?: string;
  bg?: string;
}

interface AllergyAlertsProps {
  allergies?: AllergyDto[];
}

export function AllergyAlerts({ allergies = [] }: AllergyAlertsProps) {
  if (!allergies || allergies.length === 0) return null;

  return (
    <div className="rounded-[2rem] border-2 border-red-100 bg-red-50/30 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-8 py-5 border-b border-red-100 bg-red-50/50">
        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
          <ShieldAlert className="w-4.5 h-4.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-xs font-black text-red-600 uppercase tracking-[0.15em]">Cảnh báo dị ứng nghiêm trọng</span>
        <span className="px-3 py-1 rounded-full bg-red-600 text-[0.6rem] font-black text-white uppercase tracking-wider ml-auto">
          {allergies.length} CẢNH BÁO
        </span>
      </div>
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {allergies.map((a, i) => {
          const color = a.severity === "NẶNG" ? "#dc2626" : a.severity === "TRUNG BÌNH" ? "#ea580c" : "#d97706";
          const bg = a.severity === "NẶNG" ? "rgba(220,38,38,0.07)" : a.severity === "TRUNG BÌNH" ? "rgba(249,115,22,0.07)" : "rgba(217,119,6,0.07)";
          return (
            <div key={a.id || i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-red-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.bg || bg }}>
                <AlertTriangle className="w-5 h-5" style={{ color: a.color || color }} />
              </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900">{a.name}</span>
                <span className="px-2 py-0.5 rounded-lg text-[0.55rem] font-black text-white" style={{ background: a.color }}>
                  {a.severity}
                </span>
              </div>
              <p className="text-[0.75rem] font-medium text-gray-500 mt-1">{a.reaction}</p>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
