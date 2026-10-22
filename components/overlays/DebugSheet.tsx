import { DEV_TOOLS } from '@/lib/devFlags';
import { Pressable, StyleSheet, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { Txt } from '@/components/Txt';
import { Step } from '@/components/ui';
import type { Tod } from '@/data/tod';
import { devAddTicket, devAway, devReset, devSetTod, toast } from '@/store/actions';
import { useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { weatherProvider } from '@/services/weather';
import { purchases } from '@/services/purchases';
import { C } from '@/theme/tokens';

/** Dev-only menu (long-press the date on Home). Not rendered in release builds. */
export function DebugSheet() {
  const visible = useUI((s) => s.sheet === 'debug');
  const dev = useGame((s) => s.dev);
  const setDev = useGame((s) => s.setDev);
  const set = useGame((s) => s.set);
  if (!DEV_TOOLS) return null;
  const close = () => setUI({ sheet: null });
  const tods: [Tod | null, string][] = [
    [null, '자동'],
    ['morning', '아침'],
    ['day', '오후'],
    ['night', '밤'],
  ];
  return (
    <Sheet visible={visible} onClose={close} title="개발자 메뉴" sub="테스트용이에요. 출시 빌드에는 보이지 않아요.">
      <Step>시간대</Step>
      <View style={s.row}>
        {tods.map(([t, label]) => (
          <Chip
            key={label}
            label={label}
            on={dev.todOverride === t}
            onPress={() => {
              devSetTod(t);
              close();
            }}
          />
        ))}
      </View>
      <Step>며칠 비웠다가 돌아오기</Step>
      <View style={s.row}>
        {[1, 2, 4].map((d) => (
          <Chip key={d} label={`${d}일 뒤`} onPress={() => devAway(d)} />
        ))}
      </View>
      <Step>데이터</Step>
      <View style={s.row}>
        <Chip label={dev.sampleSchedule ? '예시 일정 끄기' : '예시 일정 켜기'} on={dev.sampleSchedule} onPress={() => setDev({ sampleSchedule: !dev.sampleSchedule })} />
        <Chip label="여행 티켓 +1" onPress={devAddTicket} />
        <Chip
          label="조개 +200"
          onPress={() => {
            set((g) => ({ coins: g.coins + 200 }));
            toast('조개 200개를 받았어요');
          }}
        />
      </View>
      <View style={[s.row, { marginTop: 4 }]}>
        <Chip label="처음부터 다시" dashed onPress={devReset} />
      </View>
      <Txt size={11.5} color={C.ink3} style={{ marginTop: 12 }}>
        {`시뮬레이션 +${dev.dayOffset}일 · 날씨: ${weatherProvider.id} · 결제: ${purchases.isMock ? 'mock' : 'store'}`}
      </Txt>
    </Sheet>
  );
}

function Chip({ label, on, dashed, onPress }: { label: string; on?: boolean; dashed?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[s.chip, on && s.on, dashed && { borderStyle: 'dashed', borderColor: C.ink3 }]}>
      <Txt w={500} size={13.5} color={on ? '#fff' : dashed ? C.ink2 : C.ink}>
        {label}
      </Txt>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 7, paddingHorizontal: 13 },
  on: { backgroundColor: C.ink, borderColor: C.ink },
});
