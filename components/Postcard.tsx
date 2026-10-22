import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CH } from '@/data/characters';
import { CITIES } from '@/data/cities';
import { IMAGES } from '@/data/images';
import { iGa } from '@/lib/korean';
import { outfitImage } from '@/lib/pet';
import type { Card } from '@/store/game';
import { C, F } from '@/theme/tokens';
import { Scene } from './Scene';
import { Txt } from './Txt';

/** Letter text for a postcard; for friends, "강아지" in the template becomes their name. */
export const letterFor = (t: Card) => {
  const text = CITIES[t.c].letter[t.o];
  return t.ch === 'dog' ? text : text.replace(/강아지/g, CH[t.ch].name);
};

function Stamp({ card }: { card: Card }) {
  return (
    <View style={s.stamp}>
      <View style={s.stampIn}>
        <Image source={IMAGES[outfitImage(card.ch, card.o)]} style={s.stampImg} contentFit="contain" contentPosition="bottom" />
      </View>
    </View>
  );
}

/** Postcard with front (scene + stamp) and back (letter + address), flipped by `flipped`. */
export function Postcard({ card, flipped }: { card: Card; flipped: boolean }) {
  const rot = useSharedValue(0);
  const rise = useSharedValue(0);
  const [w, setW] = useState(340);

  useEffect(() => {
    rise.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) });
  }, [rise]);
  useEffect(() => {
    rot.value = withTiming(flipped ? 180 : 0, { duration: 700, easing: Easing.bezier(0.3, 0.7, 0.2, 1) });
  }, [flipped, rot]);

  const wrap = useAnimatedStyle(() => ({
    opacity: rise.value,
    transform: [{ translateY: interpolate(rise.value, [0, 1], [w * 0.21, 0]) }, { scale: 0.9 + 0.1 * rise.value }],
  }));
  const front = useAnimatedStyle(() => ({
    opacity: rot.value < 90 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${rot.value}deg` }],
  }));
  const back = useAnimatedStyle(() => ({
    opacity: rot.value >= 90 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${rot.value - 180}deg` }],
  }));

  const city = CITIES[card.c];
  const name = CH[card.ch].name;
  const letterSize = Math.max(12, Math.min(15, w * 0.039));
  const addrSize = Math.max(10.5, Math.min(12.5, w * 0.033));
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  return (
    <Animated.View style={[s.card, wrap]} onLayout={onLayout}>
      <Animated.View style={[s.face, front]} pointerEvents={flipped ? 'none' : 'auto'}>
        <Scene city={card.c} img={outfitImage(card.ch, card.o)} style={{ height: '100%', borderRadius: 2 }} />
        <View style={s.stampFront}>
          <Stamp card={card} />
        </View>
      </Animated.View>
      <Animated.View style={[s.face, s.back, back]} pointerEvents={flipped ? 'auto' : 'none'}>
        <View style={s.letter}>
          <Txt style={{ fontFamily: F.letter, fontSize: letterSize, lineHeight: letterSize * 1.6, color: C.letterInk }}>보고 싶은 주인님께,</Txt>
          <Txt style={{ fontFamily: F.letter, fontSize: letterSize, lineHeight: letterSize * 1.6, color: C.letterInk, marginTop: 6 }}>{letterFor(card)}</Txt>
          <Txt style={{ fontFamily: F.letter, fontSize: letterSize, lineHeight: letterSize * 1.6, color: C.letterInk, marginTop: 'auto', textAlign: 'right' }}>
            — {iGa(name)}
          </Txt>
        </View>
        <View style={s.addr}>
          <View style={{ alignSelf: 'flex-end' }}>
            <Stamp card={card} />
          </View>
          <View style={s.lines}>
            {['우리 집 주인님께', '추억 우체국 1번지', `${city.name}에서 보냄`].map((l) => (
              <Txt key={l} numberOfLines={1} style={[s.line, { fontFamily: F.letter, fontSize: addrSize, lineHeight: addrSize * 1.5 }]}>
                {l}
              </Txt>
            ))}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { width: '100%', aspectRatio: 900 / 640 },
  face: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    borderRadius: 6,
    backgroundColor: C.paper,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
  back: { backgroundColor: C.paperBack, padding: 14, flexDirection: 'row' },
  stampFront: { position: 'absolute', top: '7%', right: '5%' },
  stamp: {
    width: 50,
    height: 62,
    backgroundColor: C.paper,
    padding: 4,
    transform: [{ rotate: '3deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  stampIn: { flex: 1, backgroundColor: '#E9D9C4', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  stampImg: { width: '90%', height: '100%' },
  letter: { width: '60%', paddingRight: 12, borderRightWidth: 1, borderRightColor: C.letterLine, overflow: 'hidden' },
  addr: { flex: 1, paddingLeft: 12, minWidth: 0 },
  lines: { marginTop: 'auto', gap: 7 },
  line: { color: '#5D5248', borderBottomWidth: 1, borderBottomColor: C.letterLine, paddingBottom: 3 },
});
