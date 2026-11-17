import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { C } from '@/theme/tokens';

/** 친밀도: "Lv.4" and "함께한 지 23일" over a thin progress line. */
export function BondPill({ lv, bond, days, night, onPress }: { lv: number; bond: number; days: number; night?: boolean; onPress: () => void }) {
  const ink = night ? '#fff' : C.ink;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`친밀도 Lv.${lv}, ${bond}%`} style={s.wrap} hitSlop={8}>
      <Txt w={700} size={15} lh={1.2} color={ink} style={{ textAlign: 'right' }}>
        친밀도 Lv.{lv}
      </Txt>
      <Txt size={12} lh={1.4} color={night ? 'rgba(255,255,255,0.6)' : C.ink3} style={{ textAlign: 'right' }}>
        함께한 지 {days}일
      </Txt>
      <View style={[s.track, night && { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
        <View style={[s.fill, { width: `${Math.min(100, bond)}%`, backgroundColor: ink }]} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'flex-end', marginTop: 6, width: 104 },
  track: { width: '100%', height: 2, borderRadius: 1, backgroundColor: C.track, marginTop: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 1 },
});
