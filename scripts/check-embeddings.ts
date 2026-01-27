// Load .env.local file BEFORE any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Now import other modules after env vars are loaded
import { getDatabase } from '../lib/mongodb';

async function checkEmbeddings() {
  try {
    const db = await getDatabase();
    const args = process.argv.slice(2);

    if (args.length === 0) {
      // Get summary
      const summary = await db
        .collection('embeddings')
        .aggregate([
          {
            $group: {
              _id: '$contentType',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const totalCount = await db.collection('embeddings').countDocuments();

      console.log('\n📊 Embeddings Summary:');
      console.log(`Total embeddings: ${totalCount}`);
      console.log('\nBy content type:');
      summary.forEach((item) => {
        console.log(`  ${item._id}: ${item.count}`);
      });
    } else if (args.length === 2) {
      // Check specific item
      const [contentType, referenceId] = args;
      const count = await db.collection('embeddings').countDocuments({
        contentType,
        referenceId,
      });

      const embeddings = await db
        .collection('embeddings')
        .find(
          {
            contentType,
            referenceId,
          },
          { projection: { content: 1, metadata: 1, createdAt: 1, _id: 0 } }
        )
        .toArray();

      console.log(`\n🔍 Embeddings for ${contentType} (${referenceId}):`);
      console.log(`Exists: ${count > 0 ? '✅ Yes' : '❌ No'}`);
      console.log(`Count: ${count}`);
      if (embeddings.length > 0) {
        console.log('\nEmbeddings:');
        embeddings.forEach((emb, idx) => {
          console.log(`\n  [${idx + 1}]`);
          console.log(`    Content preview: ${emb.content.substring(0, 100)}...`);
          console.log(`    Metadata:`, emb.metadata);
          console.log(`    Created: ${emb.createdAt}`);
        });
      }
    } else {
      console.log('Usage:');
      console.log('  npm run check-embeddings                    # Get summary');
      console.log('  npm run check-embeddings project <id>       # Check specific project');
      console.log('  npm run check-embeddings experience <id>    # Check specific experience');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkEmbeddings();
