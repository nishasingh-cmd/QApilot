import Invoice from "../models/Invoice.js";
import { ensureSubscriptionAndUsage } from "../middleware/limitMiddleware.js";

/**
 * Fetch invoice history for organization.
 */
export const getInvoices = async (req, res) => {
  try {
    const { sub } = await ensureSubscriptionAndUsage(req.user._id);
    const list = await Invoice.find({ subscriptionId: sub._id }).sort({ issuedAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single invoice.
 */
export const getInvoiceById = async (req, res) => {
  try {
    const doc = await Invoice.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Invoice not found." });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getInvoices,
  getInvoiceById
};
