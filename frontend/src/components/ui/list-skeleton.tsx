export default function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center justify-between p-4">
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}
