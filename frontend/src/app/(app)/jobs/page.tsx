'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/api/jobs';
import AddJobForm from '@/src/components/jobs/add-job-form';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useState } from 'react';

export default function JobsPage() {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs({ limit: 20 }),
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="mt-1 text-slate-600">
              Save and organize opportunities you want to pursue.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          >
            Add job
          </Button>
        </div>

        {isLoading && <p className="text-center text-slate-600">Loading jobs...</p>}
        {error && <p className="text-red-600">Could not load jobs.</p>}

        {data && data.jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-900">No jobs saved yet</p>
            <p className="mt-1 text-sm text-slate-600">Add your first job lead to get started.</p>
          </div>
        )}

        {data && data.jobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.jobs.map((job) => (
                <li
                  key={job.id}
                  className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{job.title}</p>
                    <p className="text-sm text-slate-500">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ''}
                    </p>
                  </div>
                  {job.source && (
                    <span className="inline-flex w-fit rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                      {job.source.replace('_', ' ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop — click to close */}
          <button
            type="button"
            aria-label="Close add job form"
            onClick={() => setShowForm(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />
          {/* Centered modal */}
          <Card className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-slate-200 bg-white shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <CardTitle>Add a new job</CardTitle>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <AddJobForm onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
