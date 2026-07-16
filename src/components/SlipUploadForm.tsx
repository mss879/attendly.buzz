"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SLIP_ALLOWED_TYPES, SLIP_MAX_BYTES } from "@/lib/validation";

export function SlipUploadForm({ token }: { token: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please choose your payment slip file first.");
      return;
    }
    if (!(file.type in SLIP_ALLOWED_TYPES)) {
      setError("Only JPG, PNG, WebP or PDF files are accepted.");
      return;
    }
    if (file.size > SLIP_MAX_BYTES) {
      setError("The file is larger than 5 MB. Please upload a smaller file.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.set("token", token);
      form.set("file", file);
      const res = await fetch("/api/slip", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor="slip"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
      >
        <span className="text-2xl">🧾</span>
        <span className="mt-2 text-sm font-semibold text-slate-700">
          {fileName ?? "Tap to choose your payment slip"}
        </span>
        <span className="mt-1 text-xs text-slate-400">
          JPG · PNG · WebP · PDF, up to 5 MB
        </span>
        <input
          id="slip"
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Upload payment slip"}
      </button>
    </form>
  );
}
