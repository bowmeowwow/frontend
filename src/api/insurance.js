import { apiFetch } from './client'

export function getPolicy(userId) {
  return apiFetch(`/insurance/${userId}`)
}

export function listClaims() {
  return apiFetch('/insurance/claims')
}

export function createClaim({ petId, description, amount }) {
  return apiFetch('/insurance/claims', {
    method: 'POST',
    body: { petId, description, amount },
  })
}
