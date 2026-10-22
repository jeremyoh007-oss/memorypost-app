import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { ScreenShell } from '@/components/ScreenShell';
import { Txt } from '@/components/Txt';
import { CH, CHAR_IDS, type CharId } from '@/data/characters';
import { CHAR_ASPECT, IMAGES } from '@/data/images';
import { penguinDaysLeft, switchCharAndGoHome } from '@/store/actions';
import { useGame } from '@/store/game';
import { setUI } from '@/store/ui';
import { C } from '@/theme/tokens';

export default function Friends() {
  const colW = (useWindowDimensions().width - 36 - 10) / 2;

  useFocusEffect(
    useCallback(() => {
      if (useGame.getState().friendNew) useGame.getState().set({ friendNew: false });
    }, []),
  );

  return (
    <ScreenShell title="친구들" sub="함께할 친구를 고르세요. 오래 함께하면 열리는 친구도, 데려올 수 있는 친구도 있어요.">
      <View style={s.grid}>
        {CHAR_IDS.map((k) => (
          <FriendCard key={k} k={k} w={colW} />
        ))}
      </View>
      <Txt size={11.5} color={C.ink3} center style={{ marginTop: 12, marginHorizontal: 4 }}>
        뽑기는 없어요. 가격과 판매 기간은 미리 알려 드려요. 히든 친구는 팔지 않아요.
      </Txt>
    </ScreenShell>
  );
}

function FriendCard({ k, w }: { k: CharId; w: number }) {
  const g = useGame();
  const c = CH[k];
  const own = !!g.chars[k];
  const act = g.active === k;
  let sub = '';
  let ctl: React.ReactNode = null;
  const hidden = !own && c.kind === 'hidden';
  const bondLocked = !own && c.kind === 'bond';

  if (own) {
    sub = k === 'dog' ? '처음부터 함께한 친구' : '함께할 수 있어요';
    ctl = act ? <FBtn title="함께하는 중" variant="on" /> : <FBtn title="함께하기" variant="light" onPress={() => switchCharAndGoHome(k)} />;
  } else if (c.kind === 'bond') {
    sub = `친밀도 Lv.${c.need}에 열려요 · ${g.bond}%`;
    ctl = <Bar pct={g.lv >= (c.need ?? 0) ? 100 : g.bond} />;
  } else if (c.kind === 'hidden') {
    const n = g.cards.length;
    sub = `엽서를 ${c.need}종 모으면 누군가 찾아와요 · ${n}/${c.need}`;
    ctl = <Bar pct={Math.min(100, (n / (c.need ?? 1)) * 100)} />;
  } else if (c.kind === 'shop') {
    sub = '언제든 데려올 수 있어요';
    ctl = <FBtn title={c.price ?? ''} onPress={() => setUI({ storeFor: k })} />;
  } else {
    const left = penguinDaysLeft();
    if (left >= 0) {
      sub = `${c.untilLabel}까지만 판매 · ${left}일 남음`;
      ctl = <FBtn title={c.price ?? ''} onPress={() => setUI({ storeFor: k })} />;
    } else {
      sub = `${c.untilLabel}에 판매가 끝났어요`;
      ctl = <FBtn title="판매 종료" variant="on" />;
    }
  }

  const badgeStyle = c.kind === 'limited' ? s.badgeLtd : c.kind === 'hidden' ? s.badgeHid : null;
  return (
    <View style={[s.fc, { width: w }, act && s.fcAct]}>
      <View style={s.fim}>
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id={`fg-${k}`} cx="50%" cy="85%" rx="80%" ry="80%">
              <Stop offset="0" stopColor="#EDE5D8" />
              <Stop offset="0.7" stopColor="#F7F3EC" />
            </RadialGradient>
          </Defs>
          <Ellipse cx={50} cy={85} rx={100} ry={100} fill={`url(#fg-${k})`} />
        </Svg>
        <View style={[s.fimgWrap, bondLocked && { filter: 'grayscale(1)', opacity: 0.5 }]}>
          <Image source={IMAGES[c.idle]} style={[s.fimg, hidden && { opacity: 0.13 }]} tintColor={hidden ? '#000' : undefined} contentFit="contain" />
        </View>
        <View style={[s.badge, badgeStyle]}>
          <Txt w={700} size={10.5} lh={1.4} color={badgeStyle ? '#fff' : C.ink2}>
            {c.tag}
          </Txt>
        </View>
      </View>
      <Txt w={700} size={14} style={{ paddingHorizontal: 4 }}>
        {hidden ? '???' : c.name}
      </Txt>
      <Txt size={11.5} color={C.ink2} lh={1.4} style={{ paddingHorizontal: 4, minHeight: 32 }}>
        {sub}
      </Txt>
      {ctl}
    </View>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <View style={s.bar}>
      <View style={[s.barFill, { width: `${Math.min(100, pct)}%` }]} />
    </View>
  );
}

function FBtn({ title, onPress, variant = 'dark' }: { title: string; onPress?: () => void; variant?: 'dark' | 'light' | 'on' }) {
  const bg = variant === 'dark' ? C.ink : variant === 'light' ? '#F1EDE6' : 'transparent';
  const fg = variant === 'dark' ? '#fff' : variant === 'light' ? C.ink : C.ink2;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [s.fbtn, { backgroundColor: bg }, variant === 'on' && { borderWidth: 1, borderColor: C.line }, pressed && { opacity: 0.85 }]}
    >
      <Txt w={variant === 'on' ? 600 : 700} size={13} color={fg} center lh={1.4}>
        {title}
      </Txt>
    </Pressable>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fc: { backgroundColor: C.card, borderRadius: 18, paddingTop: 8, paddingHorizontal: 8, paddingBottom: 10, borderWidth: 1, borderColor: C.line, gap: 6 },
  fcAct: { borderWidth: 2, borderColor: C.ink, paddingTop: 7, paddingHorizontal: 7, paddingBottom: 9 },
  fim: { borderRadius: 13, aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  fimgWrap: { height: '94%', aspectRatio: CHAR_ASPECT },
  fimg: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 7,
    left: 7,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  badgeLtd: { backgroundColor: C.accent },
  badgeHid: { backgroundColor: '#1C1A17' },
  bar: { height: 5, borderRadius: 5, backgroundColor: C.track, marginHorizontal: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: C.accent, borderRadius: 5 },
  fbtn: { borderRadius: 12, paddingVertical: 8, width: '100%' },
});
