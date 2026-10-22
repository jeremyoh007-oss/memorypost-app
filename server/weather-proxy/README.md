# memorypost-weather (Cloudflare Worker)

Small proxy between the app and 기상청 단기예보 (공공데이터포털 `VilageFcstInfoService_2.0/getVilageFcst`).
It keeps the service key off the device, maps the 17 시·도 to forecast grid points, caches each region for 1 hour,
and returns a compact JSON.

```
GET /weather?region=seoul
{ "region":"seoul", "temp":18, "sky":"clear", "max":21, "min":11, "pop":10,
  "hourly":[{"hour":15,"temp":21,"sky":"clear"}, ...], "base":"202610221400", "updatedAt":"..." }
```

`sky` is one of `clear | partly | cloudy | rain | snow | sleet | shower` (SKY + PTY codes).
Region ids: `seoul busan daegu incheon gwangju daejeon ulsan sejong gyeonggi gangwon chungbuk chungnam jeonbuk jeonnam gyeongbuk gyeongnam jeju`
(grid points are each 시·도청 소재지; see `src/regions.ts`).

## Setup

1. Apply for **기상청_단기예보 ((구)_동네예보) 조회서비스** on 공공데이터포털 and copy the **Decoding** key.
2. Install and log in:
   ```bash
   cd server/weather-proxy
   npm install
   npx wrangler login
   ```
3. Store the key as a secret (never in `wrangler.toml` or git):
   ```bash
   npx wrangler secret put KMA_SERVICE_KEY
   ```
4. Deploy: `npm run deploy` → note the `*.workers.dev` URL.
5. In the app, set `EXPO_PUBLIC_WEATHER_URL=https://memorypost-weather.<you>.workers.dev` (e.g. in `.env`, git-ignored)
   and restart `npx expo start`. The weather card label switches from "예시 데이터" to "기상청 단기예보".

Local dev: copy `.dev.vars.example` to `.dev.vars` (git-ignored), then `npm run dev`.

## Notes

- Current temperature uses the nearest 단기예보 slot (not 초단기실황). Switch to `getUltraSrtNcst` for live readings later.
- Today's max/min use TMX/TMN when the base includes them, otherwise the remaining hourly TMP values.
- Fine dust (미세먼지) is not part of KMA data; add 에어코리아 later.
- Errors never echo the upstream URL, since it contains the key.
