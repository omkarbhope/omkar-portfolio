'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowDown, Bot, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "What's your experience with AI/ML?",
  "Tell me about your biggest project",
  "What technologies do you specialize in?",
  "How can you help my company?",
];

export default function AIHero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat messages to bottom (within the chat container only, not the page)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setHasStarted(true);
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let assistantMessage = '';
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      let lastUpdate = 0;
      const updateInterval = 50; // Throttle updates to every 50ms

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        // Throttle updates to prevent scroll locking
        const now = Date.now();
        if (now - lastUpdate > updateInterval) {
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
          lastUpdate = now;
        }
      }
      
      // Final update to ensure all content is shown
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)] opacity-10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--accent)] opacity-10 blur-[150px] rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            // Initial State - Big Bold Welcome
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-8"
              >
                <div className="relative">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-[var(--primary)]">AI-Powered Portfolio</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight"
              >
                Talk to{' '}
                <span className="relative">
                  <span className="gradient-text">Omkar</span>
                  <motion.span
                    className="absolute -inset-2 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 blur-2xl"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto"
              >
                I&apos;m an AI version of Omkar Bhope. Ask me anything about his work, 
                experience, skills, or how he can help your team.
              </motion.p>

              {/* Suggested Questions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-wrap justify-center gap-3"
              >
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-4 py-2.5 rounded-full border border-gray-700 bg-gray-900/50 text-gray-300 text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </motion.div>

              {/* Input Field */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-12 w-full max-w-2xl mx-auto"
              >
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full px-6 py-4 pr-14 rounded-2xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-lg backdrop-blur-sm transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </motion.form>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2 text-gray-500"
                >
                  <span className="text-xs">Scroll to explore</span>
                  <ArrowDown className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            // Chat State - Conversation View
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-200px)]"
            >
              {/* Chat Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Chatting with <span className="gradient-text">Omkar AI</span>
                </h2>
                <p className="text-gray-500 mt-1">Ask about experience, projects, or skills</p>
              </motion.div>

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto space-y-4 px-4 py-6 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm"
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[85%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-[var(--primary)]'
                              : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-gray-800 text-gray-100 border border-gray-700'
                          }`}
                        >
                          <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                        </div>
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                          <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="w-full px-6 py-4 pr-14 rounded-2xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-base backdrop-blur-sm transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['View Projects', 'Experience', 'Skills', 'Contact'].map((label) => (
                  <Link
                    key={label}
                    href={`/${label.toLowerCase().replace(' ', '-')}`}
                    className="px-3 py-1.5 rounded-full text-xs text-gray-400 border border-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
