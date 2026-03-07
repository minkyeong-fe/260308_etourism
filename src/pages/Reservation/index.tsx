import { useState } from 'react'
import {
  REGIONS,
  ROOM_TYPES,
  type Region,
  type RoomType,
} from '../../domain/pricing'
import { PriceDetail } from './PriceDetail'
import { usePriceCalculator } from './usePriceCalculator'

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
  const [checkIn, setCheckIn] = useState(todayISO)
  const [checkOut, setCheckOut] = useState(tomorrowISO)
  const [region, setRegion] = useState<Region>('서울')
  const [roomType, setRoomType] = useState<RoomType>('스탠다드')
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

  return (
    <div className="reservation">
      <h1>요금 계산</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>체크인</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label>체크아웃</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label>지역</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>룸타입</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as RoomType)}
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>인원</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
          />
        </div>
        <div>
          <label>엑스트라베드</label>
          <input
            type="number"
            min={0}
            value={extraBeds}
            onChange={(e) => setExtraBeds(Number(e.target.value) || 0)}
          />
        </div>
      </form>
      {result ? (
        <PriceDetail breakdown={result.breakdown} total={result.total} />
      ) : (
        <p>날짜·인원을 입력하면 견적이 표시됩니다.</p>
      )}
    </div>
  )
}
