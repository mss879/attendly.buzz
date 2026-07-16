# Attendly

*Powered by ARC AI*

Event ticketing system for alumni ("EX") events: ticket reservation → payment-slip tracking → QR ticket issuance → gate check-in scanning.

**Stack:** Next.js 16 (App Router, TypeScript, Tailwind) · Supabase (Postgres, Auth, Storage) · Resend (email)

## The flow

1. **Reserve** — an EX fills in name, phone, email and batch on `/`. They get a reservation email with bank payment instructions and a personal link.
2. **Pay & upload** — after transferring the fee, they upload the payment slip on their personal page (`/r/<token>`).
3. **Verify** — an organizer reviews the slip in `/admin/registrations` and clicks **Verify**. The system issues a sequential ticket number + QR code and emails it.
4. **Gate** — staff open `/admin/scan` on a phone, scan the QR (or type the ticket number), and the participant is checked in. Duplicate scans show a red "ALREADY CHECKED IN" warning. `/admin/checkins` lists everyone inside.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the four migration files **in order**:
   - `supabase/migrations/0001_registrations.sql`
   - `supabase/migrations/0002_payment_slips.sql`
   - `supabase/migrations/0003_tickets.sql`
   - `supabase/migrations/0004_seats.sql`
3. Create organizer accounts: **Authentication → Users → Add user** (email + password, confirm email). Every authenticated user is an organizer.

### 2. Resend

1. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
2. For production, verify your domain and set `EMAIL_FROM` to e.g. `Attendly <tickets@yourdomain.com>`. Without a verified domain, Resend only delivers to your own account email (using `onboarding@resend.dev`).

### 3. Environment

```bash
cp .env.local.example .env.local
```

Fill in the Supabase URL + keys, Resend key, your public app URL, and the event/bank details (these appear in emails and on the payment page).

### 4. Run

```bash
npm install
npm run dev
```

- Public registration: `http://localhost:3000/`
- Admin portal: `http://localhost:3000/admin`

> **Note:** the gate scanner needs camera access, which browsers only allow on `localhost` or **HTTPS** — deploy (e.g. Vercel) before using it on phones at the venue.

## Design notes

- **Security:** all writes go through server route handlers using the service-role key. RLS is enabled on every table with no public policies. Registrants authenticate with an unguessable personal token; organizers with Supabase Auth. Payment slips live in a private bucket, viewed via short-lived signed URLs.
- **QR reliability:** the QR encodes only a 36-char opaque token (low QR version → large modules), error-correction level Q, 600×600 PNG with a proper quiet zone — scans fast even printed or on cracked screens. Manual ticket-number entry is the gate fallback.
- **Double-entry protection:** check-in is a single atomic `UPDATE … WHERE checked_in_at IS NULL`, so the same ticket can never check in twice, even from two gates simultaneously.
- **Fail-soft email:** if Resend is down or unconfigured, reservations/verifications still succeed; the personal link is also shown on-screen after registering.
