# 추억 우체국 (Memory Post)

A small companion-pet app: a 3D-style dog (and friends) greets you by time of day, reads you the weather
and today's schedule, and now and then goes on a trip and sends back a postcard wearing the outfit you chose.
This is the first MVP skeleton, ported from the approved single-file prototype (`memorypost/index.html`).

Expo SDK 58 · React Native 0.88 · TypeScript · expo-router (4 tabs) · zustand + AsyncStorage · reanimated.

## Run

```bash
npm install
npx expo start          # press a (Android), i (iOS), w (web)
npm run web             # web only
npx expo start --android
npm run typecheck       # tsc --noEmit
npx expo export --platform web   # static web build → dist/
```

`expo-calendar` is a native module: device calendars work in a development build
(`npx expo run:android` / `eas build --profile development`). In Expo Go or on web the schedule card
shows a short note instead.

Optional env (copy `.env.example` → `.env`, git-ignored):

| Variable | Effect |
| --- | --- |
| `EXPO_PUBLIC_WEATHER_URL` | Base URL of the deployed weather proxy (`server/weather-proxy`). Unset → sample weather ("예시 데이터"). |
| `EXPO_PUBLIC_DEV_MENU=1` | Force dev tools on in a non-dev build (used for the web preview screenshots). |

### Dev menu

Long-press the date on Home (dev builds only) to: force time of day (자동/아침/오후/밤), simulate
being away 1/2/4 days, toggle the prototype's sample schedule, add a travel ticket or 200 조개, and reset.
On a trip, the event card has a "바로 도착" button (dev only).

## Architecture

```
app/                 expo-router screens
  _layout.tsx        fonts, hydration, Tabs (custom TabBar), OverlayHost, check-in/trip timers
  index.tsx          홈        album.tsx  엽서함     wardrobe.tsx  옷장     friends.tsx  친구들
components/
  home/              Hero (room, greeting, brief, bond ring, Pet, Bubble, hearts), CareRow, EventCard, InfoCards
  overlays/          TravelSheet, DepartOverlay, MailOverlay (envelope + postcard), StoreOverlay,
                     NewFriendOverlay, AdOverlay, RegionSheet, DebugSheet, Toast/PushBanner, OverlayHost
  Postcard, Scene, Sheet, TabBar, Txt, Icons, OutfitOption, ScreenShell, ui.tsx
store/
  game.ts            persisted game state (zustand persist → AsyncStorage), demo seed
  ui.ts              transient UI state (bubble, poses, overlays, loaded weather/events)
  actions.ts         game flows ported from the prototype (care, bond/level-up, travel, keep, buy, check-in, dev)
data/                constants: characters (CH), outfits, cities + durations, time of day, regions (17 시·도),
                     image map + HEAD ratios, sample weather/schedule
services/            interfaces with mock implementations
  weather.ts         WeatherProvider → MockWeather | KmaProxyWeather (EXPO_PUBLIC_WEATHER_URL)
  calendar.ts        expo-calendar: permission + today's events, on device only
  purchases.ts       PurchaseService → MockPurchases (RevenueCat later)
  ads.ts             RewardedAds → MockRewardedAds (3-second placeholder)
lib/                 Korean particles (이/가, 을/를, 은/는, 으로/로), time helpers, pet image resolver, dev flag
theme/tokens.ts      colors/fonts from the prototype CSS (#F7F5F1, #1C1A17, accent #D9654B, Noto Sans KR, Gowun Batang)
server/weather-proxy Cloudflare Worker for 기상청 단기예보 (see its README)
docs/screens/        Playwright screenshots of the web build (390×844)
scripts/             serve-dist.js + screenshots.js used to produce docs/screens
```

Images are the prototype's webp assets in `assets/images` (dog `pet_*`, `cat_*`, `fox_*`, `lion_*`,
`penguin_*`, `char_*`, `bg_*`). Every character has idle/wave/happy/sad/sleep and straw/beret/beanie,
so wardrobe, travel and postcards work for all five.

### Behavior notes

- Time of day follows the clock (05–11 아침, 11–20 오후, else 밤; night dims the room and shows the sleep pose).
- Daily care resets per calendar day; 3/3 gives +10 bond. Bond ≥100 → level up; Lv.5 unlocks 고양이.
- 2+ days away → sad pose and "…보고 싶었어요"; tapping/greeting welcomes back. Nothing is lost.
- One travel ticket per week. Trips last 1/3/8 real hours and land automatically (checked every 20 s and on resume).
- Postcards: city × outfit × character. The album tracks 16 dog combos plus a "친구들이 보낸 엽서" section;
  6 postcards unlock the hidden 여우.
- 사자 (₩4,400) and 펭귄 (겨울 한정, until 11월 30일) go through the mock store sheet → "결제 중…" → "구매 완료!".
- No gacha, no random paid items, no steps/health, no location (region is picked from 17 시·도).

## Mock vs real

| Area | Status |
| --- | --- |
| Game state, persistence | Real (AsyncStorage). Starts from the prototype's demo seed (Lv.4, 23일, 2 postcards). |
| Weather | Mock sample by default. Real 기상청 data via the Worker when `EXPO_PUBLIC_WEATHER_URL` is set. 미세먼지 is sample only (KMA has no dust). |
| Calendar | Real on device (expo-calendar, read-only, today only, never uploaded). Web/denied → note. Sample schedule via dev menu. |
| Purchases | Mock (`MockPurchases`), nothing charged. |
| Rewarded ad ("광고 보고 2배") | Placeholder overlay, no ad SDK. |
| Push notifications | In-app banner only (arrival, "보고 싶어요"). |
| Places on postcard backs | Static samples (한국관광공사 TourAPI later). |

## Next steps

1. Replace `MockPurchases` with RevenueCat (`react-native-purchases`) and add restore purchases.
2. Local notifications (expo-notifications): trip arrival, day-2/day-4 "보고 싶어요", quiet hours 21–08.
3. Deploy the weather Worker; add 초단기실황 for current temp and 에어코리아 for 미세먼지.
4. Fresh-start seed for release (Lv.1, no cards), onboarding (name the pet, pick region, calendar permission prompt).
5. Rewarded ads SDK behind `services/ads.ts` (max 4/day), TourAPI for places.
6. Tests for `store/actions.ts` flows, `npx expo lint`, EAS build profiles, app icon/splash art.
