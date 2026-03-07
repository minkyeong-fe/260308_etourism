import { describe, it, expect } from 'vitest'
import { calculateQuote } from '@/domain/pricing'

describe('calculateQuote', () => {
  it('유효한 입력이면 total과 breakdown을 반환한다', () => {
    const result = calculateQuote({
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
      region: '서울',
      roomType: '스탠다드',
      guests: 2,
    })
    expect(result).not.toBeNull()
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('breakdown')
    expect(result!.breakdown).toHaveProperty('stay')
    expect(result!.breakdown).toHaveProperty('breakfast')
    expect(result!.breakdown).toHaveProperty('extraBed')
    expect(result!.breakdown).toHaveProperty('stayDetails')
  })

  it('존재하지 않는 지역·룸타입 조합이면 null을 반환한다', () => {
    expect(
      calculateQuote({
        checkIn: '2025-01-10',
        checkOut: '2025-01-12',
        region: '서울',
        roomType: '스위트',
        guests: 1,
      })
    ).toBeNull()
  })

  it('숙박 + 조식 + 엑스트라베드 합계가 total과 같다', () => {
    const result = calculateQuote({
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
      region: '부산',
      roomType: '스위트',
      guests: 2,
      extraBeds: 1,
    })
    expect(result).not.toBeNull()
    const { total, breakdown } = result!
    expect(total).toBe(
      breakdown.stay + breakdown.breakfast + breakdown.extraBed
    )
  })

  it('비수기 평일 1박: 숙박금 = weekdayLow, 조식 = breakfast × guests × 1', () => {
    const result = calculateQuote({
      checkIn: '2025-01-13',
      checkOut: '2025-01-14',
      region: '서울',
      roomType: '스탠다드',
      guests: 2,
    })
    expect(result).not.toBeNull()
    expect(result!.breakdown.stay).toBe(110_000)
    expect(result!.breakdown.breakfast).toBe(20_000 * 2 * 1)
  })

  it('극성수기 1박: 숙박금 = peak 단가', () => {
    const result = calculateQuote({
      checkIn: '2025-07-15',
      checkOut: '2025-07-16',
      region: '서울',
      roomType: '스탠다드',
      guests: 1,
    })
    expect(result).not.toBeNull()
    expect(result!.breakdown.stay).toBe(236_500)
  })

  it('stayDetails에 시즌·주말별 박수와 금액이 포함된다', () => {
    const result = calculateQuote({
      checkIn: '2025-01-10',
      checkOut: '2025-01-13',
      region: '경주',
      roomType: '디럭스',
      guests: 1,
    })
    expect(result).not.toBeNull()
    expect(result!.breakdown.stayDetails.length).toBeGreaterThan(0)
    for (const d of result!.breakdown.stayDetails) {
      expect(d).toHaveProperty('season')
      expect(d).toHaveProperty('weekend')
      expect(d).toHaveProperty('nights')
      expect(d).toHaveProperty('rate')
      expect(d).toHaveProperty('amount')
      expect(d.amount).toBe(d.rate * d.nights)
    }
  })

  it('breakfastDetail에 단가·인원·박수·금액이 맞게 들어간다', () => {
    const result = calculateQuote({
      checkIn: '2025-02-01',
      checkOut: '2025-02-03',
      region: '부산',
      roomType: '스위트',
      guests: 3,
    })
    expect(result).not.toBeNull()
    const { breakfastDetail } = result!.breakdown
    expect(breakfastDetail.rate).toBe(50_000)
    expect(breakfastDetail.guests).toBe(3)
    expect(breakfastDetail.nights).toBe(2)
    expect(breakfastDetail.amount).toBe(50_000 * 3 * 2)
  })

  it('extraBeds가 0이면 extraBed 합계가 0이다', () => {
    const result = calculateQuote({
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
      region: '서울',
      roomType: '스탠다드',
      guests: 1,
    })
    expect(result).not.toBeNull()
    expect(result!.breakdown.extraBed).toBe(0)
    expect(result!.breakdown.extraBedDetail.amount).toBe(0)
  })

  it('extraBedDetail에 단가·개수·박수·금액이 맞게 들어간다 (단가 × 개수 × 박수)', () => {
    const result = calculateQuote({
      checkIn: '2025-01-10',
      checkOut: '2025-01-13',
      region: '서울',
      roomType: '스탠다드',
      guests: 1,
      extraBeds: 2,
    })
    expect(result).not.toBeNull()
    const { extraBedDetail } = result!.breakdown
    expect(extraBedDetail.rate).toBe(25_000)
    expect(extraBedDetail.count).toBe(2)
    expect(extraBedDetail.nights).toBe(3)
    expect(extraBedDetail.amount).toBe(25_000 * 2 * 3)
  })
})
