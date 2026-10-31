const DEFAULT_TTL_MS = 60_000;

export class TtlCache<K, V> {
  private readonly entries = new Map<K, { value: V; expiresAt: number }>();

  constructor(private readonly ttlMs: number = DEFAULT_TTL_MS) {}

  get(key: K): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): this {
    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    return this;
  }

  delete(key: K): boolean {
    return this.entries.delete(key);
  }
}

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
