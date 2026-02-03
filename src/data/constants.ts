// 각 옵션의 형태를 정의.
export interface Option {
  label: string;
  value: string;
  hex?: string; // 색상 코드를 저장할 필드 추가
}

export const COLOR_OPTIONS: Option[] = [
  { label: '검정', value: 'BLACK', hex: '#000000' },
  { label: '하양', value: 'WHITE', hex: '#FFFFFF' },
  { label: '빨강', value: 'RED', hex: '#d83535' },
  { label: '파랑', value: 'BLUE', hex: '#145abc' },
  { label: '베이지', value: 'BEIGE', hex: '#c4b38b' },
  { label: '그레이', value: 'GRAY', hex: '#a0a0a0' },
  { label: '네이비', value: 'NAVY', hex: '#00177f' },
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

export const SUB_CATEGORY_OPTIONS: Record<string, Option[]> = {
  TOP: [
    { label: '티셔츠', value: 't-shirt' },
    { label: '맨투맨', value: 'mantoman' },
    { label: '후드티', value: 'hoodie' },
    { label: '셔츠', value: 'shirt' },
    { label: '블라우스', value: 'blouse' },
    { label: '니트', value: 'knit' },
  ],
  BOTTOM: [
    { label: '청바지', value: 'jeans' },
    { label: '슬랙스', value: 'slacks' },
    { label: '반바지', value: 'shorts' },
    { label: '치마', value: 'skirt' },
  ],
  DRESS: [
    { label: '원피스', value: 'dress' },
  ],
  OUTER: [
    { label: '가디건', value: 'cardigan' },
    { label: '코트', value: 'coat' },
    { label: '패딩', value: 'padded-jacket' },
    { label: '블레이저', value: 'blazer' },
  ],
};

