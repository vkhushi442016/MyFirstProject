import useStore from './common/store/store';
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const token = useStore((state) => state.token)

    if (!token) {
        if (location.pathname.startsWith("/admin")) {
            return <Navigate to="/admin/login" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }
    return <Outlet />
}

export default ProtectedRoute
