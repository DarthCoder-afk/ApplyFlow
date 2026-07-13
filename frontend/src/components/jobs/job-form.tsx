'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob, updateJob } from '@/lib/api/jobs';
import type { Job } from '@/lib/types/job';
import {
  createJobSchema,
  type CreateJobFormValues,
  JOB_SOURCES,
  JOB_SOURCE_LABELS,
} from '@/lib/validation/job';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

type JobFormProps = {
  job?: Job;
  onSuccess?: () => void;
};

function toFormValues(job?: Job): CreateJobFormValues {
  return {
    title: job?.title ?? '',
    company: job?.company ?? '',
    location: job?.location ?? '',
    description: job?.description ?? '',
    url: job?.jobUrl ?? '',
    source: job?.source ?? 'LINKEDIN',
    notes: job?.notes ?? '',
  };
}

export default function JobForm({ job, onSuccess }: JobFormProps) {
  const isEdit = Boolean(job);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: toFormValues(job),
  });

  const mutation = useMutation({
    mutationFn: (values: CreateJobFormValues) =>
      isEdit && job ? updateJob(job.id, values) : createJob(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setError(null);
      onSuccess?.();
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        setError(null);
        mutation.mutate(values);
      })}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Job title</Label>
          <Input id="title" placeholder="Frontend Engineer" {...register('title')} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Co" {...register('company')} />
          {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Remote" {...register('location')} />
          {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <select
            id="source"
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register('source')}
          >
            {JOB_SOURCES.map((source) => (
              <option key={source} value={source}>
                {JOB_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
          {errors.source && <p className="text-sm text-red-600">{errors.source.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Job URL</Label>
        <Input id="url" type="url" placeholder="https://..." {...register('url')} />
        {errors.url && <p className="text-sm text-red-600">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Paste the job description or a short summary"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" placeholder="Referral, salary range, etc." {...register('notes')} />
        {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        >
          {mutation.isPending ? 'Saving...' : isEdit ? 'Update job' : 'Save job'}
        </Button>
      </div>
    </form>
  );
}
