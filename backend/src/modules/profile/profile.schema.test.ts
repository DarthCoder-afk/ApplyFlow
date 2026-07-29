import { updateProfileSchema } from './profile.schema';

describe('updateProfileSchema', () => {
  it('accepts allowed profile fields and normalizes empty optional values', () => {
    const result = updateProfileSchema.parse({
      firstName: ' Sean ',
      headline: ' ',
      phone: null,
    });

    expect(result).toEqual({
      firstName: 'Sean',
      headline: null,
      phone: null,
    });
  });

  it('rejects protected fields and email updates', () => {
    expect(updateProfileSchema.safeParse({ email: 'new@example.com' }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ avatarPublicId: 'other-user/avatar' }).success).toBe(
      false
    );
  });

  it('rejects invalid and non-HTTPS professional URLs', () => {
    expect(updateProfileSchema.safeParse({ linkedinUrl: 'not-a-url' }).success).toBe(false);
    expect(updateProfileSchema.safeParse({ githubUrl: 'http://github.com/sean' }).success).toBe(
      false
    );
  });

  it('accepts valid HTTPS professional URLs', () => {
    expect(
      updateProfileSchema.safeParse({
        linkedinUrl: 'https://linkedin.com/in/sean',
        githubUrl: 'https://github.com/sean',
        portfolioUrl: 'https://example.com',
      }).success
    ).toBe(true);
  });
});
