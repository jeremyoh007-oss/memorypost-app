import { useEffect, useState } from 'react';

import { TOD, type Tod } from '@/data/tod';
import { useGame } from '@/store/game';
import { effectiveNow, minuteOfDay, realTod } from '@/lib/time';

/** Effective now (real clock + dev day offset), refreshed every `ms`. */
export function useNow(ms = 30_000) {
  const offset = useGame((s) => s.dev.dayOffset);
  const [real, setReal] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setReal(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return effectiveNow(offset, real);
}

/** Time of day + minute-of-day, honoring the dev override. */
export function useTod(): { tod: Tod; minute: number; now: number } {
  const now = useNow();
  const override = useGame((s) => s.dev.todOverride);
  return override ? { tod: override, minute: TOD[override].min, now } : { tod: realTod(now), minute: minuteOfDay(now), now };
}
