import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const reportQueue = connection ? new Queue("report", { connection }) : null;
export default reportQueue;
