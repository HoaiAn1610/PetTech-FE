import { useQuery } from '@tanstack/react-query';
import { clinicKeys } from '@/lib/queryKeys';
import { analyticsService } from '@/api/services';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: clinicKeys.dashboard(),
    queryFn: () => analyticsService.getDashboardMetrics().then(res => res?.data || res),
    staleTime: 60 * 1000, // 1 minute staleTime for real-time dashboards
  });
}

export function useBookingHeatmap(days = 30) {
  return useQuery({
    queryKey: clinicKeys.heatmap(days.toString()),
    queryFn: () => analyticsService.getBookingHeatmap(days).then(res => res?.data || res),
    staleTime: 60 * 1000,
  });
}

export function useRevenueChart(days = 30) {
  return useQuery({
    queryKey: clinicKeys.revenue(days.toString()),
    queryFn: () => analyticsService.getRevenueChart(days).then(res => res?.data || res),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopServices(top = 5) {
  return useQuery({
    queryKey: clinicKeys.topServices(),
    queryFn: () => analyticsService.getTopServices(top).then(res => res?.data || res),
    staleTime: 5 * 60 * 1000,
  });
}

// Simple debounce helper utility for SignalR callback throttling
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: any;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  } as any as T;
}
