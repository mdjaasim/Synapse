"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm text-neutral-500">Something went wrong.</p>
      <button type="button" onClick={() => reset()} className="text-xs underline">
        Try again
      </button>
    </main>
  );
}
