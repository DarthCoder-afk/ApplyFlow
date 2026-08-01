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

  it('accepts job data without a URL', () => {
    const { url: _url, ...jobWithoutUrl } = validJob;

    expect(createJobSchema.safeParse(jobWithoutUrl).success).toBe(true);
  });

  it('treats a blank job URL as missing', () => {
    expect(createJobSchema.parse({ ...validJob, url: '   ' }).url).toBeNull();
  });

  it('accepts job data without priority, deadline, or description', () => {
    const { description: _description, ...jobWithoutOptionalFields } = validJob;

    expect(createJobSchema.safeParse(jobWithoutOptionalFields).success).toBe(true);
  });

  it('treats a blank description as missing', () => {
    expect(createJobSchema.parse({ ...validJob, description: '   ' }).description).toBeNull();
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
});

describe('updateJobSchema', () => {
  it('accepts a partial update', () => {
    expect(updateJobSchema.safeParse({ title: 'Senior Frontend Developer' }).success).toBe(true);
  });

  it('rejects a blank company name when it is supplied', () => {
    expect(updateJobSchema.safeParse({ company: '   ' }).success).toBe(false);
  });

  it('accepts null to clear optional job fields', () => {
    expect(
      updateJobSchema.safeParse({ url: null, description: null, deadline: null }).success
    ).toBe(true);
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
