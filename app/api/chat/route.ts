import { NextResponse } from 'next/server';
import { searchSimilarContent } from '@/lib/embeddings';
import { generateChatCompletion } from '@/lib/openai';
import { getDatabase } from '@/lib/mongodb';

// Detect query intent to do smarter retrieval
function detectQueryIntent(message: string): {
  types: string[];
  keywords: string[];
  isHighLevel: boolean;
} {
  const messageLower = message.toLowerCase();
  
  const types: string[] = [];
  const keywords: string[] = [];
  let isHighLevel = false;
  
  // Detect content type hints
  if (messageLower.includes('experience') || messageLower.includes('work') || messageLower.includes('job') || messageLower.includes('company')) {
    types.push('experience');
  }
  if (messageLower.includes('project') || messageLower.includes('built') || messageLower.includes('created') || messageLower.includes('developed')) {
    types.push('project');
  }
  if (messageLower.includes('skill') || messageLower.includes('technolog') || messageLower.includes('stack') || messageLower.includes('language')) {
    types.push('skill');
  }
  if (messageLower.includes('education') || messageLower.includes('degree') || messageLower.includes('university') || messageLower.includes('college')) {
    types.push('education');
  }
  if (messageLower.includes('certif') || messageLower.includes('license')) {
    types.push('license');
  }
  if (messageLower.includes('award') || messageLower.includes('achievement') || messageLower.includes('recognition')) {
    types.push('award');
  }
  
  // Detect company/org names
  const companyPatterns = ['etched', 'ucsd', 'uc san diego', 'pict', 'persistent', 'dassault'];
  for (const pattern of companyPatterns) {
    if (messageLower.includes(pattern)) {
      keywords.push(pattern);
    }
  }
  
  // Detect high-level questions
  if (
    messageLower.includes('tell me about') ||
    messageLower.includes('what do you') ||
    messageLower.includes('what are your') ||
    messageLower.includes('overview') ||
    messageLower.includes('summary') ||
    messageLower.includes('all') ||
    messageLower.includes('featured') ||
    messageLower.includes('main') ||
    messageLower.includes('best')
  ) {
    isHighLevel = true;
  }
  
  return { types, keywords, isHighLevel };
}

// Format context with metadata for better AI understanding
function formatContextWithMetadata(
  results: Array<{ content: string; metadata: Record<string, any>; score: number }>
): string {
  if (results.length === 0) return '';
  
  return results.map((item, index) => {
    const meta = item.metadata || {};
    let header = `[Source ${index + 1}]`;
    
    // Add useful metadata to header
    if (meta.company) header += ` Company: ${meta.company}`;
    if (meta.position) header += ` | Role: ${meta.position}`;
    if (meta.title) header += ` | Title: ${meta.title}`;
    if (meta.projectName) header += ` | Project: ${meta.projectName}`;
    if (meta.skillCategory) header += ` | Category: ${meta.skillCategory}`;
    if (meta.institution) header += ` | Institution: ${meta.institution}`;
    if (meta.type) header += ` | Type: ${meta.type}`;
    
    return `${header}\n${item.content}`;
  }).join('\n\n---\n\n');
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Analyze query intent
    const intent = detectQueryIntent(message);
    const messageLower = message.toLowerCase();
    console.log(`[Chat] Query intent:`, intent);

    // Gather context from multiple sources for better coverage
    let allResults: Array<{ content: string; metadata: Record<string, any>; score: number }> = [];
    
    // Main semantic search
    const semanticResults = await searchSimilarContent(message, 8);
    allResults.push(...semanticResults);
    
    // If high-level question or specific type detected, do additional targeted searches
    if (intent.isHighLevel || intent.types.length > 0) {
      // Fetch structured data directly from database for high-level queries
      const db = await getDatabase();
      
      if (intent.types.includes('experience') || intent.keywords.length > 0) {
        const experiences = await db.collection('experiences').find({}).toArray();
        for (const exp of experiences) {
          // Check if this experience matches any keywords
          const expText = `${exp.company} ${exp.position} ${(exp.projects || []).map((p: any) => p.name + ' ' + p.description).join(' ')}`.toLowerCase();
          const isRelevant = intent.keywords.length === 0 || intent.keywords.some(k => expText.includes(k));
          
          if (isRelevant) {
            // Format experience with all projects
            const projectDetails = (exp.projects || []).map((p: any) => {
              const metrics = p.metrics ? Object.entries(p.metrics).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
              return `- ${p.name}: ${p.description}${metrics ? ` (Metrics: ${metrics})` : ''} Technologies: ${(p.technologies || []).join(', ')}`;
            }).join('\n');
            
            const content = `Experience at ${exp.company}:
Role: ${exp.position}
Location: ${exp.location}
Period: ${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} to ${exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
Technologies used: ${(exp.technologies || []).join(', ')}

Projects worked on at ${exp.company}:
${projectDetails}`;
            
            allResults.push({
              content,
              metadata: { company: exp.company, position: exp.position, type: 'experience' },
              score: 0.95 // Higher score for direct DB matches
            });
          }
        }
      }
      
      if (intent.types.includes('project') || intent.isHighLevel) {
        // Check if user wants all projects or just featured
        const wantsAllProjects = messageLower.includes('all') || 
                                  messageLower.includes('personal') || 
                                  messageLower.includes('list') ||
                                  messageLower.includes('show me');
        
        const projectQuery = wantsAllProjects ? {} : { featured: true };
        const projectLimit = wantsAllProjects ? 20 : 5;
        
        const projects = await db.collection('projects').find(projectQuery).limit(projectLimit).toArray();
        
        // If asking for all, create a summary list first
        if (wantsAllProjects && projects.length > 0) {
          const projectList = projects.map((p: any) => `- ${p.title}${p.featured ? ' (Featured)' : ''}`).join('\n');
          allResults.push({
            content: `All Personal Projects (${projects.length} total):\n${projectList}`,
            metadata: { type: 'project-list' },
            score: 0.98
          });
        }
        
        for (const proj of projects) {
          const metrics = proj.metrics ? Object.entries(proj.metrics).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
          const achievements = (proj.achievements || []).join('; ');
          
          allResults.push({
            content: `Project: ${proj.title}${proj.featured ? ' (Featured)' : ''}
Description: ${proj.description || ''}
Tech Stack: ${(proj.techStack || []).join(', ')}
${achievements ? `Achievements: ${achievements}` : ''}
${metrics ? `Metrics: ${metrics}` : ''}
${proj.demoUrl ? `Demo: ${proj.demoUrl}` : ''}
${proj.githubUrl ? `GitHub: ${proj.githubUrl}` : ''}`,
            metadata: { projectName: proj.title, type: 'project', featured: proj.featured },
            score: proj.featured ? 0.9 : 0.85
          });
        }
      }
      
      if (intent.types.includes('education')) {
        const education = await db.collection('education').find({}).toArray();
        for (const edu of education) {
          const gpaStr = edu.gpa ? `GPA: ${edu.gpa}${edu.gpaScale ? `/${edu.gpaScale}` : ''}` : '';
          const courses = (edu.courses || []).length > 0 ? `Relevant Courses: ${edu.courses.join(', ')}` : '';
          const honors = (edu.honors || []).length > 0 ? `Honors: ${edu.honors.join(', ')}` : '';
          
          allResults.push({
            content: `Education: ${edu.degree} in ${edu.field} at ${edu.institution}
Location: ${edu.location}
Period: ${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} to ${edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
${gpaStr}
${courses}
${honors}`,
            metadata: { institution: edu.institution, degree: edu.degree, type: 'education' },
            score: 0.85
          });
        }
      }
      
      if (intent.types.includes('skill')) {
        const skills = await db.collection('skills').find({}).toArray();
        const skillsByCategory: Record<string, string[]> = {};
        for (const skill of skills) {
          const cat = skill.category || 'Other';
          if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
          skillsByCategory[cat].push(skill.name);
        }
        for (const [category, skillList] of Object.entries(skillsByCategory)) {
          allResults.push({
            content: `Skills in ${category}: ${skillList.join(', ')}`,
            metadata: { skillCategory: category, type: 'skill' },
            score: 0.8
          });
        }
      }
    }
    
    // Deduplicate by content similarity (simple approach: exact match)
    const seen = new Set<string>();
    const uniqueResults = allResults.filter(r => {
      const key = r.content.substring(0, 200);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by score and take top results
    uniqueResults.sort((a, b) => b.score - a.score);
    const topResults = uniqueResults.slice(0, 12);
    
    console.log(`[Chat] Found ${topResults.length} relevant content chunks`);

    // Format context with metadata
    const context = formatContextWithMetadata(topResults);
    
    if (!context) {
      console.warn('[Chat] No context found - using general knowledge only');
    }

    // Build conversation history
    const conversationHistory = (history || [])
      .slice(-6)
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
