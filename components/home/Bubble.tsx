import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Txt } from '@/components/Txt';

/** Speech bubble that pops on each new line. Positioned by `bottom` within the hero. */
export function Bubble({ text, k, bottom }: { text: string | null; k: number; bottom: number }) {
  const p = useSharedValue(1);
  useEffect(() => {
    p.value = 0;
    p.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, [k, p]);
  const st = useAnimatedStyle(() => ({ opacity: 0.3 + 0.7 * p.value, transform: [{ scale: 0.9 + 0.1 * p.value }] }));
  if (!text) return null;
  return (
    <View pointerEvents="none" style={[s.row, { bottom }]}>
      <Animated.View style={[s.bubble, st]}>
        <Txt w={500} size={14} lh={1.45} center>
          {text}
        </Txt>
        <View style={s.tail} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 4 },
  bubble: {
    maxWidth: '78%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#281E14',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  tail: {
    position: 'absolute',
    left: '50%',
    bottom: -6,
    width: 12,
    height: 12,
    marginLeft: -6,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    borderBottomRightRadius: 3,
  },
});
