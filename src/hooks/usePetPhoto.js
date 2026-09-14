import { useEffect, useState } from 'react'
import { fetchPetPhotoBlob } from '../api/pets'

// the photo endpoint requires auth, so a plain <img src="..."> can't be
// used — fetch it as a blob and hand the component an object URL instead
export function usePetPhoto(petId, photoUrl) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!photoUrl) {
      setSrc(null)
      return
    }

    let cancelled = false
    let objectUrl

    fetchPetPhotoBlob(petId)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setSrc(null)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [petId, photoUrl])

  return src
}
