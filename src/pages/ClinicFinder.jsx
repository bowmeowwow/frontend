import { useEffect, useState } from 'react'
import { getClinicPrices, listClinics } from '../api/clinics'
import ClinicMap from '../components/ClinicMap'

function ClinicPrices({ clinicId }) {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getClinicPrices(clinicId)
      .then((data) => {
        if (!cancelled) setPrices(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || '가격 정보를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [clinicId])

  if (loading) return <p className="text-xs text-slate-400">불러오는 중...</p>
  if (error) return <p className="text-xs text-red-500">{error}</p>
  if (prices.length === 0) return <p className="text-xs text-slate-400">등록된 가격 정보가 없습니다.</p>

  return (
    <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
      {prices.map((item) => (
        <li key={item.procedure} className="flex items-center justify-between text-xs">
          <span className="text-slate-500">{item.procedure}</span>
          <span className="font-medium text-slate-700">₩{item.price.toLocaleString('ko-KR')}</span>
        </li>
      ))}
    </ul>
  )
}

function ClinicCard({ clinic }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{clinic.name}</p>
          <p className="mt-1 text-xs text-slate-400">{clinic.address}</p>
          <p className="text-xs text-slate-400">{clinic.phone}</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          {clinic.district}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-3 text-xs font-medium text-emerald-600 hover:underline"
      >
        {expanded ? '가격표 닫기' : '가격표 보기'}
      </button>
      {expanded && <ClinicPrices clinicId={clinic.id} />}
    </div>
  )
}

function ClinicFinder() {
  const [district, setDistrict] = useState('')
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    listClinics(district || undefined)
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
  }, [district])

  return (
    <div className="space-y-6 p-8">
      <p className="text-xs text-slate-400">※ 병원 이름/전화번호는 예시 데이터입니다.</p>

      <input
        type="text"
        value={district}
        onChange={(event) => setDistrict(event.target.value)}
        placeholder="지역으로 검색 (예: 강남구)"
        className="input max-w-xs"
      />

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && clinics.length === 0 && (
        <p className="text-sm text-slate-400">조건에 맞는 병원이 없습니다.</p>
      )}

      {!loading && clinics.length > 0 && <ClinicMap clinics={clinics} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {clinics.map((clinic) => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </div>
  )
}

export default ClinicFinder
