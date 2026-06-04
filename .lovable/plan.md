
## Phase 1 — Critical fixes (ship first)

1. **Fix the "Something went wrong" crash on the homepage.**
   Root cause: `src/lib/cms.ts` calls `supabase.from(...)` at component render. When the built bundle is missing `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, the proxy in `src/integrations/supabase/client.ts` throws synchronously and React's error boundary swallows the whole page (Hero, Team, plants, …).
   Fix: wrap every CMS read in `useCmsList`/`useSiteSettings` with a `try`/error-swallowing `queryFn` and `retry: false`, so the page falls back to the seeded defaults instead of crashing. Verify the env file in the same pass.

2. **Fix the "How you can help" button.**
   It currently links to a non-existent `#help` anchor. Build a real `GetInvolved` section (anchor `#help`) on the homepage with four cards: Donate, Volunteer field work, Partner / institutional, Share & advocate — each with a clear CTA. Mount it in `src/routes/index.tsx` between `Impact` and `Field`.

## Phase 2 — Simplified, multi-provider sign-in

Rebuild `/login` as a single clean screen ("Welcome back to ConserveTrillium") with one-tap buttons in this order: **Google**, **Apple**, **GitHub**, then an email field, then **Continue with phone (SMS)**. Remove the current sign-up/sign-in toggle — auto-create the account on first sign-in.

- **Google + Apple**: enable via Lovable Cloud managed social auth (`supabase--configure_social_auth providers: ["google","apple"]`). No keys needed from you.
- **Email**: keep magic-link only (passwordless), drops the password field entirely. Simpler than today.
- **GitHub**: NOT in Lovable Cloud's managed providers. To enable it I'll need you to register a GitHub OAuth App (Settings → Developer settings → OAuth Apps on github.com) and paste the Client ID + Client Secret — I'll store them as secrets and wire the Supabase GitHub provider. I'll add a "Coming soon" state on the GitHub button until you provide them.
- **Phone (SMS)**: Supabase needs an SMS provider. The cheapest path is Twilio — I'll add the Twilio connector. Until your Twilio number is verified, the SMS button will show "Coming soon" too.

The Nav button stays as today (Sign in → Account/Admin), but the page itself becomes the one-tap surface.

## Phase 3 — Daily-use community foundation

Big surface, so I'll build it in this order. Each step is shippable on its own; we can stop at any point.

### 3a. Plant of the Day + streaks
- New `plant_of_day` table (date, plant_id, blurb, fact). Daily server function picks a plant.
- Hero gains a "Today's plant" capsule with a "Mark as learned" button.
- `user_streaks` table (user_id, current_streak, longest_streak, last_seen_date). Streak ring + badge in the Nav.
- Public can view; signed-in users get credit and streak persistence.

### 3b. Community Feed (Facebook-style, plant-focused)
- New tables: `posts` (author, plant_id?, body, photo_url, lat, lng), `post_likes`, `post_comments`.
- `/feed` route: composer (photo + GPS + plant tag), infinite scroll, like, comment.
- Photos via existing `site-media` Storage bucket.
- RLS: anyone can read public posts; only the author can edit/delete; admins can moderate.

### 3c. AI Plant ID + Chat Botanist
- Uses Lovable AI Gateway (no key from you needed).
- `/identify`: upload a photo → `google/gemini-2.5-flash` returns species guess + confidence + conservation note. Saves the result to the user's history.
- "Ask the botanist" chat drawer (server route `/api/chat`) streaming `google/gemini-3-flash-preview`, system-primed on Himalayan medicinal flora and your publication.

### 3d. Live notifications + Direct Messages (WhatsApp-style)
- Tables: `notifications`, `conversations`, `messages`. Realtime enabled.
- Bell icon in Nav shows unread count (new comments, sighting near you, DM).
- DM drawer for one-to-one chat between signed-in users; admin can broadcast.

## Phase 4 — Polish
- New unified "Account" page consolidating profile, streak, saved plants, my posts, settings.
- Onboarding micro-tour the first time a signed-in user lands on the app.
- App-shell PWA install prompt so it feels like a real daily-use app.

## Out of scope (call out explicitly)
- Video calls.
- End-to-end encryption on DMs (standard RLS + TLS only).
- Native mobile app (web/PWA only — Lovable doesn't build native iOS/Android).
- Multilingual content.

## Technical notes (for transparency, not required reading)
- `src/lib/cms.ts` queries become resilient: each `useQuery` gets `{ retry: false, queryFn: async () => { try { … } catch { return null } } }` so a missing/forbidden Supabase call degrades to seeded defaults, not a thrown render.
- All new feature tables follow the project standard: explicit `GRANT`s, RLS on, policies scoped to `auth.uid()`, `has_role(auth.uid(), 'admin')` for admin overrides.
- New AI server logic uses `createServerFn` (Lovable AI Gateway), not Supabase Edge Functions.
- Realtime is enabled per-table with `ALTER PUBLICATION supabase_realtime ADD TABLE …`.
- GitHub provider and Twilio SMS will be wired only after you provide credentials — I'll prompt you at that moment.

## What I need from you to start
Just approval. I'll do Phase 1 + Phase 2 (Google, Apple, Email magic link) in the first build pass. After it's live we'll decide which Phase 3 block to ship next — I won't build them all in one go because reviewing them together would be unmanageable.
