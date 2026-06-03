
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  scientific_name TEXT NOT NULL,
  local_name TEXT,
  family TEXT,
  altitude TEXT,
  iucn TEXT,
  uses TEXT,
  threats TEXT,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plants TO authenticated;
GRANT ALL ON public.plants TO service_role;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY plants_public_read ON public.plants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY plants_admin_all ON public.plants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  badge TEXT NOT NULL DEFAULT 'member',
  email TEXT,
  researchgate TEXT,
  initials TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_public_read ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY team_admin_all ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY gallery_public_read ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY gallery_admin_all ON public.gallery_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (key, value) VALUES
  ('hero_eyebrow', 'Pakistan Museum of Natural History · ISCF / MBZ Funded'),
  ('hero_headline_a', 'Saving the Himalayan Trillium,'),
  ('hero_headline_b', 'one valley at a time.'),
  ('hero_tagline', 'A field-led conservation initiative protecting Trillium govanianum — a critically endangered medicinal herb of the Pakistani Himalayas — through science, community stewardship, and intergenerational knowledge.'),
  ('hero_cta_primary_label', 'Discover the project'),
  ('hero_cta_primary_href', '#mission'),
  ('hero_cta_secondary_label', 'How you can help'),
  ('hero_cta_secondary_href', '#help')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.plants (slug, scientific_name, local_name, family, altitude, iucn, uses, threats, description, sort_order) VALUES
('trillium-govanianum','Trillium govanianum','Nag Chatri · Teen Patra','Melanthiaceae','2,400 – 3,300 m','Endangered','Reproductive health, anti-inflammatory, hormonal balance','Overharvesting · slow regeneration · habitat loss','A slow-growing rhizomatous perennial with a single deep-maroon bloom held above three broad leaves. The rhizome is rich in steroidal saponins and forms the focus of our flagship conservation effort.', 10),
('dactylorhiza-hatagirea','Dactylorhiza hatagirea','Salam Panja · Hatta Haddi','Orchidaceae','2,500 – 4,000 m','Critically Endangered (regional)','Tonic, aphrodisiac, wound healing, post-partum recovery','Tuber harvesting · grazing pressure · climate shift','A terrestrial orchid of subalpine meadows with a dense spike of pink-purple flowers. Its palmately-lobed tubers (the namesake hand-roots) are heavily traded in unani and ayurvedic markets.', 20),
('aconitum-heterophyllum','Aconitum heterophyllum','Atees · Patris','Ranunculaceae','2,400 – 3,800 m','Endangered','Anti-pyretic, digestive tonic, paediatric medicine','Unsustainable rootstock extraction · loss of alpine pasture','Unlike its toxic cousins, A. heterophyllum''s tuberous roots are non-poisonous and prized in traditional formulations. Populations in Pakistan''s Himalayan belt are critically thinned.', 30),
('podophyllum-hexandrum','Podophyllum hexandrum','Bankakri · Himalayan Mayapple','Berberidaceae','2,500 – 4,000 m','Endangered','Source of podophyllotoxin — precursor to anticancer drugs (etoposide, teniposide)','Pharmaceutical-grade demand · over-collection of rhizomes','A solitary herb of mossy forest floors carrying a single pale-pink cup-shaped flower beneath an umbrella-like deeply lobed leaf. Its rhizome supplies the global pipeline for semi-synthetic chemotherapy.', 40)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.team_members (name, role, badge, email, researchgate, initials, sort_order, bio) VALUES
('Ayesha Noor','Founder of ConserveTrillium · M.Phil. Researcher, Department of Plant Sciences, Quaid-i-Azam University','founder','ayesha.22413028@bps.qau.edu.pk','https://www.researchgate.net/profile/Ayesha-Noor-14','AN',1,'I built ConserveTrillium to give Pakistan''s endangered Himalayan medicinal flora a voice on the open web — a place where field photographs, traditional knowledge, peer-reviewed science, and student learning can meet. This is more than a website; it is a small act of stewardship for plants that have healed our communities for centuries.'),
('Dr. Rizwana Khanum','Project Director (PD) — Co-Author','project_head','rizvana.khan@gmail.com','https://www.researchgate.net/profile/Rizwana-Khanum-3','RK',10,NULL),
('Dr. Amir Hussain','Assistant in Project Activities, PMNH','member',NULL,NULL,'AH',20,NULL),
('Syed Munir Hussain','Sr. Collection In-Charge, PMNH','member',NULL,NULL,'SM',30,NULL),
('Mr. Sabih-ul-Hassan','Project-Recruited Field Worker','member',NULL,NULL,'SH',40,NULL),
('Dr. Mushtaq Ahmad','Academic Supervisor — Department of Plant Sciences, Quaid-i-Azam University','supervisor',NULL,'https://www.researchgate.net/profile/Mushtaq-Ahmad-48','MA',100,'With profound gratitude, I dedicate this work to my esteemed supervisor, whose scholarly wisdom and gentle mentorship have been a guiding light throughout my research journey. His patience, vision, and unwavering belief in ethnobotanical science have shaped every step of this endeavour. It is a privilege to learn under his care.');

CREATE TRIGGER plants_updated_at BEFORE UPDATE ON public.plants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
