'use client';

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@/components/ui/mini-calendar';

export const CompactCalendar = ({ className }: { className?: string }) => (
  <MiniCalendar className={className}>
    <MiniCalendarNavigation direction="prev" />
    <MiniCalendarDays>
      {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
    </MiniCalendarDays>
    <MiniCalendarNavigation direction="next" />
  </MiniCalendar>
);
