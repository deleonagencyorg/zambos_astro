const cache = new Map<string, Promise<unknown>>();

export function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  if (import.meta.env.DEV) return loader();
  const existing = cache.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const request = loader();
  cache.set(key, request);
  return request;
}

export function cmsFailure<T>(scope: string, error: unknown, fallback: T): T {
  if (import.meta.env.PROD) {
    throw new Error(`[CMS] ${scope}: ${error instanceof Error ? error.message : String(error)}`);
  }
  console.error(`[CMS] ${scope}:`, error);
  return fallback;
}
