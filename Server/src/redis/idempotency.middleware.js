const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  connectTimeout: 2000,
  maxRetriesPerRequest: 1
});

redis.on("error", (err) => console.warn("Redis (Idempotency) error:", err.message));

module.exports = async function idempotencyMiddleware(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers["idempotency-key"];
  
  if (!idempotencyKey) {
    return next();
  }

  const redisKey = `idemp:${idempotencyKey}`;

  try {
    const cachedResponse = await redis.get(redisKey);
    if (cachedResponse) {
      const { status, body } = JSON.parse(cachedResponse);
      res.setHeader("X-Cache-Lookup", "IDEMPOTENT_HIT");
      return res.status(status).json(body);
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis.set(
          redisKey,
          JSON.stringify({ status: res.statusCode, body }),
          "EX",
          86400
        ).catch((e) => console.warn("Failed to cache idempotent key:", e.message));
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.warn("Idempotency Redis error, continuing without cache:", err.message);
    next();
  }
};