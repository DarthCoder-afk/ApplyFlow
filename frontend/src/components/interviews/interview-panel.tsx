'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import {
  deleteInterview,
  getInterviews,
  updateInterview,
} from '@/lib/api/interviews';
import type {
  Interview,
  InterviewStatus,
  InterviewType,
} from '@/lib/types/interview';
import { Button } from '@/src/components/ui/button';
import AddInterviewForm from './add-interview-form';
import { toast } from 'sonner';
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
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';

const TYPE_LABELS: Record<InterviewType, string> = {
  INITIAL: 'Initial interview',
  HR: 'HR interview',
  TECHNICAL: 'Technical interview',
  FINAL: 'Final interview',
  OTHER: 'Other interview',
};

const STATUS_LABELS: Record<InterviewStatus, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled',
};

const STATUS_STYLES: Record<InterviewStatus, string> = {
  SCHEDULED: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
  RESCHEDULED: 'bg-amber-50 text-amber-700',
};

type InterviewPanelProps = {
  applicationId: string;
  readOnly?: boolean;
};

export default function InterviewPanel({
  applicationId,
  readOnly = false,
}: InterviewPanelProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState<Interview | null>(null);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['interviews', applicationId],
    queryFn: () => getInterviews(applicationId),
  });

  const refreshStages = () => {
    queryClient.invalidateQueries({ queryKey: ['interviews', applicationId] });
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
  };

  const statusMutation = useMutation({
    mutationFn: ({
      interviewId,
      status,
    }: {
      interviewId: string;
      status: InterviewStatus;
    }) => updateInterview(applicationId, interviewId, { status }),
    onSuccess: () => {
      refreshStages();
      toast.success('Interview stage status updated');
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Could not update interview stage'
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (interviewId: string) =>
      deleteInterview(applicationId, interviewId),
    onSuccess: () => {
      refreshStages();
      toast.success('Interview stage deleted');
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Could not delete interview stage'
      ),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {readOnly ? 'Interview stage history' : 'Interview stages'}
          </h2>
          <p className="text-sm text-slate-500">
            {readOnly
              ? 'Review the interview stages for this application.'
              : 'Manage the stages in this interview pipeline.'}
          </p>
        </div>

        {!readOnly && showForm ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            aria-label="Close add interview form"
            className="h-9 w-9 shrink-0 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : !readOnly ? (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditingStage(null);
              setShowForm(true);
            }}
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add stage
          </Button>
        ) : null}
      </div>

      {!readOnly && showForm && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <AddInterviewForm
            applicationId={applicationId}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {!readOnly && editingStage && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-medium text-slate-900">Edit interview stage</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingStage(null)}
              aria-label="Close edit stage form"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AddInterviewForm
            applicationId={applicationId}
            interview={editingStage}
            onSuccess={() => setEditingStage(null)}
          />
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-slate-500">
          Loading interviews...
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not load interviews.
        </p>
      )}

      {data && data.interviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />

          <p className="mt-3 font-medium text-slate-900">
            No interview stages scheduled
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {readOnly
              ? 'No interview stages have been recorded for this application.'
              : 'Add the first stage for this application.'}
          </p>
        </div>
      )}

      {data && data.interviews.length > 0 && (
        <ul className="space-y-3">
          {data.interviews.map((interview) => (
            <li
              key={interview.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-slate-950">
                    {TYPE_LABELS[interview.type]}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(interview.scheduledAt))}
                  </p>
                </div>

                {readOnly ? (
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLES[interview.status]
                    }`}
                  >
                    {STATUS_LABELS[interview.status]}
                  </span>
                ) : (
                  <Select
                    value={interview.status}
                    disabled={statusMutation.isPending}
                    onValueChange={(status) =>
                      statusMutation.mutate({
                        interviewId: interview.id,
                        status: status as InterviewStatus,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {(Object.keys(STATUS_LABELS) as InterviewStatus[]).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="mt-3 space-y-2 text-sm text-slate-500">
                {interview.interviewer && (
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    {interview.interviewer}
                  </p>
                )}

                {interview.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {interview.location}
                  </p>
                )}

                {interview.meetingUrl && (
                  <a
                    href={interview.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open meeting link
                  </a>
                )}

                {interview.notes && (
                  <p className="rounded-lg bg-slate-50 p-3 text-slate-600">
                    {interview.notes}
                  </p>
                )}
              </div>

              {!readOnly && (
                <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowForm(false);
                      setEditingStage(interview);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this interview stage?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the{' '}
                          {TYPE_LABELS[interview.type].toLowerCase()}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(interview.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete stage'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
