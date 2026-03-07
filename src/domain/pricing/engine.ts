import { getStayDates } from "@/shared/utils/date";
import { getPricingRow } from "./data";
import { getSeason, isWeekend } from "./season";
import { DEFAULT_SEASON_CONFIG, DEFAULT_WEEKEND_DAYS } from "./seasonConfig";
import type {
  PricingInput,
  PricingResult,
  SeasonConfig,
  SeasonType,
  StayDetailItem,
} from "./types";
import { SEASON_TYPES } from "./types";

type AccKey = `${SeasonType}_${boolean}`;
type AccItem = {
  season: SeasonType;
  weekend: boolean;
  nights: number;
  rate: number;
};

/** 견적 계산 함수
 * @param input - 견적 입력 객체
 * @param options - 견적 옵션 객체
 * @returns 견적 결과 객체 또는 null
 */
export function calculateQuote(
  input: PricingInput,
  options?: { seasonConfig?: SeasonConfig },
): PricingResult | null {
  // ── 1단계: 입력·준비 ──
  // 1-1. 요금표 조회
  const row = getPricingRow(input.region, input.roomType);
  if (!row) return null;

  // 1-2. 숙박 일수·설정
  const config = options?.seasonConfig ?? DEFAULT_SEASON_CONFIG;
  const weekendDays = DEFAULT_WEEKEND_DAYS;
  const stayDates = getStayDates(input.checkIn, input.checkOut);
  const nights = stayDates.length;
  const extraBeds = input.extraBeds ?? 0;

  // ── 2단계: 숙박 요금 계산 ──
  // 2-1. 일별 요금 적용 및 (시즌·요일)별 집계
  const key = (season: SeasonType, weekend: boolean): AccKey =>
    `${season}_${weekend}`;
  const acc = {} as Record<AccKey, AccItem>;
  let stayTotal = 0;

  for (const date of stayDates) {
    const season = getSeason(date, config);
    const weekend = isWeekend(date, weekendDays);
    let rate: number;
    if (season === SEASON_TYPES.PEAK) {
      rate = row.peak;
    } else if (season === SEASON_TYPES.HIGH) {
      rate = weekend ? row.weekendHigh : row.weekdayHigh;
    } else {
      rate = weekend ? row.weekendLow : row.weekdayLow;
    }
    stayTotal += rate;
    const k = key(season, weekend);
    if (!acc[k]) {
      acc[k] = { season, weekend, nights: 0, rate };
    }
    acc[k].nights += 1;
  }

  // 2-2. 시즌별·요일별 숙박 내역 배열 생성
  const stayDetails: StayDetailItem[] = Object.values(acc).map(
    ({ season, weekend, nights: n, rate }) => ({
      season,
      weekend,
      nights: n,
      rate,
      amount: rate * n,
    }),
  );

  // ── 3단계: 부가 요금 계산 ──
  const breakfastTotal = row.breakfast * input.guests * nights;
  // 엑스트라베드: 박수(숙박 일수)별 부과 → 단가 × 대수 × 박수
  const extraBedTotal = row.extraBed * extraBeds * nights;
  const total = stayTotal + breakfastTotal + extraBedTotal;

  // ── 4단계: 견적 결과 조립·반환 ──
  return {
    total,
    breakdown: {
      stay: stayTotal,
      breakfast: breakfastTotal,
      extraBed: extraBedTotal,
      stayDetails,
      breakfastDetail: {
        rate: row.breakfast,
        guests: input.guests,
        nights,
        amount: breakfastTotal,
      },
      extraBedDetail: {
        rate: row.extraBed,
        count: extraBeds,
        nights,
        amount: extraBedTotal,
      },
    },
  };
}
