import { useState } from "react";
import { Send } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";

interface Segment {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface NewCampaignModalProps {
  segments: Segment[];
  onClose: () => void;
  onSave: (name: string) => void;
}

export function NewCampaignModal({ segments, onClose, onSave }: NewCampaignModalProps) {
  const [name, setName] = useState("");
  const [seg, setSeg] = useState(segments[0]?.name || "");
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const canSave = name && seg && subject;

  return (
    <ClinicModal title="Thiết lập chiến dịch mới" onClose={onClose}>
      <div className="flex flex-col gap-5 py-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tên chiến dịch *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="VD: Nhắc nhở tiêm vaccine tháng 3"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-600 transition-colors text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Phân khúc khách hàng</label>
            <select
              value={seg}
              onChange={e => setSeg(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-600 transition-colors text-sm font-medium bg-white"
            >
              {segments.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name} ({s.count})</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kênh truyền thông</label>
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-600 transition-colors text-sm font-medium bg-white"
            >
              <option value="email">📧 Email Marketing</option>
              <option value="sms">📱 Tin nhắn SMS</option>
              <option value="email+sms">📧📱 Đa kênh (Email + SMS)</option>
            </select>
          </div>
        </div>

        {(channel === "email" || channel === "email+sms") && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tiêu đề email *</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="VD: {{pet_name}} cần được chăm sóc!"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-600 transition-colors text-sm font-medium"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nội dung thông điệp</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder="Nội dung sẽ được cá nhân hóa cho từng khách hàng..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-600 transition-colors text-sm font-medium resize-none leading-relaxed"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-gray-50 text-gray-600 font-black text-sm hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={!canSave}
            onClick={() => { onSave(name); onClose(); }}
            className="flex-[2] py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-black text-sm"
            style={{
              background: canSave ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e2e8f0",
              color: canSave ? "white" : "#94a3b8",
              boxShadow: canSave ? "0 10px 20px -5px rgba(37,99,235,0.4)" : "none"
            }}
          >
            <Send className="w-4 h-4" />
            Khởi động chiến dịch
          </button>
        </div>
      </div>
    </ClinicModal>
  );
}
