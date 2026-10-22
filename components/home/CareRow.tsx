import { Pressable, StyleSheet, View } from 'react-native';

import { IconBowl, IconCheckBadge, IconHand, IconHeartLine } from '@/components/Icons';
import { Txt } from '@/components/Txt';
import { care } from '@/store/actions';
import { useGame, type CareKey } from '@/store/game';
import { C, cardShadow } from '@/theme/tokens';

const ITEMS: { k: CareKey; label: string; Icon: typeof IconHand }[] = [
  { k: 'hi', label: '인사하기', Icon: IconHand },
  { k: 'pat', label: '쓰다듬기', Icon: IconHeartLine },
  { k: 'feed', label: '밥 주기', Icon: IconBowl },
];

/** 오늘의 돌봄: three daily actions. */
export function CareRow() {
  const done = useGame((s) => s.care);
  return (
    <View style={s.row}>
      {ITEMS.map(({ k, label, Icon }) => {
        const d = !!done[k];
        const color = d ? C.accent : C.ink;
        return (
          <Pressable key={k} onPress={() => care(k)} accessibilityRole="button" accessibilityState={{ checked: d }} style={({ pressed }) => [s.btn, d && s.done, pressed && { opacity: 0.85 }]}>
            <Icon size={26} color={color} />
            <Txt w={500} size={12.5} color={color} lh={1.3}>
              {label}
            </Txt>
            {d && (
              <View style={s.check}>
                <IconCheckBadge />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, backgroundColor: C.card, borderRadius: 16, paddingTop: 10, paddingBottom: 9, alignItems: 'center', gap: 4, ...cardShadow },
  done: { backgroundColor: C.accentSoft },
  check: { position: 'absolute', top: 7, right: 8 },
});
