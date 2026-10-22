/** Small shared building blocks: Card, Btn, Coins pill, section header, screen header. */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { C, cardShadow } from '@/theme/tokens';
import { Coin } from './Icons';
import { Txt } from './Txt';

export function Card({ children, onPress, style, label }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; label?: string }) {
  if (!onPress) return <View style={[s.card, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.card, style, pressed && { opacity: 0.92 }]}>
      {children}
    </Pressable>
  );
}

/** Card label row: "서울 · 날씨" + right-side muted note. */
export function CardLabel({ left, right }: { left: ReactNode; right?: string }) {
  return (
    <View style={s.lab}>
      {typeof left === 'string' ? (
        <Txt w={600} size={12} color={C.ink2}>
          {left}
        </Txt>
      ) : (
        left
      )}
      {right ? (
        <Txt w={500} size={11} color={C.ink3}>
          {right}
        </Txt>
      ) : null}
    </View>
  );
}

type BtnVariant = 'dark' | 'light' | 'white' | 'ghost';
export function Btn({
  title,
  onPress,
  variant = 'dark',
  disabled,
  style,
  small,
}: {
  title: string;
  onPress?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}) {
  const bg = variant === 'dark' ? C.ink : variant === 'white' ? '#fff' : variant === 'ghost' ? 'rgba(255,255,255,0.14)' : '#fff';
  const fg = variant === 'dark' || variant === 'ghost' ? '#fff' : C.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, paddingVertical: small ? 13 : 15 },
        variant === 'light' && { borderWidth: 1, borderColor: C.line },
        disabled && { opacity: 0.55 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <Txt w={700} size={small ? 15 : 16} color={fg} center>
        {title}
      </Txt>
    </Pressable>
  );
}

export function CoinsPill({ value }: { value: number }) {
  return (
    <View style={s.coins}>
      <Coin size={16} />
      <Txt w={600} size={13} tabular>
        {value}
      </Txt>
    </View>
  );
}

export function SectionHead({ title, right }: { title: string; right?: string }) {
  return (
    <View style={s.secH}>
      <Txt w={700} size={15}>
        {title}
      </Txt>
      {right ? (
        <Txt size={12.5} color={C.ink2} tabular>
          {right}
        </Txt>
      ) : null}
    </View>
  );
}

/** Step label inside sheets: "1. 옷 고르기" */
export function Step({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ marginTop: 4, marginBottom: 8 }, style]}>
      <Txt w={700} size={12.5} color={C.ink2}>
        {children}
      </Txt>
    </View>
  );
}

/** Title row used by tab screens and sheets (22px bold, -0.03em). */
export function TitleRow({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={s.titleRow}>
      <Txt w={700} size={22} ls={-0.03} lh={1.3}>
        {title}
      </Txt>
      {right}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, ...cardShadow },
  lab: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  btn: { width: '100%', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  secH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2, marginHorizontal: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
});
