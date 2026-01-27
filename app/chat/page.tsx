'use client';

import ChatBot from '@/components/ChatBot';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Chat with Omkar</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Ask me anything about my background, projects, experience, or skills. I'm powered by AI and trained on my portfolio data.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ChatBot />
      </ScrollReveal>
    </div>
  );
}
