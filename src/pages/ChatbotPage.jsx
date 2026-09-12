import { useState } from 'react'
import { sendChatMessage } from '../api/chat'
import NearbyRecommendations from '../components/NearbyRecommendations'
import { usePets } from '../hooks/usePets'

const OPENING_MESSAGE = '안녕하세요! 어떤 반려동물에 대해 상담하고 싶으신가요? 이름을 알려주세요 🐾'

function ChatbotPage() {
  const { pets } = usePets()
  const [petId, setPetId] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: OPENING_MESSAGE }])
  const [sending, setSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    // if the user mentions a registered pet's name, silently pick up its
    // id so the backend can enrich its context — no dropdown needed
    const mentionedPet = pets.find((pet) => text.includes(pet.name))
    const nextPetId = mentionedPet ? mentionedPet.id : petId

    const userMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)
    setPetId(nextPetId)

    try {
      const data = await sendChatMessage({ message: text, petId: nextPetId })
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
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
      <NearbyRecommendations />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white p-5 shadow-sm">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              message.role === 'user'
                ? 'ml-auto bg-emerald-600 text-white'
                : message.role === 'error'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-slate-50 text-slate-700'
            }`}
          >
            {message.text}
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
