import React, { useState } from "react";
import { CheckCircle2, Edit3, ShieldAlert, X } from "lucide-react";
import { ClinicModal } from "@/components/clinic/ClinicModal";
import { PetDto } from "@/types/pet";

interface EditPatientModalProps {
  patient: PetDto;
  onClose: () => void;
  onUpdate: (id: string, form: any) => void;
}

export function EditPatientModal({ patient, onClose, onUpdate }: EditPatientModalProps) {
  const [form, setForm] = useState({
    petName: patient.name || "",
    species: patient.species === "Dog" ? "Chó" : 
             patient.species === "Cat" ? "Mèo" : 
             patient.species === "Bird" ? "Chim" : 
             patient.species === "Rabbit" ? "Thỏ" : patient.species || "Chó",
    breed: patient.breed || "",
    gender: patient.gender === "Male" ? "Đực" : "Cái",
    weight: patient.currentWeight ? patient.currentWeight.toString() : "8.5",
    bodyConditionScore: patient.bodyConditionScore ? patient.bodyConditionScore.toString() : "4",
    notes: patient.notes || "",
    conditionsText: patient.conditions ? patient.conditions.join(", ") : ""
  });

  const canSave = form.petName && form.breed && form.weight;

  const handleSubmit = () => {
    // Parse comma-separated conditions back to array
    const conditions = form.conditionsText
      ? form.conditionsText.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    onUpdate(patient.id, {
      ...form,
      conditions
    });
    onClose();
  };

  const ModalFooter = (
    <div className="flex w-full gap-2.5">
      <button
        onClick={onClose}
        className="px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-bold text-sm"
      >
        Hủy bỏ
      </button>
      <button
        disabled={!canSave}
        onClick={handleSubmit}
        className="flex-1 py-3.5 rounded-xl transition-all font-black text-sm flex items-center justify-center gap-2"
        style={{
          background: canSave
            ? "linear-gradient(135deg,#2563EB,#1d4ed8)"
            : "#e5e7eb",
          color: canSave ? "white" : "#9ca3af",
          boxShadow: canSave ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
        }}
      >
        <CheckCircle2 className="w-4.5 h-4.5" />
        Lưu thay đổi
      </button>
    </div>
  );

  return (
    <ClinicModal
      title={`Chỉnh sửa hồ sơ: ${patient.name}`}
      onClose={onClose}
      footer={ModalFooter}
      maxWidth="max-w-md"
    >
      <div className="px-6 py-5 flex flex-col gap-4">
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
            TÊN THÚ CƯNG *
          </label>
          <input
            value={form.petName}
            onChange={(e) => setForm((p) => ({ ...p, petName: e.target.value }))}
            placeholder="vd. Milu, Bella..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              LOÀI
            </label>
            <select
              value={form.species}
              onChange={(e) => setForm((p) => ({ ...p, species: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white"
            >
              {["Chó", "Mèo", "Chim", "Thỏ", "Khác"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              GIỚI TÍNH
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white"
            >
              {["Cái", "Đực"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              GIỐNG *
            </label>
            <input
              value={form.breed}
              onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))}
              placeholder="vd. Poodle, Corgi..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              CÂN NẶNG (KG) *
            </label>
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
              placeholder="vd. 8.5"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              THỂ TRẠNG (BCS: 1 - 5)
            </label>
            <select
              value={form.bodyConditionScore}
              onChange={(e) => setForm((p) => ({ ...p, bodyConditionScore: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all bg-white"
            >
              {["1", "2", "3", "4", "5"].map((score) => (
                <option key={score} value={score}>
                  {score === "1" ? "1 - Quá gầy" : 
                   score === "2" ? "2 - Dưới cân nhẹ" : 
                   score === "3" ? "3 - Lý tưởng" : 
                   score === "4" ? "4 - Thừa cân nhẹ" : "5 - Béo phì"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              CÁC BỆNH LÝ / DỊ ỨNG (CÁCH NHAU BẰNG DẤU PHẨY)
            </label>
            <input
              value={form.conditionsText}
              onChange={(e) => setForm((p) => ({ ...p, conditionsText: e.target.value }))}
              placeholder="vd. Dị ứng hải sản, Viêm tai giữa..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Nhập các bệnh lý ngăn cách bởi dấu phẩy để hệ thống tự động bóc tách thành các cảnh báo y tế nổi bật.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">
              GHI CHÚ HỒ SƠ Y TẾ
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Nhập các triệu chứng, lịch trình tiêm chủng..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </ClinicModal>
  );
}
