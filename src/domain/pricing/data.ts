import type { PricingRow, Region, RoomType } from "./types";
import pricingData from "./pricing.json";

const PRICING_BY_REGION = pricingData as Record<Region, PricingRow[]>;

/** 선택한 지역과 룸타입에 해당하는 요금표 행 조회 */
export function getPricingRow(
  region: Region,
  roomType: RoomType,
): PricingRow | null {
  const rows = PRICING_BY_REGION[region] ?? [];
  return rows.find((r) => r.roomType === roomType) ?? null;
}

/** 선택한 지역에서 선택 가능한 룸타입 목록 (데이터 순서) */
export function getRoomTypesForRegion(region: Region): RoomType[] {
  return (PRICING_BY_REGION[region] ?? []).map((r) => r.roomType);
}

/** 선택한 룸타입이 있는 지역 목록 (해당 룸타입으로 견적 가능한 지역) */
export function getRegionsForRoomType(roomType: RoomType): Region[] {
  return (Object.keys(PRICING_BY_REGION) as Region[]).filter((r) =>
    PRICING_BY_REGION[r].some((row) => row.roomType === roomType),
  );
}
