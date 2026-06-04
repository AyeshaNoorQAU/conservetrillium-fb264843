import { useEffect, useState } from "react";

// Client-side fetch hook. Uses a dynamic import + try/catch so a missing
// Supabase env var or transient network error degrades to seeded defaults
// instead of crashing the whole page.
export function useCmsList<T>(
  table: "plants" | "team_members" | "gallery_photos",
  orderBy = "sort_order",
) {
  const [data, setData] = useState<T[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from(table)
          .select("*")
          .order(orderBy, { ascending: true });
        if (!cancelled && data) setData(data as T[]);
      } catch (err) {
        // Swallow: defaults remain visible.
        console.warn(`[cms] ${table} fetch failed; using defaults.`, err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table, orderBy]);
  return data;
}

export function useSiteSettings() {
  const [map, setMap] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase.from("site_settings").select("key,value");
        if (cancelled || !data) return;
        const m: Record<string, string> = {};
        for (const r of data as { key: string; value: string }[]) m[r.key] = r.value;
        setMap(m);
      } catch (err) {
        console.warn("[cms] site_settings fetch failed; using defaults.", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return map;
}

export type PlantRow = {
  id: string;
  slug: string;
  scientific_name: string;
  local_name: string | null;
  family: string | null;
  altitude: string | null;
  iucn: string | null;
  uses: string | null;
  threats: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type TeamRow = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  badge: "founder" | "supervisor" | "project_head" | "member" | string;
  email: string | null;
  researchgate: string | null;
  initials: string | null;
  sort_order: number;
};

export type GalleryRow = {
  id: string;
  image_url: string;
  caption: string | null;
  alt: string | null;
  sort_order: number;
};
