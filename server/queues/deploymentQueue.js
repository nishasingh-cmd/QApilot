import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const deploymentQueue = connection ? new Queue("deployment", { connection }) : null;
export default deploymentQueue;
