import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const scanQueue = connection ? new Queue("scan", { connection }) : null;
export default scanQueue;
