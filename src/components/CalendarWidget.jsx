import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { scheduleCategoryMeta } from '../constants/scheduleCategories'
import { usePets } from '../hooks/usePets'
import { useSchedules } from '../hooks/useSchedules'
import ScheduleForm from './ScheduleForm'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const TODAY_KEY = toKey(new Date())

function ScheduleItem({ schedule, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const { pets } = usePets()
  const navigate = useNavigate()
  const meta = scheduleCategoryMeta(schedule.category)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(schedule.id)
    } catch (err) {
      setDeleteError(err.message || '삭제에 실패했습니다.')
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <ScheduleForm
        initial={{ ...schedule, location: schedule.location || '' }}
        pets={pets}
        onSubmit={async (form) => {
          const { title, petId, petName, time, category, date, location } = form
          await onEdit(schedule.id, { title, petId, petName, time, category, date, location })
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.className}`} />
          <div>
            <p className="text-sm font-medium text-slate-800">
              {schedule.title} · {schedule.petName || '반려동물 미지정'}
            </p>
            <p className="text-xs text-slate-400">
              {schedule.time} · {meta.label}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
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
      {schedule.location && (
        <button
          type="button"
          onClick={() =>
            navigate('/clinic', {
              state: {
                focusName: schedule.location,
                focusLat: schedule.latitude,
                focusLng: schedule.longitude,
              },
            })
          }
          className="mt-2 text-xs font-medium text-emerald-600 hover:underline"
        >
          📍 {schedule.location} 위치보기
        </button>
      )}
      {deleteError && <p className="mt-1 text-xs text-red-500">{deleteError}</p>}
    </div>
  )
}

function CalendarWidget() {
  const { pets } = usePets()
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(TODAY_KEY)
  const [adding, setAdding] = useState(false)

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const from = toKey(new Date(year, month, 1))
  const to = toKey(new Date(year, month + 1, 0))

  const { schedules, loading, error, addSchedule, editSchedule, removeSchedule } = useSchedules({
    from,
    to,
  })

  const schedulesByDate = {}
  for (const schedule of schedules) {
    if (!schedulesByDate[schedule.date]) schedulesByDate[schedule.date] = []
    schedulesByDate[schedule.date].push(schedule)
  }

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day))

  const changeMonth = (offset) => {
    setVisibleMonth(new Date(year, month + offset, 1))
  }

  const selectedSchedules = (schedulesByDate[selectedDate] || []).slice().sort((a, b) =>
    a.time.localeCompare(b.time),
  )

  const handleAdd = async (form) => {
    const created = await addSchedule(form)
    setSelectedDate(created.date)
    setAdding(false)
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            {year}년 {month + 1}월
          </h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="이전 달"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>
        </div>

        {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} />
            const key = toKey(date)
            const daySchedules = schedulesByDate[key] || []
            const isSelected = key === selectedDate
            const isToday = key === TODAY_KEY

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedDate(key)
                  setAdding(false)
                }}
                className={`flex h-16 flex-col items-center gap-1 rounded-xl py-1.5 text-sm transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : isToday
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{date.getDate()}</span>
                <span className="flex gap-0.5">
                  {daySchedules.slice(0, 3).map((schedule) => (
                    <span
                      key={schedule.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-white' : scheduleCategoryMeta(schedule.category).className
                      }`}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">{selectedDate}</p>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-xl border border-dashed border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
            >
              + 일정
            </button>
          )}
        </div>

        {adding && (
          <div className="mb-3">
            <ScheduleForm
              initial={{ date: selectedDate }}
              pets={pets}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
        {!loading && selectedSchedules.length === 0 && !adding && (
          <p className="text-sm text-slate-400">일정이 없습니다.</p>
        )}

        <div className="space-y-2">
          {selectedSchedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              onEdit={editSchedule}
              onDelete={removeSchedule}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarWidget
