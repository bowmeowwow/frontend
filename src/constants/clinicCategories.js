export const CLINIC_CATEGORIES = [
  { value: 'VET', label: '동물병원', emoji: '🏥', color: '#10b981' },
  { value: 'HOTEL', label: '호텔', emoji: '🏨', color: '#6366f1' },
  { value: 'GROOMING', label: '미용', emoji: '✂️', color: '#f97316' },
]

const DEFAULT_CATEGORY = { label: '기타', emoji: '📍', color: '#64748b' }

function categoryMeta(value) {
  return CLINIC_CATEGORIES.find((item) => item.value === value) || DEFAULT_CATEGORY
}

export function clinicCategoryLabel(value) {
  return categoryMeta(value).label
}

export function clinicCategoryEmoji(value) {
  return categoryMeta(value).emoji
}

export function clinicCategoryColor(value) {
  return categoryMeta(value).color
}

const SCHEDULE_CATEGORY_BY_CLINIC = {
  VET: 'CHECKUP',
  HOTEL: 'OTHER',
  GROOMING: 'GROOMING',
}

export function scheduleCategoryForClinic(clinicCategory) {
  return SCHEDULE_CATEGORY_BY_CLINIC[clinicCategory] || 'OTHER'
}
