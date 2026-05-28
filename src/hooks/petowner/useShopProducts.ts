import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { petOwnerApi, type ShopProductParams, type ShopCategoryParams } from '@/api/petOwnerApi';

export function useShopProducts(params?: Omit<ShopProductParams, 'PageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['petowner', 'shop', 'products', params],
    queryFn: ({ pageParam }) =>
      petOwnerApi.getProducts({ ...params, PageNumber: pageParam as number }),
    getNextPageParam: (lastPage: any) =>
      lastPage?.hasNextPage ? (lastPage?.pageNumber ?? 1) + 1 : undefined,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useShopCategories(params?: ShopCategoryParams) {
  return useQuery({
    queryKey: ['petowner', 'shop', 'categories', params],
    queryFn: () => petOwnerApi.getCategories({ IsActive: true, PageSize: 50, ...params }),
    staleTime: 5 * 60 * 1000,
  });
}
