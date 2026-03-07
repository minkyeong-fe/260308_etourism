import { describe, it, expect } from 'vitest'
import {
  getPricingRow,
  getRoomTypesForRegion,
  getRegionsForRoomType,
  REGION_OPTIONS,
  ROOM_TYPE_OPTIONS,
} from '@/domain/pricing'

describe('getPricingRow', () => {
  it('존재하는 지역·룸타입 조합이면 PricingRow를 반환한다', () => {
    const row = getPricingRow('서울', '스탠다드')
    expect(row).not.toBeNull()
    expect(row!.region).toBe('서울')
    expect(row!.roomType).toBe('스탠다드')
    expect(row!.weekdayLow).toBe(110_000)
    expect(row!.peak).toBe(236_500)
  })

  it('존재하지 않는 조합이면 null을 반환한다', () => {
    expect(getPricingRow('서울', '스위트')).toBeNull()
    expect(getPricingRow('부산', '스탠다드')).toBeNull()
  })
})

describe('getRoomTypesForRegion', () => {
  it('지역별로 해당 룸타입 배열을 반환한다', () => {
    expect(getRoomTypesForRegion('서울')).toEqual(['스탠다드'])
    expect(getRoomTypesForRegion('경주')).toEqual(['디럭스'])
    expect(getRoomTypesForRegion('부산')).toEqual(['스위트'])
  })
})

describe('getRegionsForRoomType', () => {
  it('룸타입별로 해당 지역 배열을 반환한다', () => {
    expect(getRegionsForRoomType('스탠다드')).toEqual(['서울'])
    expect(getRegionsForRoomType('디럭스')).toEqual(['경주'])
    expect(getRegionsForRoomType('스위트')).toEqual(['부산'])
  })
})

describe('REGION_OPTIONS / ROOM_TYPE_OPTIONS', () => {
  it('REGION_OPTIONS에 서울·경주·부산이 포함된다', () => {
    expect(REGION_OPTIONS).toContain('서울')
    expect(REGION_OPTIONS).toContain('경주')
    expect(REGION_OPTIONS).toContain('부산')
    expect(REGION_OPTIONS.length).toBe(3)
  })

  it('ROOM_TYPE_OPTIONS에 스탠다드·디럭스·스위트가 포함된다', () => {
    expect(ROOM_TYPE_OPTIONS).toContain('스탠다드')
    expect(ROOM_TYPE_OPTIONS).toContain('디럭스')
    expect(ROOM_TYPE_OPTIONS).toContain('스위트')
    expect(ROOM_TYPE_OPTIONS.length).toBe(3)
  })
})
