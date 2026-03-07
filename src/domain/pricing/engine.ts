import { getStayDates } from '../../shared/utils/date'
import { getPricingRow } from './data'
import { getSeason, isWeekend } from './season'
import { DEFAULT_SEASON_CONFIG, DEFAULT_WEEKEND_DAYS } from './seasonConfig'
import type {
  PricingInput,
  PricingResult,
  SeasonConfig,
} from './types'

export function calculateQuote(
  input: PricingInput,
  options?: { seasonConfig?: SeasonConfig }
): PricingResult | null {
  const row = getPricingRow(input.region, input.roomType)
  if (!row) return null

  const config = options?.seasonConfig ?? DEFAULT_SEASON_CONFIG
  const weekendDays = DEFAULT_WEEKEND_DAYS
  const stayDates = getStayDates(input.checkIn, input.checkOut)
  const nights = stayDates.length
  const extraBeds = input.extraBeds ?? 0

  let stayTotal = 0
  for (const date of stayDates) {
    const season = getSeason(date, config)
    const weekend = isWeekend(date, weekendDays)
    let rate: number
    if (season === '극성수기') {
      rate = row.peak
    } else if (season === '성수기') {
      rate = weekend ? row.weekendHigh : row.weekdayHigh
    } else {
      rate = weekend ? row.weekendLow : row.weekdayLow
    }
    stayTotal += rate
  }

  const breakfastTotal = row.breakfast * input.guests * nights
  const extraBedTotal = row.extraBed * extraBeds
  const total = stayTotal + breakfastTotal + extraBedTotal

  return {
    total,
    breakdown: {
      stay: stayTotal,
      breakfast: breakfastTotal,
      extraBed: extraBedTotal,
    },
  }
}
