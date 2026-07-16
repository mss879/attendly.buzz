import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/supabase/auth";
import type { Registration, Ticket } from "@/lib/types";

const checkinSchema = z
  .object({
    qrToken: z.uuid().optional(),
    ticketNumber: z
      .string()
      .trim()
      .regex(/^TKT-\d{1,10}$/i)
      .optional(),
  })
  .refine((d) => d.qrToken || d.ticketNumber, {
    message: "qrToken or ticketNumber required",
  });

type TicketWithRegistration = Ticket & { registrations: Registration };

function participant(t: TicketWithRegistration) {
  return {
    name: t.registrations.full_name,
    batch: t.registrations.batch,
    ticketNumber: t.ticket_number,
    checkedInAt: t.checked_in_at,
  };
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ result: "not_found" });
  }

  const { qrToken, ticketNumber } = parsed.data;
  const supabase = createAdminClient();

  // Atomic claim: only succeeds if the ticket exists AND is not yet checked
  // in — a second scan of the same QR matches 0 rows.
  let update = supabase
    .from("tickets")
    .update({
      checked_in_at: new Date().toISOString(),
      checked_in_by: user.id,
    })
    .is("checked_in_at", null);
  update = qrToken
    ? update.eq("qr_token", qrToken)
    : update.eq("ticket_number", ticketNumber!.toUpperCase());

  const { data: claimed, error: claimError } = await update
    .select("*, registrations(*)")
    .maybeSingle<TicketWithRegistration>();

  if (claimError) {
    console.error("[checkin] update failed:", claimError);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  if (claimed) {
    return NextResponse.json({ result: "ok", participant: participant(claimed) });
  }

  // Nothing claimed: distinguish "already checked in" from "not found".
  let lookup = supabase.from("tickets").select("*, registrations(*)");
  lookup = qrToken
    ? lookup.eq("qr_token", qrToken)
    : lookup.eq("ticket_number", ticketNumber!.toUpperCase());
  const { data: existing } = await lookup.maybeSingle<TicketWithRegistration>();

  if (existing) {
    return NextResponse.json({
      result: "already",
      participant: participant(existing),
    });
  }
  return NextResponse.json({ result: "not_found" });
}
