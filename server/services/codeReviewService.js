import CodeReview from "../models/CodeReview.js";
import Repository from "../models/Repository.js";
import RepositoryFile from "../models/RepositoryFile.js";
import { buildReviewPrompt } from "./reviewPromptBuilder.js";
import { calculateReviewScores } from "./reviewScoringService.js";
import { generateAIResponse } from "./ai/aiProvider.js";
import { createNotification } from "./notificationService.js";
import { dispatchJob } from "./jobDispatcher.js";

/**
 * Creates and queues a new code review request.
 */
export const createReview = async (userId, { repositoryId, fileId, scanId, reviewType = "full" }) => {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();

  const review = await CodeReview.create({
    userId,
    repositoryId,
    fileId,
    scanId: scanId || null,
    reviewType,
    provider,
    status: "queued"
  });

  // Dispatch background worker task
  await dispatchJob("codeReview", "run-code-review", {
    userId,
    reviewId: review._id
  });

  return review;
};

/**
 * Runs the code review process. Invoked by BullMQ worker.
 */
export const executeReview = async (reviewId, updateProgress) => {
  const review = await CodeReview.findById(reviewId);
  if (!review) throw new Error("CodeReview record not found");

  const repo = await Repository.findById(review.repositoryId);
  if (!repo) throw new Error("Repository not found");

  const file = await RepositoryFile.findById(review.fileId);
  if (!file) throw new Error("File not found");

  // 1. Mark as running
  review.status = "running";
  await review.save();
  if (updateProgress) await updateProgress(10);

  // 2. Notify that review has started
  await createNotification(review.userId, {
    type: "review_started",
    title: "AI Code Review Started",
    message: `AI code review has started for file '${file.path}' inside repository '${repo.name}'.`,
    repository: repo.name,
    severity: "info",
    metadata: { reviewId: review._id }
  });

  if (updateProgress) await updateProgress(20);

  try {
    // 3. Retrieve code contents
    const codeContent = file.content || "";
    if (updateProgress) await updateProgress(30);

    // 4. Build prompt
    const prompt = buildReviewPrompt(file.name, file.path, file.language, codeContent);
    if (updateProgress) await updateProgress(45);

    // 5. Call AI API
    const aiResponseText = await generateAIResponse(prompt);
    if (updateProgress) await updateProgress(70);

    // 6. Clean and parse JSON response
    let rawJsonText = aiResponseText.trim();
    
    // Strip markdown code block wraps if LLM wrapper was included
    if (rawJsonText.startsWith("```")) {
      const match = rawJsonText.match(/^(?:```(?:json)?\n?)([\s\S]*?)(?:\n?```)$/);
      if (match && match[1]) {
        rawJsonText = match[1].trim();
      }
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawJsonText);
    } catch (parseErr) {
      console.error("[CodeReview Service] Failed to parse raw AI JSON response text:", rawJsonText);
      throw new Error(`AI model response was not valid JSON: ${parseErr.message}`);
    }

    // 7. Calculate and normalize scores using reviewScoringService
    const scoresInput = {
      overallScore: parsedResult.overallScore,
      securityScore: parsedResult.securityScore,
      performanceScore: parsedResult.performanceScore,
      maintainabilityScore: parsedResult.maintainabilityScore,
      readabilityScore: parsedResult.readabilityScore
    };
    const finalScores = calculateReviewScores(parsedResult.comments, scoresInput);

    // 8. Populate comments, summary, scores, status
    review.summary = parsedResult.summary || "No review summary provided.";
    review.overallScore = finalScores.overallScore;
    review.securityScore = finalScores.securityScore;
    review.performanceScore = finalScores.performanceScore;
    review.maintainabilityScore = finalScores.maintainabilityScore;
    review.readabilityScore = finalScores.readabilityScore;
    
    // Validate comments structure
    review.comments = (parsedResult.comments || []).map(comment => ({
      line: isNaN(comment.line) ? 1 : Math.max(1, parseInt(comment.line)),
      severity: ["info", "warning", "critical"].includes(comment.severity) ? comment.severity : "info",
      category: comment.category || "quality",
      title: comment.title || "AI Comment",
      description: comment.description || "",
      recommendation: comment.recommendation || "",
      suggestedCode: comment.suggestedCode || "",
      confidence: ["low", "medium", "high"].includes(comment.confidence) ? comment.confidence : "medium"
    }));

    review.status = "completed";
    review.error = "";
    await review.save();

    if (updateProgress) await updateProgress(90);

    // 9. Send success notification
    await createNotification(review.userId, {
      type: "review_completed",
      title: "AI Code Review Completed",
      message: `AI code review successfully finished for file '${file.name}' with Overall Score: ${review.overallScore}%.`,
      repository: repo.name,
      severity: "success",
      metadata: { reviewId: review._id }
    });

    // 10. Check and notify for critical security findings
    const criticalSecurityComments = review.comments.filter(
      c => c.severity === "critical" && c.category === "security"
    );

    if (criticalSecurityComments.length > 0) {
      await createNotification(review.userId, {
        type: "critical_finding",
        title: "Critical Security Issue Detected",
        message: `Critical security issue found in '${file.name}' during code review. Immediate review suggested.`,
        repository: repo.name,
        severity: "critical",
        metadata: { reviewId: review._id }
      });
    }

    if (updateProgress) await updateProgress(100);
    return review;

  } catch (error) {
    console.error("[CodeReview Service] Execution failed:", error);
    review.status = "failed";
    review.error = error.message;
    await review.save();

    // Send failure notification
    await createNotification(review.userId, {
      type: "review_failed",
      title: "AI Code Review Failed",
      message: `AI code review failed for file '${file.name}': ${error.message}`,
      repository: repo.name,
      severity: "warning",
      metadata: { reviewId: review._id }
    });

    throw error;
  }
};

export default { createReview, executeReview };
