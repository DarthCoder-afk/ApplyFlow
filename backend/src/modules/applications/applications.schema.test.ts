import {
  applicationIdParamSchema,
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
} from './applications.schema';

describe('createApplicationSchema', () => {
  it('accepts valid application data', () => {
    expect(
      createApplicationSchema.safeParse({
        jobId: 'job-123',
        status: 'APPLIED',
        appliedAt: '2026-07-20T08:30:00.000Z',
        notes: 'Submitted my portfolio.',
      }).success
    ).toBe(true);
  });

  it('rejects a missing job ID', () => {
    expect(createApplicationSchema.safeParse({ jobId: '' }).success).toBe(false);
  });

  it('rejects an invalid status', () => {
    expect(createApplicationSchema.safeParse({ jobId: 'job-123', status: 'PENDING' }).success).toBe(
      false
    );
  });

  it('rejects an invalid applied date', () => {
    expect(
      createApplicationSchema.safeParse({ jobId: 'job-123', appliedAt: 'tomorrow' }).success
    ).toBe(false);
  });
});

describe('updateApplicationSchema', () => {
  it('accepts an update containing only a status', () => {
    expect(updateApplicationSchema.safeParse({ status: 'INTERVIEW' }).success).toBe(true);
  });

  it('rejects notes longer than 2,000 characters', () => {
    expect(updateApplicationSchema.safeParse({ notes: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('removes unsafe HTML from notes', () => {
    const result = updateApplicationSchema.parse({ notes: '<svg onload=alert(1)>Follow up' });

    expect(result.notes).toBe('Follow up');
  });
});

describe('applicationIdParamSchema', () => {
  it('rejects an empty application ID', () => {
    expect(applicationIdParamSchema.safeParse({ id: '' }).success).toBe(false);
  });
});

describe('listApplicationsQuerySchema', () => {
  it('converts pagination query strings and uses sorting defaults', () => {
    expect(listApplicationsQuerySchema.parse({ page: '2', limit: '25' })).toMatchObject({
      page: 2,
      limit: 25,
      sort: 'createdAt',
      order: 'desc',
    });
  });
});
