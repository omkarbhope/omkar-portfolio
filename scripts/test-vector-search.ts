/**
 * Test script to verify MongoDB Atlas vector search is working
 * Run: npx tsx scripts/test-vector-search.ts
 */

// Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file - MUST be before any imports that use env vars
const envPath = resolve(process.cwd(), '.env.local');
const result = config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Could not load .env.local: ${result.error.message}`);
} else {
  console.log(`Loaded environment variables from: ${envPath}`);
}

// Verify required env vars are loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found in environment variables');
  console.error('Please ensure .env.local exists and contains OPENAI_API_KEY');
  process.exit(1);
}

// Use dynamic imports to ensure env vars are loaded first
// This prevents the modules from being evaluated before dotenv loads

async function testVectorSearch() {
  try {
    // Dynamic imports after env vars are loaded
    const { getDatabase } = await import('../lib/mongodb');
    const { generateEmbedding } = await import('../lib/openai');
    
    const db = await getDatabase();
    
    console.log('=== MongoDB Vector Search Diagnostic ===\n');
    
    // 1. Check if embeddings exist
    const totalEmbeddings = await db.collection('embeddings').countDocuments();
    console.log(`1. Total embeddings in collection: ${totalEmbeddings}`);
    
    if (totalEmbeddings === 0) {
      console.error('❌ No embeddings found. Please create some content first.');
      process.exit(1);
    }
    
    // 2. Check sample embedding structure
    const sample = await db.collection('embeddings').findOne({}, {
      projection: { embedding: 1, contentType: 1, content: 1 }
    });
    
    if (sample) {
      const embedding = (sample as any).embedding;
      console.log(`2. Sample embedding:`);
      console.log(`   - Type: ${Array.isArray(embedding) ? 'array' : typeof embedding}`);
      console.log(`   - Dimensions: ${Array.isArray(embedding) ? embedding.length : 'N/A'}`);
      console.log(`   - ContentType: ${(sample as any).contentType}`);
      console.log(`   - Content preview: ${((sample as any).content || '').substring(0, 80)}...`);
      
      if (!Array.isArray(embedding)) {
        console.error('❌ Embedding is not an array! Expected array of numbers.');
        process.exit(1);
      }
      
      if (embedding.length !== 1536) {
        console.error(`❌ Embedding has ${embedding.length} dimensions, expected 1536!`);
        process.exit(1);
      }
    }
    
    // 3. Generate a test query embedding
    console.log(`\n3. Generating test query embedding...`);
    const testQuery = 'ecommerce project';
    const queryEmbedding = await generateEmbedding(testQuery);
    console.log(`   - Query: "${testQuery}"`);
    console.log(`   - Query embedding dimensions: ${queryEmbedding.length}`);
    
    if (queryEmbedding.length !== 1536) {
      console.error(`❌ Query embedding has ${queryEmbedding.length} dimensions, expected 1536!`);
      process.exit(1);
    }
    
    // 4. Try vector search
    console.log(`\n4. Testing vector search...`);
    const pipeline = [
      {
        $vectorSearch: {
          index: 'portfolio', // Index name in MongoDB Atlas
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          content: 1,
          contentType: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];
    
    try {
      const results = await db.collection('embeddings').aggregate(pipeline).toArray();
      
      console.log(`   - Results found: ${results.length}`);
      
      if (results.length > 0) {
        console.log(`\n✅ Vector search is working!`);
        console.log(`\nTop results:`);
        results.forEach((r: any, i: number) => {
          console.log(`   ${i + 1}. Score: ${r.score?.toFixed(4) || 'N/A'}, Type: ${r.contentType}`);
          console.log(`      Content: ${(r.content || '').substring(0, 80)}...`);
        });
      } else {
        console.log(`\n⚠️  Vector search returned 0 results`);
        console.log(`\nPossible issues:`);
        console.log(`   1. Vector search index 'portfolio' may not be active`);
        console.log(`   2. Index configuration may not match (dimensions, path, similarity)`);
        console.log(`   3. Index may not be synced with the data`);
        console.log(`\nTo fix:`);
        console.log(`   1. Go to MongoDB Atlas → Search → Search Indexes`);
        console.log(`   2. Find 'portfolio' on 'embeddings' collection`);
        console.log(`   3. Verify status is "Active" (not "Building" or "Failed")`);
        console.log(`   4. Verify configuration:`);
        console.log(`      - numDimensions: 1536`);
        console.log(`      - similarity: "cosine"`);
        console.log(`      - path: "embedding"`);
        console.log(`   5. If index is "Building", wait for it to complete`);
        console.log(`   6. If index is "Failed", delete and recreate it`);
      }
    } catch (error: any) {
      console.error(`\n❌ Vector search failed with error:`);
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   Name: ${error.name}`);
      
      if (error.code === 28769 || error.message?.includes('index')) {
        console.error(`\n⚠️  This is an index error. The vector search index may not exist or be configured correctly.`);
        console.error(`\nTo fix:`);
        console.error(`   1. Go to MongoDB Atlas → Search → Create Search Index`);
        console.error(`   2. Choose "JSON Editor"`);
        console.error(`   3. Select collection: "embeddings"`);
        console.error(`   4. Use this configuration:`);
        console.error(`      {`);
        console.error(`        "fields": [`);
        console.error(`          {`);
        console.error(`            "type": "vector",`);
        console.error(`            "path": "embedding",`);
        console.error(`            "numDimensions": 1536,`);
        console.error(`            "similarity": "cosine"`);
        console.error(`          }`);
        console.error(`        ]`);
        console.error(`      }`);
        console.error(`   5. Name it: "portfolio" (or update code to match your index name)`);
        console.error(`   6. Wait for it to become "Active"`);
      }
      
      process.exit(1);
    }
    
    console.log(`\n=== Diagnostic Complete ===`);
  } catch (error: any) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testVectorSearch();
