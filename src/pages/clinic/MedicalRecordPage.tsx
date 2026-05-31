import { useState, useEffect } from "react";
import {
  AlertTriangle, ChevronDown, Plus, Camera, Upload, CheckCircle2, Clock, Calendar, Activity, Thermometer, Heart, FileText, Save, Printer, Stethoscope, Pill, User, Droplets, Zap, ArrowUpRight, ClipboardList, RotateCcw, Star,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicSectionCard } from "@/components/clinic/ClinicSectionCard";
import { PatientHeader } from "@/features/clinic/medical-record/PatientHeader";
import { AllergyAlerts } from "@/features/clinic/medical-record/AllergyAlerts";
import { PhotoSlot } from "@/features/clinic/medical-record/PhotoSlot";
import { PrescriptionRow, PrescriptionLine } from "@/features/clinic/medical-record/PrescriptionRow";
import { LabResultsSection } from "@/features/clinic/medical-record/LabResultsSection";
import { VaccinesSection } from "@/features/clinic/medical-record/VaccinesSection";
import { MedicationsSection } from "@/features/clinic/medical-record/MedicationsSection";
import { medicalService, shopService, catalogService } from "@/api/services";
import { petService } from "@/api/petService";
import { MedicalRecordDetailModal } from "@/features/clinic/medical-record/MedicalRecordDetailModal";
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
    id, productId: "", medicine: "", dosage: "", frequency: FREQUENCY_OPTS[1],
    duration: DURATION_OPTS[2], route: ROUTE_OPTS[0], notes: "", autoDeduct: true,
  });

  const [rxLines, setRxLines]               = useState<PrescriptionLine[]>([makeBlank("rx1")]);
  const [diagnosis, setDiagnosis]           = useState("");
  const [diagnosisSearchOpen, setDiagnosisSearchOpen] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes]   = useState("");
  const [followupDate, setFollowupDate]     = useState("");
  const [followupNote, setFollowupNote]     = useState("");
  const [beforeImg, setBeforeImg]           = useState<string | null>("https://images.unsplash.com/photo-1596630966816-8e2de1dade53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800");
  const [afterImg, setAfterImg]             = useState<string | null>(null);
  const [saved, setSaved]                   = useState(false);
  const [activeVital, setActiveVital]       = useState(0);
  const [sigPad, setSigPad]                 = useState(false);
  const [activeTab, setActiveTab]           = useState<"Khám bệnh" | "Xét nghiệm" | "Tiêm phòng" | "Thuốc định kỳ">("Khám bệnh");

  // Pet Selection State
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [petsList, setPetsList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [allergiesList, setAllergiesList] = useState<any[]>([]);
  const [recordsList, setRecordsList] = useState<any[]>([]);
  
  // Custom states for dynamic services and detail modal
  const [bookingServiceId, setBookingServiceId] = useState<string>("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  // Fetch real pets
  useEffect(() => {
    async function loadPets() {
      try {
        const res = await petService.getPets();
        // Handle unwrapped vs wrapped axios response
        const items = (res as any)?.items || (res as any)?.data?.items || (Array.isArray((res as any)?.data) ? (res as any).data : []);
        setPetsList(items);
      } catch (err) {
        console.error("Failed to load pets", err);
      }
    }
    loadPets();

    async function loadProducts() {
      try {
        const res = await shopService.getProducts();
        const items = (res as any)?.items || (res as any)?.data?.items || (Array.isArray((res as any)?.data) ? (res as any).data : []);
        setProductsList(items);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    }
    loadProducts();

    async function loadServices() {
      try {
        const res = await catalogService.getServices();
        const items = (res as any)?.items || (res as any)?.data?.items || (Array.isArray((res as any)?.data) ? (res as any).data : []);
        const clinicService = items.find((s: any) => 
          s.name?.toLowerCase().includes("khám") || 
          s.name?.toLowerCase().includes("clinic") || 
          s.name?.toLowerCase().includes("kham")
        );
        if (clinicService) {
          setBookingServiceId(clinicService.id);
        } else if (items.length > 0) {
          setBookingServiceId(items[0].id);
        }
      } catch (err) {
        console.error("Failed to load clinic services", err);
      }
    }
    loadServices();
  }, []);

  // Fetch pet specific data when selectedPet changes
  useEffect(() => {
    if (!selectedPet?.id) return;
    
    // Extract latest vitals if available
    if (selectedPet.latestVitals) {
      setVitals({
        temp: selectedPet.latestVitals.temperature?.toString() || "",
        weight: selectedPet.latestVitals.weight?.toString() || "",
        hr: selectedPet.latestVitals.heartRate?.toString() || "",
        rr: selectedPet.latestVitals.respiratoryRate?.toString() || ""
      });
    }

    async function loadPetData() {
      try {
        const [allergiesRes, recordsRes] = await Promise.all([
          petService.getAllergens(selectedPet.id),
          medicalService.getMedicalRecords(selectedPet.id)
        ]);
        
        const allergies = (allergiesRes as any)?.data || (Array.isArray(allergiesRes) ? allergiesRes : []);
        setAllergiesList(allergies);

        const records = (recordsRes as any)?.data || (Array.isArray(recordsRes) ? recordsRes : []);
        setRecordsList(records);
      } catch (err) {
        console.error("Failed to load pet specific data", err);
      }
    }
    loadPetData();
  }, [selectedPet?.id]);

  // Vitals State
  const [vitals, setVitals] = useState({ temp: "", weight: "", hr: "", rr: "" });

  const addRxLine  = () => setRxLines((p) => [...p, makeBlank(`rx${Date.now()}`)]);
  const updateLine = (id: string, u: PrescriptionLine) => setRxLines((p) => p.map((l) => (l.id === id ? u : l)));
  const removeLine = (id: string) => setRxLines((p) => p.filter((l) => l.id !== id));
  
  const handleSave = async () => {
    if (!selectedPet) return alert("Vui lòng chọn thú cưng trước khi lưu");
    try {
      const payload = {
        petId: selectedPet.id,
        visitDate: new Date().toISOString(),
        chiefComplaint,
        clinicalNotes,
        diagnosis,
        followUpDate: followupDate ? new Date(followupDate).toISOString() : undefined,
        vitals: {
          temperature: parseFloat(vitals.temp) || undefined,
          weight: parseFloat(vitals.weight) || undefined,
          heartRate: parseInt(vitals.hr) || undefined,
          respiratoryRate: parseInt(vitals.rr) || undefined,
        },
        beforeImageUrl: beforeImg || undefined,
        afterImageUrl: afterImg || undefined,
        isSigned: sigPad,
        signedBy: sigPad ? 'BS. Sarah Lee, DVM' : undefined,
        prescriptions: rxLines.filter(l => l.productId).map((l) => ({
          productId: l.productId,
          medicationName: l.medicine,
          dosage: l.dosage,
          frequency: l.frequency,
          durationDays: parseInt(l.duration) || 0,
          route: l.route,
          notes: l.notes,
          autoDeduct: l.autoDeduct
        }))
      };
      await medicalService.createMedicalRecord(payload);
      
      // Auto follow up booking
      if (followupDate) {
        try {
          await shopService.createBooking({
            petId: selectedPet.id,
            ownerId: selectedPet.ownerId,
            serviceId: bookingServiceId || 'ID_DichVuKham_Default',
            bookingDate: new Date(followupDate).toISOString(),
            startTime: '08:00:00',
            status: 'Confirmed',
            notes: followupNote || 'Lịch tái khám tự động từ Bác sĩ'
          });
        } catch (bookingErr) {
          console.error("Lỗi tạo lịch hẹn:", bookingErr);
        }
      }
      
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Bệnh án");
    }
  };

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
            { label: "Đơn thuốc",   done: rxLines.some((l) => !!l.productId) },
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
          <button 
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đang nhập?")) {
                setDiagnosis("");
                setChiefComplaint("");
                setClinicalNotes("");
                setRxLines([{ id: "rx1", productId: "", medicine: "", dosage: "", frequency: "1 lần/ngày", duration: "7 ngày", route: "Uống", notes: "", autoDeduct: true }]);
                setFollowupDate("");
                setFollowupNote("");
                setSigPad(false);
              }
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all"
          >
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
        {!selectedPet ? (
          <div className="bg-white rounded-3xl p-10 border-2 border-gray-100 shadow-xl flex flex-col items-center text-center max-w-2xl mx-auto my-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Star className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Chọn Thú Cưng Khám Bệnh</h2>
            <p className="text-gray-500 mb-8 font-medium">Vui lòng chọn thú cưng để bắt đầu ghi nhận hồ sơ y tế, kê đơn và chỉ định xét nghiệm.</p>
            
            <div className="grid grid-cols-1 w-full gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {petsList.map(pet => (
                <button
                  key={pet.id}
                  onClick={async () => {
                    try {
                      // Fetch full pet details before selecting
                      const detailedRes = await petService.getPetById(pet.id);
                      const detailedPet = (detailedRes as any)?.data || detailedRes;
                      setSelectedPet(detailedPet || pet);
                    } catch (err) {
                      console.error("Failed to fetch detailed pet", err);
                      setSelectedPet(pet); // Fallback to list item if failed
                    }
                  }}
                  className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                      <img src={pet.avatarUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" alt="pet" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-blue-700 transition-colors">{pet.name}</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{pet.species} {pet.breed ? `· ${pet.breed}` : ""} {pet.age ? `· ${pet.age} tuổi` : ""}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">Chủ nuôi</p>
                    <p className="text-sm font-bold text-gray-700">{pet.ownerName || "Khách vãng lai"}</p>
                  </div>
                </button>
              ))}
              {petsList.length === 0 && (
                <p className="text-sm text-gray-400 font-medium my-4">Chưa có dữ liệu thú cưng nào trong hệ thống.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* 1. Patient Header */}
            <PatientHeader dateStr={dateStr} timeStr={timeStr} pet={selectedPet} medicalRecords={recordsList} />

            {/* 2. Allergy Alerts */}
            <AllergyAlerts allergies={allergiesList} />

            {/* Tabs for Navigation */}
            <div className="flex items-center gap-2 border-b-2 border-gray-100 overflow-x-auto scrollbar-none pb-px">
              {(["Khám bệnh", "Xét nghiệm", "Tiêm phòng", "Thuốc định kỳ"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-black text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-t-xl"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Xét nghiệm" && <LabResultsSection petId={selectedPet.id} />}
            {activeTab === "Tiêm phòng" && <VaccinesSection petId={selectedPet.id} />}
            {activeTab === "Thuốc định kỳ" && <MedicationsSection petId={selectedPet.id} />}

            {activeTab === "Khám bệnh" && (
              <>
            {/* Vitals Form */}
            <ClinicSectionCard icon={Activity} title="Chỉ số sinh tồn" iconColor="#ef4444">
              <div className="px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Nhiệt độ (°C)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input type="number" step="0.1" value={vitals.temp} onChange={(e) => setVitals(p => ({ ...p, temp: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-red-300" placeholder="38.5" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Cân nặng (kg)</label>
                  <input type="number" step="0.1" value={vitals.weight} onChange={(e) => setVitals(p => ({ ...p, weight: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-red-300" placeholder="14.5" />
                </div>
                <div>
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Nhịp tim (bpm)</label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input type="number" value={vitals.hr} onChange={(e) => setVitals(p => ({ ...p, hr: e.target.value }))} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-red-300" placeholder="80" />
                  </div>
                </div>
                <div>
                  <label className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest mb-3 block">Nhịp thở</label>
                  <input type="number" value={vitals.rr} onChange={(e) => setVitals(p => ({ ...p, rr: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:border-red-300" placeholder="24" />
                </div>
              </div>
            </ClinicSectionCard>

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
                <input 
                  value={diagnosis} 
                  onChange={(e) => {
                    setDiagnosis(e.target.value);
                    if (!diagnosisSearchOpen) setDiagnosisSearchOpen(true);
                  }} 
                  onFocus={() => setDiagnosisSearchOpen(true)}
                  onBlur={() => setTimeout(() => setDiagnosisSearchOpen(false), 200)}
                  placeholder="Gõ hoặc chọn chẩn đoán..." 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none cursor-text focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-bold text-gray-900"
                />
                {diagnosisSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-gray-100 max-h-60 overflow-y-auto z-50 p-2 scrollbar-none">
                    {DIAGNOSIS_OPTS.filter(d => d.toLowerCase().includes(diagnosis.toLowerCase())).length > 0 ? (
                      DIAGNOSIS_OPTS.filter(d => d.toLowerCase().includes(diagnosis.toLowerCase())).map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setDiagnosis(d);
                            setDiagnosisSearchOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {d}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm font-medium text-gray-400">
                        Nhấn Enter hoặc click ra ngoài để sử dụng chẩn đoán tự do "{diagnosis}"
                      </div>
                    )}
                  </div>
                )}
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
            {rxLines.map((line, i) => {
              // Lọc chỉ lấy sản phẩm y tế (thuốc, vaccine) để hiển thị trong đơn thuốc
              const medicalProducts = productsList.filter((p: any) => {
                if (!p.category) return true; // fallback
                const catLower = p.category.toLowerCase();
                return catLower.includes("medicine") || 
                       catLower.includes("thuốc") || 
                       catLower.includes("thuoc") ||
                       catLower.includes("vaccine") ||
                       catLower.includes("vắc") ||
                       catLower.includes("vac") ||
                       catLower.includes("suppl") ||
                       catLower.includes("bổ sung") ||
                       catLower.includes("consumable") ||
                       catLower.includes("tiêu hao");
              });
              
              return (
                <PrescriptionRow 
                  key={line.id} 
                  line={line} 
                  index={i} 
                  onChange={(u) => updateLine(line.id, u)} 
                  onRemove={() => removeLine(line.id)} 
                  isOnly={rxLines.length === 1} 
                  medicines={medicalProducts.length > 0 ? medicalProducts : productsList} 
                  routeOpts={ROUTE_OPTS} 
                  frequencyOpts={FREQUENCY_OPTS} 
                  durationOpts={DURATION_OPTS} 
                />
              );
            })}
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
              {recordsList.map((r, i) => (
                <button 
                  key={r.id || r.visitDate || i} 
                  onClick={() => {
                    setActiveVital(i);
                    setSelectedHistoryRecord(r);
                    setDetailModalOpen(true);
                  }} 
                  className={`flex items-center gap-5 p-5 rounded-2xl text-left w-full transition-all border-2 ${activeVital === i ? "bg-blue-50/50 border-blue-100 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${activeVital === i ? "bg-blue-500 shadow-lg shadow-blue-200" : "bg-gray-100"}`}>
                    <FileText className={`w-5 h-5 ${activeVital === i ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-gray-900 tracking-tight">
                        {r.visitDate ? new Date(r.visitDate).toLocaleDateString("vi-VN") : "Khám bệnh"}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-wider bg-green-50 text-green-600">Đã khám</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight">
                      {r.vitals?.weight ? `${r.vitals.weight}kg` : "---"} · {r.vitals?.temperature ? `${r.vitals.temperature}°C` : "---"} · {r.vitals?.heartRate ? `${r.vitals.heartRate}bpm` : "---"}
                    </p>
                  </div>
                </button>
              ))}
              {recordsList.length === 0 && (
                <p className="text-sm text-gray-400 font-medium my-4 px-4">Chưa có lịch sử khám bệnh.</p>
              )}
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
        
        {/* Modal chi tiết lịch sử bệnh án */}
        <MedicalRecordDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          record={selectedHistoryRecord}
          pet={selectedPet}
        />
        </>
        )}
          </>
        )}
      </div>
    </ClinicPageShell>
  );
}




