export const PET_CATEGORIES = [
  { value: 'CAT', label: '고양이' },
  { value: 'DOG', label: '강아지' },
  { value: 'OTHER', label: '그 외' },
]

export function petCategoryLabel(value) {
  return PET_CATEGORIES.find((item) => item.value === value)?.label || value
}
