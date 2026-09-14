import { useState } from 'react'
import { SCHEDULE_CATEGORIES } from '../constants/scheduleCategories'

const EMPTY_SCHEDULE_FORM = {
  title: '',
  petId: null,
  petName: '',
  time: '',
  category: 'CHECKUP',
  date: '',
  location: '',
}

function ScheduleForm({ initial, onSubmit, onCancel, pets }) {
  const [form, setForm] = useState({ ...EMPTY_SCHEDULE_FORM, ...initial })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSelectPet = (petId) => {
    const pet = pets.find((item) => String(item.id) === petId)
    setForm((prev) => ({ ...prev, petId: pet?.id ?? null, petName: pet?.name ?? '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title || !form.petName || !form.time || !form.date) {
      setError('모든 항목을 입력해 주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.message || '저장에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-2xl border border-emerald-200 p-3">
      <input
        type="text"
        value={form.title}
        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        placeholder="일정 제목"
        className="input"
      />
      <div className="flex gap-2">
        {pets.length > 0 ? (
          <select
            value={form.petId ?? ''}
            onChange={(event) => handleSelectPet(event.target.value)}
            className="input flex-1"
          >
            <option value="">반려동물 선택</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={form.petName}
            onChange={(event) => setForm((prev) => ({ ...prev, petName: event.target.value }))}
            placeholder="반려동물 이름"
            className="input flex-1"
          />
        )}
        <input
          type="time"
          value={form.time}
          onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
          className="input w-32"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          className="input flex-1"
        >
          {SCHEDULE_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
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
        value={form.location}
        onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
        placeholder="병원/장소 (선택)"
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

export default ScheduleForm
