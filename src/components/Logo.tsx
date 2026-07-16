import Link from "next/link";

const sizes = {
  sm: { word: "text-lg", tag: "text-[8px]", mark: "h-6 w-6" },
  md: { word: "text-2xl", tag: "text-[9px]", mark: "h-8 w-8" },
  lg: { word: "text-4xl", tag: "text-[11px]", mark: "h-11 w-11" },
} as const;

const accents = {
  indigo: "text-indigo-600",
  orange: "text-orange-600",
} as const;

function Mark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="attendly-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#attendly-mark)" />
      <path
        d="M6 19c4-3.5 16-3.5 20 0M8 13.5c3.5-2.8 12.5-2.8 16 0M11 8.8c2.6-1.7 7.4-1.7 10 0"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  size = "md",
  href,
  accent = "indigo",
  withMark = false,
}: {
  size?: keyof typeof sizes;
  href?: string;
  accent?: keyof typeof accents;
  withMark?: boolean;
}) {
  const s = sizes[size];
  const mark = (
    <span className="inline-flex items-center gap-2">
      {withMark && <Mark className={s.mark} />}
      <span className="inline-flex flex-col items-end leading-none">
        <span className={`${s.word} font-bold tracking-tight text-slate-900`}>
          Attend<span className={accents[accent]}>ly</span>
        </span>
        <span className={`${s.tag} font-medium uppercase tracking-wide text-slate-400`}>
          Powered by ARC AI
        </span>
      </span>
    </span>
  );
  return href ? <Link href={href}>{mark}</Link> : mark;
}
