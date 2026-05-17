import { useState, useMemo } from "react";
import {
  Search, Plus, Filter, ChevronDown, X, PawPrint,
  CheckCircle2, AlertTriangle, Activity,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { PatientDetailModal } from "@/features/clinic/patients/PatientDetailModal";
import { AddPatientModal } from "@/features/clinic/patients/AddPatientModal";
import { PatientTable } from "@/features/clinic/patients/PatientTable";
import "@/styles/fonts.css";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: "p1", name: "Bella",   species: "Dog",    breed: "Golden Retriever",  age: "3t 2m",  gender: "Cái",  weight: "28 kg",  color: "#fbbf24", owner: "Maria Santos",  ownerPhone: "+1 555-0101", ownerEmail: "maria@email.com",  lastVisit: "7/3/2026",  nextVisit: "7/4/2026",  status: "Khoẻ mạnh",       alerts: [],                             vaccineDue: false, healthScore: 92, vet: "BS. Lee"  },
  { id: "p2", name: "Mochi",   species: "Cat",    breed: "Mèo vàng",          age: "2t",     gender: "Đực",  weight: "4.8 kg", color: "#f97316", owner: "James Kim",     ownerPhone: "+1 555-0202", ownerEmail: "james@email.com",  lastVisit: "14/2/2026", nextVisit: "14/3/2026", status: "Chờ vaccine",     alerts: ["Vaccine quá hạn 3 tuần"],     vaccineDue: true,  healthScore: 78, vet: "BS. Chen" },
  { id: "p3", name: "Max",     species: "Dog",    breed: "German Shepherd",   age: "5t 8m",  gender: "Đực",  weight: "35 kg",  color: "#6b7280", owner: "Sarah Johnson", ownerPhone: "+1 555-0303", ownerEmail: "sarah.j@email.com",lastVisit: "1/3/2026",  nextVisit: "1/6/2026",  status: "Đang điều trị",  alerts: ["Loạn sản hông — đang theo dõi"], vaccineDue: false, healthScore: 65, vet: "BS. Lee"  },
  { id: "p4", name: "Luna",    species: "Cat",    breed: "British Shorthair", age: "1t 4m",  gender: "Cái",  weight: "3.9 kg", color: "#8b5cf6", owner: "Alex Wong",     ownerPhone: "+1 555-0404", ownerEmail: "alex@email.com",   lastVisit: "4/3/2026",  nextVisit: "18/3/2026", status: "Khoẻ mạnh",       alerts: [],                             vaccineDue: false, healthScore: 95, vet: "BS. Chen" },
  { id: "p5", name: "Charlie", species: "Dog",    breed: "Beagle",            age: "4t",     gender: "Đực",  weight: "14 kg",  color: "#d97706", owner: "Emma Davis",    ownerPhone: "+1 555-0505", ownerEmail: "emma@email.com",   lastVisit: "20/1/2026", nextVisit: "Quá hạn",   status: "Không hoạt động",alerts: ["Không khám hơn 45 ngày"],     vaccineDue: true,  healthScore: 72, vet: "BS. Lee"  },
  { id: "p6", name: "Kiwi",    species: "Bird",   breed: "Vẹt xanh",          age: "6t",     gender: "Cái",  weight: "0.9 kg", color: "#16a34a", owner: "Carlos Reyes",  ownerPhone: "+1 555-0606", ownerEmail: "carlos@email.com", lastVisit: "6/3/2026",  nextVisit: "6/9/2026",  status: "Khoẻ mạnh",       alerts: [],                             vaccineDue: false, healthScore: 88, vet: "BS. Chen" },
  { id: "p7", name: "Coco",    species: "Dog",    breed: "Poodle",            age: "2t 6m",  gender: "Cái",  weight: "5.2 kg", color: "#ec4899", owner: "Lisa Park",     ownerPhone: "+1 555-0707", ownerEmail: "lisa@email.com",   lastVisit: "5/3/2026",  nextVisit: "20/3/2026", status: "Khoẻ mạnh",       alerts: [],                             vaccineDue: false, healthScore: 97, vet: "BS. Lee"  },
  { id: "p8", name: "Thumper", species: "Rabbit", breed: "Holland Lop",       age: "3t",     gender: "Đực",  weight: "2.1 kg", color: "#f3f4f6", owner: "Tom Harrison",  ownerPhone: "+1 555-0808", ownerEmail: "tom@email.com",    lastVisit: "28/2/2026", nextVisit: "28/5/2026", status: "Khoẻ mạnh",       alerts: [],                             vaccineDue: false, healthScore: 85, vet: "BS. Chen" },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("Tất cả");
  const [filterStatus, setFilterStatus]   = useState("Tất cả");
  const [selected, setSelected] = useState<typeof PATIENTS[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [patients] = useState(PATIENTS);

  const filtered = useMemo(() => patients.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.owner.toLowerCase().includes(search.toLowerCase()) || 
      p.breed.toLowerCase().includes(search.toLowerCase());
    const matchSpecies = filterSpecies === "Tất cả" || p.species === filterSpecies;
    const matchStatus  = filterStatus  === "Tất cả" || p.status  === filterStatus;
    return matchSearch && matchSpecies && matchStatus;
  }), [patients, search, filterSpecies, filterStatus]);

  function handleAddPatient(name: string) {
    setSuccessToast(`${name} đã được thêm thành công!`);
    setTimeout(() => setSuccessToast(""), 3000);
  }

  const HeaderActions = (
    <button onClick={() => setShowAdd(true)}
      className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-200"
      style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 900, fontSize: "0.9rem" }}>
      <Plus className="w-5 h-5" />
      Thêm bệnh nhân
    </button>
  );

  return (
    <ClinicPageShell
      title="Danh sách bệnh nhân"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Bệnh nhân" }]}
      headerActions={HeaderActions}
    >
      <div className="flex flex-col gap-8">
        {/* KPI strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClinicStatCard label="Tổng bệnh nhân" value={patients.length} icon={PawPrint} color="#2563EB" description="trong cơ sở dữ liệu" />
          <ClinicStatCard label="Khoẻ mạnh" value={patients.filter(p => p.status === "Khoẻ mạnh").length} icon={CheckCircle2} color="#16a34a" description="theo dõi định kỳ" />
          <ClinicStatCard label="Cần xử lý" value={patients.filter(p => p.status !== "Khoẻ mạnh").length} icon={AlertTriangle} color="#f97316" description="bao gồm quá hạn vaccine" />
          <ClinicStatCard label="Điểm sức khoẻ TB" value={Math.round(patients.reduce((a, p) => a + p.healthScore, 0) / patients.length)} icon={Activity} color="#7c3aed" description="trên thang điểm 100" />
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm tên pet, chủ, giống loài..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all text-[0.9rem] font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              <select 
                value={filterSpecies} 
                onChange={e => setFilterSpecies(e.target.value)}
                className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 text-sm font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {["Tất cả", "Dog", "Cat", "Bird", "Rabbit"].map(o => (
                  <option key={o} value={o}>{o === "Tất cả" ? "Tất cả loài" : o}</option>
                ))}
              </select>
              
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 text-sm font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {["Tất cả", "Khoẻ mạnh", "Chờ vaccine", "Đang điều trị", "Không hoạt động"].map(o => (
                  <option key={o} value={o}>{o === "Tất cả" ? "Tất cả trạng thái" : o}</option>
                ))}
              </select>
            </div>
          </div>

          {(filterSpecies !== "Tất cả" || filterStatus !== "Tất cả" || search) && (
            <button 
              onClick={() => { setFilterSpecies("Tất cả"); setFilterStatus("Tất cả"); setSearch(""); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-colors border border-red-100"
            >
              <X className="w-3.5 h-3.5" />
              Xoá bộ lọc
            </button>
          )}
        </div>

        {/* Patient Table Component */}
        <PatientTable patients={filtered} onSelect={setSelected} />
        
        <div className="h-8" />
      </div>

      {selected && <PatientDetailModal patient={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onAdd={handleAddPatient} />}

      {successToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-6 py-4 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ background: "#0f172a", color: "white", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)", fontFamily: "Inter, sans-serif" }}>
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-sm font-black tracking-tight">{successToast}</span>
        </div>
      )}
    </ClinicPageShell>
  );
}


