import { useEffect, useState } from 'react'

let loadPromise = null

function loadKakaoMapsSdk() {
  if (window.kakao?.maps) return Promise.resolve(window.kakao)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    // Kakao's JS key is meant to be public (client-side embedded, secured by
    // domain whitelisting, not secrecy) — fall back to it directly so the
    // map still works on deploys where the env var wasn't set.
    const appkey = import.meta.env.VITE_KAKAO_JS_KEY || 'eb86d727758323c12a6f539808ae1301'
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&libraries=services,clusterer&autoload=false`
    script.onerror = () => reject(new Error('카카오맵 SDK 로드에 실패했습니다.'))
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    document.head.appendChild(script)
  })

  return loadPromise
}

export function useKakaoMaps() {
  const [kakao, setKakao] = useState(window.kakao?.maps ? window.kakao : null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (kakao) return
    loadKakaoMapsSdk()
      .then(setKakao)
      .catch((err) => setError(err.message))
  }, [kakao])

  return { kakao, error }
}
