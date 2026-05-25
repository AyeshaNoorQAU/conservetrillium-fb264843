import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  ArrowLeft, FlaskConical, Calculator, Sparkles, TreePine,
  Ruler, Microscope, CheckCircle2, RotateCw, Mountain, Droplet,
} from "lucide-react";

export const Route = createFileRoute("/student-lab")({
  head: () => ({
    meta: [
      { title: "Student Lab — Interactive Conservation Tools | ConserveTrillium" },
      {
        name: "description",
        content:
          "A free interactive teaching lab for botany and conservation students — calculate Use Value, simulate population viability, identify Himalayan species, and explore field methods.",
      },
      { property: "og:title", content: "Student Lab — ConserveTrillium" },
      {
        property: "og:description",
        content:
          "Interactive simulators and quizzes for students of ethnobotany and conservation.",
      },
    ],
  }),
  component: StudentLabPage,
});

function StudentLabPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <header className="max-w-3xl mb-16 fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6 inline-flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5" /> Student Lab · free & interactive
            </p>
            <h1 className="text-display text-5xl lg:text-7xl leading-[1.02] text-balance">
              Practise the science.{" "}
              <span className="italic text-[var(--moss)]">
                Before the field calls you.
              </span>
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Five mini-labs built for undergraduates and early researchers in
              botany, ethnobiology, and conservation. Everything runs in your
              browser — no installs, no logins.
            </p>
          </header>

          {/* Lab grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <LabCard icon={Calculator} title="Lab 01 · Use Value Calculator" subtitle="Quantitative ethnobotany">
              <UseValueLab />
            </LabCard>

            <LabCard icon={TreePine} title="Lab 02 · Population Viability Simulator" subtitle="Conservation modelling">
              <PopulationLab />
            </LabCard>

            <LabCard icon={Microscope} title="Lab 03 · Identify the Specimen" subtitle="Field taxonomy drill">
              <IdentifyLab />
            </LabCard>

            <LabCard icon={Mountain} title="Lab 04 · Altitudinal Zoner" subtitle="Bioclimatic intuition">
              <AltitudeLab />
            </LabCard>

            <LabCard icon={Ruler} title="Lab 05 · Quadrat Sampling Workshop" subtitle="Field method primer" wide>
              <QuadratLab />
            </LabCard>
          </div>

          {/* Footer note */}
          <div className="mt-16 p-7 rounded-2xl border border-border bg-secondary/40 text-sm text-muted-foreground leading-relaxed">
            <Sparkles className="w-4 h-4 text-accent inline mr-1.5 -mt-0.5" />
            These simulations are simplified for teaching. Real-world conservation
            decisions combine empirical data, ecological modelling, and community
            consultation. If you want to contribute proper field data, reach out
            via the contact section on the home page — we welcome QAU and
            partner-university interns.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LabCard({
  icon: Icon, title, subtitle, children, wide,
}: {
  icon: any; title: string; subtitle: string; children: React.ReactNode; wide?: boolean;
}) {
  return (
    <section
      className={`fade-up p-7 lg:p-9 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] transition-all ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="grid place-items-center w-11 h-11 rounded-full bg-primary/10 text-primary shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-display text-xl lg:text-2xl text-foreground leading-tight">
            {title}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ---------- Lab 1: Use Value ---------- */
function UseValueLab() {
  const [uses, setUses] = useState(7);
  const [informants, setInformants] = useState(12);
  const uv = informants > 0 ? (uses / informants).toFixed(3) : "0.000";
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Use Value (Phillips & Gentry, 1993):{" "}
        <code className="text-foreground">UV = ΣU / N</code>. Vary the inputs:
      </p>
      <Slider label="Total use-citations (U)" value={uses} min={0} max={50} onChange={setUses} />
      <Slider label="Number of informants (N)" value={informants} min={1} max={50} onChange={setInformants} />
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-primary to-[var(--moss)] text-primary-foreground">
        <div className="text-[11px] uppercase tracking-widest opacity-80">Use Value</div>
        <div className="text-display text-4xl mt-1">{uv}</div>
        <p className="text-[11px] mt-2 opacity-80">
          {Number(uv) > 1
            ? "High cultural importance — species is widely cited across multiple uses."
            : Number(uv) > 0.5
            ? "Moderate importance — culturally relevant in this community."
            : "Low importance — niche or under-documented use."}
        </p>
      </div>
    </div>
  );
}

/* ---------- Lab 2: Population viability ---------- */
function PopulationLab() {
  const [N0, setN0] = useState(500);
  const [r, setR] = useState(0.04);
  const [harvest, setHarvest] = useState(15);
  const years = 25;
  const series = useMemo(() => {
    const out: number[] = [];
    let N = N0;
    for (let t = 0; t <= years; t++) {
      out.push(Math.max(0, N));
      N = N + N * r - (harvest / 100) * N;
    }
    return out;
  }, [N0, r, harvest]);
  const finalN = series[series.length - 1];
  const max = Math.max(...series, N0) || 1;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Discrete exponential model with annual harvest:{" "}
        <code className="text-foreground">Nₜ₊₁ = Nₜ + rNₜ − hNₜ</code>
      </p>
      <Slider label={`Starting population N₀ = ${N0}`} value={N0} min={50} max={2000} step={50} onChange={setN0} />
      <Slider label={`Intrinsic growth r = ${r.toFixed(2)}`} value={r * 100} min={1} max={20} onChange={(v) => setR(v / 100)} />
      <Slider label={`Annual harvest = ${harvest}%`} value={harvest} min={0} max={40} onChange={setHarvest} />

      <svg viewBox="0 0 300 100" className="w-full h-32 mt-5 rounded-xl bg-secondary/40 border border-border">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          points={series.map((v, i) => `${(i / years) * 300},${100 - (v / max) * 92 - 4}`).join(" ")}
        />
      </svg>
      <div className={`mt-3 text-sm ${finalN < N0 * 0.3 ? "text-ember" : "text-foreground"}`}>
        After {years} years: <strong>{Math.round(finalN)}</strong> individuals —{" "}
        {finalN < 50 ? "local extinction risk." : finalN < N0 * 0.5 ? "population in serious decline." : "population is sustainable."}
      </div>
    </div>
  );
}

/* ---------- Lab 3: Identify ---------- */
const specimens = [
  {
    clues: ["Three whorled broad leaves", "Single dark-maroon flower", "Rhizome ~2 cm thick", "Found at 2,800 m"],
    answer: "Trillium govanianum",
    options: ["Trillium govanianum", "Podophyllum hexandrum", "Aconitum heterophyllum", "Dactylorhiza hatagirea"],
  },
  {
    clues: ["Palmate finger-like tubers", "Dense spike of pink-purple flowers", "Lanceolate leaves", "Open subalpine meadow"],
    answer: "Dactylorhiza hatagirea",
    options: ["Trillium govanianum", "Podophyllum hexandrum", "Aconitum heterophyllum", "Dactylorhiza hatagirea"],
  },
  {
    clues: ["Hooded pale-yellow flowers", "Palmately divided leaves", "Tuberous non-toxic root", "Subalpine rocky slopes"],
    answer: "Aconitum heterophyllum",
    options: ["Trillium govanianum", "Podophyllum hexandrum", "Aconitum heterophyllum", "Dactylorhiza hatagirea"],
  },
  {
    clues: ["Umbrella-like single lobed leaf", "Solitary pale-pink flower below leaf", "Mossy forest floor", "Source of podophyllotoxin"],
    answer: "Podophyllum hexandrum",
    options: ["Trillium govanianum", "Podophyllum hexandrum", "Aconitum heterophyllum", "Dactylorhiza hatagirea"],
  },
];

function IdentifyLab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const cur = specimens[idx];

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === cur.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setIdx((i) => (i + 1) % specimens.length);
    setPicked(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>Specimen {idx + 1} / {specimens.length}</span>
        <span className="text-primary">Score: {score}</span>
      </div>
      <ul className="space-y-1.5 mb-5">
        {cur.clues.map((c) => (
          <li key={c} className="text-sm flex gap-2">
            <Droplet className="w-3.5 h-3.5 text-accent mt-1 shrink-0" /> {c}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        {cur.options.map((o) => {
          const isAnswer = o === cur.answer;
          const isPicked = picked === o;
          return (
            <button
              key={o}
              onClick={() => pick(o)}
              disabled={!!picked}
              className={`text-xs italic px-3 py-2.5 rounded-lg border text-left transition-all ${
                picked
                  ? isAnswer
                    ? "border-[var(--moss)] bg-[var(--moss)]/10 text-foreground"
                    : isPicked
                    ? "border-ember/40 bg-ember/5 text-foreground"
                    : "border-border opacity-50"
                  : "border-border hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              {o}
              {picked && isAnswer && <CheckCircle2 className="inline w-3.5 h-3.5 ml-1 text-[var(--moss)]" />}
            </button>
          );
        })}
      </div>
      {picked && (
        <button
          onClick={next}
          className="mt-4 inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-foreground text-background"
        >
          Next specimen <RotateCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ---------- Lab 4: Altitude ---------- */
const zones = [
  { lo: 0, hi: 1500, name: "Subtropical foothills", note: "Pinus roxburghii, Olea ferruginea" },
  { lo: 1500, hi: 2400, name: "Temperate broadleaf belt", note: "Quercus spp., Aesculus indica" },
  { lo: 2400, hi: 3300, name: "Moist temperate conifer", note: "Trillium govanianum · Podophyllum hexandrum" },
  { lo: 3300, hi: 4000, name: "Subalpine meadow", note: "Dactylorhiza hatagirea · Aconitum heterophyllum" },
  { lo: 4000, hi: 5500, name: "Alpine / nival", note: "Cushion plants, lichens, snowfields" },
];

function AltitudeLab() {
  const [alt, setAlt] = useState(2800);
  const zone = zones.find((z) => alt >= z.lo && alt < z.hi) ?? zones[zones.length - 1];
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Drag the slider to ascend a Himalayan slope and reveal which medicinal
        flora you would expect to encounter.
      </p>
      <Slider label={`Altitude: ${alt} m`} value={alt} min={500} max={5000} step={50} onChange={setAlt} />
      <div className="mt-6 p-5 rounded-xl border border-border bg-secondary/40">
        <div className="text-[11px] uppercase tracking-widest text-accent">You are in</div>
        <div className="text-display text-xl text-foreground mt-1">{zone.name}</div>
        <p className="text-sm text-muted-foreground mt-2">{zone.note}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[oklch(0.7_0.1_120)] via-[oklch(0.5_0.07_150)] to-[oklch(0.92_0.01_220)] relative">
        <div
          className="absolute -top-1 w-4 h-4 rounded-full bg-foreground border-2 border-background"
          style={{ left: `calc(${((alt - 500) / 4500) * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}

/* ---------- Lab 5: Quadrat ---------- */
function QuadratLab() {
  const [grid, setGrid] = useState<number[]>(() => regenerate(0.18));
  const [seed, setSeed] = useState(0.18);

  function regenerate(density: number) {
    return Array.from({ length: 100 }, () => (Math.random() < density ? 1 : 0));
  }

  const counted = grid.filter(Boolean).length;
  const density = (counted / 100).toFixed(2);
  const estPerHa = Math.round(counted * 100);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        You set out a <strong>1 m × 1 m quadrat</strong> divided into 100 cells.
        Each dark cell is a Trillium individual. Adjust population density and
        regenerate to see how sampling translates to per-hectare estimates.
      </p>
      <div className="grid sm:grid-cols-2 gap-8 items-start">
        <div>
          <div className="grid grid-cols-10 gap-0.5 p-2 rounded-xl bg-secondary border border-border">
            {grid.map((cell, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm transition-colors ${
                  cell ? "bg-[var(--moss)]" : "bg-card"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setGrid(regenerate(seed))}
              className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background"
            >
              <RotateCw className="w-3 h-3" /> Resample
            </button>
            <span className="text-xs text-muted-foreground">density slider →</span>
          </div>
        </div>
        <div>
          <Slider
            label={`Underlying density · ${Math.round(seed * 100)}%`}
            value={seed * 100} min={2} max={60}
            onChange={(v) => { const d = v / 100; setSeed(d); setGrid(regenerate(d)); }}
          />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Counted" value={counted} />
            <Stat label="Density (per m²)" value={density} />
            <Stat label="Est. per hectare" value={estPerHa.toLocaleString()} accent />
            <Stat label="Cells sampled" value="100" />
          </div>
          <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
            <strong>Field tip:</strong> always repeat ≥ 3 quadrats per stand and
            average — single quadrats undercount patchy populations like Trillium.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */
function Slider({
  label, value, min, max, step = 1, onChange,
}: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block mb-3">
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--moss)]"
      />
    </label>
  );
}
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border border-border ${accent ? "bg-primary/5" : "bg-card"}`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-display text-xl ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
