import { describe, expect, it } from 'vitest';
import {
  formatFullName,
  getUserInitials,
  normalizeUserProfile,
} from './user-profile';

describe('user profile formatters', () => {
  it('formats optional name parts without extra punctuation', () => {
    expect(
      formatFullName({
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Gonzales',
        suffix: 'Jr.',
      })
    ).toBe('John Doe Gonzales, Jr.');
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
    expect(getUserInitials({ firstName: 'John', lastName: 'Doe' })).toBe('JD');
  });

  it('does not crash when new name fields are absent', () => {
    expect(getUserInitials({ firstName: undefined, lastName: undefined })).toBe('U');
    expect(
      getUserInitials({
        firstName: undefined,
        lastName: undefined,
        fullName: 'John Doe Gonzales',
      })
    ).toBe('JG');
  });

  it('normalizes the legacy production user response shape', () => {
    expect(
      normalizeUserProfile({
        id: 'user-1',
        email: 'johndoe@example.com',
        name: 'John Doe Gonzales',
      })
    ).toEqual(
      expect.objectContaining({
        firstName: 'John',
        middleName: 'Doe Cruz',
        lastName: 'Gonzales',
        fullName: 'John Doe Cruz Gonzales',
      })
    );
  });
});
