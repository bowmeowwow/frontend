function Topbar({ title }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="Notifications"
      >
        🔔
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  )
}

export default Topbar
