import React from "react";
import { Plus, Trash2 } from "lucide-react";

export type RuleLogic = "AND" | "OR";

export interface RuleCondition {
  field: string;
  operator: string;
  value: string | number;
}

export interface RuleGroup {
  logic: RuleLogic;
  conditions: RuleCondition[];
}

interface SegmentRuleBuilderProps {
  value: RuleGroup;
  onChange: (newValue: RuleGroup) => void;
}

const FIELD_OPTIONS = [
  { id: "total_spent", label: "Tổng chi tiêu ($)", type: "number" },
  { id: "last_visit_days", label: "Số ngày chưa quay lại", type: "number" },
  { id: "recent_visit_days", label: "Mới khám xong (X ngày qua)", type: "number" },
  { id: "vaccine_status", label: "Trạng thái Vaccine", type: "select", options: [
    { value: "Overdue", label: "Quá hạn (Overdue)" },
    { value: "DueSoon", label: "Sắp đến hạn (Due Soon)" },
    { value: "Current", label: "Đã tiêm (Current)" }
  ]},
  { id: "birthday_month", label: "Tháng sinh nhật", type: "select", options: [
    { value: "1", label: "Tháng 1" }, { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" }, { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" }, { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" }, { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" }, { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" }, { value: "12", label: "Tháng 12" }
  ]},
  { id: "cart_status", label: "Trạng thái giỏ hàng", type: "select", options: [
    { value: "Abandoned", label: "Bỏ quên (Abandoned)" },
    { value: "Active", label: "Đang mua (Active)" },
    { value: "Completed", label: "Đã thanh toán (Completed)" }
  ]},
  { id: "service_type", label: "Loại dịch vụ đã dùng", type: "select", options: [
    { value: "Consultation", label: "Khám bệnh (Consultation)" },
    { value: "Spa", label: "Spa & Grooming" },
    { value: "Hotel", label: "Khách sạn (Pet Hotel)" }
  ]},
  { id: "pet_species", label: "Loài thú cưng", type: "select", options: [
    { value: "Dog", label: "Chó (Dog)" },
    { value: "Cat", label: "Mèo (Cat)" },
    { value: "Other", label: "Khác (Other)" }
  ]}
];

const OPERATOR_OPTIONS: Record<string, { value: string, label: string }[]> = {
  number: [
    { value: ">", label: "Lớn hơn (>)" },
    { value: "<", label: "Nhỏ hơn (<)" },
    { value: "=", label: "Bằng (=)" }
  ],
  select: [
    { value: "=", label: "Là (Bằng)" },
    { value: "!=", label: "Không là (Khác)" }
  ]
};

export function SegmentRuleBuilder({ value, onChange }: SegmentRuleBuilderProps) {

  const handleLogicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, logic: e.target.value as RuleLogic });
  };

  const handleAddCondition = () => {
    const newCondition: RuleCondition = {
      field: "total_spent",
      operator: ">",
      value: ""
    };
    onChange({ ...value, conditions: [...value.conditions, newCondition] });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = value.conditions.filter((_, i) => i !== index);
    onChange({ ...value, conditions: newConditions });
  };

  const handleConditionChange = (index: number, key: keyof RuleCondition, val: string) => {
    const newConditions = [...value.conditions];
    const condition = { ...newConditions[index], [key]: val };

    // Reset operator and value if field changes
    if (key === "field") {
      const fieldDef = FIELD_OPTIONS.find(f => f.id === val);
      if (fieldDef) {
        condition.operator = OPERATOR_OPTIONS[fieldDef.type][0].value;
        condition.value = fieldDef.type === "select" ? fieldDef.options![0].value : "";
      }
    }

    newConditions[index] = condition;
    onChange({ ...value, conditions: newConditions });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-sans flex flex-col gap-4">
      {/* Logic Toggle */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold text-gray-700">Điều kiện tổng:</label>
        <select 
          value={value.logic}
          onChange={handleLogicChange}
          className="px-3 py-1.5 rounded-lg border-gray-200 outline-none text-sm font-semibold bg-white cursor-pointer"
          style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
        >
          <option value="AND">Thỏa mãn TẤT CẢ (AND)</option>
          <option value="OR">Thỏa mãn MỘT TRONG CÁC (OR)</option>
        </select>
      </div>

      {/* Conditions List */}
      <div className="flex flex-col gap-3">
        {value.conditions.map((cond, index) => {
          const fieldDef = FIELD_OPTIONS.find(f => f.id === cond.field) || FIELD_OPTIONS[0];
          const operators = OPERATOR_OPTIONS[fieldDef.type] || OPERATOR_OPTIONS["number"];

          return (
            <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Field */}
              <select
                value={cond.field}
                onChange={(e) => handleConditionChange(index, "field", e.target.value)}
                className="flex-1 min-w-[140px] px-3 py-2 rounded-lg outline-none text-sm bg-white"
                style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
              >
                {FIELD_OPTIONS.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>

              {/* Operator */}
              <select
                value={cond.operator}
                onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
                className="w-32 px-3 py-2 rounded-lg outline-none text-sm bg-white"
                style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
              >
                {operators.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>

              {/* Value Input */}
              {fieldDef.type === "select" ? (
                <select
                  value={cond.value}
                  onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                  className="flex-1 min-w-[120px] px-3 py-2 rounded-lg outline-none text-sm bg-white"
                  style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
                >
                  {fieldDef.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={cond.value}
                  onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                  placeholder="Nhập giá trị..."
                  className="flex-1 min-w-[120px] px-3 py-2 rounded-lg outline-none text-sm bg-white"
                  style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
                />
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveCondition(index)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Xóa điều kiện này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button 
        onClick={handleAddCondition}
        className="flex items-center justify-center gap-2 py-2.5 mt-1 border border-dashed rounded-xl text-sm font-bold text-gray-500 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-colors"
        style={{ borderColor: "#d1d5db" }}
      >
        <Plus className="w-4 h-4" />
        Thêm điều kiện
      </button>
    </div>
  );
}
