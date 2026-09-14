import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { scheduleCategoryMeta } from '../constants/scheduleCategories'
import { useSchedules } from '../hooks/useSchedules'
import { todayKey } from '../utils/monthKey'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function relativeDateLabel(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const diffDays = Math.round((target - today) / 86400000)
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '내일'
  return `${m}/${d}(${WEEKDAYS[target.getDay()]})`
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const from = todayKey()
  const to = toKey(new Date(Date.now() + 6 * 86400000))
  const { schedules, loading } = useSchedules({ from, to })

  const upcoming = schedules
    .slice()
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="알림"
      >
        🔔
        {upcoming.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100">
          <p className="px-1 pb-2 text-sm font-semibold text-slate-900">알림</p>

          {loading && <p className="px-1 py-3 text-sm text-slate-400">불러오는 중...</p>}

          {!loading && upcoming.length === 0 && (
            <p className="px-1 py-3 text-sm text-slate-400">다가오는 일정이 없습니다.</p>
          )}

          {!loading && upcoming.length > 0 && (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {upcoming.map((schedule) => {
                const meta = scheduleCategoryMeta(schedule.category)
                return (
                  <li key={schedule.id} className="rounded-xl px-2 py-2 hover:bg-slate-50">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.className}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {schedule.title} · {schedule.petName || '반려동물 미지정'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {relativeDateLabel(schedule.date)} {schedule.time} · {meta.label}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/home')
            }}
            className="mt-2 w-full rounded-xl px-2 py-2 text-center text-xs font-medium text-emerald-600 hover:bg-emerald-50"
          >
            전체 일정 보기
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
