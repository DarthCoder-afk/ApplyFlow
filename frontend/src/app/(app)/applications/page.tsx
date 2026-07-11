'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/lib/api/applications';
import AddApplicationForm from '@/src/components/applications/add-application-form';
import StatusBadge from '@/src/components/applications/status-badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import type { ApplicationStatus } from '@/lib/types/application';
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', statusFilter],
    queryFn: () =>
      getApplications({
        limit: 20,
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      }),
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold">Applications</h1>
                <p className="mt-1 text-slate-600">
                Track your job applications and their statuses.
                </p>
            </div>

            <Button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
                Add application
            </Button>
        </div>

        <div className="flex flex-wrap gap-2">
            {(['ALL', 'APPLIED', 'INTERVIEW', 'OFFER'] as const).map((s) => (
                <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                    'rounded-full px-3 py-1 text-sm font-medium transition',
                    statusFilter === s
                    ? 'bg-cyan-100 text-cyan-800'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                )}
                >
                {s === 'ALL' ? 'All' : s}
                </button>
            ))}
        </div>

        {isLoading && <p className="text-center text-slate-600">Loading jobs...</p>}
        {error && <p className="text-red-600">Could not load applications.</p>}

        {data && data.applications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-900">No applications tracked yet</p>
                <p className="mt-1 text-sm text-slate-600">Add your first application to get started.</p>
            </div>
        )}

        {data && data.applications.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ul className="divide-y divide-slate-100">
                    {data.applications.map((application) => (
                        <li key={application.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-medium">{application.job.title}</p>
                            <p className="text-sm text-slate-500">{application.job.company}</p>
                            {application.notes && <p className="mt-1 text-xs text-slate-500">{application.notes}</p>}
                        </div>
                        <StatusBadge status={application.status} />
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>

      {showForm && (
        /* same modal pattern as jobs */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close" onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
          <Card className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-slate-200 bg-white shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <CardTitle>New application</CardTitle>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">✕</button>
            </CardHeader>
            <CardContent>
              <AddApplicationForm onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}