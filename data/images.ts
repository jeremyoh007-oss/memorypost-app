/** Static require map for all bundled webp art. Keys match the prototype's asset names. */
export const IMAGES = {
  bg_room: require('../assets/images/bg_room.webp'),
  bg_seoul: require('../assets/images/bg_seoul.webp'),
  bg_busan: require('../assets/images/bg_busan.webp'),
  bg_paris: require('../assets/images/bg_paris.webp'),
  bg_newyork: require('../assets/images/bg_newyork.webp'),

  pet_idle: require('../assets/images/pet_idle.webp'),
  pet_wave: require('../assets/images/pet_wave.webp'),
  pet_happy: require('../assets/images/pet_happy.webp'),
  pet_sad: require('../assets/images/pet_sad.webp'),
  pet_sleep: require('../assets/images/pet_sleep.webp'),
  pet_straw: require('../assets/images/pet_straw.webp'),
  pet_beret: require('../assets/images/pet_beret.webp'),
  pet_beanie: require('../assets/images/pet_beanie.webp'),

  char_cat: require('../assets/images/char_cat.webp'),
  cat_wave: require('../assets/images/cat_wave.webp'),
  cat_happy: require('../assets/images/cat_happy.webp'),
  cat_sad: require('../assets/images/cat_sad.webp'),
  cat_sleep: require('../assets/images/cat_sleep.webp'),
  cat_straw: require('../assets/images/cat_straw.webp'),
  cat_beret: require('../assets/images/cat_beret.webp'),
  cat_beanie: require('../assets/images/cat_beanie.webp'),

  char_fox: require('../assets/images/char_fox.webp'),
  fox_wave: require('../assets/images/fox_wave.webp'),
  fox_happy: require('../assets/images/fox_happy.webp'),
  fox_sad: require('../assets/images/fox_sad.webp'),
  fox_sleep: require('../assets/images/fox_sleep.webp'),
  fox_straw: require('../assets/images/fox_straw.webp'),
  fox_beret: require('../assets/images/fox_beret.webp'),
  fox_beanie: require('../assets/images/fox_beanie.webp'),

  char_lion: require('../assets/images/char_lion.webp'),
  lion_wave: require('../assets/images/lion_wave.webp'),
  lion_happy: require('../assets/images/lion_happy.webp'),
  lion_sad: require('../assets/images/lion_sad.webp'),
  lion_sleep: require('../assets/images/lion_sleep.webp'),
  lion_straw: require('../assets/images/lion_straw.webp'),
  lion_beret: require('../assets/images/lion_beret.webp'),
  lion_beanie: require('../assets/images/lion_beanie.webp'),

  char_penguin: require('../assets/images/char_penguin.webp'),
  penguin_wave: require('../assets/images/penguin_wave.webp'),
  penguin_happy: require('../assets/images/penguin_happy.webp'),
  penguin_sad: require('../assets/images/penguin_sad.webp'),
  penguin_sleep: require('../assets/images/penguin_sleep.webp'),
  penguin_straw: require('../assets/images/penguin_straw.webp'),
  penguin_beret: require('../assets/images/penguin_beret.webp'),
  penguin_beanie: require('../assets/images/penguin_beanie.webp'),
} as const;

export type ImageKey = keyof typeof IMAGES;

/** Character art is 470x635. */
export const CHAR_ASPECT = 470 / 635;

/**
 * Head-top ratio per image (fraction of image height where the head ends),
 * used to sit the speech bubble just above the character. From the prototype's HEAD table.
 */
export const HEAD: Partial<Record<ImageKey, number>> = {
  fox_happy: 0.746, fox_sad: 0.698, fox_sleep: 0.746, fox_wave: 0.743, fox_straw: 0.78, fox_beret: 0.776, fox_beanie: 0.827,
  lion_happy: 0.736, lion_sad: 0.757, lion_sleep: 0.75, lion_wave: 0.743, lion_straw: 0.783, lion_beret: 0.773, lion_beanie: 0.843,
  penguin_happy: 0.757, penguin_sad: 0.757, penguin_sleep: 0.757, penguin_wave: 0.757, penguin_straw: 0.811, penguin_beret: 0.806, penguin_beanie: 0.881,
  cat_happy: 0.776, cat_sad: 0.685, cat_sleep: 0.739, cat_wave: 0.743, cat_straw: 0.784, cat_beret: 0.771, cat_beanie: 0.855,
  char_cat: 0.757, char_fox: 0.757, char_lion: 0.757, char_penguin: 0.757,
  pet_idle: 0.781, pet_happy: 0.857, pet_sad: 0.813, pet_straw: 0.917, pet_beret: 0.891, pet_beanie: 0.988, pet_wave: 0.757, pet_sleep: 0.781,
};
