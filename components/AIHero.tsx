'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowDown, Bot, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Avatar3D, { AvatarState } from './Avatar3D';
import AnimatedBackground from './AnimatedBackground';
import type { Skill } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "What's your experience with AI/ML?",
  "Tell me about your biggest project",
  "What technologies do you specialize in?",
];

interface AIHeroProps {
  skills?: Skill[];
}

export default function AIHero({ skills = [] }: AIHeroProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine avatar state based on chat activity
  const getAvatarState = (): AvatarState => {
    if (loading) return 'talking';
    if (inputFocused || input.length > 0) return 'waiting';
    return 'idle';
  };

  // Auto-scroll chat messages to bottom
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
      const updateInterval = 50;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        const now = Date.now();
        if (now - lastUpdate > updateInterval) {
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
          lastUpdate = now;
        }
      }
      
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
    <div className="relative min-h-screen flex flex-col bg-[var(--background)]">
      {/* Animated Background */}
      <AnimatedBackground skills={skills} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-40">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            // Initial State - Welcome with Avatar
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <Avatar3D state={getAvatarState()} />
              </motion.div>

              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              >
                <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">AI-Powered Portfolio</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-tight"
              >
                Talk to{' '}
                <span className="relative inline-block">
                  <span className="gradient-text">Omkar</span>
                  <motion.span
                    className="absolute -inset-2 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 blur-2xl rounded-lg"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
              >
                I&apos;m an AI version of Omkar Bhope. Ask me anything about his work, 
                experience, skills, or how he can help your team.
              </motion.p>

              {/* Suggested Questions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex flex-wrap justify-center gap-3"
              >
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-4 py-2.5 rounded-full soft-card text-[var(--text-secondary)] text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
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

              {/* Input Field with Avatar interaction */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-10 w-full max-w-2xl mx-auto"
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-0 blur-sm transition-opacity"
                    animate={{ opacity: inputFocused ? 0.3 : 0 }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask me anything..."
                    className="relative w-full px-6 py-4 pr-14 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] text-lg transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 hover:shadow-lg"
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
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]"
                >
                  <span className="text-xs font-medium">Scroll to explore</span>
                  <ArrowDown className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            // Chat State - Conversation View with Avatar
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]"
            >
              {/* Avatar Side Panel - Desktop */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:flex flex-col items-center justify-start pt-8"
              >
                <Avatar3D state={getAvatarState()} />
                <motion.p
                  className="mt-4 text-sm text-[var(--text-tertiary)] text-center max-w-[160px]"
                  animate={{ opacity: loading ? 1 : 0.7 }}
                >
                  {loading ? "I'm thinking about your question..." : "Ask me anything!"}
                </motion.p>
              </motion.div>

              {/* Chat Panel */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 mb-4"
                >
                  {/* Avatar - Mobile */}
                  <div className="lg:hidden">
                    <Avatar3D state={getAvatarState()} className="scale-75" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                      Chatting with <span className="gradient-text">Omkar AI</span>
                    </h2>
                    <p className="text-[var(--text-tertiary)] text-sm">Ask about experience, projects, or skills</p>
                  </div>
                </motion.div>

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl glass-card"
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
                                : 'bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]'
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
                        <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                            <span className="text-sm text-[var(--text-tertiary)]">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-0 blur-sm"
                      animate={{ opacity: inputFocused ? 0.2 : 0 }}
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder="Type your message..."
                      disabled={loading}
                      className="relative w-full px-6 py-4 pr-14 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] text-base transition-all disabled:opacity-50"
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
                  {['Projects', 'Experience', 'Skills', 'Contact'].map((label) => (
                    <Link
                      key={label}
                      href={`/${label.toLowerCase()}`}
                      className="px-3 py-1.5 rounded-full text-xs text-[var(--text-tertiary)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
