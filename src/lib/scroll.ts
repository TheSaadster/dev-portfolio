import type Lenis from "lenis";

// The Lenis instance, set by <SmoothScroll>. Null when the visitor prefers
// reduced motion, in which case scrolling is the browser's own.
let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView();
}
