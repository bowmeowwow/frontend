import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listClinics } from '../api/clinics'
import { listSchedules } from '../api/schedules'
import ClinicMap from '../components/ClinicMap'
import { clinicCategoryEmoji, clinicCategoryLabel } from '../constants/clinicCategories'

function ClinicDetailSheet({ clinic, schedules, onClose }) {
  const matchingSchedules = schedules
    .filter((schedule) => schedule.location && (schedule.location.includes(clinic.name) || clinic.name.includes(schedule.location)))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white shadow-2xl">
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-200" />
      <div className="max-h-[45vh] overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {clinic.category && <span className="text-2xl">{clinicCategoryEmoji(clinic.category)}</span>}
              <h3 className="text-lg font-semibold text-slate-900">{clinic.name}</h3>
            </div>
            {clinic.category && (
              <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {clinicCategoryLabel(clinic.category)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>📍 {clinic.address}</p>
          {clinic.phone && <p>📞 {clinic.phone}</p>}
        </div>

        {matchingSchedules.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-500">여기서 예정된 일정</p>
            <ul className="mt-2 space-y-2">
              {matchingSchedules.map((schedule) => (
                <li key={schedule.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {schedule.date} {schedule.time} · {schedule.title}
                  {schedule.petName && ` · ${schedule.petName}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function ClinicFinder() {
  const routerLocation = useLocation()
  const mapRef = useRef(null)
  const [query, setQuery] = useState('')
  const [clinics, setClinics] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [focusName, setFocusName] = useState(routerLocation.state?.focusName || null)
  const [focusPosition, setFocusPosition] = useState(
    routerLocation.state?.focusLat != null && routerLocation.state?.focusLng != null
      ? { lat: routerLocation.state.focusLat, lng: routerLocation.state.focusLng }
      : null,
  )
  const [selectedClinic, setSelectedClinic] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    listClinics()
      .then((data) => {
        if (!cancelled) setClinics(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || '병원 목록을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    // used only to show "여기서 예정된 일정" in the detail sheet — quietly
    // skip if it fails, it's a nice-to-have, not core to the map
    listSchedules()
      .then(setSchedules)
      .catch(() => {})
  }, [])

  const filteredClinics = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clinics
    return clinics.filter((clinic) => {
      const categoryLabel = clinicCategoryLabel(clinic.category).toLowerCase()
      return (
        clinic.name.toLowerCase().includes(q) ||
        clinic.address.toLowerCase().includes(q) ||
        clinic.district.toLowerCase().includes(q) ||
        categoryLabel.includes(q) ||
        clinic.category.toLowerCase().includes(q)
      )
    })
  }, [clinics, query])

  return (
    <div className="relative h-full">
      <ClinicMap
        ref={mapRef}
        clinics={filteredClinics}
        focusName={focusName}
        focusPosition={focusPosition}
        onSelect={(clinic) => {
          setSelectedClinic(clinic)
          setFocusName(null)
          setFocusPosition(null)
        }}
      />

      <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="카테고리(동물병원/호텔/미용) 또는 매장 이름·지역으로 검색"
          className="input max-w-md flex-1 bg-white shadow-sm"
        />
        {loading && (
          <span className="rounded-xl bg-white px-3 py-2 text-xs text-slate-400 shadow-sm">
            불러오는 중...
          </span>
        )}
        {error && (
          <span className="rounded-xl bg-white px-3 py-2 text-xs text-red-500 shadow-sm">{error}</span>
        )}
        {!loading && !error && query && (
          <span className="rounded-xl bg-white px-3 py-2 text-xs text-slate-400 shadow-sm">
            {filteredClinics.length}곳
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => mapRef.current?.recenterToMyLocation()}
        className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-lg hover:bg-slate-50"
        style={{ bottom: selectedClinic ? 'calc(45vh + 1rem)' : '1rem' }}
        aria-label="내 위치로 이동"
        title="내 위치로 이동"
      >
        🎯
      </button>

      {selectedClinic && (
        <ClinicDetailSheet
          clinic={selectedClinic}
          schedules={schedules}
          onClose={() => setSelectedClinic(null)}
        />
      )}
    </div>
  )
}

export default ClinicFinder
