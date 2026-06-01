export const clinicKeys = {
  all:           ['clinic'] as const,

  products:      () => [...clinicKeys.all, 'products'] as const,
  productsList:  (params?: any) => [...clinicKeys.products(), 'list', params] as const,

  categories:    () => [...clinicKeys.all, 'categories'] as const,

  customers:     () => [...clinicKeys.all, 'customers'] as const,
  customersList: (params?: any) => [...clinicKeys.customers(), 'list', params] as const,

  pets:          () => [...clinicKeys.all, 'pets'] as const,
  petsByOwner:   (ownerId: string) => [...clinicKeys.pets(), 'owner', ownerId] as const,
  petById:       (id: string) => [...clinicKeys.pets(), id] as const,

  staff:         () => [...clinicKeys.all, 'staff'] as const,

  medical:       (petId: string) => [...clinicKeys.all, 'medical', petId] as const,
  allergens:     (petId: string) => [...clinicKeys.all, 'allergens', petId] as const,

  analytics:     () => [...clinicKeys.all, 'analytics'] as const,
  dashboard:     () => [...clinicKeys.analytics(), 'dashboard'] as const,
  revenue:       (period: string) => [...clinicKeys.analytics(), 'revenue', period] as const,
  heatmap:       (period?: string) => [...clinicKeys.analytics(), 'heatmap', period] as const,
  topServices:   () => [...clinicKeys.analytics(), 'top-services'] as const,

  profile:       () => [...clinicKeys.all, 'profile'] as const,
  plan:          () => [...clinicKeys.all, 'plan'] as const,
};
