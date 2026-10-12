# DronexMC Applications

Reconstructed project based on the available Kimi conversation transcript. It provides a bilingual dark/neon application portal, Discord OAuth2 login, Supabase persistence, a simple admin panel, and separate Discord webhooks for Administration / Media / Development.

> Important: the transcript did **not** contain Kimi's saved backend folder or the original question-bank file. This ZIP is a reconstructed implementation, not a byte-for-byte recovery of Kimi's inaccessible files. The included application questions are starter questions and should be reviewed before using the site for real recruitment. Run the checks below before deploying.

## Setup
1. Install Node.js 20 LTS.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Create a Supabase project. In SQL Editor, run `supabase/schema.sql`.
4. In Discord Developer Portal, create an application and add this redirect URI:
   `http://localhost:3000/api/auth/callback`
   For production, change it to `https://YOUR-DOMAIN/api/auth/callback` and update `DISCORD_REDIRECT_URI`.
5. Install and run:
   ```bash
   npm install
   npm run dev
   ```
6. Before deploying, run:
   ```bash
   npm run typecheck
   npm run build
   ```

## Deploy to Vercel
Import the folder/repository into Vercel and add all variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` and `DISCORD_REDIRECT_URI` to the deployed URL. Never put `SUPABASE_SERVICE_ROLE_KEY`, `DISCORD_CLIENT_SECRET`, `AUTH_SECRET`, or webhook URLs in client-side code or commit them to GitHub.

## Admin and webhooks
- Admin URL: `/admin/login`
- Admin credentials: `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Save three webhook URLs from `/admin` after logging in.
- Webhook URLs are encrypted at rest with AES-256-GCM.
- Submissions are saved before webhook notification; a webhook failure does not delete the application.

## Included features
- Arabic/English UI toggle; form language is chosen per application.
- Discord OAuth2 required before submitting.
- One application per Discord account per category.
- Applicant dashboard and application status page.
- Admin list, status changes, private notes, and webhook configuration.
- Mass-mention prevention for `@everyone`, `@here`, and role mentions.

## Known limitations
- Original 25/20/20 question banks were referenced in the transcript but were not included in the uploaded transcript itself. This ZIP contains editable starter questions.
- No real production build was run in this environment. Test `npm run typecheck` and `npm run build` locally before deploying.
