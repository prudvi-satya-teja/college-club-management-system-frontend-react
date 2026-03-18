import { useEffect, useState } from 'react';
import useAuthStore, { canManageEvents, canAdminClub } from '../store/authStore';
import { membershipApi } from '../api/membershipApi';

export function useClubPermissions(clubId) {
  const user = useAuthStore(state => state.user);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    membershipApi.getAllMemberships(null, 0, 100)
      .then(res => setMemberships(res.data.data || []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  return {
    loading,
    canManage: canManageEvents(user, memberships, clubId),
    canAdmin:  canAdminClub(user, memberships, clubId),
  };
}