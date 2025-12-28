// import { useState } from 'react';

// interface LoginSignupScreenProps {
//   onNext: () => void;
// }

// export const LoginSignupScreen = ({ onNext }) => {
//   const [mode, setMode] = useState('signup'); // 'signup' or 'login'
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onNext();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="text-5xl mb-4">🎉</div>
//           <h1 className="mb-2">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
//           <p className="text-gray-600">
//             {mode === 'signup'
//               ? 'Join your neighborhood community'
//               : 'Sign in to continue'}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4">
//           {mode === 'signup' && (
//             <div>
//               <label htmlFor="name" className="block text-sm mb-2 text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}

//           <div>
//             <label htmlFor="email" className="block text-sm mb-2 text-gray-700">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm mb-2 text-gray-700">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             {mode === 'signup' ? 'Sign Up' : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
//           <button
//             onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
//             className="text-blue-600 hover:underline"
//           >
//             {mode === 'signup' ? 'Sign in' : 'Sign up'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';

export const LoginSignupScreen = ({
  formData,
  setFormData,
  view,
  setView,
  handleSubmit,
}) => {
  //   const navigate = useNavigate();
  //   const [view, setView] = useState('landing'); // 'landing', 'signup', 'signin'
  //   const [formData, setFormData] = useState({
  //     name: '',
  //     email: '',
  //     password: '',
  //     neighborhood: '',
  //   });

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     navigate('/phone');
  //     // onLogin();
  //   };

  if (view === 'signin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your LocalLoop account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setView('signup')}
              className="text-blue-600 hover:underline"
            >
              Get started
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="mb-2">Join LocalLoop</h1>
            <p className="text-gray-600">Connect with your neighborhood</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-2 text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email-signup"
                className="block text-sm mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email-signup"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password-signup"
                className="block text-sm mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password-signup"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="neighborhood"
                className="block text-sm mb-2 text-gray-700"
              >
                Neighborhood
              </label>
              <input
                type="text"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    neighborhood: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Downtown, West End"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setView('signin')}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>








    );



  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="mb-4">LocalLoop</h1>
          <p className="text-xl text-gray-600">
            Connect with your neighborhood
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 mb-8 relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop"
            alt="People exchanging services"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-center text-gray-600">
            People exchanging services
          </p>

          <button className="absolute bottom-4 right-4 bg-white px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            Ask 🙋
          </button>
        </div>

        <p className="text-center text-lg text-gray-700 mb-12">
          Trade skills, share goods,
          <br />
          build community
        </p>

        <button
          onClick={() => setView('signup')}
          className="w-full bg-white border-2 border-gray-900 py-4 rounded-lg hover:bg-gray-50 transition-colors mb-6"
        >
          GET STARTED TO SIGNUP
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setView('signin')}
            className="text-blue-600 hover:underline"
          >
            Sign in →
          </button>
        </p>
      </div>
    </div>




  );
};
