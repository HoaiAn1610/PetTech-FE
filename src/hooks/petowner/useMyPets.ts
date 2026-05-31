import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { petService } from '@/api/petService';
import type { CreatePetRequest, UpdatePetRequest, PetDto } from '@/types/pet';
import type { WeightRecord, PetAllergen } from '@/data/petProfiles';
import { useAuth } from '@/context/AuthContext';

// ── Pet List / CRUD ───────────────────────────────────────────────────────────

export function useMyPets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['petowner', 'pets', user?.id],
    queryFn: () => petService.getPets({ CustomerId: user!.id }),
    enabled: !!user?.id,
    select: (data: any): PetDto[] => {
      if (Array.isArray(data)) return data;
      if (data?.items) return data.items;
      return [];
    },
  });
}

export function useCreateMyPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePetRequest) => petService.createPet(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Thêm thú cưng thành công!');
    },
    onError: () => toast.error('Thêm thú cưng thất bại'),
  });
}

export function useUpdateMyPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetRequest }) =>
      petService.updatePet(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Cập nhật thành công!');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}

export function useDeleteMyPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Đã xóa thú cưng');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
}

// ── Weight History ────────────────────────────────────────────────────────────

export function usePetWeightHistory(petId: string | undefined) {
  return useQuery({
    queryKey: ['petowner', 'pets', petId, 'weight'],
    queryFn: () => petService.getWeightHistory(petId!),
    enabled: !!petId,
    select: (data: any): WeightRecord[] => {
      const items: any[] = data?.items ?? (Array.isArray(data) ? data : []);
      return items.map((r: any) => {
        const raw = r.measuredDate ?? r.date ?? null;
        const d = raw ? new Date(raw) : null;
        return {
          id:     r.id ?? undefined,
          date:   d ? d.toLocaleDateString('vi-VN') : '',
          label:  d ? d.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }) : '',
          weight: r.weight ?? 0,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

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

export function useDeleteWeightRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, recordId }: { petId: string; recordId: string }) =>
      petService.deleteWeightRecord(petId, recordId),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'weight'] });
      toast.success('Đã xóa bản ghi cân nặng');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
}

// ── Allergens ─────────────────────────────────────────────────────────────────

export function usePetAllergens(petId: string | undefined) {
  return useQuery({
    queryKey: ['petowner', 'pets', petId, 'allergens'],
    queryFn: () => petService.getAllergens(petId!),
    enabled: !!petId,
    select: (data: any): PetAllergen[] => {
      const items: any[] = data?.items ?? (Array.isArray(data) ? data : []);
      return items.map((a: any) => {
        let severityStr: 'mild' | 'moderate' | 'severe' = 'mild';
        const sev = String(a.severity ?? '').toLowerCase();
        if (sev === "0" || sev === "mild") severityStr = "mild";
        else if (sev === "1" || sev === "moderate") severityStr = "moderate";
        else if (sev === "2" || sev === "severe") severityStr = "severe";

        return {
          id:           a.id ?? '',
          ingredient:   a.ingredientKey ?? '',
          label:        a.label ?? a.ingredientKey ?? '',
          severity:     severityStr,
          reaction:     a.reaction ?? '',
          diagnosedDate: a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : '',
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddAllergen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: { ingredientKey: string; label?: string; severity: string; reaction?: string; diagnosedDate?: string } }) =>
      petService.addAllergen(petId, data),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'allergens'] });
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Đã thêm dị nguyên!');
    },
    onError: () => toast.error('Thêm dị nguyên thất bại'),
  });
}

export function useDeleteAllergen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, allergenId }: { petId: string; allergenId: string }) =>
      petService.deleteAllergen(allergenId),
    onSuccess: (_, { petId }) => {
      qc.invalidateQueries({ queryKey: ['petowner', 'pets', petId, 'allergens'] });
      qc.invalidateQueries({ queryKey: ['petowner', 'pets'] });
      toast.success('Đã xóa dị nguyên');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
}

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
