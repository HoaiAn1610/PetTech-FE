import { Eye, PawPrint } from "lucide-react";
import { ClinicStatusBadge } from "@/components/clinic/ClinicStatusBadge";
import { PetDto } from "@/types/pet";

interface PatientTableProps {
  patients: PetDto[];
  onSelect: (p: PetDto) => void;
  customerEmails?: Record<string, string>;
}

export function PatientTable({ patients, onSelect, customerEmails }: PatientTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Bệnh nhân</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Chủ sở hữu</th>
              <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tạo</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Lịch tái khám</th>
              <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Sức khoẻ</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"></th>
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
                  <p className="text-xs font-medium text-gray-400 mt-1">Vui lòng thêm mới hoặc thử lại</p>
                </td>
              </tr>
            ) : (
              patients.map(p => {
                const score = p.bodyConditionScore ? (p.bodyConditionScore * 20) : 85;
                const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#f97316" : "#dc2626";
                
                // Species emoji picker
                let emoji = p.emoji || "🐾";
                if (!p.emoji) {
                  const sp = (p.species || "").toLowerCase();
                  if (sp.includes("chó") || sp.includes("dog")) emoji = "🐕";
                  else if (sp.includes("mèo") || sp.includes("cat")) emoji = "🐈";
                  else if (sp.includes("chim") || sp.includes("bird")) emoji = "🦜";
                  else if (sp.includes("thỏ") || sp.includes("rabbit")) emoji = "🐰";
                }

                // Render gender text
                const genderText = p.gender === "Male" ? "Đực" : p.gender === "Female" ? "Cái" : p.gender || "Chưa rõ";

                // Render status
                const status = (p.conditions && p.conditions.length > 0) ? "Đang điều trị" : "Khoẻ mạnh";

                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => onSelect(p)}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300" style={{ background: `${p.color || '#fbbf24'}22` }}>
                          {emoji}
                        </div>
                        <div>
                          <p className="text-[0.9rem] font-black text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-[0.7rem] font-bold text-gray-400 mt-1">{p.breed || "Không rõ"} · {genderText}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[0.82rem] font-black text-gray-700">{p.ownerName || "Khách vãng lai"}</p>
                      <p className="text-[0.7rem] font-bold text-gray-400 mt-0.5">
                        {p.ownerId ? (customerEmails?.[p.ownerId] || "Chưa có email") : "Chưa có"}
                      </p>
                    </td>
                    <td className="hidden md:table-cell px-6 py-5 text-[0.82rem] font-bold text-gray-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : "Đang cập nhật"}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-5">
                      <span className="text-[0.82rem] font-black text-gray-700">
                        1 tháng tới
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 rounded-full bg-gray-50 shadow-inner overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: scoreColor }} />
                        </div>
                        <span className="text-xs font-black" style={{ color: scoreColor }}>{score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <ClinicStatusBadge status={status} />
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
