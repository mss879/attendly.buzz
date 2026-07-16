import Link from "next/link";

export function Footer({ admin = false }: { admin?: boolean }) {
  return (
    <footer className="flex flex-col items-center justify-center gap-2 pt-6 pb-4 text-[11px] font-medium uppercase tracking-wider text-orange-950/60">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <span>{admin ? "Attendly Admin" : "Attendly"}</span>
        <span>·</span>
        <span>Powered by</span>
        <a
          href="https://www.arcai.agency"
          target="_blank"
          rel="noopener"
          title="ARC AI Agency - AI Automation & Event Solutions"
          className="inline-flex items-center hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arc-logo.png"
            alt="ARC AI Logo"
            className="h-5 w-auto object-contain"
          />
        </a>
      </div>
      <div>
        <Link
          href="/privacy"
          className="transition hover:text-orange-800 hover:underline underline-offset-4 text-orange-950/50 hover:text-orange-950/80"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
