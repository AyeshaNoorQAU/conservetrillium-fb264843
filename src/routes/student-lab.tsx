import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Tilt3D } from "@/components/site/Tilt3D";
import {
  ArrowLeft, Sparkles, RotateCw, CheckCircle2, XCircle, Brain, Microscope,
  Mountain, Beaker, FlaskConical, Leaf, Trophy, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/student-lab")({
  head: () => ({
    meta: [
      { title: "Student Lab — Interactive Botany | ConserveTrillium" },
      { name: "description", content: "A first-of-its-kind interactive lab for students of ethnobotany and conservation: 3D flashcards, an altitude explorer, a saponin builder, and a knowledge gauntlet." },
    ],
  }),
  component: StudentLab,
});

/* ---------- 3D flip flashcards ---------- */
type Card = { term: string; tag: string; back: string; emoji: string };
const cards: Card[] = [
  { term: "Trillium govanianum", tag: "Species", emoji: "🌸", back: "Rhizomatous Melanthiaceae perennial of Himalayan forests, 2,400–3,300 m. Single maroon trillium flower above three whorled leaves." },
  { term: "Steroidal Saponins", tag: "Phytochemistry", emoji: "⚗️", back: "Govanoside A and related saponins drive anti-inflammatory and anti-cancer bioactivity — chiefly extracted from the rhizome." },
  { term: "Ex-situ Conservation", tag: "Strategy", emoji: "🌱", back: "Off-site preservation in botanic gardens, seed banks and tissue-culture labs — complements in-situ protection against catastrophic loss." },
  { term: "MaxEnt Modelling", tag: "GIS", emoji: "🗺️", back: "Maximum-entropy SDM uses presence-only occurrences + bioclimatic layers to map suitable habitat — guiding where to act." },
  { term: "Use-Value (UV)", tag: "Ethnobotany", emoji: "📊", back: "UV = Σ(uses reported by informants) / N. Quantifies local importance of a species in traditional knowledge surveys." },
  { term: "IUCN Red List", tag: "Policy", emoji: "🛡️", back: "Global authority on extinction risk: LC → NT → VU → EN → CR → EW → EX. Trillium govanianum is listed Endangered." },
];

function Flashcards() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    const c = new Set(flipped);
    c.has(i) ? c.delete(i) : c.add(i);
    setFlipped(c);
  };
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, i) => (
        <div key={card.term} className="group/tilt [perspective:1200px]">
          <Tilt3D max={10}>
            <button
              onClick={() => toggle(i)}
              className="relative w-full aspect-[4/5] [transform-style:preserve-3d] transition-transform duration-700 cursor-pointer"
              style={{ transform: flipped.has(i) ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-6 flex flex-col justify-between text-left shadow-[var(--shadow-soft)]">
                <div className="text-5xl">{card.emoji}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{card.tag}</p>
                  <p className="mt-2 text-display text-2xl text-foreground leading-tight">{card.term}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Tap to reveal</p>
                </div>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 flex flex-col justify-center text-left shadow-[var(--shadow-elevated)]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{card.tag}</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{card.back}</p>
              </div>
            </button>
          </Tilt3D>
        </div>
      ))}
    </div>
  );
}

/* ---------- Altitude Explorer ---------- */
const zones = [
  { min: 1500, max: 2400, name: "Sub-tropical pine", species: ["Pinus roxburghii", "Olea ferruginea"], color: "var(--accent)" },
  { min: 2400, max: 3300, name: "Temperate moist forest", species: ["Trillium govanianum", "Aconitum heterophyllum"], color: "var(--moss)" },
  { min: 2500, max: 4000, name: "Sub-alpine meadows", species: ["Dactylorhiza hatagirea", "Podophyllum hexandrum"], color: "var(--primary)" },
  { min: 4000, max: 5000, name: "Alpine cushion", species: ["Saussurea spp.", "Rhododendron anthopogon"], color: "var(--ember)" },
];

function AltitudeExplorer() {
  const [alt, setAlt] = useState(2800);
  const active = zones.filter((z) => alt >= z.min && alt <= z.max);

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-center">
      <div className="lg:col-span-2">
        <div className="relative h-[440px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#bcd7e6] via-[#a8c5a3] to-[#5a7a4f] border border-border">
          {/* mountain silhouettes */}
          <svg viewBox="0 0 200 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polygon points="0,300 40,140 80,220 120,80 170,200 200,160 200,300" fill="rgba(255,255,255,0.18)" />
            <polygon points="0,300 30,200 70,260 110,180 160,250 200,220 200,300" fill="rgba(0,0,0,0.15)" />
          </svg>
          {/* altitude marker */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-white/90 transition-all duration-500"
            style={{ bottom: `${((alt - 1500) / 3500) * 100}%` }}
          >
            <span className="absolute -top-7 left-3 px-2 py-0.5 rounded-md bg-background/90 text-foreground text-xs font-medium shadow">
              {alt.toLocaleString()} m
            </span>
          </div>
        </div>
        <input
          type="range" min={1500} max={5000} step={50} value={alt}
          onChange={(e) => setAlt(Number(e.target.value))}
          className="mt-4 w-full accent-[var(--primary)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1,500 m</span><span>5,000 m</span>
        </div>
      </div>
      <div className="lg:col-span-3 space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Active vegetation zones at {alt.toLocaleString()} m</p>
        {active.length === 0 && <p className="text-muted-foreground">No active zone — move the slider.</p>}
        {active.map((z) => (
          <div key={z.name} className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ background: `var(--${z.color === "var(--primary)" ? "primary" : z.color === "var(--moss)" ? "moss" : z.color === "var(--accent)" ? "accent" : "ember"})` }} />
              <h4 className="text-display text-xl">{z.name}</h4>
              <span className="ml-auto text-xs text-muted-foreground">{z.min}–{z.max} m</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Indicator species: <em>{z.species.join(", ")}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Saponin "molecule" builder (visual) ---------- */
function SaponinBuilder() {
  const [sugars, setSugars] = useState(3);
  const [hydroxyl, setHydroxyl] = useState(2);
  const bioactivity = Math.min(100, Math.round((sugars * 12 + hydroxyl * 10) * 0.95));
  const solubility = Math.min(100, Math.round((sugars * 18 - hydroxyl * 2 + 10)));

  const positions = useMemo(
    () => Array.from({ length: sugars }, (_, i) => {
      const angle = (i / sugars) * Math.PI * 2 - Math.PI / 2;
      return { x: 50 + Math.cos(angle) * 32, y: 50 + Math.sin(angle) * 32 };
    }),
    [sugars],
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <Tilt3D max={14}>
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary via-card to-secondary/40 border border-border p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)" }} />
          <svg viewBox="0 0 100 100" className="relative w-full h-full">
            {positions.map((p, i) => (
              <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke="hsl(var(--foreground))" strokeOpacity="0.25" strokeWidth="0.7" />
            ))}
            <circle cx="50" cy="50" r="11" fill="var(--moss)" />
            <text x="50" y="52" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">Aglycone</text>
            {positions.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6" fill="var(--accent)" />
                <text x={p.x} y={p.y + 1.5} textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" fontWeight="bold">Sugar</text>
              </g>
            ))}
            {Array.from({ length: hydroxyl }).map((_, i) => {
              const a = (i / Math.max(hydroxyl, 1)) * Math.PI * 2;
              const x = 50 + Math.cos(a) * 16; const y = 50 + Math.sin(a) * 16;
              return <circle key={i} cx={x} cy={y} r="2.4" fill="var(--ember)" />;
            })}
          </svg>
        </div>
      </Tilt3D>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Build a saponin</p>
        <h3 className="text-display text-2xl">See how structure changes bioactivity</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Trillium's govanoside A is a steroidal saponin: an aglycone core with sugar chains.
          Adjust the molecule and watch predicted properties shift.
        </p>
        <div className="mt-6 space-y-5">
          <Slider label="Sugar units" value={sugars} min={1} max={6} onChange={setSugars} />
          <Slider label="Hydroxyl groups" value={hydroxyl} min={0} max={6} onChange={setHydroxyl} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Bar label="Bioactivity" value={bioactivity} color="var(--moss)" />
          <Bar label="Water solubility" value={solubility} color="var(--primary)" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground italic">
          Educational simulation — not a substitute for analytical chemistry.
        </p>
      </div>
    </div>
  );
}
function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
    </div>
  );
}
function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

/* ---------- Knowledge Gauntlet ---------- */
type Q = { q: string; opts: string[]; correct: number; why: string };
const questions: Q[] = [
  { q: "Which family does Trillium govanianum belong to?", opts: ["Liliaceae", "Melanthiaceae", "Orchidaceae", "Ranunculaceae"], correct: 1, why: "Once placed in Liliaceae, Trillium is now classified within Melanthiaceae based on molecular phylogenetics." },
  { q: "What is the chief bioactive class in T. govanianum rhizomes?", opts: ["Alkaloids", "Tannins", "Steroidal saponins", "Flavonoids"], correct: 2, why: "Steroidal saponins — chiefly govanoside A — underpin its medicinal and economic value." },
  { q: "What altitude range does it primarily occupy in Pakistan?", opts: ["500–1,500 m", "1,800–2,200 m", "2,400–3,300 m", "4,500–5,500 m"], correct: 2, why: "Moist temperate forests at 2,400–3,300 m form its core habitat in the western Himalayas." },
  { q: "Which threat is most acute for T. govanianum populations?", opts: ["Wildfire", "Unsustainable rhizome harvesting", "Air pollution", "Coastal erosion"], correct: 1, why: "Underground rhizome harvest removes the whole genet — and the species takes years to mature." },
  { q: "Use-Value (UV) in ethnobotany measures…", opts: ["Plant biomass", "Species per quadrat", "Relative importance from informant reports", "Soil pH preference"], correct: 2, why: "UV = Σ uses reported / N informants — a standard quantitative ethnobotany metric." },
  { q: "Which conservation approach grows plants outside their natural habitat?", opts: ["In-situ", "Ex-situ", "Reintroduction", "Translocation"], correct: 1, why: "Ex-situ conservation (gardens, gene banks, tissue culture) safeguards against catastrophic in-situ loss." },
];

function Gauntlet() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= questions.length;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-10">
        <Trophy className="w-12 h-12 mx-auto text-accent" />
        <h3 className="mt-4 text-display text-3xl">You scored {score} / {questions.length}</h3>
        <p className="mt-2 text-muted-foreground">
          {pct === 100 ? "Outstanding — you're ready for the field." : pct >= 70 ? "Strong showing. Review the explanations and try again." : "A great start. The flashcards above will help."}
        </p>
        <button onClick={() => { setI(0); setPicked(null); setScore(0); }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm">
          <RotateCw className="w-4 h-4" /> Restart gauntlet
        </button>
      </div>
    );
  }
  const Q = questions[i];

  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-3">
        <span>Question {i + 1} / {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-6">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(i / questions.length) * 100}%` }} />
      </div>
      <h3 className="text-display text-2xl text-foreground mb-5">{Q.q}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {Q.opts.map((o, oi) => {
          const isCorrect = picked !== null && oi === Q.correct;
          const isWrong = picked === oi && oi !== Q.correct;
          return (
            <button
              key={oi}
              disabled={picked !== null}
              onClick={() => { setPicked(oi); if (oi === Q.correct) setScore((s) => s + 1); }}
              className={`text-left p-4 rounded-xl border transition-all ${
                isCorrect ? "border-[var(--moss)] bg-[var(--moss)]/10"
                : isWrong ? "border-ember bg-ember/10"
                : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{o}</span>
                {isCorrect && <CheckCircle2 className="w-4 h-4 text-[var(--moss)]" />}
                {isWrong && <XCircle className="w-4 h-4 text-ember" />}
              </div>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-5 p-4 rounded-xl bg-secondary/60 border border-border">
          <p className="text-sm text-foreground"><strong>Why:</strong> {Q.why}</p>
          <button onClick={() => { setI((n) => n + 1); setPicked(null); }} className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Glossary search ---------- */
const glossary = [
  { term: "Aglycone", def: "The non-sugar portion of a glycoside molecule (e.g. the steroidal core of govanoside A)." },
  { term: "Allelopathy", def: "Chemical inhibition of one plant by another via released metabolites." },
  { term: "Endemic", def: "Native and restricted to a particular geographic region." },
  { term: "Genet", def: "A genetically distinct individual; for rhizomatous plants, the whole underground clone." },
  { term: "Habitat suitability", def: "Modelled probability that a location can sustain a given species." },
  { term: "Phytochemistry", def: "The study of chemicals derived from plants." },
  { term: "Rhizome", def: "A horizontal underground stem from which roots and shoots arise." },
  { term: "Sympatric", def: "Occurring in the same geographic area without interbreeding." },
];

function Glossary() {
  const [q, setQ] = useState("");
  const filtered = glossary.filter((g) => g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the field glossary…"
        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm"
      />
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {filtered.map((g) => (
          <div key={g.term} className="p-4 rounded-xl bg-card border border-border">
            <p className="text-display text-lg text-foreground">{g.term}</p>
            <p className="text-sm text-muted-foreground mt-1">{g.def}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No matches.</p>}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
const sectionsList = [
  { id: "flashcards", label: "3D Flashcards", icon: Sparkles },
  { id: "altitude", label: "Altitude Explorer", icon: Mountain },
  { id: "saponin", label: "Saponin Builder", icon: FlaskConical },
  { id: "gauntlet", label: "Knowledge Gauntlet", icon: Brain },
  { id: "glossary", label: "Field Glossary", icon: Microscope },
];

function StudentLab() {
  const [active, setActive] = useState("flashcards");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <header className="max-w-3xl mb-12 fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">First-of-its-kind · Pakistan</p>
            <h1 className="text-display text-5xl lg:text-7xl leading-[1.02] text-balance">
              The <span className="italic text-[var(--moss)]">Student Lab</span> — interactive ethnobotany for the curious.
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Flip 3D flashcards, climb the Himalayan altitude gradient, assemble a saponin molecule,
              and test yourself in the knowledge gauntlet. Built so students of plant sciences,
              pharmacology, and conservation can <em>do</em> botany, not just read it.
            </p>
          </header>

          {/* sticky nav */}
          <div className="sticky top-16 z-30 -mx-6 px-6 py-3 bg-background/85 backdrop-blur border-y border-border mb-12 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {sectionsList.map((s) => (
                <a
                  key={s.id} href={`#${s.id}`}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                    active === s.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" /> {s.label}
                </a>
              ))}
            </div>
          </div>

          <section ref={(el) => { refs.current["flashcards"] = el; }} id="flashcards" className="scroll-mt-32 mb-24">
            <SectionHeader icon={Sparkles} kicker="Module 01" title="3D Flashcards" sub="Tap to flip. Hover for parallax." />
            <Flashcards />
          </section>

          <section ref={(el) => { refs.current["altitude"] = el; }} id="altitude" className="scroll-mt-32 mb-24">
            <SectionHeader icon={Mountain} kicker="Module 02" title="Altitude Explorer" sub="Drag the slider to see which species share an altitudinal niche." />
            <AltitudeExplorer />
          </section>

          <section ref={(el) => { refs.current["saponin"] = el; }} id="saponin" className="scroll-mt-32 mb-24">
            <SectionHeader icon={FlaskConical} kicker="Module 03" title="Saponin Builder" sub="Add sugars and hydroxyl groups; see bioactivity respond." />
            <SaponinBuilder />
          </section>

          <section ref={(el) => { refs.current["gauntlet"] = el; }} id="gauntlet" className="scroll-mt-32 mb-24">
            <SectionHeader icon={Brain} kicker="Module 04" title="Knowledge Gauntlet" sub="Six questions. Instant feedback with the reasoning behind each answer." />
            <div className="max-w-3xl p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
              <Gauntlet />
            </div>
          </section>

          <section ref={(el) => { refs.current["glossary"] = el; }} id="glossary" className="scroll-mt-32 mb-12">
            <SectionHeader icon={Microscope} kicker="Module 05" title="Field Glossary" sub="Search terms you'll encounter in fieldwork and publications." />
            <div className="max-w-3xl">
              <Glossary />
            </div>
          </section>

          <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary border border-primary/30 text-center">
            <Leaf className="w-8 h-8 mx-auto text-primary" />
            <h3 className="mt-3 text-display text-2xl">Want a topic added to the lab?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Drop a suggestion on the home page — every idea reaches Ayesha directly.</p>
            <Link to="/" hash="contact" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm">
              <Beaker className="w-4 h-4" /> Suggest a module
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeader({ icon: Icon, kicker, title, sub }: { icon: React.ElementType; kicker: string; title: string; sub: string }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="grid place-items-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent">{kicker}</p>
        <h2 className="text-display text-3xl sm:text-4xl text-foreground leading-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}
