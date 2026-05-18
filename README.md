# lumzen

Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase, deployed on Vercel.

## Folder layout

```
app/                 Next.js App Router pages, layouts, route handlers
components/          Shared React components
lib/
  supabase/
    client.ts        Browser Supabase client (use in Client Components)
    server.ts        Server Supabase client (use in Server Components / Route Handlers)
public/              Static assets served from /
.env.example         Template of required env vars
.env.local           Local secrets (gitignored)
```

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in real values (already done locally)
npm run dev                  # http://localhost:3000
```

## Environment variables

| Name | Where used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Safe to expose. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Safe to expose. RLS enforces access. |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **Never** expose to the client. |
| `RESEND_API_KEY` | server only | Transactional email. |

## Deploying to Vercel

1. Go to https://vercel.com/new and import `DemianMoor/lumzen`.
2. Framework preset: **Next.js** (auto-detected).
3. Under **Environment Variables**, add every var from `.env.example` (use real values from `.env.local`).
4. Click **Deploy**. Subsequent pushes to `main` auto-deploy.

CLI alternative: `vercel` from this folder, then `vercel --prod`.
