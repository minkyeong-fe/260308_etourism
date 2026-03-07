import type { SeasonConfig } from './types'

/** 기본 시즌 구간: 극성수기 7-8월, 성수기 3-6·9-10월, 비수기 1-2·11-12월 */
export const DEFAULT_SEASON_CONFIG: SeasonConfig = {
  극성수기: [{ start: '07-01', end: '08-31' }],
  성수기: [
    { start: '03-01', end: '06-30' },
    { start: '09-01', end: '10-31' },
  ],
  비수기: [
    { start: '01-01', end: '02-29' },
    { start: '11-01', end: '12-31' },
  ],
}

/** 기본 주말 요일 (Temporal: 1=Mon … 5=Fri, 6=Sat, 7=Sun) → 금·토·일 */
export const DEFAULT_WEEKEND_DAYS: number[] = [5, 6, 7]
