import { useNavigate } from 'react-router-dom'
import { petCategoryLabel } from '../constants/petCategories'
import { usePets } from '../hooks/usePets'

const APPOINTMENTS = [
  { date: 'Sep 18', time: '10:30 AM', title: 'Vaccination', pet: 'Coco', clinic: 'Green Paw Clinic' },
  { date: 'Sep 22', time: '2:00 PM', title: 'Dental Checkup', pet: 'Luna', clinic: 'Sunny Vet Center' },
  { date: 'Oct 02', time: '11:00 AM', title: 'General Checkup', pet: 'Coco', clinic: 'Green Paw Clinic' },
]

const QUICK_ACTIONS = [
  { icon: '📍', label: 'Find Clinic' },
  { icon: '🤖', label: 'AI Consult' },
  { icon: '📋', label: 'Pet Records' },
  { icon: '📰', label: 'Pet News' },
]

function EmergencyBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="text-xl">🚨</span>
        <div>
          <p className="text-sm font-semibold text-red-700">
            Parvovirus outbreak reported in your area
          </p>
          <p className="text-xs text-red-500">
            Keep unvaccinated pets away from public parks until further notice.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Find Clinic
      </button>
    </div>
  )
}

function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-emerald-50 p-5 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">Hi Soyeon 👋</p>
        <p className="mt-2 text-sm text-slate-600">
          Coco &amp; Luna need a check-up soon
        </p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-medium text-slate-400">Next Visit</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">Sep 18</p>
        <p className="text-xs text-slate-400">Vaccination</p>
      </div>
      <div className="rounded-2xl bg-blue-50 p-5 shadow-sm">
        <p className="text-xs font-medium text-blue-600">Health Score</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">92/100</p>
        <p className="text-xs text-blue-500">Excellent</p>
      </div>
      <div className="rounded-2xl bg-orange-50 p-5 shadow-sm">
        <p className="text-xs font-medium text-orange-600">Medication</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">3 days</p>
        <p className="text-xs text-orange-500">Antibiotic left</p>
      </div>
    </div>
  )
}

function MyPets() {
  const { pets, loading } = usePets()
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">My Pets</h3>
      </div>

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {!loading && pets.length === 0 && (
        <p className="text-sm text-slate-400">등록된 반려동물이 없습니다.</p>
      )}

      <div className="space-y-3">
        {pets.map((pet) => (
          <div key={pet.id} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-sm font-medium text-slate-800">{pet.name}</p>
            <p className="text-xs text-slate-400">
              {petCategoryLabel(pet.category)} · {pet.age}살
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate('/mypet')}
        className="mt-4 w-full rounded-2xl border border-dashed border-slate-200 py-2.5 text-sm font-medium text-slate-400 hover:border-emerald-300 hover:text-emerald-600"
      >
        + Add a pet
      </button>
    </div>
  )
}

function UpcomingAppointments() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Upcoming Appointments
      </h3>
      <ul className="space-y-4">
        {APPOINTMENTS.map((appt) => (
          <li key={`${appt.date}-${appt.title}`} className="flex gap-3">
            <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-xs font-medium text-emerald-700">
              {appt.date}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {appt.title} · {appt.pet}
              </p>
              <p className="truncate text-xs text-slate-400">
                {appt.time} · {appt.clinic}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuickActions() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 py-4 text-xs font-medium text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-sm">
        <p className="text-xs font-medium text-emerald-100">
          AI Health Tip Today
        </p>
        <p className="mt-2 text-sm">
          Regular brushing 2-3 times a week helps prevent skin issues in
          double-coated breeds like Corgis.
        </p>
      </div>
    </div>
  )
}

function HomeDashboard() {
  return (
    <div className="space-y-6 p-8">
      <EmergencyBanner />
      <OverviewCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MyPets />
        <UpcomingAppointments />
        <QuickActions />
      </div>
    </div>
  )
}

export default HomeDashboard
