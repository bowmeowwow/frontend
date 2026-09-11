import { useCallback, useEffect, useState } from 'react'
import * as petsApi from '../api/pets'

export function usePets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await petsApi.listPets()
      setPets(data)
    } catch (err) {
      setError(err.message || '반려동물 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addPet = async (input) => {
    const pet = await petsApi.createPet(input)
    setPets((prev) => [...prev, pet])
    return pet
  }

  const editPet = async (id, changes) => {
    const pet = await petsApi.updatePet(id, changes)
    setPets((prev) => prev.map((item) => (item.id === id ? pet : item)))
    return pet
  }

  const removePet = async (id) => {
    await petsApi.deletePet(id)
    setPets((prev) => prev.filter((item) => item.id !== id))
  }

  return { pets, loading, error, refresh, addPet, editPet, removePet }
}
