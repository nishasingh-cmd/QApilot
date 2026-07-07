import crypto from "crypto";
import AiCache from "../../models/AiCache.js";
import { generateOpenAIResponse } from "./openaiProvider.js";
import { generateGeminiResponse } from "./geminiProvider.js";
import { generateClaudeResponse } from "./claudeProvider.js";
import { generateMockResponse } from "./mockProvider.js";

// Rate limiting state helper
const lastRequestTime = { value: 0 };

/**
 * Core AI abstraction entry point. Performs caching, throttling, and provider execution.
 */
export const generateAIResponse = async (prompt) => {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  
  // 1. Check Cache
  const hashKey = crypto.createHash("sha256").update(prompt).digest("hex");
  const cached = await AiCache.findOne({ key: hashKey });
  if (cached) {
    console.log(`[AI Caching] Cache Hit! Reusing response for key: ${hashKey}`);
    return cached.response;
  }
  
  // 2. Throttling: Throttle calls to maximum 1 per second to prevent rate limit limits
  const now = Date.now();
  const timeDiff = now - lastRequestTime.value;
  if (timeDiff < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeDiff));
  }
  lastRequestTime.value = Date.now();

  let responseText = "";
  try {
    if (provider === "openai") {
      responseText = await generateOpenAIResponse(prompt);
    } else if (provider === "gemini") {
      responseText = await generateGeminiResponse(prompt);
    } else if (provider === "claude") {
      responseText = await generateClaudeResponse(prompt);
    } else {
      responseText = await generateMockResponse(prompt);
    }
  } catch (err) {
    console.warn(`[AI Engine] Active provider '${provider}' execution failed: ${err.message}. Graceful fallback to Mock response.`);
    responseText = await generateMockResponse(prompt);
  }

  // 3. Persist in cache
  try {
    await AiCache.create({
      key: hashKey,
      response: responseText,
      provider,
      model: "default",
      tokensUsed: 0
    });
  } catch (cacheErr) {
    // Ignore concurrency conflicts
  }

  return responseText;
};

export default { generateAIResponse };
