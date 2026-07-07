# Phase 1 Appwrite Setup Checklist

## Accounts to create

- [ ] Appwrite Cloud
- [ ] OpenAI Platform
- [ ] Inngest
- [ ] Resend
- [ ] GitHub
- [ ] Vercel

## Appwrite

- [ ] Create Appwrite project `gridpost-ai`
- [ ] Add Web platform hostname: `localhost`
- [ ] Create API key with Auth/User, Database, Collection, Attribute, Index, Bucket, and File scopes
- [ ] Copy Appwrite endpoint
- [ ] Copy project ID
- [ ] Copy API key
- [ ] Fill `.env.local`
- [ ] Run `npm run appwrite:setup`
- [ ] Confirm database `gridpost_ai` exists
- [ ] Confirm bucket `media` exists
- [ ] Confirm collections exist

## Local app

- [ ] `npm install`
- [ ] `cp .env.example .env.local`
- [ ] Fill Appwrite env values
- [ ] Fill OpenAI env value
- [ ] Fill Resend env value
- [ ] Fill Inngest env values when available
- [ ] `npm run appwrite:setup`
- [ ] `npm run dev`

## Inngest local

- [ ] Start Next app on port 3000
- [ ] Run `npx inngest-cli@latest dev -u http://localhost:3000/api/inngest`
- [ ] Schedule a post in the dashboard
- [ ] Confirm function appears in Inngest dev UI

## GitHub

- [ ] Create repo `gridpost-ai`
- [ ] Run Git commands from README
- [ ] Push to `main`

## Vercel

- [ ] Import GitHub repo
- [ ] Add environment variables
- [ ] Deploy
- [ ] Copy deployed URL
- [ ] Add Vercel hostname to Appwrite Web platform
- [ ] Add `/api/inngest` URL to Inngest
