import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listClinics } from '../api/clinics'
import ClinicMap from '../components/ClinicMap'
import { clinicCategoryLabel } from '../constants/clinicCategories'

function ClinicInfoCard({ clinic, onClose }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:left-4 sm:right-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{clinic.name}</p>
          {clinic.category && (
            <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              {clinicCategoryLabel(clinic.category)}
            </span>
          )}
          <p className="mt-1 text-xs text-slate-400">{clinic.address}</p>
          {clinic.phone && <p className="text-xs text-slate-400">{clinic.phone}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function ClinicFinder() {
  const routerLocation = useLocation()
  const [query, setQuery] = useState('')
  const [clinics, setClinics] = useState([])
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

      {selectedClinic && (
        <ClinicInfoCard clinic={selectedClinic} onClose={() => setSelectedClinic(null)} />
      )}
    </div>
  )
}

export default ClinicFinder
