// 각 옵션의 형태를 정의합니다.
export interface Option {
  label: string;
  value: string;
}

export const COLOR_OPTIONS: Option[] = [
  { label: '검정', value: 'BLACK' },
  { label: '하양', value: 'WHITE' },
  { label: '빨강', value: 'RED' },
  { label: '파랑', value: 'BLUE' },
  { label: '베이지', value: 'BEIGE' },
  { label: '그레이', value: 'GRAY' },
  { label: '네이비', value: 'NAVY' },
];

export const SEASON_OPTIONS: Option[] = [
  { label: '봄', value: 'SPRING' },
  { label: '여름', value: 'SUMMER' },
  { label: '가을', value: 'FALL' },
  { label: '겨울', value: 'WINTER' },
];

export const CATEGORY_OPTIONS: Option[] = [
  { label: '상의', value: 'TOP' },
  { label: '하의', value: 'BOTTOM' },
  { label: '원피스', value: 'DRESS' },
  { label: '아우터', value: 'OUTER' },
];

export const TAG_OPTIONS = [
  { label: '출근룩', value: 'daily' },
  { label: '데이트룩', value: 'date' },
  { label: '격식있는 룩', value: 'formal' },
  { label: '캐주얼룩', value: 'casual' },
  { label: '스포츠룩', value: 'sports' },
  { label: '여행/휴가룩', value: 'travel', },
];