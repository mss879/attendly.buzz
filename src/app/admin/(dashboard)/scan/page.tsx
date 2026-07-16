import { FadeIn } from "@/components/admin/FadeIn";
import { GateScanner } from "@/components/admin/GateScanner";

export default function ScanPage() {
  return (
    <FadeIn className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Gate scanner
      </h1>
      <p className="mb-5 mt-0.5 text-sm text-slate-500">
        Point the camera at a participant&apos;s ticket QR code. If a camera
        isn&apos;t available, enter the ticket number manually below.
      </p>
      <GateScanner />
    </FadeIn>
  );
}
