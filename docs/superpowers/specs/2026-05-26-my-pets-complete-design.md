# My Pets — Complete Feature Design

**Date:** 2026-05-26  
**Scope:** PetOwner portal — Pets page (`/owner/pets`)  
**Approach:** Hybrid (Modal for complex Edit Pet, Inline forms for Weight & Allergen)

---

## 1. Goals

Complete the "Thú cưng của tôi" feature so all API endpoints are wired up:

| Action | API | Status |
|---|---|---|
| List pets | GET /api/pets | ✅ done |
| Create pet | POST /api/pets | ⚠️ limited (Dog/Cat only, few fields) |
| Update pet | PUT /api/pets/{id} | ❌ button does nothing |
| Weight history | GET /api/pets/{petId}/weight | ✅ done |
| Add weight | POST /api/pets/{petId}/weight | ❌ no UI |
| Edit weight | PUT /api/pets/{petId}/weight/{recordId} | ❌ no UI |
| Delete weight | DELETE /api/pets/{petId}/weight/{recordId} | ❌ no UI |
| Allergen list | GET /api/pets/{petId}/allergens | ✅ done |
| Add allergen | POST /api/pets/{petId}/allergens | ❌ no UI |
| Update allergen | PUT /api/pets/allergens/{allergenId} | ❌ no UI |
| Delete allergen | DELETE /api/pets/allergens/{allergenId} | ❌ local state only |

---

## 2. Architecture

No new pages or routes. All changes are within existing files under `src/features/petowner/pets/` and `src/hooks/petowner/useMyPets.ts`.

### Files to change

| File | Change |
|---|---|
| `AddPetModal.tsx` | Expand species (combobox + free text), add weight/color/notes fields |
| `EditPetModal.tsx` | **New file** — pre-filled form, calls `useUpdateMyPet` |
| `PetOwnerPetsPage.tsx` | Wire "Chỉnh sửa" button to `EditPetModal` |
| `PetOwnerPetTabs.tsx` | VitalsTab: inline add/edit/delete weight; AllergensTab: inline add, wire delete to API, inline edit |
| `PetOwnerPetVitals.tsx` | Guard WeightChart for empty history |
| `useMyPets.ts` | Add `useUpdateAllergen` hook |
| `petProfiles.ts` | Relax `PetProfile.species` type from `"Dog" | "Cat"` to `string` |

---

## 3. Species Combobox

**Quick-pick chips** (click to select):
```
🐕 Chó  🐱 Mèo  🐰 Thỏ  🐦 Chim  🐹 Hamster  🐢 Rùa  🐠 Cá
```

**Free-text input** below chips — user types any species. Selecting a chip fills the input.

**Emoji mapping** (auto, not user-editable in create form):
```
Chó/Dog → 🐕   Mèo/Cat → 🐱   Thỏ/Rabbit → 🐰
Chim/Bird → 🐦  Hamster → 🐹   Rùa/Turtle → 🐢
Cá/Fish → 🐠   (default) → 🐾
```

**Color scheme mapping** for unknown species: falls back to `{ color1: "#2563EB", bg: "rgba(37,99,235,0.08)" }`.

---

## 4. AddPetModal — expanded fields

**Step layout** (single scrollable form, no steps):

| Field | Type | Required |
|---|---|---|
| Loài | Species combobox | ✅ |
| Tên | text input | ✅ |
| Giống | text input | ✅ |
| Giới tính | toggle (Đực/Cái) | ✅ |
| Ngày sinh | date input | optional |
| Cân nặng hiện tại | number input (kg) | optional |
| Màu lông | text input | optional |
| Ghi chú | textarea | optional |

Payload maps directly to `CreatePetRequest`. Emoji is derived from species mapping, not shown to user in form.

---

## 5. EditPetModal

New component: `src/features/petowner/pets/EditPetModal.tsx`

- Props: `{ pet: PetProfile; onClose: () => void }`
- Pre-fills all fields from `pet`
- Calls `useUpdateMyPet` on submit
- Same field set as AddPetModal plus `bodyConditionScore` (1–9 slider)
- On success: invalidates query, closes modal

**PetOwnerPetsPage change:** "Chỉnh sửa" button sets `showEdit = true`, renders `<EditPetModal pet={pet} onClose={() => setShowEdit(false)} />`.

---

## 6. VitalsTab — Weight Management

### Inline Add Form (above chart)

```
[ Date input (today) ] [ Weight input (kg) ] [ Lưu button ]
```

- Calls `useAddWeightRecord({ petId, data: { measuredDate, weight } })`
- Note: API field is `measuredDate` not `date` (per API spec)
- On success: refetches weight history, clears form

### History Table (below chart)

Shows list of weight records sorted by date descending. Each row:
```
| 25/05/2026 | 3.8 kg | [✏️ Edit] [🗑️ Delete] |
```

**Inline edit row:** clicking ✏️ replaces the row with two inputs + Save/Cancel. Calls `useUpdateWeightRecord` — needs new hook (currently only `useAddWeightRecord` and `useDeleteWeightRecord` exist, no `useUpdateWeightRecord`). Add it to `useMyPets.ts`.

**Delete:** confirm via `window.confirm` or inline confirmation toggle, then calls `useDeleteWeightRecord`.

### WeightChart guard

```tsx
if (!history || history.length === 0) {
  return <EmptyState message="Chưa có dữ liệu cân nặng" />;
}
```

---

## 7. AllergensTab — Allergen Management

### Inline Add Form

Collapsed by default. "＋ Thêm dị nguyên" button expands:

```
[ Tên dị nguyên (text) ]
[ Mức độ: [Nhẹ] [Vừa] [Nặng] ]
[ Phản ứng (textarea, optional) ]
[ Lưu ] [ Hủy ]
```

- `ingredientKey` = `label.toLowerCase().replace(/\s+/g, '_')`
- Calls `useAddAllergen({ petId, data: { ingredientKey, label, severity, reaction } })`
- Severity values sent to API: `"Mild"` / `"Moderate"` / `"Severe"` (capitalized per API schema)

### Inline Edit

Each allergen card gets an ✏️ button. Clicking expands edit fields: severity toggle + reaction textarea. Calls `useUpdateAllergen` (new hook).

### Delete wired to API

Replace local `setAllergens(prev => prev.filter(...))` with `useDeleteAllergen({ petId, allergenId })`.

---

## 8. New Hook: useUpdateAllergen

Add to `useMyPets.ts`:

```ts
export function useUpdateAllergen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ allergenId, data }: { allergenId: string; petId: string; data: { label?: string; severity?: string; reaction?: string; diagnosedDate?: string } }) =>
      petService.updateAllergen(allergenId, data),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'allergens'] });
      toast.success('Đã cập nhật dị nguyên!');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}
```

And `useUpdateWeightRecord`:

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
    onError: () => toast.error('Cập nhật thất bại'),
  });
}
```

---

## 9. Type Changes

`petProfiles.ts` — relax species type:

```ts
// Before
species: "Dog" | "Cat";

// After
species: string;
```

`PetOwnerPetsPage.tsx` — update `petDtoToProfile` species color/emoji lookup to handle any string via fallback.

---

## 10. Out of Scope

- Delete pet (soft delete) — not requested
- Photo upload for pets — no file upload UI exists
- Medications / Vaccines / Lab Results tabs — data is clinic-managed, not editable by PetOwner via these APIs
