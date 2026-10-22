import { Image } from 'expo-image';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Txt } from '@/components/Txt';
import { Btn } from '@/components/ui';
import { CH } from '@/data/characters';
import { CHAR_ASPECT, IMAGES } from '@/data/images';
import { switchCharAndGoHome } from '@/store/actions';
import { game } from '@/store/game';
import { setUI, useUI } from '@/store/ui';

const RAYS = (() => {
  // repeating-conic-gradient(rgba(255,255,255,.07) 0 8deg, transparent 8deg 22deg)
  const out: string[] = [];
  const r = 640;
  for (let a = 0; a < 360; a += 22) {
    const a0 = ((a - 90) * Math.PI) / 180;
    const a1 = ((a + 8 - 90) * Math.PI) / 180;
    out.push(`M0 0L${(r * Math.cos(a0)).toFixed(1)} ${(r * Math.sin(a0)).toFixed(1)}L${(r * Math.cos(a1)).toFixed(1)} ${(r * Math.sin(a1)).toFixed(1)}Z`);
  }
  return out.join('');
})();

/** "새 친구가 생겼어요!" / "구매 완료!" full-screen celebration. */
export function NewFriendOverlay() {
  const nf = useUI((s) => s.newFriend);
  const pathname = usePathname();
  const close = () => {
    setUI({ newFriend: null });
    if (pathname === '/friends') game().set({ friendNew: false });
  };
  const { width, height } = useWindowDimensions();
  const spin = useSharedValue(0);
  const pop = useSharedValue(0);

  useEffect(() => {
    if (!nf) return;
    spin.value = 0;
    spin.value = withRepeat(withTiming(360, { duration: 18000, easing: Easing.linear }), -1, false);
    pop.value = 0;
    pop.value = withTiming(1, { duration: 700, easing: Easing.bezier(0.2, 1.5, 0.4, 1) });
  }, [nf, spin, pop]);

  const raysSt = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const popSt = useAnimatedStyle(() => ({
    opacity: Math.min(1, pop.value * 1.5),
    transform: [{ translateY: (1 - pop.value) * 0.3 * width * 0.62 * 1.35 }, { scale: 0.3 + 0.7 * pop.value }],
  }));

  if (!nf) return null;
  const c = CH[nf.ch];
  const buy = nf.mode === 'buy';
  const cx = width / 2;
  const cy = height * 0.42;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#151A2E' }]}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          <RadialGradient id="nfbg" cx={cx} cy={cy} r={Math.max(width, height) * 0.7} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#3B4A78" />
            <Stop offset="0.7" stopColor="#151A2E" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#nfbg)" />
      </Svg>
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: cx - 640, top: cy - 640, width: 1280, height: 1280 }, raysSt]}>
        <Svg width={1280} height={1280} viewBox="-640 -640 1280 1280">
          <G>
            <Path d={RAYS} fill="rgba(255,255,255,0.07)" />
          </G>
        </Svg>
      </Animated.View>
      <View style={s.center}>
        <Txt w={600} size={14} color="rgba(255,255,255,0.85)">
          {buy ? '구매 완료!' : '새 친구가 생겼어요!'}
        </Txt>
        <Animated.View style={[{ width: width * 0.62, marginTop: 10, marginBottom: 4 }, popSt]}>
          <Image source={IMAGES[c.idle]} style={{ width: '100%', aspectRatio: CHAR_ASPECT }} contentFit="contain" />
        </Animated.View>
        <Txt w={700} size={28} ls={-0.03} color="#fff" lh={1.3}>
          {c.name}
        </Txt>
        <Txt size={13} color="rgba(255,255,255,0.75)" style={{ marginTop: 4 }}>
          {nf.why}
        </Txt>
        <View style={s.actions}>
          <Btn title="나중에" variant="ghost" small style={{ flex: 1, width: undefined }} onPress={close} />
          <Btn
            title={buy ? '이제 같이 해 봐요!' : '지금 함께하기'}
            variant="white"
            small
            style={{ flex: 1, width: undefined }}
            onPress={() => {
              close();
              switchCharAndGoHome(nf.ch);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 18, paddingBottom: 30 },
  actions: { flexDirection: 'row', gap: 8, width: '100%', marginTop: 24 },
});
