import { apiFetch } from './client'

export function sendChatMessage({ message, petId, latitude, longitude }) {
  return apiFetch('/chat', {
    method: 'POST',
    body: {
      message,
      petId: petId ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    },
  })
}
