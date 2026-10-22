import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Polygon, Rect } from 'react-native-svg';

import { Coin } from '@/components/Icons';
import { Postcard } from '@/components/Postcard';
import { Txt } from '@/components/Txt';
import { Btn } from '@/components/ui';
import { CH } from '@/data/characters';
import { CITIES } from '@/data/cities';
import { OUTFITS } from '@/data/outfits';
import { doubleReward, keep } from '@/store/actions';
import { cardKey, useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { C } from '@/theme/tokens';

/** Arrived mail: tap the envelope → postcard (flip for the letter and places) → keep to album. */
export function MailOverlay() {
  const open = useUI((s) => s.mailOpen);
  const arrived = useGame((s) => s.arrived);
  const cards = useGame((s) => s.cards);
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<'env' | 'opening' | 'card'>('env');
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (open) {
      setStage('env');
      setFlipped(false);
    }
  }, [open]);

  if (!open || !arrived) return null;
  const c = CITIES[arrived.c];
  const o = OUTFITS[arrived.o];
  const h = CH[arrived.ch];
  const dog = arrived.ch === 'dog';
  const have = cards.some((x) => cardKey(x) === cardKey(arrived));
  const cap = `${c.name}에서${dog ? (o.word ? ` · ${o.word}` : '') : ` · ${h.name}${o.word ? ` · ${o.word}` : ''}`}`;

  const onEnv = () => {
    if (stage !== 'env') return;
    setStage('opening');
    setTimeout(() => setStage('card'), 550);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {Platform.OS !== 'android' ? <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} /> : null}
      <View style={[StyleSheet.absoluteFill, s.bg]} />
      <Pressable style={[s.close, { top: Math.max(insets.top, 12) + 6 }]} onPress={() => setUI({ mailOpen: false })} accessibilityLabel="나중에 열기" hitSlop={10}>
        <Txt w={500} size={13} color="rgba(255,255,255,0.75)">
          나중에
        </Txt>
      </Pressable>
      {stage !== 'card' ? (
        <View style={s.center}>
          <Envelope opening={stage === 'opening'} onPress={onEnv} />
          <Txt size={14} color="rgba(255,255,255,0.85)" style={{ marginTop: 30 }}>
            봉투를 눌러 열어 보세요
          </Txt>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[s.scroll, { paddingTop: Math.max(insets.top, 20) + 40, paddingBottom: Math.max(insets.bottom, 16) + 20 }]} showsVerticalScrollIndicator={false}>
          <Postcard card={arrived} flipped={flipped} />
          <View style={{ marginTop: 18, alignItems: 'center' }}>
            <Txt w={600} size={15} color="#fff" center>
              {cap}
            </Txt>
            <Txt size={12.5} color="rgba(255,255,255,0.7)" center>
              {have ? '이미 가진 엽서예요' : '처음 받는 엽서예요'}
            </Txt>
          </View>
          {flipped && c.places ? (
            <View style={s.places}>
              <Txt w={700} size={13} style={{ marginBottom: 6 }}>
                다음에 같이 가 볼 곳 · {c.name}
              </Txt>
              {c.places.map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row', gap: 10 }}>
                  <Txt w={600} size={13} color={C.ink2} lh={1.5} style={{ width: 46 }}>
                    {k}
                  </Txt>
                  <Txt size={13} lh={1.5} style={{ flex: 1 }}>
                    {v}
                  </Txt>
                </View>
              ))}
              <Txt size={11} color={C.ink3} style={{ marginTop: 6 }}>
                예시입니다. 실제 앱은 한국관광공사 관광 정보로 채워요.
              </Txt>
            </View>
          ) : null}
          <View style={s.reward}>
            <Coin size={16} />
            <Txt size={12.5} color="rgba(255,255,255,0.8)">
              조개 {arrived.reward}개
            </Txt>
            {!arrived.doubled && (
              <Pressable onPress={doubleReward} accessibilityRole="button" hitSlop={6}>
                <Txt size={12.5} color="#fff" style={{ textDecorationLine: 'underline' }}>
                  광고 보고 2배 받기
                </Txt>
              </Pressable>
            )}
          </View>
          <View style={s.actions}>
            <Btn title={flipped ? '앞면 보기' : '뒷면 보기'} variant="ghost" small style={{ flex: 1, width: undefined }} onPress={() => setFlipped((f) => !f)} />
            <Btn title="엽서함에 넣기" variant="white" small style={{ flex: 1, width: undefined }} onPress={keep} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Envelope({ opening, onPress }: { opening: boolean; onPress: () => void }) {
  const hover = useSharedValue(0);
  const flap = useSharedValue(0);
  useEffect(() => {
    hover.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [hover]);
  useEffect(() => {
    if (opening) flap.value = withTiming(1, { duration: 500 });
  }, [opening, flap]);
  const hoverSt = useAnimatedStyle(() => ({ transform: [{ translateY: -8 * hover.value }] }));
  const flapSt = useAnimatedStyle(() => ({ transform: [{ scaleY: 1 - 2 * flap.value }] }));
  const sealSt = useAnimatedStyle(() => ({ opacity: 1 - flap.value }));

  return (
    <Animated.View style={[s.env, hoverSt]}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="봉투 열기" style={StyleSheet.absoluteFill}>
        <View style={s.envBody}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern id="air" width={28} height={28} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <Rect x={0} y={0} width={8} height={28} fill="#D9654B" />
                <Rect x={14} y={0} width={8} height={28} fill="#4A74D0" />
              </Pattern>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="#F5EFE4" />
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#air)" />
          </Svg>
          <View style={s.envInner} />
        </View>
        <Animated.View style={[s.flap, { transformOrigin: '50% 0%' }, flapSt]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Polygon points="0,0 100,0 50,100" fill="#EDE4D4" />
          </Svg>
        </Animated.View>
        <Animated.View style={[s.seal, sealSt]}>
          <Svg width={22} height={22} viewBox="0 0 22 22">
            <Path d="M11 18S3.5 13.8 3.5 8.6A3.8 3.8 0 0 1 11 7.1a3.8 3.8 0 0 1 7.5 1.5C18.5 13.8 11 18 11 18Z" fill="#F5D6CC" />
          </Svg>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  bg: { backgroundColor: Platform.OS === 'android' ? 'rgba(20,18,15,0.86)' : 'rgba(20,18,15,0.72)' },
  close: { position: 'absolute', right: 18, zIndex: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'stretch', paddingHorizontal: 18 },
  env: { width: '78%', aspectRatio: 3 / 2 },
  envBody: {
    ...StyleSheet.absoluteFill,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F5EFE4',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 24 },
    elevation: 14,
  },
  envInner: { position: 'absolute', top: 7, left: 7, right: 7, bottom: 7, backgroundColor: '#F5EFE4', borderRadius: 3 },
  flap: { position: 'absolute', left: 0, right: 0, top: 0, height: '56%' },
  seal: {
    position: 'absolute',
    left: '50%',
    top: '56%',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
    backgroundColor: '#C4513A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  places: { width: '100%', marginTop: 14, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14 },
  reward: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
});
