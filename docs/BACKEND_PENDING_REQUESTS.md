# 📋 Bow-Meow-Wow — Backend 세션 확인용 요약 (최신 상태)

> backend 세션이 자주 끊기고 새로 붙다 보니 맥락이 끊기는 경우가 많아서, **지금 시점에 실제로 남아있는 요청만** 한 곳에 정리했습니다. 상세 스펙은 각 문서를 참고하시고, 여기 없는 내용(로그인/회원가입/펫 CRUD/동물병원/AI챗봇/일정)은 전부 이미 구현·배포·검증 완료된 상태입니다.

---

## ✅ 지금 남아있는 요청 (전부 급하지 않음, 편하실 때)

### 1. 회원가입에 `phone` 필드 추가
- `POST /api/auth/signup` 요청 body에 `phone`(optional) 추가
- 응답 `user` 객체에도 `phone` 포함
- 상세: [PET_PROFILE_INSURANCE_HANDOFF.md](./PET_PROFILE_INSURANCE_HANDOFF.md) 2절

### 2. `/api/pets`에 `birthDate`, `weight` 필드 추가 (optional)
```json
{ "name": "코코", "category": "DOG", "age": 3, "birthDate": "2022-04-12", "weight": 4.2 }
```
- `birthDate`(`YYYY-MM-DD`)와 `weight`(kg, 소수) 둘 다 optional
- **`breed`, `healthStatus`는 이제 필요 없습니다** — 마이페이지에서 품종/건강상태 표시를 없애서 요청에서 뺐습니다. 혹시 이미 만들어두셨어도 그대로 두시면 되고, 안 하셨으면 신경 안 쓰셔도 됩니다.
- 확인하고 싶은 점: `birthDate`를 추가하면 기존 `age`(정수)와 같이 유지할지, 대체할지 — 편하신 대로 결정해주시면 프론트에서 맞추겠습니다.
- 상세: [PET_PROFILE_INSURANCE_HANDOFF.md](./PET_PROFILE_INSURANCE_HANDOFF.md) 2절

---

## ❌ 철회된 요청 (작업 안 하셔도 됩니다)

### 펫보험 / 청구 관련 추가 작업
- 마이페이지에서 **Pet Insurance, Recent Claims 섹션을 UI에서 완전히 제거**했습니다.
- 이미 구현/배포하신 `/api/insurance/{userId}`, `/api/insurance/claims`는 그대로 두셔도 됩니다 — 지우실 필요도 없고, 추가로 기능을 붙이거나 버그를 고치실 필요도 없습니다. 프론트가 그냥 더 이상 호출하지 않는 것뿐입니다.
- 상세: [PET_PROFILE_INSURANCE_HANDOFF.md](./PET_PROFILE_INSURANCE_HANDOFF.md) 1절

---

## 참고 문서 목록

| 문서 | 상태 |
|---|---|
| [AUTH_API_HANDOFF.md](./AUTH_API_HANDOFF.md) | 회원가입/로그인/로그아웃/me — 완료, 실사용 중 |
| [CLINIC_INSURANCE_CHAT_API_HANDOFF.md](./CLINIC_INSURANCE_CHAT_API_HANDOFF.md) | 동물병원 조회, 펫보험/청구, AI챗봇, 근처 추천(recommend) — 완료, 실사용 중 (단, 보험/청구는 위 철회 참고) |
| [SCHEDULE_API_HANDOFF.md](./SCHEDULE_API_HANDOFF.md) | 일정 CRUD + location + 좌표 지오코딩 — 완료, 실사용 중 |
| [PET_PROFILE_INSURANCE_HANDOFF.md](./PET_PROFILE_INSURANCE_HANDOFF.md) | 이 문서에 정리된 두 요청의 원본 스펙 |
