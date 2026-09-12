import { apiFetch } from './client'

export function listPets() {
  return apiFetch('/pets')
}

export function createPet({ name, category, age, birthDate, weight }) {
  return apiFetch('/pets', {
    method: 'POST',
    body: {
      name,
      category,
      age,
      birthDate: birthDate || null,
      weight: weight != null && weight !== '' ? Number(weight) : null,
    },
  })
}

export function updatePet(id, changes) {
  return apiFetch(`/pets/${id}`, {
    method: 'PATCH',
    body: changes,
  })
}

export function deletePet(id) {
  return apiFetch(`/pets/${id}`, { method: 'DELETE' })
}
