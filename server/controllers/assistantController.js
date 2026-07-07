import ChatMessage from "../models/ChatMessage.js";
import { generateAssistantChatPrompt } from "../prompts/assistantChat.js";
import { generateAIResponse } from "../services/ai/aiProvider.js";

/**
 * Send query message to the DevSecOps AI Assistant.
 */
export const chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    const userId = req.user._id;

    // 1. Fetch recent chat history for context
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(20);

    // 2. Generate prompt
    const prompt = generateAssistantChatPrompt(history, message);

    // 3. Request LLM completion
    const aiReply = await generateAIResponse(prompt);

    // 4. Save both user request and AI reply to db context
    await ChatMessage.create({
      userId,
      role: "user",
      content: message
    });

    const botMessage = await ChatMessage.create({
      userId,
      role: "assistant",
      content: aiReply
    });

    res.status(201).json(botMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Fetch chat message history for the user.
 */
export const getChatHistory = async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete and clear chat history for the user.
 */
export const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.json({ message: "Conversation history cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  chatAssistant,
  getChatHistory,
  clearChatHistory
};
