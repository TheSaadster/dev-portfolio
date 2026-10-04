"use client";

// Top bar. Slides away while scrolling down and returns on the way back up.
// On phones the links are hidden: the bottom scrubber (Timeline) does the job.

import { useState } from "react";
import { ScrollTrigger, useIso } from "@/lib/gsap";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);

  useIso(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 240),
    });
    return () => st.kill();
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <a href="#top" className="font-display text-xl font-bold tracking-tight">Saad</a>
        <div className="hidden sm:flex gap-7 font-mono text-xs uppercase tracking-widest text-paper/70">
          <a href="#projects" className="hover:text-signal transition-colors">Work</a>
          <a href="#about" className="hover:text-signal transition-colors">About</a>
          <a href="#youtube" className="hover:text-signal transition-colors">YouTube</a>
          <a href="#contact" className="hover:text-signal transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
}
