import { useSelector } from 'react-redux';

export const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const userId = user?.id;

  return { user, isAuthenticated, userId };
};