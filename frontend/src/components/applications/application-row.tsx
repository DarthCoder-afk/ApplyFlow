'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApplication, updateApplication } from '@/lib/api/applications';
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from '@/lib/validation/application';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { Button } from '@/src/components/ui/button';
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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

type ApplicationRowProps = {
  application: Application;
};

export default function ApplicationRow({ application }: ApplicationRowProps) {
  const queryClient = useQueryClient();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes ?? '');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const notesMutation = useMutation({
    mutationFn: (newNotes: string) =>
      updateApplication(application.id, { notes: newNotes || undefined }),
    onSuccess: () => {
      invalidate();
      setEditingNotes(false);
      toast.success('Notes updated');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not update notes'),
  });

  const updateMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => updateApplication(application.id, { status }),
    onSuccess: () => {
      invalidate();
      toast.success('Application status updated');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application.id),
    onSuccess: () => {
      setDeleteOpen(false);
      invalidate();
      toast.success('Application deleted');
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Could not delete application'),
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
        <p className="mt-1 text-xs text-slate-400">
          Applied {new Date(application.appliedAt ?? application.createdAt).toLocaleDateString()}
        </p>
        {editingNotes ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="h-8 max-w-xs text-sm"
              disabled={notesMutation.isPending}
            />
            <Button
              type="button"
              size="sm"
              disabled={notesMutation.isPending}
              onClick={() => notesMutation.mutate(notes)}
            >
              {notesMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={notesMutation.isPending}
              onClick={() => {
                setNotes(application.notes ?? '');
                setEditingNotes(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingNotes(true)}
            className="mt-1 text-left text-xs text-slate-500 hover:text-slate-700"
          >
            {application.notes ? application.notes : '+ Add notes'}
          </button>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
        <Select
          value={application.status}
          disabled={updateMutation.isPending}
          onValueChange={(value) => updateMutation.mutate(value as ApplicationStatus)}
        >
          <SelectTrigger
            className="h-11 w-full border-[#ced4da] bg-white sm:h-9 sm:w-[180px]"
            aria-label="Application status"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent position="popper" align="start">
            {APPLICATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end gap-1 sm:justify-start">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={deleteMutation.isPending}
                aria-label={`Delete ${application.job.title}`}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the application for “{application.job.title}”.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
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
