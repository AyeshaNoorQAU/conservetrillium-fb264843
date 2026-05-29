import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Mission } from "@/components/site/Mission";
import { Plant } from "@/components/site/Plant";
import { Impact } from "@/components/site/Impact";
import { Field } from "@/components/site/Field";
import { Science } from "@/components/site/Science";
import { Announcements } from "@/components/site/Announcements";
import { Team } from "@/components/site/Team";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConserveTrillium — Saving Himalayan Trillium govanianum" },
      {
        name: "description",
        content:
          "A field-led conservation project protecting Trillium govanianum, a critically endangered Himalayan medicinal plant, through science and community stewardship in Pakistan.",
      },
      { property: "og:title", content: "ConserveTrillium — Saving Himalayan Trillium" },
      {
        property: "og:description",
        content:
          "Conservation of the endangered Trillium govanianum across the Pakistani Himalayas — by PMNH, supported by the MBZ Species Conservation Fund. Founded by Ayesha Noor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Mission />
        <Plant />
        <Impact />
        <Field />
        <Science />
        <Announcements />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
