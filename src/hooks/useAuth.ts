import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom React hook for consuming and controlling authentication state.
 * Provides a clean interface for screens without exposing raw store internals.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  return {
    user,
    isAuthenticated,
    isLoadingSession,
    login,
    register,
    logout,
    updateProfile,
  };
};
