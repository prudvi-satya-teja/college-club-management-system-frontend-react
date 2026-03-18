import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const loadToken = () => localStorage.getItem('accessToken');

const decodeToken = token => {
  try {
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

const buildUser = decoded => {
  if (!decoded) return null;
  return {
    email:  decoded.sub || decoded.email,
    role:   decoded.role || 'USER',   
    userId: decoded.userId,
    name:   decoded.name,
    claims: decoded,
  };
};

const useAuthStore = create(set => {
  const token   = loadToken();
  const decoded = decodeToken(token);

  return {
    token,
    user:            buildUser(decoded),
    isAuthenticated: !!token,

    login: newToken => {
      const d = decodeToken(newToken);
      localStorage.setItem('accessToken', newToken);
      set({
        token:           newToken,
        user:            buildUser(d),
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('accessToken');
      set({ token: null, user: null, isAuthenticated: false });
      window.location.href = '/login';
    },

    setUser: userObj => set(state => ({ user: { ...state.user, ...userObj } })),
  };
});

export default useAuthStore;

export const isSuperAdmin = user => user?.role === 'SUPER_ADMIN';


/**
 * Returns the user's role in a specific club, or null if not a member.
 * @param {Array}  memberships 
 * @param {string} clubId       
 * @returns {'ADMIN' | 'COORDINATOR' | 'MEMBER' | null}
 */
export const getClubRole = (memberships, clubId) => {
  const membership = memberships?.find(m => m.club?.clubId === clubId);
  return membership?.role ?? null;
};

export const canManageEvents = (user, memberships, clubId) => {
  if (isSuperAdmin(user)) return true;
  const role = getClubRole(memberships, clubId);
  return role === 'ADMIN' || role === 'COORDINATOR';
};

export const canAdminClub = (user, memberships, clubId) => {
  if (isSuperAdmin(user)) return true;
  return getClubRole(memberships, clubId) === 'ADMIN';
};

export const isClubMember = (memberships, clubId) => {
  return !!memberships?.find(m => m.club?.clubId === clubId);
};

export const isClubAdmin = (memberships, clubId) => {
  return getClubRole(memberships, clubId) === 'ADMIN';
};


export const getRoleBadgeColor = role => {
  const colors = {
    SUPER_ADMIN:  '#e05a5a',
    ADMIN:        '#e67e22',
    COORDINATOR:  '#4a6cf7',
    MEMBER:       '#34c77b',
    USER:         '#7a7e8f',
  };
  return colors[role] || '#7a7e8f';
};

export const getRoleBadgeLabel = role => {
  const labels = {
    SUPER_ADMIN:  'Super Admin',
    ADMIN:        'Admin',
    COORDINATOR:  'Coordinator',
    MEMBER:       'Member',
    USER:         'User',
  };
  return labels[role] || role;
};