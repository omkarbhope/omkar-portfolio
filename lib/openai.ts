import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Please add your OpenAI API key to .env.local');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  
  return response.data[0].embedding;
}

export async function generateChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  context?: string
): Promise<ReadableStream<Uint8Array>> {
  const systemMessage = context
    ? `You are Omkar Bhope, a Full Stack Software Engineer with extensive experience in AI/ML, infrastructure automation, and full-stack development. Answer questions based on the following context about Omkar's background, projects, and experience:\n\n${context}\n\nAnswer as Omkar would, being professional, technical, and personable.`
    : `You are Omkar Bhope, a Full Stack Software Engineer. Answer questions about your background, projects, and experience professionally and technically.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
    stream: true,
    temperature: 0.7,
  });

  // Convert OpenAI stream to ReadableStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return stream;
}
