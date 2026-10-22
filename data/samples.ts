import type { CalendarEvent } from '@/services/calendar';
import type { Weather } from '@/services/weather';

/** The prototype's sample weather (서울, 맑음 18°). Used by MockWeather. */
export const SAMPLE_WEATHER: Weather = {
  temp: 18,
  sky: 'clear',
  max: 21,
  min: 11,
  pop: 10,
  hourly: [
    { hour: 15, temp: 21, sky: 'clear' },
    { hour: 18, temp: 17, sky: 'partly' },
    { hour: 21, temp: 14, sky: 'cloudy' },
    { hour: 0, temp: 12, sky: 'clear' },
  ],
  nightTemp: 14,
  dust: 'good',
  source: 'mock',
};

/** The prototype's sample schedule. Only shown when the dev menu turns on "예시 일정". */
export const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: 's1', start: '10:00', title: '팀 주간 회의', location: '회의실 B', color: '#4A74D0' },
  { id: 's2', start: '15:30', title: '치과 정기 검진', location: '동네 치과', color: '#D9654B' },
  { id: 's3', start: '19:00', title: '친구랑 저녁', location: '성수동', color: '#3E9466' },
];
