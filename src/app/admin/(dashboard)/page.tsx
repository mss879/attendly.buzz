import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { StatCards, type Stat } from "@/components/admin/StatCards";
import { createAdminClient } from "@/lib/supabase/admin";
import { eventConfig } from "@/lib/config";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [total, awaiting, verified, checkedIn] = await Promise.all([
    supabase.from("registrations").select("id", { count: "exact", head: true }),
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "slip_uploaded"),
    supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "verified"),
    supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .not("checked_in_at", "is", null),
  ]);

  const stats: Stat[] = [
    {
      label: "Total registrations",
      value: total.count ?? 0,
      href: "/admin/registrations",
      badge: "All",
      tone: "violet",
    },
    {
      label: "Awaiting review",
      value: awaiting.count ?? 0,
      href: "/admin/registrations?status=slip_uploaded",
      badge: "Review",
      tone: "orange",
    },
    {
      label: "Payment verified",
      value: verified.count ?? 0,
      href: "/admin/registrations?status=verified",
      badge: "Ticketed",
      tone: "emerald",
    },
    {
      label: "Checked in",
      value: checkedIn.count ?? 0,
      href: "/admin/checkins",
      badge: "At venue",
      tone: "sky",
    },
  ];

  return (
    <FadeIn>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">{eventConfig.eventName}</p>
        </div>
        <Link
          href="/admin/scan"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
        >
          Open gate scanner →
        </Link>
      </div>

      <StatCards stats={stats} />

      <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm ring-1 ring-black/[0.04]">
        <p className="font-semibold text-slate-700">How it works</p>
        <p className="mt-1 leading-relaxed">
          Review payment slips under <strong>Registrations</strong> — verifying a
          slip issues the ticket and emails the QR code automatically. At the
          gate, use <strong>Scan tickets</strong> to check participants in.
        </p>
      </div>
    </FadeIn>
  );
}
