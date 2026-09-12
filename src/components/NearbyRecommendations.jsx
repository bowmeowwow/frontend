import { useEffect, useState } from 'react'
import { recommendPlaces } from '../api/chat'
import { createSchedule } from '../api/schedules'
import { CLINIC_CATEGORIES, clinicCategoryLabel, scheduleCategoryForClinic } from '../constants/clinicCategories'
import { usePets } from '../hooks/usePets'
import ScheduleForm from './ScheduleForm'

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => reject(new Error('위치 권한을 허용해 주세요.')),
    )
  })
}

function todayKey() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function PlaceCard({ place, pets, onAdded }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  if (adding) {
    return (
      <ScheduleForm
        initial={{
          title: `${clinicCategoryLabel(place.category)} 방문`,
          category: scheduleCategoryForClinic(place.category),
          date: todayKey(),
          location: place.name,
        }}
        pets={pets}
        onSubmit={async (form) => {
          await createSchedule(form)
          setAdded(true)
          setAdding(false)
          onAdded?.()
        }}
        onCancel={() => setAdding(false)}
      />
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">{place.name}</p>
          <p className="text-xs text-slate-400">
            {clinicCategoryLabel(place.category)} · {place.address}
          </p>
          <p className="text-xs text-slate-400">약 {place.distanceKm.toFixed(1)}km</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={added}
          className="shrink-0 rounded-xl border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-60"
        >
          {added ? '추가됨' : '일정에 추가'}
        </button>
      </div>
    </div>
  )
}

function NearbyRecommendations({ onScheduleAdded }) {
  const { pets } = usePets()
  const [category, setCategory] = useState('')
  const [petId, setPetId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reply, setReply] = useState('')
  const [places, setPlaces] = useState([])

  useEffect(() => {
    if (pets.length > 0 && !petId) setPetId(String(pets[0].id))
  }, [pets, petId])

  const handleRecommend = async () => {
    setLoading(true)
    setError('')
    setReply('')
    setPlaces([])
    try {
      const coords = await getCurrentPosition()
      const data = await recommendPlaces({
        latitude: coords.latitude,
        longitude: coords.longitude,
        category: category || null,
        petId: petId ? Number(petId) : null,
      })
      setReply(data.reply)
      setPlaces(data.places)
    } catch (err) {
      setError(err.message || '추천을 받아오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">🤖 AI 동물도우미</h3>

      <div className="flex flex-wrap gap-2">
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input flex-1">
          <option value="">전체</option>
          {CLINIC_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {pets.length > 0 && (
          <select value={petId} onChange={(event) => setPetId(event.target.value)} className="input flex-1">
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={handleRecommend}
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? '찾는 중...' : '내 주변 추천받기'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {reply && <p className="mt-3 text-sm text-slate-600">{reply}</p>}

      {places.length > 0 && (
        <div className="mt-3 space-y-2">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} pets={pets} onAdded={onScheduleAdded} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NearbyRecommendations
