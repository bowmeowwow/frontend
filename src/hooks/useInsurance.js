import { useCallback, useEffect, useState } from 'react'
import * as insuranceApi from '../api/insurance'
import { useAuth } from '../context/AuthContext'

export function useInsurance() {
  const { user } = useAuth()
  const [policy, setPolicy] = useState(null)
  const [policyError, setPolicyError] = useState('')
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    setPolicyError('')

    const [policyResult, claimsResult] = await Promise.allSettled([
      insuranceApi.getPolicy(user.id),
      insuranceApi.listClaims(),
    ])

    if (policyResult.status === 'fulfilled') {
      setPolicy(policyResult.value)
    } else {
      setPolicy(null)
      setPolicyError(policyResult.reason?.message || '보험 정보를 불러오지 못했습니다.')
    }

    if (claimsResult.status === 'fulfilled') {
      setClaims(claimsResult.value)
    } else {
      setError(claimsResult.reason?.message || '청구 내역을 불러오지 못했습니다.')
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addClaim = async (input) => {
    const claim = await insuranceApi.createClaim(input)
    setClaims((prev) => [claim, ...prev])
    return claim
  }

  return { policy, policyError, claims, loading, error, refresh, addClaim }
}
