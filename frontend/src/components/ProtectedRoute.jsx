import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect based on their actual role or to a default
        if (user.role === 'Nurse') return <Navigate to="/nurse" replace />;
        if (user.role === 'Doctor') return <Navigate to="/doctor" replace />;
        if (user.role === 'Patient') return <Navigate to="/patient" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
