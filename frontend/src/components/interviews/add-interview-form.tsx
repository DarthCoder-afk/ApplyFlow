'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createInterview, updateInterview } from '@/lib/api/interviews';
import type { Interview } from '@/lib/types/interview';
import {
  createInterviewSchema,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_LABELS,
  type CreateInterviewFormValues,
} from '@/lib/validation/interview';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

function toLocalDateTime(value: string) {
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

type AddInterviewFormProps = {
  applicationId: string;
  interview?: Interview;
  onSuccess?: () => void;
};

export default function AddInterviewForm({
  applicationId,
  interview,
  onSuccess,
}: AddInterviewFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInterviewFormValues>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      type: interview?.type ?? 'INITIAL',
      scheduledAt: interview ? toLocalDateTime(interview.scheduledAt) : '',
      location: interview?.location ?? '',
      meetingUrl: interview?.meetingUrl ?? '',
      interviewer: interview?.interviewer ?? '',
      notes: interview?.notes ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateInterviewFormValues) => {
      const payload = {
        type: values.type,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        location: values.location || undefined,
        meetingUrl: values.meetingUrl || undefined,
        interviewer: values.interviewer || undefined,
        notes: values.notes || undefined,
      };

      return interview
        ? updateInterview(applicationId, interview.id, payload)
        : createInterview(applicationId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['interviews', applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['calendar-events'],
      });

      reset();
      setError(null);
      toast.success(interview ? 'Interview stage updated' : 'Interview stage scheduled');
      onSuccess?.();
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : 'Could not schedule interview';

      setError(message);
      toast.error(message);
    },
  });

  function onSubmit(values: CreateInterviewFormValues) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Stage type</Label>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                <SelectValue placeholder="Select stage type" />
              </SelectTrigger>

              <SelectContent position="popper">
                {INTERVIEW_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {INTERVIEW_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.type && (
          <p className="text-sm text-red-600">
            {errors.type.message}
          </p>
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <Label htmlFor="interview-scheduled-at">
          Date and time
        </Label>

        <Input
          id="interview-scheduled-at"
          type="datetime-local"
          className="block overflow-hidden"
          aria-invalid={Boolean(errors.scheduledAt)}
          {...register('scheduledAt')}
        />

        {errors.scheduledAt && (
          <p className="text-sm text-red-600">
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-interviewer">
          Interviewer (optional)
        </Label>

        <Input
          id="interview-interviewer"
          placeholder="Recruiter or interviewer name"
          {...register('interviewer')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-location">
          Location (optional)
        </Label>

        <Input
          id="interview-location"
          placeholder="Office, phone, or online"
          {...register('location')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-meeting-url">
          Meeting URL (optional)
        </Label>

        <Input
          id="interview-meeting-url"
          type="url"
          placeholder="https://meet.example.com/..."
          aria-invalid={Boolean(errors.meetingUrl)}
          {...register('meetingUrl')}
        />

        {errors.meetingUrl && (
          <p className="text-sm text-red-600">
            {errors.meetingUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-notes">
          Notes (optional)
        </Label>

        <Input
          id="interview-notes"
          placeholder="Topics to prepare, instructions, etc."
          {...register('notes')}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-slate-950 text-white hover:bg-slate-800"
        >
          {mutation.isPending
            ? 'Saving...'
            : interview
              ? 'Save changes'
              : 'Schedule stage'}
        </Button>
      </div>
    </form>
  );
}
