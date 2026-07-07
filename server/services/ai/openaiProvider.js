import axios from "axios";

/**
 * Invokes OpenAI chat completions endpoint.
 */
export const generateOpenAIResponse = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY inside environment variables.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const response = await axios.post(
    url,
    {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      timeout: 20000
    }
  );

  const usage = response.data.usage;
  if (usage) {
    console.log(`[OpenAI Cost Tracker] Model: ${model} | Prompt Tokens: ${usage.prompt_tokens} | Completion Tokens: ${usage.completion_tokens} | Total: ${usage.total_tokens}`);
  }

  return response.data.choices[0].message.content.trim();
};

export default { generateOpenAIResponse };
