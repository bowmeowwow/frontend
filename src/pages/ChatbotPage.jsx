import { useState } from 'react'
import { sendChatMessage } from '../api/chat'
import { usePets } from '../hooks/usePets'

function ChatbotPage() {
  const { pets } = usePets()
  const [petId, setPetId] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const userMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const data = await sendChatMessage({ message: text, petId: petId ? Number(petId) : null })
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
    <div className="flex h-full flex-col p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-slate-500">상담 대상 반려동물</span>
        <select value={petId} onChange={(event) => setPetId(event.target.value)} className="input max-w-[200px]">
          <option value="">선택 안 함</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white p-5 shadow-sm">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            반려동물의 건강, 증상, 보험에 대해 무엇이든 물어보세요.
          </p>
        )}
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

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
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
