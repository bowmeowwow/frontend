import { apiFetch } from './client'

export function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}

export function signup({ email, password, name, phone }) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: { email, password, name, phone: phone || null },
    auth: false,
  })
}

export function logout() {
  return apiFetch('/auth/logout', { method: 'POST' })
}

export function fetchMe() {
  return apiFetch('/auth/me')
}
