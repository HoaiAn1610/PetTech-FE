/**
 * Helper to resolve a MinIO object URL/filename.
 * If the input is already a full URL or data URI, it is returned as is.
 * Otherwise, it resolves it against the local/dev public MinIO endpoint and bucket.
 */
export const resolveMinioUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `http://localhost:9000/pettech-files/${url}`;
};
