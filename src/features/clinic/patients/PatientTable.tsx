import { Eye, PawPrint } from "lucide-react";
import { ClinicStatusBadge } from "@/components/clinic/ClinicStatusBadge";

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  color: string;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  lastVisit: string;
  nextVisit: string;
  status: string;
  alerts: string[];
  vaccineDue: boolean;
  healthScore: number;
  vet: string;
}

interface PatientTableProps {
  patients: Patient[];
  onSelect: (p: Patient) => void;
}

export function PatientTable({ patients, onSelect }: PatientTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {["Bệnh nhân", "Chủ sở hữu", "Lần khám trước", "Lịch tái khám", "Điểm sức khoẻ", "Trạng thái", ""].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-tight">Không tìm thấy bệnh nhân</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">Vui lòng thử lại với bộ lọc khác</p>
                </td>
              </tr>
            ) : (
              patients.map(p => {
                const scoreColor = p.healthScore >= 85 ? "#16a34a" : p.healthScore >= 70 ? "#f97316" : "#dc2626";
                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => onSelect(p)}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300" style={{ background: `${p.color}22` }}>
                          {p.species === "Dog" ? "🐕" : p.species === "Cat" ? "🐈" : p.species === "Bird" ? "🦜" : "🐰"}
                        </div>
                        <div>
                          <p className="text-[0.9rem] font-black text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-[0.7rem] font-bold text-gray-400 mt-1">{p.breed} · {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[0.82rem] font-black text-gray-700">{p.owner}</p>
                      <p className="text-[0.7rem] font-bold text-gray-400 mt-0.5">{p.ownerEmail}</p>
                    </td>
                    <td className="px-6 py-5 text-[0.82rem] font-bold text-gray-500">{p.lastVisit}</td>
                    <td className="px-6 py-5">
                      <span className={"text-[0.82rem] font-black " + (p.nextVisit === "Quá hạn" ? "text-red-500 bg-red-50 px-2 py-1 rounded-lg" : "text-gray-700")}>
                        {p.nextVisit}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 rounded-full bg-gray-50 shadow-inner overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.healthScore}%`, background: scoreColor }} />
                        </div>
                        <span className="text-xs font-black" style={{ color: scoreColor }}>{p.healthScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <ClinicStatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
