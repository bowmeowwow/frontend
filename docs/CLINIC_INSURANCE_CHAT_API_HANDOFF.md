# 🏥🐾💬 Bow-Meow-Wow — 동물병원 조회 / 펫보험 / AI 챗봇 API 안내

기존 [AUTH_API_HANDOFF.md](./AUTH_API_HANDOFF.md), [SIGNUP_PET_API_HANDOFF.md](./SIGNUP_PET_API_HANDOFF.md)에 이어, 동물병원 위치/가격 조회, 펫보험/청구, AI 챗봇 3개 기능이 백엔드에 추가됐습니다.

---

## 1. 동물병원 조회 — `/api/clinics` (로그인 불필요, 공개 API)

### `GET /api/clinics?district=강남구`
`district` 쿼리 파라미터는 선택입니다. 생략하면 전체 목록을 반환합니다.

**Response 200 OK**
```json
[
  { "id": 1, "name": "행복동물병원", "district": "강남구", "address": "서울특별시 강남구 테헤란로 152", "phone": "02-111-2222" }
]
```

`address`는 지오코딩 가능한 실제 도로명 주소입니다 (건물번호까지 정확) — 카카오맵 마커 렌더링에 바로 쓰시면 됩니다. 다만 병원 이름/전화번호는 아직 목데이터이니 실제 병원 정보로 오해 없게 UI에 "예시 데이터" 표기 등을 고려해주세요.

### `GET /api/clinics/{id}/prices`

**Response 200 OK**
```json
[
  { "procedure": "기본 건강검진", "price": 30000 },
  { "procedure": "예방접종", "price": 20000 }
]
```

**Response 404**: `{ "message": "병원을 찾을 수 없습니다." }`

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

- 현재 infra 쪽에 `GEMINI_API_KEY` 배포 설정을 요청해둔 상태라, 반영되기 전까지는 실제 배포 서버에서 503이 날 수 있습니다. 프론트에서는 503/502를 "챗봇 일시 이용 불가" 정도의 메시지로 처리해주시면 됩니다.
- 응답 시간이 몇 초 걸릴 수 있으니 로딩 상태 UI를 넣어주세요.

---

## 4. 공통 규칙 (기존과 동일)

에러 응답은 전부 `{ "message": "..." }` 형태로 통일되어 있습니다.
