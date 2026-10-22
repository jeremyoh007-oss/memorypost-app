import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/Txt';
import { Btn } from '@/components/ui';
import { CH } from '@/data/characters';
import { IMAGES } from '@/data/images';
import { unlockChar, toast } from '@/store/actions';
import { setUI, useUI } from '@/store/ui';
import { purchases } from '@/services/purchases';
import { C } from '@/theme/tokens';

/** Mock store purchase sheet. Goes through services/purchases.ts (mock: nothing is charged). */
export function StoreOverlay() {
  const k = useUI((s) => s.storeFor);
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  useEffect(() => setBusy(false), [k]);
  if (!k) return null;
  const c = CH[k];
  const limited = c.kind === 'limited';

  const buy = async () => {
    if (busy || !c.productId) return;
    setBusy(true);
    const r = await purchases.purchase(c.productId);
    setUI({ storeFor: null });
    setBusy(false);
    if (r.ok) unlockChar(k, `${limited ? '겨울 한정판 · ' : ''}${c.price} 더미 결제 완료`, 'buy');
    else if (r.reason !== 'cancelled') toast('결제를 마치지 못했어요. 잠시 후 다시 해 봐요');
  };

  return (
    <View style={[StyleSheet.absoluteFill, s.bg, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => !busy && setUI({ storeFor: null })} accessibilityLabel="닫기" />
      <View style={s.box}>
        <Txt w={600} size={12} color="#5f6368" style={{ marginBottom: 10 }}>
          스토어 결제 · 테스트
        </Txt>
        <View style={s.row}>
          <Image source={IMAGES[c.idle]} style={s.img} contentFit="contain" />
          <View style={{ flex: 1 }}>
            <Txt w={700} size={15}>
              {c.name}
              {limited ? ' (겨울 한정판)' : ''}
            </Txt>
            <Txt size={12} color={C.ink2}>
              추억 우체국 · 친구
            </Txt>
          </View>
          <Txt w={700} size={15}>
            ₩{(c.price ?? '').replace('원', '')}
          </Txt>
        </View>
        <Txt size={12} color={C.ink2} style={{ marginTop: 10, marginBottom: 12 }}>
          더미 결제예요. 실제로 결제되지 않아요.
        </Txt>
        <Btn title={busy ? '결제 중…' : '구매'} onPress={buy} disabled={busy} />
        <Btn title="취소" variant="light" style={{ marginTop: 8 }} disabled={busy} onPress={() => setUI({ storeFor: null })} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { backgroundColor: 'rgba(20,18,15,0.45)', justifyContent: 'flex-end', paddingHorizontal: 10 },
  box: { width: '100%', backgroundColor: '#fff', borderRadius: 24, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  img: { width: 52, height: 52, backgroundColor: '#F3EEE6', borderRadius: 12 },
});
