jest.mock('./client', () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from './client';
import { createJob, deleteJob, getJob, getJobs, updateJob } from './jobs';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
  mockedApiFetch.mockResolvedValue({});
});

describe('getJobs', () => {
  it('requests the base path when no params are provided', async () => {
    await getJobs();

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs');
  });

  it('builds a query string including priority, location, and sort', async () => {
    await getJobs({
      location: 'Manila',
      priority: 'HIGH',
      sort: 'deadline',
      order: 'asc',
    });

    const [path] = mockedApiFetch.mock.calls[0];
    const query = new URLSearchParams(path.split('?')[1]);
    expect(query.get('location')).toBe('Manila');
    expect(query.get('priority')).toBe('HIGH');
    expect(query.get('sort')).toBe('deadline');
    expect(query.get('order')).toBe('asc');
  });

  it('serializes hasApplication and closingSoon when explicitly false', async () => {
    await getJobs({ hasApplication: false, closingSoon: false });

    const [path] = mockedApiFetch.mock.calls[0];
    const query = new URLSearchParams(path.split('?')[1]);
    expect(query.get('hasApplication')).toBe('false');
    expect(query.get('closingSoon')).toBe('false');
  });

  it('omits hasApplication and closingSoon when not provided', async () => {
    await getJobs({ search: 'developer' });

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?search=developer');
  });

  it('only sets availableOnly when truthy', async () => {
    await getJobs({ availableOnly: false });
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs');

    mockedApiFetch.mockClear();

    await getJobs({ availableOnly: true });
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?availableOnly=true');
  });
});

describe('createJob', () => {
  it('posts the payload as JSON including priority and deadline', async () => {
    const payload = {
      title: 'Frontend Developer',
      company: 'Acme',
      location: 'Manila',
      description: 'Build things',
      url: 'https://example.com/job',
      source: 'LINKEDIN',
      priority: 'HIGH' as const,
      deadline: '2026-08-01',
    };

    await createJob(payload);

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });
});

describe('updateJob', () => {
  it('sends a PATCH request scoped to the job id', async () => {
    await updateJob('job-1', { priority: 'LOW', allowDuplicate: true });

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', {
      method: 'PATCH',
      body: JSON.stringify({ priority: 'LOW', allowDuplicate: true }),
    });
  });
});

describe('deleteJob', () => {
  it('sends a DELETE request scoped to the job id', async () => {
    await deleteJob('job-1');

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', {
      method: 'DELETE',
    });
  });
});

describe('getJob', () => {
  it('requests a single job by id', async () => {
    await getJob('job-1');

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1');
  });
});