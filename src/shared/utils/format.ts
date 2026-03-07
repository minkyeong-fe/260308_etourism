/**
 * 금액을 원화 문자열로 포맷
 * @param suffix true면 "123,456원", false(기본)면 "₩123,456"
 */
export function formatWon(
  n: number,
  options?: { suffix?: boolean }
): string {
  const formatted = n.toLocaleString('ko-KR')
  return options?.suffix ? `${formatted}원` : `₩${formatted}`
}
