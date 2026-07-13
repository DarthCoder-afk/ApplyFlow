'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApplication, updateApplication } from '@/lib/api/applications';
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from '@/lib/validation/application';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { Button } from '@/src/components/ui/button';
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';

type ApplicationRowProps = {
  application: Application;
};

export default function ApplicationRow({ application }: ApplicationRowProps) {
  const queryClient = useQueryClient();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes ?? '');

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
    },
  });

  const updateMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => updateApplication(application.id, { status }),
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

      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <select
          value={application.status}
          disabled={updateMutation.isPending}
          onChange={(e) => updateMutation.mutate(e.target.value as ApplicationStatus)}
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
