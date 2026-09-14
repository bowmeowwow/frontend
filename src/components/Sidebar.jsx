import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { path: '/home', label: '홈', icon: '🏠' },
  { path: '/clinic', label: '지도', icon: '📍' },
  { path: '/chat', label: 'AI챗봇', icon: '🤖' },
  { path: '/news', label: '뉴스', icon: '📰' },
  { path: '/mypet', label: '내 정보', icon: '🐾' },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  // ProtectedRoute reacts to isLoggedIn flipping to false and redirects to
  // /login on its own — navigating here too would race it and produce an
  // unpredictable `from` location.
  const handleLogout = () => {
    logout()
  }

  const initials = (user?.name || '게스트')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <aside
        className={`hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200 md:flex ${
          collapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="text-2xl">🐾</span>
          {!collapsed && (
            <h1 className="truncate text-lg font-semibold text-slate-900">
              Bow-Meow-Wow
            </h1>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user?.name || '게스트'}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={`mt-1 flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-red-500 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span className="text-base">🚪</span>
            {!collapsed && <span>로그아웃</span>}
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? 'text-emerald-600' : 'text-slate-400'
              }`
            }
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
