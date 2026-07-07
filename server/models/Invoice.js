import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "USD"
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending"
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

invoiceSchema.index({ subscriptionId: 1 });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);
