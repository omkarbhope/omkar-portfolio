'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import Button from './ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Omkar's AI assistant. Ask me anything about Omkar's background, projects, experience, or skills!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What's Omkar's experience?",
    "Tell me about his projects",
    "What technologies does he use?",
  ];

  return (
    <motion.div 
      className="flex min-h-[400px] h-[min(600px,70vh)] flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            animate={{ 
              boxShadow: ['0 0 0 0 var(--primary-glow)', '0 0 0 8px transparent'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-2">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--neon-green)] border-2 border-[var(--background)]" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">AI Assistant</h3>
            <p className="text-xs text-[var(--text-tertiary)]">Ask me about Omkar</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                className={`max-w-[80%] rounded-2xl px-4 py-3 flex items-start gap-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white'
                    : 'bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 p-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
                    </div>
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 mt-0.5">
                    <User className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl bg-[var(--background-secondary)] px-4 py-3 border border-[var(--border)]">
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex space-x-1"
                  initial="hidden"
                  animate="visible"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
                <span className="text-xs text-[var(--text-tertiary)]">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <motion.div 
          className="px-4 pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-[var(--text-tertiary)] mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <motion.button
                key={question}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1.5 rounded-full bg-[var(--background-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-4">
        <motion.div 
          className={`flex gap-2 rounded-xl border bg-[var(--background-secondary)] p-1 transition-all ${
            isFocused 
              ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' 
              : 'border-[var(--border)]'
          }`}
          animate={{
            boxShadow: isFocused ? 'var(--shadow-neon)' : 'none',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
