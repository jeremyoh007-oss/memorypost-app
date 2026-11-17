export type OutfitId = 'none' | 'straw' | 'beret' | 'beanie';

export type Outfit = {
  name: string;
  /** 친밀도 level that unlocks it (1 = from the start). No in-game currency. */
  lv: number;
  /** Phrase used on the postcard caption, e.g. "밀짚모자 쓰고". */
  word: string;
};

export const OUTFITS: Record<OutfitId, Outfit> = {
  none: { name: '기본', lv: 1, word: '' },
  straw: { name: '밀짚모자', lv: 1, word: '밀짚모자 쓰고' },
  beret: { name: '베레모', lv: 1, word: '베레모 쓰고' },
  beanie: { name: '털모자', lv: 3, word: '털모자 쓰고' },
};

export const OUTFIT_IDS = Object.keys(OUTFITS) as OutfitId[];

/** Wearable when it was owned before (old saves) or the 친밀도 level has reached it. */
export const hasOutfit = (owned: Partial<Record<OutfitId, true>>, lv: number, o: OutfitId) => !!owned[o] || lv >= OUTFITS[o].lv;
