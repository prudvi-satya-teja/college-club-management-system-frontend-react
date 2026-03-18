import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore, { isSuperAdmin, canManageEvents } from '../store/authStore';
import { membershipApi } from '../api/membershipApi';
import Spinner from '../components/common/Spinner';

export default function ClubProtectedRoute({ adminOnly = false }) {
  const { id: clubId } = useParams();
  const { user } = useAuthStore();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSuperAdmin(user)) { setLoading(false); return; }
    membershipApi.getAllMemberships(null, 0, 100)
      .then(res => setMemberships(res.data.data || []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [user, clubId]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0f12' }}>
      <Spinner size="lg" />
    </div>
  );

  if (isSuperAdmin(user)) return <Outlet />;

  const role = memberships.find(m => m.club?.clubId === clubId)?.role ?? null;

  const allowed = adminOnly
    ? role === 'ADMIN'
    : role === 'ADMIN' || role === 'COORDINATOR';

  return allowed ? <Outlet /> : <Navigate to={`/clubs/${clubId}`} replace />;
}