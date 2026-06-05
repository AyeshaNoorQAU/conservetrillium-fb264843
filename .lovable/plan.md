
# Phase 3 — Daily-use app, all four blocks

You picked all four. I'll build them in this order so each one is shippable and reviewable on its own. After every block I'll pause briefly so you can poke at it before I start the next.

---

## Block A — Plant of the Day + streaks (smallest, ship first)

**What you'll see**
- A new "Today's plant" capsule on the homepage hero with photo, name, one-line fact, and a **Mark as learned** button (signed-in only; signed-out users see "Sign in to start a streak").
- A streak ring + number badge in the Nav (next to the Sign in / Account button) showing current streak.
- A tiny `/streak` page with current streak, longest streak, and a 30-day dot calendar.

**Database**
- `plant_of_day` (date PK, plant_id FK, blurb, fact). One row per day.
- `user_streaks` (user_id PK, current_streak, longest_streak, last_seen_date).
- `user_plant_log` (user_id, date, plant_id) — composite PK (user_id, date) so a user can only credit once per day.
- All three: RLS on, GRANTs to authenticated + service_role, public SELECT on `plant_of_day` only.

**Server**
- `pickPlantOfDay` cron route at `/api/public/hooks/plant-of-day` (pg_cron daily at 00:05 UTC). Picks a plant that hasn't been used in the last 30 days.
- `markLearned` server fn (auth required): inserts into `user_plant_log`, bumps streak if `last_seen_date = today - 1`, resets to 1 otherwise.

---

## Block B — Community Feed (Facebook-style, plant-focused)

**What you'll see**
- New `/feed` route in the main nav.
- Composer at top: textarea + optional photo + optional plant tag (dropdown of existing plants) + optional GPS (browser geolocation, opt-in).
- Infinite-scroll list of post cards: author avatar/name, time, body, photo, plant chip, like button, comment count, "view comments" expander.
- Comment thread inline. Edit/delete own posts. Admin can hide any post.

**Database**
- `posts` (id, author_id, plant_id?, body, photo_url?, lat?, lng?, created_at, hidden bool).
- `post_likes` (post_id, user_id) — composite PK.
- `post_comments` (id, post_id, author_id, body, created_at).
- RLS: anyone signed-in can read non-hidden posts; only author can update/delete own; admin can update `hidden`.
- Photos go into existing `site-media` bucket under `posts/{user_id}/{uuid}.jpg`.

---

## Block C — AI Plant ID + Chat Botanist (Lovable AI Gateway, no keys from you)

**What you'll see**
- New `/identify` route: drop a photo → spinner → result card with species guess, confidence, conservation note, and a "Save to my sightings" button.
- A floating "Ask the botanist" chat button bottom-right of the site → opens a drawer with streamed responses, system-primed on Himalayan medicinal flora + the project's publication.

**Server (TanStack)**
- `identifyPlant` server fn: accepts base64 image, calls `google/gemini-3-flash-preview` (multimodal) via Lovable AI Gateway, returns `{species, confidence, note}`. Stores result in `plant_identifications` table.
- `/api/chat` server route: streaming chat via AI SDK + `createLovableAiGatewayProvider`, default model `google/gemini-3-flash-preview`, system prompt scoped to Himalayan flora.
- `plant_identifications` (id, user_id, image_url, species, confidence, note, created_at). RLS: own rows only.

---

## Block D — Live notifications + Direct Messages (WhatsApp-style)

**What you'll see**
- Bell icon in Nav with unread red dot. Click opens a dropdown listing recent notifications (new comment on your post, new DM, admin broadcast).
- New `/messages` route: left rail of conversations, right pane of messages, composer at bottom. Realtime updates with no refresh.
- Click any author's name anywhere → "Message" button → opens or starts a DM.

**Database**
- `notifications` (id, user_id, kind, payload jsonb, read_at, created_at).
- `conversations` (id, created_at), `conversation_members` (conversation_id, user_id) — composite PK.
- `messages` (id, conversation_id, author_id, body, created_at).
- Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE notifications, messages;`
- RLS: a user can read notifications where `user_id = auth.uid()`; can read messages where they are a member of the conversation.

---

## Cross-cutting / constraints

- All new tables follow project standard: explicit `GRANT`s, RLS on, `auth.uid()`-scoped policies, `has_role(auth.uid(), 'admin')` overrides for moderation.
- AI calls use `createServerFn` + Lovable AI Gateway (no key from you needed). `LOVABLE_API_KEY` already exists.
- New routes are public for read-only views and gated with inline "Sign in to X" CTAs for write actions — no full `_authenticated/` subtree, to keep OG sharing intact.
- Photo uploads reuse the existing private `site-media` bucket with new path prefixes (`posts/`, `identifications/`).
- No video calls, no E2E encryption on DMs, no native mobile, no multilingual — same out-of-scope items as before.

## Order of work

I'll do **Block A** first (smallest, gives the daily habit hook). After it's live and you've poked at it, I'll do **B**, then **C**, then **D**. Each block is one migration + the UI + a short test pass.

Approve and I'll start with Block A.
