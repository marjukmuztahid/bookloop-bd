const SkeletonBookCard = () => (
  <div className="glass-panel overflow-hidden p-3" style={{ minHeight: 340 }}>
    <div className="mb-3 aspect-[3/4] animate-pulse rounded-[14px] bg-[rgba(0,0,0,0.06)]" />
    <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
    <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
    <div className="mb-3 flex gap-1.5">
      <div className="h-6 w-20 animate-pulse rounded-full bg-[rgba(0,0,0,0.06)]" />
      <div className="h-6 w-14 animate-pulse rounded-full bg-[rgba(0,0,0,0.06)]" />
    </div>
    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
    <div className="h-3 w-20 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
  </div>
);

const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonBookCard key={i} />
    ))}
  </div>
);

export { SkeletonBookCard, SkeletonGrid };
