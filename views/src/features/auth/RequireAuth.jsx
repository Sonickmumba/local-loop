import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }) => {
  const { user, initialized } = useSelector((s) => s.auth);
  const location = useLocation();

  // Wait until session bootstrap finishes
  if (!initialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>; // or a spinner if you prefer
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};
