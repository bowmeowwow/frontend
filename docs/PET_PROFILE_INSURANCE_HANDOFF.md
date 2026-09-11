# 🐾 Bow-Meow-Wow — 반려동물 프로필 확장 & 펫보험 API 요청서

마이페이지를 "펫 이름/생일/품종/몸무게 + 펫보험 가입 내역/금융 정보" 중심으로 개편하면서, 프론트는 우선 **mock 데이터(useState + localStorage)로 화면만 먼저 구현**해뒀습니다. 이 문서는 그 mock을 실제 API로 교체하기 위해 필요한 스펙입니다.

기존 [AUTH_API_HANDOFF.md](./AUTH_API_HANDOFF.md)의 `/api/auth/*`와 `/api/pets`(name, category, age)는 이미 붙어서 동작 중이며, **이번 요청은 그 위에 필드를 추가/확장하는 것**입니다.

---

## 1. 요청 범위

| 기능 | 필요 여부 |
|---|---|
| 회원가입에 전화번호 추가 | ✅ 필수 |
| 반려동물 정보 확장 (품종, 생년월일, 몸무게, 건강상태) | ✅ 필수 |
| 펫보험 가입 정보 조회/등록 | ✅ 필수 |
| 보험금 청구(claim) 내역 조회 | ✅ 필수 |
| 보험 상품 가입/결제 실제 처리 | ❌ 이번 범위 아님 (일단 등록된 보험 정보를 "표시"만) |

---

## 2. 기존 API 확장

### 2.1 회원가입에 `phone` 추가 — `POST /api/auth/signup`

**Request Body**
```json
{
  "email": "soyeon@bowmeowwow.app",
  "password": "plaintext-password",
  "name": "Kim Soyeon",
  "phone": "010-1234-5678"
}
```

- `phone`은 선택값으로 받아주시면 됩니다 (기존 가입 로직 깨지지 않게).
- 응답의 `user` 객체에도 `phone`을 포함해서 내려주세요.

### 2.2 반려동물 필드 확장 — `POST /api/pets`, `PATCH /api/pets/{id}`

기존 `category`(CAT/DOG/OTHER) + `age`(정수)는 그대로 유지하되, 아래 필드를 추가합니다.

**Request Body 예시**
```json
{
  "name": "코코",
  "category": "DOG",
  "breed": "Poodle",
  "birthDate": "2022-04-12",
  "weight": 4.2,
  "healthStatus": "HEALTHY"
}
```

- `breed`: 자유 텍스트 (예: "Shih Tzu", "Scottish Fold")
- `birthDate`: `YYYY-MM-DD`. **기존 `age`(정수) 대신 이걸 기준으로 나이를 계산**하고 싶습니다 — 기존 `age` 필드는 유지하되 `birthDate`가 있으면 프론트에서는 `birthDate` 기준으로 표시할 예정입니다. (서버에서 `age`를 자동 계산해서 같이 내려주셔도 좋고, 프론트에서 계산해도 무방 — 편하신 쪽으로)
- `weight`: kg 단위 소수 (예: 4.2)
- `healthStatus`: `"HEALTHY"` / `"ON_MEDS"` 중 하나 (추후 더 세분화 가능)

**Response**: 위 필드 전부 포함해서 그대로 반환

---

## 3. 신규 API

### 3.1 펫보험 가입 정보 조회 — `GET /api/pets/{petId}/insurance`

**Response 200 OK**
```json
{
  "insurer": "KB Pet Insurance",
  "product": "Care Plan",
  "monthlyPremium": 45000,
  "coverageSummary": "수술 최대 500만원, 통원 최대 30만원",
  "renewalDate": "2027-03-01",
  "status": "ACTIVE"
}
```

**Response 404**: 가입된 보험이 없는 경우
```json
{ "message": "가입된 보험이 없습니다." }
```

### 3.2 펫보험 가입/변경 — `POST /api/pets/{petId}/insurance`

**Request Body**
```json
{
  "insurer": "KB Pet Insurance",
  "product": "Care Plan",
  "monthlyPremium": 45000,
  "coverageSummary": "수술 최대 500만원, 통원 최대 30만원",
  "renewalDate": "2027-03-01"
}
```

**Response 201/200**: 3.1과 동일한 형태 (`status: "ACTIVE"` 포함)

### 3.3 보험금 청구 내역 — `GET /api/pets/{petId}/claims`

**Response 200 OK**
```json
[
  {
    "id": 1,
    "date": "2026-08-20",
    "clinic": "Green Paw Clinic",
    "amount": 120000,
    "status": "APPROVED"
  },
  {
    "id": 2,
    "date": "2026-07-02",
    "clinic": "Sunny Vet Center",
    "amount": 45000,
    "status": "PAID"
  }
]
```

- `status`: `"PENDING"`(심사중) / `"APPROVED"`(승인) / `"PAID"`(지급완료)

---

## 4. 공통 규칙 (기존과 동일)

- 에러 응답은 `{ "message": "..." }` 통일
- `/api/pets/*` 하위 엔드포인트는 전부 `Authorization: Bearer <accessToken>` 필수, 본인 소유 펫만 접근 가능

---

## 5. 확인하고 싶은 사항

1. `age`(정수) vs `birthDate`(생년월일) — 기존 `age` 필드를 완전히 `birthDate`로 대체해도 괜찮을까요, 아니면 당분간 둘 다 유지해야 할까요?
2. 보험/청구 정보를 반려동물(`petId`) 단위로 설계했는데, 실제로는 보험 상품이 여러 반려동물을 하나로 묶어 가입하는 구조(가족 보험 등)인가요? 그렇다면 스키마를 유저 단위로 바꿔야 할 수도 있습니다.
3. 보험금 청구는 이번엔 "조회"만 필요한데, 이후에 사용자가 직접 청구를 접수하는 기능(`POST /claims`)도 필요할까요?

---

## 6. 참고 (프론트에서 이미 반영한 내용)

- `src/mock/petProfileStore.js`, `src/mock/petProfileHelpers.js`에 위 스펙과 동일한 필드 구조로 mock 데이터를 구성해뒀습니다. API가 준비되면 이 두 파일을 실제 fetch 호출로 교체하고, `MyPage.jsx` / `Signup.jsx`의 mock 저장 로직만 바꾸면 됩니다.
- Signup은 여전히 `POST /api/auth/signup`(email/password/name)을 실제로 호출해 계정을 생성하고, `phone` + 반려동물 확장 필드는 현재 `localStorage`에만 저장됩니다.
