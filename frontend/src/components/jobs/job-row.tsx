'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@/lib/api/jobs';
import type { Job } from '@/lib/types/job';
import { Button } from '@/src/components/ui/button';
import { Pencil, Trash2, EyeIcon } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import Link from 'next/link';

type JobRowProps = {
  job: Job;
  onEdit: (job: Job) => void;
};

export default function JobRow({ job, onEdit }: JobRowProps) {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <Link href={`/jobs/${job.id}`} className="font-medium text-slate-900">
          {job.title}
        </Link>
        <p className="text-sm text-slate-500">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {new Date(job.createdAt).toLocaleDateString()}
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
            className="border-[#dee2e6] text-[#495057] hover:bg-[#f8f9fa]"
          >
            <Link href={`/jobs/${job.id}`}>
              <EyeIcon className="h-4 2-4" />
            </Link>
          </Button>
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
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={deleteMutation.isPending}
                aria-label={`Delete ${job.title}`}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

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
        </div>
      </div>
    </li>
  );
}
