import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petOwnerApi } from '@/api/petOwnerApi';

export function useNotifications(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['petowner', 'notifications', params],
    queryFn: () => petOwnerApi.getNotifications(params),
    refetchInterval: 60_000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['petowner', 'notifications', 'unread-count'],
    queryFn: () => petOwnerApi.getUnreadCount(),
    refetchInterval: 30_000,
    select: (data: any) => {
      if (typeof data === 'number') return data;
      return data?.count ?? data?.unreadCount ?? 0;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petOwnerApi.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['petowner', 'notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => petOwnerApi.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['petowner', 'notifications'] }),
  });
}
