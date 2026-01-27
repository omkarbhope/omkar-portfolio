'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-h-[400px] h-[min(600px,70vh)] flex-col rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 flex items-start gap-2 ${
                  message.role === 'user'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}
              >
                {message.role === 'assistant' && (
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
                )}
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-lg bg-[var(--background-secondary)] px-4 py-2 border border-[var(--border)]">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-[var(--primary)]"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50 transition-colors"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
