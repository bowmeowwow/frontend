import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const ROUTE_TITLES = {
  '/home': '홈',
  '/clinic': '지도',
  '/chat': 'AI챗봇',
  '/news': '뉴스',
  '/mypet': '내 정보',
}

function DashboardLayout() {
  const location = useLocation()
  const title = ROUTE_TITLES[location.pathname] || '홈'

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
