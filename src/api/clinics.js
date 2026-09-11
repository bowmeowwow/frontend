import { apiFetch } from './client'

export function listClinics(district) {
  const query = district ? `?district=${encodeURIComponent(district)}` : ''
  return apiFetch(`/clinics${query}`, { auth: false })
}

export function getClinicPrices(clinicId) {
  return apiFetch(`/clinics/${clinicId}/prices`, { auth: false })
}
