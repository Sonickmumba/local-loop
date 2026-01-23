import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const LoginLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSignin = location.pathname.includes('signin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="mb-2">LocalLoop</h1>
          <p className="text-gray-600">
            {isSignin
              ? 'Welcome back to your neighborhood'
              : 'Connect with people around you'}
          </p>
        </div>

        {/* Screen */}
        <Outlet />

        {/* Cross-navigation */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
          {isSignin ? (
            <>
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/signup')}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/signin')}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
