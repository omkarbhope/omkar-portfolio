import { getDatabase } from './mongodb';
import { generateEmbedding } from './openai';
import type { Embedding } from '@/types';

const CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

export function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;

  // Ensure overlap is less than chunkSize to prevent infinite loops
  const safeOverlap = Math.min(overlap, chunkSize - 1);

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    
    // Ensure we always advance forward
    const nextStart = end - safeOverlap;
    if (nextStart <= start) {
      // Safety check: if we're not advancing, move forward by at least 1
      start = start + 1;
    } else {
      start = nextStart;
    }
    
    // Safety check: prevent infinite loops
    if (chunks.length > 10000) {
      console.warn('Chunking exceeded safety limit, returning remaining text as single chunk');
      if (start < text.length) {
        chunks.push(text.slice(start));
      }
      break;
    }
  }

  return chunks;
}

export async function generateAndStoreEmbedding(
  content: string,
  contentType: Embedding['contentType'],
  referenceId: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  const db = await getDatabase();
  const embeddingsCollection = db.collection<Embedding>('embeddings');

  // Chunk the content if it's too long
  const chunks = content.length > CHUNK_SIZE 
    ? chunkText(content) 
    : [content];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk);

    await embeddingsCollection.insertOne({
      content: chunk,
      contentType,
      referenceId,
      metadata: {
        ...metadata,
        chunkIndex: i,
        totalChunks: chunks.length,
      },
      embedding,
      createdAt: new Date(),
    });
  }
}

export async function regenerateEmbeddingsForContent(
  contentType: Embedding['contentType'],
  referenceId: string
): Promise<void> {
  const db = await getDatabase();
  const embeddingsCollection = db.collection<Embedding>('embeddings');

  // Delete existing embeddings
  await embeddingsCollection.deleteMany({
    contentType,
    referenceId,
  });

  // Note: Regeneration of embeddings should be done by calling generateAndStoreEmbedding
  // with the updated content after this function is called
}

export async function searchSimilarContent(
  query: string,
  limit: number = 10,
  contentType?: Embedding['contentType']
): Promise<Array<{ content: string; metadata: Record<string, any>; score: number }>> {
  const db = await getDatabase();
  const queryEmbedding = await generateEmbedding(query);
  
  console.log(`[Vector Search] Query: "${query.substring(0, 50)}...", Embedding dimensions: ${queryEmbedding.length}`);

  try {
    // MongoDB vector search: $vectorSearch MUST be the first stage
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: 'portfolio', // Index name in MongoDB Atlas
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: Math.max(100, limit * 20), // MongoDB recommends 20x limit for better recall
          limit: limit * 3, // Get more candidates initially
        },
      },
    ];
    
    // $match can come after $vectorSearch to filter results
    if (contentType) {
      pipeline.push({
        $match: {
          contentType,
        },
      });
    }

    // Additional $limit after vector search (redundant but safe)
    pipeline.push({
      $limit: limit,
    });

    pipeline.push({
      $project: {
        content: 1,
        metadata: 1,
        contentType: 1,
        referenceId: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    });

    console.log(`[Vector Search] Pipeline stages: ${pipeline.length}, query dimensions: ${queryEmbedding.length}`);
    
    // Debug: Check embeddings before search
    const totalEmbeddings = await db.collection('embeddings').countDocuments();
    console.log(`[Vector Search] Total embeddings in collection: ${totalEmbeddings}`);
    
    // Check a sample embedding to verify structure
    const sampleEmbedding = await db.collection('embeddings').findOne({}, { projection: { embedding: 1, contentType: 1, content: 1 } });
    if (sampleEmbedding) {
      const embeddingArray = (sampleEmbedding as any).embedding;
      console.log(`[Vector Search] Sample embedding type: ${Array.isArray(embeddingArray) ? 'array' : typeof embeddingArray}, length: ${Array.isArray(embeddingArray) ? embeddingArray.length : 'N/A'}, contentType: ${(sampleEmbedding as any).contentType}`);
      console.log(`[Vector Search] Sample content preview: ${((sampleEmbedding as any).content || '').substring(0, 100)}...`);
    }
    
    // Try the vector search
    let results: any[] = [];
    try {
      results = await db.collection<Embedding>('embeddings').aggregate(pipeline).toArray();
    } catch (vectorSearchError: any) {
      console.error(`[Vector Search] Vector search aggregation failed:`, {
        message: vectorSearchError.message,
        name: vectorSearchError.name,
        code: vectorSearchError.code,
        errorName: vectorSearchError.errorName,
      });
      // If it's an index error, provide helpful message
      if (vectorSearchError.message?.includes('index') || vectorSearchError.code === 28769) {
        console.error(`[Vector Search] CRITICAL: Vector search index may not be configured correctly.`);
        console.error(`[Vector Search] Please verify in MongoDB Atlas:`);
        console.error(`[Vector Search] 1. Search → Search Indexes → Find 'portfolio' on 'embeddings' collection`);
        console.error(`[Vector Search] 2. Ensure it's ACTIVE (not Building/Failed)`);
        console.error(`[Vector Search] 3. Verify config: numDimensions: 1536, similarity: "cosine", path: "embedding"`);
      }
      throw vectorSearchError; // Re-throw to trigger fallback
    }
    
    console.log(`[Vector Search] Found ${results.length} results using vector search`);
    if (results.length > 0) {
      console.log(`[Vector Search] Top result score: ${results[0].score}, content preview: ${results[0].content.substring(0, 100)}...`);
      console.log(`[Vector Search] All scores:`, results.map((r: any) => r.score));
    } else {
      console.log(`[Vector Search] No results found from vector search`);
      if (contentType) {
        const contentTypeCount = await db.collection('embeddings').countDocuments({ contentType });
        console.log(`[Vector Search] Embeddings with contentType '${contentType}': ${contentTypeCount}`);
      }
    }

    // Don't filter by score threshold - return all results from vector search
    // MongoDB vector search already ranks by similarity, so we trust its ranking
    return results.map((doc: any) => ({
      content: doc.content,
      metadata: doc.metadata || {},
      score: doc.score || 0,
    }));
  } catch (error: any) {
    console.error('Vector search error, falling back to text search:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    // Fallback to text search if vector search fails
    const queryLower = query.toLowerCase();
    const matchQuery: any = {
      $or: [
        { content: { $regex: queryLower, $options: 'i' } },
      ],
    };
    if (contentType) {
      matchQuery.contentType = contentType;
    }

    const results = await db
      .collection<Embedding>('embeddings')
      .find(matchQuery)
      .limit(limit)
      .toArray();
    
    console.log(`[Text Search Fallback] Found ${results.length} results using text search (vector search failed)`);

    return results.map((doc) => ({
      content: doc.content,
      metadata: doc.metadata || {},
      score: 0.5, // Default score for text search
    }));
  }
}
