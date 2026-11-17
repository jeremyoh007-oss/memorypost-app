import { Platform } from 'react-native';

/**
 * Design tokens — "단정한 흰 화면" (2026-11 redesign): white page, quiet gray surfaces without shadows,
 * ink as the only accent. Colour comes from the pet and the postcards, not from the UI. Light-only.
 */
export const C = {
  bg: '#FFFFFF',
  card: '#F5F5F3',
  ink: '#141414',
  ink2: '#6E6E6B',
  ink3: '#A3A3A0',
  line: '#EBEBE8',
  accent: '#141414',
  accentSoft: '#EBEBE8',
  /** Night sky behind the sleeping pet. */
  night: '#111216',
  blue: '#4A74D0',
  green: '#3E9466',
  segBg: '#EFEFED',
  track: '#EBEBE8',
  grab: '#DADAD7',
  tabBar: 'rgba(255,255,255,0.9)',
  letterInk: '#3C342C',
  letterLine: '#E2D8C8',
  paper: '#FFFDF8',
  paperBack: '#FBF7EF',
} as const;

const WEB = Platform.OS === 'web';

/**
 * Font families. On device: one bundled file per weight (lib/fonts.ts). On web: Pretendard (variable,
 * subset by glyph range) and Gowun Batang from public/index.html, with the weight set by `Txt` (fontWeight).
 */
const SANS_WEB = "'Pretendard Variable', Pretendard, 'Noto Sans KR', sans-serif";
export const F = {
  light: WEB ? SANS_WEB : 'NotoSansKR_300Light',
  regular: WEB ? SANS_WEB : 'NotoSansKR_400Regular',
  medium: WEB ? SANS_WEB : 'NotoSansKR_500Medium',
  semibold: WEB ? SANS_WEB : 'NotoSansKR_600SemiBold',
  bold: WEB ? SANS_WEB : 'NotoSansKR_700Bold',
  letter: WEB ? 'Gowun Batang' : 'GowunBatang_400Regular',
  letterBold: WEB ? 'Gowun Batang' : 'GowunBatang_700Bold',
} as const;

export type Weight = 300 | 400 | 500 | 600 | 700;

export const fontFor = (w: Weight): string =>
  w === 300 ? F.light : w === 500 ? F.medium : w === 600 ? F.semibold : w === 700 ? F.bold : F.regular;

/** Cards sit flat on the page (gray surface, no shadow) in the white design. */
export const cardShadow = {} as const;

export const R = { card: 20, sheet: 28, panel: 26, opt: 16 } as const;
