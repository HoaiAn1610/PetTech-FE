import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { posService, paymentService } from '@/api/services';
import { toast } from 'sonner';

export function usePOSCatalog(params?: any) {
  return useQuery({
    queryKey: clinicKeys.productsList(params),
    queryFn: () => posService.getProducts(params),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

export function usePOSCategories() {
  return useQuery({
    queryKey: clinicKeys.categories(),
    queryFn: () => posService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateInvoice() {
  return useMutation({
    mutationFn: (payload: any) => posService.createInvoice(payload),
    onError: () => toast.error('Tạo hóa đơn thất bại'),
  });
}

export function usePayInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => posService.payInvoice(invoiceId),
    onSuccess: () => {
      // Invalidate products to refresh stock quantity on UI
      qc.invalidateQueries({ queryKey: clinicKeys.products() });
    },
    onError: () => toast.error('Xác nhận thanh toán thất bại'),
  });
}

export function usePayOnline() {
  return useMutation({
    mutationFn: (invoiceId: string) => paymentService.payOnline(invoiceId),
    onError: () => toast.error('Tạo link thanh toán online thất bại'),
  });
}
