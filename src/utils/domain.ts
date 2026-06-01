/**
 * Helper to detect if the application is running on a tenant's custom domain or subdomain
 * instead of the base system domain (pettechvn.site, app.pettechvn.site) or localhost.
 */
export const isTenantDomain = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return false;
  if (hostname === "pettechvn.site" || hostname === "app.pettechvn.site") return false;
  return true;
};
