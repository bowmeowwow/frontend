import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { petCategoryLabel } from '../constants/petCategories'
import { useInsurance } from '../hooks/useInsurance'
import { usePets } from '../hooks/usePets'
import {
  HEALTH_STATUS,
  SPECIES_OPTIONS,
  calculateAge,
  claimStatusMeta,
  formatCurrency,
  speciesLabel,
} from '../mock/petProfileHelpers'
import { readMockProfile, writeMockProfile } from '../mock/petProfileStore'
import PetsPage from './PetsPage'

const EMPTY_PET = { name: '', species: 'DOG', breed: '', birthDate: '', weight: '' }

function ProfileHeader({ profile }) {
  const { user } = useAuth()
  const initials = (user?.name || 'Guest')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
          {initials}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">{user?.name || 'Guest'}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          {profile.phone && <p className="text-sm text-slate-400">{profile.phone}</p>}
        </div>
      </div>
      <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
        Premium Plan
      </span>
    </div>
  )
}

function AddPetForm({ onAdd, onCancel }) {
  const [pet, setPet] = useState(EMPTY_PET)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!pet.name || !pet.breed || !pet.birthDate || !pet.weight) {
      setError('모든 항목을 입력해 주세요.')
      return
    }
    onAdd({
      id: crypto.randomUUID(),
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birthDate,
      weight: Number(pet.weight),
      healthStatus: 'HEALTHY',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <input
          type="text"
          value={pet.name}
          onChange={(event) => setPet((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="이름"
          className="input"
        />
        <select
          value={pet.species}
          onChange={(event) => setPet((prev) => ({ ...prev, species: event.target.value }))}
          className="input"
        >
          {SPECIES_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={pet.breed}
          onChange={(event) => setPet((prev) => ({ ...prev, breed: event.target.value }))}
          placeholder="품종"
          className="input"
        />
        <input
          type="date"
          value={pet.birthDate}
          onChange={(event) => setPet((prev) => ({ ...prev, birthDate: event.target.value }))}
          className="input"
        />
        <input
          type="number"
          min="0"
          step="0.1"
          value={pet.weight}
          onChange={(event) => setPet((prev) => ({ ...prev, weight: event.target.value }))}
          placeholder="몸무게(kg)"
          className="input col-span-2 sm:col-span-1"
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700">
          등록
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          취소
        </button>
      </div>
    </form>
  )
}

function PetCard({ pet }) {
  const status = HEALTH_STATUS[pet.healthStatus] || HEALTH_STATUS.HEALTHY
  const age = calculateAge(pet.birthDate)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
            🐾
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{pet.name}</p>
            <p className="text-xs text-slate-400">
              {speciesLabel(pet.species)} · {pet.breed}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-400">
        <span>{age != null ? `${age}살` : '-'}</span>
        <span>{pet.weight}kg</span>
      </div>
    </div>
  )
}

function MyPetsSection({ profile, onAddPet }) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">My Pets</h3>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-xl border border-dashed border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
          >
            + Add a pet
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <AddPetForm
            onAdd={(pet) => {
              onAddPet(pet)
              setAdding(false)
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {profile.pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}

function NewClaimForm({ pets, onAdd, onCancel }) {
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!petId || !description || !amount) {
      setError('모든 항목을 입력해 주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onAdd({ petId: Number(petId), description, amount: Number(amount) })
    } catch (err) {
      setError(err.message || '청구 접수에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2 rounded-2xl border border-emerald-200 p-3">
      <select value={petId} onChange={(event) => setPetId(event.target.value)} className="input">
        {pets.map((pet) => (
          <option key={pet.id} value={pet.id}>
            {pet.name} ({petCategoryLabel(pet.category)})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="진료 내용 (예: 슬개골 탈구 수술)"
        className="input"
      />
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="청구 금액"
        className="input"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? '접수 중...' : '청구 접수'}
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

function InsuranceSection() {
  const { policy, policyError, claims, loading, error, addClaim } = useInsurance()
  const { pets } = usePets()
  const [addingClaim, setAddingClaim] = useState(false)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Pet Insurance</h3>
          {policy && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
              {policy.status === 'ACTIVE' ? 'Active' : policy.status}
            </span>
          )}
        </div>

        {policyError && <p className="text-sm text-slate-400">{policyError}</p>}

        {policy && (
          <>
            <p className="text-sm font-medium text-slate-800">{policy.insurerName}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">월 보험료</span>
              <span className="font-medium text-slate-700">
                {formatCurrency(policy.monthlyPremium)} / month
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">보장 한도</span>
              <span className="font-medium text-slate-700">
                {formatCurrency(policy.coverageLimit)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Recent Claims</h3>
          {!addingClaim && pets.length > 0 && (
            <button
              type="button"
              onClick={() => setAddingClaim(true)}
              className="rounded-xl border border-dashed border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
            >
              + 청구 접수
            </button>
          )}
        </div>

        {addingClaim && (
          <NewClaimForm
            pets={pets}
            onAdd={async (input) => {
              await addClaim(input)
              setAddingClaim(false)
            }}
            onCancel={() => setAddingClaim(false)}
          />
        )}

        {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && claims.length === 0 && (
          <p className="text-sm text-slate-400">청구 내역이 없습니다.</p>
        )}

        <ul className="space-y-3">
          {claims.map((claim) => {
            const status = claimStatusMeta(claim.status)
            const pet = pets.find((item) => item.id === claim.petId)
            return (
              <li key={claim.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800">{claim.description}</p>
                  <p className="text-xs text-slate-400">{pet?.name || `Pet #${claim.petId}`}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{formatCurrency(claim.amount)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function MyPage() {
  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(() => readMockProfile())

  const handleAddPet = (pet) => {
    const next = { ...profile, pets: [...profile.pets, pet] }
    setProfile(next)
    writeMockProfile(next)
  }

  return (
    <div>
      <div className="flex gap-2 p-8 pb-0">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            tab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500'
          }`}
        >
          프로필 개요
        </button>
        <button
          type="button"
          onClick={() => setTab('manage')}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            tab === 'manage' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500'
          }`}
        >
          반려동물 관리
        </button>
      </div>

      {tab === 'overview' ? (
        <div className="space-y-6 p-8">
          <ProfileHeader profile={profile} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MyPetsSection profile={profile} onAddPet={handleAddPet} />
            </div>
            <InsuranceSection />
          </div>
        </div>
      ) : (
        <PetsPage />
      )}
    </div>
  )
}

export default MyPage
