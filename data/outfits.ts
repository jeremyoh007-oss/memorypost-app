export type OutfitId = 'none' | 'straw' | 'beret' | 'beanie';

export type Outfit = {
  name: string;
  /** Price in 조개 (in-game shells). 0 = owned from the start. */
  price: number;
  /** Phrase used on the postcard caption, e.g. "밀짚모자 쓰고". */
  word: string;
};

export const OUTFITS: Record<OutfitId, Outfit> = {
  none: { name: '기본', price: 0, word: '' },
  straw: { name: '밀짚모자', price: 0, word: '밀짚모자 쓰고' },
  beret: { name: '베레모', price: 0, word: '베레모 쓰고' },
  beanie: { name: '털모자', price: 220, word: '털모자 쓰고' },
};

export const OUTFIT_IDS = Object.keys(OUTFITS) as OutfitId[];
