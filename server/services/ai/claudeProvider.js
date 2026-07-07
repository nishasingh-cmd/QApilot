import axios from "axios";

/**
 * Invokes Anthropic Claude messages endpoint.
 */
export const generateClaudeResponse = async (prompt) => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing CLAUDE_API_KEY inside environment variables.");
  }

  const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";
  const url = "https://api.anthropic.com/v1/messages";

  const response = await axios.post(
    url,
    {
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      timeout: 20000
    }
  );

  const text = response.data.content?.[0]?.text;
  if (!text) {
    throw new Error("Anthropic Claude API returned an empty or invalid content response structure.");
  }

  const usage = response.data.usage;
  if (usage) {
    console.log(`[Claude Tracker] Model: ${model} | Input Tokens: ${usage.input_tokens} | Output Tokens: ${usage.output_tokens}`);
  }

  return text.trim();
};

export default { generateClaudeResponse };
