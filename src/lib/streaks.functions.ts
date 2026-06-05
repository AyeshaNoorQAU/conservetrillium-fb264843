import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Public: today's plant of the day (or null)
export const getPlantOfDay = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const today = todayISO();
  let { data: pod } = await supabaseAdmin
    .from("plant_of_day")
    .select("for_date, blurb, fact, plant_id, plants(id, scientific_name, local_name, image_url, slug, description)")
    .eq("for_date", today)
    .maybeSingle();

  // Lazy-create today's pick if missing: pick a random plant.
  if (!pod) {
    const { data: plants } = await supabaseAdmin
      .from("plants")
      .select("id")
      .order("sort_order", { ascending: true })
      .limit(50);
    if (plants && plants.length > 0) {
      const pick = plants[Math.floor(Math.random() * plants.length)];
      await supabaseAdmin.from("plant_of_day").insert({
        for_date: today,
        plant_id: pick.id,
      });
      const refetch = await supabaseAdmin
        .from("plant_of_day")
        .select("for_date, blurb, fact, plant_id, plants(id, scientific_name, local_name, image_url, slug, description)")
        .eq("for_date", today)
        .maybeSingle();
      pod = refetch.data;
    }
  }

  return { plantOfDay: pod };
});

// Auth: current user's streak summary
export const getMyStreak = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = todayISO();
    const { data: streak } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak, last_seen_date")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: logToday } = await supabase
      .from("user_plant_log")
      .select("log_date")
      .eq("user_id", userId)
      .eq("log_date", today)
      .maybeSingle();

    // 30-day dot calendar
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 29);
    const { data: recent } = await supabase
      .from("user_plant_log")
      .select("log_date")
      .eq("user_id", userId)
      .gte("log_date", since.toISOString().slice(0, 10));

    return {
      current: streak?.current_streak ?? 0,
      longest: streak?.longest_streak ?? 0,
      lastSeen: streak?.last_seen_date ?? null,
      learnedToday: !!logToday,
      recentDates: (recent ?? []).map((r) => r.log_date as string),
    };
  });

// Auth: mark today's plant as learned
export const markLearned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const today = todayISO();
    const yest = yesterdayISO();

    const { data: pod } = await supabaseAdmin
      .from("plant_of_day")
      .select("plant_id")
      .eq("for_date", today)
      .maybeSingle();
    if (!pod) throw new Error("No plant selected for today yet");

    // Insert log (idempotent via composite PK)
    await supabase
      .from("user_plant_log")
      .insert({ user_id: userId, log_date: today, plant_id: pod.plant_id })
      .select()
      .maybeSingle();

    // Update streak
    const { data: existing } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak, last_seen_date")
      .eq("user_id", userId)
      .maybeSingle();

    let current = 1;
    let longest = 1;
    if (existing) {
      if (existing.last_seen_date === today) {
        current = existing.current_streak;
      } else if (existing.last_seen_date === yest) {
        current = (existing.current_streak ?? 0) + 1;
      } else {
        current = 1;
      }
      longest = Math.max(existing.longest_streak ?? 0, current);
    }

    await supabase.from("user_streaks").upsert({
      user_id: userId,
      current_streak: current,
      longest_streak: longest,
      last_seen_date: today,
      updated_at: new Date().toISOString(),
    });

    return { current, longest };
  });
