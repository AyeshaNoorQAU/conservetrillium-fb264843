## What's going wrong

Console logs show the Supabase client is throwing `Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY` from the published preview bundle. The `cms.ts` calls catch this, but several newer call sites do NOT and bubble the throw up to the root `errorComponent` — which renders the "This page didn't load" screen the session replay shows.

Likely culprits (all introduced in the Phase 3 batch):
1. `useAuth` calls `supabase.auth.onAuthStateChange(...)` inside `useEffect` with no try/catch. When the Proxy in `client.ts` is hit and the env vars are missing, this throws synchronously and bubbles into React.
2. `NotificationBell`, `ChatBotanist`, and various route files (`/feed`, `/identify`, `/messages`, `/streak`) touch `supabase.*` at runtime with no guard.
3. `PlantOfDay` calls server functions via `useServerFn`; on the static preview these 404 and, depending on react-query state, can re-throw despite `retry: false`.

The root cause is two-layered: the preview build was produced when `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` were not yet baked in, AND the new code added in Phase 3 has no defensive handling around Supabase access.

## Fix plan

### 1. Make the Supabase client never throw on missing env
- In `src/integrations/supabase/client.ts`, when env vars are missing, log a warning ONCE and return a stub client whose method calls reject with a typed error instead of throwing synchronously from a Proxy `get`. Async failures are catchable by react-query, listeners, and `try/catch`; synchronous throws from a Proxy are what blow up render paths.
- Stub shape: `auth.onAuthStateChange` returns `{ data: { subscription: { unsubscribe(){} } } }`, `auth.getSession` resolves `{ data: { session: null } }`, `from(...).select(...)` chain resolves `{ data: [], error: <env-missing> }`, `channel(...).on(...).subscribe()` returns a no-op channel. This keeps the UI alive with empty state.

### 2. Harden `useAuth`
- Wrap the `onAuthStateChange` and `getSession` calls in try/catch so any future Proxy/throw cannot break the React tree. On failure, treat as signed-out and `setLoading(false)`.

### 3. Isolate Phase 3 widgets behind a small error boundary
- Add a tiny `<SafeBoundary fallback={null}>` wrapper (React `componentDidCatch` class) in `src/components/site/SafeBoundary.tsx`.
- Wrap `<PlantOfDay />`, `<NotificationBell />`, the streak chip in `Nav`, and `<ChatBotanist />` so a future render failure in any of them degrades to nothing instead of crashing the page.

### 4. Make the chat transport lazy
- Move `new DefaultChatTransport(...)` from module scope into `useMemo` inside `ChatBotanist` so any future SSR-incompatible behavior in `ai-sdk` can't break module init.

### 5. Make Phase 3 server-function queries fully fail-soft
- `PlantOfDay`, `Nav` streak chip, and `streak.tsx` already use `retry: false`. Add explicit `try/catch` inside the `queryFn` that returns `null`/`{ current: 0, ... }` rather than re-throwing, so react-query never enters an error state that can surface to the boundary.

### 6. Rebuild the preview
- After the code fixes, the existing preview bundle will still be the stale one with missing env vars baked in. A fresh build (next message turn auto-builds) will inline the now-present `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` and the cms warnings will also disappear.

## Files touched

- `src/integrations/supabase/client.ts` — stub-on-missing-env (carefully; this file is normally auto-gen, but the fix is the smallest viable change here).
- `src/hooks/use-auth.ts` — try/catch around auth calls.
- `src/components/site/SafeBoundary.tsx` — new.
- `src/components/site/Nav.tsx` — wrap streak chip + NotificationBell in SafeBoundary; soft-fail streak query.
- `src/components/site/PlantOfDay.tsx` — soft-fail queryFns.
- `src/components/site/ChatBotanist.tsx` — lazy transport via useMemo.
- `src/routes/__root.tsx` — wrap `<ChatBotanist />` in SafeBoundary.

## Verification

- Reload the homepage; no "This page didn't load" screen.
- Console no longer shows uncaught Supabase env errors (only at most one warning).
- Nav, hero, plant-of-day, get-involved, contact all render with their seeded defaults even if Supabase is unreachable.
- Signed-in flows (streak, notifications, chat) still work in the live dev preview.
