import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requireAdmin = false }) {
    const { authUser, dbUser, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <p>Jogosultság ellenőrzése...</p>
    }

    if (!authUser) {
        return <Navigate to="/fiok" replace state={{ from: location }} />
    }

    if (requireAdmin && dbUser?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}