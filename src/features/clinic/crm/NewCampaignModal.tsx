import { useState, useRef } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";

export interface Segment {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface NewCampaignModalProps {
  segments: Segment[];
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  initialSegmentId?: string;
  campaign?: any;
}

const CAMPAIGN_TYPES = [
  { value: "VaccineReminder", label: "Nhắc lịch tiêm Vaccine định kỳ" },
  { value: "Birthday", label: "Chúc mừng sinh nhật" },
  { value: "ChurnWinback", label: "Lôi kéo khách hàng (Winback)" },
  { value: "CartAbandonment", label: "Nhắc nhở giỏ hàng bị bỏ quên" },
  { value: "PostVisit", label: "Chăm sóc sau khám/spa" },
  { value: "Custom", label: "Kịch bản tùy chỉnh tự do" }
];

const typeRevMapping: Record<number, string> = {
  0: "VaccineReminder",
  1: "Birthday",
  2: "ChurnWinback",
  3: "CartAbandonment",
  4: "PostVisit",
  5: "Custom"
};

export function NewCampaignModal({ segments, onClose, onSave, initialSegmentId, campaign }: NewCampaignModalProps) {
  // Part 1: Basic Info
  const [name, setName] = useState(campaign?.name || "");
  const [type, setType] = useState(() => {
    if (campaign?.type !== undefined) {
      if (typeof campaign.type === "number") {
        return typeRevMapping[campaign.type] || "Custom";
      }
      return campaign.type;
    }
    return CAMPAIGN_TYPES[0].value;
  });
  const [channel, setChannel] = useState(campaign?.channel || "email");

  // Part 2: Trigger & Audience
  const [segmentId, setSegmentId] = useState(campaign?.segmentId || initialSegmentId || segments[0]?.id || "");
  
  // Parse delay minutes
  let initialDelayValue = 0;
  let initialDelayUnit: "minutes" | "hours" | "days" = "minutes";
  if (campaign?.triggerConfig?.delayMinutes) {
    const mins = campaign.triggerConfig.delayMinutes;
    if (mins % 1440 === 0) {
      initialDelayValue = mins / 1440;
      initialDelayUnit = "days";
    } else if (mins % 60 === 0) {
      initialDelayValue = mins / 60;
      initialDelayUnit = "hours";
    } else {
      initialDelayValue = mins;
      initialDelayUnit = "minutes";
    }
  }

  const [delayValue, setDelayValue] = useState<number>(initialDelayValue);
  const [delayUnit, setDelayUnit] = useState<"minutes" | "hours" | "days">(initialDelayUnit);

  // Part 3: Message Template
  const [templateContent, setTemplateContent] = useState(campaign?.templateContent || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [saving, setSaving] = useState(false);

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = templateContent;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    setTemplateContent(before + variable + after);
    
    // Set focus back and move cursor after variable
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + variable.length;
        textareaRef.current.selectionEnd = start + variable.length;
      }
    }, 0);
  };

  const handleSave = async () => {
    let delayMinutes = delayValue || 0;
    if (delayUnit === "hours") delayMinutes *= 60;
    if (delayUnit === "days") delayMinutes *= 1440;

    const payload = {
      name,
      type,
      channel,
      segmentId,
      triggerType: campaign?.triggerType || "auto",
      triggerConfig: {
        eventType: String(type),
        delayMinutes
      },
      templateContent
    };

    setSaving(true);
    try {
      await onSave(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const canSave = name.trim() && segmentId && templateContent.trim();

  return (
    <ClinicModal title={campaign ? "Chỉnh sửa chiến dịch tự động" : "Thiết lập chiến dịch tự động"} onClose={onClose}>
      <div className="flex flex-col gap-6 py-2 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
        
        {/* Phần 1: Thông tin cơ bản */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
          <h3 className="font-black text-gray-800 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              style={{ background: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 15%, transparent)", color: "var(--primary-theme-color, #2563EB)" }}>1</span>
            Thông tin cơ bản
          </h3>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Tên chiến dịch *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Nhắc nhở tiêm vaccine tháng 3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors text-sm font-medium bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Loại chiến dịch</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors text-sm font-medium bg-white"
              >
                {CAMPAIGN_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Kênh truyền thông</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors text-sm font-medium bg-white"
              >
                <option value="email">📧 Email Marketing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Phần 2: Điều kiện kích hoạt */}
        <div className="p-5 rounded-2xl border flex flex-col gap-4"
          style={{ background: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 3%, transparent)", borderColor: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 15%, transparent)" }}>
          <h3 className="font-black text-sm flex items-center gap-2" style={{ color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black)" }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              style={{ background: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 20%, transparent)", color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 90%, black)" }}>2</span>
            Điều kiện kích hoạt (IF)
          </h3>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-primary/70 uppercase tracking-wider">Đối tượng nhận (Phân khúc)</label>
            <select
              value={segmentId}
              onChange={e => setSegmentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary/20 outline-none focus:border-primary transition-colors text-sm font-medium bg-white"
            >
              <option value="" disabled>-- Chọn phân khúc --</option>
              {segments.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name} ({s.count} KH)</option>)}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-primary/70 uppercase tracking-wider">Thời gian trễ (Delay)</label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-primary-hover">Gửi sau</span>
              <input 
                type="number"
                min="0"
                value={delayValue}
                onChange={(e) => setDelayValue(Number(e.target.value))}
                className="w-20 px-3 py-2.5 rounded-xl border border-primary/20 outline-none focus:border-primary text-sm font-bold text-center bg-white"
              />
              <select
                value={delayUnit}
                onChange={(e) => setDelayUnit(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-primary/20 outline-none focus:border-primary text-sm font-bold bg-white"
              >
                <option value="minutes">Phút</option>
                <option value="hours">Giờ</option>
                <option value="days">Ngày</option>
              </select>
              <span className="text-sm font-semibold text-primary-hover">kể từ sự kiện kích hoạt ({CAMPAIGN_TYPES.find(t => t.value === type)?.label})</span>
            </div>
          </div>
        </div>

        {/* Phần 3: Nội dung tin nhắn */}
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col gap-4">
          <h3 className="font-black text-emerald-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[11px]">3</span>
            Nội dung tin nhắn (THEN)
          </h3>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-emerald-700/70 uppercase tracking-wider">Chèn biến nhanh:</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => insertVariable("{{Name}}")} className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors">{"{{Name}}"} (Tên khách)</button>
                <button type="button" onClick={() => insertVariable("{{PetName}}")} className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors">{"{{PetName}}"} (Tên pet)</button>
                <button type="button" onClick={() => insertVariable("{{ServiceName}}")} className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors">{"{{ServiceName}}"} (Dịch vụ)</button>
              </div>
            </div>
            
            <textarea
              ref={textareaRef}
              value={templateContent}
              onChange={e => setTemplateContent(e.target.value)}
              rows={5}
              placeholder={`Chào {{Name}},\nThú cưng {{PetName}} của bạn đã đến lịch tiêm vaccine định kỳ. Gần đây bé đã sử dụng dịch vụ {{ServiceName}} tại cửa hàng...`}
              className="w-full px-4 py-3 rounded-xl border border-emerald-200 outline-none focus:border-emerald-600 transition-colors text-sm font-medium resize-none leading-relaxed bg-white"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={!canSave || saving}
            onClick={handleSave}
            className={`flex-[2] py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-black text-sm text-white`}
            style={{
              background: canSave ? "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black))" : "#cbd5e1",
              boxShadow: canSave ? "0 10px 20px -5px color-mix(in srgb, var(--primary-theme-color, #2563EB) 40%, transparent)" : "none"
            }}
          >
            {saving ? (
               <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> {campaign ? "Đang lưu..." : "Đang tạo..."}</>
            ) : (
               <><Send className="w-4 h-4" /> {campaign ? "Cập nhật chiến dịch" : "Khởi động chiến dịch tự động"}</>
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </ClinicModal>
  );
}
