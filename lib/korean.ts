/** Korean particle (조사) helpers based on the final consonant (받침) of the last syllable. */
const lastCode = (word: string): number | null => {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 ? code % 28 : null;
};
const hasBatchim = (w: string) => {
  const c = lastCode(w);
  return c !== null && c !== 0;
};

/** 이/가 */
export const iGa = (w: string) => w + (hasBatchim(w) ? '이' : '가');
/** 을/를 */
export const eulReul = (w: string) => w + (hasBatchim(w) ? '을' : '를');
/** 은/는 */
export const eunNeun = (w: string) => w + (hasBatchim(w) ? '은' : '는');
/** 으로/로 (ㄹ 받침 → 로) */
export const euro = (w: string) => {
  const c = lastCode(w);
  return w + (c !== null && c !== 0 && c !== 8 ? '으로' : '로');
};
