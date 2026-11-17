import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OutfitOption } from '@/components/OutfitOption';
import { ScreenShell } from '@/components/ScreenShell';
import { Btn } from '@/components/ui';
import { CHAR_ASPECT, IMAGES } from '@/data/images';
import { hasOutfit, OUTFITS, OUTFIT_IDS, type OutfitId } from '@/data/outfits';
import { eulReul } from '@/lib/korean';
import { outfitImage } from '@/lib/pet';
import { wearOutfit } from '@/store/actions';
import { useGame } from '@/store/game';
import { C } from '@/theme/tokens';

export default function Wardrobe() {
  const g = useGame();
  const [sel, setSel] = useState<OutfitId>(g.outfit);

  useFocusEffect(
    useCallback(() => {
      setSel(useGame.getState().outfit);
    }, []),
  );

  const owned = hasOutfit(g.owned, g.lv, sel);
  const it = OUTFITS[sel];
  let action: { title: string; onPress?: () => void; disabled?: boolean };
  if (g.trip) action = { title: '여행 중에는 갈아입힐 수 없어요', disabled: true };
  else if (!owned) action = { title: `친밀도 Lv.${it.lv}이 되면 입을 수 있어요`, disabled: true };
  else if (g.outfit === sel) action = { title: '지금 입고 있어요', disabled: true };
  else action = { title: `${it.name} 입히기`, onPress: () => wearOutfit(sel) };

  return (
    <ScreenShell
      title="옷장"
      sub="고른 옷은 홈과 여행 엽서에 그대로 보여요."
      footer={<Btn title={action.title} onPress={action.onPress} disabled={action.disabled} />}
    >
      <View style={s.prev}>
        <Image source={IMAGES[outfitImage(g.active, sel)]} style={s.prevImg} contentFit="contain" transition={0} accessibilityLabel={`${eulReul(OUTFITS[sel].name)} 입은 미리보기`} />
      </View>
      <View style={s.row}>
        {OUTFIT_IDS.map((o) => {
          const own = hasOutfit(g.owned, g.lv, o);
          return (
            <OutfitOption
              key={o}
              img={outfitImage(g.active, o)}
              name={OUTFITS[o].name}
              selected={sel === o}
              dim={!own}
              status={own ? (g.outfit === o ? '입는 중' : '보유') : undefined}
              lock={own ? undefined : `Lv.${OUTFITS[o].lv}`}
              onPress={() => setSel(o)}
            />
          );
        })}
      </View>
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  prev: { height: 210, borderRadius: 22, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 14, backgroundColor: C.card },
  prevImg: { height: '94%', aspectRatio: CHAR_ASPECT },
  row: { flexDirection: 'row', gap: 8, marginBottom: 18 },
});
