import { Pause, Play, Send, Edit, Trash2 } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  segment: string;
  channel: string;
  status: "active" | "paused";
  sent: number;
  openRate: number;
  clickRate: number;
  lastRun: string;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  onToggle: (id: string) => void;
  onExecute?: (id: string) => void;
  onEdit?: (campaign: any) => void;
  onDelete?: (id: string) => void;
}

const CHANNEL_ICONS: Record<string, string> = { "email": "📧", "sms": "📱", "email+sms": "📧📱", "zalo": "💬" };

export function CampaignTable({ campaigns, onToggle, onExecute, onEdit, onDelete }: CampaignTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {["Chiến dịch", "Phân khúc", "Kênh", "Quy mô", "Trạng thái", ""].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campaigns.map(c => (
              <tr key={c.id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-5">
                  <p className="text-[0.9rem] font-black text-gray-900 group-hover:text-primary transition-colors">{c.name}</p>
                  <p className="text-[0.7rem] font-bold text-gray-400 mt-0.5">Chạy gần nhất: {c.lastRun}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[0.8rem] font-bold text-gray-700">{c.segment}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xl shadow-sm rounded-lg p-1 bg-white border border-gray-50">{CHANNEL_ICONS[c.channel] || "📧"}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[0.85rem] font-black text-gray-900">{c.sent.toLocaleString()} ca</span>
                </td>
                <td className="px-6 py-5">
                  <span className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider " + 
                    (c.status === "active" ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100")}>
                    <span className={"w-1.5 h-1.5 rounded-full " + (c.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
                    {c.status === "active" ? "Đang chạy" : "Tạm dừng"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onToggle(c.id)}
                      className={"w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm " + 
                        (c.status === "active" ? "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100" : "bg-primary text-white hover:bg-primary-hover")}
                      title={c.status === "active" ? "Tạm dừng" : "Kích hoạt"}>
                      {c.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    {onExecute && (
                      <button 
                        onClick={() => onExecute(c.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
                        title="Gửi ngay lập tức">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(c)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary border border-gray-100"
                        title="Chỉnh sửa chiến dịch">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(c.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm bg-red-50 text-red-600 hover:bg-red-100"
                        title="Xóa chiến dịch">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
