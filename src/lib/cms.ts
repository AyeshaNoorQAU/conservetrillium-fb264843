import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Client-side fetch hook that returns null during SSR/initial render to avoid
// hydration mismatches. Components should render their default content first,
// then swap when `data` arrives.
export function useCmsList<T>(
  table: "plants" | "team_members" | "gallery_photos",
  orderBy = "sort_order",
) {
  const [data, setData] = useState<T[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: true })
      .then(({ data }) => {
        if (!cancelled && data) setData(data as T[]);
      });
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
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        if (cancelled || !data) return;
        const m: Record<string, string> = {};
        for (const r of data as { key: string; value: string }[]) m[r.key] = r.value;
        setMap(m);
      });
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
