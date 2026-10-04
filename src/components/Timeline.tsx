"use client";

// The bar along the bottom: the page drawn as a video-editor timeline. Each
// section is a clip whose width is its real share of the page, and the
// playhead is where you are. Click a clip to jump to it.

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIso } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";

const CLIPS = [
  { id: "top", label: "Intro" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "youtube", label: "YouTube" },
  { id: "contact", label: "Contact" },
];

export default function Timeline() {
  const playhead = useRef<HTMLDivElement>(null);
  const edges = useRef<number[]>([]); // where each clip ends, as a 0..1 share of the page
  const [sizes, setSizes] = useState<number[]>(CLIPS.map(() => 1));
  const [active, setActive] = useState(0);

  useIso(() => {
    const measure = () => {
      const heights = CLIPS.map((c) => document.getElementById(c.id)?.offsetHeight ?? 0);
      const total = heights.reduce((a, b) => a + b, 0) || 1;
      let sum = 0;
      edges.current = heights.map((h) => (sum += h) / total);
      setSizes(heights);
    };
    const setX = gsap.quickSetter(playhead.current, "left", "%");
    const update = (self: ScrollTrigger) => {
      // 0 at the top of the page, 1 at the very bottom
      const pos = (self.scroll() + window.innerHeight * self.progress) / document.documentElement.scrollHeight;
      setX(pos * 100);
      const i = edges.current.findIndex((e) => pos < e);
      setActive(i === -1 ? CLIPS.length - 1 : i);
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    ScrollTrigger.addEventListener("refresh", measure);
    measure();
    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, []);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 h-11 flex items-center gap-3 px-3 sm:px-6 bg-ink/85 backdrop-blur border-t border-line">
      <span className="hidden sm:block w-20 font-mono text-[11px] uppercase tracking-widest text-signal" aria-hidden>
        {CLIPS[active].label}
      </span>
      <nav aria-label="Sections" className="relative flex flex-1 gap-1 h-6">
        {CLIPS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => scrollToId(c.id)}
            aria-current={i === active ? "true" : undefined}
            style={{ flexGrow: sizes[i], flexBasis: 0 }}
            className={`min-w-0 px-2 rounded-[5px] text-left font-mono text-[10px] uppercase tracking-wider truncate transition-colors ${
              i === active ? "bg-paper/25 text-paper" : "bg-paper/10 text-paper/55 hover:bg-paper/20 hover:text-paper"
            }`}
          >
            {c.label}
          </button>
        ))}
        <div ref={playhead} className="pointer-events-none absolute -top-2 -bottom-2 w-0.5 bg-signal" aria-hidden>
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-signal [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </div>
      </nav>
    </div>
  );
}
