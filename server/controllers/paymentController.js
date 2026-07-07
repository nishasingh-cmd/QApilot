import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

/**
 * Fetch list of payments.
 */
export const getPayments = async (req, res) => {
  try {
    const list = await Payment.find({}).populate("invoiceId").sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new payment.
 */
export const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount } = req.body;
    if (!invoiceId || !amount) {
      return res.status(400).json({ message: "InvoiceId and amount are required." });
    }

    const paymentId = `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const doc = await Payment.create({
      invoiceId,
      provider: "simulated",
      providerPaymentId: paymentId,
      amount,
      status: "succeeded",
      receiptUrl: `https://qapilot.app/receipts/${paymentId}`
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPayments,
  createPayment
};
