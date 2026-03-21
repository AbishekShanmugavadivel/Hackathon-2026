import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import Loader from './Loader'

const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Authenticating..." />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
