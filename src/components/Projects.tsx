"use client";

// Work. Chess It Up gets a walkthrough built from real screenshots: on desktop
// the stage pins and scrolling swaps the three steps (one scrubbed GSAP
// timeline that snaps to each step); on phones, or with reduced motion, the
// same markup is just a list. Under it, the numbers and stack, then the
// smaller projects.

import Image from "next/image";
import { useRef } from "react";
import { gsap, useIso } from "@/lib/gsap";
import CountUp from "./CountUp";

const BEATS = [
  {
    title: "Import a game",
    body: "Paste a PGN, or type your Chess.com or Lichess username and pick a game.",
    src: "/work/chess-it-up-import.png", w: 648, h: 496,
    alt: "Chess It Up's import dialog with tabs for Paste PGN, Chess.com and Lichess",
  },
  {
    title: "Stockfish checks every move",
    body: "You get an eval bar, the best move drawn on the board, and a graph of the whole game.",
    src: "/work/chess-it-up-review.png", w: 1351, h: 886,
    alt: "Chess It Up's analysis board showing a move marked as a great move, next to the eval graph and accuracy scores",
  },
  {
    title: "Every move gets a grade",
    body: "From brilliant down to blunder. Both players get an accuracy score.",
    src: "/work/chess-it-up-grades.png", w: 1219, h: 576,
    alt: "Chess It Up's summary table counting brilliant, great, best, excellent and good moves for both players",
  },
];

const STACK = ["Next.js", "TypeScript", "Linux", "Stockfish", "Supabase"];

const OTHER = [
  {
    id: "voice-ai",
    title: "Voice AI Assistant",
    description: "A real-time voice AI assistant. Watch the demo on YouTube.",
    tech: ["AI", "Python", "API"],
    link: "https://www.youtube.com/watch?v=rflU5b_Yn60",
    cta: "Watch the demo",
  },
];

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className="font-mono text-[11px] uppercase tracking-wider border border-line rounded-full px-3 py-1.5 text-haze">
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useIso(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = stage.current!;
      el.classList.add("is-pinned");
      const beats = gsap.utils.toArray<HTMLElement>(".beat");
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.inOut" },
        scrollTrigger: {
          trigger: el, pin: true, start: "top top",
          end: () => `+=${window.innerHeight * (beats.length - 1)}`,
          scrub: 0.5, invalidateOnRefresh: true,
          snap: { snapTo: "labels", duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
        },
      });
      tl.addLabel("step-0");
      beats.slice(1).forEach((beat, i) => {
        const prev = beats[i];
        tl.to(prev.querySelector(".beat-text"), { autoAlpha: 0, y: -40 })
          .to(prev.querySelector(".beat-shot"), { autoAlpha: 0, yPercent: -8, scale: 0.94 }, "<")
          .fromTo(beat.querySelector(".beat-text"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0 })
          .fromTo(beat.querySelector(".beat-shot"), { autoAlpha: 0, yPercent: 10, scale: 1.05 }, { autoAlpha: 1, yPercent: 0, scale: 1 }, "<")
          .addLabel(`step-${i + 1}`);
      });
      tl.fromTo(".beat-bar", { scaleX: 1 / beats.length }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
      return () => el.classList.remove("is-pinned");
    });
    return () => mm.revert();
  }, []);

  // cursor position for the card highlight
  const spotlight = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="projects" ref={root} className="relative pt-28 md:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <p data-reveal className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-5">Work</p>
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[0.9] text-[clamp(3rem,9vw,7.5rem)]">
            Chess It Up
          </h2>
          <a
            href="https://chessitup.com"
            target="_blank"
            className="font-mono text-sm underline decoration-paper/40 underline-offset-[6px] hover:decoration-signal transition-colors mb-2"
          >
            chessitup.com ↗
          </a>
        </div>
        <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-haze">
          Free chess game review with Stockfish, and no daily limit.
        </p>
      </div>

      {/* The walkthrough */}
      <div ref={stage} className="stage relative mt-12 md:mt-0">
        {BEATS.map((b, i) => (
          <article key={b.title} className="beat flex items-center py-8 md:py-0">
            <div className="w-full max-w-6xl mx-auto px-6 grid md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-8 md:gap-14 items-center">
              <div className="beat-text">
                <p className="font-mono text-xs text-haze mb-3">
                  Step {i + 1} of {BEATS.length}
                </p>
                <h3 className="font-display font-bold tracking-tight text-3xl md:text-5xl leading-[1.02] text-balance">
                  {b.title}
                </h3>
                <p className="mt-4 text-haze leading-relaxed max-w-sm">{b.body}</p>
              </div>
              <figure className="beat-shot rounded-2xl border border-line bg-[#0e0e10] overflow-hidden shadow-[0_40px_120px_-30px_rgba(42,54,232,0.55)]">
                <div className="flex items-center gap-1.5 px-4 h-9 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 font-mono text-[11px] text-white/45">chessitup.com</span>
                </div>
                <div className="relative aspect-[3/2]">
                  <Image
                    src={b.src}
                    alt={b.alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-contain p-3"
                    priority={i === 0}
                  />
                </div>
              </figure>
            </div>
          </article>
        ))}
        <div className="hidden md:block absolute left-0 right-0 bottom-16 max-w-6xl mx-auto px-6" aria-hidden>
          <div className="h-px bg-line">
            <div className="beat-bar h-px bg-signal origin-left" />
          </div>
        </div>
      </div>

      {/* Numbers and stack */}
      <div className="max-w-6xl mx-auto px-6 mt-16 md:mt-24 grid md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-end">
        <div data-reveal>
          <p className="font-display font-extrabold tracking-[-0.04em] leading-none text-[clamp(3rem,10vw,8rem)] text-signal">
            <CountUp value={2000000} />+
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-haze">users</p>
        </div>
        <div data-reveal className="md:pb-3">
          <p className="font-mono text-xs uppercase tracking-widest text-haze mb-4">Built with</p>
          <Tags items={STACK} />
        </div>
      </div>

      {/* Other projects */}
      <div className="max-w-6xl mx-auto px-6 mt-28 md:mt-40">
        <p data-reveal className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8">Other projects</p>
        <div className="grid gap-6">
          {OTHER.map((p) => (
            <a
              key={p.id}
              id={p.id}
              href={p.link}
              target="_blank"
              data-reveal
              onMouseMove={spotlight}
              className="spotlight group grid md:grid-cols-[1fr_auto] gap-8 items-center rounded-2xl border border-line bg-ink-2 p-7 md:p-10 scroll-mt-24 hover:border-signal/60 transition-colors"
            >
              <div>
                <h3 className="font-display font-bold tracking-tight text-3xl md:text-4xl">{p.title}</h3>
                <p className="mt-3 text-haze leading-relaxed max-w-md">{p.description}</p>
                <div className="mt-6"><Tags items={p.tech} /></div>
                <p className="mt-7 font-medium group-hover:text-signal transition-colors">{p.cta} ↗</p>
              </div>
              <div className="flex items-center gap-1.5 h-24 md:h-32 md:pr-6" aria-hidden>
                {Array.from({ length: 14 }, (_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-full rounded-full bg-signal origin-center animate-wave [animation-play-state:paused] group-hover:[animation-play-state:running]"
                    style={{ animationDelay: `${-((i * 37) % 110) / 100}s` }}
                  />
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
