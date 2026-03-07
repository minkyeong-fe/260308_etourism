export type Region = '서울' | '경주' | '부산'
export type RoomType = '스탠다드' | '디럭스' | '스위트'

export interface PricingRow {
  star: string
  region: Region
  roomType: RoomType
  weekdayLow: number
  weekendLow: number
  weekdayHigh: number
  weekendHigh: number
  peak: number
  breakfast: number
  extraBed: number
}

export interface PricingInput {
  checkIn: string
  checkOut: string
  region: Region
  roomType: RoomType
  guests: number
  extraBeds?: number
}

export interface PricingResult {
  total: number
  breakdown: {
    stay: number
    breakfast: number
    extraBed: number
  }
}

export type SeasonType = '극성수기' | '성수기' | '비수기'

export interface SeasonRange {
  start: string
  end: string
}

export interface SeasonConfig {
  극성수기: SeasonRange[]
  성수기: SeasonRange[]
  비수기: SeasonRange[]
}
