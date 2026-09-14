import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

function Topbar({ title }) {
  const { logout } = useAuth()

  // ProtectedRoute reacts to isLoggedIn flipping to false and redirects to
  // /login on its own — navigating here too would race it and produce an
  // unpredictable `from` location.
  const handleLogout = () => {
    logout()
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-8 sm:py-5">
      <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h2>

      <div className="flex items-center gap-1">
        <NotificationBell />
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="로그아웃"
        >
          🚪
        </button>
      </div>
    </header>
  )
}

export default Topbar
