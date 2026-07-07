// Simple in-memory sliding window rate limiting
const rateLimitCache = new Map();

/**
 * Basic memory token rate limiter. Limits clients to max 150 API requests per minute.
 */
export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();

  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, []);
  }

  const windowTimestamps = rateLimitCache.get(ip).filter((timestamp) => now - timestamp < 60000);

  if (windowTimestamps.length >= 150) {
    return res.status(429).json({
      message: "Too many requests from this IP. Please slow down and try again after one minute."
    });
  }

  windowTimestamps.push(now);
  rateLimitCache.set(ip, windowTimestamps);
  next();
};

/**
 * Strip prefix '$' properties recursively to prevent Mongo query injections.
 */
export const nosqlSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key.startsWith("$")) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

/**
 * Configure secure production HTTP headers.
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};

export default {
  rateLimiter,
  nosqlSanitize,
  securityHeaders
};
