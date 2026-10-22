import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Txt } from '@/components/Txt';
import { C } from '@/theme/tokens';

/** "친밀도" pill with a progress ring showing the level. */
export function BondPill({ lv, bond, days, onPress }: { lv: number; bond: number; days: number; onPress: () => void }) {
  const r = 13.5;
  const len = 2 * Math.PI * r;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`친밀도 Lv.${lv}, ${bond}%`} style={s.pill}>
      <View style={s.ring}>
        <Svg width={30} height={30} viewBox="0 0 30 30" style={StyleSheet.absoluteFill}>
          <Circle cx={15} cy={15} r={r} stroke="#F1E7E2" strokeWidth={3} fill="#fff" />
          <Circle
            cx={15}
            cy={15}
            r={r}
            stroke={C.accent}
            strokeWidth={3}
            fill="none"
            strokeDasharray={`${(len * Math.min(100, bond)) / 100} ${len}`}
            transform="rotate(-90 15 15)"
          />
        </Svg>
        <Txt w={700} size={11} color={C.accent} lh={1.2}>
          {lv}
        </Txt>
      </View>
      <View>
        <Txt w={600} size={12} lh={1.2}>
          친밀도
        </Txt>
        <Txt size={11} color={C.ink2} lh={1.2}>
          함께한 지 {days}일
        </Txt>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 12,
    marginTop: 4,
  },
  ring: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
});
