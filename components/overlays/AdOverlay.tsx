import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/Txt';
import { registerAdPresenter } from '@/services/ads';
import { setUI, useUI } from '@/store/ui';

/** Placeholder for a rewarded ad (no ad SDK yet). 3-second countdown, then the reward is granted. */
export function AdOverlay() {
  const open = useUI((s) => s.adOpen);
  const [n, setN] = useState(3);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  useEffect(() => {
    registerAdPresenter(
      () =>
        new Promise<boolean>((resolve) => {
          resolver.current = resolve;
          setN(3);
          setUI({ adOpen: true });
        }),
    );
    return () => registerAdPresenter(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const iv = setInterval(() => {
      setN((x) => {
        if (x <= 1) {
          clearInterval(iv);
          setUI({ adOpen: false });
          resolver.current?.(true);
          resolver.current = null;
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [open]);

  if (!open) return null;
  return (
    <View style={[StyleSheet.absoluteFill, s.bg]}>
      <View style={s.box}>
        <LinearGradient colors={['#2A3350', '#4D3A5C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Txt w={700} size={20} color="#fff" center style={{ marginBottom: 4 }}>
          광고 영상 자리
        </Txt>
        <Txt size={13} color="rgba(255,255,255,0.9)" center>
          원할 때만 보는 보상형 광고 · 하루 최대 4회
        </Txt>
      </View>
      <Txt size={14} color="rgba(255,255,255,0.8)" style={{ marginTop: 14 }}>
        {n}초 후 보상 지급
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { backgroundColor: '#0E0E10', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  box: { width: '100%', aspectRatio: 3 / 4, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', padding: 20 },
});
