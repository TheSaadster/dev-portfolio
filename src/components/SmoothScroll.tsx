"use client";

// Page-wide scroll behaviour. Rendered last in page.tsx on purpose: its effect
// runs after every section's, so the Chess It Up pin already exists when the
// triggers below are created and measured.
//   - Lenis smooth scrolling, driven by GSAP's ticker
//   - the backdrop colour: cobalt under the hero, ink through the middle,
//     cobalt again for the contact section
//   - [data-reveal] elements rise in once as they enter the viewport

import { useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

const COBALT = "#2a36e8";
const INK = "#0b0d22";

export default function SmoothScroll() {
  const backdrop = useRef<HTMLDivElement>(null);

  useIso(() => {
    const reduced = reducedMotion();

    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (!reduced) {
      lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(backdrop.current, { backgroundColor: COBALT }, {
        backgroundColor: INK, ease: "none",
        scrollTrigger: { trigger: "#projects", start: "top 90%", end: "top 35%", scrub: true },
      });
      gsap.fromTo(backdrop.current, { backgroundColor: INK }, {
        backgroundColor: COBALT, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: "#contact", start: "top 85%", end: "top 30%", scrub: true },
      });

      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return <div ref={backdrop} aria-hidden className="fixed inset-0 -z-10 bg-cobalt" />;
}
