import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { UserProfile } from '@/lib/types/user';
import { updateProfile } from '@/lib/api/profile';
import ProfileForm from './profile-form';

vi.mock('@/lib/api/profile', () => ({
  updateProfile: vi.fn(),
}));

const profile: UserProfile = {
  id: 'user-1',
  email: 'sean@example.com',
  firstName: 'Sean',
  middleName: 'Michael',
  lastName: 'Borje',
  suffix: 'Jr.',
  fullName: 'Sean Michael Borje, Jr.',
  headline: 'Engineer',
  phone: null,
  location: 'Manila, Philippines',
  avatarUrl: null,
  linkedinUrl: null,
  githubUrl: null,
  portfolioUrl: null,
};

describe('ProfileForm', () => {
  it('renders real profile data and enables save only after a change', async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    vi.mocked(updateProfile).mockResolvedValue({
      ...profile,
      headline: 'Senior Engineer',
    });
    render(<ProfileForm profile={profile} onUpdated={onUpdated} />);

    expect(screen.getByDisplayValue('Sean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sean@example.com')).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled();

    const headline = screen.getByLabelText(/Professional headline/);
    await user.clear(headline);
    await user.type(headline, 'Senior Engineer');
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ headline: 'Senior Engineer' })
      );
      expect(onUpdated).toHaveBeenCalled();
    });
  });
});
