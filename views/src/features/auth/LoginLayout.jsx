// import { Outlet, useNavigate } from 'react-router-dom';
// import { ImageWithFallback } from './ImageWithFallback';

// import { Link } from 'react-router-dom';

// export const LoginLayout = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl">
//         <div className="text-center mb-12">
//           <div className="text-5xl mb-6">🎉</div>
//           <h1>LocalLoop</h1>
//           <p className="text-xl text-gray-600">Connect with your neighborhood</p>
//         </div>

//         <div className="bg-gray-50 border rounded-lg p-10 mb-10">
//           <ImageWithFallback
//             src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800"
//             className="w-full h-64 object-cover rounded-lg"
//           />
//         </div>

//         <Outlet />

//         <div className="text-center mt-8">
//           <button onClick={() => navigate('signup')} className="mr-4 text-blue-600">
//             Sign up
//           </button>
//           <button onClick={() => navigate('signin')} className="text-blue-600">
//             Sign in
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// this one was workinng okay ======

// import { Outlet, useNavigate } from 'react-router-dom';
// import { ImageWithFallback } from './ImageWithFallback';

// export const LoginLayout = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <div>
//         <Outlet />

//         {/* CTA buttons */}
//         {/* <button
//           onClick={() => navigate('signup')}
//           className="w-full bg-white border-2 border-gray-900 py-4 rounded-lg hover:bg-gray-50 transition-colors mb-6"
//         >
//           GET STARTED TO SIGN UP
//         </button> */}

//         <p className="text-center text-gray-600 mb-8">
//           Already have an account?{' '}
//           <button
//             onClick={() => navigate('signin')}
//             className="text-blue-600 hover:underline"
//           >
//             Sign in →
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };



/*!SECTION this one above was workinng okay ======*/




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
