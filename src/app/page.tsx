import type { Metadata } from "next";
import Link from "next/link";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { EventDetails } from "@/components/home/EventDetails";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RivalrySection } from "@/components/home/RivalrySection";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { appConfig, eventConfig } from "@/lib/config";
import { bradby, formatLKR, seating } from "@/lib/event";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: appConfig.appName,
        url: appConfig.appUrl,
        description: `${bradby.title} — ${bradby.subtitle}. Book grandstand seats, pay by bank transfer and check in at the gate with a personal QR ticket.`,
      },
      {
        "@type": "Event",
        name: `${bradby.title} — ${bradby.edition}`,
        description: bradby.description,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "Royal College Sports Complex",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Colombo 07",
            addressCountry: "LK",
          },
        },
        offers: {
          "@type": "Offer",
          price: seating.pricePerSeat,
          priceCurrency: "LKR",
          availability: "https://schema.org/InStock",
          url: `${appConfig.appUrl}/book`,
        },
        organizer: { "@type": "Organization", name: "ARC AI" },
      },
    ],
  };

  return (
    <main className="flex flex-1 flex-col p-2 sm:p-4 lg:p-6">
      <AuroraBackground />

      {/* Floating app panel, same shell as the admin dashboard */}
      <div className="flex flex-1 flex-col rounded-2xl bg-[#f7f4f0]/90 shadow-2xl shadow-orange-950/20 ring-1 ring-white/50 backdrop-blur-xl sm:rounded-[28px]">
        <header className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-7 sm:py-4">
          <Logo href="/" accent="orange" withMark />
          <span className="hidden truncate rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200/70 sm:inline-flex">
            {bradby.edition} · {bradby.venue}
          </span>
        </header>

        <Hero eventName={eventConfig.eventName} />

        <RivalrySection />

        <EventDetails />

        <HowItWorks />

        {/* Final call to action */}
        <section className="px-4 py-16 sm:px-7 sm:py-24">
          <ScrollReveal className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-white/40 p-8 text-center shadow-lg shadow-orange-950/5 ring-1 ring-white/60 backdrop-blur-md sm:p-12 transition-all duration-300 hover:bg-white/50 hover:shadow-xl hover:shadow-orange-950/8">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 120% at 100% 100%, rgba(251,146,60,0.30) 0%, rgba(255,255,255,0) 55%), radial-gradient(120% 120% at 0% 0%, rgba(220,38,38,0.12) 0%, rgba(255,255,255,0) 55%)",
                }}
              />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
                  {bradby.edition}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
                  Grab your grandstand seats
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-black sm:text-base">
                  {formatLKR(seating.pricePerSeat)} per seat · numbered
                  cinema-style seating · your QR ticket lands in your inbox
                  after the organizers verify your payment.
                </p>
                <Link
                  href="/book"
                  className="mt-6 inline-block rounded-full bg-orange-600 px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-600/30"
                >
                  Book now →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>

      <Footer />
      <Preloader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so injected content can never close the script tag.
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
