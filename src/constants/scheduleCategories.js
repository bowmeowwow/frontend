export const SCHEDULE_CATEGORIES = [
  { value: 'VACCINATION', label: '예방접종', className: 'bg-emerald-500' },
  { value: 'CHECKUP', label: '정기검진', className: 'bg-blue-500' },
  { value: 'GROOMING', label: '미용', className: 'bg-purple-500' },
  { value: 'MEDICATION', label: '투약', className: 'bg-amber-500' },
  { value: 'OTHER', label: '기타', className: 'bg-slate-400' },
]

export function scheduleCategoryMeta(value) {
  return (
    SCHEDULE_CATEGORIES.find((item) => item.value === value) ||
    SCHEDULE_CATEGORIES[SCHEDULE_CATEGORIES.length - 1]
  )
}
