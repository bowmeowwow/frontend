# 🔐 Bow-Meow-Wow — 회원인증(로그인) API 요청서

> 이 문서 기준으로 프론트 연동이 이미 완료되어 실제로 동작 중입니다 (`src/api/auth.js`, `src/context/AuthContext.jsx`).

---

## 1. 요청 범위

| 기능 | 필요 여부 |
|---|---|
| 회원가입 | ✅ 필수 |
| 로그인 | ✅ 필수 |
| 로그아웃 | ✅ 필수 |
| 로그인 상태 확인 (토큰 검증 / 내 정보 조회) | ✅ 필수 |

인증 방식은 **JWT 기반 토큰 인증**입니다.

---

## 2. API 명세

### 2.1 회원가입 — `POST /api/auth/signup`

**Request Body**
```json
{
  "email": "soyeon@bowmeowwow.app",
  "password": "plaintext-password",
  "name": "Kim Soyeon"
}
```

**Response 201 Created** — 가입과 동시에 로그인 처리(`accessToken` 즉시 발급)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Kim Soyeon",
    "email": "soyeon@bowmeowwow.app"
  }
}
```

**Response 409 Conflict** (이미 가입된 이메일)
```json
{ "message": "이미 가입된 이메일입니다." }
```

### 2.2 로그인 — `POST /api/auth/login`

**Request Body**
```json
{
  "email": "soyeon@bowmeowwow.app",
  "password": "plaintext-password"
}
```

**Response 200 OK**: 2.1의 성공 응답과 동일한 형태

**Response 401 Unauthorized** (이메일/비밀번호 불일치)
```json
{ "message": "이메일 또는 비밀번호가 올바르지 않습니다." }
```

- `password`는 서버에서 반드시 해시(bcrypt 등)로 저장·비교합니다. 응답 body에 `password` 필드는 포함하지 않습니다.

### 2.3 로그아웃 — `POST /api/auth/logout`

**Request Header**: `Authorization: Bearer <accessToken>`

**Response 200 OK**
```json
{ "message": "로그아웃되었습니다." }
```

### 2.4 로그인 상태 확인 — `GET /api/auth/me`

새로고침 시 세션 유지 여부를 서버에서 검증하기 위한 엔드포인트입니다.

**Request Header**: `Authorization: Bearer <accessToken>`

**Response 200 OK**
```json
{
  "id": 1,
  "name": "Kim Soyeon",
  "email": "soyeon@bowmeowwow.app"
}
```

**Response 401 Unauthorized** (토큰 없음/만료/위조)
```json
{ "message": "인증이 만료되었습니다." }
```

---

## 3. 공통 규칙

- **Content-Type**: `application/json`
- **인증 헤더**: `Authorization: Bearer <accessToken>`
- **에러 응답 형식 통일**: `{ "message": "..." }`
- **CORS**: 프론트 개발 서버(`http://localhost:5173` 등, Vite 기본 포트) origin 허용
- **토큰 만료 시간**: 24시간 기준

---

## 4. 이후 확장

반려동물 CRUD(`/api/pets`)는 [PET_PROFILE_INSURANCE_HANDOFF.md](./PET_PROFILE_INSURANCE_HANDOFF.md)에서 필드가 확장되고 있으니 함께 참고해 주세요.
