import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useGame } from '@/store/game';
import { setUI } from '@/store/ui';
import { getTodayEvents } from '@/services/calendar';
import { loadWeather, weatherProvider } from '@/services/weather';

const HOUR = 3_600_000;
const RETRY_MIN = 30_000;
const RETRY_MAX = 600_000;

/** Loads weather for the chosen 시·도 and today's device calendar into the UI store. */
export function useInfoLoader(enabled: boolean) {
  const region = useGame((s) => s.weatherRegion);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    let loadedAt = 0;
    let retryIn = RETRY_MIN;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      clearTimeout(retry);
      loadWeather(region).then((w) => {
        if (!alive) return;
        // Sample data while the proxy is configured means the request failed (no network yet, timeout…).
        if (w.source === 'mock' && weatherProvider.id === 'kma-proxy') {
          if (!loadedAt) setUI({ weather: w }); // otherwise keep the last real forecast on screen
          retry = setTimeout(run, retryIn);
          retryIn = Math.min(retryIn * 2, RETRY_MAX);
          return;
        }
        loadedAt = Date.now();
        retryIn = RETRY_MIN;
        setUI({ weather: w });
      });
    };
    run();
    const id = setInterval(run, HOUR);
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active' && Date.now() - loadedAt > HOUR) run();
    });
    return () => {
      alive = false;
      clearTimeout(retry);
      clearInterval(id);
      sub.remove();
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
