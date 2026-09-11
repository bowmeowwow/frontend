import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name || !email || !password) {
      setError('모든 항목을 입력해 주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await signup({ name, email, password })
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <span className="text-3xl">🐾</span>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            Bow-Meow-Wow
          </h1>
          <p className="mt-1 text-sm text-slate-400">회원가입</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Kim Soyeon"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-400"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
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

export default Signup
