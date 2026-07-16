import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import { SlipUploadForm } from "@/components/SlipUploadForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { eventConfig } from "@/lib/config";
import { qrDataUrl } from "@/lib/qr";
import type { PaymentSlip, Registration, Ticket } from "@/lib/types";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!UUID_RE.test(token)) notFound();

  const supabase = createAdminClient();
  const { data: registration } = await supabase
    .from("registrations")
    .select("*")
    .eq("access_token", token)
    .maybeSingle<Registration>();

  if (!registration) notFound();

  const { data: slips } = await supabase
    .from("payment_slips")
    .select("*")
    .eq("registration_id", registration.id)
    .order("uploaded_at", { ascending: false })
    .returns<PaymentSlip[]>();

  let ticket: Ticket | null = null;
  let qrImage: string | null = null;
  if (registration.payment_status === "verified") {
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .eq("registration_id", registration.id)
      .maybeSingle<Ticket>();
    ticket = data;
    if (ticket) qrImage = await qrDataUrl(ticket.qr_token);
  }

  const latestSlip = slips?.[0] ?? null;
  const status = registration.payment_status;
  const { bank, ticketPrice, eventName } = eventConfig;

  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3.5 sm:py-4">
          <Logo href="/" />
          <span className="hidden truncate text-sm font-medium text-slate-500 sm:block">
            {eventName}
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
        {/* Reservation summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {registration.full_name}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Class of {registration.batch} · Ref{" "}
                <span className="font-mono font-semibold">
                  {registration.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>
            <StatusBadge status={status} />
          </div>
        </section>

        {/* Verified: the ticket */}
        {status === "verified" && ticket && qrImage && (
          <section className="rounded-2xl border-2 border-emerald-300 bg-white p-5 text-center shadow-sm sm:p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
              Your ticket
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {ticket.ticket_number}
            </p>
            {/* Data-URL QR: sized to the screen but capped so it stays crisp and
                scannable, even on the smallest phones */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImage}
              alt={`QR code for ticket ${ticket.ticket_number}`}
              className="mx-auto mt-4 aspect-square w-full max-w-[16rem] rounded-xl border border-slate-200"
            />
            <p className="mt-3 text-sm text-slate-500">
              Show this QR code at the entrance to check in.
            </p>
            <a
              href={qrImage}
              download={`attendly-${ticket.ticket_number}.png`}
              className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Download QR code
            </a>
            {ticket.checked_in_at && (
              <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                ✓ Checked in at{" "}
                {new Date(ticket.checked_in_at).toLocaleString()}
              </p>
            )}
          </section>
        )}

        {/* Not yet verified: payment instructions + upload */}
        {status !== "verified" && (
          <>
            {status === "rejected" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-bold">Your payment slip was rejected.</span>{" "}
                Please upload a clear photo or PDF of your payment slip again.
              </div>
            )}
            {status === "slip_uploaded" && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                <span className="font-bold">Your slip is being reviewed.</span>{" "}
                You&apos;ll get your ticket by email once the payment is verified.
                {latestSlip && (
                  <span className="mt-1 block text-xs text-sky-600">
                    Last upload:{" "}
                    {new Date(latestSlip.uploaded_at).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-bold text-slate-900">
                1. Make the payment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Transfer the ticket fee to the account below.
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {ticketPrice && (
                  <Detail label="Amount" value={ticketPrice} />
                )}
                {bank.name && <Detail label="Bank" value={bank.name} />}
                {bank.accountName && (
                  <Detail label="Account name" value={bank.accountName} />
                )}
                {bank.accountNumber && (
                  <Detail label="Account number" value={bank.accountNumber} />
                )}
                {bank.branch && <Detail label="Branch" value={bank.branch} />}
              </dl>

              <h2 className="mt-6 text-base font-bold text-slate-900">
                2. Upload your payment slip
              </h2>
              <p className="mb-3 mt-1 text-sm text-slate-500">
                JPG, PNG, WebP or PDF — max 5 MB.
                {status === "slip_uploaded" &&
                  " Uploading again will replace the slip under review."}
              </p>
              <SlipUploadForm token={token} />
            </section>
          </>
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Attendly · Powered by ARC AI
      </footer>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 sm:block">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
