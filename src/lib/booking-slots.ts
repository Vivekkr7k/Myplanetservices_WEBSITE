/**
 * Discovery-call scheduling.
 *
 * The studio works Indian hours, so slots are defined once in IST and then
 * rendered in whatever timezone the visitor's browser reports. Both readings
 * travel with the booking, because a request that says only "2:00 PM" is
 * ambiguous the moment two timezones are involved.
 */

/**
 * Studio availability, IST, on working days.
 *
 * The window runs to 21:00 deliberately. Closing at 18:00 IST would mean a New
 * York visitor is offered nothing between 12:30am and 8:00am their time — which
 * is the same as offering nothing at all. The evening IST slots are the ones
 * that land in European afternoons and US mornings.
 */
export const STUDIO_HOURS = { startHour: 10, endHour: 21 } as const;
const SLOT_MINUTES = 30;
/** Earliest bookable day, so nobody requests a call starting in ten minutes. */
const LEAD_TIME_DAYS = 1;
/** How far ahead the calendar opens. */
export const BOOKING_HORIZON_DAYS = 60;

const IST_OFFSET = '+05:30';

export interface Slot {
  /** Absolute instant, unambiguous across timezones. */
  iso: string;
  /** e.g. "2:00 PM" in the visitor's timezone. */
  localLabel: string;
  /** e.g. "5:30 PM IST" — what the studio sees. */
  istLabel: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date as YYYY-MM-DD, avoiding toISOString's UTC shift. */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export function firstBookableDate(): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + LEAD_TIME_DAYS);
  while (isWeekend(d)) d.setDate(d.getDate() + 1);
  return d;
}

export function lastBookableDate(): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + BOOKING_HORIZON_DAYS);
  return d;
}

export const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function isSelectable(d: Date): boolean {
  if (isWeekend(d)) return false;
  const key = toDateKey(d);
  return key >= toDateKey(firstBookableDate()) && key <= toDateKey(lastBookableDate());
}

/**
 * Slots for one calendar day, as instants built from IST wall-clock times.
 *
 * Constructing the Date from an explicit +05:30 string is what makes this
 * correct: it pins the instant regardless of where the visitor's machine is, so
 * the conversion below is a genuine timezone render rather than an offset guess.
 */
export function slotsForDate(date: Date, viewerTimeZone: string): Slot[] {
  const dateKey = toDateKey(date);
  const slots: Slot[] = [];

  const localTime = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: viewerTimeZone,
  });
  const istTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  for (let h = STUDIO_HOURS.startHour; h < STUDIO_HOURS.endHour; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const instant = new Date(`${dateKey}T${pad(h)}:${pad(m)}:00${IST_OFFSET}`);
      if (Number.isNaN(instant.getTime())) continue;
      // A slot that has already passed is not available.
      if (instant.getTime() <= Date.now()) continue;

      slots.push({
        iso: instant.toISOString(),
        localLabel: localTime.format(instant),
        istLabel: `${istTime.format(instant)} IST`,
      });
    }
  }
  return slots;
}

/** Human date in the visitor's timezone, e.g. "Thu, 17 Sep 2026". */
export function formatSlotDate(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso));
}

/** The full booking line that goes into the email and the confirmation toast. */
export function describeSlot(iso: string, timeZone: string): string {
  const slotDate = formatSlotDate(iso, timeZone);
  const local = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso));
  const ist = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));

  const shortZone = timeZone.split('/').pop()?.replace(/_/g, ' ') ?? timeZone;
  // Only mention IST separately when the visitor isn't already on it.
  return timeZone === 'Asia/Kolkata' || timeZone === 'Asia/Calcutta'
    ? `${slotDate}, ${ist} IST`
    : `${slotDate}, ${local} (${shortZone}) · ${ist} IST`;
}

/** Weeks of a month, padded to whole Mon–Sun rows. */
export function monthGrid(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  // Monday-first: shift Sunday (0) back six days rather than one.
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  const weeks: Date[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    // Stop once we've passed the month and completed a row.
    if (cursor.getMonth() !== month && cursor > new Date(year, month + 1, 0)) break;
  }
  return weeks;
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
