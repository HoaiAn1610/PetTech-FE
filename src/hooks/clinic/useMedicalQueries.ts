import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { medicalService, catalogService, inventoryService, shopService } from '@/api/services';
import { petService } from '@/api/petService';
import { toast } from 'sonner';

export function useClinicServices() {
  return useQuery({
    queryKey: [...clinicKeys.all, 'services'],
    queryFn: () => catalogService.getServices(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMedicalProducts() {
  return useQuery({
    queryKey: [...clinicKeys.all, 'medical-products'],
    queryFn: () => shopService.getProducts(),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePetAllergensClinic(petId: string | undefined) {
  return useQuery({
    queryKey: clinicKeys.allergens(petId || ''),
    queryFn: () => petService.getAllergens(petId!),
    enabled: !!petId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicalRecords(petId: string | undefined) {
  return useQuery({
    queryKey: clinicKeys.medical(petId || ''),
    queryFn: () => medicalService.getMedicalRecords(petId!),
    enabled: !!petId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMedicalRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => medicalService.createMedicalRecord(payload),
    onSuccess: (_, variables) => {
      if (variables.petId) {
        qc.invalidateQueries({ queryKey: clinicKeys.medical(variables.petId) });
      }
    },
    onError: () => toast.error('Tạo bệnh án thất bại'),
  });
}

export function useCreateInventoryMovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => inventoryService.createMovement(payload),
    onSuccess: () => {
      // Invalidate products to refresh quantity/stock on UI
      qc.invalidateQueries({ queryKey: clinicKeys.products() });
      qc.invalidateQueries({ queryKey: [...clinicKeys.all, 'medical-products'] });
    },
    onError: () => toast.error('Khấu trừ kho thất bại'),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => shopService.createBooking(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.dashboard() });
    },
    onError: () => toast.error('Tạo lịch hẹn tái khám thất bại'),
  });
}
