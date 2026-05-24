import { useState, useEffect } from "react";
import { Plus, CheckCircle2, FlaskConical, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { ClinicSectionCard } from "@/components/clinic/ClinicSectionCard";
import { medicalService } from "@/api/services";

export function LabResultsSection({ petId }: { petId: string }) {
  const [panel, setPanel] = useState("Sinh hóa máu");
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [status, setStatus] = useState<"Normal" | "High" | "Low" | "Critical">("Normal");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!petId) return;
    try {
      setIsLoadingHistory(true);
      const res = await medicalService.getLabResults(petId);
      const data = (res as any)?.data || (Array.isArray(res) ? res : []);
      setHistoryList(data);
    } catch (err) {
      console.error("Failed to load lab results", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [petId]);

  const handleSave = async () => {
    if (!testName) return alert("Vui lòng nhập tên chỉ số");
    setLoading(true);
    try {
      await medicalService.createLabResult({
        petId,
        panel,
        testName,
        testDate: new Date(testDate).toISOString(),
        value,
        unit,
        referenceRange,
        status,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTestName("");
      setValue("");
      fetchHistory(); // Refresh history after save
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu xét nghiệm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicSectionCard icon={FlaskConical} title="Kết quả Xét nghiệm" iconColor="#8b5cf6">
      
      {/* Lịch sử */}
      <div className="px-8 pt-8 pb-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Lịch sử xét nghiệm</h4>
        {isLoadingHistory ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : historyList.length > 0 ? (
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-400 font-black text-[0.7rem] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Ngày XN</th>
                  <th className="px-6 py-4">Loại / Chỉ số</th>
                  <th className="px-6 py-4">Kết quả</th>
                  <th className="px-6 py-4">Tham chiếu</th>
                  <th className="px-6 py-4">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyList.map((item, i) => {
                  const isAbnormal = item.status === 'High' || item.status === 'Low' || item.status === 'Critical';
                  return (
                    <tr key={item.id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.testDate ? new Date(item.testDate).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{item.testName}</p>
                        <p className="text-[0.7rem] font-medium text-gray-400">{item.panel}</p>
                      </td>
                      <td className={`px-6 py-4 font-black ${isAbnormal ? 'text-red-500' : 'text-gray-900'}`}>
                        {item.value} {item.unit}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-500">{item.referenceRange || '---'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-wider ${
                          item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                          item.status === 'High' ? 'bg-orange-100 text-orange-700' :
                          item.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {isAbnormal && <AlertTriangle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm font-bold text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
            Chưa có lịch sử xét nghiệm
          </div>
        )}
      </div>

      <div className="px-8 pb-4"><hr className="border-gray-100" /></div>

      <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Loại xét nghiệm</label>
          <select value={panel} onChange={(e) => setPanel(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300">
            {["Sinh hóa máu", "Huyết đồ (CBC)", "Siêu âm", "X-Quang", "Nước tiểu", "PCR"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tên chỉ số *</label>
          <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="WBC, RBC, Glucose..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Ngày XN</label>
          <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300" />
        </div>
        
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Kết quả</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="15.2" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Đơn vị</label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="g/dL, mg/L..." className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tham chiếu</label>
          <input value={referenceRange} onChange={(e) => setReferenceRange(e.target.value)} placeholder="12.0 - 18.0" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300" />
        </div>
        <div>
          <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Đánh giá</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-violet-300">
            <option value="Normal">Bình thường (Normal)</option>
            <option value="High">Cao (High)</option>
            <option value="Low">Thấp (Low)</option>
            <option value="Critical">Nguy kịch (Critical)</option>
          </select>
        </div>
      </div>
      <div className="px-8 pb-6 border-t border-gray-100 pt-6 bg-gray-50/30 flex justify-end">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-black text-sm hover:bg-violet-700 transition-colors">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saved ? "Đã Lưu Xét Nghiệm" : "Thêm Kết Quả Xét Nghiệm"}
        </button>
      </div>
    </ClinicSectionCard>
  );
}
