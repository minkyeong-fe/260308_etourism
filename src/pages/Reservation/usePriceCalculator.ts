import { useMemo } from 'react'
import {
  calculateQuote,
  type PricingResult,
  type Region,
  type RoomType,
} from '@/domain/pricing'

interface UsePriceCalculatorInput {
  checkIn: string
  checkOut: string
  region: Region | ''
  roomType: RoomType | ''
  guests: number
  extraBeds?: number
}

export function usePriceCalculator(input: UsePriceCalculatorInput): {
  result: PricingResult | null
} {
  const { checkIn, checkOut, region, roomType, guests, extraBeds = 0 } = input

  const result = useMemo<PricingResult | null>(() => {
    if (!region || !roomType || !checkIn || !checkOut || guests < 1) return null
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
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
      return null
    }
  }, [checkIn, checkOut, region, roomType, guests, extraBeds])

  return { result }
}
