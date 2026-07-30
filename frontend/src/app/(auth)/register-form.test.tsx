import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterForm from './register-form';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/lib/api/auth', () => ({
  register: vi.fn(),
  setAccessToken: vi.fn(),
}));

describe('RegisterForm', () => {
  beforeEach(() => push.mockReset());

  it('renders separate required and optional name fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText('First name')).toBeRequired();
    expect(screen.getByLabelText(/Middle name/)).not.toBeRequired();
    expect(screen.getByLabelText('Last name')).toBeRequired();
    expect(screen.getByLabelText(/Suffix/)).not.toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });
});
