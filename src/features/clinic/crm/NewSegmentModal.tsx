import { useState } from "react";
import { X, CheckCircle2, Users } from "lucide-react";
import { SegmentRuleBuilder, RuleGroup } from "./SegmentRuleBuilder";

interface NewSegmentModalProps {
  onClose: () => void;
  onSave: (segment: any) => Promise<void>;
  segment?: any;
}

export function NewSegmentModal({ onClose, onSave, segment }: NewSegmentModalProps) {
  const [name, setName] = useState(segment?.name || "");
  const [description, setDescription] = useState(segment?.description || "");
  const [filterRules, setFilterRules] = useState<RuleGroup>(segment?.filterRules || {
    logic: "AND",
    conditions: []
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name,
        description,
        filterRules,
        isAuto: filterRules.conditions.length > 0, // Make it auto if there are rules
      });
      onClose();
    } catch (error) {
      console.error("Failed to save segment", error);
      alert("Không thể lưu phân khúc. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden bg-white flex flex-col"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 10%, transparent)" }}>
              <Users className="w-5 h-5" style={{ color: "var(--primary-theme-color, #2563EB)" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>{segment ? "Chỉnh sửa phân khúc" : "Tạo phân khúc mới"}</h2>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px" }}>Phân nhóm khách hàng mục tiêu</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
 
        {/* Form Content */}
        <div className="px-6 py-6 flex flex-col gap-5 overflow-y-auto flex-1">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Tên phân khúc <span className="text-red-500">*</span></label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Khách hàng mới tháng 3"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", color: "#111827", fontSize: "0.85rem" }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary-theme-color, #2563EB)"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Mô tả thêm</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú về phân khúc này..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
              style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", color: "#111827", fontSize: "0.85rem" }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary-theme-color, #2563EB)"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-gray-700">Điều kiện lọc tự động</label>
            <SegmentRuleBuilder value={filterRules} onChange={setFilterRules} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition-colors">
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={!name.trim() || saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${!name.trim() || saving ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-px active:scale-95"}`}
            style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB) 0%, color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black) 100%)", color: "white", boxShadow: "0 4px 12px color-mix(in srgb, var(--primary-theme-color, #2563EB) 20%, transparent)" }}
          >
            {saving ? (
              <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Đang lưu...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> {segment ? "Cập nhật phân khúc" : "Lưu phân khúc"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
