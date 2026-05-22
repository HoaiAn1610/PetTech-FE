// /api/auth/admin/users endpoint does not exist in the current backend.
// This hook is a stub to prevent compile errors from any remaining imports.
export function useAdminUsers() {
  return { data: undefined, isLoading: false, isError: false };
}
export function useInviteAdmin() {
  return { mutate: () => {}, isPending: false };
}
export function useDeleteAdmin(_currentUserId: string) {
  return { mutate: () => {}, isPending: false };
}
