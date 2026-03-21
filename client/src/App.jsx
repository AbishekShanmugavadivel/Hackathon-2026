import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loading from './pages/Loading'
import Home from './pages/Home'
import Register from './pages/Register'
import Rules from './pages/Rules'
import Criteria from './pages/Criteria'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminStudentDetails from './pages/AdminStudentDetails'
import RegisteredStudents from './pages/RegisteredStudents'
import ProtectedRoute from './components/ProtectedRoute'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { TeamRegistrationProvider } from './context/TeamRegistrationContext'

function App() {
  return (
    <AdminAuthProvider>
      <TeamRegistrationProvider>
        <div className="min-h-screen bg-pattern">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Loading />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/criteria" element={<Criteria />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/registered-students" element={<RegisteredStudents />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/student-details" 
                element={
                  <ProtectedRoute>
                    <AdminStudentDetails />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </TeamRegistrationProvider>
    </AdminAuthProvider>
  )
}

export default App
