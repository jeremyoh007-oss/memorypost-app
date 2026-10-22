import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/theme/tokens';
import { IconClose } from './Icons';
import { Txt } from './Txt';
import { TitleRow } from './ui';

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

/** Bottom sheet with scrim (prototype `.sheet`): grab bar, title + close, sub line, scroll body, footer. */
export function Sheet({
  visible,
  onClose,
  title,
  sub,
  footer,
  tall,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  footer?: ReactNode;
  tall?: boolean;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const p = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      p.value = withTiming(1, { duration: 340, easing: EASE });
      return;
    }
    p.value = withTiming(0, { duration: 250, easing: EASE });
    const t = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(t);
  }, [visible, p]);

  const scrim = useAnimatedStyle(() => ({ opacity: p.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.value) * winH }] }));

  if (!mounted) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, s.scrim, scrim]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="닫기" />
      </Animated.View>
      <Animated.View style={[s.sheet, tall ? { height: '88%' } : { maxHeight: '88%' }, { paddingBottom: Math.max(insets.bottom, 12) + 18 }, sheet]}>
        <View style={s.grab} />
        <TitleRow
          title={title}
          right={
            <Pressable onPress={onClose} style={s.x} accessibilityRole="button" accessibilityLabel="닫기" hitSlop={8}>
              <IconClose />
            </Pressable>
          }
        />
        {sub ? (
          <Txt size={13} color={C.ink2} style={{ marginBottom: 14 }}>
            {sub}
          </Txt>
        ) : null}
        <ScrollView style={tall ? { flex: 1 } : undefined} contentContainerStyle={{ paddingTop: 2, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer ? <View style={{ paddingTop: 12 }}>{footer}</View> : null}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(20,18,15,0.32)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingHorizontal: 18,
  },
  grab: { width: 38, height: 5, borderRadius: 5, backgroundColor: C.grab, alignSelf: 'center', marginBottom: 12 },
  x: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.segBg, alignItems: 'center', justifyContent: 'center' },
});
