"use client";

// Contact. The email button is magnetic: it leans toward the cursor while the
// pointer is over it and springs back when it leaves.

import { useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

const LINKS = [
  { label: "GitHub", href: "https://github.com/TheSaadster" },
  { label: "YouTube", href: "https://www.youtube.com/@the_saadster" },
  { label: "X (or Twitter)", href: "https://x.com/thesaadster_dev" },
];

export default function Contact() {
  const button = useRef<HTMLAnchorElement>(null);

  const pull = (e: React.MouseEvent) => {
    if (reducedMotion()) return;
    const r = button.current!.getBoundingClientRect();
    gsap.to(button.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
      duration: 0.4, ease: "power3.out",
    });
  };
  const release = () => gsap.to(button.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });

  return (
    <section id="contact" className="pt-28 md:pt-44 pb-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 data-reveal className="font-display font-extrabold tracking-[-0.045em] leading-[0.88] text-[clamp(3.6rem,13vw,11rem)]">
          Say hi.
        </h2>
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-7">
          <a
            ref={button}
            href="mailto:thesaadster.dev@gmail.com"
            onMouseMove={pull}
            onMouseLeave={release}
            className="inline-block bg-signal text-ink px-9 py-5 rounded-full font-semibold text-lg hover:bg-paper transition-colors"
          >
            Email me
          </a>
          <p className="max-w-xs text-paper/85 leading-relaxed">I&apos;m open to new opportunities.</p>
        </div>

        <footer className="mt-24 md:mt-36 pt-6 border-t border-paper/25 flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-widest text-paper/75">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" className="hover:text-signal transition-colors">{l.label} ↗</a>
              </li>
            ))}
          </ul>
          <a href="mailto:thesaadster.dev@gmail.com" className="normal-case tracking-normal hover:text-signal transition-colors">
            thesaadster.dev@gmail.com
          </a>
        </footer>
      </div>
    </section>
  );
}
