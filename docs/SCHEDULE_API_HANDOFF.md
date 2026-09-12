# 📅 Bow-Meow-Wow — 일정(캘린더) API 요청서

Home 대시보드에 반려동물 일정(예방접종/정기검진/미용/투약 등) 캘린더 위젯을 추가했습니다. 현재는 새로고침하면 사라지는 **로컬 state(useState)** 로만 동작 중이라, 실제 저장을 위해 아래 CRUD API가 필요합니다.

기존 `/api/pets`, `/api/insurance/claims`와 동일한 패턴(로그인 필요, 본인 것만 접근, `{ "message": "..." }` 에러 포맷)으로 만들어주시면 됩니다.

---

## 1. 요청 범위

| 기능 | 필요 여부 |
|---|---|
| 일정 생성 | ✅ 필수 |
| 일정 조회 (월 단위 or 전체) | ✅ 필수 |
| 일정 수정 | ✅ 필수 |
| 일정 삭제 | ✅ 필수 |

---

## 2. API 명세

**Request Header**: `Authorization: Bearer <accessToken>` 모든 엔드포인트 공통

### 2.1 일정 생성 — `POST /api/schedules`

**Request Body**
```json
{
  "petId": 2,
  "date": "2026-09-18",
  "time": "10:30",
  "title": "예방접종",
  "category": "VACCINATION"
}
```

- `petId`: 본인 소유 반려동물이어야 함 (아니면 404, `/api/pets` 생성/청구 API와 동일한 규칙)
- `date`: `YYYY-MM-DD`
- `time`: `HH:mm` (24시간제)
- `category`: `"VACCINATION"` / `"CHECKUP"` / `"GROOMING"` / `"MEDICATION"` / `"OTHER"` 중 하나

**Response 201 Created**
```json
{ "id": 1, "petId": 2, "date": "2026-09-18", "time": "10:30", "title": "예방접종", "category": "VACCINATION" }
```

### 2.2 일정 목록 조회 — `GET /api/schedules`

로그인한 유저가 등록한 일정을 전부 반환합니다 (배열, 위와 같은 형태). 데이터가 많아질 걸 대비해서 `from`/`to` 쿼리 파라미터(예: `?from=2026-09-01&to=2026-09-30`)로 기간 필터를 받아주시면 캘린더가 보이는 달만 불러올 수 있어 좋을 것 같습니다 — 필수는 아니고 편하신 대로 해주세요.

### 2.3 일정 수정 — `PATCH /api/schedules/{id}`

**Request Body** (바꿀 필드만)
```json
{ "time": "11:00", "title": "예방접종 (변경)" }
```

**Response 200 OK**: 2.1과 동일한 형태
**Response 404**: 본인 소유가 아니거나 존재하지 않음 — `{ "message": "일정을 찾을 수 없습니다." }`

### 2.4 일정 삭제 — `DELETE /api/schedules/{id}`

**Response 200 OK**
```json
{ "message": "삭제되었습니다." }
```

---

## 3. 공통 규칙 (기존과 동일)

- 에러 응답은 `{ "message": "..." }` 통일
- 전부 `Authorization: Bearer <accessToken>` 필수, 본인 소유 데이터만 접근 가능

---

## 4. 확인하고 싶은 사항

1. `category` 5종(예방접종/정기검진/미용/투약/기타)으로 프론트에 이미 넣어뒀는데, 이 enum 값 그대로 괜찮으신가요?
2. 일정에 `petId` 없이(반려동물 미지정) 등록하는 것도 허용해야 할까요, 아니면 항상 필수로 두는 게 나을까요? (지금 프론트는 등록된 펫이 없으면 이름을 자유 텍스트로 받고 있어서, 이 경우 `petId` 없이 보내는 상황이 생깁니다)
3. 데이터 많아지면 기간 필터(`from`/`to`)가 필요할 것 같은데, 우선순위 낮게 나중에 추가해도 괜찮을까요?

---

## 5. 참고 (프론트에서 이미 반영한 내용)

- `src/components/CalendarWidget.jsx`에 위 스펙과 동일한 필드 구조(`petId` 대신 현재는 `petName` 텍스트, `date`/`time`/`title`/`category`)로 로컬 CRUD를 구현해뒀습니다. API가 준비되면 이 컴포넌트의 로컬 `useState`를 `src/api/schedules.js` 같은 fetch 호출로 교체하면 됩니다.
- **(업데이트)** 실제 API(`/api/schedules`) 연동 완료했습니다. `PATCH`의 `date` 필드가 `None` 바인딩 버그로 막혀있던 것도 인프라 세션에서 수정 확인했습니다 (감사합니다!).

## 6. `location` 필드 (완료)

일정에서 병원/장소로 바로 이동하는 기능(캘린더 → 지도)을 위해 `location`(병원/장소명, 문자열) 필드를 요청드렸고, `ScheduleCreateRequest`/`ScheduleUpdateRequest`/`ScheduleResponse` 전부에 `Optional[str] = None`으로 추가 완료됐습니다. 프론트도 `localStorage` 임시 저장 로직을 걷어내고 실제 필드로 교체했습니다.
