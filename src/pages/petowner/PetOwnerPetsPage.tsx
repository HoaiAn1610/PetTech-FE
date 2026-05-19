import { useState } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Plus, AlertTriangle, CalendarDays, Edit2,
  Activity, Weight, Pill, Zap, BookOpen, Syringe,
  ShieldAlert, FlaskConical
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTenant } from "@/context/TenantContext";
import { PET_PROFILES, type PetProfile } from "@/data/petProfiles";

// Import extracted components
import { StatCard } from "@/features/petowner/pets/PetOwnerPetBadges";
import { AddPetModal } from "@/features/petowner/pets/AddPetModal";
import { 
  OverviewTab, VitalsTab, AllergensTab, 
  MedicationsTab, LabResultsTab, VaccinesTab 
} from "@/features/petowner/pets/PetOwnerPetTabs";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",    label: "Tổng quan",        icon: BookOpen    },
  { id: "vitals",      label: "Cân nặng & Chỉ số", icon: Activity  },
  { id: "allergens",   label: "Dị ứng & Chế độ ăn", icon: ShieldAlert },
  { id: "medications", label: "Thuốc",             icon: Pill       },
  { id: "labs",        label: "Kết quả XN",        icon: FlaskConical },
  { id: "vaccines",    label: "Tiêm phòng",        icon: Syringe    },
] as const;

type TabId = typeof TABS[number]["id"];

export default function PetOwnerPetsPage() {
  const navigate                          = useNavigate();
  const { settings }                      = useTenant();
  const [pets]                            = useState<PetProfile[]>(PET_PROFILES);
  const [selectedId, setSelectedId]       = useState<string>(PET_PROFILES[0].id);
  const [activeTab, setActiveTab]         = useState<TabId>("overview");
  const [showAdd, setShowAdd]             = useState(false);

  const pet = pets.find(p => p.id === selectedId) ?? pets[0];
  const dueSoon = pet.vaccines.filter(v => v.status !== "current").length;
  const activeMeds = pet.medications.filter(m => m.status === "active").length;
  const abnormalLabs = pet.labResults.filter(l => l.status !== "normal").length;
  const totalAlerts = dueSoon + (abnormalLabs > 0 ? 1 : 0);

  return (
    <PetOwnerShell pageTitle="Thú cưng của tôi">
      <div className="flex gap-6 min-h-0" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Left: Pet Selector ── */}
        <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: "260px" }}>
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>Thú cưng của tôi</h3>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)" }}>
              <Plus className="w-3 h-3" style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>Thêm</span>
            </button>
          </div>

          {pets.map(p => {
            const pDue     = p.vaccines.filter(v => v.status !== "current").length;
            const pAbLabs  = p.labResults.filter(l => l.status !== "normal").length;
            const pAlerts  = pDue + (pAbLabs > 0 ? 1 : 0);
            const isActive = p.id === selectedId;

            return (
              <button key={p.id}
                onClick={() => { setSelectedId(p.id); setActiveTab("overview"); }}
                className="w-full rounded-2xl overflow-hidden text-left transition-all hover:-translate-y-0.5"
                style={{
                  background: isActive ? "white" : "#f8fafc",
                  border: isActive ? `2px solid ${p.color1}` : "1.5px solid #e5e7eb",
                  boxShadow: isActive ? `0 4px 16px ${p.color1}20` : "none",
                }}>
                <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: p.bg }}>
                  <span className="text-3xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{p.name}</p>
                    <p style={{ fontSize: "0.68rem", color: "#6b7280" }}>{p.breed} · {p.age}</p>
                  </div>
                  {pAlerts > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#dc2626", fontSize: "0.6rem", fontWeight: 800, color: "white" }}>
                      {pAlerts}
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Cân nặng</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{p.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>BCS</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: p.bodyConditionScore <= 3 || p.bodyConditionScore >= 7 ? "#dc2626" : p.bodyConditionScore === 4 || p.bodyConditionScore === 6 ? "#ea580c" : "#16a34a" }}>
                      {p.bodyConditionScore}/9
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Dị ứng</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: p.allergens.some(a => a.severity === "severe") ? "#7c3aed" : "#374151" }}>
                      {p.allergens.length} đã ghi nhận
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Health summary card */}
          <div className="rounded-2xl p-4 mt-2" style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "10px" }}>TỔNG KẾT SỨC KHỎE</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Tổng thú cưng",     value: pets.length.toString(),                              color: "#374151" },
                { label: "Cảnh báo vaccine",  value: pets.reduce((s, p) => s + p.vaccines.filter(v => v.status !== "current").length, 0).toString(), color: "#F97316" },
                { label: "Đang dùng thuốc",   value: pets.reduce((s, p) => s + p.medications.filter(m => m.status === "active").length, 0).toString(), color: "#2563EB" },
                { label: "Dị ứng nghiêm trọng", value: pets.reduce((s, p) => s + p.allergens.filter(a => a.severity === "severe").length, 0).toString(), color: "#7c3aed" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{r.label}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Pet Dashboard ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Pet Header */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1.5px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-5 flex items-center gap-5" style={{ background: pet.bg }}>
              <span className="text-6xl">{pet.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#111827" }}>{pet.name}</h2>
                  <span className="px-3 py-1 rounded-full"
                    style={{ background: "white", fontSize: "0.72rem", fontWeight: 700, color: pet.color1, border: `1px solid ${pet.color1}30` }}>
                    {pet.species}
                  </span>
                  {pet.allergens.some(a => a.severity === "severe") && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", fontSize: "0.65rem", fontWeight: 800, color: "#7c3aed" }}>
                      <ShieldAlert className="w-3 h-3" /> CÓ DỊ ỨNG NGHIÊM TRỌNG
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>{pet.breed} · {pet.age} · {pet.gender}</p>
                {dueSoon > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: "#F97316" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F97316" }}>
                      {dueSoon} vaccine cần chú ý
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
                {settings.acceptOnlineBookings && (
                  <button onClick={() => navigate("/petowner/booking")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.82rem", fontWeight: 700 }}>
                    <CalendarDays className="w-3.5 h-3.5" /> Đặt lịch khám
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="CÂN NẶNG HIỆN TẠI" value={`${pet.weight} kg`} sub={`${pet.weightHistory[0].weight} kg · 6 tháng trước`}
              icon={Weight} color="#2563EB" bg="rgba(37,99,235,0.08)" />
            <StatCard label="THỂ TRẠNG (BCS)" value={`${pet.bodyConditionScore}/9`}
              sub={pet.bodyConditionScore === 5 || pet.bodyConditionScore === 4 ? "Cân nặng lý tưởng" : pet.bodyConditionScore <= 3 ? "Thiếu cân" : "Thừa cân"}
              icon={Activity} color={pet.bodyConditionScore <= 3 || pet.bodyConditionScore >= 7 ? "#dc2626" : "#16a34a"} bg={pet.bodyConditionScore <= 3 || pet.bodyConditionScore >= 7 ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)"} />
            <StatCard label="THUỐC ĐANG DÙNG" value={activeMeds.toString()} sub={`${pet.medications.length} thuốc trong hồ sơ`}
              icon={Pill} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
            <StatCard label="CẢNH BÁO SỨC KHỎE" value={totalAlerts.toString()}
              sub={totalAlerts === 0 ? "Tất cả đều ổn!" : `${dueSoon} vaccine · ${abnormalLabs} chỉ số XN`}
              icon={totalAlerts > 0 ? AlertTriangle : Zap}
              color={totalAlerts > 0 ? "#F97316" : "#16a34a"}
              bg={totalAlerts > 0 ? "rgba(249,115,22,0.08)" : "rgba(22,163,74,0.08)"} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
            {TABS.map(tab => {
              const Icon    = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl flex-1 justify-center transition-all"
                  style={{
                    background: isActive ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "transparent",
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "white" : "#6b7280",
                  }}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "overview"    && <OverviewTab    pet={pet} />}
            {activeTab === "vitals"      && <VitalsTab      pet={pet} />}
            {activeTab === "allergens"   && <AllergensTab   pet={pet} />}
            {activeTab === "medications" && <MedicationsTab pet={pet} />}
            {activeTab === "labs"        && <LabResultsTab  pet={pet} />}
            {activeTab === "vaccines"    && <VaccinesTab    pet={pet} />}
          </div>
        </div>
      </div>

      {showAdd && <AddPetModal onClose={() => setShowAdd(false)} />}
    </PetOwnerShell>
  );
}
