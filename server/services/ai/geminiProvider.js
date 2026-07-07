import axios from "axios";

/**
 * Invokes Google Gemini generateContent endpoint.
 */
export const generateGeminiResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY inside environment variables.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2
      }
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );

  const candidate = response.data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API returned an empty or invalid content response structure.");
  }

  console.log(`[Gemini Tracker] Invoked model: ${model} successfully.`);
  return text.trim();
};

export default { generateGeminiResponse };
