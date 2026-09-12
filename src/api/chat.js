import { apiFetch } from './client'

export function sendChatMessage({ message, petId }) {
  return apiFetch('/chat', {
    method: 'POST',
    body: { message, petId: petId ?? null },
  })
}

export function recommendPlaces({ latitude, longitude, category, petId }) {
  return apiFetch('/chat/recommend', {
    method: 'POST',
    body: { latitude, longitude, category: category ?? null, petId: petId ?? null },
  })
}
