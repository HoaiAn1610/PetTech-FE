import { useState, useMemo } from "react";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import {
  Plus, AlertTriangle, CalendarDays, Edit2,
  Activity, Weight, Pill, Zap, BookOpen, Syringe,
  ShieldAlert, FlaskConical
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTenant } from "@/context/TenantContext";
import { type PetProfile } from "@/data/petProfiles";
import { useMyPets, usePetWeightHistory, usePetAllergens } from "@/hooks/petowner/useMyPets";
import type { PetDto } from "@/types/pet";

function petDtoToProfile(dto: PetDto): PetProfile {
  const SPECIES_MAP: Record<string, { color1: string; bg: string; emoji: string }> = {
    dog:     { color1: "#f97316", bg: "rgba(249,115,22,0.08)", emoji: "🐕" },
    cat:     { color1: "#7c3aed", bg: "rgba(124,58,237,0.08)", emoji: "🐱" },
    rabbit:  { color1: "#ec4899", bg: "rgba(236,72,153,0.08)", emoji: "🐰" },
    bird:    { color1: "#0891b2", bg: "rgba(8,145,178,0.08)",  emoji: "🐦" },
    hamster: { color1: "#d97706", bg: "rgba(217,119,6,0.08)",  emoji: "🐹" },
    turtle:  { color1: "#16a34a", bg: "rgba(22,163,74,0.08)",  emoji: "🐢" },
    fish:    { color1: "#0ea5e9", bg: "rgba(14,165,233,0.08)", emoji: "🐠" },
  };
  const key = dto.species?.toLowerCase() ?? "";
  const scheme = SPECIES_MAP[key] ?? { color1: "#2563EB", bg: "rgba(37,99,235,0.08)", emoji: dto.emoji ?? "🐾" };

  let age = "";
  if (dto.dob) {
    const years = Math.floor((Date.now() - new Date(dto.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    age = years > 0 ? `${years} tuổi` : "< 1 tuổi";
  }

  return {
    id: dto.id,
    name: dto.name,
    species: dto.species ?? "Dog",
    breed: dto.breed ?? "",
    dob: dto.dob ?? "",
    age,
    weight: dto.currentWeight ?? 0,
    gender: dto.gender,
    color: dto.color ?? "",
    microchip: dto.microchip,
    bloodType: dto.bloodType,
    insuranceId: dto.insuranceId,
    emoji: dto.emoji ?? scheme.emoji,
    color1: scheme.color1,
    bg: scheme.bg,
    bodyConditionScore: dto.bodyConditionScore ?? 5,
    conditions: dto.conditions ?? [],
    notes: dto.notes,
    allergens: (dto.allergens ?? []).map(a => ({
      id: a.id ?? "",
      ingredient: a.ingredientKey,
      label: a.label ?? a.ingredientKey,
      severity: (a.severity?.toLowerCase() as "mild" | "moderate" | "severe") ?? "mild",
      reaction: a.reaction ?? "",
      diagnosedDate: "",
    })),
    medications: [],
    vaccines: [],
    weightHistory: [],
    labResults: [],
    recentVisit: "",
    diet: {
      food: dto.diet?.currentFood ?? "",
      brand: "",
      dailyCalories: dto.diet?.dailyCalories ?? 0,
      mealsPerDay: dto.diet?.mealsPerDay ?? 2,
      restrictions: dto.diet?.restrictions ?? [],
      notes: dto.diet?.notes,
    },
    vitals: {
      date: "",
      temperature: dto.latestVitals?.temperature ?? 0,
      heartRate: dto.latestVitals?.heartRate ?? 0,
      respRate: dto.latestVitals?.respiratoryRate ?? 0,
    },
  };
}

// Import extracted components
import { StatCard } from "@/features/petowner/pets/PetOwnerPetBadges";
import { AddPetModal } from "@/features/petowner/pets/AddPetModal";
import { EditPetModal } from "@/features/petowner/pets/EditPetModal";
import {
  OverviewTab, VitalsTab, AllergensTab
} from "@/features/petowner/pets/PetOwnerPetTabs";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",    label: "Tổng quan",        icon: BookOpen    },
  { id: "vitals",      label: "Cân nặng & Chỉ số", icon: Activity  },
  { id: "allergens",   label: "Dị ứng & Chế độ ăn", icon: ShieldAlert },
] as const;

type TabId = typeof TABS[number]["id"];

export default function PetOwnerPetsPage() {
  const navigate                          = useNavigate();
  const { settings }                      = useTenant();
  const { data: apiPets, isLoading } = useMyPets();
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [activeTab,  setActiveTab]  = useState<TabId>("overview");

  const pets: PetProfile[] = useMemo(() => {
    if (apiPets && apiPets.length > 0) return apiPets.map(petDtoToProfile);
    return [];
  }, [apiPets]);

  const [selectedId, setSelectedId] = useState<string>("");
  const effectiveId = selectedId || (pets[0]?.id ?? "");

  // Fetch weight history and allergens for the selected pet
  const { data: weightHistory = [] } = usePetWeightHistory(effectiveId || undefined);
  const { data: apiAllergens  = [] } = usePetAllergens(effectiveId || undefined);

  // Merge live data into the selected pet profile
  const pet: PetProfile | null = useMemo(() => {
    const base = pets.find(p => p.id === effectiveId) ?? pets[0] ?? null;
    if (!base) return null;
    return {
      ...base,
      weightHistory: weightHistory.length > 0 ? weightHistory : base.weightHistory,
      allergens:     apiAllergens.length  > 0 ? apiAllergens  : base.allergens,
    };
  }, [pets, effectiveId, weightHistory, apiAllergens]);

  if (isLoading) {
    return (
      <PetOwnerShell pageTitle="Thú cưng của tôi">
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      </PetOwnerShell>
    );
  }

  if (!pet) {
    return (
      <PetOwnerShell pageTitle="Thú cưng của tôi">
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <span className="text-6xl">🐾</span>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Chưa có thú cưng nào</p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Hãy thêm thú cưng đầu tiên của bạn!</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
            <Plus className="w-4 h-4" /> Thêm thú cưng
          </button>
          {showAdd && <AddPetModal onClose={() => setShowAdd(false)} />}
        </div>
      </PetOwnerShell>
    );
  }

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
            const isActive = p.id === effectiveId;

            return (
              <button key={p.id}
                onClick={() => { setSelectedId(p.id); setActiveTab("overview"); setShowEdit(false); }}
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
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/50 transition-colors"
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
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="CÂN NẶNG HIỆN TẠI" value={`${pet.weight} kg`}
              sub={pet.weightHistory.length > 0 ? `${pet.weightHistory[0].weight} kg · trước đó` : "Chưa có lịch sử"}
              icon={Weight} color="#2563EB" bg="rgba(37,99,235,0.08)" />
            <StatCard label="THỂ TRẠNG (BCS)" value={`${pet.bodyConditionScore}/9`}
              sub={pet.bodyConditionScore === 5 || pet.bodyConditionScore === 4 ? "Cân nặng lý tưởng" : pet.bodyConditionScore <= 3 ? "Thiếu cân" : "Thừa cân"}
              icon={Activity} color={pet.bodyConditionScore <= 3 || pet.bodyConditionScore >= 7 ? "#dc2626" : "#16a34a"} bg={pet.bodyConditionScore <= 3 || pet.bodyConditionScore >= 7 ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)"} />
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
            {activeTab === "vitals"      && <VitalsTab      pet={pet} petId={effectiveId} />}
            {activeTab === "allergens"   && <AllergensTab   pet={pet} petId={effectiveId} />}
          </div>
        </div>
      </div>

      {showAdd  && <AddPetModal onClose={() => setShowAdd(false)} />}
      {showEdit && pet && <EditPetModal pet={pet} onClose={() => setShowEdit(false)} />}
    </PetOwnerShell>
  );
}
