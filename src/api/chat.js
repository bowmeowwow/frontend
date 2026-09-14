import { apiFetch } from './client'

export function sendChatMessage({ message, petId, latitude, longitude, model }) {
  return apiFetch('/chat', {
    method: 'POST',
    body: {
      message,
      petId: petId ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      ...(model ? { model } : {}),
    },
  })
}

export function sendChatCompareMessage({ message, petId, latitude, longitude }) {
  return apiFetch('/chat/compare', {
    method: 'POST',
    body: {
      message,
      petId: petId ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    },
  })
}
