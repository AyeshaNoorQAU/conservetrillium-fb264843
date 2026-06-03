
## What you'll get

**1. Expanded Field Work gallery (lightbox)**
- Add 6 new cinematic field photos to the existing mosaic (Himalayan slopes, community elders, Trillium habitat, capacity-building, herbarium work, valley trek).
- Convert the gallery to a lightbox: click any photo → fullscreen overlay with arrow-key navigation, swipe on mobile, caption, and ESC to close.
- Existing 3D tilt + Ken Burns motion stays; lightbox is layered on top.

**2. Full CMS — extend `/admin` so you can edit live**

Four new dashboard tabs added next to Announcements / Suggestions / Settings:

- **Plants** — add / edit / delete entries on `/plants` (scientific name, common name, family, habitat, properties, conservation status, image upload).
- **Team** — add / edit / remove team members and tributes (name, role, bio, photo upload, ResearchGate/social links, "founder" / "supervisor" / "project-head" badge).
- **Hero copy** — edit homepage hero headline, tagline, eyebrow text, and CTA label/href without touching code.
- **Field gallery** — upload new gallery photos, write captions/alt text, reorder, delete. Photos go straight into the lightbox grid.

All four use the same pattern: storage bucket for images + a Postgres table for content, RLS so the public reads and only admins write.

**3. Wiring on the public site**
- `Hero.tsx`, `Team.tsx`, `Plant.tsx` (`/plants`), and `Field.tsx` switch from hardcoded content to reading from the database, with the current hardcoded values seeded as defaults so nothing visually changes until you edit.
- Lovable Cloud storage bucket (`site-media`, public read) holds all uploaded images; admin uploads via the dashboard.

## Technical details

**Database (migration)**
- `plants` table: `id, slug, scientific_name, common_name, family, habitat, properties (text[]), status, image_url, sort_order, created_at`
- `team_members` table: `id, name, role, bio, photo_url, badge (founder|supervisor|project_head|member), socials (jsonb), sort_order`
- `gallery_photos` table: `id, image_url, caption, alt, sort_order, created_at`
- Extend `site_settings` with hero keys: `hero_eyebrow`, `hero_headline`, `hero_tagline`, `hero_cta_label`, `hero_cta_href` (seeded with current copy).
- RLS: public SELECT on all three tables; INSERT/UPDATE/DELETE gated by `has_role(auth.uid(), 'admin')`. GRANTs to anon (SELECT) + authenticated + service_role.
- Storage bucket `site-media` (public), with RLS policies: public SELECT, admin-only INSERT/UPDATE/DELETE.
- Seed rows from current hardcoded plant/team/gallery content so the live site is unchanged until edited.

**Frontend**
- New `src/components/site/Lightbox.tsx` — keyboard nav, focus trap, framer-motion fade/scale.
- New admin sub-components: `PlantsAdmin.tsx`, `TeamAdmin.tsx`, `HeroAdmin.tsx`, `GalleryAdmin.tsx` (file inputs upload to `site-media` then save the public URL to the row).
- `Field.tsx`, `Team.tsx`, `Hero.tsx`, `routes/plants.tsx` refactored to fetch from Supabase with TanStack Query; show seeded data on first load.
- Tab navigation in `routes/admin.tsx` expanded to 7 tabs.

**Out of scope (say the word to add)**
- Multilingual content, draft/preview workflow, version history, per-section role permissions beyond admin/non-admin.
