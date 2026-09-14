import { useEffect, useState } from 'react'
import { sendChatMessage } from '../api/chat'
import { createSchedule } from '../api/schedules'
import { clinicCategoryLabel, scheduleCategoryForClinic } from '../constants/clinicCategories'
import { usePets } from '../hooks/usePets'
import ScheduleForm from '../components/ScheduleForm'
import { todayKey } from '../utils/monthKey'

const OPENING_MESSAGE =
  '안녕하세요! 어떤 반려동물에 대해 상담하고 싶으신가요? 이름을 알려주세요 🐾\n주변 동물병원·호텔·미용실 추천도 대화로 바로 물어보실 수 있어요.'

function ChatPlaceCard({ place, pets }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  if (adding) {
    return (
      <ScheduleForm
        initial={{
          title: `${clinicCategoryLabel(place.category)} 방문`,
          category: scheduleCategoryForClinic(place.category),
          date: todayKey(),
          location: place.name,
        }}
        pets={pets}
        onSubmit={async (form) => {
          await createSchedule(form)
          setAdded(true)
          setAdding(false)
        }}
        onCancel={() => setAdding(false)}
      />
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5">
      <div>
        <p className="text-xs font-medium text-slate-800">{place.name}</p>
        <p className="text-xs text-slate-400">
          {clinicCategoryLabel(place.category)} · 약 {place.distanceKm.toFixed(1)}km
        </p>
      </div>
      <button
        type="button"
        onClick={() => setAdding(true)}
        disabled={added}
        className="shrink-0 rounded-lg border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-60"
      >
        {added ? '추가됨' : '일정에 추가'}
      </button>
    </div>
  )
}

function ChatbotPage() {
  const { pets } = usePets()
  const [petId, setPetId] = useState(null)
  const [coords, setCoords] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: OPENING_MESSAGE }])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    // best-effort — if the user denies permission the chat still works,
    // it just can't answer "근처 병원 추천해줘" style questions
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    // if the user mentions a registered pet's name, silently pick up its
    // id so the backend can enrich its context — no dropdown needed
    const mentionedPet = pets.find((pet) => text.includes(pet.name))
    const nextPetId = mentionedPet ? mentionedPet.id : petId

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setSending(true)
    setPetId(nextPetId)

    try {
      const data = await sendChatMessage({
        message: text,
        petId: nextPetId,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      })
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply, places: data.places }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'error', text: err.message || 'AI 응답을 받아오지 못했습니다.' },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-8">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white p-5 shadow-sm">
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex flex-col gap-2'}>
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : message.role === 'error'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-slate-50 text-slate-700'
              }`}
            >
              {message.text}
            </div>
            {message.places?.length > 0 && (
              <div className="w-full max-w-[80%] space-y-2">
                {message.places.map((place) => (
                  <ChatPlaceCard key={place.id} place={place} pets={pets} />
                ))}
              </div>
            )}
          </div>
        ))}
        {sending && <div className="max-w-[80%] rounded-2xl bg-slate-50 px-4 py-2.5 text-sm text-slate-400">...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="메시지를 입력하세요"
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          전송
        </button>
      </form>
    </div>
  )
}

export default ChatbotPage
