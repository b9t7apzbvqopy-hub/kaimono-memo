import path from "path";
import fs from "fs/promises";

export interface KVAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
}

class JsonFileAdapter implements KVAdapter {
  private filePath = path.join(process.cwd(), "data", "dev-store.json");
  private queue: Promise<void> = Promise.resolve();

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.queue.then(fn);
    this.queue = next.then(
      () => {},
      () => {}
    );
    return next;
  }

  private async readStore(): Promise<Record<string, unknown>> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private async writeStore(store: Record<string, unknown>): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(store, null, 2), "utf-8");
  }

  async get<T>(key: string): Promise<T | null> {
    return this.enqueue(async () => {
      const store = await this.readStore();
      return (store[key] as T) ?? null;
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    return this.enqueue(async () => {
      const store = await this.readStore();
      store[key] = value;
      await this.writeStore(store);
    });
  }

  async del(key: string): Promise<void> {
    return this.enqueue(async () => {
      const store = await this.readStore();
      delete store[key];
      await this.writeStore(store);
    });
  }
}

class UpstashAdapter implements KVAdapter {
  private redis: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown, opts?: { ex: number }): Promise<unknown>;
    del(key: string): Promise<unknown>;
  };

  constructor(url: string, token: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis");
    this.redis = new Redis({ url, token });
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    return (result as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, value, { ex: 7_776_000 });
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

let kvInstance: KVAdapter | null = null;

export function getKV(): KVAdapter {
  if (kvInstance) return kvInstance;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    kvInstance = new UpstashAdapter(
      process.env.KV_REST_API_URL,
      process.env.KV_REST_API_TOKEN
    );
  } else {
    kvInstance = new JsonFileAdapter();
  }

  return kvInstance;
}
