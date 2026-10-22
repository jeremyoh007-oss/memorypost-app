import { Platform } from 'react-native';

/** A today-only event, read on the device. Nothing is sent anywhere. */
export type CalendarEvent = {
  id: string;
  /** "HH:MM" local time */
  start: string;
  title: string;
  location?: string;
  color: string;
};

export type CalendarStatus = 'granted' | 'denied' | 'unavailable';
export type CalendarResult = { status: CalendarStatus; events: CalendarEvent[] };

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Requests calendar permission (first time) and reads today's timed events from all device calendars.
 * Returns [] with status 'denied' or 'unavailable' (web, Expo Go without the module, errors).
 */
export async function getTodayEvents(now: Date = new Date()): Promise<CalendarResult> {
  if (Platform.OS === 'web') return { status: 'unavailable', events: [] };
  try {
    const Cal = await import('expo-calendar');
    const perm = await Cal.requestCalendarPermissions();
    if (!perm.granted) return { status: 'denied', events: [] };
    const calendars = await Cal.getCalendars(Cal.EntityTypes.EVENT);
    if (!calendars.length) return { status: 'granted', events: [] };
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const colorOf = new Map(calendars.map((c) => [c.id, c.color ?? '#4A74D0']));
    const list = await Cal.listEvents(calendars, start, end);
    const events = list
      .filter((e) => !e.allDay)
      .map((e) => {
        const s = new Date(e.startDate);
        return { e, s };
      })
      .filter(({ s }) => s >= start && s < end)
      .sort((a, b) => a.s.getTime() - b.s.getTime())
      .slice(0, 6)
      .map(({ e, s }) => ({
        id: e.id,
        start: `${pad(s.getHours())}:${pad(s.getMinutes())}`,
        title: e.title || '제목 없는 일정',
        location: e.location ?? undefined,
        color: colorOf.get(e.calendarId) ?? '#4A74D0',
      }));
    return { status: 'granted', events };
  } catch {
    return { status: 'unavailable', events: [] };
  }
}
