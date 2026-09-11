// Pet insurance / rich profile fields (breed, birth date, weight, phone,
// insurance, claims) have no real backend endpoint yet — see
// docs/PET_PROFILE_INSURANCE_HANDOFF.md. This stores that data locally so
// Signup and MyPage can preview the intended UX before the API exists.

const STORAGE_KEY = 'bmw.mockProfile'

const DEFAULT_PROFILE = {
  phone: '',
  pets: [
    {
      id: 'demo-coco',
      name: 'Coco',
      species: 'DOG',
      breed: 'Poodle',
      birthDate: '2022-04-12',
      weight: 4.2,
      healthStatus: 'HEALTHY',
    },
    {
      id: 'demo-luna',
      name: 'Luna',
      species: 'DOG',
      breed: 'Corgi',
      birthDate: '2023-08-01',
      weight: 11.5,
      healthStatus: 'ON_MEDS',
    },
  ],
  insurance: {
    insurer: 'KB Pet Insurance',
    product: 'Care Plan',
    monthlyPremium: 45000,
    coverageSummary: '수술 최대 500만원, 통원 최대 30만원',
    renewalDate: '2027-03-01',
    status: 'ACTIVE',
  },
  claims: [
    { id: 'claim-1', date: '2026-08-20', clinic: 'Green Paw Clinic', amount: 120000, status: 'APPROVED' },
    { id: 'claim-2', date: '2026-07-02', clinic: 'Sunny Vet Center', amount: 45000, status: 'PAID' },
  ],
}

export function readMockProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function writeMockProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function addMockPet(pet) {
  const profile = readMockProfile()
  const next = { ...profile, pets: [...profile.pets, pet] }
  writeMockProfile(next)
  return next
}
