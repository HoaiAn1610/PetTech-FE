// /api/admin/system endpoint does not exist in the current backend.
// This hook is a stub to prevent compile errors from any remaining imports.
export function useSystemSettings() {
  return { data: undefined, isLoading: false, isError: false };
}
export function useUpdateSystemSettings() {
  return { mutate: () => {}, isPending: false };
}
