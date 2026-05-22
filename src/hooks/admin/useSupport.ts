import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { TicketListParams, UpdateTicketStatusRequest } from "@/types/admin";

export function useSupportTickets(params?: TicketListParams) {
  return useQuery({
    queryKey: ['admin', 'support', 'tickets', params],
    queryFn: () => adminApi.getSupportTickets(params),
    refetchInterval: 30_000,
  });
}

export function useTicketDetail(id: string) {
  return useQuery({
    queryKey: ['admin', 'support', 'ticket', id],
    queryFn: () => adminApi.getTicket(id),
    enabled: !!id,
  });
}

// PATCH /api/admin/support-tickets/{id}/status — only status field is accepted
export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketStatusRequest }) =>
      adminApi.updateTicketStatus(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['admin', 'support'] });

      // Snapshot previous list queries
      const previousList = qc.getQueriesData({ queryKey: ['admin', 'support', 'tickets'] });

      // Optimistically update every cached page of tickets
      qc.setQueriesData({ queryKey: ['admin', 'support', 'tickets'] }, (old: any) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.map((t: any) => t.id === id ? { ...t, status: data.status } : t) };
      });

      // Optimistically update the detail cache if loaded
      qc.setQueryData(['admin', 'support', 'ticket', id], (old: any) => {
        if (!old) return old;
        return { ...old, status: data.status };
      });

      return { previousList };
    },
    onError: (_err, { id }, ctx) => {
      ctx?.previousList?.forEach(([key, val]) => qc.setQueryData(key, val));
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'ticket', id] });
      toast.error('Cập nhật trạng thái thất bại');
    },
    onSuccess: () => toast.success('Trạng thái ticket đã được cập nhật'),
    onSettled: (_, __, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'ticket', id] });
    },
  });
}
