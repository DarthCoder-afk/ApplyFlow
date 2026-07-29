'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Dialog as DialogPrimitive } from 'radix-ui';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from 'lucide-react';
import { getCalendarEvents } from '@/lib/api/calendar';
import type {
  CalendarEvent,
  CalendarEventCategory,
} from '@/lib/types/calendar';
import { Button } from '@/src/components/ui/button';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_STYLES: Record<CalendarEventCategory, string> = {
  APPLICATION: 'sm:border-blue-200 sm:bg-blue-50 sm:text-blue-700',
  INTERVIEW_STAGE: 'sm:border-violet-200 sm:bg-violet-50 sm:text-violet-700',
  OFFER: 'sm:border-emerald-200 sm:bg-emerald-50 sm:text-emerald-700',
};

const EVENT_DOT_STYLES: Record<CalendarEventCategory, string> = {
  APPLICATION: 'bg-blue-500',
  INTERVIEW_STAGE: 'bg-violet-500',
  OFFER: 'bg-emerald-500',
};

const EVENT_LABELS: Record<CalendarEventCategory, string> = {
  APPLICATION: 'Application submitted',
  INTERVIEW_STAGE: 'Interview stage',
  OFFER: 'Job offer',
};

const EVENT_ACCENTS: Record<CalendarEventCategory, string> = {
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

function formatEventDate(event: CalendarEvent) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: event.category === 'INTERVIEW_STAGE' ? 'numeric' : undefined,
    minute: event.category === 'INTERVIEW_STAGE' ? '2-digit' : undefined,
  }).format(new Date(event.startsAt));
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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

  const selectedDayEvents = selectedDay
    ? eventsByDay.get(dayKey(selectedDay)) ?? []
    : [];

  const selectedEvent =
    selectedDayEvents.find((event) => event.id === selectedEventId) ?? null;

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

  function openDay(day: Date) {
    const events = eventsByDay.get(dayKey(day)) ?? [];
    setSelectedDay(day);
    setSelectedEventId(events[0]?.id ?? null);
  }

  function closeDay() {
    setSelectedDay(null);
    setSelectedEventId(null);
  }

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-3 sm:p-4">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">
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

          <div>
            <div className="min-w-0">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {WEEKDAYS.map((weekday) => (
                  <div
                    key={weekday}
                    className="px-1 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:px-3 sm:text-xs"
                  >
                    <span className="sm:hidden">{weekday.slice(0, 1)}</span>
                    <span className="hidden sm:inline">{weekday}</span>
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
                      <button
                        type="button"
                        key={key}
                        onClick={() => openDay(day)}
                        aria-label={`View ${events.length} ${events.length === 1 ? 'event' : 'events'} on ${new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(day)}`}
                        className={`min-h-[4.75rem] border-b border-r border-slate-100 p-1 text-left transition hover:bg-indigo-50/40 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:min-h-32 sm:p-2 ${
                          inCurrentMonth ? 'bg-white' : 'bg-slate-50/70'
                        } ${selectedDay && key === dayKey(selectedDay) ? 'ring-2 ring-inset ring-indigo-400' : ''}`}
                      >
                        <div
                          className={`mb-1 grid h-6 w-6 place-items-center rounded-full text-xs sm:mb-2 sm:h-7 sm:w-7 sm:text-sm ${
                            isToday
                              ? 'bg-indigo-600 font-semibold text-white'
                              : inCurrentMonth
                                ? 'text-slate-700'
                                : 'text-slate-400'
                          }`}
                        >
                          {day.getDate()}
                        </div>

                        <div className="flex flex-wrap gap-1 sm:block sm:space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              title={`${event.title} · ${event.company}`}
                              className={`h-1.5 w-1.5 rounded-full sm:h-auto sm:w-auto sm:rounded-lg sm:border sm:px-2 sm:py-1.5 sm:text-xs ${
                                EVENT_DOT_STYLES[event.category]
                              } ${
                                EVENT_STYLES[event.category]
                              } ${
                                event.interviewStatus === 'CANCELLED'
                                  ? 'opacity-60 line-through'
                                  : ''
                              }`}
                            >
                              <p className="hidden truncate font-medium sm:block">{event.title}</p>
                              {eventTime(event) && (
                                <p className="mt-0.5 hidden truncate opacity-80 sm:block">
                                  {eventTime(event)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </button>
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

      <DialogPrimitive.Root
        open={selectedDay !== null}
        onOpenChange={(open) => {
          if (!open) closeDay();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-hidden rounded-t-[1.75rem] border border-slate-200 bg-white shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-6 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-6 sm:inset-y-4 sm:left-auto sm:right-4 sm:bottom-auto sm:w-[28rem] sm:max-h-none sm:rounded-[1.75rem] sm:data-[state=closed]:slide-out-to-right-8 sm:data-[state=open]:slide-in-from-right-8">
            {selectedDay && (
              <div className="flex max-h-[88dvh] flex-col sm:h-full sm:max-h-none">
                <div className="border-b border-slate-200 px-5 pb-5 pt-4 sm:px-6 sm:pt-6">
                  <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                        Day overview
                      </p>
                      <DialogPrimitive.Title className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        {new Intl.DateTimeFormat(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        }).format(selectedDay)}
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="mt-1 text-sm text-slate-500">
                        {selectedDayEvents.length === 0
                          ? 'Nothing scheduled for this day.'
                          : `${selectedDayEvents.length} ${selectedDayEvents.length === 1 ? 'event' : 'events'} in your job search.`}
                      </DialogPrimitive.Description>
                    </div>
                    <DialogPrimitive.Close className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950" aria-label="Close day details">
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  {selectedDayEvents.length === 0 ? (
                    <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                      <div>
                        <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
                          <CalendarDays className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-sm font-medium text-slate-800">A clear day</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Applications, interviews, and offers will appear here automatically.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayEvents.map((event) => {
                        const expanded = selectedEvent?.id === event.id;
                        return (
                          <article key={event.id} className={`overflow-hidden rounded-2xl border transition-all ${expanded ? 'border-indigo-200 bg-indigo-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            <button
                              type="button"
                              onClick={() => setSelectedEventId(expanded ? null : event.id)}
                              className="flex w-full items-start gap-3 p-4 text-left"
                              aria-expanded={expanded}
                            >
                              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${EVENT_DOT_STYLES[event.category]}`} />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-slate-950">{event.title}</span>
                                <span className="mt-1 block text-xs text-slate-500">{event.company} · {eventTime(event) ?? 'All day'}</span>
                              </span>
                              <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                              <div className="overflow-hidden">
                                <div className="border-t border-indigo-100 px-4 pb-4 pt-4">
                                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${EVENT_ACCENTS[event.category]}`}>
                                    {EVENT_LABELS[event.category]}
                                  </span>
                                  <dl className="mt-4 grid gap-3 text-sm">
                                    <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" /><div><dt className="text-xs text-slate-500">Date and time</dt><dd className="mt-0.5 font-medium text-slate-800">{formatEventDate(event)}</dd></div></div>
                                    <div className="flex items-start gap-3"><BriefcaseBusiness className="mt-0.5 h-4 w-4 text-slate-400" /><div><dt className="text-xs text-slate-500">Opportunity</dt><dd className="mt-0.5 font-medium text-slate-800">{event.jobTitle} at {event.company}</dd></div></div>
                                    {event.applicationStatus && <div><dt className="text-xs text-slate-500">Application status</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{event.applicationStatus.toLowerCase().replaceAll('_', ' ')}</dd></div>}
                                    {event.interviewType && <div><dt className="text-xs text-slate-500">Interview type</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{event.interviewType.toLowerCase().replaceAll('_', ' ')}</dd></div>}
                                    {event.interviewStatus && <div><dt className="text-xs text-slate-500">Interview status</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{event.interviewStatus.toLowerCase().replaceAll('_', ' ')}</dd></div>}
                                  </dl>
                                  <Link href="/applications" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
                                    Open application <ArrowUpRight className="h-3.5 w-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
