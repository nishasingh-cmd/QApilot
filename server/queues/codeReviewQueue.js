import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const codeReviewQueue = connection ? new Queue("codeReview", { connection }) : null;
export default codeReviewQueue;
