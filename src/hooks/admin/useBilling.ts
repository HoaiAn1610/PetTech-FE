import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/api/adminApi";
import type { InvoiceListParams } from "@/types/admin";

export function useBillingOverview() {
  return useQuery({
    queryKey: ['admin', 'billing', 'overview'],
    queryFn: () => adminApi.getBillingOverview(),
  });
}

export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: ['admin', 'billing', 'invoices', params],
    queryFn: () => adminApi.getInvoices(params),
  });
}

export function useRetryPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => adminApi.retryPayment(invoiceId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'billing', 'invoices'] }); toast.success('Đã gửi lại yêu cầu thanh toán'); },
    onError: () => toast.error('Gửi lại thanh toán thất bại'),
  });
}
