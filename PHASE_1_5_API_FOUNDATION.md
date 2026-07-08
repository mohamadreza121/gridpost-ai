# GridPost AI Phase 1.5 — API-ready foundation

This phase prepares the dashboard for real social platform APIs before adding LinkedIn, Meta, X, TikTok, YouTube, or Pinterest one by one.

## Added

- Encrypted token helper for future access/refresh tokens.
- Social platform registry with platform limits and media requirements.
- Platform validation system used by the composer and API route.
- Social account API routes for demo connect, disconnect, reconnect states, and OAuth readiness checks.
- OAuth start/callback shells for platform-specific integrations.
- Publisher adapter registry so every platform can implement the same `publish` contract.
- Demo publisher now runs through the adapter system and records platform-level publish results.
- Retry endpoint for failed posts: `POST /api/posts/:postId/retry`.
- Appwrite schema additions for token fields, validation messages, external post IDs, retry counts, and publish errors.

## Required after pulling this update

Run the setup script again so Appwrite adds the new optional attributes and indexes:

```bash
npm run appwrite:setup
```

The script is safe to rerun. It checks for the existing database and bucket before creating missing resources.

## Recommended new env value

Add this locally and in Vercel:

```env
TOKEN_ENCRYPTION_KEY=
```

Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

If this is missing, the app falls back to deriving an encryption key from the server Appwrite API key. That is okay for local/demo use, but a dedicated token key is better for production.

## Next phase

Phase 2A should connect LinkedIn first:

1. Create LinkedIn developer app.
2. Add LinkedIn OAuth env values.
3. Replace the LinkedIn demo publisher with the real API adapter.
4. Schedule a LinkedIn post through Inngest.
5. Save the real LinkedIn post URL in `publish_results`.
