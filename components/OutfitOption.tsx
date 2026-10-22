import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CHAR_ASPECT, IMAGES, type ImageKey } from '@/data/images';
import { C } from '@/theme/tokens';
import { Coin } from './Icons';
import { Txt } from './Txt';

/** One tile in a 4-column outfit row (travel sheet + wardrobe). */
export function OutfitOption({
  img,
  name,
  status,
  price,
  selected,
  dim,
  onPress,
}: {
  img: ImageKey;
  name: string;
  status?: string;
  price?: number;
  selected?: boolean;
  dim?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[s.opt, selected && s.sel]}>
      <Image source={IMAGES[img]} style={[s.img, dim && { opacity: 0.5 }]} contentFit="contain" transition={0} />
      <Txt w={500} size={12} lh={1.3} center>
        {name}
      </Txt>
      <View style={s.st}>
        {price !== undefined ? (
          <>
            <Coin size={11} />
            <Txt size={11} color={C.ink3} lh={1.3}>
              {price}
            </Txt>
          </>
        ) : (
          <Txt size={11} color={C.ink3} lh={1.3}>
            {status}
          </Txt>
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  opt: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.line,
  },
  sel: { borderWidth: 2, borderColor: C.ink, paddingVertical: 7, paddingHorizontal: 3 },
  img: { width: '100%', aspectRatio: CHAR_ASPECT, marginBottom: 2 },
  st: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
