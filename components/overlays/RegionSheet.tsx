import { Pressable, StyleSheet, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { Txt } from '@/components/Txt';
import { REGIONS } from '@/data/regions';
import { useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { C } from '@/theme/tokens';

/** Pick one of the 17 시·도 for weather. No GPS or location permission. */
export function RegionSheet() {
  const visible = useUI((s) => s.sheet === 'region');
  const region = useGame((s) => s.weatherRegion);
  const set = useGame((s) => s.set);
  return (
    <Sheet visible={visible} onClose={() => setUI({ sheet: null })} title="지역 고르기" sub="위치 권한 없이, 고른 지역의 날씨만 보여 드려요.">
      <View style={s.grid}>
        {REGIONS.map((r) => {
          const on = r.id === region;
          return (
            <Pressable
              key={r.id}
              onPress={() => {
                set({ weatherRegion: r.id });
                setUI({ sheet: null, weather: null });
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={r.full}
              style={[s.chip, on && s.on]}
            >
              <Txt w={600} size={14} color={on ? '#fff' : C.ink} center>
                {r.name}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { width: '31.6%', backgroundColor: C.card, borderRadius: 14, paddingVertical: 11, borderWidth: 1, borderColor: C.line },
  on: { backgroundColor: C.ink, borderColor: C.ink },
});
