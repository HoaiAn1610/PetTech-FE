import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { TicketListParams, UpdateTicketRequest, ReplyTicketRequest } from "@/types/admin";

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

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) => adminApi.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['admin', 'support', 'ticket', id] });
      toast.success('Cập nhật ticket thành công');
    },
    onError: () => toast.error('Cập nhật ticket thất bại'),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReplyTicketRequest }) => adminApi.replyTicket(id, data),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['admin', 'support', 'ticket', id] }); toast.success('Đã gửi phản hồi'); },
    onError: () => toast.error('Gửi phản hồi thất bại'),
  });
}
