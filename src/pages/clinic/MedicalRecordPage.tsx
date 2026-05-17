import { useState } from "react";
import {
  AlertTriangle, ChevronDown, Plus, Camera, Upload, CheckCircle2, Clock, Calendar, Activity, Thermometer, Heart, FileText, Save, Printer, Stethoscope, Pill, User, Droplets, Zap, ArrowUpRight, ClipboardList, RotateCcw, Star,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicSectionCard } from "@/components/clinic/ClinicSectionCard";
import { PatientHeader } from "@/features/clinic/medical-record/PatientHeader";
import { AllergyAlerts } from "@/features/clinic/medical-record/AllergyAlerts";
import { PhotoSlot } from "@/features/clinic/medical-record/PhotoSlot";
import { PrescriptionRow, PrescriptionLine } from "@/features/clinic/medical-record/PrescriptionRow";
import "@/styles/fonts.css";

// ─── Static data ──────────────────────────────────────────────────────────────
const MEDICINES = [
  { group: "Kháng sinh",         items: ["Amoxicillin 250mg", "Amoxicillin 500mg", "Metronidazole 250mg", "Metronidazole 500mg", "Enrofloxacin 50mg", "Doxycycline 100mg"] },
  { group: "Kháng viêm",         items: ["Prednisolone 5mg", "Meloxicam 1mg/mL", "Carprofen 25mg", "Dexamethasone 4mg/mL"] },
  { group: "Chống ký sinh trùng", items: ["Ivermectin 1% Inj.", "Fenbendazole 222mg", "Praziquantel 50mg"] },
  { group: "Vaccine",             items: ["Vaccine Dại 1mL", "DHPP Combo", "Vaccine Bordetella", "Vaccine Leptospirosis"] },
  { group: "Bổ sung",             items: ["Omega-3 500mg", "Men vi sinh nhai", "Vitamin B Tổng hợp"] },
  { group: "Bôi ngoài",           items: ["Chlorhexidine Spray", "Betadine Solution", "Nhỏ mắt Gentamicin"] },
];

const FREQUENCY_OPTS = ["1 lần/ngày (SID)", "2 lần/ngày (BID)", "3 lần/ngày (TID)", "Mỗi 8 giờ (TID)", "Mỗi 12 giờ (BID)", "Khi cần (PRN)", "Hàng tuần", "Hàng tháng"];
const DURATION_OPTS  = ["3 ngày", "5 ngày", "7 ngày", "10 ngày", "14 ngày", "21 ngày", "30 ngày", "Liên tục"];
const ROUTE_OPTS     = ["Uống (PO)", "Tiêm bắp (IM)", "Tiêm dưới da (SC)", "Tiêm tĩnh mạch (IV)", "Bôi ngoài", "Nhỏ mắt", "Nhỏ tai"];

const DIAGNOSIS_OPTS = [
  "Viêm dạ dày ruột cấp", "Viêm da / Dị ứng da", "Viêm tai ngoài", "Nhiễm trùng đường hô hấp trên",
  "Nhiễm trùng đường tiết niệu", "Bệnh răng miệng (Độ II)", "Khám sức khoẻ định kỳ", "Tái khám sau phẫu thuật",
  "Nhiễm ký sinh trùng", "Chấn thương cơ xương", "Viêm kết mạc", "Khác (xem ghi chú)",
];

const VITAL_HISTORY = [
  { date: "1/3/2026",   weight: "14.2 kg", temp: "38.5°C", hr: "88 bpm", status: "Khoẻ mạnh" },
  { date: "22/1/2026",  weight: "14.0 kg", temp: "39.1°C", hr: "96 bpm", status: "Sốt nhẹ"   },
  { date: "10/11/2025", weight: "13.8 kg", temp: "38.4°C", hr: "85 bpm", status: "Khoẻ mạnh" },
];

export default function MedicalRecordPage() {
  const makeBlank = (id: string): PrescriptionLine => ({
    id, medicine: "", dosage: "", frequency: FREQUENCY_OPTS[1],
    duration: DURATION_OPTS[2], route: ROUTE_OPTS[0], notes: "", autoDeduct: true,
  });

  const [rxLines, setRxLines]               = useState<PrescriptionLine[]>([makeBlank("rx1")]);
  const [diagnosis, setDiagnosis]           = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes]   = useState("");
  const [followupDate, setFollowupDate]     = useState("");
  const [followupNote, setFollowupNote]     = useState("");
  const [beforeImg, setBeforeImg]           = useState<string | null>("https://images.unsplash.com/photo-1596630966816-8e2de1dade53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800");
  const [afterImg, setAfterImg]             = useState<string | null>(null);
  const [saved, setSaved]                   = useState(false);
  const [activeVital, setActiveVital]       = useState(0);
  const [sigPad, setSigPad]                 = useState(false);

  const addRxLine  = () => setRxLines((p) => [...p, makeBlank(`rx${Date.now()}`)]);
  const updateLine = (id: string, u: PrescriptionLine) => setRxLines((p) => p.map((l) => (l.id === id ? u : l)));
  const removeLine = (id: string) => setRxLines((p) => p.filter((l) => l.id !== id));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const now     = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const autoDeductCount = rxLines.filter((l) => l.autoDeduct).length;

  const Footer = (
    <div
      className="flex-shrink-0 px-8 py-6"
      style={{ background: "rgba(244,246,251,0.97)", backdropFilter: "blur(20px)", borderTop: "1.5px solid rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-6 flex-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { label: "Chẩn đoán",    done: !!diagnosis },
            { label: "Đơn thuốc",   done: rxLines.some((l) => !!l.medicine) },
            { label: "Liều dùng",   done: rxLines.some((l) => !!l.dosage) },
            { label: "Ký xác nhận", done: sigPad },
            { label: "Tái khám",    done: !!followupDate },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 flex-shrink-0">
              {c.done
                ? <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
                : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
              }
              <span className={`text-[0.7rem] font-black uppercase tracking-wider ${c.done ? "text-green-600" : "text-gray-400"}`}>{c.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all">
            <RotateCcw className="w-4 h-4" /> Đặt lại
          </button>
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-[1.5rem] transition-all duration-300 active:scale-95 shadow-2xl"
            style={{
              background: saved ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #2563EB 0%, #1d4ed8 60%, #7c3aed 100%)",
              fontSize: "0.95rem", color: "white", fontWeight: 900,
              boxShadow: saved ? "0 10px 30px rgba(22,163,74,0.4)" : "0 10px 30px rgba(37,99,235,0.4)",
            }}

          >
            {saved ? (
              <><CheckCircle2 className="w-5 h-5" strokeWidth={3} /> ĐÃ LƯU HỒ SƠ</>
            ) : (
              <>
                <Save className="w-5 h-5" strokeWidth={3} />
                LƯU HỒ SƠ & LÊN LỊCH
                {followupDate && (
                  <span className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/20 text-[0.7rem] font-black ml-2 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(followupDate).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ClinicPageShell
      title="Hồ sơ y tế"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Hồ sơ y tế" }]}
      maxWidth="max-w-6xl"
      footer={Footer}
    >
      <div className="flex flex-col gap-10">
        {/* 1. Patient Header */}
        <PatientHeader dateStr={dateStr} timeStr={timeStr} />

        {/* 2. Allergy Alerts */}
        <AllergyAlerts />

        {/* 3. Diagnosis Section */}
        <ClinicSectionCard
          icon={ClipboardList}
          title="Chẩn đoán & Triệu chứng chính"
          badge={<span className="text-[0.65rem] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-widest">* Bắt buộc</span>}
        >
          <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Chẩn đoán chính *</label>
              <div className="relative group">
                <select 
                  value={diagnosis} 
                  onChange={(e) => setDiagnosis(e.target.value)} 
                  className="w-full appearance-none px-6 py-4 pr-12 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none cursor-pointer focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold text-gray-900"
                >
                  <option value="">Chọn chẩn đoán từ danh sách...</option>
                  {DIAGNOSIS_OPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Triệu chứng chính</label>
              <input 
                value={chiefComplaint} 
                onChange={(e) => setChiefComplaint(e.target.value)} 
                placeholder="Vd: Gãi liên tục, nôn mửa..." 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300" 
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Ghi chú lâm sàng</label>
              <input 
                value={clinicalNotes} 
                onChange={(e) => setClinicalNotes(e.target.value)} 
                placeholder="Quan sát thực thể, kết quả sờ nắn, chẩn đoán phân biệt..." 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300" 
              />
            </div>
          </div>
        </ClinicSectionCard>

        {/* 4. Prescription Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Đơn thuốc</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{rxLines.length} LOẠI THUỐC</p>
              </div>
            </div>
            <button 
              onClick={addRxLine} 
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white border-2 border-blue-100 text-blue-600 font-black text-sm hover:bg-blue-50 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-5 h-5" strokeWidth={3} /> Thêm thuốc
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {rxLines.map((line, i) => (
              <PrescriptionRow 
                key={line.id} 
                line={line} 
                index={i} 
                onChange={(u) => updateLine(line.id, u)} 
                onRemove={() => removeLine(line.id)} 
                isOnly={rxLines.length === 1} 
                medicines={MEDICINES} 
                routeOpts={ROUTE_OPTS} 
                frequencyOpts={FREQUENCY_OPTS} 
                durationOpts={DURATION_OPTS} 
              />
            ))}
          </div>

          {autoDeductCount > 0 && (
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-blue-600 shadow-xl shadow-blue-200 border border-blue-500 animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-wider">Tự động trừ kho thông minh</p>
                <p className="text-sm font-medium text-blue-50 mt-1">Đã bật trừ kho cho {autoDeductCount} loại thuốc. Tồn kho sẽ cập nhật ngay khi lưu hồ sơ.</p>
              </div>
            </div>
          )}
        </div>

        {/* 5. History & Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClinicSectionCard
            icon={ClipboardList}
            title="Lịch sử khám bệnh"
            action={<button className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Tất cả <ArrowUpRight className="w-4 h-4" /></button>}
          >
            <div className="px-8 py-6 flex flex-col gap-3">
              {VITAL_HISTORY.map((v, i) => (
                <button 
                  key={v.date} 
                  onClick={() => setActiveVital(i)} 
                  className={`flex items-center gap-5 p-5 rounded-2xl text-left w-full transition-all border-2 ${activeVital === i ? "bg-blue-50/50 border-blue-100 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${activeVital === i ? "bg-blue-500 shadow-lg shadow-blue-200" : "bg-gray-100"}`}>
                    <FileText className={`w-5 h-5 ${activeVital === i ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-gray-900 tracking-tight">{v.date}</span>
                      <span className={`px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-wider ${v.status === "Khoẻ mạnh" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{v.status}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight">{v.weight} · {v.temp} · {v.hr}</p>
                  </div>
                </button>
              ))}
            </div>
          </ClinicSectionCard>
          
          <ClinicSectionCard
            icon={Camera}
            title="Ảnh lâm sàng"
            action={<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-[0.7rem] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition-colors border border-gray-100"><Upload className="w-3.5 h-3.5" /> Tải lên</button>}
          >
            <div className="px-8 py-8 flex gap-6">
              <PhotoSlot label="TRƯỚC" color="#ea580c" previewUrl={beforeImg} onSet={(url) => setBeforeImg(url || null)} />
              <PhotoSlot label="SAU" color="#16a34a" previewUrl={afterImg} onSet={(url) => setAfterImg(url || null)} />
            </div>
          </ClinicSectionCard>
        </div>

        {/* 6. Follow-up Scheduler */}
        <ClinicSectionCard icon={Calendar} title="Lịch tái khám" iconColor="#F97316">
          <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Ngày tái khám</label>
              <input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-orange-200 focus:bg-white transition-all text-sm font-bold text-gray-900" />
            </div>
            <div>
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Loại lịch hẹn</label>
              <select className="w-full appearance-none px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none cursor-pointer focus:border-orange-200 focus:bg-white transition-all text-sm font-bold text-gray-900">
                {["Tái khám", "Tiêm vaccine", "Cắt chỉ", "Xem kết quả xét nghiệm", "Làm sạch răng", "Kiểm tra sau phẫu thuật"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-[0.1em] mb-3 block">Ghi chú cho chủ</label>
              <input value={followupNote} onChange={(e) => setFollowupNote(e.target.value)} placeholder="Nhắc nhở chủ thú mang theo gì..." className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-orange-200 focus:bg-white transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300" />
            </div>
          </div>
          {followupDate && (
            <div className="px-8 pb-8">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-orange-50 border-2 border-orange-100/50 shadow-inner animate-in slide-in-from-left-4 duration-500">
                <Clock className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-black text-orange-900/70 tracking-tight">Hệ thống sẽ tự động gửi nhắc nhở qua Zalo/SMS cho chủ thú 24 giờ trước lịch hẹn.</span>
              </div>
            </div>
          )}
        </ClinicSectionCard>

        {/* 7. Vet Sign-off */}
        <ClinicSectionCard icon={User} title="Xác nhận bác sĩ">
          <div className="px-8 py-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-200 text-2xl font-black text-white">SL</div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-2xl font-black text-gray-900 tracking-tight">BS. Sarah Lee, DVM</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Số GPhép VET-2021-1892 · Paws & Claws Clinic · Phòng 2</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[0.7rem] font-black uppercase tracking-widest">
                  <Stethoscope className="w-4 h-4" /> Bác sĩ tổng quát
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSigPad(!sigPad)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all font-black text-sm shadow-lg ${sigPad ? "bg-green-500 text-white shadow-green-200 scale-105" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {sigPad ? <><CheckCircle2 className="w-5 h-5" strokeWidth={3} /> ĐÃ KÝ XÁC NHẬN</> : <><Droplets className="w-5 h-5" /> KÝ HỒ SƠ</>}
            </button>
          </div>
          {sigPad && (
            <div className="px-8 pb-10">
              <div className="h-28 rounded-3xl bg-gray-50 border-2 border-dashed border-green-200 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-serif text-5xl text-green-700 italic tracking-tighter select-none">Dr. Sarah Lee</p>
              </div>
              <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mt-4 text-center">Đã ký số bảo mật · {dateStr} lúc {timeStr}</p>
            </div>
          )}
        </ClinicSectionCard>
        
        <div className="h-10" />
      </div>
    </ClinicPageShell>
  );
}




