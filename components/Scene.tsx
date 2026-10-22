import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CHAR_ASPECT, IMAGES, type ImageKey } from '@/data/images';
import { CITIES, type CityId } from '@/data/cities';
import { SoftShadow } from './SoftShadow';

/**
 * A postcard scene: city background + character art standing at the bottom (76% height).
 * `locked` renders the empty album slot: no background, faint silhouette.
 */
export function Scene({ city, img, locked, style }: { city: CityId; img: ImageKey; locked?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[s.scene, style]}>
      {!locked && <Image source={IMAGES[CITIES[city].bg]} style={StyleSheet.absoluteFill} contentFit="cover" transition={0} />}
      {!locked && <SoftShadow style={s.shadow} color="#000" opacity={0.35} />}
      <View style={s.charWrap} pointerEvents="none">
        <Image
          source={IMAGES[img]}
          style={[s.char, locked && { opacity: 0.08 }]}
          contentFit="contain"
          tintColor={locked ? '#000' : undefined}
          transition={0}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  scene: { width: '100%', aspectRatio: 900 / 640, overflow: 'hidden' },
  charWrap: { position: 'absolute', left: 0, right: 0, bottom: '2%', height: '76%', alignItems: 'center' },
  char: { height: '100%', aspectRatio: CHAR_ASPECT },
  shadow: { left: '39%', width: '22%', bottom: '0%', height: '5%' },
});
