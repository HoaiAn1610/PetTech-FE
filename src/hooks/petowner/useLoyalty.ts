import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { petOwnerApi } from '@/api/petOwnerApi';

export function useMyLoyaltyAccount() {
  return useQuery({
    queryKey: ['petowner', 'loyalty', 'account'],
    queryFn: () => petOwnerApi.getMyLoyaltyAccount(),
  });
}

export function useMyLoyaltyTransactions(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['petowner', 'loyalty', 'transactions', params],
    queryFn: () => petOwnerApi.getMyLoyaltyTransactions(params),
  });
}

export function useLoyaltyTiers() {
  return useQuery({
    queryKey: ['petowner', 'loyalty', 'tiers'],
    queryFn: () => petOwnerApi.getLoyaltyTiers(),
  });
}

export function useRedeemLoyalty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { points: number; rewardDescription?: string }) =>
      petOwnerApi.redeemLoyalty(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['petowner', 'loyalty'] });
      toast.success('Đổi quà thành công!');
    },
    onError: () => toast.error('Đổi quà thất bại, vui lòng thử lại'),
  });
}
