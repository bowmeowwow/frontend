import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async ({ email, password }) => {
    const data = await authApi.login({ email, password })
    setToken(data.accessToken)
    setUser(data.user)
  }

  const signup = async ({ email, password, name, phone }) => {
    const data = await authApi.signup({ email, password, name, phone })
    setToken(data.accessToken)
    setUser(data.user)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  const value = {
    isLoggedIn: Boolean(user),
    loading,
    user,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
