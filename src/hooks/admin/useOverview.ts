import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

// Derives active tenant count from the real tenants endpoint
export function useOverviewTenants() {
  return useQuery({
    queryKey: ['admin', 'overview', 'tenants'],
    queryFn: () => adminApi.getTenants({ pageSize: 1 }),
    staleTime: 60_000,
  });
}

// Derives open ticket count from the real support tickets endpoint
export function useOverviewTickets() {
  return useQuery({
    queryKey: ['admin', 'overview', 'tickets'],
    queryFn: () => adminApi.getSupportTickets({ status: 'open', pageSize: 1 }),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

// Recent tenants for the overview list
export function useRecentTenants() {
  return useQuery({
    queryKey: ['admin', 'overview', 'recentTenants'],
    queryFn: () => adminApi.getTenants({ pageSize: 5, sortBy: 'createdAt', isDescending: true }),
    staleTime: 60_000,
  });
}

// Recent tickets for the overview list
export function useRecentTickets() {
  return useQuery({
    queryKey: ['admin', 'overview', 'recentTickets'],
    queryFn: () => adminApi.getSupportTickets({ pageSize: 5, sortBy: 'createdAt', isDescending: true }),
    staleTime: 30_000,
  });
}
