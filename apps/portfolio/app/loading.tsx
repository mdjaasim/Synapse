export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02030a]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-pulse rounded-full border border-neutral-700" aria-hidden />
        <p className="text-xs tracking-widest text-neutral-600 uppercase">Awakening SYNAPSE</p>
      </div>
    </div>
  );
}
