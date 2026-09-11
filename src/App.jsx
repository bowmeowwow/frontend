import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import ComingSoon from './pages/ComingSoon'
import HomeDashboard from './components/HomeDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PetsPage from './pages/PetsPage'

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
            <Route path="/clinic" element={<ComingSoon title="Clinic Finder" />} />
            <Route path="/chat" element={<ComingSoon title="AI Chatbot" />} />
            <Route path="/news" element={<ComingSoon title="Pet News" />} />
            <Route path="/mypet" element={<PetsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
