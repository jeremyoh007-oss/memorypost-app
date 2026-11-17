import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { HeartFilled } from '@/components/Icons';
import { SoftShadow } from '@/components/SoftShadow';
import { IMAGES, type ImageKey } from '@/data/images';
import { useUI } from '@/store/ui';

/** The pet image with breathing, hop/squish on `bounce.key`, accessible as a button. */
export function Pet({ img, width, onPress, label }: { img: ImageKey; width: number; onPress: () => void; label: string }) {
  const height = width / (470 / 635);
  const bounce = useUI((s) => s.bounce);
  const breathe = useSharedValue(0);
  const hop = useSharedValue(1);
  const squish = useSharedValue(1);

  useEffect(() => {
    breathe.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [breathe]);

  useEffect(() => {
    if (!bounce.key) return;
    if (bounce.kind === 'hop') {
      hop.set(0);
      hop.set(withTiming(1, { duration: 500, easing: Easing.bezier(0.3, 1.4, 0.5, 1) }));
    } else {
      squish.set(0);
      squish.set(withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }));
    }
  }, [bounce, hop, squish]);

  const anim = useAnimatedStyle(() => {
    const b = breathe.value;
    const h = hop.value;
    const q = squish.value;
    const sx = interpolate(h, [0, 0.45, 1], [1.04, 0.97, 1], Extrapolation.CLAMP) * interpolate(q, [0, 0.4, 1], [1, 1.06, 1], Extrapolation.CLAMP) * (1 + 0.012 * b);
    const sy = interpolate(h, [0, 0.45, 1], [0.94, 1.04, 1], Extrapolation.CLAMP) * interpolate(q, [0, 0.4, 1], [1, 0.93, 1], Extrapolation.CLAMP) * (1 + 0.022 * b);
    const ty = interpolate(h, [0, 0.45, 1], [0, -0.09 * height, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY: ty }, { scaleX: sx }, { scaleY: sy }] };
  });

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={{ width, height }}>
      <SoftShadow color="#000" opacity={0.1} style={{ left: width * 0.22, width: width * 0.56, bottom: -height * 0.015, height: height * 0.06 }} />
      <Animated.View style={[{ width, height, transformOrigin: '50% 100%' }, anim]}>
        <Image source={IMAGES[img]} style={{ width, height }} contentFit="contain" transition={0} />
      </Animated.View>
    </Pressable>
  );
}

/** Floating hearts burst; anchored at (x, y) within the hero. */
export function Hearts({ x, y, spread }: { x: number; y: number; spread: number }) {
  const [bursts, setBursts] = useState<{ key: number; items: { dx: number; ox: number }[] }[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const unsub = useUI.subscribe((st, prev) => {
      const h = st.hearts;
      if (h === prev.hearts || !h.key || !h.n) return;
      const items = Array.from({ length: h.n }, () => ({ dx: Math.random() * 60 - 30, ox: (Math.random() - 0.5) * spread * 0.4 }));
      setBursts((b) => [...b, { key: h.key, items }]);
      timers.push(setTimeout(() => setBursts((b) => b.filter((x) => x.key !== h.key)), 1600));
    });
    return () => {
      unsub();
      timers.forEach(clearTimeout);
    };
  }, [spread]);

  return (
    <>
      {bursts.flatMap((b) =>
        b.items.map((it, i) => <FloatHeart key={`${b.key}-${i}`} x={x + it.ox} y={y} dx={it.dx} delay={i * 90} />),
      )}
    </>
  );
}

function FloatHeart({ x, y, dx, delay }: { x: number; y: number; dx: number; delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(withDelay(delay, withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1100, easing: Easing.out(Easing.ease) }))));
  }, [p, delay]);
  const st = useAnimatedStyle(() => ({
    opacity: 1 - p.value,
    transform: [{ translateX: dx * p.value }, { translateY: -90 * p.value }, { scale: 1 + 0.25 * p.value }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: x - 9, top: y, zIndex: 5 }, st]}>
      <HeartFilled size={18} />
    </Animated.View>
  );
}
