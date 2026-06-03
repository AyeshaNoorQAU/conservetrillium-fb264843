import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ZoomableImage } from "@/components/site/ZoomableImage";
import { Tilt3D } from "@/components/site/Tilt3D";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import trillium from "@/assets/trillium-rhizome.jpg";
import dactylorhiza from "@/assets/plants/dactylorhiza.jpg";
import aconitum from "@/assets/plants/aconitum.jpg";
import podophyllum from "@/assets/plants/podophyllum.jpg";
import { useCmsList, type PlantRow } from "@/lib/cms";

const fallbackImg: Record<string, string> = {
  "trillium-govanianum": trillium,
  "dactylorhiza-hatagirea": dactylorhiza,
  "aconitum-heterophyllum": aconitum,
  "podophyllum-hexandrum": podophyllum,
};

const seeded: PlantRow[] = [
  { id: "1", slug: "trillium-govanianum", scientific_name: "Trillium govanianum", local_name: "Nag Chatri · Teen Patra", family: "Melanthiaceae", altitude: "2,400 – 3,300 m", iucn: "Endangered", uses: "Reproductive health, anti-inflammatory, hormonal balance", threats: "Overharvesting · slow regeneration · habitat loss", description: "A slow-growing rhizomatous perennial with a single deep-maroon bloom held above three broad leaves. The rhizome is rich in steroidal saponins and forms the focus of our flagship conservation effort.", image_url: null, sort_order: 10 },
  { id: "2", slug: "dactylorhiza-hatagirea", scientific_name: "Dactylorhiza hatagirea", local_name: "Salam Panja · Hatta Haddi", family: "Orchidaceae", altitude: "2,500 – 4,000 m", iucn: "Critically Endangered (regional)", uses: "Tonic, aphrodisiac, wound healing, post-partum recovery", threats: "Tuber harvesting · grazing pressure · climate shift", description: "A terrestrial orchid of subalpine meadows with a dense spike of pink-purple flowers. Its palmately-lobed tubers (the namesake 'hand-roots') are heavily traded in unani and ayurvedic markets.", image_url: null, sort_order: 20 },
  { id: "3", slug: "aconitum-heterophyllum", scientific_name: "Aconitum heterophyllum", local_name: "Atees · Patris", family: "Ranunculaceae", altitude: "2,400 – 3,800 m", iucn: "Endangered", uses: "Anti-pyretic, digestive tonic, paediatric medicine", threats: "Unsustainable rootstock extraction · loss of alpine pasture", description: "Unlike its toxic cousins, A. heterophyllum's tuberous roots are non-poisonous and prized in traditional formulations. Populations in Pakistan's Himalayan belt are critically thinned.", image_url: null, sort_order: 30 },
  { id: "4", slug: "podophyllum-hexandrum", scientific_name: "Podophyllum hexandrum", local_name: "Bankakri · Himalayan Mayapple", family: "Berberidaceae", altitude: "2,500 – 4,000 m", iucn: "Endangered", uses: "Source of podophyllotoxin — precursor to anticancer drugs (etoposide, teniposide)", threats: "Pharmaceutical-grade demand · over-collection of rhizomes", description: "A solitary herb of mossy forest floors carrying a single pale-pink cup-shaped flower beneath an umbrella-like deeply lobed leaf. Its rhizome supplies the global pipeline for semi-synthetic chemotherapy.", image_url: null, sort_order: 40 },
];

export const Route = createFileRoute("/plants")({
  head: () => ({
    meta: [
      { title: "Endangered Himalayan Medicinal Plants — ConserveTrillium" },
      { name: "description", content: "Profiles of endangered medicinal plants of the Pakistani Himalayas with interactive 3D-tilt photography and zoom." },
      { property: "og:title", content: "Endangered Himalayan Medicinal Plants" },
      { property: "og:description", content: "Interactive 3D botanical profiles of endangered Himalayan medicinal species." },
    ],
  }),
  component: PlantsPage,
});

function PlantsPage() {
  const rows = useCmsList<PlantRow>("plants") ?? seeded;
  const plants = (rows.length ? rows : seeded).slice().sort((a, b) => a.sort_order - b.sort_order);

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
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
              Field herbarium · 3D interactive
            </p>
            <h1 className="text-display text-5xl lg:text-7xl leading-[1.02] text-balance">
              Endangered <span className="italic text-[var(--moss)]">jewels</span> of the
              Pakistani Himalayas.
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Hover any specimen for a 3D parallax tilt, or click <em>Zoom &amp; pan</em> to inspect
              leaf venation, floral structure, and rhizome morphology from any angle.
            </p>
          </header>

          <div className="space-y-24">
            {plants.map((p, i) => {
              const img = p.image_url || fallbackImg[p.slug] || trillium;
              return (
                <article
                  key={p.id}
                  id={p.slug}
                  className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center fade-up ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="lg:col-span-6 group/tilt">
                    <Tilt3D max={14}>
                      <ZoomableImage
                        src={img}
                        alt={`${p.scientific_name} — ${p.local_name ?? ""}`}
                        caption={p.scientific_name}
                        className="aspect-[3/4] shadow-[var(--shadow-elevated)]"
                      />
                    </Tilt3D>
                  </div>
                  <div className="lg:col-span-6">
                    {p.family && (
                      <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{p.family}</p>
                    )}
                    <h2 className="text-display text-3xl lg:text-5xl leading-tight">
                      <em className="text-[var(--moss)]">{p.scientific_name}</em>
                    </h2>
                    {p.local_name && <p className="mt-2 text-muted-foreground italic">{p.local_name}</p>}
                    {p.description && (
                      <p className="mt-6 text-foreground/90 leading-relaxed">{p.description}</p>
                    )}

                    <dl className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-5">
                      {p.altitude && <Fact label="Altitude" value={p.altitude} />}
                      {p.iucn && <Fact label="IUCN" value={p.iucn} accent />}
                      {p.uses && <Fact label="Traditional uses" value={p.uses} />}
                      {p.threats && <Fact label="Key threats" value={p.threats} />}
                    </dl>

                    <div className="mt-7 inline-flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border rounded-xl px-4 py-3">
                      <ShieldAlert className="w-4 h-4 text-ember shrink-0 mt-0.5" />
                      Listed under regional conservation priority — wild harvesting is regulated;
                      cultivation and ex-situ propagation are actively encouraged.
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border-t border-border pt-3">
      <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd
        className={`mt-1.5 text-[15px] leading-snug ${accent ? "text-ember font-medium" : "text-foreground"}`}
      >
        {value}
      </dd>
    </div>
  );
}
