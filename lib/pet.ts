import { CH, type CharId } from '@/data/characters';
import type { ImageKey } from '@/data/images';
import type { OutfitId } from '@/data/outfits';

export type Pose = 'idle' | 'wave' | 'happy' | 'sad' | 'sleep';

/** Image for a character wearing an outfit (idle pose). Every character has the full outfit set. */
export const outfitImage = (ch: CharId, o: OutfitId): ImageKey => {
  const c = CH[ch];
  return o === 'none' ? c.idle : (`${c.pre}_${o}` as ImageKey);
};

/** Image for a pose. 'idle' falls back to the outfit image. */
export const poseImage = (ch: CharId, pose: Pose, o: OutfitId): ImageKey => {
  if (pose === 'idle') return outfitImage(ch, o);
  return `${CH[ch].pre}_${pose}` as ImageKey;
};
