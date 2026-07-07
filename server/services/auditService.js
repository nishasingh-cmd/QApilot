import AuditLog from "../models/AuditLog.js";

/**
 * Persist an administrative audit log.
 */
export const logAudit = async (userId, action, target, req = null) => {
  try {
    let ipAddress = "127.0.0.1";
    if (req) {
      ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      if (ipAddress.includes("::ffff:")) {
        ipAddress = ipAddress.replace("::ffff:", "");
      }
    }

    await AuditLog.create({
      userId,
      action,
      target,
      ipAddress
    });
  } catch (err) {
    console.error("Failed to write administrative audit log:", err.message);
  }
};

export default { logAudit };
