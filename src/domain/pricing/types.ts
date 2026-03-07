export const REGIONS = {
  SEOUL: "서울",
  GYEONGJU: "경주",
  BUSAN: "부산",
} as const;

export type Region = (typeof REGIONS)[keyof typeof REGIONS];

/** UI 옵션용: 지역 목록 (types.ts 단일 정의) */
export const REGION_OPTIONS = Object.values(REGIONS) as Region[];

export const ROOM_TYPES = {
  STANDARD: "스탠다드",
  DELUXE: "디럭스",
  SUITE: "스위트",
} as const;

export type RoomType = (typeof ROOM_TYPES)[keyof typeof ROOM_TYPES];

/** UI 옵션용: 룸타입 목록 (types.ts 단일 정의) */
export const ROOM_TYPE_OPTIONS = Object.values(ROOM_TYPES) as RoomType[];

export interface PricingRow {
  star: string;
  region: Region;
  roomType: RoomType;
  weekdayLow: number;
  weekendLow: number;
  weekdayHigh: number;
  weekendHigh: number;
  peak: number;
  breakfast: number;
  extraBed: number;
}

export interface PricingInput {
  checkIn: string;
  checkOut: string;
  region: Region;
  roomType: RoomType;
  guests: number;
  extraBeds?: number;
}

/** 숙박 요금의 시즌·요일별 내역 (같은 시즌+평일/주말끼리 묶음) */
export interface StayDetailItem {
  season: SeasonType;
  weekend: boolean;
  nights: number;
  rate: number;
  amount: number;
}

/** 조식: 단가 × 인원 × 박수 */
export interface BreakfastDetail {
  rate: number;
  guests: number;
  nights: number;
  amount: number;
}

/** 엑스트라베드: 단가 × 개수 × 박수. 박수(숙박 일수)별로 부과됨. */
export interface ExtraBedDetail {
  rate: number;
  count: number;
  nights: number;
  amount: number;
}

export interface PricingResult {
  total: number;
  breakdown: {
    stay: number;
    breakfast: number;
    extraBed: number;
    stayDetails: StayDetailItem[];
    breakfastDetail: BreakfastDetail;
    extraBedDetail: ExtraBedDetail;
  };
}

export const SEASON_TYPES = {
  PEAK: "극성수기",
  HIGH: "성수기",
  LOW: "비수기",
} as const;

export type SeasonType = (typeof SEASON_TYPES)[keyof typeof SEASON_TYPES];

export interface SeasonRange {
  start: string;
  end: string;
}

export interface SeasonConfig {
  [SEASON_TYPES.PEAK]: SeasonRange[];
  [SEASON_TYPES.HIGH]: SeasonRange[];
  [SEASON_TYPES.LOW]: SeasonRange[];
}
