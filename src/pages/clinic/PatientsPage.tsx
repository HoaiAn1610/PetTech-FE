import { useState, useMemo, useEffect } from "react";
import {
  Search, Plus, Filter, X, PawPrint,
  CheckCircle2, AlertTriangle, Activity, Loader2, AlertOctagon
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { PatientDetailModal } from "@/features/clinic/patients/PatientDetailModal";
import { AddPatientModal } from "@/features/clinic/patients/AddPatientModal";
import { EditPatientModal } from "@/features/clinic/patients/EditPatientModal";
import { PatientTable } from "@/features/clinic/patients/PatientTable";
import { petService } from "@/api/petService";
import { customerService } from "@/api/services";
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
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");
  const [patients, setPatients] = useState<PetDto[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load patients from live API
  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Fetch customers to map owner emails
      try {
        const custRes = await customerService.getCustomers({ PageSize: 1000 });
        let parsedCusts = [];
        const cRes = custRes as any;
        if (cRes) {
          if (Array.isArray(cRes)) parsedCusts = cRes;
          else if (Array.isArray(cRes.items)) parsedCusts = cRes.items;
          else if (cRes.value && Array.isArray(cRes.value.items)) parsedCusts = cRes.value.items;
          else if (cRes.data && Array.isArray(cRes.data.items)) parsedCusts = cRes.data.items;
          else if (cRes.value && Array.isArray(cRes.value)) parsedCusts = cRes.value;
          else if (cRes.data && Array.isArray(cRes.data)) parsedCusts = cRes.data;
        }
        setCustomers(parsedCusts);
      } catch (err) {
        console.error("Failed to fetch customers in PatientsPage:", err);
      }

      const response = await petService.getPets({ PageSize: 100 });
      console.log("Raw GET /api/pets response unpacked by Axios:", response);
      
      let parsedItems: PetDto[] = [];
      const res = response as any;
      
      if (res) {
        // Shape 1: Direct Array of PetDto
        if (Array.isArray(res)) {
          parsedItems = res;
        }
        // Shape 2: Object containing direct items array (e.g. { items: [...] })
        else if (Array.isArray(res.items)) {
          parsedItems = res.items;
        }
        // Shape 3: C# Result<PagedResult<PetDto>> with value containing items
        else if (res.value && Array.isArray(res.value.items)) {
          parsedItems = res.value.items;
        }
        // Shape 4: Alternate wrapper with data containing items
        else if (res.data && Array.isArray(res.data.items)) {
          parsedItems = res.data.items;
        }
        // Shape 5: Result envelope wrapping a direct array in value
        else if (res.value && Array.isArray(res.value)) {
          parsedItems = res.value;
        }
        // Shape 6: Result envelope wrapping a direct array in data
        else if (res.data && Array.isArray(res.data)) {
          parsedItems = res.data;
        }
        // Shape 7: Envelope has isSuccess but need to unpack
        else if (res.isSuccess) {
          const payload = res.data || res.value;
          if (payload) {
            if (Array.isArray(payload)) {
              parsedItems = payload;
            } else if (Array.isArray(payload.items)) {
              parsedItems = payload.items;
            }
          }
        }
      }

      setPatients(parsedItems);

      // If response isSuccess is false, trigger error toast
      if (res && res.isSuccess === false) {
        setErrorToast(res.message || "Không thể tải danh sách bệnh nhân từ hệ thống!");
        setTimeout(() => setErrorToast(""), 4000);
      }
    } catch (err) {
      console.error("Error loading patients from backend:", err);
      setErrorToast("Đã xảy ra lỗi kết nối với máy chủ!");
      setTimeout(() => setErrorToast(""), 4000);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = useMemo(() => patients.filter(p => {
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
    customers.forEach(c => {
      if (c.id) {
        map[c.id] = c.email || "";
      }
    });
    return map;
  }, [customers]);

  const handleAddPatient = async (formData: any) => {
    try {
      const mappedSpecies = formData.species === "Chó" ? "Dog" : 
                            formData.species === "Mèo" ? "Cat" : 
                            formData.species === "Chim" ? "Bird" : 
                            formData.species === "Thỏ" ? "Rabbit" : "Other";

      const newPetPayload = {
        ownerId: formData.ownerId,
        name: formData.petName,
        species: mappedSpecies,
        breed: formData.breed,
        dob: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * 2).toISOString(), // ~2 years old
        gender: formData.gender === "Đực" ? "Male" : "Female",
        color: "#fbbf24",
        currentWeight: 8.5,
        notes: "Được khởi tạo trực tiếp từ Dashboard phòng khám",
        bodyConditionScore: 4,
        conditions: []
      };

      const response = await petService.createPet(newPetPayload);
      const res = response as any;
      if (response && res.isSuccess !== false) {
        setSuccessToast(`Đã thêm bệnh nhân ${formData.petName} thành công!`);
        setTimeout(() => setSuccessToast(""), 3000);
        fetchPatients(); // Reload list
      } else {
        setErrorToast((res && res.message) || "Thêm bệnh nhân thất bại. Vui lòng kiểm tra lại thông tin!");
        setTimeout(() => setErrorToast(""), 4000);
      }
    } catch (err) {
      console.error("Failed to create pet through API:", err);
      setErrorToast("Đã xảy ra lỗi kết nối khi thêm thú cưng!");
      setTimeout(() => setErrorToast(""), 4000);
    }
  };

  const handleUpdatePatient = async (id: string, formData: any) => {
    try {
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

      const response = await petService.updatePet(id, updatePayload);
      const res = response as any;
      if (response && res.isSuccess !== false) {
        setSuccessToast(`Đã cập nhật thông tin thú cưng thành công!`);
        setTimeout(() => setSuccessToast(""), 3000);
        fetchPatients(); // Reload list
      } else {
        setErrorToast((res && res.message) || "Cập nhật thông tin thất bại. Vui lòng kiểm tra lại!");
        setTimeout(() => setErrorToast(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update pet through API:", err);
      setErrorToast("Đã xảy ra lỗi kết nối khi cập nhật hồ sơ!");
      setTimeout(() => setErrorToast(""), 4000);
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      const response = await petService.deletePet(id);
      const res = response as any;
      if (!res || res.isSuccess !== false) {
        setSuccessToast("Đã xóa hồ sơ bệnh nhân thành công!");
        setTimeout(() => setSuccessToast(""), 3000);
        fetchPatients(); // Refresh table state
      } else {
        setErrorToast((res && res.message) || "Xóa bệnh nhân thất bại hoặc tài khoản không có quyền!");
        setTimeout(() => setErrorToast(""), 4000);
      }
    } catch (err) {
      console.error("Failed to delete pet through API:", err);
      setErrorToast("Đã xảy ra lỗi khi thực thi lệnh xoá!");
      setTimeout(() => setErrorToast(""), 4000);
    }
  };

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
          <ClinicStatCard label="Khoẻ mạnh" value={patients.filter(p => !p.conditions || p.conditions.length === 0).length} icon={CheckCircle2} color="#16a34a" description="theo dõi định kỳ" />
          <ClinicStatCard label="Đang điều trị" value={patients.filter(p => p.conditions && p.conditions.length > 0).length} icon={AlertTriangle} color="#f97316" description="bao gồm các dị ứng" />
          <ClinicStatCard label="Điểm sức khoẻ TB" value={patients.length > 0 ? Math.round(patients.reduce((a, p) => a + (p.bodyConditionScore ? p.bodyConditionScore * 20 : 80), 0) / patients.length) : 0} icon={Activity} color="#7c3aed" description="trên thang điểm 100" />
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
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-6 py-4 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ background: "#0f172a", color: "white", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)", fontFamily: "Inter, sans-serif" }}>
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-sm font-black tracking-tight">{successToast}</span>
        </div>
      )}

      {/* Error Toast */}
      {errorToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-6 py-4 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ background: "#991b1b", color: "white", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)", fontFamily: "Inter, sans-serif" }}>
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4 text-red-200" />
          </div>
          <span className="text-sm font-black tracking-tight">{errorToast}</span>
        </div>
      )}
    </ClinicPageShell>
  );
}
