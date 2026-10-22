/** 17 시·도 → 기상청 동네예보 격자 (nx, ny), using each 시·도청 소재지. */
export const GRID: Record<string, { name: string; nx: number; ny: number }> = {
  seoul: { name: '서울', nx: 60, ny: 127 },
  busan: { name: '부산', nx: 98, ny: 76 },
  daegu: { name: '대구', nx: 89, ny: 90 },
  incheon: { name: '인천', nx: 55, ny: 124 },
  gwangju: { name: '광주', nx: 58, ny: 74 },
  daejeon: { name: '대전', nx: 67, ny: 100 },
  ulsan: { name: '울산', nx: 102, ny: 84 },
  sejong: { name: '세종', nx: 66, ny: 103 },
  gyeonggi: { name: '경기', nx: 60, ny: 121 }, // 수원
  gangwon: { name: '강원', nx: 73, ny: 134 }, // 춘천
  chungbuk: { name: '충북', nx: 69, ny: 106 }, // 청주
  chungnam: { name: '충남', nx: 55, ny: 106 }, // 홍성(내포)
  jeonbuk: { name: '전북', nx: 63, ny: 89 }, // 전주
  jeonnam: { name: '전남', nx: 50, ny: 67 }, // 무안
  gyeongbuk: { name: '경북', nx: 91, ny: 106 }, // 안동
  gyeongnam: { name: '경남', nx: 90, ny: 77 }, // 창원
  jeju: { name: '제주', nx: 52, ny: 38 },
};
