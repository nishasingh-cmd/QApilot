/**
 * Generates chat assistant conversation prompts with memory history.
 */
export const generateAssistantChatPrompt = (chatHistory, newQuestion) => {
  const historyText = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  return `You are QAPilot, an intelligent AI DevSecOps assistant. You have deep knowledge of repository code syncs, static scanning rules, security findings, quality reports, and PDF audits. Answer user queries, explain finding logs, suggest codebase refactoring, and recommend remediation steps.

Be technical, precise, concise, and structured. Use Markdown formatting.

Conversation History:
${historyText}

User: ${newQuestion}
Assistant:`;
};

export default generateAssistantChatPrompt;
