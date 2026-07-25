'use client';

import { useDeferredValue, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  ExternalLink,
  List,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  deleteApplication,
  getApplications,
  updateApplication,
} from '@/lib/api/applications';
import type {
  Application,
  ApplicationsListResponse,
  ApplicationStatus,
} from '@/lib/types/application';
import type { JobSource } from '@/lib/types/job';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from '@/lib/validation/application';
import {
  JOB_SOURCE_LABELS,
  JOB_SOURCES,
} from '@/lib/validation/job';
import {
  getAppliedAgeLabel,
  getInterviewTimeLabel,
  getUpcomingInterview,
} from '@/lib/application-pipeline';
import AddApplicationForm from '@/src/components/applications/add-application-form';
import ApplicationRow from '@/src/components/applications/application-row';
import ApplicationStatusIcon from '@/src/components/applications/application-status-icon';
import StatusBadge from '@/src/components/applications/status-badge';
import InterviewPanel from '@/src/components/interviews/interview-panel';
import JobSourceIcon from '@/src/components/jobs/job-source-icon';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';

type ViewMode = 'list' | 'board';
type SortOption = 'appliedAt' | 'updatedAt' | 'status';

function getApplicationTimeline(application: Application) {
  const createdAt = new Date(application.createdAt);
  const appliedAt = application.appliedAt
    ? new Date(application.appliedAt)
    : null;

  if (
    appliedAt &&
    Math.abs(appliedAt.getTime() - createdAt.getTime()) < 60_000
  ) {
    return [
      {
        title: 'Application created and marked applied',
        date: appliedAt,
      },
    ];
  }

  return [
    { title: 'Application created', date: createdAt },
    ...(appliedAt ? [{ title: 'Applied', date: appliedAt }] : []),
  ].sort((first, second) => first.date.getTime() - second.date.getTime());
}

function BoardSkeleton() {
  return (
    <div className="scrollbar-hidden overflow-x-auto pb-3" aria-label="Loading application board">
      <div className="grid min-w-[1100px] grid-cols-6 gap-3">
        {APPLICATION_STATUSES.map((status, columnIndex) => (
          <section
            key={status}
            className="flex h-[calc(100dvh-24rem)] min-h-[22rem] flex-col rounded-2xl bg-slate-100/80 p-3 sm:h-[calc(100dvh-20rem)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="space-y-2 overflow-hidden">
              {Array.from({ length: columnIndex % 2 === 0 ? 3 : 2 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="animate-pulse rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-3/5 rounded bg-slate-100" />
                  <div className="mt-4 h-3 w-2/5 rounded bg-slate-100" />
                  <div className="mt-3 h-8 w-full rounded-lg bg-slate-100" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [followUpOnly, setFollowUpOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState<JobSource | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortOption>('appliedAt');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [view, setView] = useState<ViewMode>('board');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [draggedApplicationId, setDraggedApplicationId] = useState<string | null>(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const deferredCompany = useDeferredValue(company);

  const queryKey = [
    'applications',
    statusFilter,
    followUpOnly,
    deferredSearch,
    deferredCompany,
    source,
    fromDate,
    toDate,
    sort,
    view,
    page,
  ] as const;

  const { data, isLoading, isPlaceholderData, error } = useQuery({
    queryKey,
    queryFn: () =>
      getApplications({
        page,
        limit: view === 'board' ? 50 : 20,
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(followUpOnly ? { followUpNeeded: true } : {}),
        ...(deferredSearch ? { search: deferredSearch } : {}),
        ...(deferredCompany ? { company: deferredCompany } : {}),
        ...(source !== 'ALL' ? { source } : {}),
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
        sort,
        order: sort === 'status' ? 'asc' : 'desc',
      }),
    placeholderData: keepPreviousData,
  });

  const summary = data?.summary ?? {
    active:
      data?.applications.filter((application) =>
        ['SAVED', 'APPLIED', 'INTERVIEW'].includes(application.status)
      ).length ?? 0,
    needsFollowUp:
      data?.applications.filter((application) => application.followUpNeeded).length ?? 0,
    upcomingInterviews:
      data?.applications.reduce(
        (total, application) => total + (application.interviews?.length ?? 0),
        0
      ) ?? 0,
    offers:
      data?.applications.filter((application) => application.status === 'OFFER').length ?? 0,
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplication(id, { status }),
    onMutate: async ({ id, status }) => {
      setUpdatingApplicationId(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ApplicationsListResponse>(queryKey);
      queryClient.setQueryData<ApplicationsListResponse>(queryKey, (current) =>
        current
          ? {
              ...current,
              applications: current.applications.map((application) =>
                application.id === id ? { ...application, status } : application
              ),
            }
          : current
      );
      setSelectedApplication((current) =>
        current?.id === id ? { ...current, status } : current
      );
      return { previous };
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Could not update application status'
      );
    },
    onSuccess: () => toast.success('Application status updated'),
    onSettled: () => {
      setUpdatingApplicationId(null);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const notesMutation = useMutation({
    mutationFn: () =>
      updateApplication(selectedApplication!.id, { notes: notesDraft }),
    onSuccess: () => {
      setSelectedApplication((current) =>
        current ? { ...current, notes: notesDraft } : current
      );
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Notes updated');
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error ? mutationError.message : 'Could not update notes'
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(selectedApplication!.id),
    onSuccess: () => {
      setDeleteOpen(false);
      setSelectedApplication(null);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Application deleted');
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Could not delete application'
      ),
  });

  function clearFilters() {
    setStatusFilter('ALL');
    setFollowUpOnly(false);
    setSearch('');
    setCompany('');
    setSource('ALL');
    setFromDate('');
    setToDate('');
    setShowDateFilter(false);
    setPage(1);
  }

  function openDetails(application: Application) {
    setSelectedApplication(application);
    setNotesDraft(application.notes ?? '');
  }

  function changeStatus(application: Application, status: ApplicationStatus) {
    if (application.status === status || statusMutation.isPending) return;
    statusMutation.mutate({ id: application.id, status });
  }

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    followUpOnly ||
    Boolean(search || company || fromDate || toDate) ||
    source !== 'ALL';

  return (
    <>
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 px-6 py-5 text-white shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Applications</h1>
              <p className="mt-1 text-sm text-slate-300">
                {data ? `${summary.active} active applications` : 'Your hiring pipeline'}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-900 shadow-sm hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Add application
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search applications..."
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              className="h-11 rounded-xl border-slate-200 bg-white pl-11 shadow-none"
            />
          </div>
          <Select value={sort} onValueChange={(value) => { setSort(value as SortOption); setPage(1); }}>
            <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white shadow-none data-[size=default]:h-11 sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="appliedAt">Newest applied</SelectItem>
              <SelectItem value="updatedAt">Recently updated</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFiltersOpen(true)}
            className="h-11 bg-transparent px-3 shadow-none"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {statusFilter !== 'ALL' && (
              <button onClick={() => setStatusFilter('ALL')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">
                {APPLICATION_STATUS_LABELS[statusFilter]} ×
              </button>
            )}
            {followUpOnly && (
              <button onClick={() => setFollowUpOnly(false)} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">
                Needs follow-up ×
              </button>
            )}
            {company && (
              <button onClick={() => setCompany('')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">
                {company} ×
              </button>
            )}
            {source !== 'ALL' && (
              <button onClick={() => setSource('ALL')} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">
                {JOB_SOURCE_LABELS[source]} ×
              </button>
            )}
            {(fromDate || toDate) && (
              <button onClick={() => { setFromDate(''); setToDate(''); setShowDateFilter(false); }} className="rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200">
                Date applied ×
              </button>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
          </div>
        )}

        <div className="flex justify-end">
          <div
            className="flex rounded-lg bg-slate-100 p-1"
            aria-label="Application view"
          >
            <Button
              type="button"
              size="sm"
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => { setView('list'); setPage(1); }}
              className={view === 'list' ? 'bg-white text-slate-950 shadow-sm hover:bg-white' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === 'board' ? 'default' : 'ghost'}
              onClick={() => { setView('board'); setPage(1); }}
              className={view === 'board' ? 'bg-white text-slate-950 shadow-sm hover:bg-white' : ''}
            >
              <Columns3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {view === 'list' && isLoading && !data && <ListSkeleton rows={5} />}
        {view === 'board' && (isLoading || isPlaceholderData) && <BoardSkeleton />}
        {error && <p className="text-red-600">Could not load applications.</p>}

        {data && data.applications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-medium text-slate-900">
              {hasActiveFilters ? 'No applications match your filters' : 'No applications tracked yet'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {hasActiveFilters ? 'Try clearing or adjusting your filters.' : 'Add your first application to start your pipeline.'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {hasActiveFilters && <Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
              <Button onClick={() => setShowForm(true)}>Add application</Button>
            </div>
          </div>
        )}

        {data && data.applications.length > 0 && view === 'list' && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.applications.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  onView={openDetails}
                />
              ))}
            </ul>
          </div>
        )}

        {data &&
          data.applications.length > 0 &&
          view === 'board' &&
          !isPlaceholderData && (
          <div className="scrollbar-hidden overflow-x-auto pb-3">
            <div className="grid min-w-[1100px] grid-cols-6 gap-3">
              {APPLICATION_STATUSES.map((status) => {
                const columnApplications = data.applications.filter(
                  (application) => application.status === status
                );
                return (
                  <section
                    key={status}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      const application = data.applications.find(
                        (item) => item.id === draggedApplicationId
                      );
                      if (application) changeStatus(application, status);
                      setDraggedApplicationId(null);
                    }}
                    className="flex h-[calc(100dvh-24rem)] min-h-[22rem] flex-col rounded-2xl bg-slate-100/80 p-3 sm:h-[calc(100dvh-20rem)]"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-800">
                        {APPLICATION_STATUS_LABELS[status]}
                      </h2>
                      <span className="text-xs text-slate-400">{columnApplications.length}</span>
                    </div>
                    <div className="scrollbar-hidden min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5">
                      {columnApplications.map((application) => {
                        const upcomingInterview = getUpcomingInterview(application);
                        return (
                          <article
                            key={application.id}
                            draggable={!statusMutation.isPending}
                            onDragStart={() => setDraggedApplicationId(application.id)}
                            onDragEnd={() => setDraggedApplicationId(null)}
                            onClick={() => openDetails(application)}
                            className={`cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition ${
                              updatingApplicationId === application.id ? 'opacity-60' : 'hover:border-slate-300'
                            }`}
                          >
                            <p className="line-clamp-2 text-sm font-medium text-slate-900">
                              {application.job.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {application.job.company}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                              {getAppliedAgeLabel(application)}
                            </p>
                            {upcomingInterview ? (
                              <p className="mt-2 text-xs font-medium text-violet-700">
                                {getInterviewTimeLabel(upcomingInterview)}
                              </p>
                            ) : application.followUpNeeded ? (
                              <p className="mt-2 text-xs font-medium text-amber-700">
                                Follow-up recommended
                              </p>
                            ) : null}
                            <div onClick={(event) => event.stopPropagation()} className="mt-3">
                              <Select
                                value={application.status}
                                disabled={updatingApplicationId === application.id}
                                onValueChange={(nextStatus) =>
                                  changeStatus(application, nextStatus as ApplicationStatus)
                                }
                              >
                                <SelectTrigger className="w-full border-0 bg-slate-50 shadow-none data-[size=default]:h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {APPLICATION_STATUSES.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      <ApplicationStatusIcon status={option} />
                                      {APPLICATION_STATUS_LABELS[option]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </article>
                        );
                      })}
                      {columnApplications.length === 0 && (
                        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
                          No applications
                        </p>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">{data.pagination.total}</span> applications · Page{' '}
              {data.pagination.page} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                <ChevronLeft className="h-4 w-4" />Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage((value) => value + 1)}>
                Next<ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close" onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <Card className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <CardTitle>New application</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)} className="h-9 w-9 p-0" aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <AddApplicationForm onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <aside role="dialog" aria-modal="true" aria-label="Application filters" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)} className="h-9 w-9 p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as ApplicationStatus | 'ALL'); setPage(1); }}>
                  <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ALL">All statuses</SelectItem>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <ApplicationStatusIcon status={status} />
                        {APPLICATION_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="application-company" className="mb-2 block text-sm font-medium">Company</label>
                <Input id="application-company" value={company} onChange={(event) => { setCompany(event.target.value); setPage(1); }} placeholder="Company name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Source</label>
                <Select value={source} onValueChange={(value) => { setSource(value as JobSource | 'ALL'); setPage(1); }}>
                  <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ALL">All sources</SelectItem>
                    {JOB_SOURCES.map((jobSource) => (
                      <SelectItem key={jobSource} value={jobSource}>
                        <JobSourceIcon source={jobSource} />
                        {JOB_SOURCE_LABELS[jobSource]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant={followUpOnly ? 'default' : 'outline'}
                onClick={() => { setFollowUpOnly((value) => !value); setPage(1); }}
                className="w-full justify-start"
              >
                <Bell className="h-4 w-4" />Follow-up needed
              </Button>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (showDateFilter) {
                      setFromDate('');
                      setToDate('');
                    }
                    setShowDateFilter((value) => !value);
                  }}
                >
                  {showDateFilter ? 'Remove date filter' : 'Filter by date applied'}
                </Button>
                {showDateFilter && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} aria-label="Applied from" />
                    <Input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => { setToDate(event.target.value); setPage(1); }} aria-label="Applied to" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 border-t border-slate-200 p-4">
              <Button variant="outline" onClick={clearFilters} className="flex-1">Clear all</Button>
              <Button onClick={() => setFiltersOpen(false)} className="flex-1 bg-slate-950 text-white">Show results</Button>
            </div>
          </aside>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close application details" onClick={() => setSelectedApplication(null)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <aside role="dialog" aria-modal="true" aria-label={`${selectedApplication.job.title} details`} className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-slate-950 p-6 text-white">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Application details
                </p>
                <h2 className="mt-2 truncate text-2xl font-semibold">{selectedApplication.job.title}</h2>
                <p className="mt-1 text-slate-300">{selectedApplication.job.company}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedApplication.status} />
                  <span className="text-xs text-slate-400">
                    {getAppliedAgeLabel(selectedApplication)}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)} className="h-9 w-9 p-0 text-slate-300 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="scrollbar-hidden flex-1 space-y-8 overflow-y-auto p-6">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Overview</h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />Applied
                    </dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {new Date(selectedApplication.appliedAt ?? selectedApplication.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />Location
                    </dt>
                    <dd className="mt-1 truncate font-medium text-slate-800">
                      {selectedApplication.job.location ?? 'Not provided'}
                    </dd>
                  </div>
                  <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-400">Source</dt>
                    <dd className="mt-1 flex items-center gap-2 font-medium text-slate-800">
                      {selectedApplication.job.source && (
                        <JobSourceIcon source={selectedApplication.job.source as JobSource} />
                      )}
                      {selectedApplication.job.source ? JOB_SOURCE_LABELS[selectedApplication.job.source as JobSource] : 'Not provided'}
                    </dd>
                  </div>
                </dl>
                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Pipeline status
                </label>
                <Select
                  value={selectedApplication.status}
                  disabled={updatingApplicationId === selectedApplication.id}
                  onValueChange={(status) => changeStatus(selectedApplication, status as ApplicationStatus)}
                >
                  <SelectTrigger className="mt-2 h-10 w-full bg-white shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <ApplicationStatusIcon status={status} />
                        {APPLICATION_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedApplication.job.jobUrl && (
                  <a href={selectedApplication.job.jobUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-950 hover:underline">
                    Open job listing<ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </section>

              <section className="border-t border-slate-100 pt-7">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Timeline</h3>
                <ol className="mt-4 space-y-4 text-sm">
                  {getApplicationTimeline(selectedApplication).map((event) => (
                    <li key={`${event.title}-${event.date.toISOString()}`} className="relative pl-6">
                      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-950 ring-4 ring-slate-100" />
                      <p className="font-medium text-slate-800">{event.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(event.date)}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="border-t border-slate-100 pt-7">
                <InterviewPanel
                  applicationId={selectedApplication.id}
                  readOnly={selectedApplication.status !== 'INTERVIEW'}
                />
              </section>

              <section className="border-t border-slate-100 pt-7">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h3>
                <textarea
                  value={notesDraft}
                  onChange={(event) => setNotesDraft(event.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Follow-up details, recruiter name, preparation notes..."
                  className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">{notesDraft.length}/2000</span>
                  <Button
                    type="button"
                    size="sm"
                    disabled={notesMutation.isPending || notesDraft === (selectedApplication.notes ?? '')}
                    onClick={() => notesMutation.mutate()}
                    className="bg-slate-950 text-white"
                  >
                    {notesMutation.isPending ? 'Saving...' : 'Save notes'}
                  </Button>
                </div>
              </section>
            </div>
            <div className="flex justify-end border-t border-slate-200 bg-white p-4">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(true)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" />Delete application
              </Button>
            </div>
          </aside>
        </div>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the application and all of its interview stages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
