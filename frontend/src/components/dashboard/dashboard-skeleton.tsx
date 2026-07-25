export default function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-7" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-5" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-5" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-4" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-3" />
      </div>
    </div>
  );
}
