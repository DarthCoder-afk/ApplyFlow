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

type AddApplicationFormProps = {
  onSuccess?: () => void;
};

export default function AddApplicationForm({ onSuccess }: AddApplicationFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'for-application'],
    queryFn: () => getJobs({ limit: 50 }),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateApplicationFormValues>({
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
      onSuccess?.();
    },
    onError: (err: Error) => setError(err.message),
  });

  if (jobsLoading) return <p className="text-sm text-slate-600">Loading jobs...</p>;

  if (!jobsData?.jobs.length) {
    return (
      <p className="text-sm text-slate-600">
        Add a job first before creating an application.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => { setError(null); mutation.mutate(v); })} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobId">Job</Label>
        <select id="jobId" className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm" {...register('jobId')}>
          <option value="">Select a job</option>
          {jobsData.jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} · {job.company}
            </option>
          ))}
        </select>
        {errors.jobId && <p className="text-sm text-red-600">{errors.jobId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm" {...register('status')}>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" placeholder="Follow-up, recruiter name, etc." {...register('notes')} />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <Button type="submit" disabled={isSubmitting || mutation.isPending} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
        {mutation.isPending ? 'Saving...' : 'Save application'}
      </Button>
    </form>
  );
}