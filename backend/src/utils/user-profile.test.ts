import { formatFullName, getUserInitials } from './user-profile';

describe('user profile formatters', () => {
  it('formats all name parts without extra punctuation', () => {
    expect(
      formatFullName({
        firstName: 'Sean',
        middleName: 'Michael',
        lastName: 'Borje',
        suffix: 'Jr.',
      })
    ).toBe('Sean Michael Borje, Jr.');
  });

  it('omits missing optional parts', () => {
    expect(
      formatFullName({
        firstName: 'Jane',
        middleName: null,
        lastName: 'Cruz',
        suffix: 'III',
      })
    ).toBe('Jane Cruz, III');
  });

  it('uses first and last name for initials', () => {
    expect(getUserInitials({ firstName: 'Sean', lastName: 'Borje' })).toBe('SB');
  });
});
