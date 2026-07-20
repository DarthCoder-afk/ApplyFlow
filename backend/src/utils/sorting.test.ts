import { parseSortParams } from './sorting';

const allowedFields = ['title', 'createdAt', 'company'] as const;

describe('parseSortParams', () => {
  it('uses a permitted field and explicit ascending order', () => {
    expect(parseSortParams('title', 'asc', allowedFields, 'createdAt')).toEqual({
      field: 'title',
      order: 'asc',
    });
  });

  it('uses the default field when the requested field is not permitted', () => {
    expect(parseSortParams('salary', 'asc', allowedFields, 'createdAt')).toEqual({
      field: 'createdAt',
      order: 'asc',
    });
  });

  it.each([undefined, 'ascending', 123])('defaults to descending order for %p', (order) => {
    expect(parseSortParams('company', order, allowedFields, 'createdAt')).toEqual({
      field: 'company',
      order: 'desc',
    });
  });

  it('defaults both values when query parameters are missing', () => {
    expect(parseSortParams(undefined, undefined, allowedFields, 'createdAt')).toEqual({
      field: 'createdAt',
      order: 'desc',
    });
  });
});
