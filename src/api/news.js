import { apiFetch } from './client'

export function listNews() {
  return apiFetch('/news', { auth: false })
}
