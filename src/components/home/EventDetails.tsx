"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { bradby, formatLKR, seating } from "@/lib/event";

gsap.registerPlugin(ScrollTrigger);

const iconClass = "h-7 w-7";

const features = [
  {
    title: "28ft × 12ft",
    text: "Giant LED screen — every ruck, run and try larger than life.",
    badge: "LED screen",
    wash: "radial-gradient(120% 120% at 100% 100%, rgba(251,146,60,0.35) 0%, rgba(255,255,255,0) 55%)",
    pill: "bg-orange-100/80 text-orange-700",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M9 20.5h6M12 17v3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Grandstand",
    text: "Theatre-style grandstand seating with a clear view from every row.",
    badge: "Seating",
    wash: "radial-gradient(120% 120% at 100% 100%, rgba(245,158,11,0.28) 0%, rgba(255,255,255,0) 55%)",
    pill: "bg-amber-100/80 text-amber-800",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 18v-4.5A1.5 1.5 0 0 1 5.5 12H7V7.5A1.5 1.5 0 0 1 8.5 6h7A1.5 1.5 0 0 1 17 7.5V12h1.5a1.5 1.5 0 0 1 1.5 1.5V18" strokeLinecap="round" />
        <path d="M3 18h18" strokeLinecap="round" />
        <path d="M7 12h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Premium sound",
    text: "A concert-grade sound system that puts you pitch-side in Kandy.",
    badge: "Audio",
    wash: "radial-gradient(120% 120% at 100% 100%, rgba(234,88,12,0.25) 0%, rgba(255,255,255,0) 55%)",
    pill: "bg-orange-100/80 text-orange-700",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" strokeLinejoin="round" />
        <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "450–600 guests",
    text: "Great food, electrifying entertainment and the best Bradby crowd.",
    badge: "The crowd",
    wash: "radial-gradient(120% 120% at 100% 100%, rgba(249,115,22,0.28) 0%, rgba(255,255,255,0) 55%)",
    pill: "bg-orange-100/80 text-orange-700",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8.5" r="3" />
        <path d="M3.5 19c.7-3 2.9-4.5 5.5-4.5s4.8 1.5 5.5 4.5" strokeLinecap="round" />
        <circle cx="16.5" cy="9.5" r="2.4" />
        <path d="M16.5 14.5c2.2 0 3.9 1.2 4.5 3.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function EventDetails() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".event-head",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".event-head", start: "top 85%" },
          clearProps: "all",
        }
      );
      gsap.fromTo(".event-card",
        { y: 30, autoAlpha: 0, scale: 0.97 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".event-cards", start: "top 82%" },
          clearProps: "all",
        }
      );
      gsap.fromTo(".event-schedule > *",
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".event-schedule", start: "top 88%" },
          clearProps: "all",
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="experience" className="scroll-mt-8 px-4 py-16 sm:px-7 sm:py-24">
      <div className="event-head mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
          {bradby.subtitle}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
          A premium open-air theatre night
        </h2>
        <p className="mt-3 text-sm text-black sm:text-base">{bradby.description}</p>
      </div>

      <div className="event-cards mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="event-card relative overflow-hidden rounded-2xl bg-white/40 p-5 shadow-lg shadow-orange-950/5 ring-1 ring-white/60 backdrop-blur-md transition-all duration-300 hover:bg-white/55 hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-950/5"
          >
            <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: f.wash }} />
            <div className="relative">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${f.pill}`}>
                {f.badge}
              </span>
              <div className="mt-3 text-orange-600">{f.icon}</div>
              <p className="mt-3 text-xl font-bold tracking-tight text-black">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-black">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule strip */}
      <dl className="event-schedule mx-auto mt-6 grid max-w-5xl gap-3 rounded-2xl bg-white/30 p-4 shadow-lg shadow-orange-950/5 ring-1 ring-white/50 backdrop-blur-md sm:grid-cols-4 sm:p-5">
        {bradby.schedule.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/40 px-4 py-3 ring-1 ring-white/40 backdrop-blur-sm">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-orange-700/80">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-black">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 text-center">
        <Link
          href="/book"
          className="inline-block rounded-full bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-600/30"
        >
          Book your seats — {formatLKR(seating.pricePerSeat)} per seat
        </Link>
      </div>
    </section>
  );
}
