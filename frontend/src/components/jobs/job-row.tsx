'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@/lib/api/jobs';
import type { Job } from '@/lib/types/job';
import { Button } from '@/src/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Job deleted');
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not delete job'),
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

      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        {job.source && (
          <span className="inline-flex rounded-full bg-[#f8f9fa] px-2.5 py-1 text-xs font-medium text-[#212529]">
            {job.source.replace('_', ' ')}
          </span>
        )}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit(job)}
            aria-label={`Edit ${job.title}`}
            className="border-[#dee2e6] text-[#495057] hover:bg-[#f8f9fa]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            aria-label={`Delete ${job.title}`}
            className="border-[#dee2e6] text-red-600 hover:bg-red-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
