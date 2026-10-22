import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Scene } from '@/components/Scene';
import { ScreenShell } from '@/components/ScreenShell';
import { Txt } from '@/components/Txt';
import { Step } from '@/components/ui';
import { CH } from '@/data/characters';
import { CITIES, CITY_IDS } from '@/data/cities';
import { OUTFITS, OUTFIT_IDS } from '@/data/outfits';
import { outfitImage } from '@/lib/pet';
import { cardKey, useGame, type Card } from '@/store/game';
import { C } from '@/theme/tokens';

export default function Album() {
  const cards = useGame((s) => s.cards);
  const newCard = useGame((s) => s.newCard);
  const newKey = newCard ? cardKey(newCard) : null;
  const colW = (useWindowDimensions().width - 36 - 12) / 2;

  // The "new" highlight stays while the tab is open; the tab dot clears when leaving.
  useFocusEffect(
    useCallback(
      () => () => {
        if (useGame.getState().newCard) useGame.getState().set({ newCard: null });
      },
      [],
    ),
  );

  const slots = CITY_IDS.flatMap((c) => OUTFIT_IDS.map((o) => ({ c, o, ch: 'dog' as const })));
  const got = (x: Card) => cards.some((y) => cardKey(y) === cardKey(x));
  const n = slots.filter(got).length;
  const friends = cards.filter((x) => x.ch !== 'dog');

  const header = (
    <View style={s.prog}>
      <View style={s.track}>
        <View style={[s.fill, { width: `${(n / slots.length) * 100}%` }]} />
      </View>
      <Txt w={600} size={13} tabular>
        {n} / {slots.length}
      </Txt>
    </View>
  );

  return (
    <ScreenShell title="엽서함" sub="도시와 옷의 조합마다 다른 엽서가 와요." header={header}>
      <View style={s.grid}>
        {slots.map((x) => {
          const has = got(x);
          return (
            <Slot
              key={cardKey(x)}
              card={x}
              w={colW}
              locked={!has}
              isNew={newKey === cardKey(x)}
              right={has ? OUTFITS[x.o].name : `${OUTFITS[x.o].name} · 아직`}
            />
          );
        })}
      </View>
      {friends.length > 0 && (
        <>
          <Step style={{ marginTop: 18 }}>{`친구들이 보낸 엽서 · ${friends.length}장`}</Step>
          <View style={s.grid}>
            {friends.map((x) => (
              <Slot key={cardKey(x)} card={x} w={colW} isNew={newKey === cardKey(x)} right={`${CH[x.ch].name}${x.o !== 'none' ? ` · ${OUTFITS[x.o].name}` : ''}`} />
            ))}
          </View>
        </>
      )}
    </ScreenShell>
  );
}

function Slot({ card, w, locked, isNew, right }: { card: Card; w: number; locked?: boolean; isNew?: boolean; right: string }) {
  return (
    <View style={[s.slot, { width: w }, locked && s.locked, isNew && s.new]}>
      <Scene city={card.c} img={outfitImage(card.ch, card.o)} locked={locked} />
      <View style={s.lbl}>
        <Txt w={600} size={12}>
          {CITIES[card.c].name}
        </Txt>
        <Txt w={500} size={12} color={C.ink2} numberOfLines={1} style={{ flexShrink: 1 }}>
          {right}
        </Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  prog: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  track: { flex: 1, height: 6, borderRadius: 6, backgroundColor: C.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.ink, borderRadius: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  slot: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line },
  locked: { backgroundColor: '#EFECE6', borderColor: '#EFECE6' },
  new: { borderWidth: 2, borderColor: C.accent },
  lbl: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, paddingTop: 6, paddingHorizontal: 9, paddingBottom: 8 },
});
