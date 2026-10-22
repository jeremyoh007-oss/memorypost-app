import type { ImageKey } from './images';
import type { OutfitId } from './outfits';

export type CityId = 'seoul' | 'busan' | 'paris' | 'newyork';
export type TravelRegion = '국내' | '해외';

export type City = {
  name: string;
  region: TravelRegion;
  sub: string;
  bg: ImageKey;
  /** Letter text per outfit. "강아지" is replaced by the friend's name for other characters. */
  letter: Record<OutfitId, string>;
  /** Domestic only: places to visit together (sample; later from 한국관광공사 TourAPI). */
  places?: [string, string][];
};

export const CITIES: Record<CityId, City> = {
  seoul: {
    name: '서울', region: '국내', sub: '한옥 골목 · 은행나무', bg: 'bg_seoul',
    letter: {
      none: '한옥 골목에 은행잎이 잔뜩 떨어져 있었어요. 밟을 때마다 바스락!',
      straw: '모자 위에 은행잎이 내려앉았어요. 가을 선물 같죠?',
      beret: '골목 찻집 앞에서 한참 구경했어요. 베레모가 잘 어울린대요!',
      beanie: '바람이 찼는데 털모자 덕분에 하나도 안 추웠어요.',
    },
    places: [['볼거리', '북촌 한옥마을 · 경복궁'], ['먹을 곳', '한옥 찻집 · 칼국수 골목'], ['이번 달', '궁궐 가을 야간 관람']],
  },
  busan: {
    name: '부산', region: '국내', sub: '바닷가 · 빨간 등대', bg: 'bg_busan',
    letter: {
      none: '파도 소리 들으면서 모래사장을 한참 걸었어요.',
      straw: '바닷바람에 모자가 날아갈 뻔했어요! 국밥 냄새가 너무 좋았어요.',
      beret: '빨간 등대 앞에서 사진을 찍었어요. 베레모 쓴 제가 제일 멋있대요.',
      beanie: '바다는 추웠지만 털모자 쓰고 어묵 국물 생각만 했어요.',
    },
    places: [['볼거리', '해운대 해수욕장 · 감천문화마을'], ['먹을 곳', '돼지국밥 골목 · 밀면 집'], ['이번 달', '바다 불꽃 축제']],
  },
  paris: {
    name: '파리', region: '해외', sub: '카페 거리', bg: 'bg_paris',
    letter: {
      none: '돌길이 울퉁불퉁해서 깡총깡총 뛰어다녔어요. 빵 냄새가 났어요!',
      straw: '햇볕이 쨍쨍해서 밀짚모자 쓰길 정말 잘했어요.',
      beret: '카페 아저씨가 진짜 파리 강아지인 줄 알았대요!',
      beanie: '털모자 쓰고 따뜻한 코코아를 마셨어요. 다음엔 같이 와요.',
    },
  },
  newyork: {
    name: '뉴욕', region: '해외', sub: '저녁 거리 · 노란 택시', bg: 'bg_newyork',
    letter: {
      none: '불빛이 하나둘 켜지는 거리를 걸었어요. 노란 택시가 정말 많아요!',
      straw: '저녁이라 밀짚모자는 좀 어색했지만 그래도 귀엽죠?',
      beret: '계단에 앉아서 반짝이는 빌딩을 한참 봤어요.',
      beanie: '바람 부는 저녁, 털모자 쓰고 빌딩 숲을 걸었어요.',
    },
  },
};

export const CITY_IDS = Object.keys(CITIES) as CityId[];

export type DurId = '1h' | '3h' | '8h';
export type Duration = { k: DurId; label: string; sub: string; reward: number; hours: number };

export const DURS: Duration[] = [
  { k: '1h', label: '1시간', sub: '짧게', reward: 10, hours: 1 },
  { k: '3h', label: '3시간', sub: '반나절', reward: 25, hours: 3 },
  { k: '8h', label: '8시간', sub: '자고 일어나면', reward: 40, hours: 8 },
];

export const durOf = (k: DurId): Duration => DURS.find((d) => d.k === k) ?? DURS[1];
