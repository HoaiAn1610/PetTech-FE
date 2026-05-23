import { useState } from "react";
import { Plus, CheckCircle2, FlaskConical, Trash2 } from "lucide-react";
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
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu xét nghiệm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicSectionCard icon={FlaskConical} title="Kết quả Xét nghiệm" iconColor="#8b5cf6">
      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
