'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApplication, updateApplication } from '@/lib/api/applications';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from '@/lib/validation/application';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { Button } from '@/src/components/ui/button';

type ApplicationRowProps = {
  application: Application;
};

export default function ApplicationRow({ application }: ApplicationRowProps) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const updateMutation = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      updateApplication(application.id, { status }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application.id),
    onSuccess: invalidate,
  });

  function handleDelete() {
    if (!confirm(`Remove application for ${application.job.title}?`)) return;
    deleteMutation.mutate();
  }

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{application.job.title}</p>
        <p className="text-sm text-slate-500">{application.job.company}</p>
        {application.notes && (
          <p className="mt-1 text-xs text-slate-500">{application.notes}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <select
          value={application.status}
          disabled={updateMutation.isPending}
          onChange={(e) =>
            updateMutation.mutate(e.target.value as ApplicationStatus)
          }
          className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {APPLICATION_STATUS_LABELS[status]}
            </option>
          ))}
        </select>


        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50"
        >
          {deleteMutation.isPending ? 'Removing...' : 'Delete'}
        </Button>
      </div>
    </li>
  );
}