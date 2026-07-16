import type { Metadata } from "next";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/book/BookingWizard";
import { batchYears, eventConfig } from "@/lib/config";
import { bradby, formatLKR, seating } from "@/lib/event";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book your seats",
  description: `Pick your numbered grandstand seats for the ${bradby.title} (${bradby.edition}) at ${bradby.venue} — ${formatLKR(seating.pricePerSeat)} per seat.`,
  alternates: { canonical: "/book" },
};

async function getTakenSeats(): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("booked_seats")
      .select("seat_no")
      .returns<{ seat_no: string }[]>();
    if (error) {
      console.error("[book] could not load booked seats:", error);
      return [];
    }
    return (data ?? []).map((row) => row.seat_no);
  } catch (err) {
    // Missing Supabase env (e.g. local dev) — show an all-available plan.
    console.error("[book] booked seats unavailable:", err);
    return [];
  }
}

export default async function BookPage() {
  const takenSeats = await getTakenSeats();

  return (
    <main className="flex flex-1 flex-col p-2 sm:p-4 lg:p-6">
      <AuroraBackground />

      {/* Floating app panel, same shell as the admin dashboard */}
      <div className="flex flex-1 flex-col rounded-2xl bg-[#f7f4f0]/90 shadow-2xl shadow-orange-950/20 ring-1 ring-white/50 backdrop-blur-xl sm:rounded-[28px]">
        <header className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-7 sm:py-4">
          <Logo href="/" accent="orange" withMark />
          <span className="hidden truncate rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200/70 sm:inline-flex">
            {eventConfig.eventName}
          </span>
        </header>

        <div className="flex-1 px-3 pb-8 pt-4 sm:px-6 sm:pb-12">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
              {bradby.edition} · {bradby.subtitle}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Book your grandstand seats
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 sm:text-base">
              Three quick steps: your details, your seats, your payment.
            </p>
          </div>

          <BookingWizard
            years={batchYears()}
            initialTakenSeats={takenSeats}
            bank={eventConfig.bank}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
