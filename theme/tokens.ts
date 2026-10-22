/** Design tokens ported from the prototype's CSS custom properties (--a-*). The app is light-only. */
export const C = {
  bg: '#F7F5F1',
  card: '#FFFFFF',
  ink: '#1C1A17',
  ink2: '#77706A',
  ink3: '#A39C94',
  line: '#ECE8E1',
  accent: '#D9654B',
  accentSoft: '#FBEDE8',
  blue: '#4A74D0',
  green: '#3E9466',
  segBg: '#ECE8E1',
  track: '#E6E1D9',
  grab: '#D9D3CA',
  tabBar: 'rgba(250,249,246,0.86)',
  letterInk: '#3C342C',
  letterLine: '#E2D8C8',
  paper: '#FFFDF8',
  paperBack: '#FBF7EF',
} as const;

export const F = {
  light: 'NotoSansKR_300Light',
  regular: 'NotoSansKR_400Regular',
  medium: 'NotoSansKR_500Medium',
  semibold: 'NotoSansKR_600SemiBold',
  bold: 'NotoSansKR_700Bold',
  letter: 'GowunBatang_400Regular',
  letterBold: 'GowunBatang_700Bold',
} as const;

export type Weight = 300 | 400 | 500 | 600 | 700;

export const fontFor = (w: Weight): string =>
  w === 300 ? F.light : w === 500 ? F.medium : w === 600 ? F.semibold : w === 700 ? F.bold : F.regular;

/** Soft card shadow: `0 1px 2px rgba(40,30,20,.05)`. */
export const cardShadow = {
  shadowColor: '#28201A',
  shadowOpacity: 0.05,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
} as const;

export const R = { card: 20, sheet: 28, panel: 26, opt: 16 } as const;
