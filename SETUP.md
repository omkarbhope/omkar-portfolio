# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all required values (MongoDB URI, OpenAI API key, etc.)

3. **Set Up MongoDB Atlas**
   - Create a cluster
   - Create the database `portfolio` (or update `MONGODB_DB_NAME`)
   - Create Vector Search index on `embeddings` collection (see README.md)

4. **Create Admin User**
   ```bash
   npx tsx scripts/setup-admin.ts
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## MongoDB Vector Search Index

Create a Vector Search index in MongoDB Atlas:

1. Go to Atlas → Search → Create Search Index
2. Choose "JSON Editor"
3. Select the `embeddings` collection
4. Use this configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

5. Name it: `vector_index`

## Initial Content Setup

After setting up the admin panel, you can:

1. Log in at `/admin/login`
2. Add your projects, experiences, education, skills, certifications, and awards
3. The system will automatically generate embeddings for the AI chatbot

## Troubleshooting

### Vector Search Not Working

If you see errors about vector search:
- Ensure the Vector Search index is created and active in MongoDB Atlas
- Check that the index name is exactly `vector_index`
- The system will fall back to text search if vector search fails

### Admin Login Issues

- Ensure you've run the setup script to create the admin user
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` match what you're using
- Verify `NEXTAUTH_SECRET` is set correctly

### Embedding Generation

- Ensure `OPENAI_API_KEY` is valid
- Check your OpenAI API quota
- Embeddings are generated automatically when content is added/updated
