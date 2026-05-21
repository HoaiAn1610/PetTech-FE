import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { InviteAdminRequest } from "@/types/admin";

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getAdminUsers(),
  });
}

export function useInviteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteAdminRequest) => adminApi.inviteAdmin(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('Lời mời đã được gửi thành công'); },
    onError: () => toast.error('Gửi lời mời thất bại'),
  });
}

export function useDeleteAdmin(currentUserId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (id === currentUserId) throw new Error('Không thể xóa tài khoản của chính mình');
      return adminApi.deleteAdmin(id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('Đã xóa admin user'); },
    onError: (err: Error) => toast.error(err.message || 'Xóa user thất bại'),
  });
}
