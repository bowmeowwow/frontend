import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const ROUTE_TITLES = {
  '/home': 'Home',
  '/clinic': 'Clinic Finder',
  '/chat': 'AI Chatbot',
  '/news': 'Pet News',
  '/mypet': 'My & Pet',
}

function DashboardLayout() {
  const location = useLocation()
  const title = ROUTE_TITLES[location.pathname] || 'Home'

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
