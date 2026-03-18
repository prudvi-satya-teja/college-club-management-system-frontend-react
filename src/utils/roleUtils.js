export const isSuperAdmin = user => user?.role === 'SUPER_ADMIN';

export const isClubAdmin = (memberships, clubId) => {
  return memberships?.some(m => m.club?.clubId === clubId && m.role === 'ADMIN');
};

export const getRoleBadgeColor = role => {
  const colors = {
    SUPER_ADMIN: 'bg-red-600',
    ADMIN: 'bg-orange-600',
    COORDINATOR: 'bg-blue-600',
    MEMBER: 'bg-green-600',
    USER: 'bg-gray-600'
  };
  return colors[role] || 'bg-gray-600';
};

export const getRoleBadgeLabel = role => {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    COORDINATOR: 'Coordinator',
    MEMBER: 'Member',
    USER: 'User'
  };
  return labels[role] || role;
};
