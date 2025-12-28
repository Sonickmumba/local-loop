// import { useDispatch, useSelector } from 'react-redux';
// import { signinUser, setFormData } from './authSlice';
// import { useNavigate, useLocation } from 'react-router-dom';

// export const SigninScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const formData = useSelector((s) => s.auth.formData);
//   const from = location.state?.from?.pathname || '/phone';

//   const handleChange = (e) => {
//     dispatch(setFormData({ [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(
//       signinUser({ email: formData.email, password: formData.password })
//     );
//     navigate(from, { replace: true });
//   };

//   return (

//     <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="text-5xl mb-4">🎉</div>
//           <h1 className="mb-2">Welcome back</h1>
//           <p className="text-gray-600">Sign in to your LocalLoop account</p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
//         >
//           <div>
//             <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm mb-2 text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               name="password"
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Sign In
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Don't have an account?{' '}
//           <button
//             onClick={() => setView('signup')}
//             className="text-blue-600 hover:underline"
//           >
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>



//   );
// };







import { useDispatch, useSelector } from 'react-redux';
import { signinUser, setFormData } from './authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const SigninScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = useSelector((s) => s.auth.formData);

  const from = location.state?.from?.pathname || '/phone';

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      signinUser({
        email: formData.email,
        password: formData.password,
      })
    );
    navigate(from, { replace: true });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
    >
      <div>
        <label className="block text-sm mb-2 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
};
