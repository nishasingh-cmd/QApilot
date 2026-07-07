import AuditLog from "../models/AuditLog.js";

/**
 * Fetch recent workspace administrative audits.
 */
export const getAuditLogs = async (req, res) => {
  try {
    const list = await AuditLog.find({})
      .populate("userId")
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAuditLogs };
