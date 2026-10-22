import { create } from 'zustand';

import type { CharId } from '@/data/characters';
import type { Pose } from '@/lib/pet';
import type { CalendarStatus, CalendarEvent } from '@/services/calendar';
import type { Weather } from '@/services/weather';
import type { Trip } from './game';

export type SheetId = 'travel' | 'region' | 'debug' | null;
export type NewFriend = { ch: CharId; why: string; mode: 'unlock' | 'buy' };

/** Transient (non-persisted) UI state: pet reactions, overlays, loaded info. */
type UIState = {
  bubble: { text: string | null; key: number };
  tempPose: Pose | null;
  bounce: { kind: 'hop' | 'squish'; key: number };
  hearts: { n: number; key: number };
  /** Pet is sad after 2+ days away until greeted/petted. */
  sad: boolean;
  toast: { text: string; key: number } | null;
  push: { text: string; key: number } | null;
  sheet: SheetId;
  depart: Trip | null;
  mailOpen: boolean;
  adOpen: boolean;
  storeFor: CharId | null;
  newFriend: NewFriend | null;
  scrollTopKey: number;

  weather: Weather | null;
  events: CalendarEvent[];
  calStatus: CalendarStatus | 'loading';
};

export const useUI = create<UIState>()(() => ({
  bubble: { text: null, key: 0 },
  tempPose: null,
  bounce: { kind: 'hop', key: 0 },
  hearts: { n: 0, key: 0 },
  sad: false,
  toast: null,
  push: null,
  sheet: null,
  depart: null,
  mailOpen: false,
  adOpen: false,
  storeFor: null,
  newFriend: null,
  scrollTopKey: 0,
  weather: null,
  events: [],
  calStatus: 'loading',
}));

export const ui = () => useUI.getState();
export const setUI = (patch: Partial<UIState>) => useUI.setState(patch);
