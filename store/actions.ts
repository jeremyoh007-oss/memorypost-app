/**
 * Game flows ported from the prototype's click handler. These read/write both the persisted
 * game store and the transient UI store, so screens stay thin.
 */
import { router } from 'expo-router';

import { CH, CHAR_IDS, NIGHT_PAT_LINES, PAT_LINES, type CharId } from '@/data/characters';
import { CITIES, durOf } from '@/data/cities';
import { OUTFITS, type OutfitId } from '@/data/outfits';
import { regionName } from '@/data/regions';
import { SAMPLE_EVENTS } from '@/data/samples';
import { NIGHT_HELLO, TOD, type Tod } from '@/data/tod';
import { eulReul, eunNeun, iGa } from '@/lib/korean';
import type { Pose } from '@/lib/pet';
import { dayKey, daysBetween, effectiveNow, hmToMin, minuteOfDay, realTod, spokenTime, weekKey } from '@/lib/time';
import { rewardedAds } from '@/services/ads';
import type { CalendarEvent } from '@/services/calendar';
import { DUST_LABEL, rainLine, SKY_AND } from '@/services/weather';
import { CARE_KEYS, cardKey, game, useGame, type CareKey, type GameData } from './game';
import { setUI, ui } from './ui';

// ---------- clock ----------
export const nowMs = () => effectiveNow(game().dev.dayOffset);
export const currentTod = (): Tod => game().dev.todOverride ?? realTod(nowMs());
export const currentMinute = () => {
  const o = game().dev.todOverride;
  return o ? TOD[o].min : minuteOfDay(nowMs());
};
export const scheduleEvents = (): CalendarEvent[] => (game().dev.sampleSchedule ? SAMPLE_EVENTS : ui().events);
export const nextEvent = (events = scheduleEvents(), min = currentMinute()) => events.find((e) => hmToMin(e.start) >= min);

const set = (patch: Partial<GameData> | ((s: GameData) => Partial<GameData>)) => game().set(patch);

// ---------- feedback primitives ----------
let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(text: string) {
  setUI({ toast: { text, key: Date.now() } });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setUI({ toast: null }), 2200);
}

let pushTimer: ReturnType<typeof setTimeout> | undefined;
export function pushBanner(text: string) {
  setUI({ push: { text, key: Date.now() } });
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => setUI({ push: null }), 4500);
}

export function say(text: string | null) {
  setUI({ bubble: { text, key: ui().bubble.key + 1 } });
}
export function bounce(kind: 'hop' | 'squish' = 'hop') {
  setUI({ bounce: { kind, key: ui().bounce.key + 1 } });
}
export function hearts(n: number) {
  setUI({ hearts: { n, key: ui().hearts.key + 1 } });
}
export const scrollHomeTop = () => setUI({ scrollTopKey: ui().scrollTopKey + 1 });

let laterTimer: ReturnType<typeof setTimeout> | undefined;
/** Runs fn after ms unless the pet left on a trip or became sad meanwhile (prototype `later`). */
function later(fn: () => void, ms: number) {
  clearTimeout(laterTimer);
  laterTimer = setTimeout(() => {
    if (!game().trip && !ui().sad) fn();
  }, ms);
}
function tempPose(p: Pose, ms: number) {
  setUI({ tempPose: p });
  later(() => setUI({ tempPose: null }), ms);
}
function happyFace() {
  if (game().outfit === 'none' && currentTod() !== 'night') tempPose('happy', 1400);
}

// ---------- lines ----------
export function helloLine(tod: Tod = currentTod()): string {
  if (tod === 'night') return NIGHT_HELLO;
  const w = ui().weather;
  if (tod === 'morning') {
    if (!w) return '좋은 아침! 오늘도 잘 부탁해요';
    return `좋은 아침! 오늘 ${eunNeun(regionName(game().weatherRegion))} ${SKY_AND[w.sky]} ${w.temp}도래요`;
  }
  const nx = nextEvent();
  return nx ? `어서 와! ${spokenTime(hmToMin(nx.start))}에 ${nx.title} 있어요` : '어서 와! 오늘은 남은 일정이 없어요';
}

const activeName = () => CH[game().active].name;

// ---------- pet & care ----------
export function greet() {
  const g = game();
  if (g.trip) return;
  if (currentTod() === 'night') {
    setUI({ tempPose: null });
    say(NIGHT_HELLO);
    return;
  }
  if (g.outfit === 'none') tempPose('wave', 2600);
  else bounce('hop');
  say(helloLine());
}

function welcome() {
  setUI({ sad: false, tempPose: game().outfit === 'none' ? 'happy' : null });
  bounce('hop');
  hearts(4);
  say('기다렸어요! 걱정 마요, 다 그대로예요');
  later(() => setUI({ tempPose: null }), 2200);
}

let patN = 0;
export function petTap() {
  const g = game();
  if (g.trip) return;
  if (ui().sad) {
    welcome();
    return;
  }
  if (currentTod() === 'night') {
    bounce('squish');
    say(NIGHT_PAT_LINES[patN++ % NIGHT_PAT_LINES.length]);
    careDone('pat');
    return;
  }
  bounce('hop');
  hearts(3);
  happyFace();
  const lines = CH[g.active].pat ?? PAT_LINES;
  say(lines[patN++ % lines.length]);
  addBond(2);
  careDone('pat');
}

export function addBond(n: number) {
  const g = game();
  let bond = g.bond + n;
  let lv = g.lv;
  if (bond >= 100) {
    bond -= 100;
    lv += 1;
    toast(`친밀도 Lv.${lv}가 됐어요`);
    CHAR_IDS.forEach((k) => {
      const c = CH[k];
      if (c.kind === 'bond' && c.need && lv >= c.need && !g.chars[k]) {
        setTimeout(() => unlockChar(k, `친밀도 Lv.${c.need} 달성`), 1300);
      }
    });
  }
  set({ bond, lv });
}

function careDone(k: CareKey) {
  const g = game();
  if (g.care[k]) return;
  const care = { ...g.care, [k]: true as const };
  set({ care });
  if (CARE_KEYS.every((x) => care[x])) {
    setTimeout(() => {
      toast('오늘의 돌봄 완료 · 친밀도가 올랐어요');
      addBond(10);
      if (!game().trip) say('오늘도 고마워요! 내일 또 와요');
    }, 1000);
  }
}

export function care(k: CareKey) {
  if (game().trip) {
    toast('여행 중이에요. 돌아오면 함께해요');
    return;
  }
  scrollHomeTop();
  if (k === 'hi') {
    if (ui().sad) welcome();
    else greet();
    careDone('hi');
  } else if (k === 'pat') {
    petTap();
  } else {
    if (ui().sad) welcome();
    else {
      bounce('hop');
      happyFace();
      say(currentTod() === 'night' ? '야식이다… 냠' : '냠냠, 맛있어요!');
    }
    careDone('feed');
  }
}

export function bondInfo() {
  const g = game();
  toast(`친밀도 Lv.${g.lv} · 다음 단계까지 ${100 - g.bond}%`);
}

export function infoTap(kind: 'weather' | 'dust' | 'rain' | 'sched', title?: string) {
  const w = ui().weather;
  let line = '';
  if (kind === 'weather') {
    line = !w
      ? '날씨를 불러오고 있어요'
      : currentTod() === 'night'
        ? `내일 아침은 ${w.min}도래요. 따뜻하게 입어요`
        : `${w.pop < 30 ? '오늘은 우산 안 챙겨도 돼요' : '오늘은 우산 챙겨요'}. ${w.max - w.min >= 8 ? '저녁엔 쌀쌀하니 겉옷 챙겨요' : '하루 종일 비슷한 날씨예요'}`;
  } else if (kind === 'dust') {
    line = w?.dust ? DUST_LABEL[w.dust].line : '미세먼지 소식은 곧 알려 줄게요';
  } else if (kind === 'rain') {
    line = w ? rainLine(w.pop) : '날씨를 불러오고 있어요';
  } else {
    line = `"${title ?? ''}" 잊지 마요! 제가 기억할게요`;
  }
  if (game().trip) toast(`${iGa(activeName())} 여행 중이에요`);
  else if (!ui().sad) {
    say(line);
    bounce('hop');
  }
  scrollHomeTop();
}

// ---------- friends ----------
export function unlockChar(k: CharId, why: string, mode: 'unlock' | 'buy' = 'unlock') {
  const g = game();
  if (g.chars[k]) return;
  set({ chars: { ...g.chars, [k]: true }, friendNew: true });
  setUI({ newFriend: { ch: k, why, mode } });
}

export function switchChar(k: CharId) {
  if (game().trip) {
    toast('여행 중에는 친구를 바꿀 수 없어요');
    return false;
  }
  set({ active: k });
  setUI({ sad: false, tempPose: null });
  bounce('hop');
  hearts(4);
  say(k === 'dog' ? '다시 같이 놀아요!' : `안녕하세요! 오늘부터 ${CH[k].name}도 함께해요`);
  return true;
}

/** "함께하기" from the friends tab or the new-friend screen: switch and go home. */
export function switchCharAndGoHome(k: CharId) {
  if (switchChar(k)) {
    router.navigate('/');
    scrollHomeTop();
  }
}

export const penguinDaysLeft = () => {
  const until = CH.penguin.until!;
  return daysBetween(dayKey(nowMs()), until);
};

// ---------- travel ----------
export function openTravel() {
  const g = game();
  if (g.trip || g.arrived) return;
  g.setPick({ wear: g.owned[g.outfit] && g.outfit !== 'none' ? g.outfit : 'beret' });
  setUI({ sheet: 'travel' });
}

export function send() {
  const g = game();
  if (g.trip) return;
  const d = durOf(g.pick.dur);
  const start = nowMs();
  const trip = { c: g.pick.city, o: g.pick.wear, d: d.k, ch: g.active, startedAt: start, endsAt: start + d.hours * 3_600_000 };
  set({ trip, tickets: Math.max(0, g.tickets - 1) });
  setUI({ sheet: null, depart: trip, bubble: { text: null, key: ui().bubble.key + 1 }, tempPose: null });
  router.navigate('/');
  setTimeout(() => {
    setUI({ depart: null });
    scrollHomeTop();
  }, 3600);
}

/** Trip → arrived. `quiet` skips the pet's line (used during check-in). */
export function arrive(quiet = false) {
  const g = game();
  const t = g.trip;
  if (!t) return;
  set({ trip: null, arrived: { ...t, reward: durOf(t.d).reward, doubled: false } });
  pushBanner(`${CITIES[t.c].name}에서 엽서가 도착했어요`);
  if (!quiet) {
    say('다녀왔어요! 엽서 가져왔어요');
    bounce('hop');
  }
}

export function openMail() {
  if (!game().arrived) return;
  setUI({ push: null, sheet: null, mailOpen: true });
}

export async function doubleReward() {
  const a = game().arrived;
  if (!a || a.doubled) return;
  const ok = await rewardedAds.show();
  const cur = game().arrived;
  if (ok && cur && !cur.doubled) set({ arrived: { ...cur, reward: cur.reward * 2, doubled: true } });
}

export function keep() {
  const g = game();
  const t = g.arrived;
  if (!t) return;
  const card = { c: t.c, o: t.o, ch: t.ch };
  const isNew = !g.cards.some((x) => cardKey(x) === cardKey(card));
  const cards = isNew ? [...g.cards, card] : g.cards;
  set({ cards, newCard: isNew ? card : g.newCard, coins: g.coins + t.reward, arrived: null });
  setUI({ mailOpen: false });
  const fox = CH.fox;
  if (fox.need && cards.length >= fox.need && !g.chars.fox) setTimeout(() => unlockChar('fox', '엽서 6종 모으기 달성'), 1600);
  toast(`엽서함에 넣었어요 · 조개 +${t.reward}`);
  say(isNew ? '엽서 마음에 들어요? 다음엔 다른 옷 입고 갈래요' : '또 가도 좋았어요!');
  bounce('hop');
}

// ---------- wardrobe ----------
export function buyOutfit(o: OutfitId) {
  const g = game();
  const it = OUTFITS[o];
  if (g.coins < it.price) {
    toast(`조개가 ${it.price - g.coins}개 모자라요. 여행 엽서로 모아요`);
    return;
  }
  set({ coins: g.coins - it.price, owned: { ...g.owned, [o]: true } });
  toast(`${eulReul(it.name)} 샀어요`);
}

export function wearOutfit(o: OutfitId) {
  if (game().trip) {
    toast('여행 중에는 옷을 갈아입힐 수 없어요');
    return;
  }
  set({ outfit: o });
  setUI({ tempPose: null });
  toast(`${OUTFITS[o].name} 입었어요`);
}

// ---------- session ----------
/**
 * Runs on launch, on returning to the foreground, and after the dev "days away" simulation.
 * Resets daily care, grants the weekly ticket, lands finished trips, and picks the greeting
 * (sad after 2+ days away: missing you, but nothing is lost).
 */
export function checkIn(kind: 'launch' | 'resume' | 'sim') {
  const g = game();
  const t = nowMs();
  const today = dayKey(t);
  const gap = g.lastSeenDay ? daysBetween(g.lastSeenDay, today) : 0;
  const patch: Partial<GameData> = { lastSeenDay: today };
  if (g.careDay !== today) {
    patch.care = {};
    patch.careDay = today;
  }
  const wk = weekKey(t);
  if (wk !== g.ticketWeek) {
    patch.ticketWeek = wk;
    patch.tickets = Math.max(g.tickets, 1);
  }
  set(patch);
  if (g.trip && t >= g.trip.endsAt) arrive(true);
  if (kind === 'resume' && gap < 1) return;
  if (gap >= 2) {
    setUI({ sad: true, tempPose: null });
    say(gap >= 4 ? '…창가에서 계속 기다렸어요' : '…보고 싶었어요');
  } else {
    setUI({ sad: false });
    greet();
  }
}

/** Polled while the app is open: lands the trip when its time is up. */
export function tickTrip() {
  const tr = game().trip;
  if (tr && nowMs() >= tr.endsAt) arrive();
}

// ---------- dev menu ----------
export function devSetTod(tod: Tod | null) {
  game().setDev({ todOverride: tod });
  setUI({ sad: false, tempPose: null });
  scrollHomeTop();
  greet();
}

export function devAway(days: number) {
  const g = game();
  g.setDev({ dayOffset: g.dev.dayOffset + days, todOverride: 'morning' });
  setUI({ sheet: null, mailOpen: false, sad: false, tempPose: null });
  router.navigate('/');
  scrollHomeTop();
  checkIn('sim');
  // What the lock screen would have shown (see prototype): no push on day 1, one on day 2, one more on day 4.
  if (days >= 4) pushBanner('창가에서 기다리고 있어요');
  else if (days >= 2) pushBanner('보고 싶어요. 오늘 날씨 알려 줄게요');
  else if (!game().arrived) toast('하루만 비운 날에는 알림을 보내지 않아요');
}

export function devReset() {
  useGame.getState().reset();
  setUI({ sheet: null, mailOpen: false, adOpen: false, storeFor: null, newFriend: null, depart: null, sad: false, tempPose: null, push: null });
  router.navigate('/');
  scrollHomeTop();
  game().set({ lastSeenDay: dayKey(nowMs()) });
  toast('처음 상태로 돌아왔어요');
  setTimeout(greet, 300);
}

export function devAddTicket() {
  const g = game();
  set({ tickets: g.tickets + 1 });
  toast('여행 티켓을 1장 받았어요');
}
