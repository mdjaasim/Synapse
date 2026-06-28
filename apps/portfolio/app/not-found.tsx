import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-medium text-neutral-200">Lost in the void</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        This path doesn&apos;t exist in the SYNAPSE universe.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
      >
        Return to Origin
      </Link>
    </div>
  );
}
