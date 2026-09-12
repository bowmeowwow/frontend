# 🐾 Bow-Meow-Wow — 반려동물 프로필 확장 요청서 (개정)

> **개정 이력**: 이 문서는 원래 "펫 프로필 확장 + 펫보험" 요청서였습니다. 이후 펫보험/청구는 [CLINIC_INSURANCE_CHAT_API_HANDOFF.md](./CLINIC_INSURANCE_CHAT_API_HANDOFF.md) 스펙으로 **다르게 실제 구현되어 배포까지 완료**됐었는데, 이번에 마이페이지 UI를 단순화하면서 **Pet Insurance / Recent Claims 섹션을 프론트에서 완전히 제거**했습니다. 그래서 아래 내용을 정리합니다.

---

## 1. 철회: 펫보험/청구 관련 요청

- 마이페이지에서 보험 가입 정보, 최근 청구 내역 UI를 전부 뺐습니다. `useInsurance` 훅과 `src/api/insurance.js`도 프론트에서 삭제했습니다.
- 이미 구현/배포하신 `/api/insurance/{userId}`, `/api/insurance/claims` API 자체는 그대로 두셔도 되고, 별도로 걷어내실 필요는 없습니다 — **다만 프론트가 더 이상 호출하지 않으니, 관련해서 추가 기능/버그 수정 작업은 우선순위를 낮춰주세요.**
- 혹시 이 API가 다른 화면(관리자 도구 등)에서 필요하시면 그대로 유지하셔도 무방합니다.

---

## 2. 남아있는 요청: 반려동물 필드 확장 (축소됨)

마이페이지 "My Pets" 카드는 이제 **이름 / 나이 / 몸무게**만 보여줍니다 (품종·건강상태 배지는 제거했습니다). 이 나이·몸무게가 지금은 `localStorage` mock으로만 동작 중이라, 실제 데이터로 바꾸려면 아래 두 필드만 있으면 됩니다.

### `POST /api/pets`, `PATCH /api/pets/{id}` 필드 추가

기존 `name` / `category`(CAT/DOG/OTHER) / `age`(정수)는 그대로 유지, 아래 2개만 추가해주세요.

```json
{
  "name": "코코",
  "category": "DOG",
  "age": 3,
  "birthDate": "2022-04-12",
  "weight": 4.2
}
```

- `birthDate` (`YYYY-MM-DD`, optional): 있으면 프론트에서 이 값 기준으로 나이를 계산해서 표시할 예정입니다. 없으면 기존 `age`(정수)를 그대로 씁니다.
- `weight` (kg, 소수, optional)

~~`breed`~~, ~~`healthStatus`~~는 더 이상 화면에 표시하지 않아서 요청에서 뺐습니다 — 혹시 이미 작업해두셨다면 그냥 두셔도 되고, 안 하셨으면 신경 안 쓰셔도 됩니다.

### 회원가입 `phone` 필드 (기존 요청 유지)

`POST /api/auth/signup`에 `phone`(optional) 추가하고 `user` 응답에도 포함해주시는 요청은 그대로 유효합니다 — 아직 반영 전이면 낮은 우선순위로 부탁드립니다.

---

## 3. 확인하고 싶은 사항

1. `birthDate`를 추가하면 기존 `age`(정수)와 둘 다 유지하실 건가요, 아니면 `birthDate`로 완전히 대체하실 건가요?
2. 지금 당장 급한 작업은 아니라서, 다른 작업 우선순위가 있으면 이건 뒤로 미루셔도 괜찮습니다.

---

## 4. 참고 (프론트에서 이미 반영한 내용)

- `src/mock/petProfileStore.js`에 `weight`/`birthDate`만 남기고 `healthStatus` 등은 정리했습니다.
- API가 준비되면 `MyPage.jsx`의 mock 저장 로직을 실제 `/api/pets` 호출로 교체하면 됩니다.
