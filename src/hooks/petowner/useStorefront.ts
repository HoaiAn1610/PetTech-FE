import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petOwnerApi, type CheckoutRequest, type CancelOrderRequest } from '@/api/petOwnerApi';
import { toast } from 'sonner';

export function useCart() {
  return useQuery<any>({
    queryKey: ['storefront', 'cart'],
    queryFn: () => petOwnerApi.getCart(),
    staleTime: 30 * 1000, // 30 seconds stale time
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; quantity: number }) =>
      petOwnerApi.addToCart(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storefront', 'cart'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Không thể thêm sản phẩm vào giỏ hàng';
      toast.error(msg);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      petOwnerApi.updateCartItem(cartItemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefront', 'cart'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Cập nhật số lượng thất bại';
      toast.error(msg);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => petOwnerApi.deleteCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefront', 'cart'] });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    },
    onError: () => {
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => petOwnerApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefront', 'cart'] });
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutRequest) => petOwnerApi.checkout(payload),
    onSuccess: () => {
      // Invalidate cart since it's cleared on successful checkout
      queryClient.invalidateQueries({ queryKey: ['storefront', 'cart'] });
      queryClient.invalidateQueries({ queryKey: ['storefront', 'orders'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Đặt hàng thất bại';
      toast.error(msg);
    },
  });
}

export function useMyOrders(params?: { deliveryStatus?: string; page?: number; pageSize?: number }) {
  return useQuery<any>({
    queryKey: ['storefront', 'orders', params],
    queryFn: () => petOwnerApi.getOrders(params),
    staleTime: 30 * 1000,
  });
}

export function useMyOrderDetails(id: string) {
  return useQuery<any>({
    queryKey: ['storefront', 'orders', 'detail', id],
    queryFn: () => petOwnerApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCancelMyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelOrderRequest }) =>
      petOwnerApi.cancelOrder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefront', 'orders'] });
      toast.success('Đã hủy đơn hàng thành công');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Không thể hủy đơn hàng';
      toast.error(msg);
    },
  });
}
