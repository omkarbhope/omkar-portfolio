# Omkar Bhope - Portfolio Website

A comprehensive portfolio website built with Next.js, MongoDB Atlas (with Vector Search), and OpenAI for an AI-powered chatbot.

## Features

- **Resume Viewer**: PDF resume display and download
- **Projects**: Showcase of full-stack projects with architecture diagrams
- **Experience**: Timeline view of professional experience with project breakdowns
- **Education**: Academic background and achievements
- **Skills**: Interactive skills showcase with categorization
- **Certifications**: Professional licenses and certifications
- **Awards**: Recognition and honors
- **AI Chatbot**: RAG-powered chatbot that answers questions about the portfolio
- **Admin Panel**: Content management system for all portfolio sections

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas with Vector Search
- **AI**: OpenAI API (Embeddings + Chat Completion)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=portfolio

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_generate_with_openssl_rand_base64_32

# Admin
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. MongoDB Atlas Vector Search Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `portfolio` (or update `MONGODB_DB_NAME`)
3. Create the following collections:
   - `projects`
   - `experiences`
   - `education`
   - `skills`
   - `licensesCertifications`
   - `awards`
   - `architectureDiagrams`
   - `embeddings`
   - `adminUsers`

4. Create a Vector Search Index on the `embeddings` collection:
   - Go to Atlas → Search → Create Search Index
   - Choose "JSON Editor"
   - Use this configuration:

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

   - Name the index: `vector_index`

### 4. Setup Admin User

Run the setup script to create the admin user:

```bash
npx tsx scripts/setup-admin.ts
```

Or use Node.js:

```bash
node -r ts-node/register scripts/setup-admin.ts
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Access Admin Panel

Navigate to `/admin/login` and sign in with your admin credentials.

## Project Structure

```
omkar-portfolio/
├── app/
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── resume/
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── education/
│   │   ├── skills/
│   │   ├── certifications/
│   │   ├── awards/
│   │   ├── contact/
│   │   └── chat/          # AI Chatbot
│   ├── (admin)/           # Admin pages
│   │   └── admin/
│   │       ├── login/
│   │       ├── dashboard/
│   │       └── projects/
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth
│   │   ├── chat/          # Chatbot endpoint
│   │   ├── contact/       # Contact form
│   │   └── admin/         # Admin CRUD APIs
│   └── layout.tsx
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ...
├── lib/                   # Utility libraries
│   ├── mongodb.ts        # MongoDB connection
│   ├── openai.ts         # OpenAI client
│   ├── embeddings.ts     # Embedding generation & search
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── scripts/              # Setup scripts
```

## Adding Content

### Via Admin Panel

1. Log in at `/admin/login`
2. Navigate to the section you want to manage
3. Add, edit, or delete content

### Via API

All admin endpoints require authentication. See `app/api/admin/` for available endpoints.

## AI Chatbot

The chatbot uses RAG (Retrieval-Augmented Generation):
1. User query is converted to an embedding
2. Vector search finds relevant content from the portfolio
3. Context is injected into OpenAI's chat completion
4. Response is streamed back to the user

Content is automatically embedded when:
- Projects are created/updated
- Other content is added via admin panel

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas Vector Search

Ensure your MongoDB Atlas cluster has Vector Search enabled and the index is created before deploying.

## License

Private - All rights reserved
