"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-medium text-neutral-200">Something drifted off course</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        The experience encountered an unexpected error. You can try again or return to the journey.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-neutral-800 px-4 py-2 text-xs text-neutral-500"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
