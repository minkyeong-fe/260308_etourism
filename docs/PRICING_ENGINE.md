# 요금 계산 엔진 구현 설명

지역·룸타입·체크인/체크아웃·인원·엑스트라베드를 입력받아, 시즌(극성수기/성수기/비수기)과 평일/주말을 반영한 숙박·조식·엑스트라베드 합계를 계산한다.

---

## 구현 내용 요약

### 1. 과제 요구사항 대응

| 요구사항                                                | 구현 내용                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **입력** 투숙일, 객실타입, 인원                         | `PricingInput`: `checkIn`, `checkOut`, `region`, `roomType`, `guests` (+ 선택 `extraBeds`) |
| **출력** 시즌/요일 요금 + 조식×인원 + 엑스트라베드 합계 | `calculateQuote()` → `PricingResult` (총액 + `breakdown` 내역)                             |
| 시즌/요일 반영                                          | 일별로 시즌(극성수기·성수기·비수기)과 평일/주말 판별 후 해당 요금표 단가 적용              |
| 엑셀 데이터 참조                                        | `pricing.json`에 엑셀 기준 데이터 반영, 지역·룸타입별 `PricingRow` 조회                    |

- **언어/환경**: React(TypeScript) + Node.js 실행 환경
- **진입 함수**: `src/domain/pricing/engine.ts`의 `calculateQuote(input, options?)`

### 2. 프로젝트 내 요금 엔진 구조

```
src/domain/pricing/
├── engine.ts       # 진입점: calculateQuote() — 견적 계산 로직
├── types.ts        # 타입, REGIONS/ROOM_TYPES 객체, REGION_OPTIONS/ROOM_TYPE_OPTIONS(UI용 배열)
├── data.ts         # pricing.json 로드, getPricingRow() 등 요금표·지역/룸타입 조회 (옵션 목록은 types에서)
├── season.ts       # getSeason(), isWeekend() — 시즌·주말 판별
├── seasonConfig.ts # 시즌 구간(MM-DD), 주말 요일(금·토) 기본값
├── pricing.json    # 엑셀 기준 요금 데이터 (지역·룸타입별 단가)
└── index.ts        # 도메인 공개 API (calculateQuote, 타입, 상수 등)

src/shared/utils/
└── date.ts         # getStayDates(checkIn, checkOut) — 숙박 일자 배열 (체크아웃 당일 제외)
```

### 3. 핵심 계산식

- **숙박**: 각 숙박일에 대해 `시즌 + 평일/주말`로 단가 결정 후 합산
  - 극성수기 → `peak` / 성수기 → `weekdayHigh` 또는 `weekendHigh` / 비수기 → `weekdayLow` 또는 `weekendLow`
- **조식**: `조식 단가 × 인원(guests) × 박수(nights)`
- **엑스트라베드**: `엑스트라베드 단가 × 개수(extraBeds) × 박수(nights)`
  - **박수 적용**: 엑스트라베드는 **숙박 일수(박)별로** 부과된다. 2박 1대면 단가×1×2.
- **총액**: 숙박 합계 + 조식 합계 + 엑스트라베드 합계

### 4. 구현 특징

- **일별 계산**: 체크인~체크아웃 전일까지 1박 단위로 날짜를 나누고, 각 날짜에 대해 시즌·주말을 판별한 뒤 해당 단가를 적용해 합산합니다. 같은 시즌+요일끼리 묶은 `stayDetails`로 내역을 제공합니다.
- **설정 주입**: 시즌 구간은 `seasonConfig` 옵션으로 넘길 수 있어, 기본값 없이 다른 시즌 규칙으로 테스트하거나 확장하기 쉽습니다.
- **데이터 분리**: 요금표는 `pricing.json`으로 두고, 지역/룸타입 조회는 `data.ts`에서 담당해 엑셀 데이터 변경 시 JSON만 갱신하면 됩니다. 지역·룸타입 **옵션 목록**(`REGION_OPTIONS`, `ROOM_TYPE_OPTIONS`)은 `types.ts`에서 단일 정의합니다.

### 5. 사용 방법

- **코드에서 사용**: `import { calculateQuote } from "@/domain/pricing";` 후 `calculateQuote(input)` 호출.
- **실행/테스트**: 프로젝트 루트에서 `npm run dev`로 앱 실행 후 예약(Reservation) 화면에서 지역·룸타입·날짜·인원 등을 선택하면 견적이 계산·표시됨.

---

## 용어 정의

### 시즌

MM-DD 구간으로만 판별(연도 미사용). 기본값:

| 시즌     | 구간                     |
| -------- | ------------------------ |
| 극성수기 | 7/1 ~ 8/31               |
| 성수기   | 3/1 ~ 6/30, 9/1 ~ 10/31  |
| 비수기   | 1/1 ~ 2/29, 11/1 ~ 12/31 |

### 평일/주말

- **평일**: 일~목
- **주말**: 금·토 (Temporal 요일 5, 6)

---

## 진입점: calculateQuote

`src/domain/pricing/engine.ts`

```ts
export function calculateQuote(
  input: PricingInput,
  options?: { seasonConfig?: SeasonConfig },
): PricingResult | null {
  const row = getPricingRow(input.region, input.roomType);
  if (!row) return null;

  const config = options?.seasonConfig ?? DEFAULT_SEASON_CONFIG;
  const weekendDays = DEFAULT_WEEKEND_DAYS;
  const stayDates = getStayDates(input.checkIn, input.checkOut);
  const nights = stayDates.length;
  const extraBeds = input.extraBeds ?? 0;

  // 일별 시즌·주말 적용 → (시즌, weekend)별 집계
  const key = (season: SeasonType, weekend: boolean) => `${season}_${weekend}`;
  const acc = {} as Record<
    string,
    { season: SeasonType; weekend: boolean; nights: number; rate: number }
  >;
  let stayTotal = 0;

  for (const date of stayDates) {
    const season = getSeason(date, config);
    const weekend = isWeekend(date, weekendDays);
    const rate =
      season === SEASON_TYPES.PEAK
        ? row.peak
        : season === SEASON_TYPES.HIGH
          ? weekend
            ? row.weekendHigh
            : row.weekdayHigh
          : weekend
            ? row.weekendLow
            : row.weekdayLow;
    stayTotal += rate;
    const k = key(season, weekend);
    if (!acc[k]) acc[k] = { season, weekend, nights: 0, rate };
    acc[k].nights += 1;
  }

  const stayDetails = Object.values(acc).map(
    ({ season, weekend, nights: n, rate }) => ({
      season,
      weekend,
      nights: n,
      rate,
      amount: rate * n,
    }),
  );

  const breakfastTotal = row.breakfast * input.guests * nights;
  const extraBedTotal = row.extraBed * extraBeds * nights;
  const total = stayTotal + breakfastTotal + extraBedTotal;

  return {
    total,
    breakdown: {
      stay: stayTotal,
      breakfast: breakfastTotal,
      extraBed: extraBedTotal,
      stayDetails,
      breakfastDetail: {
        rate: row.breakfast,
        guests: input.guests,
        nights,
        amount: breakfastTotal,
      },
      extraBedDetail: {
        rate: row.extraBed,
        count: extraBeds,
        nights,
        amount: extraBedTotal,
      },
    },
  };
}
```

- **요금표 없음** → `null` 반환.
- **조식**: 단가 × 인원 × 박수. **엑스트라베드**: 단가 × 개수 × 박수(박당 적용).

---

## 시즌·주말 판별

### seasonConfig.ts

```ts
export const DEFAULT_SEASON_CONFIG: SeasonConfig = {
  극성수기: [{ start: "07-01", end: "08-31" }],
  성수기: [
    { start: "03-01", end: "06-30" },
    { start: "09-01", end: "10-31" },
  ],
  비수기: [
    { start: "01-01", end: "02-29" },
    { start: "11-01", end: "12-31" },
  ],
};

export const DEFAULT_WEEKEND_DAYS: number[] = [5, 6]; // 금·토
```

### season.ts

시즌 반환값은 `types.ts`의 `SEASON_TYPES` 상수를 사용한다.

```ts
import { SEASON_TYPES } from "./types";

export function getSeason(
  date: Temporal.PlainDate,
  config: SeasonConfig = DEFAULT_SEASON_CONFIG,
): SeasonType {
  const mmdd = toMMDD(date);
  if (config[SEASON_TYPES.PEAK].some((r) => isInRange(mmdd, r.start, r.end)))
    return SEASON_TYPES.PEAK;
  if (config[SEASON_TYPES.HIGH].some((r) => isInRange(mmdd, r.start, r.end)))
    return SEASON_TYPES.HIGH;
  return SEASON_TYPES.LOW;
}

export function isWeekend(
  date: Temporal.PlainDate,
  weekendDays: number[] = DEFAULT_WEEKEND_DAYS,
): boolean {
  return weekendDays.includes(date.dayOfWeek);
}
```

- 시즌 우선순위: `SEASON_TYPES.PEAK`(극성수기) → `SEASON_TYPES.HIGH`(성수기) → `SEASON_TYPES.LOW`(비수기).

---

## 숙박 일수 (getStayDates)

`src/shared/utils/date.ts` — 체크아웃 당일 제외, 전날까지가 마지막 숙박.

```ts
export function getStayDates(
  checkIn: string,
  checkOut: string,
): Temporal.PlainDate[] {
  const start = Temporal.PlainDate.from(checkIn);
  const end = Temporal.PlainDate.from(checkOut);
  if (Temporal.PlainDate.compare(start, end) >= 0) return [];

  const dates: Temporal.PlainDate[] = [];
  let current = start;
  while (Temporal.PlainDate.compare(current, end) < 0) {
    dates.push(current);
    current = current.add({ days: 1 });
  }
  return dates;
}
```

---

## 타입 (요약)

`src/domain/pricing/types.ts`

```ts
export interface PricingInput {
  checkIn: string;
  checkOut: string;
  region: Region;
  roomType: RoomType;
  guests: number;
  extraBeds?: number;
}

export interface PricingRow {
  star: string;
  region: Region;
  roomType: RoomType;
  weekdayLow: number;
  weekendLow: number;
  weekdayHigh: number;
  weekendHigh: number;
  peak: number;
  breakfast: number;
  extraBed: number;
}

export interface PricingResult {
  total: number;
  breakdown: {
    stay: number;
    breakfast: number;
    extraBed: number;
    stayDetails: StayDetailItem[];
    breakfastDetail: BreakfastDetail;
    extraBedDetail: ExtraBedDetail;
  };
}
```

---

## 요금표 조회 (data.ts)

```ts
const PRICING_BY_REGION = pricingData as Record<Region, PricingRow[]>;

export function getPricingRow(
  region: Region,
  roomType: RoomType,
): PricingRow | null {
  const rows = PRICING_BY_REGION[region] ?? [];
  return rows.find((r) => r.roomType === roomType) ?? null;
}
```

- `pricing.json`을 지역별 `PricingRow[]`로 로드. 조합 없으면 `null`.

---

## 사용 예시

```ts
import { calculateQuote } from "@/domain/pricing";

const result = calculateQuote({
  checkIn: "2025-07-10",
  checkOut: "2025-07-13",
  region: "부산",
  roomType: "스위트",
  guests: 2,
  extraBeds: 1,
});

// 시즌 설정 변경
const result2 = calculateQuote(input, { seasonConfig: customSeasonConfig });
```
