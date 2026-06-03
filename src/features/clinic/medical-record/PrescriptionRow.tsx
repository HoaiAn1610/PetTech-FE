import { useState } from "react";
import { ChevronDown, Trash2, Pill, Zap } from "lucide-react";
import { ClinicToggle } from "@/components/clinic/ClinicToggle";

export interface PrescriptionLine {
  id: string;
  productId: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  notes: string;
  autoDeduct: boolean;
}

interface PrescriptionRowProps {
  line: PrescriptionLine;
  index: number;
  onChange: (updated: PrescriptionLine) => void;
  onRemove: () => void;
  isOnly: boolean;
  medicines: any[];
  routeOpts: string[];
  frequencyOpts: string[];
  durationOpts: string[];
}

export function PrescriptionRow({
  line,
  index,
  onChange,
  onRemove,
  isOnly,
  medicines,
  routeOpts,
  frequencyOpts,
  durationOpts,
}: PrescriptionRowProps) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Lọc thông minh theo từ khóa danh mục
  const filteredMedicines = showAll ? medicines : medicines.filter((p: any) => {
    const category = p.categoryName || p.category;
    if (!category) return true; // fallback
    const catLower = category.toLowerCase();
    
    // Các danh mục được xác định là Y Tế / Thuốc
    const isMedical = catLower.includes("medicine") || 
                      catLower.includes("thuốc") || 
                      catLower.includes("thuoc") ||
                      catLower.includes("vaccine") ||
                      catLower.includes("vắc") ||
                      catLower.includes("vac") ||
                      catLower.includes("suppl") ||
                      catLower.includes("bổ sung") ||
                      catLower.includes("dược") ||
                      catLower.includes("duoc") ||
                      catLower.includes("consumable") ||
                      catLower.includes("tiêu hao");

    // Các danh mục bán lẻ phi y tế chắc chắn muốn loại trừ
    const isRetail = catLower.includes("food") || 
                     catLower.includes("thức ăn") || 
                     catLower.includes("thuc an") ||
                     catLower.includes("cát") || 
                     catLower.includes("cat") || 
                     catLower.includes("phụ kiện") || 
                     catLower.includes("phu kien") ||
                     catLower.includes("toy") || 
                     catLower.includes("đồ chơi") || 
                     catLower.includes("do choi");

    return isMedical && !isRetail;
  });

  // Luôn giữ lại sản phẩm đang được chọn để tránh lỗi trắng ô khi tắt "Hiển thị tất cả"
  const selectedProduct = medicines.find(m => m.id === line.productId);
  const finalMedicinesList = [...filteredMedicines];
  if (selectedProduct && !finalMedicinesList.some(m => m.id === line.productId)) {
    finalMedicinesList.push(selectedProduct);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: line.autoDeduct
          ? "1.5px solid rgba(37,99,235,0.25)"
          : "1.5px solid rgba(0,0,0,0.08)",
        background: line.autoDeduct
          ? "linear-gradient(135deg, rgba(37,99,235,0.03), rgba(37,99,235,0.01))"
          : "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        style={{ borderBottom: open ? "1px solid rgba(0,0,0,0.06)" : "none" }}
        onClick={() => setOpen(!open)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
        >
          <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "white" }}>
            Rx{index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {line.medicine ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
                {line.medicine}
              </span>
              {line.dosage && (
                <span
                  className="px-2 py-0.5 rounded-lg"
                  style={{
                    background: "rgba(37,99,235,0.08)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#2563EB",
                  }}
                >
                  {line.dosage}
                </span>
              )}
              {line.frequency && (
                <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                  {line.frequency}
                </span>
              )}
            </div>
          ) : (
            <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
              Chọn thuốc…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {line.autoDeduct && (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{
                background: "rgba(37,99,235,0.08)",
                fontSize: "0.62rem",
                fontWeight: 800,
                color: "#2563EB",
              }}
            >
              <Zap className="w-2.5 h-2.5" style={{ fill: "#2563EB" }} /> Tự động trừ
              kho
            </span>
          )}
          {!isOnly && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
            </button>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: "#9ca3af",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="px-5 pt-4 pb-4 flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.04em",
                  }}
                >
                  THUỐC *
                </label>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                    className="w-3 h-3 rounded text-blue-600 focus:ring-0"
                  />
                  <span className="text-[10px] text-gray-400 font-bold hover:text-blue-600 transition-colors">Hiển thị tất cả</span>
                </label>
              </div>
              <div className="relative">
                <select
                  value={line.productId}
                  onChange={(e) => {
                    const product = finalMedicinesList.find(m => m.id === e.target.value);
                    onChange({ ...line, productId: e.target.value, medicine: product ? product.name : "" });
                  }}
                  className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl outline-none cursor-pointer"
                  style={{
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    fontSize: "0.83rem",
                    fontWeight: line.medicine ? 600 : 400,
                    color: line.medicine ? "#111827" : "#9ca3af",
                    background: "#fafafa",
                  }}
                >
                  <option value="">Chọn thuốc…</option>
                  {finalMedicinesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <Pill
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#9ca3af" }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                ĐƯỜNG DÙNG
              </label>
              <select
                value={line.route}
                onChange={(e) => onChange({ ...line, route: e.target.value })}
                className="w-full appearance-none px-3 py-2.5 rounded-xl outline-none cursor-pointer"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.8rem",
                  color: "#374151",
                  background: "#fafafa",
                }}
              >
                {routeOpts.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                LIỀU LƯỢNG *
              </label>
              <input
                value={line.dosage}
                onChange={(e) => onChange({ ...line, dosage: e.target.value })}
                placeholder="vd. 1 viên"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.83rem",
                  color: "#374151",
                  background: "#fafafa",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                TẦN SUẤT
              </label>
              <select
                value={line.frequency}
                onChange={(e) => onChange({ ...line, frequency: e.target.value })}
                className="w-full appearance-none px-3 py-2.5 rounded-xl outline-none cursor-pointer"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.8rem",
                  color: "#374151",
                  background: "#fafafa",
                }}
              >
                {frequencyOpts.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                THỜI GIAN</label>
              <select
                value={line.duration}
                onChange={(e) => onChange({ ...line, duration: e.target.value })}
                className="w-full appearance-none px-3 py-2.5 rounded-xl outline-none cursor-pointer"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.8rem",
                  color: "#374151",
                  background: "#fafafa",
                }}
              >
                {durationOpts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                CHỈ DẪN ĐẶC BIỆT
              </label>
              <input
                value={line.notes}
                onChange={(e) => onChange({ ...line, notes: e.target.value })}
                placeholder="vd. Uống cùng thức ăn…"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "0.8rem",
                  color: "#374151",
                  background: "#fafafa",
                }}
              />
            </div>
          </div>
          <div
            className="px-4 py-3 rounded-xl transition-all duration-300"
            style={{
              background: line.autoDeduct ? "rgba(37,99,235,0.05)" : "rgba(0,0,0,0.03)",
              border: line.autoDeduct
                ? "1.5px solid rgba(37,99,235,0.18)"
                : "1.5px solid rgba(0,0,0,0.07)",
            }}
          >
            <ClinicToggle
              checked={line.autoDeduct}
              onChange={(v) => onChange({ ...line, autoDeduct: v })}
              label="Tự động trừ kho"
              sublabel={
                line.autoDeduct
                  ? "Tồn kho sẽ tự động giảm khi lưu đơn thuốc này"
                  : "Bật để đồng bộ trực tiếp với hệ thống kho"
              }
              accent="#2563EB"
            />
            {line.autoDeduct && line.medicine && (
              <div
                className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(37,99,235,0.07)",
                  border: "1px solid rgba(37,99,235,0.12)",
                }}
              >
                <Zap
                  className="w-3.5 h-3.5"
                  style={{ color: "#2563EB", fill: "#2563EB" }}
                />
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#1d4ed8" }}>
                  Sẽ trừ kho: <strong>{line.medicine}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
