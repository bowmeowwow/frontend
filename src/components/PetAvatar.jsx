import { usePetPhoto } from '../hooks/usePetPhoto'

const SIZES = {
  md: 'h-10 w-10 text-lg',
  lg: 'h-14 w-14 text-2xl',
}

function PetAvatar({ pet, size = 'md' }) {
  const src = usePetPhoto(pet.id, pet.photoUrl)
  const sizeClass = SIZES[size] || SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={pet.name}
        className={`shrink-0 rounded-full object-cover ${sizeClass}`}
      />
    )
  }

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 ${sizeClass}`}>
      🐾
    </div>
  )
}

export default PetAvatar
