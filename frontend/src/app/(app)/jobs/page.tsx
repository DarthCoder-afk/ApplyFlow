'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/api/jobs';
import JobForm from '@/src/components/jobs/job-form';
import JobRow from '@/src/components/jobs/job-row';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useState } from 'react';
import { Job, JobSource } from '@/lib/types/job';
import { Input } from '@/src/components/ui/input';
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import { keepPreviousData } from '@tanstack/react-query';
import { JOB_SOURCE_LABELS, JOB_SOURCES } from '@/lib/validation/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

export default function JobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<JobSource | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', search, sourceFilter, fromDate, toDate, page],
    queryFn: () =>
      getJobs({
        limit: 10,
        page,
        ...(search ? { search } : {}),
        ...(sourceFilter !== 'ALL' ? { source: sourceFilter } : {}),
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
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

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSourceChange(source: JobSource | 'ALL') {
    setSourceFilter(source);
    setPage(1);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 px-6 py-7 text-white shadow-lg sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-cyan-300" />
                Opportunity pipeline
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Jobs</h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                {data
                  ? `${data.pagination.total} saved opportunities, all in one place.`
                  : 'Save and organize opportunities you want to pursue.'}
              </p>
            </div>

            <Button
              type="button"
              onClick={openCreate}
              className="bg-white text-slate-900 shadow-sm hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Add job
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <Select
            value={sourceFilter}
            onValueChange={(value) => handleSourceChange(value as JobSource | 'ALL')}
          >
            <SelectTrigger
              className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 px-3 shadow-none sm:w-44"
              aria-label="Filter jobs by source"
            >
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="ALL">All sources</SelectItem>
              {JOB_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {JOB_SOURCE_LABELS[source]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="from-date"
                  className="shrink-0 text-sm font-medium text-slate-600"
                >
                  From
                </label>

                <Input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 min-w-0 flex-1 rounded-xl border-slate-200 bg-slate-50 shadow-none sm:w-40"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="to-date"
                  className="shrink-0 text-sm font-medium text-slate-600"
                >
                  To
                </label>

                <Input
                  id="to-date"
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 min-w-0 flex-1 rounded-xl border-slate-200 bg-slate-50 shadow-none sm:w-40"
                />
              </div>
            </div>

            <div className="relative w-full lg:w-[28rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by title, company, or location..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-white pl-11 shadow-sm placeholder:text-slate-400 focus-visible:ring-slate-400"
              />
            </div>
          </div>
        </div>

        {isLoading && !data && <ListSkeleton rows={5} />}
        {error && <p className="text-red-600">Could not load jobs.</p>}

        {data && data.jobs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <p className="font-medium text-[#212529]">
              {search || sourceFilter !== 'ALL'
                ? 'No jobs match your filters'
                : 'No jobs saved yet'}
            </p>
            <p className="mt-1 text-sm text-[#6c757d]">
              {search || sourceFilter !== 'ALL'
                ? 'Try clearing search or changing the source filter.'
                : 'Add your first job lead to get started.'}
            </p>
          </div>
        )}

        {data && data.jobs.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.jobs.map((job) => (
                <JobRow key={job.id} job={job} onEdit={openEdit} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">{data.pagination.total}</span> jobs · Page{' '}
            {data.pagination.page} of {data.pagination.totalPages}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
               className="flex-1 sm:flex-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 sm:flex-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
