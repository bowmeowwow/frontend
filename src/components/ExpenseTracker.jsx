import { useState } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { usePets } from '../hooks/usePets'
import { currentMonthKey, todayKey } from '../utils/monthKey'

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString('ko-KR')}`
}

const EMPTY_FORM = { petId: '', description: '', amount: '', date: todayKey() }

function ExpenseForm({ pets, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, petId: pets[0]?.id ?? '', ...initial })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.petId || !form.description || !form.amount) {
      setError('모든 항목을 입력해 주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({
        petId: Number(form.petId),
        description: form.description,
        amount: Number(form.amount),
        date: form.date,
      })
    } catch (err) {
      setError(err.message || '저장에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-2xl border border-emerald-200 p-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={form.petId}
          onChange={(event) => setForm((prev) => ({ ...prev, petId: event.target.value }))}
          className="input flex-1"
        >
          <option value="">반려동물 선택</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          className="input w-40"
        />
      </div>
      <input
        type="text"
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="지출 내용"
        className="input"
      />
      <input
        type="number"
        min="0"
        value={form.amount}
        onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
        placeholder="금액"
        className="input"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          취소
        </button>
      </div>
    </form>
  )
}

function ExpenseRow({ expense, pets, onEdit, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const pet = pets.find((item) => item.id === expense.petId)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onRemove(expense.id)
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다.')
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <ExpenseForm
        pets={pets}
        initial={{
          petId: expense.petId,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
        }}
        onSubmit={async (form) => {
          await onEdit(expense.id, form)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{expense.description}</p>
        <p className="text-xs text-slate-400">
          {pet?.name || `Pet #${expense.petId}`} · {expense.date}
        </p>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-800">{formatWon(expense.amount)}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
        >
          삭제
        </button>
      </div>
    </div>
  )
}

function ExpenseTracker() {
  const month = currentMonthKey()
  const { pets } = usePets()
  const { expenses, summary, loading, error, addExpense, editExpense, removeExpense } = useExpenses(month)
  const [adding, setAdding] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">이번 달 가계부 ({month})</h3>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-xl border border-dashed border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
          >
            + 지출 추가
          </button>
        )}
      </div>

      {summary && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-600">이번 달 총액</p>
            <p className="text-lg font-semibold text-emerald-700">{formatWon(summary.total)}</p>
          </div>
          {summary.byPet.map((item) => (
            <div key={item.petId} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {item.petName} · {formatWon(item.total)}
            </div>
          ))}
        </div>
      )}

      {adding && (
        <div className="mb-4">
          <ExpenseForm
            pets={pets}
            onSubmit={async (form) => {
              await addExpense(form)
              setAdding(false)
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && expenses.length === 0 && (
        <p className="text-sm text-slate-400">이번 달 지출 내역이 없습니다.</p>
      )}

      <div className="space-y-2">
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            pets={pets}
            onEdit={editExpense}
            onRemove={removeExpense}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseTracker
