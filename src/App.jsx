import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import ChatbotPage from './pages/ChatbotPage'
import ClinicFinder from './pages/ClinicFinder'
import ComingSoon from './pages/ComingSoon'
import HomeDashboard from './components/HomeDashboard'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomeDashboard />} />
            <Route path="/clinic" element={<ClinicFinder />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/news" element={<ComingSoon title="Pet News" />} />
            <Route path="/mypet" element={<MyPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
