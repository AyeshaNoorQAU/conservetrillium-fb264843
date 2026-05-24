import { useState } from "react";
import { BookOpen, Sparkles, CheckCircle2, XCircle, RotateCw, GraduationCap, Download } from "lucide-react";

type FlipCard = {
  term: string;
  hint: string;
  detail: string;
  emoji: string;
};

const flashcards: FlipCard[] = [
  {
    term: "Trillium govanianum",
    hint: "Click to reveal botanical profile",
    detail: "A rhizomatous perennial of the family Melanthiaceae, endemic to the Himalayan understory at 2,500–4,000 m. Recognised by its three whorled leaves and dark maroon trillium flower.",
    emoji: "🌸",
  },
  {
    term: "Nag Chatri",
    hint: "Local Pakistani name — tap to learn",
    detail: '"Snake umbrella" — named for the three leaves that resemble a cobra\'s hood. Used in traditional Hakim medicine for inflammation, wounds, and post-natal recovery.',
    emoji: "🐍",
  },
  {
    term: "Steroidal Saponins",
    hint: "The active compounds — explore",
    detail: "Govanoside A and related saponins, isolated chiefly from the rhizome, drive global demand. They show anti-inflammatory, anti-cancer, and anti-fungal bioactivity.",
    emoji: "⚗️",
  },
  {
    term: "Ex-situ Conservation",
    hint: "A key strategy — flip to read",
    detail: "Off-site preservation in botanical gardens, seed banks, and tissue-culture labs. Complements in-situ protection by safeguarding genetic diversity against catastrophic loss.",
    emoji: "🌱",
  },
  {
    term: "MaxEnt Modelling",
    hint: "Our predictive tool",
    detail: "Maximum-entropy species-distribution modelling uses occurrence data + bioclimatic variables to predict suitable habitat — guiding where to focus conservation effort.",
    emoji: "🗺️",
  },
  {
    term: "IUCN Red List",
    hint: "Why this matters globally",
    detail: "International Union for Conservation of Nature classification. Trillium govanianum is listed as Endangered — populations are fragmented and declining due to over-harvesting.",
    emoji: "🛡️",
  },
];

type QuizQ = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

const quiz: QuizQ[] = [
  {
    q: "Which plant family does Trillium govanianum belong to?",
    options: ["Rosaceae", "Melanthiaceae", "Asteraceae", "Lamiaceae"],
    answer: 1,
    why: "Trillium was historically placed in Liliaceae but is now in Melanthiaceae (APG IV).",
  },
  {
    q: "What is the local Pakistani name for this plant?",
    options: ["Mamekh", "Salajeet", "Nag Chatri", "Banafsha"],
    answer: 2,
    why: "Nag Chatri means 'snake umbrella' — referring to the trifoliate leaf whorl.",
  },
  {
    q: "At what altitude is Trillium govanianum primarily found?",
    options: ["500–1,500 m", "1,500–2,500 m", "2,500–4,000 m", "Above 4,500 m"],
    answer: 2,
    why: "It thrives in moist sub-alpine forests between 2,500 and 4,000 m.",
  },
  {
    q: "Which part of the plant is most commercially harvested?",
    options: ["Flowers", "Rhizome", "Leaves", "Seeds"],
    answer: 1,
    why: "The rhizome contains the steroidal saponins (e.g. govanoside A) driving demand.",
  },
  {
    q: "What is the plant's current IUCN status?",
    options: ["Least Concern", "Vulnerable", "Endangered", "Extinct in the Wild"],
    answer: 2,
    why: "Listed Endangered due to over-harvesting and habitat loss across its range.",
  },
];

export function Help() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const toggle = (i: number) => {
    const s = new Set(flipped);
    s.has(i) ? s.delete(i) : s.add(i);
    setFlipped(s);
  };

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === quiz[qi].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (qi + 1 < quiz.length) {
      setQi(qi + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <section id="learn" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 fade-up">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Student Learning Hub
            </p>
            <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              Learn the science.{" "}
              <span className="italic text-[var(--moss)]">
                Carry the story forward.
              </span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              A free, interactive primer for students of botany,
              ethnobiology, and conservation. Flip the cards, test what you
              know, and download the field reference.
            </p>
          </div>
        </div>

        {/* Flashcards */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="uppercase tracking-widest text-xs">
              Tap a card to flip
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((c, i) => {
              const isFlipped = flipped.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  style={{ animationDelay: `${i * 0.08}s`, perspective: "1000px" }}
                  className="fade-up relative h-56 text-left group"
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/40 border border-border group-hover:border-primary/40 group-hover:shadow-[var(--shadow-elevated)] transition-all flex flex-col justify-between"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="text-4xl">{c.emoji}</div>
                      <div>
                        <div className="text-display text-xl text-foreground leading-tight">
                          {c.term}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-primary" />
                          {c.hint}
                        </div>
                      </div>
                    </div>
                    {/* Back */}
                    <div
                      className="absolute inset-0 p-6 rounded-2xl bg-primary text-primary-foreground border border-primary shadow-[var(--shadow-elevated)] flex flex-col justify-between"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-widest opacity-70">
                        {c.term}
                      </div>
                      <p className="text-sm leading-relaxed">{c.detail}</p>
                      <div className="text-[11px] opacity-70 flex items-center gap-1.5">
                        <RotateCw className="w-3 h-3" />
                        tap to flip back
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              Quick knowledge check
            </p>
            <h3 className="text-display text-3xl text-foreground leading-tight mb-4">
              Five questions.{" "}
              <span className="italic text-[var(--moss)]">
                One mountain flower.
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Useful before a field visit, a class presentation, or a
              conservation viva. Each answer comes with the reasoning, not
              just the result.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="px-3 py-1.5 rounded-full bg-secondary text-foreground text-xs">
                Question {Math.min(qi + 1, quiz.length)} / {quiz.length}
              </div>
              <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
                Score: {score}
              </div>
            </div>
          </div>

          <div
            key={qi}
            className="lg:col-span-7 p-7 lg:p-9 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] fade-up"
          >
            {done ? (
              <div className="text-center py-8">
                <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="text-display text-3xl text-foreground">
                  {score} / {quiz.length}
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {score === quiz.length
                    ? "Outstanding — you could lead the field session yourself."
                    : score >= quiz.length - 1
                    ? "Excellent grasp of the species and its conservation context."
                    : score >= 3
                    ? "A solid foundation — revisit the flashcards above to polish the details."
                    : "Great first attempt. The flashcards above cover every answer."}
                </p>
                <button
                  onClick={reset}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                >
                  <RotateCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Question {qi + 1}
                </div>
                <p className="mt-2 text-display text-xl lg:text-2xl text-foreground leading-snug">
                  {quiz[qi].q}
                </p>
                <div className="mt-6 grid gap-2.5">
                  {quiz[qi].options.map((opt, i) => {
                    const isAnswer = i === quiz[qi].answer;
                    const isPicked = picked === i;
                    const reveal = picked !== null;
                    return (
                      <button
                        key={i}
                        onClick={() => choose(i)}
                        disabled={reveal}
                        className={`group text-left px-4 py-3 rounded-xl border text-sm flex items-center justify-between gap-3 transition-all ${
                          reveal
                            ? isAnswer
                              ? "border-[var(--moss)] bg-[var(--moss)]/5 text-foreground"
                              : isPicked
                              ? "border-ember/40 bg-ember/5 text-foreground"
                              : "border-border opacity-60"
                            : "border-border hover:border-primary/40 hover:bg-secondary/40 cursor-pointer"
                        }`}
                      >
                        <span>{opt}</span>
                        {reveal && isAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--moss)] shrink-0" />
                        )}
                        {reveal && isPicked && !isAnswer && (
                          <XCircle className="w-4 h-4 text-ember shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-5 p-4 rounded-xl bg-secondary/50 border border-border fade-up">
                    <div className="text-[11px] uppercase tracking-widest text-accent mb-1">
                      Why
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {quiz[qi].why}
                    </p>
                    <button
                      onClick={next}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs hover:opacity-90 transition-opacity"
                    >
                      {qi + 1 < quiz.length ? "Next question →" : "See result"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Resource strip */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: "Field glossary",
              text: "Key botanical & ecological terms used across the project.",
            },
            {
              icon: Download,
              title: "Cite our publication",
              text: "Open-access DOI in the Science section — free to reference in your dissertation.",
            },
            {
              icon: GraduationCap,
              title: "Volunteer with us",
              text: "Students from QAU & partner universities are welcome to join field campaigns.",
            },
          ].map((r, i) => (
            <div
              key={r.title}
              style={{ animationDelay: `${i * 0.1}s` }}
              className="fade-up p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <r.icon className="w-5 h-5 text-primary mb-4" />
              <div className="text-display text-lg text-foreground">
                {r.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
