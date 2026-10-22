/** 17 시·도 the user can pick for weather. No GPS / location permission is used. */
export type RegionId =
  | 'seoul' | 'busan' | 'daegu' | 'incheon' | 'gwangju' | 'daejeon' | 'ulsan' | 'sejong'
  | 'gyeonggi' | 'gangwon' | 'chungbuk' | 'chungnam' | 'jeonbuk' | 'jeonnam' | 'gyeongbuk' | 'gyeongnam' | 'jeju';

export const REGIONS: { id: RegionId; name: string; full: string }[] = [
  { id: 'seoul', name: '서울', full: '서울특별시' },
  { id: 'busan', name: '부산', full: '부산광역시' },
  { id: 'daegu', name: '대구', full: '대구광역시' },
  { id: 'incheon', name: '인천', full: '인천광역시' },
  { id: 'gwangju', name: '광주', full: '광주광역시' },
  { id: 'daejeon', name: '대전', full: '대전광역시' },
  { id: 'ulsan', name: '울산', full: '울산광역시' },
  { id: 'sejong', name: '세종', full: '세종특별자치시' },
  { id: 'gyeonggi', name: '경기', full: '경기도' },
  { id: 'gangwon', name: '강원', full: '강원특별자치도' },
  { id: 'chungbuk', name: '충북', full: '충청북도' },
  { id: 'chungnam', name: '충남', full: '충청남도' },
  { id: 'jeonbuk', name: '전북', full: '전북특별자치도' },
  { id: 'jeonnam', name: '전남', full: '전라남도' },
  { id: 'gyeongbuk', name: '경북', full: '경상북도' },
  { id: 'gyeongnam', name: '경남', full: '경상남도' },
  { id: 'jeju', name: '제주', full: '제주특별자치도' },
];

export const regionName = (id: RegionId): string => REGIONS.find((r) => r.id === id)?.name ?? '서울';
