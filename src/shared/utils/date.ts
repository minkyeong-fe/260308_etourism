import { Temporal } from '@js-temporal/polyfill'

/** YYYY-MM-DD 문자열을 PlainDate로 파싱 */
export function parseDate(isoDate: string): Temporal.PlainDate {
  return Temporal.PlainDate.from(isoDate)
}

/** PlainDate를 YYYY-MM-DD 문자열로 */
export function formatDate(date: Temporal.PlainDate): string {
  return date.toString()
}

/**
 * 체크인~체크아웃 전일까지 1박 단위 날짜 배열 (각 요소는 그날 밤 숙박에 해당하는 날짜).
 * checkOut 당일은 제외 (체크아웃일 전날까지가 마지막 숙박).
 */
export function getStayDates(
  checkIn: string,
  checkOut: string
): Temporal.PlainDate[] {
  const start = Temporal.PlainDate.from(checkIn)
  const end = Temporal.PlainDate.from(checkOut)
  if (Temporal.PlainDate.compare(start, end) >= 0) return []

  const dates: Temporal.PlainDate[] = []
  let current = start
  while (Temporal.PlainDate.compare(current, end) < 0) {
    dates.push(current)
    current = current.add({ days: 1 })
  }
  return dates
}

/** 박수(숙박 일수) 계산 */
export function getNightsCount(checkIn: string, checkOut: string): number {
  return getStayDates(checkIn, checkOut).length
}
