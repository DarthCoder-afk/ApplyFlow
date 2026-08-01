'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  EllipsisVertical,
  ListRestart,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { deleteApplication, updateApplication } from '@/lib/api/applications';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from '@/lib/validation/application';
import type {
  Application,
  ApplicationStatus,
} from '@/lib/types/application';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import StatusBadge from './status-badge';
import ApplicationStatusIcon from './application-status-icon';
import InterviewPanel from '../interviews/interview-panel';
import {
  getAppliedAgeLabel,
  getInterviewTimeLabel,
  getUpcomingInterview,
} from '@/lib/application-pipeline';

type ApplicationRowProps = {
  application: Application;
  onView: (application: Application) => void;
};

export default function ApplicationRow({
  application,
  onView,
}: ApplicationRowProps) {
  const queryClient = useQueryClient();
  const [notesOpen, setNotesOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [interviewsOpen, setInterviewsOpen] = useState(false);
  const [notes, setNotes] = useState(application.notes ?? '');
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus>(application.status);

  const interviewCount = application._count?.interviews ?? 0;
  const canManageInterviews = application.status === 'INTERVIEW';
  const canViewInterviewHistory =
    !canManageInterviews && interviewCount > 0;
  const upcomingInterview = getUpcomingInterview(application);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const notesMutation = useMutation({
    mutationFn: (newNotes: string) =>
      updateApplication(application.id, {
        notes: newNotes,
      }),
    onSuccess: () => {
      invalidate();
      setNotesOpen(false);
      toast.success('Notes updated');
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not update notes'
      ),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) =>
      updateApplication(application.id, { status }),
    onSuccess: () => {
      invalidate();
      setStatusOpen(false);
      toast.success('Application status updated');
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not update status'
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application.id),
    onSuccess: () => {
      setDeleteOpen(false);
      invalidate();
      toast.success('Application deleted');
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not delete application'
      ),
  });

  function openNotes() {
    setNotes(application.notes ?? '');
    setNotesOpen(true);
  }

  function openStatus() {
    setSelectedStatus(application.status);
    setStatusOpen(true);
  }

  return (
    <li className="flex items-start gap-3 px-4 py-4 sm:items-center sm:px-5">
      <button
        type="button"
        onClick={() => onView(application)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium text-slate-900">
            {application.job.title}
          </p>
          <StatusBadge status={application.status} />
        </div>

        <p className="text-sm text-slate-500">{application.job.company}</p>

        <p className="mt-1 text-xs text-slate-400">
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
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="grid h-9 w-7 shrink-0 place-items-center bg-transparent p-0 text-slate-500 transition hover:text-slate-900 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            aria-label={`Actions for ${application.job.title}`}
          >
            <EllipsisVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={openStatus}>
            <ListRestart className="h-4 w-4" />
            Change status
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={openNotes}>
            <StickyNote className="h-4 w-4" />
            {application.notes ? 'Edit notes' : 'Add notes'}
          </DropdownMenuItem>

          {(canManageInterviews || canViewInterviewHistory) && (
            <DropdownMenuItem
              onSelect={() => setInterviewsOpen(true)}
            >
              <CalendarDays className="h-4 w-4" />
              {canManageInterviews
                ? 'Interview stages'
                : `Stage history (${interviewCount})`}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {statusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close status dialog"
            onClick={() => setStatusOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`status-title-${application.id}`}
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={`status-title-${application.id}`}
                  className="text-xl font-semibold text-slate-950"
                >
                  Change status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {application.job.title} · {application.job.company}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStatusOpen(false)}
                className="h-9 w-9 shrink-0 p-0"
                aria-label="Close status dialog"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-5">
              <Select
                value={selectedStatus}
                onValueChange={(status) =>
                  setSelectedStatus(status as ApplicationStatus)
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {APPLICATION_STATUSES.map((status) => {
                    return (
                      <SelectItem key={status} value={status}>
                        <ApplicationStatusIcon status={status} />
                        {APPLICATION_STATUS_LABELS[status]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={statusMutation.isPending}
                onClick={() => setStatusOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={
                  statusMutation.isPending ||
                  selectedStatus === application.status
                }
                onClick={() => statusMutation.mutate(selectedStatus)}
                className="bg-slate-950 text-white hover:bg-slate-800"
              >
                {statusMutation.isPending ? 'Saving...' : 'Save status'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {notesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close notes dialog"
            onClick={() => setNotesOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`notes-title-${application.id}`}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={`notes-title-${application.id}`}
                  className="text-xl font-semibold text-slate-950"
                >
                  Application notes
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {application.job.title} · {application.job.company}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setNotesOpen(false)}
                className="h-9 w-9 shrink-0 p-0"
                aria-label="Close notes dialog"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Follow-up details, recruiter name, reminders..."
              className="mt-5 h-11"
              disabled={notesMutation.isPending}
              maxLength={2000}
            />

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={notesMutation.isPending}
                onClick={() => setNotesOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={notesMutation.isPending}
                onClick={() => notesMutation.mutate(notes)}
                className="bg-slate-950 text-white hover:bg-slate-800"
              >
                {notesMutation.isPending ? 'Saving...' : 'Save notes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this application?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the application for “
              {application.job.title}” and all of its interview stages.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              {deleteMutation.isPending
                ? 'Deleting...'
                : 'Delete application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {interviewsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close interview stages"
            onClick={() => setInterviewsOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`interviews-title-${application.id}`}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div className="min-w-0">
                <p
                  id={`interviews-title-${application.id}`}
                  className="truncate font-semibold text-slate-950"
                >
                  {application.job.title}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {application.job.company}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setInterviewsOpen(false)}
                className="h-9 w-9 shrink-0 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close interview stages"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto p-6">
              <InterviewPanel
                applicationId={application.id}
                readOnly={!canManageInterviews}
              />
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
