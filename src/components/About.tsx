"use client";

// About: the lead paragraph lights up word by word as it scrolls through the
// viewport, then the tech list runs past as a marquee.

import { useRef } from "react";
import { gsap, SplitText, reducedMotion, useIso } from "@/lib/gsap";

const skills = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Linux", "Supabase", "PostgreSQL", "Three.js",
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const words = SplitText.create(".about-lead", { type: "words" }).words;
      gsap.fromTo(words, { opacity: 0.2 }, {
        opacity: 1, ease: "none", stagger: 0.1,
        scrollTrigger: { trigger: ".about-lead", start: "top 80%", end: "bottom 50%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <h2 data-reveal className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8">About me</h2>
        <p className="about-lead font-display font-semibold tracking-tight leading-[1.08] text-[clamp(1.9rem,4.6vw,4rem)] max-w-5xl">
          I&apos;m Saad, a full-stack developer. I use React and Next.js on the frontend and
          Node.js on the backend, and I host my stuff on my own Linux server.
        </p>
        <div data-reveal className="mt-12 grid md:grid-cols-2 gap-x-14 gap-y-5 max-w-4xl text-haze leading-relaxed">
          <p>
            I also run a{" "}
            <a
              href="https://www.youtube.com/@the_saadster"
              target="_blank"
              className="text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-signal transition-colors"
            >
              YouTube channel
            </a>{" "}
            where I post about coding and whatever I&apos;m into at the moment.
          </p>
          <p>
            My biggest project is{" "}
            <a
              href="https://chessitup.com"
              target="_blank"
              className="text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-signal transition-colors"
            >
              Chess It Up
            </a>
            , a free chess game review site with 2 million users.
          </p>
        </div>
      </div>

      <div className="mt-20 md:mt-28">
        <h3 className="max-w-6xl mx-auto px-6 font-mono text-xs uppercase tracking-widest text-haze mb-6">
          Tech I work with
        </h3>
        <div className="overflow-hidden border-y border-line py-6">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center font-display font-bold tracking-tight text-4xl md:text-6xl whitespace-nowrap"
                  >
                    {skill}
                    <span className="mx-7 md:mx-10 w-3 h-3 rounded-full bg-signal" aria-hidden />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
