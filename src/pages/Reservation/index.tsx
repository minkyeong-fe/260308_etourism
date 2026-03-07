import { Info } from 'lucide-react'
import { useState } from 'react'
import {
  DEFAULT_SEASON_CONFIG,
  getRegionsForRoomType,
  getRoomTypesForRegion,
  REGION_OPTIONS,
  ROOM_TYPE_OPTIONS,
  type Region,
  type RoomType,
} from '@/domain/pricing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePickerField } from './DatePickerField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getNightsCount } from '@/shared/utils/date'
import { PriceDetail } from './PriceDetail'
import { PriceInfoContent, SeasonGuideContent } from './SeasonGuide'
import { usePriceCalculator } from './usePriceCalculator'

const REGION_PLACEHOLDER = '지역 선택'
const ROOM_TYPE_PLACEHOLDER = '룸타입 선택'

/** 데이터 기준 유효한 지역+룸타입 조합 안내 문구 */
const VALID_COMBINATIONS_HINT = `유효한 조합: ${REGION_OPTIONS.flatMap((r) =>
  getRoomTypesForRegion(r).map((t) => `${r}+${t}`),
).join(', ')}`

function todayISO(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function tomorrowISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function ReservationPage() {
  const [checkIn, setCheckIn] = useState(() => todayISO())
  const [checkOut, setCheckOut] = useState(() => tomorrowISO())
  const [region, setRegion] = useState<Region | ''>('')
  const [roomType, setRoomType] = useState<RoomType | ''>('')
  const [guests, setGuests] = useState(1)
  const [extraBeds, setExtraBeds] = useState(0)

  const { result } = usePriceCalculator({
    checkIn,
    checkOut,
    region,
    roomType,
    guests,
    extraBeds,
  })

  const roomTypesForRegion = region ? getRoomTypesForRegion(region) : []
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            요금 계산
          </h1>
          <Dialog open={seasonDialogOpen} onOpenChange={setSeasonDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="시즌 안내 보기"
                >
                  <Info className="size-5" />
                </Button>
              }
            />
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogTitle>시즌 안내 · 가격 정보</DialogTitle>
              <div className="space-y-5 pt-1">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">
                    시즌 구간
                  </h3>
                  <SeasonGuideContent config={DEFAULT_SEASON_CONFIG} />
                </div>
                <hr className="border-border" />
                <PriceInfoContent />
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>예약 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-2">
                <Label htmlFor="checkIn">체크인</Label>
                <DatePickerField
                  id="checkIn"
                  value={checkIn}
                  onChange={setCheckIn}
                  placeholder="체크인 날짜 선택"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">체크아웃</Label>
                <DatePickerField
                  id="checkOut"
                  value={checkOut}
                  onChange={setCheckOut}
                  placeholder="체크아웃 날짜 선택"
                  disabledBefore={checkIn}
                />
              </div>
              <div className="space-y-2">
                <Label>지역</Label>
                <Select
                  value={region || REGION_PLACEHOLDER}
                  onValueChange={(v) => {
                    if (v === REGION_PLACEHOLDER) {
                      setRegion('')
                      return
                    }
                    const nextRegion = v as Region
                    const validTypes = getRoomTypesForRegion(nextRegion)
                    setRegion(nextRegion)
                    setRoomType(
                      roomType && validTypes.includes(roomType)
                        ? roomType
                        : validTypes[0]
                    )
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={REGION_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={REGION_PLACEHOLDER}>
                      {REGION_PLACEHOLDER}
                    </SelectItem>
                    {REGION_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>룸타입</Label>
                <Select
                  value={roomType || ROOM_TYPE_PLACEHOLDER}
                  onValueChange={(v) => {
                    if (v === ROOM_TYPE_PLACEHOLDER) {
                      setRoomType('')
                      return
                    }
                    const nextRoomType = v as RoomType
                    setRoomType(nextRoomType)
                    // 해당 룸타입이 하나의 지역에만 있으면 지역 자동 설정 → 견적 계산 가능
                    const regionsWithRoom = getRegionsForRoomType(nextRoomType)
                    if (regionsWithRoom.length === 1) {
                      const needRegion =
                        !region ||
                        !getRoomTypesForRegion(region).includes(nextRoomType)
                      if (needRegion) setRegion(regionsWithRoom[0])
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={ROOM_TYPE_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROOM_TYPE_PLACEHOLDER}>
                      {ROOM_TYPE_PLACEHOLDER}
                    </SelectItem>
                    {ROOM_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">인원</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) =>
                    setGuests(Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraBeds">엑스트라베드</Label>
                <Input
                  id="extraBeds"
                  type="number"
                  min={0}
                  value={extraBeds}
                  onChange={(e) =>
                    setExtraBeds(Math.max(0, Number(e.target.value) || 0))
                  }
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>견적 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceDetail
                nights={getNightsCount(checkIn, checkOut)}
                breakdown={result.breakdown}
                total={result.total}
                onOpenSeasonGuide={() => setSeasonDialogOpen(true)}
              />
            </CardContent>
          </Card>
        ) : region && roomType && !roomTypesForRegion.includes(roomType) ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                선택한 지역에는 해당 객실이 없습니다.
                <br />
                지역 또는 룸타입을 변경해 주세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                날짜·인원을 입력하고, 지역과 룸타입을 선택하면 견적이 표시됩니다.
                <br />
                ({VALID_COMBINATIONS_HINT})
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
