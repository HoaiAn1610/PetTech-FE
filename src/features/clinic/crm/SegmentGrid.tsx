import { Send, Trash2, Edit } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  count: number;
  color: string;
  bg: string;
  icon: string;
  desc: string;
  active: boolean;
}

interface SegmentGridProps {
  segments: Segment[];
  onStartCampaign: (seg: Segment) => void;
  onDeleteSegment?: (id: string) => void;
  onEditSegment?: (seg: any) => void;
}

export function SegmentGrid({ segments, onStartCampaign, onDeleteSegment, onEditSegment }: SegmentGridProps) {
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
            <div className="flex flex-col items-end gap-2">
              <div className={"w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse " + (seg.active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-300")} />
              <div className="flex gap-1">
                {onEditSegment && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditSegment(seg); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                    title="Chỉnh sửa phân khúc"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {onDeleteSegment && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSegment(seg.id); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Xóa phân khúc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end gap-6 relative z-10 mb-2">
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter" style={{ color: seg.color }}>{seg.count}</p>
              <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mt-1">Khách hàng</p>
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
