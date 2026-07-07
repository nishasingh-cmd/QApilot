import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import Invoice from "../models/Invoice.js";
import { ensurePlans, ensureSubscriptionAndUsage } from "../middleware/limitMiddleware.js";
import { logAudit } from "../services/auditService.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Fetch available billing plans. Auto-seeds if empty.
 */
export const getPlans = async (req, res) => {
  try {
    await ensurePlans();
    const plansList = await Plan.find({});
    res.json(plansList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch active subscription for user.
 */
export const getSubscription = async (req, res) => {
  try {
    const { sub } = await ensureSubscriptionAndUsage(req.user._id);
    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upgrade or Downgrade subscription plan.
 */
export const changePlan = async (req, res) => {
  try {
    const { planId, billingCycle } = req.body;
    if (!planId) {
      return res.status(400).json({ message: "PlanId is required." });
    }

    const { sub, orgId } = await ensureSubscriptionAndUsage(req.user._id);
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    const originalPlanName = sub.planId?.name || "Free Trial";

    sub.planId = plan._id;
    sub.billingCycle = billingCycle || "monthly";
    sub.status = "active";
    sub.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await sub.save();

    // Auto-generate a paid invoice representing Stripe success
    const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    await Invoice.create({
      subscriptionId: sub._id,
      invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: price,
      currency: "USD",
      status: "paid",
      paidAt: new Date()
    });

    await logAudit(req.user._id, "CHANGE_PLAN", plan.name, req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Plan upgraded",
      message: `Your organization subscription was upgraded from ${originalPlanName} to ${plan.name}.`,
      severity: "success"
    });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel subscription renewal.
 */
export const cancelSubscription = async (req, res) => {
  try {
    const { sub } = await ensureSubscriptionAndUsage(req.user._id);
    sub.status = "cancelled";
    sub.cancelledAt = new Date();
    await sub.save();

    await logAudit(req.user._id, "CANCEL_SUBSCRIPTION", sub.planId?.name || "Plan", req);
    await createNotification(req.user._id, {
      type: "system_alert",
      title: "Plan downgraded",
      message: `Renewal cancelled. Your subscription will remain active until renewal slot date.`,
      severity: "warn"
    });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPlans,
  getSubscription,
  changePlan,
  cancelSubscription
};
