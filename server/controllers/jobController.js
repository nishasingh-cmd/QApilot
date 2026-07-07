import Job from "../models/Job.js";
import { dispatchJob } from "../services/jobDispatcher.js";

/**
 * Get recent background jobs logs.
 */
export const getJobs = async (req, res) => {
  try {
    const list = await Job.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Resubmits a failed background job.
 */
export const retryJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobDoc = await Job.findOne({ jobId: id });

    if (!jobDoc) {
      return res.status(404).json({ message: "Job log not found" });
    }

    // Reset details on current job record
    jobDoc.status = "pending";
    jobDoc.progress = 0;
    jobDoc.failedReason = "";
    jobDoc.startedAt = null;
    jobDoc.completedAt = null;
    await jobDoc.save();

    // Re-dispatch using dispatcher
    await dispatchJob(jobDoc.queue, `retry-${jobDoc.queue}`, jobDoc.data || {});

    res.json({ success: true, message: "Job retry scheduled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getJobs,
  retryJob
};
