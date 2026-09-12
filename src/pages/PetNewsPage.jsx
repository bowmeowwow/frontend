import { useEffect, useState } from 'react'
import { listNews } from '../api/news'

function formatDateTime(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}

function NewsCard({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
      {item.summary && <p className="mt-2 text-sm text-slate-500">{item.summary}</p>}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        {item.source && <span>{item.source}</span>}
        {item.source && item.publishedAt && <span>·</span>}
        {item.publishedAt && <span>{formatDateTime(item.publishedAt)}</span>}
      </div>
    </a>
  )
}

function PetNewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    listNews()
      .then((data) => {
        if (!cancelled) setNews(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || '뉴스를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6 p-8">
      <p className="text-xs text-slate-400">매일 자정 최신 반려동물 뉴스로 업데이트됩니다.</p>

      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && news.length === 0 && (
        <p className="text-sm text-slate-400">등록된 뉴스가 없습니다.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default PetNewsPage
