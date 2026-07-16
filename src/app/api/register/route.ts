import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { registrationSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email/send";
import { reservationEmail } from "@/lib/email/templates";
import { portalUrl } from "@/lib/config";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid details.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { fullName, email, phone, batch } = parsed.data;
  const supabase = createAdminClient();

  const { data: existing, error: lookupError } = await supabase
    .from("registrations")
    .select("id")
    .ilike("email", email)
    .limit(1);

  if (lookupError) {
    console.error("[register] lookup failed:", lookupError);
    return NextResponse.json(
      { error: "Server error — please try again in a moment." },
      { status: 500 }
    );
  }
  if (existing && existing.length > 0) {
    return NextResponse.json(
      {
        error:
          "This email is already registered. Check your inbox for your reservation email, or contact the organizers.",
      },
      { status: 409 }
    );
  }

  const { data: registration, error: insertError } = await supabase
    .from("registrations")
    .insert({ full_name: fullName, email, phone, batch })
    .select()
    .single();

  if (insertError || !registration) {
    console.error("[register] insert failed:", insertError);
    return NextResponse.json(
      { error: "Could not save your reservation — please try again." },
      { status: 500 }
    );
  }

  const link = portalUrl(registration.access_token);
  const { subject, html } = reservationEmail({
    fullName,
    batch,
    reference: registration.id.slice(0, 8).toUpperCase(),
    portalUrl: link,
  });
  const emailResult = await sendEmail({ to: email, subject, html });

  return NextResponse.json({
    portalUrl: `/r/${registration.access_token}`,
    emailSent: emailResult.sent,
  });
}
