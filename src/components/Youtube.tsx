"use client";
// import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import CountUp from "./CountUp";

interface YTVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string | null;
}

interface YTStats {
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  videos?: YTVideo[];
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
}

// const date = (iso: string) =>
//   new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const PLAY = "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z";

export default function Youtube() {
  const [stats, setStats] = useState<YTStats | null>(null);
  const live = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setStats(d);
      })
      .catch(() => {});
  }, []);

  // The stats and videos arrive after the page has been measured: fade them in
  // and tell ScrollTrigger the page got taller.
  useEffect(() => {
    if (!stats) return;
    ScrollTrigger.refresh();
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".yt-in", { autoAlpha: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.08 });
    }, live);
    return () => ctx.revert();
  }, [stats]);

  // const videos = stats?.videos ?? [];

  return (
    <section id="youtube" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <p data-reveal className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-5">YouTube</p>
        <div data-reveal className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <h2 className="font-display font-extrabold tracking-[-0.04em] leading-[0.9] text-[clamp(2.6rem,8vw,6.5rem)]">
              @the_saadster
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-haze">
              I make videos about web dev, chess and my side projects.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@the_saadster"
            target="_blank"
            className="justify-self-start inline-flex items-center gap-2.5 bg-[#ff3d2e] hover:bg-paper hover:text-ink text-white px-6 py-3.5 rounded-full font-semibold transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d={PLAY} />
            </svg>
            Visit channel
          </a>
        </div>

        <div ref={live}>
          {stats && (
            <dl className="mt-14 grid grid-cols-3 border-y border-line divide-x divide-line">
              {[
                { label: "Subscribers", value: stats.subscriberCount },
                { label: "Total views", value: stats.viewCount },
                { label: "Videos", value: stats.videoCount },
              ].map(({ label, value }) => (
                <div key={label} className="yt-in py-7 px-3 sm:px-8 first:pl-0">
                  <dd className="font-display font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl">
                    <CountUp value={value} format={fmt} />
                  </dd>
                  <dt className="mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-haze">{label}</dt>
                </div>
              ))}
            </dl>
          )}

          {/* Latest videos: off for now. To bring them back, uncomment this block, the
              `videos` line above, the `date` helper and the Image import.
          {videos.length > 0 && (
            <>
              <h3 className="yt-in mt-14 mb-6 font-mono text-xs uppercase tracking-widest text-haze">Latest videos</h3>
              <ul className="grid sm:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <li key={v.id} className="yt-in">
                    <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" className="group block">
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-line bg-ink-2">
                        {v.thumbnail && (
                          <Image
                            src={v.thumbnail}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <p className="mt-3 font-medium leading-snug group-hover:text-signal transition-colors line-clamp-2">
                        {v.title}
                      </p>
                      <p className="mt-1 font-mono text-xs text-haze">{date(v.publishedAt)}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          */}
        </div>
      </div>
    </section>
  );
}
