'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getJob } from '@/lib/api/jobs';
import { Button } from '@/src/components/ui/button';
import ListSkeleton from '@/src/components/ui/list-skeleton';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });

  if (isLoading) return <ListSkeleton rows={3} />;
  if (error || !data) return <p className="text-red-600">Job not found.</p>;

  const job = data.job;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      <div className="scrollbar-hidden max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:max-h-[calc(100dvh-8rem)]">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-slate-600">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
        </p>

        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-cyan-700 hover:underline"
          >
            View posting
          </a>
        )}

        {job.description && (
          <div className="mt-6">
            <h2 className="font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{job.description}</p>
          </div>
        )}

        {job.notes && (
          <div className="mt-6">
            <h2 className="font-semibold">Notes</h2>
            <p className="mt-2 text-sm text-slate-700">{job.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
