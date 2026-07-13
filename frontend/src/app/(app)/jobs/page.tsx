'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/api/jobs';
import JobForm from '@/src/components/jobs/job-form';
import JobRow from '@/src/components/jobs/job-row';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useState } from 'react';
import { Job } from '@/lib/types/job';
import { Input } from '@/src/components/ui/input';
import { Search, Plus } from 'lucide-react';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import { keepPreviousData } from '@tanstack/react-query';

export default function JobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', search],
    queryFn: () =>
      getJobs({
        limit: 20,
        ...(search ? { search } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  function openCreate() {
    setEditingJob(null);
    setModalOpen(true);
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingJob(null);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="mt-1 text-[#6c757d]">
              Save and organize opportunities you want to pursue.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreate}
            className="bg-[#212529] text-white hover:bg-[#343a40]"
          >
            <Plus className="h-4 w-4" />
            Add job
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c757d]" />
          <Input
            type="search"
            placeholder="Search by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading && !data && <ListSkeleton rows={5} />}
        {error && <p className="text-red-600">Could not load jobs.</p>}

        {data && data.jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dee2e6] bg-white p-10 text-center">
            <p className="font-medium text-[#212529]">
              {search ? 'No jobs match your search' : 'No jobs saved yet'}
            </p>
            <p className="mt-1 text-sm text-[#6c757d]">
              {search ? 'Try a different keyword.' : 'Add your first job lead to get started.'}
            </p>
          </div>
        )}

        {data && data.jobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#dee2e6] bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.jobs.map((job) => (
                <JobRow key={job.id} job={job} onEdit={openEdit} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop — click to close */}
          <button
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 bg-[#212529]/30 backdrop-blur-sm"
          />
          {/* Centered modal */}
          <Card className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-[#dee2e6] bg-white shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <CardTitle>{editingJob ? 'Edit job' : 'Add a new job'}</CardTitle>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-sm text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#212529]"
                aria-label="Close"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <JobForm
                key={editingJob?.id ?? 'new'}
                job={editingJob ?? undefined}
                onSuccess={closeModal}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
