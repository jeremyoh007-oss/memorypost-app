import { GowunBatang_400Regular, GowunBatang_700Bold } from '@expo-google-fonts/gowun-batang';
import {
  NotoSansKR_300Light,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/js-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OverlayHost } from '@/components/overlays/OverlayHost';
import { TabBar } from '@/components/TabBar';
import { useInfoLoader } from '@/hooks/useInfo';
import { checkIn, tickTrip } from '@/store/actions';
import { useGame } from '@/store/game';
import { C } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useHydrated() {
  const [ok, setOk] = useState(() => useGame.persist.hasHydrated());
  useEffect(() => {
    const unsub = useGame.persist.onFinishHydration(() => setOk(true));
    setOk(useGame.persist.hasHydrated());
    return unsub;
  }, []);
  return ok;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSansKR_300Light,
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_600SemiBold,
    NotoSansKR_700Bold,
    GowunBatang_400Regular,
    GowunBatang_700Bold,
  });
  const hydrated = useHydrated();
  const ready = (fontsLoaded || !!fontError) && hydrated;
  useInfoLoader(ready);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {});
    const t = setTimeout(() => checkIn('launch'), 400);
    const iv = setInterval(tickTrip, 20_000);
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') checkIn('resume');
    });
    return () => {
      clearTimeout(t);
      clearInterval(iv);
      sub.remove();
    };
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  return (
    <SafeAreaProvider>
      <View style={s.root}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: C.bg } }}
        >
          <Tabs.Screen name="index" options={{ title: '홈' }} />
          <Tabs.Screen name="album" options={{ title: '엽서함' }} />
          <Tabs.Screen name="wardrobe" options={{ title: '옷장' }} />
          <Tabs.Screen name="friends" options={{ title: '친구들' }} />
        </Tabs>
        <OverlayHost />
      </View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: C.bg } });
