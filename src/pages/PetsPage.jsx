import { useEffect, useRef, useState } from 'react'
import PetAvatar from '../components/PetAvatar'
import { PET_CATEGORIES, petCategoryLabel } from '../constants/petCategories'
import { usePets } from '../hooks/usePets'

const EMPTY_FORM = { name: '', category: 'DOG', age: '' }
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_BYTES = 3 * 1024 * 1024

function AddPetForm({ onAdd, onUploadPhoto }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(photoFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photoFile])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setError('jpg, png, webp 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('3MB 이하 파일만 업로드할 수 있습니다.')
      return
    }
    setError('')
    setPhotoFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.age) {
      setError('이름과 나이를 입력해 주세요.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const pet = await onAdd({ name: form.name, category: form.category, age: Number(form.age) })
      if (photoFile) {
        await onUploadPhoto(pet.id, photoFile)
      }
      setForm(EMPTY_FORM)
      setPhotoFile(null)
    } catch (err) {
      setError(err.message || '반려동물 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-slate-200 bg-slate-50 text-lg hover:border-emerald-300"
          aria-label="사진 선택"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기" className="h-full w-full object-cover" />
          ) : (
            '📷'
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-500">이름</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="나비"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">종류</label>
        <select
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        >
          {PET_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-slate-500">나이</label>
        <input
          type="number"
          min="0"
          value={form.age}
          onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
          placeholder="3"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? '등록 중...' : '+ 등록'}
      </button>

      {error && <p className="text-xs text-red-500 sm:basis-full">{error}</p>}
    </form>
  )
}

function PetCard({ pet, onEdit, onRemove, onUploadPhoto, onRemovePhoto }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: pet.name,
    category: pet.category,
    age: pet.age,
    birthDate: pet.birthDate || '',
    weight: pet.weight ?? '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef(null)

  const handleSave = async () => {
    setError('')
    setSubmitting(true)
    try {
      await onEdit(pet.id, {
        name: form.name,
        category: form.category,
        age: Number(form.age),
        birthDate: form.birthDate || null,
        weight: form.weight ? Number(form.weight) : null,
      })
      setEditing(false)
    } catch (err) {
      setError(err.message || '수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await onRemove(pet.id)
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다.')
      setSubmitting(false)
    }
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('jpg, png, webp 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('3MB 이하 파일만 업로드할 수 있습니다.')
      return
    }

    setPhotoError('')
    setUploadingPhoto(true)
    try {
      await onUploadPhoto(pet.id, file)
    } catch (err) {
      setPhotoError(err.message || '사진 업로드에 실패했습니다.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async () => {
    setPhotoError('')
    setUploadingPhoto(true)
    try {
      await onRemovePhoto(pet.id)
    } catch (err) {
      setPhotoError(err.message || '사진 삭제에 실패했습니다.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          >
            {PET_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
            className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) => setForm((prev) => ({ ...prev, birthDate: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.weight}
            onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
            placeholder="몸무게(kg)"
            className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <PetAvatar pet={pet} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-xs shadow-sm hover:bg-slate-50 disabled:opacity-60"
            aria-label="사진 변경"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{pet.name}</p>
          <p className="text-xs text-slate-400">
            {petCategoryLabel(pet.category)} · {pet.age}살
            {pet.weight != null && ` · ${pet.weight}kg`}
          </p>
          {pet.photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={uploadingPhoto}
              className="mt-1 text-xs font-medium text-slate-400 hover:text-red-500 disabled:opacity-60"
            >
              사진 삭제
            </button>
          )}
          {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          삭제
        </button>
      </div>
    </div>
  )
}

function PetsPage() {
  const { pets, loading, error, addPet, editPet, removePet, uploadPhoto, removePhoto } = usePets()

  return (
    <div className="space-y-6 p-8">
      <AddPetForm onAdd={addPet} onUploadPhoto={uploadPhoto} />

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && pets.length === 0 && (
        <p className="text-sm text-slate-400">등록된 반려동물이 없습니다.</p>
      )}

      <div className="space-y-3">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onEdit={editPet}
            onRemove={removePet}
            onUploadPhoto={uploadPhoto}
            onRemovePhoto={removePhoto}
          />
        ))}
      </div>
    </div>
  )
}

export default PetsPage
