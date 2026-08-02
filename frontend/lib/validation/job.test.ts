import { createJobSchema, JOB_PRIORITIES, JOB_PRIORITY_LABELS, JOB_SOURCES } from './job';

const validJob = {
  title: 'Frontend Developer',
  company: 'Example Inc.',
  location: 'Manila, Philippines',
  description: 'Build accessible web interfaces for our product.',
  url: 'https://example.com/jobs/frontend-developer',
  source: 'LINKEDIN',
  priority: 'MEDIUM',
};

describe('createJobSchema', () => {
  it('accepts valid job data', () => {
    expect(createJobSchema.safeParse(validJob).success).toBe(true);
  });

  it('requires a priority', () => {
    const { priority, ...withoutPriority } = validJob;
    const result = createJobSchema.safeParse(withoutPriority);

    expect(result.success).toBe(false);
  });

  it('rejects an invalid priority value', () => {
    const result = createJobSchema.safeParse({ ...validJob, priority: 'URGENT' });

    expect(result.success).toBe(false);
  });

  it('accepts each documented priority value', () => {
    for (const priority of JOB_PRIORITIES) {
      expect(createJobSchema.safeParse({ ...validJob, priority }).success).toBe(true);
    }
  });

  it('treats deadline as optional', () => {
    const result = createJobSchema.safeParse(validJob);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deadline).toBeUndefined();
    }
  });

  it('accepts a deadline string', () => {
    expect(createJobSchema.safeParse({ ...validJob, deadline: '2026-08-01' }).success).toBe(true);
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

  it('rejects an invalid job URL', () => {
    const result = createJobSchema.safeParse({ ...validJob, url: 'not-a-url' });

    expect(result.success).toBe(false);
  });

  it('rejects an unknown source', () => {
    expect(createJobSchema.safeParse({ ...validJob, source: 'FACEBOOK' }).success).toBe(false);
  });

  it('rejects a description longer than 10,000 characters', () => {
    const result = createJobSchema.safeParse({ ...validJob, description: 'a'.repeat(10_001) });

    expect(result.success).toBe(false);
  });

  it('rejects notes longer than 1000 characters', () => {
    const result = createJobSchema.safeParse({ ...validJob, notes: 'a'.repeat(1001) });

    expect(result.success).toBe(false);
  });
});

describe('JOB_PRIORITY_LABELS', () => {
  it('has a label for every documented priority', () => {
    for (const priority of JOB_PRIORITIES) {
      expect(JOB_PRIORITY_LABELS[priority]).toBeTruthy();
    }
  });
});

describe('JOB_SOURCES', () => {
  it('includes every source accepted by the schema', () => {
    for (const source of JOB_SOURCES) {
      expect(createJobSchema.safeParse({ ...validJob, source }).success).toBe(true);
    }
  });
});