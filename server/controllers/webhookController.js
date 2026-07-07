import { verifyWebhookSignature, processWebhook } from "../services/webhookService.js";

/**
 * Handle incoming GitHub webhooks.
 */
export const handleGithubWebhook = async (req, res) => {
  try {
    // 1. Verify Hub Signature
    const isValid = verifyWebhookSignature(req);
    if (!isValid) {
      console.warn("Invalid webhook signature received.");
      return res.status(401).json({ message: "Invalid payload signature" });
    }

    // 2. Fetch Github Delivery ID and Event type
    const deliveryId = req.headers["x-github-delivery"];
    const githubEvent = req.headers["x-github-event"];

    if (!deliveryId || !githubEvent) {
      return res.status(400).json({ message: "Missing required webhook delivery headers" });
    }

    // 3. Process webhook asynchronously
    await processWebhook(githubEvent, deliveryId, req.body);

    // 4. Respond with 202 Accepted immediately
    res.status(202).json({
      status: "accepted",
      deliveryId,
      message: "Webhook event accepted and processing in the background"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { handleGithubWebhook };
