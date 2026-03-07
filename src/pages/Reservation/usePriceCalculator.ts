import { useMemo } from 'react'
import { calculateQuote } from '../../domain/pricing'
import type { PricingResult, Region, RoomType } from '../../domain/pricing'

interface UsePriceCalculatorInput {
  checkIn: string
  checkOut: string
  region: Region
  roomType: RoomType
  guests: number
  extraBeds?: number
}

export function usePriceCalculator(input: UsePriceCalculatorInput): {
  result: PricingResult | null
} {
  const { checkIn, checkOut, region, roomType, guests, extraBeds = 0 } = input

  const result = useMemo<PricingResult | null>(() => {
    if (!checkIn || !checkOut || guests < 1) return null
    if (checkOut <= checkIn) return null
    try {
      return calculateQuote({
        checkIn,
        checkOut,
        region,
        roomType,
        guests,
        extraBeds,
      })
    } catch {
      return null
    }
  }, [checkIn, checkOut, region, roomType, guests, extraBeds])

  return { result }
}
