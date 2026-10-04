"use client";

// Hero: the headline on the left, the 3D scene (HeroScene) behind it. The
// text layer ignores the pointer except on its links, so the canvas underneath
// still gets hover and click.

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { gsap, SplitText, reducedMotion, useIso } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";
import type { ThingId } from "./HeroScene";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const THINGS: Record<ThingId, { label: string; target: string }> = {
  chess: { label: "Chess It Up, 2 million users", target: "projects" },
  youtube: { label: "My YouTube channel", target: "youtube" },
  voice: { label: "Voice AI Assistant", target: "voice-ai" },
};

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const scroll = useMemo(() => ({ p: 0 }), []);
  const [running, setRunning] = useState(true);
  const [still, setStill] = useState(false);
  const [hovered, setHovered] = useState<ThingId | null>(null);

  useIso(() => {
    const reduced = reducedMotion();
    setStill(reduced);
    const ctx = gsap.context(() => {
      // drives the scene's lift-off and pauses rendering once the hero is gone
      gsap.to(scroll, {
        p: 1, ease: "none",
        scrollTrigger: {
          trigger: root.current, start: "top top", end: "bottom top", scrub: true,
          onToggle: (self) => setRunning(self.isActive),
        },
      });
      if (reduced) return;

      const chars = SplitText.create(".hero-h1", { type: "words,chars" }).chars;
      gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .from(".hero-eyebrow", { autoAlpha: 0, y: 12, duration: 0.6 })
        .from(chars, { autoAlpha: 0, yPercent: 60, rotate: 6, duration: 0.8, stagger: 0.035 }, "-=0.3")
        .from(".hero-rest", { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.1 }, "-=0.45");

      gsap.to(".hero-copy", {
        yPercent: -18, autoAlpha: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [scroll]);

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene
          scroll={scroll}
          running={running}
          still={still}
          onHover={setHovered}
          onPick={(id) => scrollToId(THINGS[id].target)}
        />
      </div>

      <div className="hero-copy pointer-events-none relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end md:justify-center pb-28 md:pb-0">
        <p className="hero-eyebrow font-mono text-xs uppercase tracking-[0.25em] text-signal mb-5">
          Full-stack developer
        </p>
        <h1 className="hero-h1 font-display font-extrabold tracking-[-0.04em] leading-[0.9] text-[clamp(3.4rem,11vw,9.5rem)]">
          Hey, I&apos;m
          <br />
          Saad.
        </h1>
        <p className="hero-rest mt-7 max-w-md text-lg leading-relaxed text-paper/85">
          I build web apps with React, Next.js and TypeScript. I also make YouTube videos
          about development.
        </p>
        <div className="hero-rest mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href="#projects"
            className="pointer-events-auto bg-signal text-ink font-semibold px-6 py-3.5 rounded-full hover:bg-paper transition-colors"
          >
            See my work
          </a>
          <a
            href="#about"
            className="pointer-events-auto font-medium underline decoration-paper/40 underline-offset-[6px] hover:decoration-signal transition-colors"
          >
            About me
          </a>
        </div>
      </div>

      <p
        aria-live="polite"
        className="pointer-events-none hidden md:block absolute right-6 bottom-20 font-mono text-xs uppercase tracking-widest text-paper/70"
      >
        {hovered ? `${THINGS[hovered].label} →` : "Click one to jump to it"}
      </p>
    </section>
  );
}
