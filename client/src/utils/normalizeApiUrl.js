/**
 * Ensures production API base URL ends with /api (no trailing slash after).
 * Examples:
 *   https://my-app.onrender.com        → https://my-app.onrender.com/api
 *   https://my-app.onrender.com/api    → https://my-app.onrender.com/api
 *   https://my-app.onrender.com/api/   → https://my-app.onrender.com/api
 *   /api                               → /api
 */
export function normalizeApiBaseUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("/")) {
    return trimmed.replace(/\/+$/, "") || "/api";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
}
