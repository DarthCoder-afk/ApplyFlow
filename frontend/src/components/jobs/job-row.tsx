'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@/lib/api/jobs';
import type { Job } from '@/lib/types/job';
import { Button } from '@/src/components/ui/button';

type JobRowProps = {
  job: Job;
  onEdit: (job: Job) => void;
};

export default function JobRow({ job, onEdit }: JobRowProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  function handleDelete() {
    const message = 'Delete this job? Any linked application will also be removed.';
    if (!confirm(message)) return;
    deleteMutation.mutate();
  }

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{job.title}</p>
        <p className="text-sm text-slate-500">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        {job.source && (
          <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
            {job.source.replace('_', ' ')}
          </span>
        )}

        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(job)}>
          Edit
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </li>
  );
}
