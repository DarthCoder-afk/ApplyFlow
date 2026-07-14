'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/lib/api/applications';
import AddApplicationForm from '@/src/components/applications/add-application-form';
import ApplicationRow from '@/src/components/applications/application-row';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import type { ApplicationStatus } from '@/lib/types/application';
import { cn } from '@/lib/utils';
import { Input } from '@/src/components/ui/input';
import { Search, Plus } from 'lucide-react';
import ListSkeleton from '@/src/components/ui/list-skeleton';
import { keepPreviousData } from '@tanstack/react-query';

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="mt-1 text-[#6c757d]">Track your job applications and their statuses.</p>
          </div>

          <Button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="bg-[#212529] text-white hover:bg-[#343a40]"
          >
            <Plus className="h-4 w-4" />
            Add application
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c757d]" />
          <Input
            type="search"
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-white pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['ALL', 'APPLIED', 'INTERVIEW', 'OFFER'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition',
                statusFilter === s
                  ? 'bg-[#f8f9fa] text-[#212529]'
                  : 'bg-white text-[#6c757d] border border-[#dee2e6] hover:bg-[#f8f9fa]'
              )}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>

        {isLoading && !data && <ListSkeleton rows={5} />}
        {error && <p className="text-red-600">Could not load applications.</p>}

        {data && data.applications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dee2e6] bg-white p-10 text-center">
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
          <div className="overflow-hidden rounded-2xl border border-[#dee2e6] bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {data.applications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </ul>
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
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
