import { useQuery } from '@tanstack/react-query';
import { petOwnerApi, type UserProfileDto } from '@/api/petOwnerApi';

export function useCurrentUser() {
  return useQuery<UserProfileDto>({
    queryKey: ['petowner', 'me'],
    queryFn:  () => petOwnerApi.getMe(),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePortalDashboard() {
  return useQuery({
    queryKey: ['petowner', 'portal', 'dashboard'],
    queryFn: () => petOwnerApi.getDashboard(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePortalMedicalHistory(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['petowner', 'portal', 'medical-history', params],
    queryFn: () => petOwnerApi.getMedicalHistory(params),
  });
}

export function usePortalInvoices(params?: { pageNumber?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['petowner', 'portal', 'invoices', params],
    queryFn: () => petOwnerApi.getPortalInvoices(params),
  });
}
