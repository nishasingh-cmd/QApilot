import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const notificationQueue = connection ? new Queue("notification", { connection }) : null;
export default notificationQueue;
