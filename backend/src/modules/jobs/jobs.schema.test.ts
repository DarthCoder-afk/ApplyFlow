import { createJobSchema, jobIdParamSchema, listJobsQuerySchema, updateJobSchema } from './jobs.schema';

describe('createJobSchema', () => {
  const validJob = {
    title: 'Frontend Developer',
    company: 'Example Inc.',
    location: 'Manila, Philippines',
    description: 'Build accessible web interfaces for our product.',
    url: 'https://example.com/jobs/frontend-developer',
    source: 'LINKEDIN',
  };

  it('accepts valid job data', () => {
    expect(createJobSchema.safeParse(validJob).success).toBe(true);
  });

  it('rejects a missing title', () => {
    const result = createJobSchema.safeParse({ ...validJob, title: '   ' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ['title'],
        message: 'Title is required',
      });
    }
  });

  it('rejects a blank title', () => {
    const job = {
      title: ' ',
      company: 'Example Inc.',
      location: 'Manila, Philippines',
      description: 'Build accessible web interfaces for our product.',
      url: 'https://example.com/jobs/frontend-developer',
      source: 'LINKEDIN',
    };

    const result = createJobSchema.safeParse(job);

    expect(result.success).toBe(false);
  });

  it('rejects an invalid job URL', () => {
    const result = createJobSchema.safeParse({ ...validJob, url: 'not-a-url' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'url')).toBe(true);
    }
  });
});

describe('listJobsQuerySchema', () => {
  it('uses defaults and converts numeric query strings', () => {
    expect(listJobsQuerySchema.parse({ page: '2', limit: '25' })).toMatchObject({
      page: 2,
      limit: 25,
      sort: 'createdAt',
      order: 'desc',
    });
  });

  it('rejects a limit greater than 50', () => {
    expect(listJobsQuerySchema.safeParse({ limit: '51' }).success).toBe(false);
  });
});

describe('updateJobSchema', () => {
  it('accepts a partial update', () => {
    expect(updateJobSchema.safeParse({ title: 'Senior Frontend Developer' }).success).toBe(true);
  });

  it('rejects a blank company name when it is supplied', () => {
    expect(updateJobSchema.safeParse({ company: '   ' }).success).toBe(false);
  });
});

describe('jobIdParamSchema', () => {
  it('accepts a non-empty job ID', () => {
    expect(jobIdParamSchema.safeParse({ id: 'job-123' }).success).toBe(true);
  });

  it('rejects an empty job ID', () => {
    expect(jobIdParamSchema.safeParse({ id: '' }).success).toBe(false);
  });
});
