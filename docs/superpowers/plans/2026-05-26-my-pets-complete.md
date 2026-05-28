# My Pets — Complete Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up all Pet CRUD, weight tracking, and allergen management endpoints in the PetOwner portal with multi-species support.

**Architecture:** Hybrid approach — modal for Edit Pet (many fields), inline forms for Weight & Allergen (few fields). All hooks live in `useMyPets.ts`. All UI components live in `src/features/petowner/pets/`.

**Tech Stack:** React 18, TypeScript, TanStack Query v5, axios (with response unwrapper interceptor), Recharts, sonner toasts, Tailwind + inline styles.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/data/petProfiles.ts` | Modify | Relax `species` type to `string` |
| `src/api/petService.ts` | Modify | Fix `measuredDate` field name; fix allergen POST to send array |
| `src/hooks/petowner/useMyPets.ts` | Modify | Add `useUpdateWeightRecord`, `useUpdateAllergen` |
| `src/features/petowner/pets/AddPetModal.tsx` | Modify | Species combobox + extra fields (weight, color, notes) |
| `src/features/petowner/pets/EditPetModal.tsx` | **Create** | Pre-filled edit form calling `useUpdateMyPet` |
| `src/features/petowner/pets/PetOwnerPetVitals.tsx` | Modify | Guard `WeightChart` for empty history |
| `src/features/petowner/pets/PetOwnerPetTabs.tsx` | Modify | VitalsTab inline add/edit/delete weight; AllergensTab inline add/edit, API delete |
| `src/pages/petowner/PetOwnerPetsPage.tsx` | Modify | Wire "Chỉnh sửa" button → `EditPetModal`; pass `petId` to tabs |

---

## Task 1: Relax species type + fix petService field names

**Files:**
- Modify: `src/data/petProfiles.ts`
- Modify: `src/api/petService.ts`

- [ ] **Step 1: Relax species type in petProfiles.ts**

In `src/data/petProfiles.ts`, change the `PetProfile` interface `species` field from `"Dog" | "Cat"` to `string`, and do the same for the `PetAllergen` severity (already `string` in petProfiles but needs `"mild" | "moderate" | "severe"` to stay).

Find line ~54:
```ts
// Before
species: "Dog" | "Cat";

// After
species: string;
```

- [ ] **Step 2: Fix petService weight field name (date → measuredDate)**

In `src/api/petService.ts`, the API expects `measuredDate` not `date`. Fix both `addWeightRecord` and `updateWeightRecord`:

```ts
addWeightRecord: async (petId: string, payload: { weight: number; measuredDate: string }) =>
  axiosInstance.post(`/api/pets/${petId}/weight`, payload),

updateWeightRecord: async (petId: string, recordId: string, payload: { weight?: number; measuredDate?: string }) =>
  axiosInstance.put(`/api/pets/${petId}/weight/${recordId}`, payload),
```

- [ ] **Step 3: Fix allergen POST to send array**

The API expects an array `[{ ingredientKey, label, severity, reaction, diagnosedDate }]`. Fix `addAllergen`:

```ts
addAllergen: async (petId: string, payload: { ingredientKey: string; label?: string; severity: string; reaction?: string; diagnosedDate?: string }) =>
  axiosInstance.post(`/api/pets/${petId}/allergens`, [payload]),
```

- [ ] **Step 4: Commit**

```bash
git add src/data/petProfiles.ts src/api/petService.ts
git commit -m "fix: relax species type to string; fix weight measuredDate field; fix allergen POST array"
```

---

## Task 2: Add missing hooks to useMyPets.ts

**Files:**
- Modify: `src/hooks/petowner/useMyPets.ts`

- [ ] **Step 1: Add `useUpdateWeightRecord` hook**

Append after `useDeleteWeightRecord` in `src/hooks/petowner/useMyPets.ts`:

```ts
export function useUpdateWeightRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, recordId, data }: { petId: string; recordId: string; data: { measuredDate?: string; weight?: number } }) =>
      petService.updateWeightRecord(petId, recordId, data),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'weight'] });
      toast.success('Đã cập nhật cân nặng!');
    },
    onError: () => toast.error('Cập nhật cân nặng thất bại'),
  });
}
```

- [ ] **Step 2: Add `useUpdateAllergen` hook**

Append after `useDeleteAllergen` in `src/hooks/petowner/useMyPets.ts`:

```ts
export function useUpdateAllergen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ allergenId, petId, data }: { allergenId: string; petId: string; data: { label?: string; severity?: string; reaction?: string; diagnosedDate?: string } }) =>
      petService.updateAllergen(allergenId, data),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'allergens'] });
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Đã cập nhật dị nguyên!');
    },
    onError: () => toast.error('Cập nhật dị nguyên thất bại'),
  });
}
```

- [ ] **Step 3: Fix useAddWeightRecord to use measuredDate**

In `useAddWeightRecord`, the payload type uses `date`. Update to `measuredDate`:

```ts
export function useAddWeightRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: { weight: number; measuredDate: string } }) =>
      petService.addWeightRecord(petId, data),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'weight'] });
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Đã lưu cân nặng!');
    },
    onError: () => toast.error('Lưu cân nặng thất bại'),
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/petowner/useMyPets.ts
git commit -m "feat: add useUpdateWeightRecord and useUpdateAllergen hooks"
```

---

## Task 3: Expand AddPetModal with species combobox + extra fields

**Files:**
- Modify: `src/features/petowner/pets/AddPetModal.tsx`

- [ ] **Step 1: Replace AddPetModal with expanded version**

Replace the entire content of `src/features/petowner/pets/AddPetModal.tsx`:

```tsx
import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCreateMyPet } from "@/hooks/petowner/useMyPets";

const SPECIES_PRESETS = [
  { label: "Chó",     value: "Dog",     emoji: "🐕" },
  { label: "Mèo",     value: "Cat",     emoji: "🐱" },
  { label: "Thỏ",     value: "Rabbit",  emoji: "🐰" },
  { label: "Chim",    value: "Bird",    emoji: "🐦" },
  { label: "Hamster", value: "Hamster", emoji: "🐹" },
  { label: "Rùa",     value: "Turtle",  emoji: "🐢" },
  { label: "Cá",      value: "Fish",    emoji: "🐠" },
];

function getEmoji(species: string): string {
  const match = SPECIES_PRESETS.find(
    s => s.value.toLowerCase() === species.toLowerCase() || s.label.toLowerCase() === species.toLowerCase()
  );
  return match?.emoji ?? "🐾";
}

export function AddPetModal({ onClose }: { onClose: () => void }) {
  const { user }  = useAuth();
  const createPet = useCreateMyPet();

  const [name,    setName]    = useState("");
  const [species, setSpecies] = useState("");
  const [gender,  setGender]  = useState<"Male" | "Female">("Male");
  const [breed,   setBreed]   = useState("");
  const [dob,     setDob]     = useState("");
  const [weight,  setWeight]  = useState("");
  const [color,   setColor]   = useState("");
  const [notes,   setNotes]   = useState("");
  const [done,    setDone]    = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 flex flex-col items-center gap-5 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <div>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Đã thêm {name}! {getEmoji(species)}</p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
            Thú cưng của bạn đã được đăng ký thành công.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700 }}>
          Xong
        </button>
      </div>
    </div>
  );

  function handleSubmit() {
    if (!name || !species || !breed || !user?.id) return;
    createPet.mutate(
      {
        ownerId: user.id,
        name,
        species,
        breed,
        gender,
        dob: dob || undefined,
        currentWeight: weight ? parseFloat(weight) : undefined,
        color: color || undefined,
        notes: notes || undefined,
        emoji: getEmoji(species),
      },
      { onSuccess: () => setDone(true) }
    );
  }

  const canSubmit = !!name && !!species && !!breed && !createPet.isPending;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đăng ký thú cưng mới 🐾</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">

          {/* Species quick picks */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Loài <span style={{ color: "#dc2626" }}>*</span></p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPECIES_PRESETS.map(s => (
                <button key={s.value} onClick={() => setSpecies(s.value)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    background: species === s.value ? "rgba(37,99,235,0.08)" : "#f8fafc",
                    border: species === s.value ? "2px solid #2563EB" : "1.5px solid #e5e7eb",
                    fontSize: "0.82rem", fontWeight: 700,
                    color: species === s.value ? "#2563EB" : "#374151",
                  }}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
            <input
              value={species}
              onChange={e => setSpecies(e.target.value)}
              placeholder="Hoặc nhập tên loài khác (vd: Nhím, Sóc…)"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }}
            />
          </div>

          {/* Name + Breed */}
          {[
            { label: "Tên thú cưng", placeholder: "vd. Buddy",           value: name,  onChange: setName,  required: true  },
            { label: "Giống",        placeholder: "vd. Golden Retriever", value: breed, onChange: setBreed, required: true  },
            { label: "Màu lông",     placeholder: "vd. Vàng, Trắng kem", value: color, onChange: setColor, required: false },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                {f.label} {f.required && <span style={{ color: "#dc2626" }}>*</span>}
              </p>
              <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          ))}

          {/* Gender */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Giới tính</p>
            <div className="flex gap-3">
              {([["Male", "Đực", "♂️"], ["Female", "Cái", "♀️"]] as const).map(([val, label, icon]) => (
                <button key={val} onClick={() => setGender(val)}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: gender === val ? "rgba(37,99,235,0.06)" : "#f8fafc", border: gender === val ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                  <span>{icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: gender === val ? "#2563EB" : "#374151" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DOB + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ngày sinh <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tùy chọn)</span></p>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Cân nặng (kg) <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tùy chọn)</span></p>
              <input type="number" step="0.1" min="0" value={weight} onChange={e => setWeight(e.target.value)} placeholder="vd. 3.5"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ghi chú <span style={{ color: "#9ca3af", fontWeight: 400 }}>(tùy chọn)</span></p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Đặc điểm nổi bật, tính cách, lưu ý đặc biệt…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: canSubmit ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: canSubmit ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
            {createPet.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu…</> : "Đăng ký thú cưng"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/petowner/pets/AddPetModal.tsx
git commit -m "feat: expand AddPetModal with species combobox and extra fields"
```

---

## Task 4: Create EditPetModal

**Files:**
- Create: `src/features/petowner/pets/EditPetModal.tsx`

- [ ] **Step 1: Create EditPetModal.tsx**

Create `src/features/petowner/pets/EditPetModal.tsx`:

```tsx
import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useUpdateMyPet } from "@/hooks/petowner/useMyPets";
import { PetProfile } from "@/data/petProfiles";

const SPECIES_PRESETS = [
  { label: "Chó",     value: "Dog",     emoji: "🐕" },
  { label: "Mèo",     value: "Cat",     emoji: "🐱" },
  { label: "Thỏ",     value: "Rabbit",  emoji: "🐰" },
  { label: "Chim",    value: "Bird",    emoji: "🐦" },
  { label: "Hamster", value: "Hamster", emoji: "🐹" },
  { label: "Rùa",     value: "Turtle",  emoji: "🐢" },
  { label: "Cá",      value: "Fish",    emoji: "🐠" },
];

function getEmoji(species: string): string {
  const match = SPECIES_PRESETS.find(
    s => s.value.toLowerCase() === species.toLowerCase() || s.label.toLowerCase() === species.toLowerCase()
  );
  return match?.emoji ?? "🐾";
}

export function EditPetModal({ pet, onClose }: { pet: PetProfile; onClose: () => void }) {
  const updatePet = useUpdateMyPet();

  const [name,    setName]    = useState(pet.name);
  const [species, setSpecies] = useState(pet.species);
  const [gender,  setGender]  = useState<"Male" | "Female">(
    pet.gender.startsWith("F") ? "Female" : "Male"
  );
  const [breed,   setBreed]   = useState(pet.breed);
  const [dob,     setDob]     = useState(
    pet.dob ? new Date(pet.dob).toISOString().slice(0, 10) : ""
  );
  const [weight,  setWeight]  = useState(pet.weight ? String(pet.weight) : "");
  const [color,   setColor]   = useState(pet.color ?? "");
  const [notes,   setNotes]   = useState(pet.notes ?? "");
  const [bcs,     setBcs]     = useState(pet.bodyConditionScore ?? 5);
  const [done,    setDone]    = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 flex flex-col items-center gap-5 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
          <Check className="w-7 h-7" style={{ color: "#16a34a" }} />
        </div>
        <div>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Đã cập nhật {name}!</p>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "6px" }}>Thông tin thú cưng đã được lưu.</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl"
          style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700 }}>
          Xong
        </button>
      </div>
    </div>
  );

  function handleSubmit() {
    if (!name || !species || !breed) return;
    updatePet.mutate(
      {
        id: pet.id,
        data: {
          name,
          species,
          breed,
          gender,
          dob: dob ? new Date(dob).toISOString() : undefined,
          currentWeight: weight ? parseFloat(weight) : undefined,
          color: color || undefined,
          notes: notes || undefined,
          bodyConditionScore: bcs,
          emoji: getEmoji(species),
        },
      },
      { onSuccess: () => setDone(true) }
    );
  }

  const canSubmit = !!name && !!species && !!breed && !updatePet.isPending;

  const bcsColors = ["","#dc2626","#dc2626","#ea580c","#16a34a","#16a34a","#ea580c","#ea580c","#dc2626","#dc2626"];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Chỉnh sửa hồ sơ {pet.emoji}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">

          {/* Species */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Loài</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPECIES_PRESETS.map(s => (
                <button key={s.value} onClick={() => setSpecies(s.value)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    background: species === s.value ? "rgba(37,99,235,0.08)" : "#f8fafc",
                    border: species === s.value ? "2px solid #2563EB" : "1.5px solid #e5e7eb",
                    fontSize: "0.82rem", fontWeight: 700,
                    color: species === s.value ? "#2563EB" : "#374151",
                  }}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
            <input value={species} onChange={e => setSpecies(e.target.value)}
              placeholder="Hoặc nhập tên loài khác…"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>

          {/* Name + Breed + Color */}
          {[
            { label: "Tên thú cưng", placeholder: "vd. Buddy",           value: name,  onChange: setName  },
            { label: "Giống",        placeholder: "vd. Golden Retriever", value: breed, onChange: setBreed },
            { label: "Màu lông",     placeholder: "vd. Vàng, Trắng kem", value: color, onChange: setColor },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>{f.label}</p>
              <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          ))}

          {/* Gender */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>Giới tính</p>
            <div className="flex gap-3">
              {([["Male", "Đực", "♂️"], ["Female", "Cái", "♀️"]] as const).map(([val, label, icon]) => (
                <button key={val} onClick={() => setGender(val)}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: gender === val ? "rgba(37,99,235,0.06)" : "#f8fafc", border: gender === val ? "2px solid #2563EB" : "1.5px solid #e5e7eb" }}>
                  <span>{icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: gender === val ? "#2563EB" : "#374151" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DOB + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ngày sinh</p>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Cân nặng (kg)</p>
              <input type="number" step="0.1" min="0" value={weight} onChange={e => setWeight(e.target.value)} placeholder="vd. 3.5"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.9rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
            </div>
          </div>

          {/* BCS */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>
              Thể trạng (BCS): <span style={{ color: bcsColors[bcs] }}>{bcs}/9</span>
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setBcs(n)}
                  className="flex-1 rounded-md transition-all"
                  style={{
                    height: "28px",
                    background: n === bcs ? bcsColors[n] : `${bcsColors[n]}25`,
                    border: n === bcs ? `2px solid ${bcsColors[n]}` : `1px solid ${bcsColors[n]}40`,
                  }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>1 Gầy</span>
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>5 Lý tưởng</span>
              <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>9 Béo phì</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Ghi chú</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Đặc điểm nổi bật, tính cách, lưu ý đặc biệt…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#374151" }} />
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: canSubmit ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: canSubmit ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>
            {updatePet.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu…</> : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/petowner/pets/EditPetModal.tsx
git commit -m "feat: create EditPetModal with species combobox and BCS slider"
```

---

## Task 5: Wire EditPetModal in PetOwnerPetsPage

**Files:**
- Modify: `src/pages/petowner/PetOwnerPetsPage.tsx`

- [ ] **Step 1: Import EditPetModal and add showEdit state**

At the top of `PetOwnerPetsPage.tsx`, add the import:

```tsx
import { EditPetModal } from "@/features/petowner/pets/EditPetModal";
```

Inside `PetOwnerPetsPage`, add state after the existing `showAdd` state:

```tsx
const [showEdit, setShowEdit] = useState(false);
```

- [ ] **Step 2: Wire the "Chỉnh sửa" button**

Find the "Chỉnh sửa" button (around line 277):

```tsx
// Before
<button className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/50 transition-colors"
  style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
</button>

// After
<button onClick={() => setShowEdit(true)}
  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/50 transition-colors"
  style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
</button>
```

- [ ] **Step 3: Render EditPetModal at bottom of component**

At the bottom of the JSX (alongside the existing `{showAdd && <AddPetModal ... />}`), add:

```tsx
{showEdit && pet && <EditPetModal pet={pet} onClose={() => setShowEdit(false)} />}
```

Also reset `showEdit` when switching pets — add to the pet selector button's onClick:

```tsx
onClick={() => { setSelectedId(p.id); setActiveTab("overview"); setShowEdit(false); }}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/petowner/PetOwnerPetsPage.tsx
git commit -m "feat: wire EditPetModal to Chỉnh sửa button in PetOwnerPetsPage"
```

---

## Task 6: Fix WeightChart + add inline Weight management in VitalsTab

**Files:**
- Modify: `src/features/petowner/pets/PetOwnerPetVitals.tsx`
- Modify: `src/features/petowner/pets/PetOwnerPetTabs.tsx`

- [ ] **Step 1: Guard WeightChart for empty history in PetOwnerPetVitals.tsx**

In `src/features/petowner/pets/PetOwnerPetVitals.tsx`, wrap the `WeightChart` function body with an empty-check:

```tsx
export function WeightChart({ history, species }: { history: PetProfile["weightHistory"]; species: string }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">⚖️</span>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Chưa có dữ liệu cân nặng</p>
        <p style={{ fontSize: "0.72rem", color: "#d1d5db" }}>Thêm lần cân đầu tiên bên dưới</p>
      </div>
    );
  }

  const first = history[0].weight;
  // ... rest of existing code unchanged
```

- [ ] **Step 2: Rewrite VitalsTab in PetOwnerPetTabs.tsx**

Replace the `VitalsTab` function (lines ~80–110) with:

```tsx
import { useAddWeightRecord, useUpdateWeightRecord, useDeleteWeightRecord } from "@/hooks/petowner/useMyPets";

export function VitalsTab({ pet, petId }: { pet: PetProfile; petId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [newDate,   setNewDate]   = useState(today);
  const [newWeight, setNewWeight] = useState("");
  const [editId,    setEditId]    = useState<string | null>(null);
  const [editDate,  setEditDate]  = useState("");
  const [editWt,    setEditWt]    = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const addWeight    = useAddWeightRecord();
  const updateWeight = useUpdateWeightRecord();
  const deleteWeight = useDeleteWeightRecord();

  function handleAdd() {
    if (!newWeight || !petId) return;
    addWeight.mutate(
      { petId, data: { measuredDate: new Date(newDate).toISOString(), weight: parseFloat(newWeight) } },
      { onSuccess: () => { setNewWeight(""); setNewDate(today); } }
    );
  }

  function startEdit(record: { date: string; label: string; weight: number; id?: string }) {
    if (!record.id) return;
    setEditId(record.id);
    setEditWt(String(record.weight));
    setEditDate(record.date);
  }

  function handleUpdate(recordId: string) {
    updateWeight.mutate(
      { petId, recordId, data: { weight: parseFloat(editWt), measuredDate: editDate ? new Date(editDate).toISOString() : undefined } },
      { onSuccess: () => setEditId(null) }
    );
  }

  function handleDelete(recordId: string) {
    deleteWeight.mutate({ petId, recordId }, { onSuccess: () => setDeleteConfirmId(null) });
  }

  const canAdd = !!newWeight && parseFloat(newWeight) > 0 && !addWeight.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <SectionBox title="Biểu đồ cân nặng" icon={TrendingUp}>
          <WeightChart history={pet.weightHistory} species={pet.species} />
        </SectionBox>
        <SectionBox title="Chỉ số thể trạng (BCS)" icon={Activity} iconColor="#16a34a">
          <BCSGauge score={pet.bodyConditionScore} species={pet.species} />
        </SectionBox>
      </div>

      {/* Inline Add Weight */}
      <SectionBox title="Ghi nhận cân nặng mới" icon={Weight} iconColor="#2563EB">
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5 flex-1">
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af" }}>NGÀY CÂN</span>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af" }}>CÂN NẶNG (KG)</span>
            <input type="number" step="0.1" min="0" value={newWeight} onChange={e => setNewWeight(e.target.value)}
              placeholder="vd. 3.8"
              className="px-3 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
          </div>
          <button onClick={handleAdd} disabled={!canAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
            style={{ background: canAdd ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: canAdd ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            {addWeight.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Lưu
          </button>
        </div>
      </SectionBox>

      {/* Weight History Table */}
      {pet.weightHistory.length > 0 && (
        <SectionBox title="Lịch sử cân nặng" icon={Clock} iconColor="#6b7280">
          <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6" }}>
            {[...pet.weightHistory].reverse().map((record: any, idx) => {
              const rid = record.id ?? `idx-${idx}`;
              const isEditing = editId === rid;
              const isConfirmDelete = deleteConfirmId === rid;
              return (
                <div key={rid} className="flex items-center gap-4 py-3">
                  {isEditing ? (
                    <>
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg outline-none flex-1"
                        style={{ border: "1.5px solid #2563EB", fontSize: "0.85rem" }} />
                      <input type="number" step="0.1" value={editWt} onChange={e => setEditWt(e.target.value)}
                        className="px-3 py-1.5 rounded-lg outline-none w-24"
                        style={{ border: "1.5px solid #2563EB", fontSize: "0.85rem" }} />
                      <button onClick={() => handleUpdate(rid)}
                        className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#16a34a" }}>Lưu</button>
                      <button onClick={() => setEditId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </>
                  ) : isConfirmDelete ? (
                    <>
                      <p style={{ fontSize: "0.82rem", color: "#dc2626", flex: 1 }}>Xóa bản ghi này?</p>
                      <button onClick={() => handleDelete(rid)}
                        className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#dc2626" }}>Xóa</button>
                      <button onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: "0.82rem", color: "#6b7280", flex: 1 }}>{record.date || record.label}</span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{record.weight} kg</span>
                      {record.id && (
                        <>
                          <button onClick={() => startEdit(record)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-blue-50"
                            style={{ border: "1px solid #e5e7eb" }}>
                            <Edit2 className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(rid)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                            style={{ border: "1px solid #e5e7eb" }}>
                            <Trash2 className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </SectionBox>
      )}

      <SectionBox title="Chỉ số sinh tồn" icon={Stethoscope} iconColor="#0891b2">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Nhiệt độ",  value: `${pet.vitals.temperature} °C`, icon: "🌡️", color: "#F97316" },
            { label: "Nhịp tim",  value: `${pet.vitals.heartRate} bpm`,  icon: "💓", color: "#dc2626" },
            { label: "Nhịp thở", value: `${pet.vitals.respRate} /ph`,   icon: "💨", color: "#0891b2" },
            { label: "Huyết áp", value: pet.vitals.bloodPressure || "--", icon: "🩺", color: "#7c3aed" },
          ].map(v => (
            <div key={v.label} className="p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-1">
              <span className="text-xl mb-1">{v.icon}</span>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>{v.value}</p>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{v.label}</p>
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}
```

Add required imports at the top of `PetOwnerPetTabs.tsx`:
```tsx
import { useState } from "react";
import { Plus, Trash2, Edit2, Clock, Weight } from "lucide-react";  // add to existing import
import { Loader2 } from "lucide-react";
import { useAddWeightRecord, useUpdateWeightRecord, useDeleteWeightRecord, useAddAllergen, useUpdateAllergen, useDeleteAllergen } from "@/hooks/petowner/useMyPets";
```

- [ ] **Step 3: Update VitalsTab call site in PetOwnerPetsPage.tsx to pass petId**

Find the tab content section and update:

```tsx
// Before
{activeTab === "vitals" && <VitalsTab pet={pet} />}

// After
{activeTab === "vitals" && <VitalsTab pet={pet} petId={effectiveId} />}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/petowner/pets/PetOwnerPetVitals.tsx src/features/petowner/pets/PetOwnerPetTabs.tsx src/pages/petowner/PetOwnerPetsPage.tsx
git commit -m "feat: VitalsTab inline add/edit/delete weight; fix WeightChart empty guard"
```

---

## Task 7: AllergensTab — add, wire delete, inline edit

**Files:**
- Modify: `src/features/petowner/pets/PetOwnerPetTabs.tsx`

- [ ] **Step 1: Rewrite AllergensTab**

Replace the `AllergensTab` function with:

```tsx
export function AllergensTab({ pet, petId }: { pet: PetProfile; petId: string }) {
  const [showAddForm,  setShowAddForm]  = useState(false);
  const [newLabel,     setNewLabel]     = useState("");
  const [newSeverity,  setNewSeverity]  = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [newReaction,  setNewReaction]  = useState("");
  const [editId,       setEditId]       = useState<string | null>(null);
  const [editSeverity, setEditSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [editReaction, setEditReaction] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const addAllergen    = useAddAllergen();
  const updateAllergen = useUpdateAllergen();
  const deleteAllergen = useDeleteAllergen();

  function handleAdd() {
    if (!newLabel || !petId) return;
    const ingredientKey = newLabel.toLowerCase().replace(/\s+/g, "_");
    addAllergen.mutate(
      { petId, data: { ingredientKey, label: newLabel, severity: newSeverity, reaction: newReaction || undefined, diagnosedDate: new Date().toISOString() } },
      { onSuccess: () => { setNewLabel(""); setNewReaction(""); setNewSeverity("Mild"); setShowAddForm(false); } }
    );
  }

  function startEdit(a: PetAllergen) {
    if (!a.id) return;
    setEditId(a.id);
    const sev = a.severity.charAt(0).toUpperCase() + a.severity.slice(1) as "Mild" | "Moderate" | "Severe";
    setEditSeverity(sev);
    setEditReaction(a.reaction ?? "");
  }

  function handleUpdate(allergenId: string) {
    updateAllergen.mutate(
      { allergenId, petId, data: { severity: editSeverity, reaction: editReaction || undefined } },
      { onSuccess: () => setEditId(null) }
    );
  }

  function handleDelete(allergenId: string) {
    deleteAllergen.mutate({ petId, allergenId }, { onSuccess: () => setDeleteConfirmId(null) });
  }

  const severityCfg = {
    Mild:     { label: "Nhẹ",          color: "#ea580c", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)" },
    Moderate: { label: "Trung bình",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.2)"   },
    Severe:   { label: "NGHIÊM TRỌNG", color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.25)" },
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Danh sách dị nguyên</h3>
          <button onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
            style={{ background: showAddForm ? "rgba(37,99,235,0.08)" : "#f8fafc", border: "1.5px solid rgba(37,99,235,0.2)", fontSize: "0.72rem", fontWeight: 700, color: "#2563EB" }}>
            <Plus className="w-3 h-3" /> Thêm dị nguyên
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(37,99,235,0.03)", border: "1.5px dashed rgba(37,99,235,0.25)" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>TÊN DỊ NGUYÊN</p>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="vd. Tôm, Đậu nành, Lúa mì…"
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.88rem", fontFamily: "Inter" }} />
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>MỨC ĐỘ</p>
              <div className="flex gap-2">
                {(["Mild", "Moderate", "Severe"] as const).map(s => (
                  <button key={s} onClick={() => setNewSeverity(s)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: newSeverity === s ? severityCfg[s].bg : "#f8fafc",
                      border: newSeverity === s ? `2px solid ${severityCfg[s].color}` : "1.5px solid #e5e7eb",
                      color: newSeverity === s ? severityCfg[s].color : "#6b7280",
                    }}>
                    {severityCfg[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", marginBottom: "6px" }}>PHẢN ỨNG (tùy chọn)</p>
              <textarea value={newReaction} onChange={e => setNewReaction(e.target.value)}
                placeholder="Mô tả phản ứng dị ứng…" rows={2}
                className="w-full px-3 py-2.5 rounded-xl outline-none resize-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter" }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={!newLabel || addAllergen.isPending}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold"
                style={{ background: newLabel ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#f3f4f6", color: newLabel ? "white" : "#9ca3af" }}>
                {addAllergen.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Lưu
              </button>
              <button onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#f3f4f6", color: "#374151" }}>
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Allergen List */}
        <div className="flex flex-col gap-3">
          {pet.allergens.length === 0 ? (
            <div className="py-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: "#d1d5db" }} />
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Chưa có dị nguyên — thú cưng có vẻ không bị dị ứng!</p>
            </div>
          ) : pet.allergens.map(a => {
            const sev = (a.severity.charAt(0).toUpperCase() + a.severity.slice(1)) as "Mild" | "Moderate" | "Severe";
            const cfg = severityCfg[sev] ?? severityCfg.Mild;
            const isEdit = editId === a.id;
            const isConfirm = deleteConfirmId === a.id;
            return (
              <div key={a.id} className="rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${cfg.border}` }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: `${cfg.bg}`, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" style={{ color: cfg.color }} />
                    <div>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{a.label}</span>
                      {a.diagnosedDate && <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>Chẩn đoán: {a.diagnosedDate}</p>}
                    </div>
                  </div>
                  {!isEdit && !isConfirm && (
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge severity={a.severity as any} />
                      {a.id && (
                        <>
                          <button onClick={() => startEdit(a)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-3 h-3" style={{ color: "#2563EB" }} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(a.id!)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3 h-3" style={{ color: "#dc2626" }} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isConfirm ? (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <p style={{ fontSize: "0.82rem", color: "#dc2626", flex: 1 }}>Xóa dị nguyên này?</p>
                    <button onClick={() => handleDelete(a.id!)}
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                      style={{ background: "#dc2626" }}>Xóa</button>
                    <button onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                  </div>
                ) : isEdit ? (
                  <div className="px-4 py-3 flex flex-col gap-3">
                    <div className="flex gap-2">
                      {(["Mild", "Moderate", "Severe"] as const).map(s => (
                        <button key={s} onClick={() => setEditSeverity(s)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{
                            background: editSeverity === s ? severityCfg[s].bg : "#f8fafc",
                            border: editSeverity === s ? `2px solid ${severityCfg[s].color}` : "1.5px solid #e5e7eb",
                            color: editSeverity === s ? severityCfg[s].color : "#6b7280",
                          }}>
                          {severityCfg[s].label}
                        </button>
                      ))}
                    </div>
                    <textarea value={editReaction} onChange={e => setEditReaction(e.target.value)}
                      placeholder="Mô tả phản ứng…" rows={2}
                      className="w-full px-3 py-2 rounded-lg outline-none resize-none"
                      style={{ border: "1.5px solid #e5e7eb", fontSize: "0.82rem", fontFamily: "Inter" }} />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(a.id!)} disabled={updateAllergen.isPending}
                        className="flex-1 py-2 rounded-lg text-white text-xs font-bold"
                        style={{ background: "#16a34a" }}>
                        {updateAllergen.isPending ? "Đang lưu…" : "Lưu"}
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "#f3f4f6", color: "#374151" }}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5">
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", marginBottom: "3px" }}>PHẢN ỨNG ĐÃ BIẾT</p>
                    <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.55 }}>{a.reaction || "—"}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SectionBox title="Chế độ ăn hiện tại" icon={Utensils} iconColor="#16a34a">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.18)" }}>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af" }}>THỨC ĂN HIỆN TẠI</p>
              <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{pet.diet.food || "—"}</p>
              {pet.diet.brand && <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>by {pet.diet.brand}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Calo mỗi ngày",   value: pet.diet.dailyCalories ? `${pet.diet.dailyCalories} kcal` : "—" },
              { label: "Bữa ăn / ngày",   value: pet.diet.mealsPerDay   ? `${pet.diet.mealsPerDay}x / ngày`  : "—" },
              { label: "Hạn chế ăn uống", value: `${pet.diet.restrictions.length} loại` },
            ].map(r => (
              <div key={r.label} className="px-3 py-3 rounded-xl text-center" style={{ background: "#f8fafc" }}>
                <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{r.label}</p>
                <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#111827", marginTop: "2px" }}>{r.value}</p>
              </div>
            ))}
          </div>
          {pet.diet.restrictions.length > 0 && (
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", marginBottom: "8px" }}>HẠN CHẾ ĂN UỐNG</p>
              <div className="flex flex-wrap gap-2">
                {pet.diet.restrictions.map(r => (
                  <span key={r} className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", fontSize: "0.72rem", fontWeight: 600, color: "#dc2626" }}>
                    <X className="w-2.5 h-2.5" /> {r}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pet.diet.notes && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: "#f8fafc" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#9ca3af" }} />
              <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.6 }}>{pet.diet.notes}</p>
            </div>
          )}
        </div>
      </SectionBox>
    </div>
  );
}
```

- [ ] **Step 2: Update AllergensTab call site in PetOwnerPetsPage.tsx**

```tsx
// Before
{activeTab === "allergens" && <AllergensTab pet={pet} />}

// After
{activeTab === "allergens" && <AllergensTab pet={pet} petId={effectiveId} />}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/petowner/pets/PetOwnerPetTabs.tsx src/pages/petowner/PetOwnerPetsPage.tsx
git commit -m "feat: AllergensTab inline add/edit + API-wired delete"
```

---

## Task 8: Fix petDtoToProfile species mapping

**Files:**
- Modify: `src/pages/petowner/PetOwnerPetsPage.tsx`

- [ ] **Step 1: Update speciesColors map to handle any species**

In `petDtoToProfile`, update the species color/emoji lookup to accept any string:

```tsx
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
  // ... rest of function remains the same, just remove the old speciesColors lookup
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/petowner/PetOwnerPetsPage.tsx
git commit -m "fix: species color/emoji mapping supports any species string"
```

---

## Self-Review

### Spec Coverage
- ✅ Create pet (AddPetModal expanded): Task 3
- ✅ Update pet (EditPetModal): Task 4 + 5
- ✅ Weight add/edit/delete inline: Task 6
- ✅ Allergen add/edit/delete wired: Task 7
- ✅ Species combobox free-text: Tasks 3, 4
- ✅ WeightChart crash fix: Task 6
- ✅ New hooks (useUpdateWeightRecord, useUpdateAllergen): Task 2
- ✅ measuredDate field fix: Task 1
- ✅ allergen POST array fix: Task 1

### Placeholder Scan
None found.

### Type Consistency
- `measuredDate` used consistently in Tasks 1, 2, 6
- `severity` sent as `"Mild"/"Moderate"/"Severe"` (capitalized) in Tasks 2, 7 — consistent
- `petId` prop added to VitalsTab and AllergensTab signatures — consistent in Task 6 step 3 and Task 7 step 2
- `useUpdateAllergen` signature `{ allergenId, petId, data }` — consistent between Task 2 definition and Task 7 usage
