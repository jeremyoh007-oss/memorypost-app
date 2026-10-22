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

const ENDPOINT = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;

/** "Now" in KST expressed as a Date whose UTC fields read as KST. */
export const kstNow = (t = Date.now()) => new Date(t + 9 * 3_600_000);

/** Latest issued base (data is published ~10 minutes after each base time). */
export function latestBase(now: Date): { date: string; time: string } {
  const m = now.getUTCHours() * 60 + now.getUTCMinutes() - 10;
  const h = [...BASE_HOURS].reverse().find((b) => b * 60 <= m);
  if (h === undefined) {
    const y = new Date(now.getTime() - 86_400_000);
    return { date: ymd(y), time: '2300' };
  }
  return { date: ymd(now), time: `${pad(h)}00` };
}

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
  const base = latestBase(now);
  const qs = new URLSearchParams({
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: base.date,
    base_time: base.time,
    nx: String(nx),
    ny: String(ny),
  });
  // The service key must be passed URL-encoded exactly once (use the "Decoding" key from 공공데이터포털).
  const url = `${ENDPOINT}?serviceKey=${encodeURIComponent(key)}&${qs}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`KMA HTTP ${res.status}`);
  const body = (await res.json()) as {
    response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: Item[] } } };
  };
  const code = body.response?.header?.resultCode;
  if (code !== '00') throw new Error(`KMA ${code ?? '?'} ${body.response?.header?.resultMsg ?? ''}`.trim());
  const items = body.response?.body?.items?.item ?? [];

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

  // TMX/TMN for today, when present in this base; otherwise derived from hourly TMP.
  let tmx = NaN;
  let tmn = NaN;
  for (const it of items) {
    if (it.fcstDate !== today) continue;
    if (it.category === 'TMX') tmx = num(it.fcstValue);
    if (it.category === 'TMN') tmn = num(it.fcstValue);
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
