import { describe, expect, it } from 'vitest';
import { formatFullName, getUserInitials } from './user-profile';

describe('user profile formatters', () => {
  it('formats optional name parts without extra punctuation', () => {
    expect(
      formatFullName({
        firstName: 'Sean',
        middleName: 'Michael',
        lastName: 'Borje',
        suffix: 'Jr.',
      })
    ).toBe('Sean Michael Borje, Jr.');
    expect(
      formatFullName({
        firstName: 'Jane',
        middleName: null,
        lastName: 'Cruz',
        suffix: 'III',
      })
    ).toBe('Jane Cruz, III');
  });

  it('uses first and last name for fallback initials', () => {
    expect(getUserInitials({ firstName: 'Sean', lastName: 'Borje' })).toBe('SB');
  });
});
