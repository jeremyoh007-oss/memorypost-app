import { todOfHour, type Tod } from '@/data/tod';

const DAY = 86_400_000;

/** Effective "now", shifted by the dev menu's simulated days. */
export const effectiveNow = (dayOffset: number, real = Date.now()) => real + dayOffset * DAY;

/** Local calendar day key, e.g. "2026-10-22". */
export const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Whole days between two day keys (b - a). */
export const daysBetween = (a: string, b: string) => {
  const pa = a.split('-').map(Number);
  const pb = b.split('-').map(Number);
  return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / DAY);
};

export const addDays = (key: string, n: number) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n).getTime());
};

/** "10월 22일 수요일" */
export const dateLabel = (t: number) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
};

/** Monday-based week key, used for the weekly travel ticket. */
export const weekKey = (t: number) => {
  const d = new Date(t);
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(monday.getTime());
};

export const realTod = (t: number): Tod => todOfHour(new Date(t).getHours());

export const minuteOfDay = (t: number) => {
  const d = new Date(t);
  return d.getHours() * 60 + d.getMinutes();
};

/** "15:30" → 930 */
export const hmToMin = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

/** 930 → "3시 반", 600 → "10시", 1150 → "7시 10분" (spoken style for the pet's lines). */
export const spokenTime = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const hh = h % 12 || 12;
  return `${hh}시${m === 0 ? '' : m === 30 ? ' 반' : ` ${m}분`}`;
};

/** "1시간 20분" style remaining label for trips. */
export const remainLabel = (ms: number) => {
  const totalMin = Math.max(1, Math.round(ms / 60_000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}분`;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
};
