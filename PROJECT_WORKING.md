# Omkar Portfolio – Project Working (E2E)

This document describes how the portfolio app is structured, how many tabs/pages exist, how embeddings and AI chat work, and how the admin panel works.

---

## 1. Total Tabs / Pages

### 1.1 Main navigation (dock)

The app has **10 main sections** exposed in the bottom dock (and top bar on mobile):

| # | Route | Label | Description |
|---|--------|--------|-------------|
| 1 | `/` | Home | AI hero + scroll sections overview |
| 2 | `/resume` | Resume | PDF resume view/download (Google Drive or local) |
| 3 | `/projects` | Projects | List of projects (featured + all) |
| 4 | `/experience` | Experience | Work history timeline |
| 5 | `/education` | Education | Education timeline |
| 6 | `/skills` | Skills | Skills by category with proficiency |
| 7 | `/certifications` | Certifications | Licenses & certifications |
| 8 | `/awards` | Awards | Awards list |
| 9 | `/contact` | Contact | Contact form + contact info + social links |
| 10 | `/chat` | Chat | Dedicated chat page (same AI as home) |

So there are **10 main tabs** in the navigation.

### 1.2 Other public routes

- **`/projects/[id]`** – Single project detail (from `getProject(id)`).
- **`/experience/[experienceId]/projects`** – List of projects for one experience (e.g. “Projects at Etched”).
- **`/experience/[experienceId]/projects/[projectIndex]`** – Detail of one project under that experience.
- **`/setup`** – One-time (or repeated) admin user setup; creates/updates admin in DB (no login required).
- **`/not-found`** – 404 page (link back home).

### 1.3 Admin routes (protected)

All under `/admin`, protected by middleware except `/admin/login`:

- **`/admin/login`** – Credentials login (NextAuth).
- **`/admin/dashboard`** – Dashboard with counts and links to each admin list.
- **`/admin/projects`** – List projects; link to “Add Project”.
- **`/admin/projects/new`** – Create project form.
- **`/admin/projects/[id]/edit`** – Edit project form.
- **`/admin/experiences`** – List experiences (same pattern).
- **`/admin/experiences/new`**, **`/admin/experiences/[id]/edit`**
- **`/admin/education`**, **`/admin/education/new`**, **`/admin/education/[id]/edit`**
- **`/admin/skills`**, **`/admin/skills/new`**, **`/admin/skills/[id]/edit`**
- **`/admin/certifications`**, **`/admin/certifications/new`**, **`/admin/certifications/[id]/edit`**
- **`/admin/awards`**, **`/admin/awards/new`**, **`/admin/awards/[id]/edit`**

So: **10 main nav tabs**, plus **dynamic project/experience sub-pages**, **setup**, **404**, and a full **admin CRUD** set for 6 content types (projects, experiences, education, skills, certifications, awards).

---

## 2. Data model (MongoDB)

- **Database name:** `process.env.MONGODB_DB_NAME` or `portfolio`.
- **Collections:**  
  `projects`, `experiences`, `education`, `skills`, `licensesCertifications`, `awards`, `embeddings`, `adminUsers`, and optionally `architectureDiagrams` (diagrams API exists).

Types are defined in `types/index.ts`: `Project`, `Experience`, `Education`, `Skill`, `LicenseCertification`, `Award`, `Embedding`, `AdminUser`, `ArchitectureDiagram`, etc.

---

## 3. Embeddings and AI – How they work

### 3.1 What are embeddings used for?

- **Semantic search:** User questions are turned into a vector; the app finds the most similar stored text chunks (portfolio content) to build context for the AI.
- **Storage:** Embeddings are stored in the **`embeddings`** collection (MongoDB). Each document has:
  - `content` (text chunk),
  - `contentType` (e.g. `project`, `experience`, `education`, `skill`, `license`, `award`),
  - `referenceId` (e.g. project ID, experience ID),
  - `metadata`,
  - `embedding` (vector),
  - `createdAt`.

### 3.2 How embeddings are created

- **OpenAI:** `lib/openai.ts` uses **`text-embedding-3-small`** to get a vector for a string.
- **Chunking:** `lib/embeddings.ts`:
  - `chunkText(text, chunkSize=1000, overlap=200)` splits long text into overlapping chunks.
  - For each chunk, `generateEmbedding(chunk)` is called and the result is stored in `embeddings`.
- **When they are created/updated:**
  - **Projects:** On **create** (POST `/api/admin/projects`) and **update** (PUT `/api/admin/projects/[id]`): after saving the project, the code calls `regenerateEmbeddingsForContent('project', id)` (deletes old embeddings for that project), then `generateAndStoreEmbedding(...)` with the new project text (title, description, achievements, techStack).
  - **Experiences, education, skills, certifications, awards:** Same idea in their respective admin API routes (create/update) – delete old embeddings for that entity, then generate and store new ones for the updated text.

So: **embeddings are kept in sync with admin-edited content** by regenerating them on every create/update of that entity.

### 3.3 How search works

- **`searchSimilarContent(query, limit, contentType?)`** in `lib/embeddings.ts`:
  1. Gets a **query embedding** for the user message via `generateEmbedding(query)`.
  2. Runs a **MongoDB Atlas vector search** on the `embeddings` collection:
     - Index name: **`portfolio`** (must exist in Atlas; path `embedding`, cosine similarity).
     - Pipeline: `$vectorSearch` → optional `$match` by `contentType` → `$limit` → `$project` (content, metadata, score).
  3. If vector search fails (e.g. index missing), it **falls back** to a simple regex text search on `content`.

Result: list of `{ content, metadata, score }` used as **context** for the chat.

### 3.4 Chat API and AI flow

- **Endpoint:** `POST /api/chat`.
- **Body:** `{ message, history?, apiKey? }`.
- **Auth:** If `CHAT_API_KEY` is set, requests from **same origin** (your site) are allowed without `apiKey`; **external** callers must send a valid `apiKey`.

Flow:

1. **Intent detection**  
   `detectQueryIntent(message)`:
   - Detects “types”: experience, project, skill, education, license, award (e.g. by keywords like “experience”, “project”, “skills”, “education”, “certification”, “award”).
   - Detects “keywords” (e.g. company/org names: etched, ucsd, pict, persistent, dassault).
   - Sets `isHighLevel` for phrases like “tell me about”, “what are your”, “overview”, “all”, “featured”, etc.

2. **Gathering context**
   - **Always:** Semantic search via `searchSimilarContent(message, 8)` → up to 8 similar chunks from `embeddings`.
   - **If high-level or typed intent:** In addition, the code fetches **structured data** from MongoDB and formats it into text:
     - **Experience** (or keyword match): Load experiences, format company, role, period, technologies, and projects with descriptions/metrics; push into `allResults`.
     - **Project:** If “all”/“personal”/“list” → all projects (up to 20); else featured (5). Adds a project list summary and per-project text (title, description, tech stack, achievements, metrics, URLs).
     - **Education:** All education entries with degree, institution, dates, GPA, courses, honors.
     - **Skill:** All skills grouped by category.

3. **Deduplication and ranking**  
   - Deduplicate by content prefix; sort by score; take top 12.

4. **Context formatting**  
   - `formatContextWithMetadata(topResults)` builds a single context string with `[Source N]` and metadata (e.g. Company, Role, Project, Category, Institution, Type) so the model knows where each fact comes from.

5. **LLM call**  
   - **Model:** `gpt-4o-mini` (OpenAI).
   - **System prompt:** Defines the assistant as “Omkar” (first person), personality, and instructions to use the context and metadata. If no context, says to ask about experience, projects, skills, education.
   - **Messages:** Last 6 conversation turns from `history` plus the current `message`.
   - **Streaming:** Response is streamed back (OpenAI stream → `ReadableStream`).

So: **Embeddings** power **semantic retrieval**; **intent + direct DB** add **structured, high-level** data; **formatted context + system prompt** drive the **AI reply** in a single, coherent flow.

---

## 4. Admin panel – How it works

### 4.1 Authentication

- **Provider:** NextAuth with **Credentials** provider.
- **Config:** `app/api/auth/[...nextauth]/route.ts`:
  - Credentials: email + password.
  - `authorize` loads user from **`adminUsers`** by email, compares password with **bcrypt**.
  - Session is **JWT**; custom callbacks add `role` to token/session.
  - Sign-in page: `/admin/login`.

### 4.2 Middleware

- **File:** `middleware.ts`.
- **Matcher:** `/admin/:path*`.
- **Logic:** For any `/admin` path **except** `/admin/login`, get NextAuth JWT. If no token → redirect to `/admin/login` with `callbackUrl`. Otherwise allow.

So: **All admin routes except login are protected**; unauthenticated users are sent to login.

### 4.3 Setup (first-time admin)

- **Route:** `/setup`.
- **API:** `POST /api/setup` with `{ email, password }`.
  - If admin with that email exists: **update** `passwordHash` (bcrypt).
  - Else: **insert** new document in `adminUsers` (email, passwordHash, role: `'admin'`, createdAt).
- No auth required; intended for one-time or occasional admin account creation/update.

### 4.4 Dashboard and CRUD

- **Dashboard:** `/admin/dashboard` (server component). Calls `requireAuth()`; fetches counts from MongoDB for projects, experiences, education, skills, certifications, awards. Renders links to each admin list (e.g. `/admin/projects`, `/admin/experiences`).

- **Per resource (e.g. Projects):**
  - **List:** Server component loads all items from DB, renders a list component (e.g. `ProjectsList`) with links to “Add” and “Edit”.
  - **New:** Client form (e.g. react-hook-form + zod) POSTs to `/api/admin/projects` → creates document and triggers embedding generation for that project.
  - **Edit:** Client form loads one item via GET `/api/admin/projects/[id]`, then PUT to same route on save; API updates document and regenerates embeddings for that project.

- **API pattern:** All admin APIs use `requireAuth()` at the start. GET returns JSON; POST creates; PUT updates; DELETE deletes. For projects (and similarly for others), create/update also:
  - Call `regenerateEmbeddingsForContent(contentType, id)` (delete old embeddings for that id).
  - Call `generateAndStoreEmbedding(text, contentType, id, metadata)` with the new text so the chat can retrieve it.

### 4.5 Embeddings check (admin)

- **GET** `/api/admin/embeddings/check?contentType=...&referenceId=...` (auth required):
  - With `referenceId`: returns whether embeddings exist for that entity and optionally list of stored chunks.
  - Without: returns aggregate counts by `contentType` and total count.

Useful for verifying that embeddings exist after admin edits.

---

## 5. Other notable flows

### 5.1 Home page

- **Server:** Fetches **skills** from MongoDB and passes them to `AIHero`.
- **UI:** `AIHero` (chat + avatar + suggested questions) and `ScrollSections` (cards linking to Projects, Experience, Skills, Education, Certifications, Awards). Background uses `AnimatedBackground` with skill bubbles (from the same skills prop).

### 5.2 Contact

- **Page:** Form (name, email, subject, message) and contact info (email, phone, San Jose, CA) + social (LinkedIn, GitHub).
- **API:** `POST /api/contact`. If Resend is configured (`RESEND_API_KEY`, `ADMIN_EMAIL`), sends email to admin with `reply_to` set to submitter. Always returns success after validation (email send failure does not fail the request).

### 5.3 Resume

- **Page:** Uses `NEXT_PUBLIC_RESUME_URL` (e.g. Google Drive). Converts `/view` to `/preview` for iframe; provides a download link. Print button triggers `window.print()`.

### 5.4 Chat on Home vs Chat page

- **Home:** `AIHero` embeds the same chat (same `POST /api/chat`) with avatar and suggested questions; after first message it switches to a conversation layout.
- **Chat tab:** `ChatBot` component, same API, different layout (no hero/avatar). Same streaming and history behavior.

---

## 6. Summary table

| Area | Detail |
|------|--------|
| **Total main tabs** | 10 (Home, Resume, Projects, Experience, Education, Skills, Certifications, Awards, Contact, Chat) |
| **Public dynamic routes** | `/projects/[id]`, `/experience/[experienceId]/projects`, `/experience/[experienceId]/projects/[projectIndex]` |
| **Setup** | `/setup` + `POST /api/setup` (create/update admin user) |
| **Admin** | Login, dashboard, 6 content types × (list + new + edit); all protected by middleware + requireAuth |
| **Embeddings** | Stored in `embeddings`; created/updated on admin create/update; OpenAI `text-embedding-3-small`; chunked (1000/200); vector search index `portfolio` |
| **AI chat** | Intent detection → semantic search + direct DB by type → top 12 chunks → formatted context → GPT-4o-mini streamed response; same-origin no key, external needs CHAT_API_KEY |

This is the end-to-end working of the project: tabs, pages, embeddings, AI, and admin panel.
