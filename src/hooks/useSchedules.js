import { useCallback, useEffect, useState } from 'react'
import * as schedulesApi from '../api/schedules'

export function useSchedules({ from, to }) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await schedulesApi.listSchedules({ from, to })
      setSchedules(data)
    } catch (err) {
      setError(err.message || '일정을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSchedule = async (input) => {
    const schedule = await schedulesApi.createSchedule(input)
    setSchedules((prev) => [...prev, schedule])
    return schedule
  }

  const editSchedule = async (id, changes) => {
    const schedule = await schedulesApi.updateSchedule(id, changes)
    setSchedules((prev) => prev.map((item) => (item.id === id ? schedule : item)))
    return schedule
  }

  const removeSchedule = async (id) => {
    await schedulesApi.deleteSchedule(id)
    setSchedules((prev) => prev.filter((item) => item.id !== id))
  }

  return { schedules, loading, error, refresh, addSchedule, editSchedule, removeSchedule }
}
