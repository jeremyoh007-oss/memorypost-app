import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { C, fontFor, type Weight } from '@/theme/tokens';

type Props = TextProps & {
  w?: Weight;
  size?: number;
  color?: string;
  /** Line height as a multiple of size (CSS-like). */
  lh?: number;
  /** Letter spacing in em (CSS-like). Defaults to -0.01em. */
  ls?: number;
  center?: boolean;
  tabular?: boolean;
};

/** Text in Noto Sans KR with CSS-like sizing (the prototype's typography). */
export function Txt({ w = 400, size = 15, color = C.ink, lh = 1.45, ls = -0.01, center, tabular, style, ...rest }: Props) {
  const base: TextStyle = {
    fontFamily: fontFor(w),
    fontSize: size,
    lineHeight: Math.round(size * lh),
    letterSpacing: size * ls,
    color,
    textAlign: center ? 'center' : undefined,
    fontVariant: tabular ? ['tabular-nums'] : undefined,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
    // Korean word wrapping (CSS word-break: keep-all) on web.
    ...(Platform.OS === 'web' ? ({ wordBreak: 'keep-all' } as TextStyle) : null),
  };
  return <Text lineBreakStrategyIOS="hangul-word" {...rest} style={[base, style]} />;
}
