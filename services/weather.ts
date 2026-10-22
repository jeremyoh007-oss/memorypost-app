import { SAMPLE_WEATHER } from '@/data/samples';
import type { RegionId } from '@/data/regions';

export type Sky = 'clear' | 'partly' | 'cloudy' | 'rain' | 'snow' | 'sleet' | 'shower';
export type Dust = 'good' | 'normal' | 'bad' | 'verybad';

export type HourlyForecast = { hour: number; temp: number; sky: Sky };

/** Compact weather shape. Matches the JSON returned by server/weather-proxy. */
export type Weather = {
  temp: number;
  sky: Sky;
  max: number;
  min: number;
  /** Probability of precipitation, % */
  pop: number;
  /** Next forecast slots (3-hourly), not including "now". */
  hourly: HourlyForecast[];
  /** Temperature shown in the brief at night (optional). */
  nightTemp?: number;
  /** Fine dust. KMA does not provide it; null until an AirKorea source is added. */
  dust?: Dust | null;
  source: 'mock' | 'kma';
  updatedAt?: string;
};

export interface WeatherProvider {
  readonly id: 'mock' | 'kma-proxy';
  get(region: RegionId): Promise<Weather>;
}

/** Returns the prototype's sample data for every region. */
export class MockWeather implements WeatherProvider {
  readonly id = 'mock' as const;
  async get(_region: RegionId): Promise<Weather> {
    return SAMPLE_WEATHER;
  }
}

const SKIES: Sky[] = ['clear', 'partly', 'cloudy', 'rain', 'snow', 'sleet', 'shower'];
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const asSky = (v: unknown): Sky => (SKIES.includes(v as Sky) ? (v as Sky) : 'clear');

/** Calls our Cloudflare Worker (server/weather-proxy), which holds the 기상청 key. */
export class KmaProxyWeather implements WeatherProvider {
  readonly id = 'kma-proxy' as const;
  constructor(private readonly baseUrl: string) {}

  async get(region: RegionId): Promise<Weather> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/weather?region=${encodeURIComponent(region)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`weather proxy ${res.status}`);
      const j = (await res.json()) as Record<string, unknown>;
      if (!isNum(j.temp) || !isNum(j.max) || !isNum(j.min) || !isNum(j.pop)) throw new Error('bad weather payload');
      const hourly = Array.isArray(j.hourly) ? j.hourly : [];
      return {
        temp: j.temp,
        sky: asSky(j.sky),
        max: j.max,
        min: j.min,
        pop: j.pop,
        hourly: hourly
          .filter((h): h is Record<string, unknown> => !!h && typeof h === 'object')
          .filter((h) => isNum(h.hour) && isNum(h.temp))
          .map((h) => ({ hour: h.hour as number, temp: h.temp as number, sky: asSky(h.sky) }))
          .slice(0, 4),
        dust: null,
        source: 'kma',
        updatedAt: typeof j.updatedAt === 'string' ? j.updatedAt : undefined,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

const PROXY_URL = process.env.EXPO_PUBLIC_WEATHER_URL;

export const weatherProvider: WeatherProvider = PROXY_URL ? new KmaProxyWeather(PROXY_URL) : new MockWeather();

/** Fetch with graceful fallback to sample data (flagged as mock so the UI shows "예시 데이터"). */
export async function loadWeather(region: RegionId): Promise<Weather> {
  try {
    return await weatherProvider.get(region);
  } catch {
    return SAMPLE_WEATHER;
  }
}

export const SKY_LABEL: Record<Sky, string> = {
  clear: '맑음', partly: '구름 많음', cloudy: '흐림', rain: '비', snow: '눈', sleet: '비/눈', shower: '소나기',
};

/** Connective form for spoken lines: "맑고", "흐리고" … */
export const SKY_AND: Record<Sky, string> = {
  clear: '맑고', partly: '구름이 많고', cloudy: '흐리고', rain: '비가 오고', snow: '눈이 오고', sleet: '비나 눈이 오고', shower: '소나기가 오고',
};

export const DUST_LABEL: Record<Dust, { text: string; color: string; sub: string; line: string }> = {
  good: { text: '좋음', color: '#3E9466', sub: '산책하기 좋아요', line: '공기가 깨끗해요! 산책하기 좋은 날이에요' },
  normal: { text: '보통', color: '#4A74D0', sub: '무난한 공기예요', line: '공기는 보통이에요. 오래 밖에 있으면 쉬어 가요' },
  bad: { text: '나쁨', color: '#E39A3B', sub: '마스크 챙겨요', line: '먼지가 많아요. 마스크 꼭 챙겨요' },
  verybad: { text: '매우 나쁨', color: '#D9654B', sub: '바깥 활동은 줄여요', line: '오늘은 집에서 같이 쉬어요. 먼지가 정말 많아요' },
};

export const rainSub = (pop: number) => (pop < 30 ? '우산은 두고 가도 돼요' : pop < 60 ? '작은 우산 챙겨요' : '우산 꼭 챙겨요');
export const rainLine = (pop: number) =>
  pop < 30 ? '비 소식 없어요. 빨래 널어도 돼요' : pop < 60 ? '비가 올 수도 있어요. 작은 우산 챙겨요' : '오늘은 비가 와요. 우산 꼭 챙겨요';
