import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconChevron, IconChevronDown, SkyIcon } from '@/components/Icons';
import { Txt } from '@/components/Txt';
import { Card, CardLabel } from '@/components/ui';
import { CITIES } from '@/data/cities';
import { IMAGES } from '@/data/images';
import { regionName } from '@/data/regions';
import { hmToMin } from '@/lib/time';
import { infoTap } from '@/store/actions';
import { useGame } from '@/store/game';
import { setUI, useUI } from '@/store/ui';
import { DUST_LABEL, rainSub, SKY_LABEL } from '@/services/weather';
import type { CalendarEvent } from '@/services/calendar';
import { C } from '@/theme/tokens';
import { router } from 'expo-router';
import { CITY_IDS } from '@/data/cities';
import { OUTFIT_IDS } from '@/data/outfits';

const isNightHour = (h: number) => h >= 19 || h < 6;

export function WeatherCard({ hour }: { hour: number }) {
  const w = useUI((s) => s.weather);
  const region = useGame((s) => s.weatherRegion);
  const label = (
    <Pressable onPress={() => setUI({ sheet: 'region' })} hitSlop={8} accessibilityRole="button" accessibilityLabel="지역 바꾸기" style={s.region}>
      <Txt w={600} size={12} color={C.ink2}>
        {regionName(region)} · 날씨
      </Txt>
      <IconChevronDown />
    </Pressable>
  );
  return (
    <Card onPress={() => infoTap('weather')} label="날씨">
      <CardLabel left={label} right={w?.source === 'kma' ? '기상청 단기예보' : '예시 데이터'} />
      {w ? (
        <>
          <View style={s.wxTop}>
            <Txt w={300} size={44} lh={1} ls={-0.04} tabular>
              {w.temp}°
            </Txt>
            <View>
              <Txt w={600} size={15} lh={1.3}>
                {SKY_LABEL[w.sky]}
              </Txt>
              <Txt size={12.5} color={C.ink2}>
                최고 {w.max}° · 최저 {w.min}°
              </Txt>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <SkyIcon sky={w.sky} night={isNightHour(hour)} size={44} big />
            </View>
          </View>
          <View style={s.hours}>
            {[{ hour: -1, temp: w.temp, sky: w.sky }, ...w.hourly].slice(0, 5).map((h, i) => (
              <View key={i} style={s.hourCol}>
                <Txt w={i === 0 ? 600 : 400} size={12} color={i === 0 ? C.ink : C.ink2} tabular>
                  {i === 0 ? '지금' : `${h.hour}시`}
                </Txt>
                <View style={{ marginVertical: 4 }}>
                  <SkyIcon sky={h.sky} night={isNightHour(i === 0 ? hour : h.hour)} size={22} />
                </View>
                <Txt w={600} size={13} tabular>
                  {h.temp}°
                </Txt>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Txt size={13} color={C.ink2}>
          날씨를 불러오고 있어요
        </Txt>
      )}
    </Card>
  );
}

export function MiniCards() {
  const w = useUI((s) => s.weather);
  const dust = w?.dust ? DUST_LABEL[w.dust] : null;
  return (
    <View style={s.two}>
      <Card onPress={() => infoTap('dust')} style={{ flex: 1 }} label="미세먼지">
        <CardLabel left="미세먼지" />
        <View style={s.bigRow}>
          {dust && <View style={[s.dustDot, { backgroundColor: dust.color }]} />}
          <Txt w={700} size={20} lh={1.2}>
            {dust ? dust.text : '—'}
          </Txt>
        </View>
        <Txt size={12} color={C.ink2} style={{ marginTop: 2 }}>
          {dust ? dust.sub : '곧 알려 드릴게요'}
        </Txt>
      </Card>
      <Card onPress={() => infoTap('rain')} style={{ flex: 1 }} label="비 올 확률">
        <CardLabel left="비 올 확률" />
        <Txt w={700} size={20} lh={1.2} style={{ marginTop: 2 }} tabular>
          {w ? `${w.pop}%` : '—'}
        </Txt>
        <Txt size={12} color={C.ink2} style={{ marginTop: 2 }}>
          {w ? rainSub(w.pop) : ''}
        </Txt>
      </Card>
    </View>
  );
}

export function ScheduleCard({ events, minute, sample }: { events: CalendarEvent[]; minute: number; sample: boolean }) {
  const status = useUI((s) => s.calStatus);
  let note: string | null = null;
  if (!sample) {
    if (status === 'denied') note = '캘린더 접근을 허용하지 않아서 일정을 숨겼어요. 설정에서 허용하면 여기에 보여 드려요.';
    else if (status === 'unavailable') note = '이 기기에서는 캘린더를 읽을 수 없어요. 휴대폰 앱에서 오늘 일정을 보여 드려요.';
    else if (status === 'loading') note = '일정을 확인하고 있어요';
    else if (!events.length) note = '오늘은 일정이 없어요. 여유로운 하루 보내요';
  }
  let nextSet = false;
  return (
    <Card>
      <CardLabel left="오늘 일정" right={sample ? '캘린더 연동 · 예시' : '기기 캘린더 · 기기 안에서만 읽어요'} />
      {note ? (
        <Txt size={13} color={C.ink2} lh={1.5}>
          {note}
        </Txt>
      ) : (
        events.map((e, i) => {
          const min = hmToMin(e.start);
          const past = min < minute;
          let tag: string | null = null;
          if (!past && !nextSet) {
            nextSet = true;
            const df = min - minute;
            tag = df < 60 ? `${df}분 뒤` : `${Math.round(df / 60)}시간 뒤`;
          }
          return (
            <Pressable
              key={e.id}
              onPress={() => infoTap('sched', e.title)}
              accessibilityRole="button"
              style={[s.li, i > 0 && s.liBorder, i === 0 && { paddingTop: 2 }, past && { opacity: 0.45 }]}
            >
              <Txt w={600} size={13} style={{ width: 42 }} tabular>
                {e.start}
              </Txt>
              <View style={[s.bar, { backgroundColor: e.color }]} />
              <View style={{ flex: 1 }}>
                <Txt w={500} size={14} lh={1.35}>
                  {e.title}
                </Txt>
                {e.location ? (
                  <Txt size={12} color={C.ink2} lh={1.35}>
                    {e.location}
                  </Txt>
                ) : null}
              </View>
              {tag && (
                <View style={s.tag}>
                  <Txt w={600} size={11} color={C.accent} lh={1.4}>
                    {tag}
                  </Txt>
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </Card>
  );
}

export function AlbumMini() {
  const cards = useGame((s) => s.cards);
  const last = cards.slice(-2);
  const total = CITY_IDS.length * OUTFIT_IDS.length;
  return (
    <Card onPress={() => router.navigate('/album')} style={s.albumMini} label="엽서함">
      <View style={s.stack}>
        {last.map((x, i) => (
          <View key={i} style={[s.stackCard, i === 0 && last.length > 1 ? { transform: [{ rotate: '-6deg' }, { translateX: -4 }, { translateY: 2 }] } : { transform: [{ rotate: '4deg' }] }]}>
            <Image source={IMAGES[CITIES[x.c].bg]} style={StyleSheet.absoluteFill} contentFit="cover" />
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <Txt w={700} size={15}>
          엽서함
        </Txt>
        <Txt size={12.5} color={C.ink2}>
          {cards.length}장 모았어요 · 전체 {total}종
        </Txt>
      </View>
      <IconChevron />
    </Card>
  );
}

const s = StyleSheet.create({
  region: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  wxTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hours: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line },
  hourCol: { flex: 1, alignItems: 'center' },
  two: { flexDirection: 'row', gap: 12 },
  bigRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dustDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  li: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  liBorder: { borderTopWidth: 1, borderTopColor: C.line },
  bar: { width: 3, alignSelf: 'stretch', borderRadius: 3 },
  tag: { backgroundColor: C.accentSoft, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 8 },
  albumMini: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stack: { width: 80, height: 56 },
  stackCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#281E14',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
