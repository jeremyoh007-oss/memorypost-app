import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useGame } from '@/store/game';
import { setUI } from '@/store/ui';
import { getTodayEvents } from '@/services/calendar';
import { loadWeather } from '@/services/weather';

const HOUR = 3_600_000;

/** Loads weather for the chosen 시·도 and today's device calendar into the UI store. */
export function useInfoLoader(enabled: boolean) {
  const region = useGame((s) => s.weatherRegion);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const run = () =>
      loadWeather(region).then((w) => {
        if (alive) setUI({ weather: w });
      });
    run();
    const id = setInterval(run, HOUR);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [region, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const run = () => getTodayEvents().then((r) => setUI({ events: r.events, calStatus: r.status }));
    run();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') run();
    });
    return () => sub.remove();
  }, [enabled]);
}
