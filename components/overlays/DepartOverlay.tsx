import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components/Txt';
import { CITIES, durOf } from '@/data/cities';
import { CHAR_ASPECT, IMAGES } from '@/data/images';
import { euro } from '@/lib/korean';
import { outfitImage } from '@/lib/pet';
import { useUI } from '@/store/ui';
import { C } from '@/theme/tokens';

/** "다녀올게요!" departure animation: postmark stamps in, the pet bobs and walks off. */
export function DepartOverlay() {
  const trip = useUI((s) => s.depart);
  const { width, height } = useWindowDimensions();
  const stamp = useSharedValue(0);
  const walk = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    if (!trip) return;
    stamp.value = 0;
    walk.value = 0;
    bob.value = 0;
    stamp.value = withDelay(300, withTiming(1, { duration: 450, easing: Easing.bezier(0.3, 1.5, 0.5, 1) }));
    walk.value = withDelay(1000, withTiming(1, { duration: 2400, easing: Easing.in(Easing.ease) }));
    bob.value = withRepeat(withTiming(1, { duration: 360, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [trip, stamp, walk, bob]);

  const walkerW = width * 0.56;
  const stampSt = useAnimatedStyle(() => ({ opacity: stamp.value, transform: [{ rotate: '-12deg' }, { scale: 1.8 - 0.8 * stamp.value }] }));
  const walkSt = useAnimatedStyle(() => ({ transform: [{ translateX: walk.value * walkerW * 1.6 }] }));
  const bobSt = useAnimatedStyle(() => ({ transform: [{ translateY: -0.04 * walkerW * 1.35 * bob.value }, { rotate: `${1.5 * bob.value}deg` }] }));

  if (!trip) return null;
  const c = CITIES[trip.c];
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#CFE3F3', '#F4EEE4']} style={StyleSheet.absoluteFill} />
      <Svg width={width} height={height * 0.36} viewBox="0 0 360 200" preserveAspectRatio="none" style={{ position: 'absolute', top: height * 0.12, left: 0 }}>
        <Path d="M-10 170C80 140 120 40 220 60S330 30 380 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="6 8" />
      </Svg>
      <Animated.View style={[s.pm, { top: height * 0.14, right: width * 0.1 }, stampSt]}>
        <Txt w={700} size={12} lh={1.25} color={C.accent} center>
          {`출발\n${c.name}`}
        </Txt>
      </Animated.View>
      <View style={s.center}>
        <Txt w={700} size={30} ls={-0.03} lh={1.3}>
          다녀올게요!
        </Txt>
        <Txt size={14} color={C.ink2} style={{ marginTop: 4 }}>
          {euro(c.name)} · {durOf(trip.d).label}
        </Txt>
        <Animated.View style={[{ width: walkerW, marginTop: 18 }, walkSt]}>
          <Animated.View style={bobSt}>
            <Image source={IMAGES[outfitImage(trip.ch, trip.o)]} style={{ width: walkerW, aspectRatio: CHAR_ASPECT }} contentFit="contain" />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 18, overflow: 'hidden' },
  pm: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(217,101,75,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
