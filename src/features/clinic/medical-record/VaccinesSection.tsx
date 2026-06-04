import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Syringe, Loader2, Clock } from "lucide-react";
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

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!petId) return;
    try {
      setIsLoadingHistory(true);
      const res = await medicalService.getVaccines(petId);
      const data = (res as any)?.data || (Array.isArray(res) ? res : []);
      setHistoryList(data);
    } catch (err) {
      console.error("Failed to load vaccines", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [petId]);

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
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Vaccine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicSectionCard icon={Syringe} title="Quản lý Tiêm phòng" iconColor="#10b981">
      
      {/* Lịch sử tiêm phòng */}
      <div className="px-4 py-5 sm:px-8 sm:pt-8 sm:pb-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Lịch sử Tiêm phòng</h4>
        {isLoadingHistory ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        ) : historyList.length > 0 ? (
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full block">
              <table className="w-full text-left text-sm min-w-[550px]">
                <thead className="bg-gray-50/50 text-gray-400 font-black text-[0.7rem] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Tên Vaccine</th>
                    <th className="px-6 py-4">Ngày tiêm</th>
                    <th className="px-6 py-4">Hẹn nhắc lại</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyList.map((item, i) => (
                    <tr key={item.id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[0.7rem] font-medium text-gray-400">{item.manufacturer || '---'} {item.lotNumber ? `(Lô: ${item.lotNumber})` : ''}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.administeredDate ? new Date(item.administeredDate).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-500">
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-wider ${
                          item.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                          item.status === 'DueSoon' ? 'bg-orange-100 text-orange-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.status === 'Overdue' && <Clock className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-sm font-bold text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
            Chưa có lịch sử tiêm phòng
          </div>
        )}
      </div>

      <div className="px-4 sm:px-8 pb-4"><hr className="border-gray-100" /></div>

      <div className="px-4 py-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div className="px-4 py-4 sm:px-8 sm:pb-6 border-t border-gray-100 pt-6 bg-gray-50/30 flex justify-end">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-colors">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saved ? "Đã Lưu Tiêm Phòng" : "Thêm Tiêm Phòng"}
        </button>
      </div>
    </ClinicSectionCard>
  );
}
