import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Pill, Loader2, PauseCircle } from "lucide-react";
import { ClinicSectionCard } from "@/components/clinic/ClinicSectionCard";
import { medicalService } from "@/api/services";

export function MedicationsSection({ petId }: { petId: string }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [purpose, setPurpose] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [refillsRemaining, setRefillsRemaining] = useState<number>(0);
  const [status, setStatus] = useState<"Active" | "Paused" | "Completed">("Active");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!petId) return;
    try {
      setIsLoadingHistory(true);
      const res = await medicalService.getMedications(petId);
      const data = (res as any)?.data || (Array.isArray(res) ? res : []);
      setHistoryList(data);
    } catch (err) {
      console.error("Failed to load medications", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [petId]);

  const handleSave = async () => {
    if (!name) return alert("Vui lòng nhập tên Thuốc");
    setLoading(true);
    try {
      await medicalService.createMedication({
        petId,
        name,
        type,
        dosage,
        frequency,
        purpose,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        refillsRemaining,
        status,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setName("");
      setDosage("");
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Thuốc định kỳ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicSectionCard icon={Pill} title="Thuốc đang sử dụng (Định kỳ)" iconColor="#ec4899">
      
      {/* Lịch sử thuốc */}
      <div className="px-4 py-5 sm:px-8 sm:pt-8 sm:pb-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Lịch sử Thuốc định kỳ</h4>
        {isLoadingHistory ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
          </div>
        ) : historyList.length > 0 ? (
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full block">
              <table className="w-full text-left text-sm min-w-[650px]">
                <thead className="bg-gray-50/50 text-gray-400 font-black text-[0.7rem] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Tên Thuốc</th>
                    <th className="px-6 py-4">Cách dùng</th>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyList.map((item, i) => (
                    <tr key={item.id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[0.7rem] font-medium text-gray-400">{item.type || '---'} {item.purpose ? `(${item.purpose})` : ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{item.dosage}</p>
                        <p className="text-[0.7rem] font-medium text-gray-500">{item.frequency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          Từ {item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : '---'}
                        </p>
                        <p className="text-[0.7rem] font-medium text-gray-500">
                          Đến {item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-wider ${
                          item.status === 'Paused' ? 'bg-orange-100 text-orange-700' :
                          item.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {item.status === 'Paused' && <PauseCircle className="w-3 h-3" />}
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
            Chưa có lịch sử thuốc định kỳ
          </div>
        )}
      </div>

      <div className="px-4 sm:px-8 pb-4"><hr className="border-gray-100" /></div>

      <div className="px-4 py-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tên Thuốc *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên thuốc dài hạn..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Loại thuốc</label>
          <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Kháng sinh, Tim mạch..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Mục đích dùng</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Kiểm soát huyết áp..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>

        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Liều lượng</label>
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="1 viên..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tần suất</label>
          <input value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="2 lần/ngày..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Số lần lấy thêm (Refills)</label>
          <input type="number" min={0} value={refillsRemaining} onChange={(e) => setRefillsRemaining(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Trạng thái</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300">
            <option value="Active">Đang sử dụng (Active)</option>
            <option value="Paused">Tạm ngưng (Paused)</option>
            <option value="Completed">Đã xong (Completed)</option>
          </select>
        </div>

        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ngày bắt đầu</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ngày kết thúc</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-pink-300" />
        </div>
      </div>
      <div className="px-4 py-4 sm:px-8 sm:pb-6 border-t border-gray-100 pt-6 bg-gray-50/30 flex justify-end">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 text-white font-black text-sm hover:bg-pink-700 transition-colors">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saved ? "Đã Lưu Thuốc" : "Thêm Thuốc Định Kỳ"}
        </button>
      </div>
    </ClinicSectionCard>
  );
}
