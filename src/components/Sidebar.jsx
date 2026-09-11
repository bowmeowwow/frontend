import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/clinic', label: 'Clinic Finder', icon: '📍' },
  { path: '/chat', label: 'AI Chatbot', icon: '🤖' },
  { path: '/news', label: 'Pet News', icon: '📰' },
  { path: '/mypet', label: 'My & Pet', icon: '🐾' },
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

  const initials = (user?.name || 'Guest')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside
      className={`flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-[260px]'
      }`}
    >
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-2xl">🐾</span>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              Bow-Meow-Wow
            </h1>
            <p className="truncate text-xs text-slate-400">
              Pet Healthcare Platform
            </p>
          </div>
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
                {user?.name || 'Guest'}
              </p>
              <p className="truncate text-xs text-slate-400">Premium Plan</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
