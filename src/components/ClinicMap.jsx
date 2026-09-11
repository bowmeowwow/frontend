import { useEffect, useRef } from 'react'
import { useKakaoMaps } from '../hooks/useKakaoMaps'

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function ClinicMap({ clinics }) {
  const { kakao, error } = useKakaoMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!kakao || !containerRef.current || mapRef.current) return
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      level: 6,
    })
  }, [kakao])

  useEffect(() => {
    if (!kakao || !mapRef.current) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (clinics.length === 0) return

    const geocoder = new kakao.maps.services.Geocoder()
    const bounds = new kakao.maps.LatLngBounds()
    let pending = clinics.length

    clinics.forEach((clinic) => {
      geocoder.addressSearch(clinic.address, (result, status) => {
        pending -= 1
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const position = new kakao.maps.LatLng(result[0].y, result[0].x)
          const marker = new kakao.maps.Marker({ map: mapRef.current, position })
          const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:6px 10px;font-size:12px;">${escapeHtml(clinic.name)}</div>`,
          })
          kakao.maps.event.addListener(marker, 'click', () => infoWindow.open(mapRef.current, marker))
          markersRef.current.push(marker)
          bounds.extend(position)
        }
        if (pending === 0 && !bounds.isEmpty()) {
          mapRef.current.setBounds(bounds)
        }
      })
    })
  }, [kakao, clinics])

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>
  }

  return <div ref={containerRef} className="h-72 w-full rounded-2xl bg-slate-100" />
}

export default ClinicMap
