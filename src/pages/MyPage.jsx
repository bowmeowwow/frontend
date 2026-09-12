import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { petCategoryLabel } from '../constants/petCategories'
import { usePets } from '../hooks/usePets'
import PetsPage from './PetsPage'

function ProfileHeader() {
  const { user } = useAuth()
  const initials = (user?.name || 'Guest')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
        {initials}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{user?.name || 'Guest'}</p>
        <p className="text-sm text-slate-400">{user?.email}</p>
        {user?.phone && <p className="text-sm text-slate-400">{user.phone}</p>}
      </div>
    </div>
  )
}

function PetCard({ pet }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
          🐾
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{pet.name}</p>
          <p className="text-xs text-slate-400">{petCategoryLabel(pet.category)}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-400">
        <span>{pet.age}살</span>
        <span>{pet.weight != null ? `${pet.weight}kg` : '-'}</span>
      </div>
    </div>
  )
}

function MyPetsSection({ onManage }) {
  const { pets, loading, error } = usePets()

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">My Pets</h3>
        <button
          type="button"
          onClick={onManage}
          className="rounded-xl border border-dashed border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
        >
          + Add a pet
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && pets.length === 0 && (
        <p className="text-sm text-slate-400">등록된 반려동물이 없습니다.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}

function MyPage() {
  const [tab, setTab] = useState('overview')

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
          <ProfileHeader />
          <MyPetsSection onManage={() => setTab('manage')} />
        </div>
      ) : (
        <PetsPage />
      )}
    </div>
  )
}

export default MyPage
