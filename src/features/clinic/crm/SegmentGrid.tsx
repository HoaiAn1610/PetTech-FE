import { Send } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  count: number;
  color: string;
  bg: string;
  icon: string;
  desc: string;
  churnRisk: number;
  active: boolean;
}

interface SegmentGridProps {
  segments: Segment[];
  onStartCampaign: (seg: Segment) => void;
}

export function SegmentGrid({ segments, onStartCampaign }: SegmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {segments.map(seg => (
        <div key={seg.id} className="bg-white rounded-3xl p-6 flex flex-col gap-5 transition-all hover:-translate-y-1.5 hover:shadow-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent opacity-50 -mr-8 -mt-8 rounded-full" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-500" style={{ background: seg.bg }}>
                {seg.icon}
              </div>
              <div>
                <h3 className="text-[0.95rem] font-black text-gray-900 leading-tight">{seg.name}</h3>
                <p className="text-[0.7rem] font-medium text-gray-500 mt-1">{seg.desc}</p>
              </div>
            </div>
            <div className={"w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse " + (seg.active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-300")} />
          </div>

          <div className="flex items-end gap-6 relative z-10">
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter" style={{ color: seg.color }}>{seg.count}</p>
              <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mt-1">Khách hàng</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Chỉ số rủi ro</span>
                <span className={"text-xs font-black " + (seg.churnRisk > 0.5 ? "text-red-600" : seg.churnRisk > 0.25 ? "text-orange-600" : "text-green-600")}>
                  {Math.round(seg.churnRisk * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-50 overflow-hidden shadow-inner">
                <div className={"h-full rounded-full transition-all duration-1000 ease-out " + (seg.churnRisk > 0.5 ? "bg-red-500" : seg.churnRisk > 0.25 ? "bg-orange-500" : "bg-green-500")}
                  style={{ width: `${seg.churnRisk * 100}%` }} />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onStartCampaign(seg)}
            className="flex items-center justify-center gap-2.5 py-3 rounded-2xl transition-all active:scale-95 font-black text-xs relative z-10 shadow-sm"
            style={{ background: seg.bg, color: seg.color }}>
            <Send className="w-3.5 h-3.5" />
            Tạo chiến dịch mục tiêu
          </button>
        </div>
      ))}
    </div>
  );
}
