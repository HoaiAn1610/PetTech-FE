import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '@/api/services';
import { toast } from 'sonner';

export function useClinicInvoices(params?: {
  status?: string;
  orderSource?: string;
  deliveryStatus?: string;
  pageSize?: number;
  pageNumber?: number;
}) {
  return useQuery<any>({
    queryKey: ['clinic', 'invoices', params],
    queryFn: () => posService.getPendingInvoices(params),
    staleTime: 15 * 1000, // 15 seconds stale
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, deliveryStatus, note }: { invoiceId: string; deliveryStatus: string; note?: string }) =>
      posService.updateDeliveryStatus(invoiceId, { deliveryStatus, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic', 'invoices'] });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Cập nhật trạng thái thất bại';
      toast.error(msg);
    },
  });
}
