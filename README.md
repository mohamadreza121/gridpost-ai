# GridPost AI — Phase 1 Appwrite Full-Stack Foundation

GridPost AI is a GridSpell Studio portfolio SaaS demo for creating, previewing, saving, scheduling, and managing social media content from one dashboard.

This version replaces Supabase with **Appwrite Cloud** for:

- Appwrite Auth
- Appwrite Databases
- Appwrite Storage media uploads

It still includes:

- Next.js App Router UI
- OpenAI caption-generation route
- Inngest workflow route and scheduled-post function
- Resend email test route
- Git/Vercel-ready project structure

## 1. Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

## 2. Create accounts

Create these accounts/services:

1. Appwrite Cloud — auth, database, storage
2. OpenAI Platform — API key for caption generation
3. Inngest — workflow/scheduler
4. Resend — email API
5. GitHub — repository
6. Vercel — hosting

Recommended hosting: Vercel for the Next.js app, with Appwrite Cloud for backend, Inngest for workflows, Resend for email, and OpenAI for AI captions.

## 3. Appwrite setup

### Create project

1. Go to Appwrite Cloud.
2. Create a new project named `gridpost-ai`.
3. Copy your project ID.
4. Copy your API endpoint, for example `https://cloud.appwrite.io/v1` or the regional endpoint shown in your console.

### Add a Web platform

In Appwrite Console:

1. Project → Overview or Platforms.
2. Add platform → Web.
3. Add hostname for local dev:

```txt
localhost
```

After Vercel deployment, add your Vercel/custom domain too:

```txt
your-vercel-app.vercel.app
gridspellstudio.com
```

Do not include `https://` in Appwrite platform hostnames unless the console specifically asks for a full URL.

### Create API key

Create a server API key in Appwrite Console.

Use broad development scopes for Phase 1, or at least the scopes for:

```txt
users.read
users.write
sessions.write
databases.read
databases.write
collections.read
collections.write
attributes.read
attributes.write
indexes.read
indexes.write
buckets.read
buckets.write
files.read
files.write
```

Keep this key server-only. Never expose it in frontend code.

### Fill `.env.local`

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GridPost AI

APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_server_api_key
APPWRITE_DATABASE_ID=gridpost_ai
APPWRITE_STORAGE_BUCKET_ID=media
APPWRITE_COOKIE_NAME=
```

`APPWRITE_COOKIE_NAME` can stay empty. The app automatically uses Appwrite's recommended cookie name format:

```txt
a_session_<PROJECT_ID>
```

### Create database, collections, indexes, and storage bucket

Run:

```bash
npm run appwrite:setup
```

This creates:

- Database: `gridpost_ai`
- Bucket: `media`
- Collections:
  - `workspaces`
  - `workspace_members`
  - `brand_profiles`
  - `social_accounts`
  - `media_assets`
  - `posts`
  - `post_platforms`
  - `publish_jobs`
  - `publish_results`
  - `automation_rules`
  - `agent_events`

The setup script is here:

```txt
appwrite/setup/create-resources.ts
```

If the script says a resource already exists, that is fine.

## 4. OpenAI setup

1. Create an OpenAI Platform account.
2. Create an API key.
3. Add it to `.env.local`:

```txt
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.5
```

The caption generator is wired at:

```txt
app/api/ai/caption/route.ts
```

If no API key is present, the route returns fallback demo copy instead of crashing.

## 5. Resend setup

1. Create a Resend account.
2. Create an API key.
3. For production, verify your sending domain.
4. For quick local tests, use Resend's onboarding sender.

Add:

```txt
RESEND_API_KEY=
RESEND_FROM_EMAIL=GridPost AI <onboarding@resend.dev>
RESEND_NOTIFY_EMAIL=your@email.com
```

Test route:

```txt
POST /api/email/test
```

You can test it from the dashboard Automation page.

## 6. Inngest setup

Local development:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Production:

1. Create an Inngest account.
2. Create an app/project.
3. Connect the deployed endpoint:

```txt
https://your-domain.com/api/inngest
```

4. Copy the event key and signing key into Vercel environment variables:

```txt
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Included functions:

- `publish-scheduled-post`
- `sweep-due-posts`
- `daily-ai-draft-reminder`

Phase 1 uses a demo publisher that marks posts as posted in Appwrite Databases. Phase 2/3 can replace this with real platform adapters.

## 7. Full local environment example

Your `.env.local` should look like:

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GridPost AI

APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_server_api_key
APPWRITE_DATABASE_ID=gridpost_ai
APPWRITE_STORAGE_BUCKET_ID=media
APPWRITE_COOKIE_NAME=

OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.5

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=GridPost AI <onboarding@resend.dev>
RESEND_NOTIFY_EMAIL=your@email.com
```

## 8. Git setup

Create a new GitHub repository named something like:

```txt
gridpost-ai
```

Then run:

```bash
git init
git add .
git commit -m "Build GridPost AI phase 1 Appwrite foundation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gridpost-ai.git
git push -u origin main
```

## 9. Vercel deployment

1. Push the repo to GitHub.
2. Go to Vercel.
3. New Project → Import the GitHub repo.
4. Framework should auto-detect Next.js.
5. Add all environment variables from `.env.local` into Vercel Project Settings → Environment Variables.
6. Deploy.
7. Add your Vercel domain as an Appwrite Web platform hostname.
8. Add the deployed `/api/inngest` endpoint to Inngest.

## 10. Test flow

1. Run `npm install`.
2. Fill `.env.local`.
3. Run `npm run appwrite:setup`.
4. Run `npm run dev`.
5. Register a new account.
6. Log in.
7. Go to Settings and save brand profile.
8. Go to Media and upload an image.
9. Go to Composer and click Generate AI Draft.
10. Save draft.
11. Schedule post.
12. Check Appwrite collections:
    - `posts`
    - `post_platforms`
    - `publish_jobs`
13. Open Inngest Dev Server/Dashboard and confirm event/function activity.

## 11. What is still demo-only in Phase 1

Phase 1 does not post to real social media platforms yet. It prepares the architecture.

Real social publishing comes later with OAuth + API adapters for:

- Instagram
- Facebook
- LinkedIn
- X
- TikTok
- YouTube
- Pinterest
