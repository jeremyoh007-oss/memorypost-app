import type { ImageKey } from './images';

export type CharId = 'dog' | 'cat' | 'fox' | 'lion' | 'penguin';
export type CharKind = 'base' | 'bond' | 'hidden' | 'shop' | 'limited';

export type Character = {
  name: string;
  kind: CharKind;
  /** Badge text on the friends card. */
  tag: string;
  /** Prefix of the image set: `${pre}_happy` etc. Idle image is `idle`. */
  pre: string;
  idle: ImageKey;
  /** bond: level needed. hidden: number of postcards needed. */
  need?: number;
  /** Display price for paid friends; the real price comes from the purchase service. */
  price?: string;
  /** Store product id (see services/purchases.ts). */
  productId?: string;
  /** Limited friends: last sale day (inclusive), ISO date in KST. */
  until?: string;
  untilLabel?: string;
  /** Lines when petted. Dog uses PAT_LINES. */
  pat?: string[];
};

export const CH: Record<CharId, Character> = {
  dog: { name: '강아지', kind: 'base', tag: '기본', pre: 'pet', idle: 'pet_idle' },
  cat: {
    name: '고양이', kind: 'bond', tag: '해금', pre: 'cat', idle: 'char_cat', need: 5,
    pat: ['냐옹, 간지러워요!', '골골골… 기분 좋아요', '꼬리로 인사해요', '조금만 더 쓰다듬어 줘요'],
  },
  fox: {
    name: '여우', kind: 'hidden', tag: '히든', pre: 'fox', idle: 'char_fox', need: 6,
    pat: ['히힛, 들켰다!', '꼬리 만져 볼래요?', '오늘도 놀러 왔어요', '폭신폭신하죠?'],
  },
  lion: {
    name: '사자', kind: 'shop', tag: '판매', pre: 'lion', idle: 'char_lion', price: '4,400원', productId: 'friend_lion',
    pat: ['어흥! 기분 최고예요', '갈기가 멋있죠?', '같이 있으면 용감해져요', '으쓱으쓱!'],
  },
  penguin: {
    name: '펭귄', kind: 'limited', tag: '겨울 한정', pre: 'penguin', idle: 'char_penguin', price: '4,400원',
    productId: 'friend_penguin_winter', until: '2026-11-30', untilLabel: '11월 30일',
    pat: ['뒤뚱뒤뚱, 좋아요!', '목도리 따뜻해요', '파닥파닥!', '눈 오는 데 가고 싶어요'],
  },
};

export const CHAR_IDS = Object.keys(CH) as CharId[];

export const PAT_LINES = ['헤헤, 간지러워요!', '더 쓰다듬어 줘요', '같이 있어서 좋아요', '오늘 기분 최고예요', '꼬리가 저절로 흔들려요'];
export const NIGHT_PAT_LINES = ['음냐… 5분만 더…', 'zzz… 내일 놀아요', '꿈에서 바다 봤어요…'];
