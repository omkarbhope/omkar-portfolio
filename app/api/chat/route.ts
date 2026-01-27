import { NextResponse } from 'next/server';
import { searchSimilarContent } from '@/lib/embeddings';
import { generateChatCompletion } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Search for relevant content
    const relevantContent = await searchSimilarContent(message, 5);
    
    console.log(`Found ${relevantContent.length} relevant content chunks for query: "${message}"`);
    if (relevantContent.length > 0) {
      console.log('Content preview:', relevantContent.map(c => c.content.substring(0, 100)).join(' | '));
    }

    // Build context from relevant content
    const context = relevantContent
      .map((item) => item.content)
      .join('\n\n');
    
    if (!context) {
      console.warn('No context found from embeddings - chat will use general knowledge only');
    }

    // Build conversation history
    const conversationHistory = (history || [])
      .slice(-6) // Keep last 6 messages for context
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

    // Generate response with streaming
    const stream = await generateChatCompletion(
      [
        ...conversationHistory,
        { role: 'user', content: message },
      ],
      context
    );

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
