import { useState } from "react";
import { Plus, CheckCircle2, Syringe } from "lucide-react";
import { ClinicSectionCard } from "@/components/clinic/ClinicSectionCard";
import { medicalService } from "@/api/services";

export function VaccinesSection({ petId }: { petId: string }) {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [administeredDate, setAdministeredDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Current" | "DueSoon" | "Overdue">("Current");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!name) return alert("Vui lòng nhập tên Vaccine");
    setLoading(true);
    try {
      await medicalService.createVaccine({
        petId,
        name,
        manufacturer,
        lotNumber,
        administeredDate: new Date(administeredDate).toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        status,
        notes,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setName("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Vaccine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicSectionCard icon={Syringe} title="Quản lý Tiêm phòng" iconColor="#10b981">
      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tên Vaccine *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="DHPP Combo, Rabies..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Hãng sản xuất</label>
          <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="Zoetis, Boehringer..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Số lô (Lot Number)</label>
          <input value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder="Lô vaccine..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>

        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ngày tiêm</label>
          <input type="date" value={administeredDate} onChange={(e) => setAdministeredDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ngày hẹn nhắc lại</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Trạng thái (Hệ thống)</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300">
            <option value="Current">Đang hiệu lực (Current)</option>
            <option value="DueSoon">Sắp đến hạn (DueSoon)</option>
            <option value="Overdue">Quá hạn (Overdue)</option>
          </select>
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ghi chú</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ghi chú thêm..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-emerald-300" />
        </div>
      </div>
      <div className="px-8 pb-6 border-t border-gray-100 pt-6 bg-gray-50/30 flex justify-end">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-colors">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saved ? "Đã Lưu Tiêm Phòng" : "Thêm Tiêm Phòng"}
        </button>
      </div>
    </ClinicSectionCard>
  );
}
