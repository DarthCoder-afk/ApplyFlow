'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { getCalendarEvents } from '@/lib/api/calendar';
import type {
  CalendarEvent,
  CalendarEventCategory,
} from '@/lib/types/calendar';
import { Button } from '@/src/components/ui/button';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_STYLES: Record<CalendarEventCategory, string> = {
  APPLICATION: 'border-blue-200 bg-blue-50 text-blue-700',
  INTERVIEW_STAGE: 'border-violet-200 bg-violet-50 text-violet-700',
  OFFER: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

function startOfCalendarGrid(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  firstDay.setHours(0, 0, 0, 0);
  return firstDay;
}

function endOfCalendarGrid(month: Date) {
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(start: Date, end: Date) {
  const days = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function eventTime(event: CalendarEvent) {
  if (event.category === 'APPLICATION' || event.category === 'OFFER') {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(event.startsAt));
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const gridStart = startOfCalendarGrid(currentMonth);
  const gridEnd = endOfCalendarGrid(currentMonth);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'calendar-events',
      gridStart.toISOString(),
      gridEnd.toISOString(),
    ],
    queryFn: () =>
      getCalendarEvents({
        from: gridStart.toISOString(),
        to: gridEnd.toISOString(),
      }),
  });

  const days = buildCalendarDays(gridStart, gridEnd);

  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();

    for (const event of data?.events ?? []) {
      const key = dayKey(new Date(event.startsAt));
      const events = grouped.get(key) ?? [];
      events.push(event);
      grouped.set(key, events);
    }

    return grouped;
  }, [data]);

  const upcomingEvents = useMemo(
    () =>
      (data?.events ?? [])
        .filter((event) => new Date(event.startsAt) >= new Date())
        .slice(0, 5),
    [data]
  );

  function changeMonth(offset: number) {
    setCurrentMonth(
      (month) =>
        new Date(month.getFullYear(), month.getMonth() + offset, 1)
    );
  }

  function goToToday() {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              {new Intl.DateTimeFormat(undefined, {
                month: 'long',
                year: 'numeric',
              }).format(currentMonth)}
            </h2>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {WEEKDAYS.map((weekday) => (
                  <div
                    key={weekday}
                    className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {weekday}
                  </div>
                ))}
              </div>

              {isLoading ? (
                <div className="grid h-[32rem] place-items-center text-sm text-slate-500">
                  Loading calendar...
                </div>
              ) : error ? (
                <div className="grid h-[32rem] place-items-center text-sm text-red-600">
                  Could not load calendar events.
                </div>
              ) : (
                <div className="grid grid-cols-7">
                  {days.map((day) => {
                    const key = dayKey(day);
                    const events = eventsByDay.get(key) ?? [];
                    const inCurrentMonth =
                      day.getMonth() === currentMonth.getMonth();
                    const isToday = key === dayKey(new Date());

                    return (
                      <div
                        key={key}
                        className={`min-h-32 border-b border-r border-slate-100 p-2 ${
                          inCurrentMonth ? 'bg-white' : 'bg-slate-50/70'
                        }`}
                      >
                        <div
                          className={`mb-2 grid h-7 w-7 place-items-center rounded-full text-sm ${
                            isToday
                              ? 'bg-indigo-600 font-semibold text-white'
                              : inCurrentMonth
                                ? 'text-slate-700'
                                : 'text-slate-400'
                          }`}
                        >
                          {day.getDate()}
                        </div>

                        <div className="space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              title={`${event.title} · ${event.company}`}
                              className={`rounded-lg border px-2 py-1.5 text-xs ${
                                EVENT_STYLES[event.category]
                              } ${
                                event.interviewStatus === 'CANCELLED'
                                  ? 'opacity-60 line-through'
                                  : ''
                              }`}
                            >
                              <p className="truncate font-medium">{event.title}</p>
                              {eventTime(event) && (
                                <p className="mt-0.5 truncate opacity-80">
                                  {eventTime(event)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">Legend</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                Application submitted
              </p>
              <p className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-violet-500" />
                Interview stage
              </p>
              <p className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Job offer
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-violet-600" />
              <h2 className="font-semibold text-slate-950">Upcoming</h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No upcoming events in this view.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <p className="text-sm font-medium text-slate-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {event.company} ·{' '}
                      {new Intl.DateTimeFormat(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour:
                          event.category === 'INTERVIEW_STAGE'
                            ? 'numeric'
                            : undefined,
                        minute:
                          event.category === 'INTERVIEW_STAGE'
                            ? '2-digit'
                            : undefined,
                      }).format(new Date(event.startsAt))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
    </div>
  );
}
