"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function RegistrationForm({ years }: { years: string[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ portalUrl: string; emailSent: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      batch: String(form.get("batch") ?? ""),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone({ portalUrl: data.portalUrl, emailSent: data.emailSent });
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-emerald-900">
          Reservation received!
        </h2>
        <p className="mt-2 text-sm text-emerald-800">
          {done.emailSent
            ? "We've emailed you the payment instructions and your personal link."
            : "Your reservation is saved. Use your personal page below for payment instructions."}{" "}
          After you pay, upload your payment slip on your personal page.
        </p>
        <Link
          href={done.portalUrl}
          className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Go to my reservation page
        </Link>
        <p className="mt-3 text-xs text-emerald-700">
          Keep the email — it contains this same personal link.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-slate-700">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          placeholder="e.g. Mohamed Azam"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+94 77 123 4567"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="batch" className="mb-1 block text-sm font-semibold text-slate-700">
          Batch (class of)
        </label>
        <select id="batch" name="batch" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select your batch year
          </option>
          {years.map((y) => (
            <option key={y} value={y}>
              Class of {y}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Reserving…" : "Reserve my ticket"}
      </button>
    </form>
  );
}
