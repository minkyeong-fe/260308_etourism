import { Temporal } from "@js-temporal/polyfill";
import type { SeasonConfig, SeasonType } from "./types";
import { SEASON_TYPES } from "./types";
import { DEFAULT_SEASON_CONFIG, DEFAULT_WEEKEND_DAYS } from "./seasonConfig";

function toMMDD(date: Temporal.PlainDate): string {
  const m = date.month.toString().padStart(2, "0");
  const d = date.day.toString().padStart(2, "0");
  return `${m}-${d}`;
}

function isInRange(mmdd: string, start: string, end: string): boolean {
  return mmdd >= start && mmdd <= end;
}

/** 시즌 판별 함수 */
export function getSeason(
  date: Temporal.PlainDate,
  config: SeasonConfig = DEFAULT_SEASON_CONFIG,
): SeasonType {
  const mmdd = toMMDD(date);
  if (config[SEASON_TYPES.PEAK].some((r) => isInRange(mmdd, r.start, r.end)))
    return SEASON_TYPES.PEAK;
  if (config[SEASON_TYPES.HIGH].some((r) => isInRange(mmdd, r.start, r.end)))
    return SEASON_TYPES.HIGH;
  return SEASON_TYPES.LOW;
}

/** 주말 여부 판별 함수 */
export function isWeekend(
  date: Temporal.PlainDate,
  weekendDays: number[] = DEFAULT_WEEKEND_DAYS,
): boolean {
  return weekendDays.includes(date.dayOfWeek);
}
