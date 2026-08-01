import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserProfile } from '@/lib/types/user';
import AvatarManager from './avatar-manager';

const profile: UserProfile = {
  id: 'user-1',
  email: 'sean@example.com',
  firstName: 'Sean',
  middleName: null,
  lastName: 'Borje',
  suffix: null,
  fullName: 'Sean Borje',
  headline: 'Engineer',
  phone: null,
  location: 'Manila',
  avatarUrl: 'https://res.cloudinary.com/demo/image/upload/avatar.webp',
  linkedinUrl: null,
  githubUrl: null,
  portfolioUrl: null,
};

function Harness({
  onUpload = vi.fn().mockResolvedValue(undefined),
}: {
  onUpload?: (file: File) => Promise<void>;
}) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [error, setError] = useState<string | null>(null);

  return (
    <AvatarManager
      profile={currentProfile}
      uploading={false}
      removing={false}
      error={error}
      onError={setError}
      onUpload={onUpload}
      onRemove={async () => {
        setCurrentProfile((current) => ({ ...current, avatarUrl: null }));
      }}
    />
  );
}

describe('AvatarManager', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:avatar-preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('rejects oversized and unsupported files before upload', () => {
    const { container } = render(<Harness />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })],
      },
    });
    expect(screen.getByRole('alert')).toHaveTextContent('5 MB or smaller');

    fireEvent.change(input, {
      target: {
        files: [new File(['<svg/>'], 'avatar.svg', { type: 'image/svg+xml' })],
      },
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Only JPEG, PNG, and WebP');
  });

  it('renders a local preview and uploads a supported file', async () => {
    const onUpload = vi.fn().mockImplementation(() => new Promise(() => undefined));
    const { container } = render(<Harness onUpload={onUpload} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
    await waitFor(() => {
      expect(screen.getByAltText('Sean Borje profile photo')).toHaveAttribute(
        'src',
        'blob:avatar-preview'
      );
    });
  });

  it('disables photo actions while an upload is active and displays rate-limit errors', () => {
    render(
      <AvatarManager
        profile={profile}
        uploading
        removing={false}
        error="You are uploading too frequently. Please wait before trying again."
        onError={vi.fn()}
        onUpload={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('Uploading photo…');
    expect(screen.queryByRole('button', { name: 'Change photo' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove photo' })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('uploading too frequently');
  });

  it('updates the avatar UI after removal', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByAltText('Sean Borje profile photo')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove photo' }));

    await waitFor(() => {
      expect(screen.queryByAltText('Sean Borje profile photo')).not.toBeInTheDocument();
      expect(screen.getByText('SB')).toBeInTheDocument();
    });
  });
});
