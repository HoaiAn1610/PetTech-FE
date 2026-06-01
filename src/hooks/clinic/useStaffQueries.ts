import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { staffService } from '@/api/services';
import { toast } from 'sonner';

export function useClinicStaff(params?: any, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...clinicKeys.staff(), params],
    queryFn: () => staffService.getStaff(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    ...options,
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => staffService.createStaff(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.staff() });
      toast.success('Mời thành viên mới thành công!');
    },
    onError: () => toast.error('Mời thành viên thất bại'),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => staffService.updateStaff(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.staff() });
      toast.success('Cập nhật thông tin nhân viên thành công!');
    },
    onError: () => toast.error('Cập nhật thông tin nhân viên thất bại'),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.staff() });
    },
    onError: () => toast.error('Vô hiệu hóa nhân viên thất bại'),
  });
}
