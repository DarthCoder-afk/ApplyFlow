'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJobs } from '@/lib/api/jobs';
import { createApplication } from '@/lib/api/applications';
import {
  createApplicationSchema,
  type CreateApplicationFormValues,
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from '@/lib/validation/application';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { toast } from 'sonner';

type AddApplicationFormProps = {
  onSuccess?: () => void;
};

export default function AddApplicationForm({ onSuccess }: AddApplicationFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'for-application'],
    queryFn: () => getJobs({ limit: 50, availableOnly:true }),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: { jobId: '', status: 'APPLIED', notes: '' },
  });

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      reset();
      setError(null);
      toast.success('Application added');
      onSuccess?.();
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  if (jobsLoading) return <p className="text-sm text-slate-600">Loading jobs...</p>;

  if (!jobsData?.jobs.length) {
    return (
      <p className="text-sm text-slate-600">Add a job first before creating an application.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((v) => {
        setError(null);
        mutation.mutate(v);
      })}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Controller
          name="jobId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full border-[#ced4da] bg-white sm:h-9">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                {jobsData.jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} · {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.jobId && <p className="text-sm text-red-600">{errors.jobId.message}</p>}
      </div>

      <div className="space-y-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full border-[#ced4da] bg-white sm:h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                {APPLICATION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" placeholder="Follow-up, recruiter name, etc." {...register('notes')} />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="bg-[#212529] text-white hover:bg-[#343a40]"
        >
          {mutation.isPending ? 'Saving...' : 'Save application'}
        </Button>
      </div>
    </form>
  );
}
