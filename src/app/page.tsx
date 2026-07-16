import { Logo } from "@/components/Logo";
import { RegistrationForm } from "@/components/RegistrationForm";
import { batchYears, eventConfig } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
          <Logo href="/" />
          <span className="text-sm font-medium text-slate-500">
            {eventConfig.eventName}
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reserve your ticket
          </h1>
          <p className="mt-2 text-slate-500">
            Fill in your details to reserve a ticket for{" "}
            <span className="font-semibold text-slate-700">
              {eventConfig.eventName}
            </span>
            . You&apos;ll receive an email with payment instructions.
          </p>
        </div>

        <RegistrationForm years={batchYears()} />

        <ol className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
          {[
            ["1. Reserve", "Submit your details and get a confirmation email."],
            ["2. Pay & upload", "Transfer the ticket fee and upload your payment slip."],
            ["3. Get your QR", "Once verified, your ticket QR arrives by email — scan it at the gate."],
          ].map(([title, text]) => (
            <li
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-bold text-indigo-600">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Attendly · Powered by ARC AI
      </footer>
    </main>
  );
}
