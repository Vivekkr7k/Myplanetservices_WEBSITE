import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Globe } from 'lucide-react';
import {
  WEEKDAY_LABELS,
  firstBookableDate,
  isSelectable,
  lastBookableDate,
  monthGrid,
  slotsForDate,
  toDateKey,
  type Slot,
} from '../../lib/booking-slots';

interface BookingCalendarProps {
  timeZone: string;
  /** Fires with the chosen instant, or null when the date changes. */
  onSelect: (slot: Slot | null) => void;
  selectedIso?: string | null;
}

export function BookingCalendar({ timeZone, onSelect, selectedIso }: BookingCalendarProps) {
  const initial = useMemo(() => firstBookableDate(), []);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(initial);

  const weeks = useMemo(() => monthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const slots = useMemo(
    () => slotsForDate(selectedDate, timeZone),
    [selectedDate, timeZone]
  );

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(viewYear, viewMonth, 1));

  // Clamp navigation to the bookable window so there are no empty months.
  const minKey = toDateKey(firstBookableDate());
  const maxKey = toDateKey(lastBookableDate());
  const canGoBack = toDateKey(new Date(viewYear, viewMonth, 1)) > minKey.slice(0, 8) + '01';
  const canGoForward = toDateKey(new Date(viewYear, viewMonth + 1, 1)) <= maxKey;

  const shift = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const pickDate = (d: Date) => {
    setSelectedDate(d);
    onSelect(null); // a new day invalidates the previously chosen time
  };

  const zoneLabel = timeZone.split('/').pop()?.replace(/_/g, ' ') ?? timeZone;

  return (
    <div className="flex flex-col gap-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="w-8 h-8 rounded-lg border border-white/15 text-ink-foreground flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-display text-sm font-semibold text-ink-foreground tabular-nums">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="w-8 h-8 rounded-lg border border-white/15 text-ink-foreground flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Date grid */}
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {WEEKDAY_LABELS.map((d) => (
            <div
              key={d}
              className="text-[10px] font-mono uppercase tracking-wider text-ink-muted text-center py-1"
            >
              {d.slice(0, 1)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day) => {
            const inMonth = day.getMonth() === viewMonth;
            const selectable = isSelectable(day);
            const isSelected = toDateKey(day) === toDateKey(selectedDate);

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={!selectable}
                onClick={() => pickDate(day)}
                aria-label={day.toDateString()}
                aria-pressed={isSelected}
                className={`aspect-square rounded-lg text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-butter text-butter-foreground font-bold'
                    : selectable
                    ? 'text-ink-foreground hover:bg-white/10'
                    : 'text-ink-muted/35 cursor-not-allowed'
                } ${!inMonth && selectable ? 'opacity-45' : ''}`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-ink-muted mt-2.5">
          Weekdays only · booking up to 60 days ahead
        </p>
      </div>

      {/* Time slots for the chosen day */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Available times
          </span>
          <span className="text-[10px] font-mono text-butter flex items-center gap-1 min-w-0">
            <Globe className="w-3 h-3 shrink-0" />
            <span className="truncate">{zoneLabel}</span>
          </span>
        </div>

        {slots.length === 0 ? (
          <p className="text-xs text-ink-muted py-3">
            No times left on this day — try the next one.
          </p>
        ) : (
          <div
            className="grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1"
            data-lenis-prevent
          >
            {slots.map((slot) => {
              const active = slot.iso === selectedIso;
              return (
                <button
                  key={slot.iso}
                  type="button"
                  onClick={() => onSelect(slot)}
                  aria-pressed={active}
                  className={`py-2 px-1 rounded-lg text-[11px] font-medium tabular-nums border transition-colors cursor-pointer ${
                    active
                      ? 'bg-butter text-butter-foreground border-butter font-semibold'
                      : 'bg-white/5 text-ink-foreground border-white/10 hover:border-white/25'
                  }`}
                >
                  {slot.localLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* Only worth showing when the visitor isn't already on IST. */}
        {selectedIso && timeZone !== 'Asia/Kolkata' && timeZone !== 'Asia/Calcutta' && (
          <p className="text-[11px] text-ink-muted mt-2.5">
            That's{' '}
            <span className="text-butter font-medium">
              {slots.find((s) => s.iso === selectedIso)?.istLabel}
            </span>{' '}
            for our team.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingCalendar;
