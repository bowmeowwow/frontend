import { useState } from 'react'
import { PET_CATEGORIES, petCategoryLabel } from '../constants/petCategories'
import { usePets } from '../hooks/usePets'

const EMPTY_FORM = { name: '', category: 'DOG', age: '' }

function AddPetForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.age) {
      setError('이름과 나이를 입력해 주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await onAdd({ name: form.name, category: form.category, age: Number(form.age) })
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message || '반려동물 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-500">이름</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="나비"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">종류</label>
        <select
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        >
          {PET_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-slate-500">나이</label>
        <input
          type="number"
          min="0"
          value={form.age}
          onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
          placeholder="3"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? '등록 중...' : '+ 등록'}
      </button>

      {error && <p className="text-xs text-red-500 sm:basis-full">{error}</p>}
    </form>
  )
}

function PetCard({ pet, onEdit, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: pet.name, category: pet.category, age: pet.age })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError('')
    setSubmitting(true)
    try {
      await onEdit(pet.id, { name: form.name, category: form.category, age: Number(form.age) })
      setEditing(false)
    } catch (err) {
      setError(err.message || '수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await onRemove(pet.id)
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다.')
      setSubmitting(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          >
            {PET_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
            className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{pet.name}</p>
        <p className="text-xs text-slate-400">
          {petCategoryLabel(pet.category)} · {pet.age}살
        </p>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          삭제
        </button>
      </div>
    </div>
  )
}

function PetsPage() {
  const { pets, loading, error, addPet, editPet, removePet } = usePets()

  return (
    <div className="space-y-6 p-8">
      <AddPetForm onAdd={addPet} />

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && pets.length === 0 && (
        <p className="text-sm text-slate-400">등록된 반려동물이 없습니다.</p>
      )}

      <div className="space-y-3">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} onEdit={editPet} onRemove={removePet} />
        ))}
      </div>
    </div>
  )
}

export default PetsPage
