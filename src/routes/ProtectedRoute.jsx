import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore, { isSuperAdmin } from '../store/authStore';

export default function ProtectedRoute({ children, superAdminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (superAdminOnly && !isSuperAdmin(user)) return <Navigate to="/" replace />;

  return children ?? <Outlet />;
}