import { useState, useMemo } from "react";
import {
  Search, Plus, Filter, X, PawPrint,
  CheckCircle2, AlertTriangle, Activity, Loader2
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { PatientDetailModal } from "@/features/clinic/patients/PatientDetailModal";
import { AddPatientModal } from "@/features/clinic/patients/AddPatientModal";
import { EditPatientModal } from "@/features/clinic/patients/EditPatientModal";
import { PatientTable } from "@/features/clinic/patients/PatientTable";
import { useClinicPets, useClinicCustomers, useCreateClinicPet, useUpdateClinicPet, useDeleteClinicPet } from "@/hooks/clinic/usePatientQueries";
import { PetDto } from "@/types/pet";
import "@/styles/fonts.css";

const SPECIES_MAP: Record<string, string> = {
  'Dog': 'Dog',
  'Cat': 'Cat',
  'Bird': 'Bird',
  'Rabbit': 'Rabbit',
  'Chó': 'Dog',
  'Mèo': 'Cat',
  'Chim': 'Bird',
  'Thỏ': 'Rabbit',
  'Khác': 'Other'
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("Tất cả");
  const [filterStatus, setFilterStatus]   = useState("Tất cả");
  const [selected, setSelected] = useState<PetDto | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PetDto | null>(null);

  // API Queries & Mutations
  const { data: rawPets, isLoading: petsLoading } = useClinicPets({ PageSize: 100 });
  const { data: rawCustomers, isLoading: customersLoading } = useClinicCustomers({ PageSize: 1000 });

  const createPetMutation = useCreateClinicPet();
  const updatePetMutation = useUpdateClinicPet();
  const deletePetMutation = useDeleteClinicPet();

  // Mapped Data
  const patients = useMemo(() => {
    const res = rawPets as any;
    const rawItems = res?.items || res?.data || (Array.isArray(res) ? res : []);
    if (res?.value && Array.isArray(res.value.items)) {
      return res.value.items;
    }
    if (res?.value && Array.isArray(res.value)) {
      return res.value;
    }
    return rawItems;
  }, [rawPets]);

  const customers = useMemo(() => {
    const rawCusts = rawCustomers?.items || rawCustomers?.data || (Array.isArray(rawCustomers) ? rawCustomers : []);
    const res = rawCustomers as any;
    if (res?.value && Array.isArray(res.value.items)) {
      return res.value.items;
    }
    if (res?.value && Array.isArray(res.value)) {
      return res.value;
    }
    return rawCusts;
  }, [rawCustomers]);

  const loading = petsLoading || customersLoading;

  const filtered = useMemo(() => patients.filter((p: any) => {
    const pName = p.name || "";
    const pOwner = p.ownerName || "";
    const pBreed = p.breed || "";

    const matchSearch = !search || 
      pName.toLowerCase().includes(search.toLowerCase()) || 
      pOwner.toLowerCase().includes(search.toLowerCase()) || 
      pBreed.toLowerCase().includes(search.toLowerCase());

    const mappedSpecies = SPECIES_MAP[p.species] || p.species || "Dog";
    const matchSpecies = filterSpecies === "Tất cả" || mappedSpecies === filterSpecies;

    const status = (p.conditions && p.conditions.length > 0) ? "Đang điều trị" : "Khoẻ mạnh";
    const matchStatus  = filterStatus  === "Tất cả" || status  === filterStatus;

    return matchSearch && matchSpecies && matchStatus;
  }), [patients, search, filterSpecies, filterStatus]);

  const customerEmailMap = useMemo(() => {
    const map: Record<string, string> = {};
    customers.forEach((c: any) => {
      if (c.id) {
        map[c.id] = c.email || "";
      }
    });
    return map;
  }, [customers]);

  const handleAddPatient = async (formData: any) => {
    const mappedSpecies = formData.species === "Chó" ? "Dog" : 
                          formData.species === "Mèo" ? "Cat" : 
                          formData.species === "Chim" ? "Bird" : 
                          formData.species === "Thỏ" ? "Rabbit" : "Other";

    const newPetPayload = {
      ownerId: formData.ownerId,
      name: formData.petName,
      species: mappedSpecies,
      breed: formData.breed,
      dob: formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString(),
      gender: formData.gender === "Đực" ? "Male" : "Female",
      color: "#fbbf24",
      currentWeight: 8.5,
      notes: "Được khởi tạo trực tiếp từ Dashboard phòng khám",
      bodyConditionScore: 4,
      conditions: []
    };

    await createPetMutation.mutateAsync(newPetPayload);
    setShowAdd(false);
  };

  const handleUpdatePatient = async (id: string, formData: any) => {
    const mappedSpecies = formData.species === "Chó" ? "Dog" : 
                          formData.species === "Mèo" ? "Cat" : 
                          formData.species === "Chim" ? "Bird" : 
                          formData.species === "Thỏ" ? "Rabbit" : "Other";

    const updatePayload = {
      name: formData.petName,
      species: mappedSpecies,
      breed: formData.breed,
      gender: formData.gender === "Đực" ? "Male" : "Female",
      currentWeight: parseFloat(formData.weight) || 8.5,
      bodyConditionScore: parseInt(formData.bodyConditionScore) || 4,
      notes: formData.notes || "",
      conditions: formData.conditions || []
    };

    await updatePetMutation.mutateAsync({ id, payload: updatePayload });
    setEditingPatient(null);
  };

  const handleDeletePatient = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hồ sơ bệnh nhân này?")) {
      await deletePetMutation.mutateAsync(id);
      setSelected(null);
    }
  };

  const HeaderActions = (
    <button onClick={() => setShowAdd(true)}
      className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary/25"
      style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 90%, black))", color: "white", fontWeight: 900, fontSize: "0.9rem" }}>
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
          <ClinicStatCard label="Tổng bệnh nhân" value={patients.length} icon={PawPrint} color="var(--primary-theme-color, #2563EB)" description="trong cơ sở dữ liệu" />
          <ClinicStatCard label="Khoẻ mạnh" value={patients.filter((p: any) => !p.conditions || p.conditions.length === 0).length} icon={CheckCircle2} color="#16a34a" description="theo dõi định kỳ" />
          <ClinicStatCard label="Đang điều trị" value={patients.filter((p: any) => p.conditions && p.conditions.length > 0).length} icon={AlertTriangle} color="#f97316" description="bao gồm các dị ứng" />
          <ClinicStatCard label="Điểm sức khoẻ TB" value={patients.length > 0 ? Math.round(patients.reduce((a: number, p: any) => a + (p.bodyConditionScore ? p.bodyConditionScore * 20 : 80), 0) / patients.length) : 0} icon={Activity} color="#7c3aed" description="trên thang điểm 100" />
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
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-[0.9rem] font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              <select 
                value={filterSpecies} 
                onChange={e => setFilterSpecies(e.target.value)}
                className="flex-1 sm:flex-initial bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 text-sm font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {["Tất cả", "Dog", "Cat", "Bird", "Rabbit"].map(o => (
                  <option key={o} value={o}>
                    {o === "Tất cả" ? "Tất cả loài" : o === "Dog" ? "Chó (Dog)" : o === "Cat" ? "Mèo (Cat)" : o === "Bird" ? "Chim (Bird)" : "Thỏ (Rabbit)"}
                  </option>
                ))}
              </select>
              
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                className="flex-1 sm:flex-initial bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 text-sm font-black text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {["Tất cả", "Khoẻ mạnh", "Đang điều trị"].map(o => (
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

        {/* Loading state or Table */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-black text-gray-500 uppercase tracking-wider">Đang kết nối API và đồng bộ...</p>
          </div>
        ) : (
          <PatientTable patients={filtered} onSelect={setSelected} customerEmails={customerEmailMap} />
        )}
        
        <div className="h-8" />
      </div>

      {selected && (
        <PatientDetailModal 
          patient={selected} 
          onClose={() => setSelected(null)} 
          onDelete={handleDeletePatient}
          onEdit={setEditingPatient}
        />
      )}
      
      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onUpdate={handleUpdatePatient}
        />
      )}
      
      {showAdd && (
        <AddPatientModal 
          onClose={() => setShowAdd(false)} 
          onAdd={handleAddPatient} 
        />
      )}
    </ClinicPageShell>
  );
}
