'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@/lib/api/jobs';
import type { Job } from '@/lib/types/job';
import { Button } from '@/src/components/ui/button';
import { CheckCircle2, Ellipsis, Eye, Pencil, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { JOB_SOURCE_LABELS } from '@/lib/validation/job';
import JobSourceIcon from './job-source-icon';
import {
  getDeadlineState,
  getJobAgeLabel,
  isJobStale,
} from '@/lib/job-opportunity';

type JobRowProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onView: (job: Job) => void;
  onMarkApplied: (job: Job) => void;
};

export default function JobRow({ job, onEdit, onView, onMarkApplied }: JobRowProps) {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const linkedApplication = job.applications[0];
  const deadline = getDeadlineState(job.deadline);
  const showDeadline =
    !linkedApplication &&
    job.priority !== 'HIGH' &&
    Boolean(deadline && (deadline.closed || deadline.closingSoon));

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(job.id),
    onSuccess: () => {
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Job deleted');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not delete job'),
  });

  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <button type="button" onClick={() => onView(job)} className="min-w-0 flex-1 text-left">
        <p className="truncate font-medium text-slate-900">{job.title}</p>
        <p className="text-sm text-slate-500">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          {job.source && (
            <>
              <JobSourceIcon source={job.source} className="h-3.5 w-3.5" />
              <span>{JOB_SOURCE_LABELS[job.source]}</span>
              <span>·</span>
            </>
          )}
          <span>{getJobAgeLabel(job.createdAt)}</span>
          {isJobStale(job) && <span className="text-amber-700">· Verify availability</span>}
        </p>
        {job.priority === 'HIGH' || linkedApplication || showDeadline ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {job.priority === 'HIGH' ? (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                High priority
              </span>
            ) : null}
            {linkedApplication ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Linked application
              </span>
            ) : null}
            {showDeadline && deadline ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                {deadline.label}
              </span>
            ) : null}
          </div>
        ) : null}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-9 shrink-0 p-0"
            aria-label={`Actions for ${job.title}`}
          >
            <Ellipsis className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => onView(job)}
          >
            <Eye className="h-4 w-4" />
            View job
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => onEdit(job)}>
            <Pencil className="h-4 w-4" />
            Edit job
          </DropdownMenuItem>

          {!linkedApplication && (
            <DropdownMenuItem onSelect={() => onMarkApplied(job)}>
              <Send className="h-4 w-4" />
              Mark as applied
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete “{job.title}” at {job.company}. Any linked
              applications will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete job'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
