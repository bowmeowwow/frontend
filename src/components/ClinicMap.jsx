import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { clinicCategoryColor, clinicCategoryEmoji } from '../constants/clinicCategories'
import { useKakaoMaps } from '../hooks/useKakaoMaps'

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }
const PIN_WIDTH = 34
const PIN_HEIGHT = 44

// draws a teardrop map pin as an inline SVG, tinted per category with the
// category's emoji inside — keeps it a real kakao.maps.Marker (not a
// CustomOverlay) so it still works with MarkerClusterer
function pinImage(kakao, color, emoji) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${PIN_WIDTH}" height="${PIN_HEIGHT}" viewBox="0 0 34 44">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.4 17 27 17 27s17-14.6 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/>
      <circle cx="17" cy="17" r="12" fill="white"/>
      <text x="17" y="22" font-size="14" text-anchor="middle">${emoji}</text>
    </svg>`
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return new kakao.maps.MarkerImage(url, new kakao.maps.Size(PIN_WIDTH, PIN_HEIGHT), {
    offset: new kakao.maps.Point(PIN_WIDTH / 2, PIN_HEIGHT),
  })
}

function myLocationImage(kakao) {
  const size = 30
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="9" fill="#2563eb" fill-opacity="0.25"/>
      <circle cx="15" cy="15" r="6" fill="#2563eb" stroke="white" stroke-width="2.5"/>
    </svg>`
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return new kakao.maps.MarkerImage(url, new kakao.maps.Size(size, size), {
    offset: new kakao.maps.Point(size / 2, size / 2),
  })
}

const ClinicMap = forwardRef(function ClinicMap({ clinics, focusName, focusPosition, onSelect }, ref) {
  const { kakao, error } = useKakaoMaps()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const clustererRef = useRef(null)
  const myLocationMarkerRef = useRef(null)
  const [myLocation, setMyLocation] = useState(null)

  // fetched once per page load (not watched continuously) — the "내 위치로
  //이동" button below just re-centers onto this same reading rather than
  // asking the browser for a fresh fix on every click
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {}, // no permission — the map just falls back to the Seoul-wide view
      // GPS if available, instead of the coarser (and often km-off) Wi-Fi/IP
      // estimate some browsers default to; don't reuse an old cached fix
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      recenterToMyLocation: () => {
        if (!kakao || !mapRef.current || !myLocation) return
        mapRef.current.panTo(new kakao.maps.LatLng(myLocation.lat, myLocation.lng))
        mapRef.current.setLevel(5)
      },
      hasMyLocation: () => Boolean(myLocation),
    }),
    [kakao, myLocation],
  )

  useEffect(() => {
    if (!kakao || !containerRef.current || mapRef.current) return
    const center = myLocation ?? SEOUL_CENTER
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: myLocation ? 5 : 6,
    })
    // hundreds of clinics can be loaded at once (all of Seoul) — cluster
    // them so the map stays smooth instead of rendering every marker
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map: mapRef.current,
      averageCenter: true,
      minLevel: 6,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakao])

  // once real geolocation resolves, recenter the already-created map onto it
  useEffect(() => {
    if (!kakao || !mapRef.current || !myLocation) return

    const position = new kakao.maps.LatLng(myLocation.lat, myLocation.lng)
    mapRef.current.setCenter(position)
    mapRef.current.setLevel(5)

    if (myLocationMarkerRef.current) myLocationMarkerRef.current.setMap(null)
    myLocationMarkerRef.current = new kakao.maps.Marker({
      map: mapRef.current,
      position,
      image: myLocationImage(kakao),
      zIndex: 10,
      title: '내 위치',
    })
  }, [kakao, myLocation])

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
      const marker = new kakao.maps.Marker({
        position,
        image: pinImage(kakao, clinicCategoryColor(clinic.category), clinicCategoryEmoji(clinic.category)),
      })
      kakao.maps.event.addListener(marker, 'click', () => onSelect?.({ ...clinic, position }))
      bounds.extend(position)
      return marker
    })

    clustererRef.current.addMarkers(markers)
    // don't fight the real-location recenter with a bounds-fit on first load
    if (!myLocation) mapRef.current.setBounds(bounds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
})

export default ClinicMap
