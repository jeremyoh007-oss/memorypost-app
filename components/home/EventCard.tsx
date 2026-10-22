import { DEV_TOOLS } from '@/lib/devFlags';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { IconTicket } from '@/components/Icons';
import { Txt } from '@/components/Txt';
import { CH } from '@/data/characters';
import { CITIES } from '@/data/cities';
import { IMAGES } from '@/data/images';
import { OUTFITS } from '@/data/outfits';
import { iGa } from '@/lib/korean';
import { arrive, openMail, openTravel } from '@/store/actions';
import { useGame } from '@/store/game';

/** Special-event card: ticket → on trip (with dev "바로 도착") → postcard arrived. */
export function EventCard() {
  const tickets = useGame((s) => s.tickets);
  const trip = useGame((s) => s.trip);
  const arrived = useGame((s) => s.arrived);

  if (arrived) {
    const c = CITIES[arrived.c];
    return (
      <Shell
        thumb={<Image source={IMAGES[c.bg]} style={StyleSheet.absoluteFill} contentFit="cover" />}
        small="엽서 도착"
        title={`${c.name}에서 엽서가 왔어요`}
        sub={arrived.ch === 'dog' ? `${OUTFITS[arrived.o].name} 차림으로 다녀왔어요` : `${iGa(CH[arrived.ch].name)} 다녀왔어요`}
        cta="열어 보기"
        onPress={openMail}
      />
    );
  }
  if (trip) {
    const c = CITIES[trip.c];
    return (
      <Shell
        thumb={<Image source={IMAGES[c.bg]} style={StyleSheet.absoluteFill} contentFit="cover" />}
        small="여행 중"
        title={`${c.name}에 가 있어요`}
        sub="도착하면 알림으로 알려 드려요"
        cta="바로 도착"
        ctaSub={DEV_TOOLS ? '체험용' : undefined}
        onPress={DEV_TOOLS ? () => arrive() : undefined}
      />
    );
  }
  if (tickets > 0) {
    return (
      <Shell
        thumb={<IconTicket size={34} />}
        small="특별 이벤트"
        title="여행 티켓이 도착했어요"
        sub="이번 주 안에 한 번, 어디든 보내 줄 수 있어요"
        cta="보내기"
        onPress={openTravel}
      />
    );
  }
  return null;
}

function Shell({
  thumb,
  small,
  title,
  sub,
  cta,
  ctaSub,
  onPress,
}: {
  thumb: React.ReactNode;
  small: string;
  title: string;
  sub: string;
  cta: string;
  ctaSub?: string;
  onPress?: () => void;
}) {
  return (
    <View style={s.wrap}>
      <LinearGradient colors={['#20314F', '#3A4E7A']} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }} style={StyleSheet.absoluteFill} />
      <Svg width={140} height={140} style={s.glow} pointerEvents="none">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#fff" stopOpacity={0.16} />
            <Stop offset="0.7" stopColor="#fff" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={70} cy={70} r={70} fill="url(#glow)" />
      </Svg>
      <View style={s.thumb}>{thumb}</View>
      <View style={s.tx}>
        <Txt w={600} size={11.5} color="rgba(255,255,255,0.75)" lh={1.4}>
          {small}
        </Txt>
        <Txt w={700} size={15} color="#fff" lh={1.35} style={{ marginTop: 1, marginBottom: 2 }}>
          {title}
        </Txt>
        <Txt size={12} color="rgba(255,255,255,0.82)" lh={1.4}>
          {sub}
        </Txt>
      </View>
      {onPress ? (
        <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.go, pressed && { opacity: 0.85 }]}>
          <Txt w={700} size={13} color="#20314F" lh={1.25} center>
            {cta}
          </Txt>
          {ctaSub ? (
            <Txt w={500} size={10.5} color="rgba(32,49,79,0.7)" lh={1.25} center>
              {ctaSub}
            </Txt>
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { borderRadius: 22, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center', overflow: 'hidden' },
  glow: { position: 'absolute', right: -30, top: -30 },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tx: { flex: 1, minWidth: 0 },
  go: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
});
