import { apiFetch } from './client'

export function listExpenses({ petId, month } = {}) {
  const params = new URLSearchParams()
  if (petId) params.set('petId', petId)
  if (month) params.set('month', month)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiFetch(`/expenses${query}`)
}

export function getExpenseSummary(month) {
  return apiFetch(`/expenses/summary?month=${encodeURIComponent(month)}`)
}

export function createExpense({ petId, description, amount, date }) {
  return apiFetch('/expenses', {
    method: 'POST',
    body: { petId, description, amount, date: date || null },
  })
}

export function updateExpense(id, changes) {
  return apiFetch(`/expenses/${id}`, {
    method: 'PATCH',
    body: changes,
  })
}

export function deleteExpense(id) {
  return apiFetch(`/expenses/${id}`, { method: 'DELETE' })
}
