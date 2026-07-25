'use client';

import { useQuery } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { getCurrentUser } from '@/lib/api/dashboard';

export default function SettingsPage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">Account settings</h2>
        <p className="mt-1 text-sm text-slate-500">Review your ApplyFlow account information.</p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-indigo-600">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-950">Profile</h3>
            <p className="text-sm text-slate-500">Your current account details.</p>
          </div>
        </div>
        {isLoading ? (
          <div className="mt-6 space-y-3">
            <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600">Could not load account information.</p>
        ) : (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{user?.name ?? 'Not provided'}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs text-slate-500">Email</dt>
              <dd className="mt-1 break-all text-sm font-medium text-slate-900">{user?.email}</dd>
            </div>
          </dl>
        )}
        <p className="mt-5 text-xs text-slate-400">
          Editable profile and goal preferences are not available yet.
        </p>
      </section>
    </div>
  );
}
