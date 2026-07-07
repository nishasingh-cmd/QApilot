import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true
    },
    provider: {
      type: String,
      default: "simulated"
    },
    providerPaymentId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["succeeded", "failed"],
      default: "succeeded"
    },
    receiptUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

paymentSchema.index({ invoiceId: 1 });

export default mongoose.model("Payment", paymentSchema);
