import { useCallback, useEffect, useState } from 'react'
import * as expensesApi from '../api/expenses'

export function useExpenses(month) {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [expensesData, summaryData] = await Promise.all([
        expensesApi.listExpenses({ month }),
        expensesApi.getExpenseSummary(month),
      ])
      setExpenses(expensesData)
      setSummary(summaryData)
    } catch (err) {
      setError(err.message || '가계부 내역을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addExpense = async (input) => {
    await expensesApi.createExpense(input)
    await refresh()
  }

  const editExpense = async (id, changes) => {
    await expensesApi.updateExpense(id, changes)
    await refresh()
  }

  const removeExpense = async (id) => {
    await expensesApi.deleteExpense(id)
    await refresh()
  }

  return { expenses, summary, loading, error, refresh, addExpense, editExpense, removeExpense }
}
