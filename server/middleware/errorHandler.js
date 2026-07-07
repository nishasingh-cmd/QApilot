import ApiError from "../utils/ApiError.js";

/**
 * Global centralized express error response formatter.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. If not standard ApiError instance, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal server error execution conflict.";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // 2. Format output response JSON
  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
  };

  console.error(`[Error Handler] HTTP ${error.statusCode} - ${error.message}`);
  
  res.status(error.statusCode).json(response);
};

export default errorHandler;
