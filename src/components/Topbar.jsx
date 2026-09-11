const TODAY = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function Topbar({ title }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-400">{TODAY}</p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400 sm:flex">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>

        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
          ⚠️ Parvovirus Alert
        </span>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  )
}

export default Topbar
