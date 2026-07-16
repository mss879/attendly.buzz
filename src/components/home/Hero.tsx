"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { formatLKR, seating } from "@/lib/event";

gsap.registerPlugin(ScrollToPlugin);

/** Masked-rise word: the outer span clips, the inner `.hero-word` slides up. */
function Word({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-1 align-bottom">
      <span
        className={`hero-word inline-block ${
          accent
            ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
            : ""
        }`}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero({ eventName }: { eventName: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", {
        y: 16,
        autoAlpha: 0,
        duration: 0.5,
        clearProps: "all",
      })
        .from(
          ".hero-word",
          { yPercent: 120, duration: 0.8, stagger: 0.07, clearProps: "all" },
          "-=0.25"
        )
        .from(
          ".hero-sub",
          { y: 18, autoAlpha: 0, duration: 0.6, clearProps: "all" },
          "-=0.45"
        )
        .from(
          ".hero-cta",
          { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.08, clearProps: "all" },
          "-=0.35"
        )
        .fromTo(
          ".hero-chip",
          { y: 26, autoAlpha: 0, scale: 0.9 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.12, clearProps: "transform,opacity" },
          "-=0.3"
        );

      // Gentle perpetual float on the decorative chips. Uses yPercent so it
      // composes with (instead of fighting) the entrance tween's `y`.
      gsap.utils.toArray<HTMLElement>(".hero-chip").forEach((chip, i) => {
        gsap.to(chip, {
          yPercent: i % 2 ? 8 : -8,
          rotation: i % 2 ? 2.5 : -2.5,
          duration: 3 + i,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  function scrollTo(target: string) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector(target)?.scrollIntoView();
      return;
    }
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 28, autoKill: true },
      duration: 1,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  return (
    <section
      ref={ref}
      className="relative px-4 pb-14 pt-12 text-center sm:pb-20 sm:pt-16"
    >
      {/* Decorative floating ticket */}
      <div
        aria-hidden
        className="hero-chip absolute left-6 top-24 hidden -rotate-6 rounded-2xl bg-white/40 p-4 shadow-xl shadow-orange-950/10 ring-1 ring-white/60 backdrop-blur-md xl:left-16 xl:block"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-black">
          Grandstand seat
        </p>
        <p className="mt-0.5 font-mono text-lg font-bold tracking-tight text-black">
          D12
        </p>
        <div className="mt-2 flex items-end gap-[3px]">
          {[7, 12, 8, 14, 6, 11, 9, 13, 7, 10].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-black/80"
              style={{ height: `${h * 1.6}px` }}
            />
          ))}
        </div>
        <span className="mt-2.5 inline-flex rounded-full bg-emerald-100/80 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          Payment verified
        </span>
      </div>

      {/* Decorative floating QR */}
      <div
        aria-hidden
        className="hero-chip absolute right-6 top-32 hidden rotate-6 rounded-2xl bg-white/40 p-4 shadow-xl shadow-orange-950/10 ring-1 ring-white/60 backdrop-blur-md xl:right-16 xl:block"
      >
        <svg viewBox="0 0 44 44" className="h-20 w-20 text-black">
          <g fill="currentColor">
            <path d="M4 4h12v12H4zM8 8h4v4H8z" fillRule="evenodd" />
            <path d="M28 4h12v12H28zM32 8h4v4H32z" fillRule="evenodd" />
            <path d="M4 28h12v12H4zM8 32h4v4H8z" fillRule="evenodd" />
            <rect x="22" y="6" width="4" height="4" />
            <rect x="22" y="14" width="4" height="4" />
            <rect x="6" y="22" width="4" height="4" />
            <rect x="14" y="22" width="4" height="4" />
            <rect x="22" y="22" width="4" height="4" />
            <rect x="30" y="22" width="4" height="4" />
            <rect x="36" y="28" width="4" height="4" />
            <rect x="22" y="30" width="4" height="4" />
            <rect x="28" y="34" width="4" height="4" />
            <rect x="36" y="36" width="4" height="4" />
            <rect x="22" y="38" width="4" height="4" />
          </g>
        </svg>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
          Scan at the gate
        </p>
      </div>

      <span className="hero-badge inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200/70">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
        </span>
        Seat bookings are open
      </span>

      <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
        <Word>Your</Word> <Word>ticket</Word> <Word>to</Word> <Word>the</Word>{" "}
        {eventName.split(" ").map((word) => (
          <Fragment key={word}>
            <Word accent>{word}</Word>{" "}
          </Fragment>
        ))}
      </h1>

      <p className="hero-sub mx-auto mt-5 max-w-xl text-base text-black sm:text-lg">
        Pick your grandstand seats, pay by bank transfer, and get your personal
        QR ticket by email — flash it at the gate and walk right in.
      </p>

      {/* GSAP animates the transition-free wrapper spans — animating the
          buttons directly would fight their CSS hover transitions. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="hero-cta inline-block">
          <Link
            href="/book"
            className="group inline-block rounded-full bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-600/30"
          >
            Book my seats
            <span className="ml-1.5 inline-block transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </span>
        <span className="hero-cta inline-block">
          <button
            onClick={() => scrollTo("#how-it-works")}
            className="rounded-full bg-white/80 px-7 py-3 text-sm font-bold text-black shadow-sm ring-1 ring-black/[0.06] transition hover:-translate-y-0.5 hover:bg-white"
          >
            How it works
          </button>
        </span>
      </div>

      <p className="hero-cta mt-6 text-xs font-bold text-black">
        {formatLKR(seating.pricePerSeat)} per seat · Numbered grandstand seating
        · Personal QR ticket by email
      </p>
    </section>
  );
}
