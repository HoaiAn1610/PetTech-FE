import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { petService } from '@/api/petService';
import { customerService } from '@/api/services';
import { toast } from 'sonner';

export function useClinicPets(params?: any) {
  return useQuery({
    queryKey: [...clinicKeys.pets(), 'list', params],
    queryFn: () => petService.getPets(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function usePetsByOwner(ownerId: string | undefined) {
  return useQuery({
    queryKey: clinicKeys.petsByOwner(ownerId || ''),
    queryFn: () => petService.getPets({ ownerId } as any),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClinicCustomers(params?: any) {
  return useQuery({
    queryKey: clinicKeys.customersList(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClinicPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => petService.createPet(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.pets() });
      toast.success('Thêm bệnh nhân thành công!');
    },
    onError: () => toast.error('Thêm bệnh nhân thất bại'),
  });
}

export function useUpdateClinicPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => petService.updatePet(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.pets() });
      toast.success('Cập nhật hồ sơ bệnh nhân thành công!');
    },
    onError: () => toast.error('Cập nhật hồ sơ bệnh nhân thất bại'),
  });
}

export function useDeleteClinicPet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.pets() });
      toast.success('Đã xóa hồ sơ bệnh nhân thành công!');
    },
    onError: () => toast.error('Xoá hồ sơ bệnh nhân thất bại'),
  });
}

export function useCreateClinicCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fullName: string; email: string; phoneNumber: string; password?: string }) => customerService.createCustomer(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.customers() });
      toast.success('Thêm khách hàng thành công!');
    },
    onError: () => toast.error('Thêm khách hàng thất bại'),
  });
}

export function useUpdateCustomerPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, payload }: { customerId: string; payload: { newPassword: string } }) => customerService.updateCustomerPassword(customerId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.customers() });
      toast.success('Cập nhật mật khẩu khách hàng thành công!');
    },
    onError: () => toast.error('Cập nhật mật khẩu thất bại'),
  });
}
