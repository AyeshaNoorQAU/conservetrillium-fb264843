
-- plant_of_day: one row per date, picks a plant to feature
CREATE TABLE public.plant_of_day (
  for_date DATE PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  blurb TEXT,
  fact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plant_of_day TO anon, authenticated;
GRANT ALL ON public.plant_of_day TO service_role;
ALTER TABLE public.plant_of_day ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plant_of_day public read" ON public.plant_of_day FOR SELECT USING (true);
CREATE POLICY "plant_of_day admin write" ON public.plant_of_day FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_streaks: one row per user
CREATE TABLE public.user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_seen_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_streaks TO authenticated;
GRANT ALL ON public.user_streaks TO service_role;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_streaks own read" ON public.user_streaks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "user_streaks own write" ON public.user_streaks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_streaks own update" ON public.user_streaks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_plant_log: composite PK (user_id, log_date) so user can only credit once per day
CREATE TABLE public.user_plant_log (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, log_date)
);
GRANT SELECT, INSERT ON public.user_plant_log TO authenticated;
GRANT ALL ON public.user_plant_log TO service_role;
ALTER TABLE public.user_plant_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_plant_log own read" ON public.user_plant_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "user_plant_log own insert" ON public.user_plant_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
