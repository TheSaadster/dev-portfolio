"use client";

// A number that counts up from zero the first time it scrolls into view.
// Server-renders the final value, so it is right without JavaScript and for
// visitors who prefer reduced motion.

import { useRef } from "react";
import { gsap, reducedMotion, useIso } from "@/lib/gsap";

const plain = (n: number) => Math.round(n).toLocaleString("en-US");

export default function CountUp({ value, format = plain, className }: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIso(() => {
    if (reducedMotion()) return;
    const el = ref.current!;
    const n = { v: 0 };
    el.textContent = format(0);
    const tween = gsap.to(n, {
      v: value, duration: 1.8, ease: "power2.out",
      onUpdate: () => { el.textContent = format(n.v); },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = format(value);
    };
  }, [value, format]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
