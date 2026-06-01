import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { shopService, shopSettingsService } from '@/api/services';
import { toast } from 'sonner';

export function useMyPlan(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: clinicKeys.plan(),
    queryFn: () => shopService.getMyPlan().then(res => res?.data || res),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    ...options,
  });
}

export function useBillingPlans() {
  return useQuery({
    queryKey: [...clinicKeys.all, 'billing-plans'],
    queryFn: () => shopService.getBillingPlans().then(res => res?.data?.items || res?.items || res),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePaySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => shopService.paySubscription(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.plan() });
      qc.invalidateQueries({ queryKey: clinicKeys.profile() });
    },
    onError: () => toast.error('Yêu cầu gói dịch vụ thất bại'),
  });
}

export function useShopSettings() {
  return useQuery({
    queryKey: clinicKeys.profile(),
    queryFn: () => shopSettingsService.getSettings().then(res => res?.data || res),
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopProfile() {
  return useQuery({
    queryKey: [...clinicKeys.all, 'shop-profile'],
    queryFn: () => shopSettingsService.getShopProfile().then(res => res?.data || res),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateLandingSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => shopSettingsService.updateLandingSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clinicKeys.profile() });
      toast.success('Cập nhật giao diện trang chủ thành công!');
    },
    onError: () => toast.error('Cập nhật giao diện thất bại'),
  });
}

export function useUpdateSmtpConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => shopSettingsService.updateSmtpConfig(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...clinicKeys.all, 'shop-profile'] });
      toast.success('Cập nhật cấu hình SMTP thành công!');
    },
    onError: () => toast.error('Cập nhật cấu hình SMTP thất bại'),
  });
}
