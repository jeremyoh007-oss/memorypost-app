import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { CareRow } from '@/components/home/CareRow';
import { EventCard } from '@/components/home/EventCard';
import { Hero } from '@/components/home/Hero';
import { AlbumMini, MiniCards, ScheduleCard, WeatherCard } from '@/components/home/InfoCards';
import { SectionHead } from '@/components/ui';
import { SAMPLE_EVENTS } from '@/data/samples';
import { useTod } from '@/hooks/useClock';
import { CARE_KEYS, useGame } from '@/store/game';
import { useUI } from '@/store/ui';
import { C } from '@/theme/tokens';

export default function Home() {
  const { tod, minute, now } = useTod();
  const care = useGame((s) => s.care);
  const sample = useGame((s) => s.dev.sampleSchedule);
  const deviceEvents = useUI((s) => s.events);
  const scrollKey = useUI((s) => s.scrollTopKey);
  const ref = useRef<ScrollViewInstance>(null);
  const events = sample ? SAMPLE_EVENTS : deviceEvents;
  const doneN = CARE_KEYS.filter((k) => care[k]).length;

  useEffect(() => {
    if (scrollKey) ref.current?.scrollTo({ y: 0, animated: true });
  }, [scrollKey]);

  return (
    <View style={s.root}>
      <StatusBar style={tod === 'night' ? 'light' : 'dark'} />
      <ScrollView ref={ref} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 112 }}>
        <Hero tod={tod} now={now} minute={minute} />
        <View style={s.panel}>
          <SectionHead title="오늘의 돌봄" right={`${doneN} / 3`} />
          <CareRow />
          <EventCard />
          <WeatherCard hour={Math.floor(minute / 60)} />
          <MiniCards />
          <ScheduleCard events={events} minute={minute} sample={sample} />
          <AlbumMini />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  panel: {
    marginTop: -26,
    backgroundColor: C.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 18,
    paddingHorizontal: 16,
    gap: 12,
    zIndex: 3,
  },
});
