import { Temporal } from '@js-temporal/polyfill'
import type { SeasonConfig, SeasonType } from './types'
import { DEFAULT_SEASON_CONFIG, DEFAULT_WEEKEND_DAYS } from './seasonConfig'

function toMMDD(date: Temporal.PlainDate): string {
  const m = date.month.toString().padStart(2, '0')
  const d = date.day.toString().padStart(2, '0')
  return `${m}-${d}`
}

function isInRange(mmdd: string, start: string, end: string): boolean {
  return mmdd >= start && mmdd <= end
}

export function getSeason(
  date: Temporal.PlainDate,
  config: SeasonConfig = DEFAULT_SEASON_CONFIG
): SeasonType {
  const mmdd = toMMDD(date)
  if (config.극성수기.some((r) => isInRange(mmdd, r.start, r.end))) return '극성수기'
  if (config.성수기.some((r) => isInRange(mmdd, r.start, r.end))) return '성수기'
  return '비수기'
}

export function isWeekend(
  date: Temporal.PlainDate,
  weekendDays: number[] = DEFAULT_WEEKEND_DAYS
): boolean {
  return weekendDays.includes(date.dayOfWeek)
}
