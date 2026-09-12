export const CLINIC_CATEGORIES = [
  { value: 'VET', label: '동물병원' },
  { value: 'HOTEL', label: '호텔' },
  { value: 'GROOMING', label: '미용' },
]

export function clinicCategoryLabel(value) {
  return CLINIC_CATEGORIES.find((item) => item.value === value)?.label || value
}

const SCHEDULE_CATEGORY_BY_CLINIC = {
  VET: 'CHECKUP',
  HOTEL: 'OTHER',
  GROOMING: 'GROOMING',
}

export function scheduleCategoryForClinic(clinicCategory) {
  return SCHEDULE_CATEGORY_BY_CLINIC[clinicCategory] || 'OTHER'
}
