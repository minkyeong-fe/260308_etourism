import type { PricingRow, Region, RoomType } from './types'

type PricingKey = `${Region}_${RoomType}`

const ROOM_RATES: Partial<Record<PricingKey, PricingRow>> = {
  서울_스탠다드: {
    star: '3성',
    region: '서울',
    roomType: '스탠다드',
    weekdayLow: 110_000,
    weekendLow: 140_000,
    weekdayHigh: 160_000,
    weekendHigh: 190_000,
    peak: 236_500,
    breakfast: 20_000,
    extraBed: 25_000,
  },
  경주_디럭스: {
    star: '4성',
    region: '경주',
    roomType: '디럭스',
    weekdayLow: 176_000,
    weekendLow: 187_000,
    weekdayHigh: 174_000,
    weekendHigh: 221_667,
    peak: 268_750,
    breakfast: 23_439,
    extraBed: 42_000,
  },
  부산_스위트: {
    star: '5성',
    region: '부산',
    roomType: '스위트',
    weekdayLow: 360_000,
    weekendLow: 400_000,
    weekdayHigh: 430_000,
    weekendHigh: 485_000,
    peak: 506_000,
    breakfast: 50_000,
    extraBed: 67_550,
  },
}

export function getPricingRow(
  region: Region,
  roomType: RoomType
): PricingRow | null {
  const key: PricingKey = `${region}_${roomType}`
  return ROOM_RATES[key] ?? null
}

/** UI 옵션용: 데이터에 존재하는 지역 목록 */
export const REGIONS: Region[] = ['서울', '경주', '부산']

/** UI 옵션용: 데이터에 존재하는 룸타입 목록 */
export const ROOM_TYPES: RoomType[] = ['스탠다드', '디럭스', '스위트']
