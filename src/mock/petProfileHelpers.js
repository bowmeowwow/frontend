export const SPECIES_OPTIONS = [
  { value: 'DOG', label: '강아지' },
  { value: 'CAT', label: '고양이' },
  { value: 'OTHER', label: '그 외' },
]

export function speciesLabel(value) {
  return SPECIES_OPTIONS.find((item) => item.value === value)?.label || value
}

export function calculateAge(birthDate) {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return Math.max(age, 0)
}

export const HEALTH_STATUS = {
  HEALTHY: { label: 'Healthy', className: 'bg-emerald-50 text-emerald-600' },
  ON_MEDS: { label: 'On Meds', className: 'bg-amber-50 text-amber-600' },
}

export const CLAIM_STATUS = {
  PENDING: { label: '심사중', className: 'bg-slate-100 text-slate-500' },
  APPROVED: { label: '승인', className: 'bg-blue-50 text-blue-600' },
  PAID: { label: '지급완료', className: 'bg-emerald-50 text-emerald-600' },
  REJECTED: { label: '반려', className: 'bg-red-50 text-red-500' },
}

export function claimStatusMeta(status) {
  return (
    CLAIM_STATUS[String(status).toUpperCase()] || {
      label: status,
      className: 'bg-slate-100 text-slate-500',
    }
  )
}

export function formatCurrency(amount) {
  return `₩${Number(amount).toLocaleString('ko-KR')}`
}
