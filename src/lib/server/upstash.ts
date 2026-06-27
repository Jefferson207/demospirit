type RedisCommand = Array<string | number>;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand<T>(command: RedisCommand): Promise<T> {
  if (!redisUrl || !redisToken) {
    throw new Error("Upstash Redis is not configured.");
  }

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([command]),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed with status ${response.status}.`);
  }

  const [payload] = (await response.json()) as Array<{ result?: T; error?: string }>;
  if (payload?.error) {
    throw new Error(payload.error);
  }

  return payload?.result as T;
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const result = await redisCommand<string | null>(["GET", key]);
  if (!result) return fallback;
  return JSON.parse(result) as T;
}

export async function setJson<T>(key: string, value: T) {
  await redisCommand<"OK">(["SET", key, JSON.stringify(value)]);
}
