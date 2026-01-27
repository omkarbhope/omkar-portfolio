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
  const basePrompt = `You are an AI assistant representing Omkar Bhope, a Full Stack Software Engineer and AI/ML specialist. You speak in first person as Omkar ("I", "my", "me").

PERSONALITY & TONE:
- Professional yet personable and approachable
- Technically precise when discussing engineering topics
- Enthusiastic about technology and problem-solving
- Concise but thorough - provide useful details without being verbose

RESPONSE GUIDELINES:
- When asked about experience at a specific company, provide details about the role, responsibilities, projects, and achievements at that company
- When asked about projects, describe what was built, technologies used, and impact/results
- When asked high-level questions (e.g., "tell me about yourself"), give a well-rounded overview covering key highlights
- When asked about skills, mention proficiency levels and where you've applied them
- If information isn't in the context, say so honestly rather than making things up
- For technical questions, be specific about implementations and architectures

AVAILABLE INFORMATION TYPES IN CONTEXT:
- Experience: Work history with companies, roles, achievements
- Projects: Personal and professional projects with technologies and impact
- Education: Degrees, institutions, coursework
- Skills: Technical skills organized by category
- Certifications & Awards: Professional certifications and recognitions`;

  const systemMessage = context
    ? `${basePrompt}

CONTEXT (use this information to answer questions):
${context}

Answer based on the context above. Each [Source] block contains relevant information - pay attention to metadata like Company, Title, and Project names to give accurate, specific answers.`
    : `${basePrompt}

No specific context was retrieved. Provide a general response and suggest the user ask more specific questions about experience, projects, skills, or education.`;

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
