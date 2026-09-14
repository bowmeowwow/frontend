import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [account, setAccount] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!account.name || !account.email || !account.password) {
      setError('이름, 이메일, 비밀번호를 입력해 주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await signup(account)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-3xl">🐾</span>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            Bow-Meow-Wow
          </h1>
          <p className="mt-1 text-sm text-slate-400">회원 정보</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? '계정 생성 중...' : '회원가입'}
          </button>
        </form>

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
