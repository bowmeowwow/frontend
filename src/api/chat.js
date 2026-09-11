import { apiFetch } from './client'

export function sendChatMessage({ message, petId }) {
  return apiFetch('/chat', {
    method: 'POST',
    body: { message, petId: petId ?? null },
  })
}
