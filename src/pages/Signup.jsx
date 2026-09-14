import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { createPet } from '../api/pets'
import { PET_CATEGORIES } from '../constants/petCategories'
import { useAuth } from '../context/AuthContext'
import { calculateAge } from '../utils/calculateAge'

const EMPTY_PET = { name: '', category: 'DOG', birthDate: '', weight: '' }

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [account, setAccount] = useState({ name: '', email: '', password: '', phone: '' })
  const [pet, setPet] = useState(EMPTY_PET)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleNext = (event) => {
    event.preventDefault()
    if (!account.name || !account.email || !account.password) {
      setError('이름, 이메일, 비밀번호를 입력해 주세요.')
      return
    }
    setError('')
    setStep(2)
  }

  const finishSignup = async (registerPet) => {
    setError('')
    setSubmitting(true)
    try {
      await signup({
        name: account.name,
        email: account.email,
        password: account.password,
        phone: account.phone,
      })

      if (registerPet) {
        await createPet({
          name: pet.name,
          category: pet.category,
          age: calculateAge(pet.birthDate) ?? 0,
          birthDate: pet.birthDate,
          weight: pet.weight,
        })
      }

      navigate('/home', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!pet.name || !pet.birthDate || !pet.weight) {
      setError('반려동물 정보를 모두 입력해 주세요.')
      return
    }
    finishSignup(true)
  }

  const handleSkip = () => {
    setError('')
    finishSignup(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-3xl">🐾</span>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            Bow-Meow-Wow
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {step === 1 ? '회원 정보' : '반려동물 정보'}
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <Field label="이름">
              <input
                type="text"
                value={account.name}
                onChange={(event) => setAccount((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="이름을 입력하세요"
                className="input"
              />
            </Field>
            <Field label="이메일">
              <input
                type="email"
                value={account.email}
                onChange={(event) => setAccount((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="이메일을 입력하세요"
                className="input"
              />
            </Field>
            <Field label="비밀번호">
              <input
                type="password"
                value={account.password}
                onChange={(event) => setAccount((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="••••••••"
                className="input"
              />
            </Field>
            <Field label="전화번호">
              <input
                type="tel"
                value={account.phone}
                onChange={(event) => setAccount((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="010-1234-5678"
                className="input"
              />
            </Field>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit" className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
              다음
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="반려동물 이름">
              <input
                type="text"
                value={pet.name}
                onChange={(event) => setPet((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="반려동물 이름을 입력하세요"
                className="input"
              />
            </Field>

            <div className="flex gap-3">
              <Field label="종" className="w-28">
                <select
                  value={pet.category}
                  onChange={(event) => setPet((prev) => ({ ...prev, category: event.target.value }))}
                  className="input"
                >
                  {PET_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="생년월일" className="flex-1">
                <input
                  type="date"
                  value={pet.birthDate}
                  onChange={(event) => setPet((prev) => ({ ...prev, birthDate: event.target.value }))}
                  className="input"
                />
              </Field>
            </div>

            <Field label="몸무게 (kg)">
              <input
                type="number"
                min="0"
                step="0.1"
                value={pet.weight}
                onChange={(event) => setPet((prev) => ({ ...prev, weight: event.target.value }))}
                placeholder="4.2"
                className="input"
              />
            </Field>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? '계정 생성 중...' : '회원가입'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              disabled={submitting}
              className="w-full text-center text-xs font-medium text-slate-400 hover:text-emerald-600 disabled:opacity-60"
            >
              나중에 등록할게요 (건너뛰기)
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, className = '', children }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  )
}

export default Signup
