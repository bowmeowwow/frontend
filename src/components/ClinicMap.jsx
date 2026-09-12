import { useEffect, useRef } from 'react'
import { useKakaoMaps } from '../hooks/useKakaoMaps'

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }

function ClinicMap({ clinics, focusName, focusPosition, onSelect }) {
  const { kakao, error } = useKakaoMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const clustererRef = useRef(null)

  useEffect(() => {
    if (!kakao || !containerRef.current || mapRef.current) return
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      level: 6,
    })
    // hundreds of clinics can be loaded at once (all of Seoul) — cluster
    // them so the map stays smooth instead of rendering every marker
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapRef.current,
      averageCenter: true,
      minLevel: 6,
    })
  }, [kakao])

  // place markers straight from the API's lat/lng — no client-side
  // geocoding needed since the backend geocodes clinic addresses itself
  useEffect(() => {
    if (!kakao || !mapRef.current || !clustererRef.current) return

    clustererRef.current.clear()

    const located = clinics.filter((clinic) => clinic.latitude != null && clinic.longitude != null)
    if (located.length === 0) return

    const bounds = new kakao.maps.LatLngBounds()
    const markers = located.map((clinic) => {
      const position = new kakao.maps.LatLng(clinic.latitude, clinic.longitude)
      const marker = new kakao.maps.Marker({ position })
      kakao.maps.event.addListener(marker, 'click', () => onSelect?.({ ...clinic, position }))
      bounds.extend(position)
      return marker
    })

    clustererRef.current.addMarkers(markers)
    mapRef.current.setBounds(bounds)
  }, [kakao, clinics, onSelect])

  // pan to a specific schedule/clinic location — prefer an exact clinic
  // name match (richer info), otherwise fall back to raw coordinates
  useEffect(() => {
    if (!kakao || !mapRef.current || !focusName) return

    const match = clinics.find(
      (clinic) => clinic.name.includes(focusName) || focusName.includes(clinic.name),
    )

    if (match && match.latitude != null && match.longitude != null) {
      const position = new kakao.maps.LatLng(match.latitude, match.longitude)
      mapRef.current.panTo(position)
      mapRef.current.setLevel(3)
      onSelect?.({ ...match, position })
      return
    }

    if (focusPosition) {
      const position = new kakao.maps.LatLng(focusPosition.lat, focusPosition.lng)
      mapRef.current.panTo(position)
      mapRef.current.setLevel(3)
      onSelect?.({
        id: null,
        name: focusName,
        address: focusName,
        phone: '',
        category: null,
        position,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakao, focusName, focusPosition, clinics])

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>
  }

  return <div ref={containerRef} className="h-full w-full" />
}

export default ClinicMap
