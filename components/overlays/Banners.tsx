import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/Txt';
import { IMAGES } from '@/data/images';
import { openMail } from '@/store/actions';
import { game } from '@/store/game';
import { setUI, useUI } from '@/store/ui';

/** Bottom toast pill (above the tab bar). */
export function Toast() {
  const t = useUI((s) => s.toast);
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(t ? 1 : 0, { duration: 250 });
  }, [t, p]);
  const st = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 8 * (1 - p.value) }] }));
  if (!t) return null;
  return (
    <View pointerEvents="none" style={s.toastRow}>
      <Animated.View style={[s.toast, st]}>
        <Txt w={500} size={13} color="#fff" center>
          {t.text}
        </Txt>
      </Animated.View>
    </View>
  );
}

/** In-app stand-in for a push notification (arrival, "보고 싶어요"). Real notifications come later. */
export function PushBanner() {
  const push = useUI((s) => s.push);
  const insets = useSafeAreaInsets();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(push ? 1 : 0, { duration: 400, easing: Easing.bezier(0.2, 0.9, 0.3, 1.1) });
  }, [push, p]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.value) * -160 }] }));
  if (!push) return null;
  return (
    <Animated.View style={[s.pushWrap, { top: Math.max(insets.top, 8) + 2 }, st]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => (game().arrived ? openMail() : setUI({ push: null }))}
        style={s.push}
      >
        <View style={s.appicon}>
          <Image source={IMAGES.pet_idle} style={s.appiconImg} contentFit="cover" contentPosition={{ top: '12%', left: '50%' }} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={s.pushTop}>
            <Txt w={600} size={12.5} color="#111">
              추억 우체국
            </Txt>
            <Txt size={12.5} color="#888">
              지금
            </Txt>
          </View>
          <Txt size={13.5} color="#222" lh={1.35}>
            {push.text}
          </Txt>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toastRow: { position: 'absolute', left: 0, right: 0, bottom: 104, alignItems: 'center', zIndex: 86 },
  toast: { backgroundColor: 'rgba(28,26,23,0.9)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16, maxWidth: '86%' },
  pushWrap: { position: 'absolute', left: 10, right: 10, zIndex: 85 },
  push: {
    backgroundColor: 'rgba(245,245,247,0.97)',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 13,
    flexDirection: 'row',
    gap: 11,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  appicon: { width: 38, height: 38, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F3E9DC' },
  appiconImg: { position: 'absolute', width: 57, height: 77, left: -9.5, top: -4 },
  pushTop: { flexDirection: 'row', justifyContent: 'space-between' },
});
