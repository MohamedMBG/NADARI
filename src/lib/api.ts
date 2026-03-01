/**
 * Centralized API base URL.
 * In development, falls back to http://localhost:3001.
 * In production, set NEXT_PUBLIC_API_URL in your .env.local / hosting env vars.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
