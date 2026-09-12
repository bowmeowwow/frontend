# 🏥🐾💬 Bow-Meow-Wow — 동물병원 조회 / 펫보험 / AI 챗봇 API 안내

기존 [AUTH_API_HANDOFF.md](./AUTH_API_HANDOFF.md), [SIGNUP_PET_API_HANDOFF.md](./SIGNUP_PET_API_HANDOFF.md)에 이어, 동물병원 위치/가격 조회, 펫보험/청구, AI 챗봇 3개 기능이 백엔드에 추가됐습니다.

---

## 1. 동물병원/호텔/미용실 조회 — `/api/clinics` (로그인 불필요, 공개 API)

> ⚠️ **Breaking change**: 지도 페이지로 개편되면서 카테고리와 좌표가 추가되고, 가격 조회 엔드포인트(`/api/clinics/{id}/prices`)는 삭제됐습니다.

### `GET /api/clinics?district=강남구&category=VET`
`district`, `category` 둘 다 선택 쿼리 파라미터입니다 (생략하면 전체 반환, 둘 다 줘도 됨).
`category`는 `"VET"`(동물병원) / `"HOTEL"`(애견호텔) / `"GROOMING"`(애견미용실) 중 하나입니다.

**Response 200 OK**
```json
[
  {
    "id": 1,
    "name": "행복동물병원",
    "category": "VET",
    "district": "강남구",
    "address": "서울특별시 강남구 테헤란로 152",
    "phone": "02-111-2222",
    "latitude": 37.5000242405515,
    "longitude": 127.036508620542
  }
]
```

- `latitude`/`longitude`는 서버가 `address`를 카카오 주소 검색 API로 지오코딩해서 미리 계산해둔 값입니다 — 프론트에서 별도 geocode 호출 없이 바로 마커 찍으면 됩니다. (지오코딩 실패 시 `null`일 수 있습니다.)
- 가격 정보는 삭제했습니다 (요청하신 대로 — 가격은 어차피 다른 데서 확인 가능). `/api/clinics/{id}/prices`는 이제 404입니다.
- 이름/전화번호는 아직 목데이터입니다.

### "그 외 장소"를 홈 일정에 추가하는 흐름

지도에서 검색된 임의의 장소(우리 DB의 3개 카테고리에 없는 곳)를 일정에 추가하는 것도 **새 엔드포인트가 필요 없습니다** — 기존 `POST /api/schedules`에 `location`(주소/장소명 자유 텍스트)만 채워서 보내면, 서버가 알아서 지오코딩해서 `latitude`/`longitude`까지 응답에 포함해줍니다. `SCHEDULE_API` 스펙은 이전에 보낸 메시지 참고해주세요 (문서 파일로도 원하시면 만들어드리겠습니다).

---

## 2. 펫보험 / 청구 — `/api/insurance` (로그인 필요)

**Request Header**: `Authorization: Bearer <accessToken>` 모든 엔드포인트 공통

### `GET /api/insurance/{userId}`

`userId`는 **로그인한 본인의 id와 일치해야 합니다** (`/api/auth/me`에서 받은 `id`). 다른 유저 id로 요청하면 403이 납니다 — 남의 보험 정보를 볼 수 없도록 막아둔 것입니다.

**Response 200 OK**
```json
{ "insurerName": "메리츠 펫보험", "monthlyPremium": 15000, "coverageLimit": 3000000, "status": "ACTIVE" }
```

**Response 403**: `{ "message": "다른 유저의 정보에 접근할 수 없습니다." }`
**Response 404** (가입한 보험 없음): `{ "message": "가입한 보험이 없습니다." }`

### `POST /api/insurance/claims`

**Request Body**
```json
{ "petId": 2, "description": "슬개골 탈구 치료", "amount": 250000 }
```

`petId`는 본인 소유 반려동물이어야 합니다 (아니면 404).

**Response 201 Created**
```json
{ "id": 1, "petId": 2, "description": "슬개골 탈구 치료", "amount": 250000, "status": "PENDING" }
```

### `GET /api/insurance/claims`

로그인한 유저가 제출한 청구 목록을 전부 반환합니다 (배열, 위와 같은 형태).

---

## 3. AI 챗봇 — `POST /api/chat` (로그인 필요)

**Request Body**
```json
{ "message": "우리 나비 건강검진 어디서 받을지 추천해줘", "petId": 2 }
```

`petId`는 선택입니다. 넘기면 그 반려동물의 이름/종류/나이가 AI 답변 컨텍스트에 들어갑니다. 로그인한 유저의 보험 가입 정보가 있으면 그것도 자동으로 컨텍스트에 포함됩니다.

**Response 200 OK**
```json
{ "reply": "이상준님, 안녕하세요! 2살이 된 나비의 건강검진을 고민하고 계시군요..." }
```

**Response 503** (서버에 AI 키 미설정): `{ "message": "AI 챗봇이 설정되지 않았습니다." }`
**Response 502** (AI 응답 생성 실패): `{ "message": "AI 응답 생성에 실패했습니다." }`

- `GEMINI_API_KEY`는 infra 쪽에 이미 반영 완료되어 실 배포 서버에서도 정상 동작합니다.
- 응답 시간이 몇 초 걸릴 수 있으니 로딩 상태 UI를 넣어주세요.

### `POST /api/chat/recommend` — AI 동물도우미 (내 위치 기반 근처 장소 추천, 로그인 필요)

일정에 쓰는 `location`(주소 텍스트) 기반이 아니라, **브라우저 geolocation으로 받은 사용자의 현재 좌표**를 기준으로 가까운 동물병원/호텔/미용실을 추천합니다.

**Request Body**
```json
{ "latitude": 37.4980, "longitude": 127.0276, "category": "VET", "petId": 2 }
```
- `latitude`/`longitude` 필수 (`navigator.geolocation.getCurrentPosition`으로 받으시면 됩니다)
- `category`(`VET`/`HOTEL`/`GROOMING`), `petId` 둘 다 선택입니다. `petId` 주면 AI 답변에 그 펫 이름/종류가 반영됩니다.

**Response 200 OK**
```json
{
  "reply": "안녕하세요, 보호자님! 🐾 지금 계신 곳에서 가장 가깝고 편하게 방문하실 수 있는 곳으로 2곳을 추천해 드릴게요!...",
  "places": [
    {
      "id": 10, "name": "행복동물병원", "category": "VET",
      "address": "서울특별시 강남구 테헤란로 152", "phone": "02-111-2222",
      "latitude": 37.5000242405515, "longitude": 127.036508620542,
      "distanceKm": 0.82
    }
  ]
}
```

- `places`는 가까운 순으로 정렬된 배열입니다 (최대 5개) — 지도에 마커 찍거나 리스트로 보여주시면 됩니다.
- `reply`는 `places`에 실제로 있는 곳들만 근거로 생성된 추천 문구입니다 (실제 목록에 없는 곳을 지어내지 않도록 설계했습니다).
- 주변에 등록된 장소가 없으면 `places: []`와 안내 문구만 옵니다 — 에러 아닙니다.
- AI 문구 생성 자체가 실패해도(키 문제 등) `places`는 정상적으로 내려갑니다 — `reply`만 폴백 문구로 오니, 지도/리스트는 항상 그릴 수 있습니다.

**Response 404** (`petId`가 본인 소유 아님): `{ "message": "반려동물을 찾을 수 없습니다." }`

Home 화면이나 캘린더 위젯에 "AI 동물도우미" 섹션으로 넣으시면 좋을 것 같습니다 — 일정에 장소를 직접 타이핑하는 대신, 여기서 추천받은 곳을 눌러서 바로 일정에 추가하는 흐름도 가능합니다 (그 경우 `POST /api/schedules`에 `location`으로 추천된 장소의 `address`를 넣어서 보내면 됩니다).

---

## 4. 공통 규칙 (기존과 동일)

에러 응답은 전부 `{ "message": "..." }` 형태로 통일되어 있습니다.
