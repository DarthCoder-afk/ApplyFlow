import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCalendarEvents } from '@/lib/api/calendar';
import CalendarPage from './page';

vi.mock('@/lib/api/calendar', () => ({
  getCalendarEvents: vi.fn(),
}));

function renderCalendar() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CalendarPage />
    </QueryClientProvider>
  );
}

async function openEmptyDay() {
  const user = userEvent.setup();
  const dayButtons = await screen.findAllByRole('button', {
    name: /^View 0 events on/,
  });
  await user.click(dayButtons[0]);
}

describe('Calendar mobile day sheet', () => {
  beforeEach(() => {
    vi.mocked(getCalendarEvents).mockResolvedValue({
      count: 0,
      events: [],
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      configurable: true,
      value: vi.fn(() => true),
    });
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('uses a full-distance transition and hides the close button on mobile', async () => {
    renderCalendar();
    await openEmptyDay();

    expect(screen.getByRole('dialog')).toHaveClass(
      'duration-300',
      'data-[state=open]:slide-in-from-bottom',
      'data-[state=closed]:slide-out-to-bottom'
    );
    expect(
      screen.getByRole('button', { name: 'Close day details' })
    ).toHaveClass('hidden', 'sm:grid');
  });

  it('follows a downward drag and dismisses after crossing the threshold', async () => {
    const { container } = renderCalendar();
    await openEmptyDay();

    const handle = container.ownerDocument.querySelector(
      '[data-sheet-drag-handle]'
    ) as HTMLDivElement;
    const panel = container.ownerDocument.querySelector(
      '[data-sheet-panel]'
    ) as HTMLDivElement;
    Object.defineProperty(panel, 'offsetHeight', {
      configurable: true,
      value: 400,
    });

    fireEvent.pointerDown(handle, {
      button: 0,
      pointerId: 1,
      clientY: 200,
    });
    fireEvent.pointerMove(handle, {
      pointerId: 1,
      clientY: 330,
    });

    expect(panel.style.transform).toBe('translate3d(0, 130px, 0)');

    fireEvent.pointerUp(handle, {
      pointerId: 1,
      clientY: 330,
    });

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
