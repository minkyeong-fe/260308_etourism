# 이투어리즘 · 요금 계산 (과제 제출)

**과제:** 투숙일·객실타입·인원 입력 시, [시즌/요일 요금 + 조식×인원 + 엑스트라베드]를 계산하여 합계를 리턴하는 **함수** 구현 (React 선택)

---

## 핵심 구현: 견적 계산 함수

| 항목        | 내용                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| **함수**    | `calculateQuote`                                                                    |
| **위치**    | `src/domain/pricing/engine.ts`                                                      |
| **사용 예** | `import { calculateQuote } from '@/domain/pricing'` 후 `calculateQuote(input)` 호출 |

요구사항 매핑 및 사용 예시는 **[docs/PRICING_ENGINE.md](docs/PRICING_ENGINE.md)** 의 「과제 요구사항 대비 핵심 함수」 섹션을 참고하세요.

---

## 프로젝트 구조

```
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 배포
├── docs/
│   ├── ASSIGNMENT.md       # 과제 원문
│   └── PRICING_ENGINE.md   # 요금 엔진 설명
├── src/
│   ├── domain/pricing/     # 요금 계산 도메인
│   │   ├── engine.ts       # calculateQuote (핵심 함수)
│   │   ├── data.ts         # 요금표 조회
│   │   ├── season.ts       # 시즌/주말 판별
│   │   ├── seasonConfig.ts # 시즌 구간 기본값
│   │   ├── types.ts        # 타입·상수
│   │   ├── pricing.json    # 요금 데이터
│   │   └── index.ts        # re-export
│   ├── pages/Reservation/  # 예약 견적 화면
│   │   ├── index.tsx
│   │   ├── DatePickerField.tsx
│   │   ├── PriceDetail.tsx
│   │   ├── SeasonGuide.tsx
│   │   └── usePriceCalculator.ts
│   ├── shared/utils/
│   │   ├── date.ts         # getStayDates, getNightsCount
│   │   └── format.ts       # formatWon
│   ├── components/ui/      # 공통 UI 컴포넌트 (button, card, dialog 등)
│   ├── lib/utils.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/                  # Vitest (도메인·유틸)
│   ├── domain/pricing/
│   └── shared/utils/
├── index.html
├── package.json
└── vite.config.ts
```

---

## 실행 방법

```bash
npm install
npm run dev
```

## 테스트

요금 계산 엔진 및 관련 유틸 테스트 (Vitest):

```bash
npm run test        # watch
npm run test:run    # 1회 실행
```

- `tests/domain/pricing/engine.test.ts` — `calculateQuote`
- `tests/domain/pricing/data.test.ts` — `getPricingRow`, `getRoomTypesForRegion`, `getRegionsForRoomType`, `REGION_OPTIONS`, `ROOM_TYPE_OPTIONS`
- `tests/domain/pricing/season.test.ts` — `getSeason`, `isWeekend`
- `tests/shared/utils/date.test.ts` — `getStayDates`, `getNightsCount`

브라우저에서 예약 화면이 열리며, 날짜·지역·룸타입·인원을 입력하면 위 함수를 통해 견적이 계산·표시됩니다.

---

## 문서

- **[docs/PRICING_ENGINE.md](docs/PRICING_ENGINE.md)** — 요금 계산 엔진 설명 (핵심 함수 강조 + 구현 상세)
- **[docs/ASSIGNMENT.md](docs/ASSIGNMENT.md)** — 과제 원문

---

## 기술 스택

- React 19, TypeScript, Vite
- 요금 계산: `src/domain/pricing/` (순수 함수, UI 없이 단독 사용 가능)
