# Kavya Labs — Week 2: User authentication

Next.js (App Router) + React + Tailwind CSS + NextAuth (Google OAuth).
The landing page from Week 1 is unchanged. Week 2 adds sign in, sign out and a protected dashboard.

## What the reviewer should look at
| Requirement | Where |
|---|---|
| NextAuth + Google OAuth setup | `lib/auth.js`, `app/api/auth/[...nextauth]/route.js` |
| Sign in / create account page | `app/login/page.jsx`, `components/GoogleButton.jsx` |
| Sign out | `components/SignOutButton.jsx`, `components/Navbar.jsx` |
| Protected route (guard + server check) | `proxy.js`, `app/dashboard/page.jsx` |
| Session available in the UI | `app/providers.jsx` (SessionProvider), `components/Navbar.jsx` |
| Secrets kept out of code | `.env.example` (real values go in `.env.local`, which is git-ignored) |
| Error handling | `app/login/page.jsx` (specific messages for each failure) |
| Landing page (Week 1) | `app/page.jsx` and `components/` (Hero, Features, HowItWorks, Faq, Cta, Footer) |
| Shared styles and helpers | `components/ui.js`, `components/Reveal.jsx`, `app/globals.css` |

## Run it
1. `npm install`
2. `cp .env.example .env.local` and fill in the four values below
3. `npm run dev`, then open http://localhost:3000

## Environment variables
- `NEXTAUTH_URL` — `http://localhost:3000` locally, your live URL on Vercel
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — from Google Cloud Console

## Google Cloud setup
1. console.cloud.google.com, create a project.
2. APIs & Services, OAuth consent screen: External, add app name and your email. Add your Gmail as a test user.
3. Credentials, Create OAuth client ID, Web application.
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-SITE.vercel.app/api/auth/callback/google`

## How to test
1. Open `/dashboard` while signed out. You are redirected to `/login`.
2. Click "Continue with Google". New accounts are created automatically on first sign in.
3. You land on `/dashboard` with your name, email and photo.
4. Refresh and reopen the tab. You stay signed in (sessions last 30 days).
5. Click "Sign out". You return home, and `/dashboard` redirects to `/login` again.
6. The navbar shows "Sign in" when signed out, and "Dashboard" and "Sign out" when signed in.
7. Cancel on the Google screen. You return to `/login` with a clear message.
8. Resize to phone width. The navbar becomes a hamburger menu.

## Security notes
- No passwords are stored. Google handles them, so there is nothing to hash.
- The session is a signed token in an HTTP-only cookie, signed with `NEXTAUTH_SECRET`.
- `/dashboard` is guarded twice: `proxy.js` redirects before render, and the page checks the session on the server.
- Secrets are only read from environment variables.

## Deploy to Vercel
Framework preset: Next.js. Add the four environment variables, deploy, then add the live redirect URI in Google Cloud.

## Not built yet
Week 3: admin dashboard (user management and analytics). It will need a database.
