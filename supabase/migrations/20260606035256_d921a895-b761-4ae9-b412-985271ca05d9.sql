
CREATE TABLE public.plant_identifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  species TEXT,
  confidence TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.plant_identifications TO authenticated;
GRANT ALL ON public.plant_identifications TO service_role;
ALTER TABLE public.plant_identifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ident own read" ON public.plant_identifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "ident own insert" ON public.plant_identifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ident own delete" ON public.plant_identifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
