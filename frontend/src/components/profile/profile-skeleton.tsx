export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6" aria-label="Loading profile">
      <div className="space-y-2">
        <div className="h-8 w-36 rounded-lg bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-200" />
      </div>
      <div className="h-48 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-24 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[34rem] rounded-2xl border border-slate-200 bg-white" />
        <div className="h-[29rem] rounded-2xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}
