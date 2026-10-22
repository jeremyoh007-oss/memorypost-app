import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CharId } from '@/data/characters';
import type { CityId, DurId, TravelRegion } from '@/data/cities';
import type { OutfitId } from '@/data/outfits';
import type { RegionId } from '@/data/regions';
import type { Tod } from '@/data/tod';
import { addDays, dayKey, weekKey } from '@/lib/time';

export type CareKey = 'hi' | 'pat' | 'feed';
export const CARE_KEYS: CareKey[] = ['hi', 'pat', 'feed'];

/** A postcard: city × outfit × character. */
export type Card = { c: CityId; o: OutfitId; ch: CharId };
export type Trip = Card & { d: DurId; startedAt: number; endsAt: number };
export type Arrived = Trip & { reward: number; doubled: boolean };

export const cardKey = (x: Card) => `${x.c}|${x.ch}|${x.o}`;

export type DevState = {
  /** Forces time of day; null = follow the clock. */
  todOverride: Tod | null;
  /** Simulated days added to the clock. */
  dayOffset: number;
  /** Show the prototype's sample schedule instead of the device calendar. */
  sampleSchedule: boolean;
};

export type GameData = {
  coins: number;
  outfit: OutfitId;
  owned: Partial<Record<OutfitId, true>>;
  bond: number;
  lv: number;
  chars: Partial<Record<CharId, true>>;
  active: CharId;
  startedDay: string;
  care: Partial<Record<CareKey, true>>;
  careDay: string;
  tickets: number;
  ticketWeek: string;
  trip: Trip | null;
  arrived: Arrived | null;
  cards: Card[];
  newCard: Card | null;
  friendNew: boolean;
  pick: { region: TravelRegion; city: CityId; dur: DurId; wear: OutfitId };
  weatherRegion: RegionId;
  lastSeenDay: string | null;
  dev: DevState;
};

type GameStore = GameData & {
  set: (patch: Partial<GameData> | ((s: GameData) => Partial<GameData>)) => void;
  setPick: (patch: Partial<GameData['pick']>) => void;
  setDev: (patch: Partial<DevState>) => void;
  reset: () => void;
};

/**
 * Demo seed, identical to the prototype's starting state (Lv.4, 84%, 23 days together, 2 postcards, 1 ticket).
 * Replace with a fresh-start seed before release.
 */
export const seed = (now = Date.now()): GameData => {
  const today = dayKey(now);
  return {
    coins: 130,
    outfit: 'none',
    owned: { none: true, straw: true, beret: true },
    bond: 84,
    lv: 4,
    chars: { dog: true },
    active: 'dog',
    startedDay: addDays(today, -22),
    care: {},
    careDay: today,
    tickets: 1,
    ticketWeek: weekKey(now),
    trip: null,
    arrived: null,
    cards: [
      { c: 'busan', o: 'straw', ch: 'dog' },
      { c: 'paris', o: 'beret', ch: 'dog' },
    ],
    newCard: null,
    friendNew: false,
    pick: { region: '국내', city: 'busan', dur: '3h', wear: 'beret' },
    weatherRegion: 'seoul',
    lastSeenDay: null,
    dev: { todOverride: null, dayOffset: 0, sampleSchedule: false },
  };
};

export const useGame = create<GameStore>()(
  persist(
    (set) => ({
      ...seed(),
      set: (patch) => set((s) => (typeof patch === 'function' ? patch(s) : patch)),
      setPick: (patch) => set((s) => ({ pick: { ...s.pick, ...patch } })),
      setDev: (patch) => set((s) => ({ dev: { ...s.dev, ...patch } })),
      reset: () => set(seed()),
    }),
    {
      name: 'memorypost-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ set: _s, setPick: _p, setDev: _d, reset: _r, ...data }) => data,
    },
  ),
);

export const game = () => useGame.getState();
