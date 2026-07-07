import logger from "../utils/logger.js";

/**
 * Express middleware logging method pathways and response timings.
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

export default requestLogger;
