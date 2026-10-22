import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { OutfitOption } from '@/components/OutfitOption';
import { Sheet } from '@/components/Sheet';
import { Txt } from '@/components/Txt';
import { Btn, Step } from '@/components/ui';
import { CITIES, CITY_IDS, DURS, type TravelRegion } from '@/data/cities';
import { IMAGES } from '@/data/images';
import { OUTFITS, OUTFIT_IDS } from '@/data/outfits';
import { euro } from '@/lib/korean';
import { outfitImage } from '@/lib/pet';
import { send } from '@/store/actions';
import { useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { C } from '@/theme/tokens';

/** 여행 보내기: outfit → 국내/해외 city → 1/3/8시간. */
export function TravelSheet() {
  const visible = useUI((s) => s.sheet === 'travel');
  const g = useGame();
  const { pick } = g;
  const list = CITY_IDS.filter((k) => CITIES[k].region === pick.region);
  const city = list.includes(pick.city) ? pick.city : list[0];
  const setRegion = (r: TravelRegion) => {
    const first = CITY_IDS.find((k) => CITIES[k].region === r)!;
    g.setPick({ region: r, city: CITIES[pick.city].region === r ? pick.city : first });
  };

  return (
    <Sheet
      visible={visible}
      tall
      onClose={() => setUI({ sheet: null })}
      title="여행 보내기"
      sub="입힌 옷 그대로 엽서에 담겨 돌아와요. 여행 티켓 1장을 써요."
      footer={<Btn title={`${OUTFITS[pick.wear].name} 차림으로 ${euro(CITIES[city].name)} 보내기`} onPress={send} />}
    >
      <Step>1. 옷 고르기</Step>
      <View style={s.wear}>
        {OUTFIT_IDS.filter((o) => g.owned[o]).map((o) => (
          <OutfitOption key={o} img={outfitImage(g.active, o)} name={OUTFITS[o].name} status="보유" selected={pick.wear === o} onPress={() => g.setPick({ wear: o })} />
        ))}
        {Array.from({ length: Math.max(0, 4 - OUTFIT_IDS.filter((o) => g.owned[o]).length) }).map((_, i) => (
          <View key={`sp${i}`} style={{ flex: 1 }} />
        ))}
      </View>

      <Step>2. 어디로 갈까요</Step>
      <View style={s.seg}>
        {(['국내', '해외'] as const).map((r) => (
          <Pressable key={r} onPress={() => setRegion(r)} style={[s.segBtn, pick.region === r && s.segOn]} accessibilityRole="tab" accessibilityState={{ selected: pick.region === r }}>
            <Txt w={600} size={13.5} color={pick.region === r ? C.ink : C.ink2} center>
              {r}
            </Txt>
          </Pressable>
        ))}
      </View>
      <View style={s.cities}>
        {list.map((k) => {
          const c = CITIES[k];
          const sel = city === k;
          return (
            <Pressable key={k} onPress={() => g.setPick({ city: k })} style={[s.city, sel && s.citySel]} accessibilityRole="button" accessibilityState={{ selected: sel }}>
              <View style={[s.cityIm, sel && { borderTopLeftRadius: 14, borderTopRightRadius: 14 }]}>
                <Image source={IMAGES[c.bg]} style={StyleSheet.absoluteFill} contentFit="cover" />
              </View>
              <View style={s.cityNm}>
                <Txt w={700} size={14} lh={1.3}>
                  {c.name}
                </Txt>
                <Txt size={11.5} color={C.ink2} lh={1.3}>
                  {c.sub}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Step>3. 얼마나 다녀올까요</Step>
      <View style={s.durs}>
        {DURS.map((d) => {
          const sel = pick.dur === d.k;
          return (
            <Pressable key={d.k} onPress={() => g.setPick({ dur: d.k })} style={[s.dur, sel && s.durSel]} accessibilityRole="button" accessibilityState={{ selected: sel }}>
              <Txt w={600} size={14} lh={1.3} center>
                {d.label}
              </Txt>
              <Txt size={11} color={C.ink2} lh={1.3} center>
                {d.sub}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const s = StyleSheet.create({
  wear: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  seg: { flexDirection: 'row', backgroundColor: C.segBg, borderRadius: 12, padding: 3, marginBottom: 10 },
  segBtn: { flex: 1, borderRadius: 10, paddingVertical: 6 },
  segOn: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  cities: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  city: { flex: 1, backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  citySel: { borderWidth: 2, borderColor: C.ink },
  cityIm: { aspectRatio: 16 / 10, overflow: 'hidden' },
  cityNm: { paddingTop: 7, paddingHorizontal: 10, paddingBottom: 9 },
  durs: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dur: { flex: 1, backgroundColor: C.card, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 4, borderWidth: 1, borderColor: C.line },
  durSel: { borderWidth: 2, borderColor: C.ink, paddingVertical: 9 },
});
