import { registerSchema } from './auth.schema';

describe('registerSchema', () => {
  const validRegistration = {
    firstName: 'Sean',
    middleName: '',
    lastName: 'Borje',
    suffix: '',
    email: ' SEAN@EXAMPLE.COM ',
    password: 'password123',
  };

  it('requires a first name', () => {
    expect(registerSchema.safeParse({ ...validRegistration, firstName: ' ' }).success).toBe(false);
  });

  it('requires a last name', () => {
    expect(registerSchema.safeParse({ ...validRegistration, lastName: '' }).success).toBe(false);
  });

  it('normalizes empty optional names to null and lowercases email', () => {
    const result = registerSchema.parse(validRegistration);

    expect(result.middleName).toBeNull();
    expect(result.suffix).toBeNull();
    expect(result.email).toBe('sean@example.com');
  });

  it('accepts optional middle name and suffix', () => {
    const result = registerSchema.parse({
      ...validRegistration,
      middleName: 'Michael',
      suffix: 'Jr.',
    });

    expect(result.middleName).toBe('Michael');
    expect(result.suffix).toBe('Jr.');
  });

  it('rejects a suffix longer than 20 characters', () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, suffix: 'x'.repeat(21) }).success
    ).toBe(false);
  });
});
