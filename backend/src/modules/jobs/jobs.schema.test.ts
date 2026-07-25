import {
  createJobSchema,
  jobIdParamSchema,
  listJobsQuerySchema,
  updateJobSchema,
} from './jobs.schema';

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

  it('removes unsafe HTML from stored text fields', () => {
    const result = createJobSchema.parse({
      ...validJob,
      title: '<img src=x onerror=alert(1)>Frontend Developer',
      description: 'Safe text<script>alert(1)</script>',
    });

    expect(result.title).toBe('Frontend Developer');
    expect(result.description).toBe('Safe text');
  });

  it('rejects non-HTTP job URLs', () => {
    expect(createJobSchema.safeParse({ ...validJob, url: 'javascript:alert(1)' }).success).toBe(
      false
    );
  });

  it('accepts a priority, deadline date, and allowDuplicate flag', () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      priority: 'HIGH',
      deadline: '2026-08-01',
      allowDuplicate: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        priority: 'HIGH',
        deadline: '2026-08-01',
        allowDuplicate: true,
      });
    }
  });

  it('accepts a null deadline', () => {
    expect(createJobSchema.safeParse({ ...validJob, deadline: null }).success).toBe(true);
  });

  it('accepts a full ISO datetime deadline', () => {
    expect(
      createJobSchema.safeParse({ ...validJob, deadline: '2026-08-01T00:00:00.000Z' }).success
    ).toBe(true);
  });

  it('rejects an invalid deadline format', () => {
    expect(createJobSchema.safeParse({ ...validJob, deadline: 'next week' }).success).toBe(false);
  });

  it('rejects an invalid priority value', () => {
    expect(createJobSchema.safeParse({ ...validJob, priority: 'URGENT' }).success).toBe(false);
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

  it('accepts a high-priority filter', () => {
    expect(
      listJobsQuerySchema.parse({
        priority: 'HIGH',
      })
    ).toMatchObject({
      priority: 'HIGH',
    });
  });

  it('coerces hasApplication and closingSoon string flags to booleans', () => {
    expect(
      listJobsQuerySchema.parse({ hasApplication: 'true', closingSoon: 'false' })
    ).toMatchObject({
      hasApplication: true,
      closingSoon: false,
    });
  });

  it('accepts deadline and priority as sortable fields', () => {
    expect(listJobsQuerySchema.safeParse({ sort: 'deadline' }).success).toBe(true);
    expect(listJobsQuerySchema.safeParse({ sort: 'priority' }).success).toBe(true);
  });

  it('rejects a non-boolean-like hasApplication value', () => {
    expect(listJobsQuerySchema.safeParse({ hasApplication: 'yes' }).success).toBe(false);
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
