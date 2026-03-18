import useAuthStore, { isSuperAdmin } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, token, login, logout, setUser } = useAuthStore();
  return {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    setUser,
    isSuperAdmin: isSuperAdmin(user),
  };
};