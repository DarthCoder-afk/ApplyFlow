jest.mock('./client', () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from './client';
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from './applications';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
  mockedApiFetch.mockResolvedValue({});
});

describe('getApplications', () => {
  it('requests the base path when no params are provided', async () => {
    await getApplications();

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications');
  });

  it('builds a query string from status, company, source, and pagination params', async () => {
    await getApplications({
      status: 'APPLIED',
      company: 'Acme',
      source: 'LINKEDIN',
      page: 2,
      limit: 25,
      sort: 'updatedAt',
      order: 'asc',
    });

    const [path] = mockedApiFetch.mock.calls[0];
    const query = new URLSearchParams(path.split('?')[1]);
    expect(path.startsWith('/api/applications?')).toBe(true);
    expect(query.get('status')).toBe('APPLIED');
    expect(query.get('company')).toBe('Acme');
    expect(query.get('source')).toBe('LINKEDIN');
    expect(query.get('page')).toBe('2');
    expect(query.get('limit')).toBe('25');
    expect(query.get('sort')).toBe('updatedAt');
    expect(query.get('order')).toBe('asc');
  });

  it('serializes followUpNeeded when explicitly false', async () => {
    await getApplications({ followUpNeeded: false });

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications?followUpNeeded=false');
  });

  it('omits followUpNeeded when not provided', async () => {
    await getApplications({ search: 'engineer' });

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications?search=engineer');
  });

  it('includes fromDate and toDate filters', async () => {
    await getApplications({ fromDate: '2026-07-01', toDate: '2026-07-31' });

    const [path] = mockedApiFetch.mock.calls[0];
    const query = new URLSearchParams(path.split('?')[1]);
    expect(query.get('fromDate')).toBe('2026-07-01');
    expect(query.get('toDate')).toBe('2026-07-31');
  });
});

describe('createApplication', () => {
  it('posts the payload as JSON', async () => {
    const payload = { jobId: 'job-1', status: 'APPLIED' as const };

    await createApplication(payload);

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });
});

describe('updateApplication', () => {
  it('sends a PUT request scoped to the application id', async () => {
    await updateApplication('application-1', { status: 'INTERVIEW' });

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications/application-1', {
      method: 'PUT',
      body: JSON.stringify({ status: 'INTERVIEW' }),
    });
  });
});

describe('deleteApplication', () => {
  it('sends a DELETE request scoped to the application id', async () => {
    await deleteApplication('application-1');

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/applications/application-1', {
      method: 'DELETE',
    });
  });
});