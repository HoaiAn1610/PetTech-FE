import { Mail } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  ltv: number;
  visits: number;
  score: number;
  lastVisit: string;
  churn: string;
  pet: string;
}

interface ClientTableProps {
  clients: Client[];
}

const churnColors: Record<string, string> = {
  "Thấp": "bg-green-50 text-green-700 border-green-100",
  "Trung bình": "bg-orange-50 text-orange-700 border-orange-100",
  "Cao": "bg-red-50 text-red-700 border-red-100",
};

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {["Chủ nuôi", "Thú cưng", "Số lần khám", "Giá trị trọn đời (LTV)", "Chỉ số SK", "Gần nhất", "Rủi ro churn", ""].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map(c => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-[0.9rem] shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="text-[0.85rem] font-black text-gray-900">{c.name}</p>
                      <p className="text-[0.7rem] font-bold text-gray-400 mt-0.5">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[0.8rem] font-bold text-gray-700">{c.pet}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[0.85rem] font-black text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg">{c.visits}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[0.9rem] font-black text-blue-600">${c.ltv.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 rounded-full bg-gray-50 shadow-inner overflow-hidden">
                      <div className={"h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] " + (c.score >= 80 ? "bg-green-500" : c.score >= 60 ? "bg-orange-500" : "bg-red-500")}
                        style={{ width: `${c.score}%` }} />
                    </div>
                    <span className={"text-xs font-black " + (c.score >= 80 ? "text-green-600" : c.score >= 60 ? "text-orange-600" : "text-red-600")}>{c.score}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[0.8rem] font-bold text-gray-500">{c.lastVisit}</td>
                <td className="px-6 py-5">
                  <span className={"px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border " + churnColors[c.churn]}>
                    {c.churn}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
