import { describe, it, expect } from 'vitest'
import { Temporal } from '@js-temporal/polyfill'
import { getSeason, isWeekend } from '@/domain/pricing/season'
import { DEFAULT_SEASON_CONFIG, DEFAULT_WEEKEND_DAYS } from '@/domain/pricing/seasonConfig'

describe('getSeason', () => {
  const from = (y: number, m: number, d: number) =>
    Temporal.PlainDate.from({ year: y, month: m, day: d })

  it('7~8월이면 극성수기', () => {
    expect(getSeason(from(2025, 7, 1), DEFAULT_SEASON_CONFIG)).toBe('극성수기')
    expect(getSeason(from(2025, 8, 31), DEFAULT_SEASON_CONFIG)).toBe('극성수기')
  })

  it('3~6월, 9~10월이면 성수기', () => {
    expect(getSeason(from(2025, 3, 1), DEFAULT_SEASON_CONFIG)).toBe('성수기')
    expect(getSeason(from(2025, 6, 30), DEFAULT_SEASON_CONFIG)).toBe('성수기')
    expect(getSeason(from(2025, 9, 1), DEFAULT_SEASON_CONFIG)).toBe('성수기')
    expect(getSeason(from(2025, 10, 31), DEFAULT_SEASON_CONFIG)).toBe('성수기')
  })

  it('1~2월, 11~12월이면 비수기', () => {
    expect(getSeason(from(2025, 1, 1), DEFAULT_SEASON_CONFIG)).toBe('비수기')
    expect(getSeason(from(2025, 2, 28), DEFAULT_SEASON_CONFIG)).toBe('비수기')
    expect(getSeason(from(2025, 11, 1), DEFAULT_SEASON_CONFIG)).toBe('비수기')
    expect(getSeason(from(2025, 12, 31), DEFAULT_SEASON_CONFIG)).toBe('비수기')
  })
})

describe('isWeekend', () => {
  const from = (y: number, m: number, d: number) =>
    Temporal.PlainDate.from({ year: y, month: m, day: d })

  it('금·토이면 true (Temporal: 5=금, 6=토)', () => {
    expect(isWeekend(from(2025, 1, 10), DEFAULT_WEEKEND_DAYS)).toBe(true) // 금
    expect(isWeekend(from(2025, 1, 11), DEFAULT_WEEKEND_DAYS)).toBe(true) // 토
  })

  it('일~목이면 false', () => {
    expect(isWeekend(from(2025, 1, 12), DEFAULT_WEEKEND_DAYS)).toBe(false) // 일
    expect(isWeekend(from(2025, 1, 13), DEFAULT_WEEKEND_DAYS)).toBe(false) // 월
    expect(isWeekend(from(2025, 1, 14), DEFAULT_WEEKEND_DAYS)).toBe(false) // 화
  })
})
