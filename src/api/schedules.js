import { apiFetch } from './client'

export function listSchedules({ from, to } = {}) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiFetch(`/schedules${query}`)
}

export function createSchedule({ petId, petName, date, time, title, category, location }) {
  return apiFetch('/schedules', {
    method: 'POST',
    body: {
      petId: petId ?? null,
      petName: petName ?? null,
      date,
      time,
      title,
      category,
      location: location ?? null,
    },
  })
}

export function updateSchedule(id, changes) {
  return apiFetch(`/schedules/${id}`, {
    method: 'PATCH',
    body: changes,
  })
}

export function deleteSchedule(id) {
  return apiFetch(`/schedules/${id}`, { method: 'DELETE' })
}
