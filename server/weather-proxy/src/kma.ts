/** 기상청 단기예보 (VilageFcstInfoService_2.0 / getVilageFcst) → compact weather JSON. */

export type Sky = 'clear' | 'partly' | 'cloudy' | 'rain' | 'snow' | 'sleet' | 'shower';
export type Compact = {
  region: string;
  temp: number;
  sky: Sky;
  max: number;
  min: number;
  pop: number;
  hourly: { hour: number; temp: number; sky: Sky }[];
  base: string;
  updatedAt: string;
};

type Item = { category: string; fcstDate: string; fcstTime: string; fcstValue: string };
type Base = { date: string; time: string };

/** Upstream failure with a short reason code that is safe to return (never contains the key). */
export class KmaError extends Error {
  reason: string;
  constructor(reason: string) {
    super(`KMA ${reason}`);
    this.reason = reason;
  }
}

const ENDPOINT = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;

/** "Now" in KST expressed as a Date whose UTC fields read as KST. */
export const kstNow = (t = Date.now()) => new Date(t + 9 * 3_600_000);

/** Latest issued base (data is published ~10 minutes after each base time). */
export function latestBase(now: Date): Base {
  const m = now.getUTCHours() * 60 + now.getUTCMinutes() - 10;
  const h = [...BASE_HOURS].reverse().find((b) => b * 60 <= m);
  if (h === undefined) {
    const y = new Date(now.getTime() - 86_400_000);
    return { date: ymd(y), time: '2300' };
  }
  return { date: ymd(now), time: `${pad(h)}00` };
}

/** The base issued just before `b` (the latest one can lag a few minutes past its publish time). */
export function previousBase(b: Base): Base {
  const h = Number(b.time.slice(0, 2));
  if (h > 2) return { date: b.date, time: `${pad(h - 3)}00` };
  const d = Date.UTC(Number(b.date.slice(0, 4)), Number(b.date.slice(4, 6)) - 1, Number(b.date.slice(6, 8)));
  return { date: ymd(new Date(d - 86_400_000)), time: '2300' };
}

/** 공공데이터포털 issues an "Encoding" and a "Decoding" key; decode the former so either is encoded exactly once. */
const normalizeKey = (key: string) => {
  const k = key.trim();
  if (!k.includes('%')) return k;
  try {
    return decodeURIComponent(k);
  } catch {
    return k;
  }
};

async function getItems(key: string, base: Base, nx: number, ny: number, rows: number): Promise<Item[]> {
  const qs = new URLSearchParams({
    pageNo: '1',
    numOfRows: String(rows),
    dataType: 'JSON',
    base_date: base.date,
    base_time: base.time,
    nx: String(nx),
    ny: String(ny),
  });
  const url = `${ENDPOINT}?serviceKey=${encodeURIComponent(normalizeKey(key))}&${qs}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  const text = await res.text();
  let body:
    | { response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: Item[] } } } }
    | undefined;
  try {
    body = JSON.parse(text);
  } catch {
    body = undefined;
  }
  const header = body?.response?.header;
  if (!header) {
    // Key and quota errors come from the 공공데이터포털 gateway instead (JSON or XML, usually HTTP 403),
    // e.g. {"OpenAPI_ServiceResponse":{"cmmMsgHeader":{"errMsg":"SERVICE_KEY_IS_NOT_REGISTERED_ERROR",...}}}.
    throw new KmaError(/\b([A-Z][A-Z_]*_ERROR)\b/.exec(text)?.[1] ?? `HTTP_${res.status}`);
  }
  const msg = header.resultMsg ?? '';
  if (header.resultCode !== '00') throw new KmaError(/^[A-Z_]+$/.test(msg) ? msg : `CODE_${header.resultCode ?? '?'}`);
  return body?.response?.body?.items?.item ?? [];
}

const extremes = (items: Item[], date: string) => {
  let tmx = NaN;
  let tmn = NaN;
  for (const it of items) {
    if (it.fcstDate !== date) continue;
    if (it.category === 'TMX') tmx = Number(it.fcstValue);
    if (it.category === 'TMN') tmn = Number(it.fcstValue);
  }
  return { tmx, tmn };
};

const skyOf = (sky?: string, pty?: string): Sky => {
  switch (pty) {
    case '1':
    case '5':
      return 'rain';
    case '2':
    case '6':
      return 'sleet';
    case '3':
    case '7':
      return 'snow';
    case '4':
      return 'shower';
  }
  return sky === '4' ? 'cloudy' : sky === '3' ? 'partly' : 'clear';
};

export async function fetchKma(key: string, region: string, nx: number, ny: number, t = Date.now()): Promise<Compact> {
  const now = kstNow(t);
  let base = latestBase(now);
  let items: Item[];
  try {
    items = await getItems(key, base, nx, ny, 1000);
  } catch (e) {
    if (!(e instanceof KmaError && e.reason === 'NO_DATA')) throw e;
    base = previousBase(base);
    items = await getItems(key, base, nx, ny, 1000);
  }

  // Group by forecast slot.
  const slots = new Map<string, Record<string, string>>();
  for (const it of items) {
    const k = it.fcstDate + it.fcstTime;
    const slot = slots.get(k) ?? {};
    slot[it.category] = it.fcstValue;
    slots.set(k, slot);
  }
  const nowKey = ymd(now) + `${pad(now.getUTCHours())}00`;
  const keys = [...slots.keys()].sort().filter((k) => k >= nowKey);
  if (!keys.length) throw new Error('KMA: no forecast slots');

  const today = ymd(now);
  const todays = keys.filter((k) => k.startsWith(today));
  const num = (v?: string) => (v === undefined ? NaN : Number(v));
  const first = slots.get(keys[0])!;
  const temps = (todays.length ? todays : keys.slice(0, 8)).map((k) => num(slots.get(k)!.TMP)).filter(Number.isFinite);

  // TMX/TMN for today. Bases from 08:00 drop today's TMN (06시) and from 17:00 today's TMX (15시),
  // so read them from today's 02:00 base rather than shrinking max/min to the remaining hours.
  let { tmx, tmn } = extremes(items, today);
  if ((!Number.isFinite(tmx) || !Number.isFinite(tmn)) && base.date === today && base.time !== '0200') {
    try {
      const early = extremes(await getItems(key, { date: today, time: '0200' }, nx, ny, 300), today);
      if (!Number.isFinite(tmx)) tmx = early.tmx;
      if (!Number.isFinite(tmn)) tmn = early.tmn;
    } catch {
      // Fall back to the hourly TMP values below.
    }
  }
  const temp = Math.round(num(first.TMP));
  const max = Math.round(Number.isFinite(tmx) ? Math.max(tmx, ...temps) : Math.max(...temps));
  const min = Math.round(Number.isFinite(tmn) ? Math.min(tmn, ...temps) : Math.min(...temps));
  const pop = Math.max(0, ...(todays.length ? todays : keys.slice(0, 8)).map((k) => num(slots.get(k)!.POP)).filter(Number.isFinite));

  const hourly = [3, 6, 9, 12]
    .map((i) => keys[i])
    .filter((k): k is string => !!k)
    .map((k) => {
      const s = slots.get(k)!;
      return { hour: Number(k.slice(8, 10)), temp: Math.round(num(s.TMP)), sky: skyOf(s.SKY, s.PTY) };
    });

  return {
    region,
    temp,
    sky: skyOf(first.SKY, first.PTY),
    max,
    min,
    pop,
    hourly,
    base: `${base.date}${base.time}`,
    updatedAt: new Date(t).toISOString(),
  };
}
