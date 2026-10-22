import { DEV_TOOLS } from '@/lib/devFlags';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkyIcon } from '@/components/Icons';
import { Txt } from '@/components/Txt';
import { CH } from '@/data/characters';
import { CITIES } from '@/data/cities';
import { HEAD, IMAGES } from '@/data/images';
import { OUTFITS } from '@/data/outfits';
import { TOD, type Tod } from '@/data/tod';
import { eulReul } from '@/lib/korean';
import { outfitImage, poseImage, type Pose } from '@/lib/pet';
import { dateLabel, daysBetween, dayKey, remainLabel } from '@/lib/time';
import { bondInfo, nextEvent, nowMs, petTap, scheduleEvents } from '@/store/actions';
import { useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { SKY_LABEL } from '@/services/weather';
import { C } from '@/theme/tokens';
import { BondPill } from './BondRing';
import { Bubble } from './Bubble';
import { Hearts, Pet } from './Pet';

export const HERO_H = 452;

/** The room: greeting, date, brief, bond ring, and the pet (or the "on a trip" card). */
export function Hero({ tod, now, minute }: { tod: Tod; now: number; minute: number }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const g = useGame();
  const bubble = useUI((s) => s.bubble);
  const tempPose = useUI((s) => s.tempPose);
  const sad = useUI((s) => s.sad);
  const weather = useUI((s) => s.weather);
  useUI((s) => s.events); // re-render when the calendar loads
  const night = tod === 'night';

  const W = Math.min(width, 520);
  const petW = W * 0.48;
  const petH = petW * (635 / 470);
  const pose: Pose = tempPose ?? (sad ? 'sad' : night ? 'sleep' : 'idle');
  const img = poseImage(g.active, pose, g.outfit);
  const bubbleBottom = 34 + petH * (HEAD[img] ?? 0.8) + 10;
  const days = daysBetween(g.startedDay, dayKey(now)) + 1;

  const nx = nextEvent(scheduleEvents(), minute);
  const briefTemp = weather ? (night ? weather.nightTemp ?? weather.temp : weather.temp) : null;
  const top = Math.max(insets.top, 20) + 8;
  const onLongPressDate = DEV_TOOLS ? () => setUI({ sheet: 'debug' }) : undefined;

  const trip = g.trip;
  const ch = CH[g.active];

  return (
    <View style={[s.hero, { height: HERO_H + Math.max(0, top - 56) }]}>
      <Image source={IMAGES.bg_room} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: '50%', top: '28%' }} transition={0} />
      <LinearGradient
        pointerEvents="none"
        colors={night ? ['rgba(18,22,52,0.6)', 'rgba(18,22,52,0)'] : ['rgba(247,245,241,0.96)', 'rgba(247,245,241,0.75)', 'rgba(247,245,241,0)']}
        locations={night ? [0, 1] : [0, 0.55, 1]}
        style={[s.topFade, { height: 170 + Math.max(0, top - 56) }]}
      />
      {night && <LinearGradient pointerEvents="none" colors={['rgba(18,22,52,0.55)', 'rgba(30,30,70,0.35)']} style={StyleSheet.absoluteFill} />}

      <View style={[s.hello, { top }]}>
        <View style={s.helloRow}>
          <View style={{ flexShrink: 1 }}>
            <Pressable onLongPress={onLongPressDate} delayLongPress={600} accessibilityHint={DEV_TOOLS ? '길게 누르면 개발자 메뉴가 열려요' : undefined}>
              <Txt w={500} size={13} color={night ? 'rgba(255,255,255,0.75)' : C.ink2}>
                {dateLabel(now)}
              </Txt>
            </Pressable>
            <Txt w={700} size={24} lh={1.3} ls={-0.03} color={night ? '#fff' : C.ink} style={{ marginTop: 2 }}>
              {TOD[tod].greet}
            </Txt>
          </View>
          <BondPill lv={g.lv} bond={g.bond} days={days} onPress={bondInfo} />
        </View>
        <View style={s.brief}>
          {weather && briefTemp !== null ? (
            <>
              <SkyIcon sky={weather.sky} night={night} size={16} />
              <Txt w={500} size={13} color={night ? 'rgba(255,255,255,0.9)' : C.ink}>
                {briefTemp}° {SKY_LABEL[weather.sky]}
              </Txt>
              <View style={[s.dot, { backgroundColor: night ? '#fff' : C.ink }]} />
            </>
          ) : null}
          <Txt w={500} size={13} color={night ? 'rgba(255,255,255,0.9)' : C.ink} numberOfLines={1} style={{ flexShrink: 1 }}>
            {nx ? `${nx.start} ${nx.title}` : '남은 일정 없음'}
          </Txt>
        </View>
      </View>

      {trip ? (
        <View style={s.awayWrap}>
          <View style={s.away}>
            <Image source={IMAGES[outfitImage(trip.ch, trip.o)]} style={{ width: 52, aspectRatio: 470 / 635 }} contentFit="contain" />
            <View style={{ flex: 1 }}>
              <Txt w={700} size={15} lh={1.3}>
                {CITIES[trip.c].name} 여행 중
              </Txt>
              <Txt size={12.5} color={C.ink2}>
                {trip.ch === 'dog' ? `${OUTFITS[trip.o].name} 차림` : `${CH[trip.ch].name}${trip.o !== 'none' ? ` · ${OUTFITS[trip.o].name}` : ''}`} · 도착까지{' '}
                {remainLabel(trip.endsAt - Math.max(now, nowMs()))}
              </Txt>
            </View>
          </View>
        </View>
      ) : (
        <>
          <Bubble text={bubble.text} k={bubble.key} bottom={bubbleBottom} />
          <View style={[s.petWrap, { left: (width - petW) / 2 }]}>
            <Pet img={img} width={petW} onPress={petTap} label={`${eulReul(ch.name)} 쓰다듬기`} />
          </View>
          <Hearts x={width / 2} y={HERO_H - 34 - petH * 0.7 + Math.max(0, top - 56)} spread={petW} />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  hero: { position: 'relative', overflow: 'hidden', backgroundColor: '#E9E1D4' },
  topFade: { position: 'absolute', left: 0, right: 0, top: 0 },
  hello: { position: 'absolute', left: 22, right: 22, zIndex: 3 },
  helloRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  brief: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 3, height: 3, borderRadius: 2, opacity: 0.4 },
  petWrap: { position: 'absolute', bottom: 34, zIndex: 2 },
  awayWrap: { position: 'absolute', left: 0, right: 0, bottom: 70, alignItems: 'center', zIndex: 3 },
  away: {
    width: '72%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#281E14',
    shadowOpacity: 0.16,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
});
