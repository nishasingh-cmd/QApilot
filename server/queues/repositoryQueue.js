import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const repositoryQueue = connection ? new Queue("repository", { connection }) : null;
export default repositoryQueue;
