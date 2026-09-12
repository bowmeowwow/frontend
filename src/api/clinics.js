import { apiFetch } from './client'

export function listClinics({ district, category } = {}) {
  const params = new URLSearchParams()
  if (district) params.set('district', district)
  if (category) params.set('category', category)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiFetch(`/clinics${query}`, { auth: false })
}
