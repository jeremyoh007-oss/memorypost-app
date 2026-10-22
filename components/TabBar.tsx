import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useGame } from '@/store/game';
import { C } from '@/theme/tokens';
import { IconHome, IconMail, IconPaw, IconShirt } from './Icons';
import { Txt } from './Txt';

const TABS: Record<string, { label: string; Icon: typeof IconHome }> = {
  index: { label: '홈', Icon: IconHome },
  album: { label: '엽서함', Icon: IconMail },
  wardrobe: { label: '옷장', Icon: IconShirt },
  friends: { label: '친구들', Icon: IconPaw },
};

export const TAB_BAR_BASE = 58;

/** iOS-like translucent tab bar from the prototype (4 columns, thin icons, accent dot). */
export function TabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  const albumDot = useGame((s) => !!s.newCard);
  const friendDot = useGame((s) => s.friendNew);
  const bottom = Math.max(insets.bottom, Platform.OS === 'web' ? 18 : 10);
  return (
    <View style={[s.bar, { paddingBottom: bottom }]}>
      {Platform.OS !== 'android' ? <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} /> : null}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Platform.OS === 'android' ? 'rgba(250,249,246,0.97)' : C.tabBar }]} />
      {state.routes.map((route, i) => {
        const t = TABS[route.name];
        if (!t) return null;
        const on = state.index === i;
        const color = on ? C.ink : C.ink3;
        const dot = (route.name === 'album' && albumDot) || (route.name === 'friends' && friendDot);
        return (
          <Pressable
            key={route.key}
            onPress={() => navigateToTab(route.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.label}
            style={s.item}
          >
            <t.Icon size={24} color={color} />
            <Txt w={500} size={10.5} color={color} lh={1.3}>
              {t.label}
            </Txt>
            {dot && <View style={s.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  dot: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
    borderWidth: 1.5,
    borderColor: '#FAF9F6',
  },
});
