# E-commerce Product Recommender

Full-stack Next.js app with:
- Recommendation API (content-based + popularity fallback)
- Neon Postgres for products and user interactions
- LLM-powered “Why this product?” explanations via the Vercel AI SDK
- Optional dashboard to preview recommendations

## Tech
- Next.js App Router (Next.js)
- Database: Neon Postgres via `@neondatabase/serverless`
- AI: Vercel AI SDK (`generateText`) using `openai/gpt-5-mini`

## Setup
1) Configure Neon connection:
   - Add `DATABASE_URL` in the Vars sidebar or connect Neon in the Connect sidebar.
   - We use `@neondatabase/serverless` in this project. Prefer the non-pooled Neon host (no "`-pooler`" in the hostname), keep `?sslmode=require`.
     - If your current URL looks like `...-pooler...neon.tech`, switch to the equivalent non-pooled hostname without `-pooler`.
   - If you instead choose Prisma or `pg` with a Node pool, keep the pooled host (with "`-pooler`").
   - Example: `postgres://USER:PASSWORD@HOST/DB?sslmode=require`

2) Seed the database:
   - Run the script in the /scripts folder: `scripts/seed-db.ts` (v0 can execute this file)
   - It creates tables and seeds sample products + a demo user.

3) Run the demo:
   - Open the preview and visit `/` (dashboard).
   - Click “Get Recommendations”. Leave “user ID” empty to use demo behavior, or use the seeded user id `00000000-0000-0000-0000-000000000001`.

4) LLM explanations:
   - By default explanations are enabled.
   - To disable: set `ENABLE_AI_EXPLANATION=false` in Vars.

## API
POST `/api/recommendations`
\`\`\`
{
  "userId": "optional-user-id",
  "behavior": { "categoryCounts": { "Electronics": 3 }, ... },
  "limit": 8,
  "includeExplanations": true
}
\`\`\`
Returns `{ ok, behavior, recommendations: [{ product, score, explanation? }] }`.

POST `/api/interactions`
- Body: `{ "userId": "uuid", "productId": "uuid", "type": "view|cart|purchase|like" }`
- Inserts a row into `interactions`. Use this to record feedback (e.g., Like, Add to cart) from the dashboard and re-run recommendations.

## Dashboard tips
- Use “Use demo user” to autofill the seeded user and test real interaction-driven recs.
- Adjust “Limit” (1–20) and toggle “Explanations” for faster iteration.
- Click “Like” or “Add to cart” on a card to record an interaction and refresh the results automatically.

## Notes
- Evaluation focuses: recommendation accuracy, explanation quality, code design, docs.
- Improve accuracy by tuning weights in `lib/recommend.ts` or adding collaborative signals.
- License: MIT
