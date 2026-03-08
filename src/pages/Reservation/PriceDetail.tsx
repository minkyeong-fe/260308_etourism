import type {
  StayDetailItem,
  BreakfastDetail,
  ExtraBedDetail,
} from '@/domain/pricing'
import { formatWon } from '@/shared/utils/format'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PriceDetailProps {
  nights: number
  breakdown: {
    stay: number
    breakfast: number
    extraBed: number
    stayDetails: StayDetailItem[]
    breakfastDetail: BreakfastDetail
    extraBedDetail: ExtraBedDetail
  }
  total: number
  /** 시즌 안내 다이얼로그 열기 (헤더 ℹ️와 동일) */
  onOpenSeasonGuide?: () => void
}

function formatStayDetailLine(d: StayDetailItem): string {
  const dayLabel = d.weekend ? '주말' : '평일'
  return `${d.season} ${dayLabel} ${d.nights}박 × ${formatWon(d.rate, { suffix: true })}`
}

export function PriceDetail({
  nights,
  breakdown,
  total,
  onOpenSeasonGuide,
}: PriceDetailProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        숙박 {nights}박 {nights + 1}일
      </p>

      {breakdown.stayDetails.length > 0 && (
        <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="font-medium text-foreground">시즌별 숙박 내역</p>
            <p className="flex flex-wrap items-center justify-end gap-0.5 text-xs text-muted-foreground">
              ※ 시즌 안내
              {onOpenSeasonGuide ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="inline-flex size-5 shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="시즌 안내 보기"
                  onClick={onOpenSeasonGuide}
                >
                  <Info className="size-5" />
                </Button>
              ) : (
                <Info className="inline size-5 shrink-0 text-muted-foreground" />
              )}
              에 적힌 구간·순서 기준으로 계산됩니다.
            </p>
          </div>
          <ul className="space-y-1 text-muted-foreground">
            {breakdown.stayDetails.map((d, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 md:flex-row md:justify-between md:gap-2"
              >
                <span>{formatStayDetailLine(d)}</span>
                <span className="shrink-0">{formatWon(d.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between text-sm">
          <span className="text-muted-foreground">숙박</span>
          <span>{formatWon(breakdown.stay)}</span>
        </div>
        <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between md:gap-2 text-sm">
          <span className="text-muted-foreground">조식</span>
          <span className="text-right tabular-nums">
            <span className="text-muted-foreground">
              {formatWon(breakdown.breakfastDetail.rate, { suffix: true })} ×{' '}
              {breakdown.breakfastDetail.guests}명 × {breakdown.breakfastDetail.nights}박 =
            </span>{' '}
            <span className="text-foreground">
              {formatWon(breakdown.breakfastDetail.amount)}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between md:gap-2 text-sm">
          <span className="text-muted-foreground">엑스트라베드</span>
          <span className="text-right tabular-nums">
            <span className="text-muted-foreground">
              {formatWon(breakdown.extraBedDetail.rate, { suffix: true })} ×{' '}
              {breakdown.extraBedDetail.count}개 × {breakdown.extraBedDetail.nights}박 =
            </span>{' '}
            <span className="text-foreground">
              {formatWon(breakdown.extraBedDetail.amount)}
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between border-t pt-3 text-base font-medium">
        <span>합계</span>
        <span>{formatWon(total)}</span>
      </div>
    </div>
  )
}
