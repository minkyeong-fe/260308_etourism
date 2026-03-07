import {
  REGION_OPTIONS,
  ROOM_TYPE_OPTIONS,
  SEASON_TYPES,
  getPricingRow,
  type PricingRow,
  type SeasonConfig,
  type SeasonType,
} from '@/domain/pricing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatWon } from '@/shared/utils/format'

/** MM-DD → "M월 D일" */
function formatRangePart(mmdd: string): string {
  const [m, d] = mmdd.split('-').map(Number)
  return `${m}월 ${d}일`
}

function formatRange(start: string, end: string): string {
  return `${formatRangePart(start)} ~ ${formatRangePart(end)}`
}

/** 시즌 구간 표시 순서 (config 키 순서와 동일) */
const SEASON_ORDER: SeasonType[] = [
  SEASON_TYPES.PEAK,
  SEASON_TYPES.HIGH,
  SEASON_TYPES.LOW,
]

interface SeasonGuideProps {
  config: SeasonConfig
}

/** 시즌 구간 목록만 렌더 (다이얼로그 등에서 사용) */
export function SeasonGuideContent({ config }: SeasonGuideProps) {
  const periodTexts = SEASON_ORDER.map((key) => {
    const ranges = config[key]
    return ranges.map((r) => formatRange(r.start, r.end)).join(', ')
  })

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="w-14 px-3 py-2 font-medium text-foreground" />
            {SEASON_ORDER.map((key) => (
              <th
                key={key}
                className="px-3 py-2 font-medium text-foreground"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border last:border-b-0">
            <td className="px-3 py-2 font-medium text-foreground">기간</td>
            {periodTexts.map((text, i) => (
              <td key={SEASON_ORDER[i]} className="px-3 py-2 text-muted-foreground">
                {text}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/** 객실별 요금표 (다이얼로그에서 시즌 안내와 함께 표시) */
export function PriceInfoContent() {
  const rows: PricingRow[] = REGION_OPTIONS.flatMap((region) =>
    ROOM_TYPE_OPTIONS.map((roomType) => getPricingRow(region, roomType))
  ).filter((r): r is PricingRow => r != null)

  if (rows.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">객실 요금표</h4>
      <p className="text-xs text-muted-foreground">
        ※ 평일: 일~목 / 주말: 금·토 기준으로 요금이 적용됩니다.
      </p>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[520px] table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="min-w-[7.5rem] w-[20%] px-3 py-2 font-medium text-foreground">
                객실
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                {SEASON_TYPES.LOW} 평일
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                {SEASON_TYPES.LOW} 주말
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                {SEASON_TYPES.HIGH} 평일
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                {SEASON_TYPES.HIGH} 주말
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                {SEASON_TYPES.PEAK}
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                조식
              </th>
              <th className="whitespace-nowrap px-2 py-2 font-medium text-foreground">
                엑스트라베드
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.region}_${row.roomType}`}
                className="border-b border-border last:border-b-0"
              >
                <td className="min-w-[7.5rem] w-[20%] px-3 py-2">
                  <span className="font-medium text-foreground">
                    {row.region} · {row.roomType}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {row.star}
                  </span>
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.weekdayLow, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.weekendLow, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.weekdayHigh, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.weekendHigh, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.peak, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.breakfast, { suffix: true })}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
                  {formatWon(row.extraBed, { suffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** 카드 형태 시즌 안내 */
export function SeasonGuide({ config }: SeasonGuideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>시즌 안내</CardTitle>
      </CardHeader>
      <CardContent>
        <SeasonGuideContent config={config} />
      </CardContent>
    </Card>
  )
}
