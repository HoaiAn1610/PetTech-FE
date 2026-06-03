/**
 * Helper to resolve a MinIO object URL/filename.
 * If the input is already a full URL or data URI, it will clean it (replace local container hostnames/ports) and return.
 * Otherwise, it resolves the filename against the local/dev public MinIO endpoint and bucket,
 * or the production API gateway if running in production.
 */
export const resolveMinioUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const baseUrl = apiUrl.replace(/\/$/, '');

  // If it's a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it's not a local MinIO container URL or localhost:9000, return as is (e.g., Unsplash images)
    if (!url.includes('minio:9000') && !url.includes('localhost:9000')) {
      return url;
    }

    // Parse using URL object to dynamically replace host, port and protocol
    try {
      const parsedUrl = new URL(url);
      const apiParsed = new URL(baseUrl);

      // If we are in local development (API host is localhost/127.0.0.1)
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        parsedUrl.protocol = 'http:';
        parsedUrl.host = 'localhost';
        parsedUrl.port = '9000';
      } else {
        // Production
        parsedUrl.protocol = apiParsed.protocol;
        parsedUrl.host = apiParsed.host;
        parsedUrl.port = apiParsed.port; // empty if 80/443
      }
      return parsedUrl.toString();
    } catch (e) {
      // Fallback regex replacement
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        return url.replace(/^https?:\/\/[^/]+/, 'http://localhost:9000');
      } else {
        return url.replace(/^https?:\/\/[^/]+/, baseUrl);
      }
    }
  }

  if (url.startsWith('data:')) return url;

  // Local development fallback for raw filenames (e.g. filename.jpg)
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    return `http://localhost:9000/pettech-files/${url}`;
  }

  // Production fallback for raw filenames
  return `${baseUrl}/pettech-files/${url}`;
};

/**
 * Clean MinIO presigned URL by replacing container host names with browser-accessible domains.
 */
export const cleanPresignedUrl = (url?: string): string | undefined => {
  return resolveMinioUrl(url);
};
