'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/lib/api/applications';
import AddApplicationForm from '@/src/components/applications/add-application-form';
import ApplicationRow from '@/src/components/applications/application-row';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import type { ApplicationStatus } from '@/lib/types/application';
import { Input } from '@/src/components/ui/input';
import { ChevronLeft, ChevronRight, ClipboardList, Plus, Search } from 'lucide-react';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import { keepPreviousData } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

export default function ApplicationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', statusFilter, search, page],
    queryFn: () =>
      getApplications({
        page,
        limit: 20,
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(status: ApplicationStatus | 'ALL') {
    setStatusFilter(status);
    setPage(1);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 px-6 py-7 text-white shadow-lg sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <ClipboardList className="h-3.5 w-3.5 text-violet-200" />
                Application tracker
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Applications
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                {data
                  ? `${data.pagination.total} applications in your pipeline.`
                  : 'Track your job applications and their statuses.'}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="bg-white text-slate-900 shadow-sm hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Add application
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Select
            value={statusFilter}
            onValueChange={(value) => handleStatusChange(value as ApplicationStatus | 'ALL')}
          >
            <SelectTrigger
              className="h-12 w-full rounded-xl border-slate-200 bg-white px-3 shadow-sm sm:w-44"
              aria-label="Filter applications by status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-[28rem]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white pl-11 shadow-sm placeholder:text-slate-400 focus-visible:ring-slate-400"
            />
          </div>
        </div>

        {isLoading && !data && <ListSkeleton rows={5} />}
        {error && <p className="text-red-600">Could not load applications.</p>}

        {data && data.applications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <p className="font-medium text-[#212529]">
              {search || statusFilter !== 'ALL'
                ? 'No applications match your filters'
                : 'No applications tracked yet'}
            </p>

            <p className="mt-1 text-sm text-[#6c757d]">
              {search || statusFilter !== 'ALL'
                ? 'Try clearing search or changing the status filter.'
                : 'Add your first application to get started.'}
            </p>
          </div>
        )}

        {data && data.applications.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.applications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </ul>
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">{data.pagination.total}</span>{' '}
              applications · Page {data.pagination.page} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        /* same modal pattern as jobs */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowForm(false)}
            className="absolute inset-0 bg-[#212529]/30 backdrop-blur-sm"
          />
          <Card className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border-[#dee2e6] bg-white shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <CardTitle>New application</CardTitle>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-2 py-1 text-sm text-[#6c757d] hover:bg-[#f8f9fa]"
              >
                ✕
              </button>
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
