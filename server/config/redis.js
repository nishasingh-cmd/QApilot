import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let connection = null;
let isRedisAvailable = false;

try {
  // Configured with null maxRetriesPerRequest to satisfy BullMQ specifications
  connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 2000,
    showFriendlyErrorStack: true
  });
  
  connection.on("connect", () => {
    console.log("Redis connected successfully 🚀");
    isRedisAvailable = true;
  });
  
  connection.on("error", (err) => {
    // Graceful warning log fallback rather than throwing raw app crashing events
    console.warn("Redis server offline. Falling back to asynchronous in-memory execution.");
    isRedisAvailable = false;
  });
} catch (err) {
  console.warn("Unable to initialize Redis client:", err.message);
}

export { connection, isRedisAvailable };
export default connection;
