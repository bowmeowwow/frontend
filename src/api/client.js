const TOKEN_STORAGE_KEY = 'bmw.token'

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const hasBody = response.status !== 204
  const data = hasBody ? await response.json().catch(() => null) : null

  if (!response.ok) {
    throw new ApiError(data?.message || '요청 처리 중 오류가 발생했습니다.', response.status)
  }

  return data
}
