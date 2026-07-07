import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly"
    },
    status: {
      type: String,
      enum: ["active", "trialing", "cancelled", "expired"],
      default: "trialing"
    },
    renewalDate: {
      type: Date,
      required: true
    },
    trialEndsAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    }
  },
  { timestamps: true }
);

subscriptionSchema.index({ organizationId: 1 });

export default mongoose.model("Subscription", subscriptionSchema);
