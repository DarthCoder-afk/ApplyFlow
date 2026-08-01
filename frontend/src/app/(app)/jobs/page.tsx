'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJobs } from '@/lib/api/jobs';
import JobForm from '@/src/components/jobs/job-form';
import JobRow from '@/src/components/jobs/job-row';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useDeferredValue, useEffect, useState } from 'react';
import { Job, JobPriority, JobSource } from '@/lib/types/job';
import { Input } from '@/src/components/ui/input';
import {
  ArrowUpDown,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flag,
  Globe2,
  Link2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import { keepPreviousData } from '@tanstack/react-query';
import {
  JOB_PRIORITIES,
  JOB_PRIORITY_LABELS,
  JOB_SOURCE_LABELS,
  JOB_SOURCES,
} from '@/lib/validation/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import JobSourceIcon from '@/src/components/jobs/job-source-icon';
import { createApplication } from '@/lib/api/applications';
import { buildApplicationPayloadFromJob, getDeadlineState, getJobAgeLabel } from '@/lib/job-opportunity';
import { toast } from 'sonner';

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<JobSource | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priority, setPriority] = useState<JobPriority | 'ALL'>('ALL');
  const [hasApplication, setHasApplication] = useState<boolean | undefined>();
  const [closingSoon, setClosingSoon] = useState<boolean | undefined>();
  const [sort, setSort] = useState<'createdAt' | 'title' | 'company' | 'priority' | 'deadline'>('createdAt');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [markAppliedJob, setMarkAppliedJob] = useState<Job | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [applicationDate, setApplicationDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const globalSearch = new URLSearchParams(window.location.search).get('search');
      if (globalSearch) {
        setSearch(globalSearch);
        setPage(1);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', deferredSearch, locationFilter, sourceFilter, priority, hasApplication, closingSoon, sort, fromDate, toDate, page],
    queryFn: () =>
      getJobs({
        limit: 10,
        page,
        ...(deferredSearch ? { search: deferredSearch } : {}),
        ...(locationFilter ? { location: locationFilter } : {}),
        ...(sourceFilter !== 'ALL' ? { source: sourceFilter } : {}),
        ...(priority !== 'ALL' ? { priority } : {}),
        ...(hasApplication !== undefined ? { hasApplication } : {}),
        ...(closingSoon !== undefined ? { closingSoon } : {}),
        sort,
        order: sort === 'title' || sort === 'company' || sort === 'priority' || sort === 'deadline' ? 'asc' : 'desc',
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  const markAppliedMutation = useMutation({
    mutationFn: (job: Job) =>
      createApplication({
        ...buildApplicationPayloadFromJob(job),
        appliedAt: new Date(`${applicationDate}T12:00:00`).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setMarkAppliedJob(null);
      toast.success('Application created');
    },
    onError: (mutationError) =>
      toast.error(mutationError instanceof Error ? mutationError.message : 'Could not create application'),
  });

  function clearFilters() {
    setSort('createdAt');
    setSourceFilter('ALL');
    setPriority('ALL');
    setHasApplication(undefined);
    setClosingSoon(undefined);
    setLocationFilter('');
    setFromDate('');
    setToDate('');
    setSearch('');
    setShowDateFilter(false);
    setPage(1);
  }

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

  const hasActiveFilters =
    Boolean(search || fromDate || toDate) ||
    sourceFilter !== 'ALL' ||
    priority !== 'ALL' ||
    hasApplication !== undefined ||
    closingSoon !== undefined ||
    Boolean(locationFilter);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search saved jobs..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white pl-11 shadow-none"
            />
          </div>
          <div className="flex justify-end sm:contents">
            <Button
              type="button"
              variant="ghost"
              aria-label="Open job filters"
              onClick={() => setFiltersOpen(true)}
              className="h-11 shrink-0 rounded-xl bg-transparent px-4 shadow-none"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={openCreate}
              className="hidden h-11 shrink-0 bg-indigo-600 px-4 text-white shadow-sm hover:bg-indigo-700 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Add job
            </Button>
          </div>
        </div>

        {(sourceFilter !== 'ALL' || priority !== 'ALL' ||
          hasApplication !== undefined || closingSoon !== undefined || locationFilter || fromDate || toDate || search) && (
          <div className="flex flex-wrap items-center gap-2">
            {sourceFilter !== 'ALL' && <button onClick={() => setSourceFilter('ALL')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">{JOB_SOURCE_LABELS[sourceFilter]} ×</button>}
            {priority !== 'ALL' && <button onClick={() => setPriority('ALL')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">{JOB_PRIORITY_LABELS[priority]} priority ×</button>}
            {hasApplication !== undefined && <button onClick={() => setHasApplication(undefined)} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">{hasApplication ? 'Has application' : 'No application'} ×</button>}
            {closingSoon !== undefined && <button onClick={() => setClosingSoon(undefined)} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">Closing soon ×</button>}
            {locationFilter && <button onClick={() => setLocationFilter('')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">{locationFilter} ×</button>}
            {(fromDate || toDate) && <button onClick={() => { setFromDate(''); setToDate(''); setShowDateFilter(false); }} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">Date saved ×</button>}
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
          </div>
        )}

        {isLoading && !data && <ListSkeleton rows={5} />}
        {error && <p className="text-red-600">Could not load jobs.</p>}

        {data && data.jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-[#212529]">
              {hasActiveFilters
                ? 'No jobs match your filters'
                : 'No jobs saved yet'}
            </p>
            <p className="mt-1 text-sm text-[#6c757d]">
              {hasActiveFilters
                ? 'Try clearing search or changing the source filter.'
                : 'Save an opportunity to compare it before applying.'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {hasActiveFilters && <Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
              <Button onClick={openCreate}>Add job</Button>
            </div>
          </div>
        )}

        {data && data.jobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onEdit={openEdit}
                  onView={setSelectedJob}
                  onMarkApplied={setMarkAppliedJob}
                />
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

      <div aria-hidden="true" className="h-16 sm:hidden" />
      <Button
        type="button"
        onClick={openCreate}
        aria-label="Add job"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-indigo-600 p-0 text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] hover:bg-indigo-700 sm:hidden"
      >
        <Plus className="h-6 w-6" />
      </Button>

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

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Job filters"
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Filter jobs</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Refine your saved opportunities</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)} className="h-9 w-9 rounded-xl p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="scrollbar-hidden flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-5">
              <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ArrowUpDown className="h-4 w-4 text-indigo-500" />
                  Sort by
                </label>
                <Select value={sort} onValueChange={(value) => { setSort(value as typeof sort); setPage(1); }}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="createdAt">Newest saved</SelectItem>
                    <SelectItem value="priority">Highest priority</SelectItem>
                    <SelectItem value="deadline">Closing soon</SelectItem>
                    <SelectItem value="company">Company A–Z</SelectItem>
                    <SelectItem value="title">Job title A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Globe2 className="h-4 w-4 text-indigo-500" />
                  Source
                </label>
                <Select value={sourceFilter} onValueChange={(value) => handleSourceChange(value as JobSource | 'ALL')}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ALL">All sources</SelectItem>
                    {JOB_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        <JobSourceIcon source={source} />{JOB_SOURCE_LABELS[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Flag className="h-4 w-4 text-indigo-500" />
                  Priority
                </label>
                <Select value={priority} onValueChange={(value) => setPriority(value as JobPriority | 'ALL')}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ALL">All priorities</SelectItem>
                    {JOB_PRIORITIES.map((value) => (
                      <SelectItem key={value} value={value}>{JOB_PRIORITY_LABELS[value]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="job-location-filter" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Location
                </label>
                <Input id="job-location-filter" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} placeholder="City or location" className="h-11 rounded-xl border-slate-200 bg-slate-50 shadow-none" />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Link2 className="h-4 w-4 text-indigo-500" />
                  Application link
                </label>
                <Select
                  value={hasApplication === undefined ? 'ALL' : String(hasApplication)}
                  onValueChange={(value) => setHasApplication(value === 'ALL' ? undefined : value === 'true')}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ALL">Any</SelectItem>
                    <SelectItem value="true">Has application</SelectItem>
                    <SelectItem value="false">No application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </section>

              <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Quick filters
                </p>
              <Button
                type="button"
                variant={closingSoon ? 'default' : 'outline'}
                onClick={() => setClosingSoon(closingSoon ? undefined : true)}
                className={`h-11 w-full justify-start rounded-xl shadow-none ${
                  closingSoon
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Clock3 className="h-4 w-4" />
                Closing within 7 days
              </Button>
                <Button
                  type="button"
                  variant={showDateFilter ? 'secondary' : 'outline'}
                  onClick={() => {
                    if (showDateFilter) {
                      setFromDate('');
                      setToDate('');
                    }
                    setShowDateFilter((value) => !value);
                  }}
                  className="h-11 w-full justify-start rounded-xl border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-50"
                >
                  <CalendarDays className="h-4 w-4 text-indigo-500" />
                  {showDateFilter ? 'Remove date filter' : 'Filter by date saved'}
                </Button>
                {showDateFilter && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <label className="text-xs font-medium text-slate-500">
                      From
                      <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} aria-label="Saved from" className="mt-1.5 rounded-xl bg-slate-50" />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      To
                      <Input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} aria-label="Saved to" className="mt-1.5 rounded-xl bg-slate-50" />
                    </label>
                  </div>
                )}
              </section>
            </div>
            <div className="flex gap-2 bg-white p-4 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
              <Button variant="outline" onClick={clearFilters} className="h-11 flex-1 rounded-xl border-slate-200">
                <RotateCcw className="h-4 w-4" />
                Clear all
              </Button>
              <Button onClick={() => setFiltersOpen(false)} className="h-11 flex-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                Show results
              </Button>
            </div>
          </aside>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close job details"
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedJob.title} details`}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 bg-white px-6 py-5 shadow-sm">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-500">
                    Saved opportunity
                  </p>
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-xl font-semibold text-slate-950">{selectedJob.title}</h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(null);
                      openEdit(selectedJob);
                    }}
                    className="h-8 w-8 shrink-0 rounded-lg p-0 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    aria-label={`Edit ${selectedJob.title}`}
                    title="Edit job"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedJob.company}
                  {selectedJob.location ? ` · ${selectedJob.location}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {JOB_PRIORITY_LABELS[selectedJob.priority]} priority
                  </span>
                  <span className="text-xs text-slate-500">
                    {getJobAgeLabel(selectedJob.createdAt)}
                  </span>
                </div>
              </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)} className="h-9 w-9 shrink-0 rounded-xl p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="scrollbar-hidden flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Overview</h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      {selectedJob.source ? (
                        <JobSourceIcon source={selectedJob.source} className="h-3.5 w-3.5" />
                      ) : null}
                      Source
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {selectedJob.source ? JOB_SOURCE_LABELS[selectedJob.source] : 'Not provided'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />Date saved
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">{getJobAgeLabel(selectedJob.createdAt)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Flag className="h-3.5 w-3.5" />Priority
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">{JOB_PRIORITY_LABELS[selectedJob.priority]}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />Deadline
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">{getDeadlineState(selectedJob.deadline)?.label ?? 'Not provided'}</dd>
                  </div>
                  <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />Application
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {selectedJob.applications[0]
                        ? 'Linked to application'
                        : 'Not applied yet'}
                    </dd>
                  </div>
                </dl>
                {selectedJob.possibleDuplicate && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-900">Possible duplicate</p>
                    <p className="mt-0.5 text-sm text-amber-700">
                      A similar saved opportunity may already exist. Review it before taking action.
                    </p>
                  </div>
                )}
                {selectedJob.jobUrl && (
                  <a href={selectedJob.jobUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                    Open original listing<ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Job details</h3>
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedJob.description || 'No description saved.'}</p>
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Personal notes</h3>
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedJob.notes || 'No personal notes yet.'}</p>
                </div>
              </section>
            </div>
            <div className="flex justify-end bg-white p-4 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
              {selectedJob.applications[0] ? (
                <Button onClick={() => window.location.assign('/applications')} className="h-11 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-700">Open application</Button>
              ) : (
                <Button onClick={() => { setMarkAppliedJob(selectedJob); setSelectedJob(null); }} className="h-11 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-700">Mark as applied</Button>
              )}
            </div>
          </aside>
        </div>
      )}

      {markAppliedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close mark as applied dialog"
            onClick={() => setMarkAppliedJob(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-950">Mark as applied</h2>
            <p className="mt-1 text-sm text-slate-500">{markAppliedJob.title} · {markAppliedJob.company}</p>
            <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="application-date">Application date</label>
            <Input id="application-date" type="date" value={applicationDate} onChange={(event) => setApplicationDate(event.target.value)} className="mt-2" />
            <p className="mt-3 text-xs text-slate-500">
              This creates a linked application with the initial Applied status. The saved job remains in your opportunity workspace.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMarkAppliedJob(null)}>Cancel</Button>
              <Button
                disabled={markAppliedMutation.isPending || !applicationDate}
                onClick={() => markAppliedMutation.mutate(markAppliedJob)}
                className="bg-slate-950 text-white"
              >
                {markAppliedMutation.isPending ? 'Creating...' : 'Create application'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
