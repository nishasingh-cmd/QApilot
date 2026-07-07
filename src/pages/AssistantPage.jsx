import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Trash2, HelpCircle, Loader2, User, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

// Suggested Prompts sub-component
function SuggestedPrompts({ onSelect }) {
  const PROMPTS = [
    "Explaineval dynamic execution vulnerability",
    "How do I fix unsanitized query parameters?",
    "Summarize the latest quality scan reports",
    "Suggest a priority action plan to fix critical bugs"
  ];

  return (
    <div className="space-y-2 mt-4">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-text-secondary block">Suggested Topics</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.05] hover:border-brand-blue/30 text-xs font-medium text-brand-text-secondary hover:text-white transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AssistantPage() {
  const { addToast } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch chat history on load
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assistant/history', { withCredentials: true });
      if (res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // 2. Submit user message
  const handleSend = async (textToSend) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim()) return;

    setInput('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/assistant/chat',
        { message: messageContent },
        { withCredentials: true }
      );
      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
      addToast('Dispatch Failure', 'error', 'AI Assistant was unable to process message.');
    } finally {
      setSending(false);
    }
  };

  // 3. Clear logs
  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear conversation history?")) return;
    setClearing(true);
    try {
      await axios.delete('http://localhost:5000/api/assistant/history', { withCredentials: true });
      setMessages([]);
      addToast('History Cleared', 'info', 'Assistant conversation history successfully flushed.');
    } catch (err) {
      console.error(err);
      addToast('Flush Failed', 'error', 'Unable to delete chat history logs.');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Connecting to AI intelligence engine...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-[1200px] mx-auto font-sans relative select-none">
      {/* Top Banner Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.08] shrink-0">
        <div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Engineering</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">AI Assistant</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            QAPilot Copilot
            <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
          </h1>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs font-bold hover:bg-brand-danger/15 transition-all cursor-pointer"
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Clear Conversation
          </button>
        )}
      </div>

      {/* Main chat layout */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 max-w-lg mx-auto text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Ask anything about your code quality</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Connect your workspace repositories to debug complex security issues, audit scan logs, review code style patterns, and ask questions.
              </p>
            </div>

            <SuggestedPrompts onSelect={handleSend} />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar wrapper */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md ${
                      isUser
                        ? 'bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan'
                        : 'bg-brand-blue/20 border border-brand-blue/30 text-brand-blue'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4 text-brand-cyan" /> : <Bot className="w-4 h-4 text-brand-blue" />}
                  </div>

                  {/* Message body block */}
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-brand-blue text-white rounded-tr-none'
                        : 'glass-card border border-white/[0.08] text-brand-text-primary rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex items-start gap-3 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue shrink-0">
                  <Bot className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="glass-card border border-white/[0.08] p-4 rounded-2xl rounded-tl-none text-xs text-brand-text-secondary flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-brand-blue animate-spin" />
                  QAPilot is reviewing your repository codebase...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat input form container */}
      <div className="pt-4 border-t border-white/[0.08] bg-brand-bg shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] focus-within:border-brand-blue/50 rounded-2xl p-2 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            placeholder="Type your question regarding repositories and vulnerability issues..."
            className="flex-1 bg-transparent text-white text-xs px-3 focus:outline-none placeholder-brand-text-muted"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="w-8 h-8 rounded-xl bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssistantPage;
