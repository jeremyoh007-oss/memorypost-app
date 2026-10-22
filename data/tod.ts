export type Tod = 'morning' | 'day' | 'night';

/** Greeting per time of day. `min` is the representative minute-of-day used when the debug menu forces a time of day. */
export const TOD: Record<Tod, { greet: string; min: number; label: string }> = {
  morning: { greet: '좋은 아침이에요', min: 492, label: '아침' },
  day: { greet: '좋은 오후예요', min: 860, label: '오후' },
  night: { greet: '편안한 밤 보내요', min: 1360, label: '밤' },
};

/** 05–11 morning, 11–20 day, otherwise night (same as the prototype). */
export const todOfHour = (h: number): Tod => (h >= 5 && h < 11 ? 'morning' : h >= 11 && h < 20 ? 'day' : 'night');

export const NIGHT_HELLO = '오늘도 수고했어요… 졸려요';
